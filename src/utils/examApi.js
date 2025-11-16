const API_BASE = '/__/functions'; // default Firebase Functions rewrite when deployed; override in env as needed

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin'
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`);
  return res.json();
}

export default {
  createSession: (examId, idToken) => request(`/createSession`, { method: 'POST', body: { examId }, token: idToken }),
  fetchQuestions: (sessionId, sessionToken) => request(`/sessions/${sessionId}/questions`, { method: 'GET', token: sessionToken }),
  saveAnswers: (sessionId, sessionToken, answers, autosave = true) => request(`/sessions/${sessionId}/answers`, { method: 'POST', body: { answers, autosave }, token: sessionToken }),
  submitSession: (sessionId, sessionToken) => request(`/sessions/${sessionId}/submit`, { method: 'POST', token: sessionToken }),
};
