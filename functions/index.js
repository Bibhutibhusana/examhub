const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

// Simple hash function for shuffling
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(cookieParser());

// Middleware: verify Firebase ID token for endpoints that require auth
async function verifyIdToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer (.*)$/);
  if (!match) return res.status(401).json({ error: 'missing-bearer' });
  const idToken = match[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error('token verify failed', err);
    return res.status(401).json({ error: 'invalid-token' });
  }
}

// Create session: client calls with Firebase ID token
app.post('/createSession', verifyIdToken, async (req, res) => {
  const { examId } = req.body;
  if (!examId) return res.status(400).json({ error: 'missing-examId' });

  try {
    const sessionId = uuidv4();
    const seed = Math.floor(Math.random() * 1e9);
    const expiresAt = admin.firestore.Timestamp.fromMillis(Date.now() + 1000 * 60 * 60); // 1 hour

    const sessionDoc = {
      id: sessionId,
      examId,
      userId: req.user.uid,
      seed,
      status: 'active',
      startAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt,
    };

    await db.collection('sessions').doc(sessionId).set(sessionDoc);

    // create a short-lived session token (simple approach: use custom token with limited claims)
    // For demo we reuse ID token; in production create a dedicated signed JWT
    const sessionToken = idTokenPlaceholder();

    return res.json({ id: sessionId, sessionToken, seed, expiresAt: expiresAt.toDate().toISOString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal' });
  }
});

// Questions endpoint: returns limited question payloads
app.get('/sessions/:sessionId/questions', async (req, res) => {
  const sessionId = req.params.sessionId;
  const sdoc = await db.collection('sessions').doc(sessionId).get();
  if (!sdoc.exists) return res.status(404).json({ error: 'session-not-found' });
  const s = sdoc.data();

  // fetch exam questions (only public fields)
  const qSnap = await db.collection('questions').where('examId', '==', s.examId).get();
  const qs = [];
  qSnap.forEach(d => {
    const data = d.data();
    qs.push({ id: d.id, text: data.text, options: data.options || null, type: data.type || 'mcq' });
  });

  // Apply deterministic shuffle using s.seed
  const shuffledQs = qs.sort((a, b) => {
    const hashA = hashString(a.id + s.seed);
    const hashB = hashString(b.id + s.seed);
    return hashA - hashB;
  });

  return res.json(shuffledQs);
});

// Save answers
app.post('/sessions/:sessionId/answers', async (req, res) => {
  const sessionId = req.params.sessionId;
  const { answers, autosave = true } = req.body || {};
  if (!answers) return res.status(400).json({ error: 'missing-answers' });
  const sRef = db.collection('sessions').doc(sessionId);
  const sdoc = await sRef.get();
  if (!sdoc.exists) return res.status(404).json({ error: 'session-not-found' });

  const batch = db.batch();
  const responsesRef = sRef.collection('responses');
  Object.keys(answers).forEach(qid => {
    const r = answers[qid];
    const id = qid; // keep questionId as doc id
    batch.set(responsesRef.doc(id), { questionId: qid, value: r.value, savedAt: admin.firestore.FieldValue.serverTimestamp(), autosave });
  });

  await batch.commit();
  await sRef.update({ lastSavedAt: admin.firestore.FieldValue.serverTimestamp() });
  return res.json({ ok: true });
});

// Submit session
app.post('/sessions/:sessionId/submit', async (req, res) => {
  const sessionId = req.params.sessionId;
  const sRef = db.collection('sessions').doc(sessionId);
  const sdoc = await sRef.get();
  if (!sdoc.exists) return res.status(404).json({ error: 'session-not-found' });

  // atomic update: mark submitted and queue grading
  await sRef.update({ status: 'submitted', submittedAt: admin.firestore.FieldValue.serverTimestamp() });

  // In production we would enqueue grading job; for demo run a simple auto-grade
  // Here we just return success and leave grading to later process
  return res.json({ ok: true });
});

function idTokenPlaceholder() {
  // In this scaffold we return a placeholder. Replace with a signed JWT or a short-lived custom token.
  return 'session-token-placeholder';
}

exports.api = functions.https.onRequest(app);
