import React, { useEffect, useState, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import examApi from '../utils/examApi';

// Minimal ExamPlayer component
export default function ExamPlayer({ examId }) {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('idle');
  const [examData, setExamData] = useState(null);
  const autosaveRef = useRef(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => setUser(u));
    return () => unsub();
  }, [auth]);

  useEffect(() => {
    if (!examId) return;
    // Fetch exam metadata to get questions path
    (async () => {
      try {
        const db = getFirestore();
        const examDoc = await getDoc(doc(db, 'exams', examId));
        if (examDoc.exists()) {
          setExamData(examDoc.data());
        }
      } catch (err) {
        console.error('Error fetching exam data:', err);
      }
    })();
  }, [examId]);

  useEffect(() => {
    if (!session || !examData) return;
    // fetch questions after session created
    (async () => {
      setStatus('loadingQuestions');
      try {
        const q = await examApi.fetchQuestions(session.id, session.sessionToken, examData.questionsPath);
        setQuestions(q);
        setStatus('ready');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    })();
  }, [session, examData]);

  useEffect(() => {
    // autosave every 8 seconds
    if (status !== 'ready') return;
    autosaveRef.current = setInterval(() => {
      autosave();
    }, 8000);
    return () => clearInterval(autosaveRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, answers]);

  async function startExam() {
    if (!user) {
      setStatus('auth-required');
      return;
    }

    setStatus('starting');
    try {
      const token = await user.getIdToken();
      const res = await examApi.createSession(examId, token);
      setSession(res);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  async function autosave() {
    if (!session) return;
    try {
      await examApi.saveAnswers(session.id, session.sessionToken, answers, true);
      // optionally set a last-saved timestamp in state
    } catch (err) {
      console.warn('autosave failed', err);
    }
  }

  function onAnswer(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: { value, savedAt: Date.now() } }));
  }

  async function submit() {
    if (!session) return;
    setStatus('submitting');
    try {
      await examApi.saveAnswers(session.id, session.sessionToken, answers, false);
      const res = await examApi.submitSession(session.id, session.sessionToken);
      setStatus('submitted');
      console.log('submit response', res);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  if (!user) {
    return (
      <div>
        <p>Please sign in to start the exam.</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div>
        <h2>Exam: {examId}</h2>
        <button onClick={startExam}>Start Exam</button>
        <p>Status: {status}</p>
      </div>
    );
  }

  if (status === 'loadingQuestions') return <p>Loading questions…</p>;
  if (status === 'error') return <p>There was an error. Try again.</p>;

  return (
    <div>
      <h3>Exam session: {session.id}</h3>
      <div>Time remaining: (server-synced)</div>
      <div>
        {questions.map(q => (
          <div key={q.id} style={{ border: '1px solid #ddd', padding: 12, margin: 8 }}>
            <div>{q.question}</div>
            {q.options && q.options.map((opt, i) => (
              <div key={i}>
                <label>
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id]?.value === opt}
                    onChange={() => onAnswer(q.id, opt)}
                  />
                  {opt}
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={submit}>Submit Exam</button>
      <p>Status: {status}</p>
    </div>
  );
}
