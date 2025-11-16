# ExamPlayer scaffold (minimal)

This scaffold adds a minimal `ExamPlayer` React component and a Firebase Cloud Functions API to demonstrate basic exam lifecycle endpoints: createSession, fetchQuestions, saveAnswers, submit.

Files added
- `src/components/ExamPlayer.jsx` — minimal React component that starts a session and autosaves answers
- `src/utils/examApi.js` — small client-side API helper
- `functions/index.js` — Express app exported as `api` Cloud Function
- `functions/package.json` — dependencies for functions

Quick local run (recommended via Firebase emulator):

1. Install dependencies for functions

```cmd
cd "e:\MY Projects\examhub\functions"
npm install
```

2. Start Firebase emulators (if you have Firebase CLI installed and configured):

```cmd
cd "e:\MY Projects\examhub"
firebase emulators:start --only functions,firestore,auth
```

3. Serve your React app (Vite) as usual (from repo root):

```cmd
npm run dev
```

Notes
- The functions scaffold uses a placeholder session token; replace `idTokenPlaceholder()` in `functions/index.js` with a proper signed short-lived token for production.
- Questions are read from Firestore collection `questions`. Add sample documents to test the flow.
- Tighten Firestore security rules before deploying to production.
