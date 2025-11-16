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

// Function to load questions from local assets
async function loadQuestionsFromAssets(questionsPath) {
  try {
    const response = await fetch(questionsPath);
    if (!response.ok) {
      throw new Error(`Failed to load questions: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading questions from assets:', error);
    throw error;
  }
}

export default {
  createSession: (examId, idToken) => request(`/createSession`, { method: 'POST', body: { examId }, token: idToken }),
  fetchQuestions: async (sessionId, sessionToken, questionsPath) => {
    // First try to load from local assets
    if (questionsPath) {
      try {
        return await loadQuestionsFromAssets(questionsPath);
      } catch (error) {
        console.warn('Failed to load from assets, falling back to API:', error);
      }
    }
    // Fallback to API
    return request(`/sessions/${sessionId}/questions`, { method: 'GET', token: sessionToken });
  },
  saveAnswers: (sessionId, sessionToken, answers, autosave = true) => request(`/sessions/${sessionId}/answers`, { method: 'POST', body: { answers, autosave }, token: sessionToken }),
  submitSession: (sessionId, sessionToken) => request(`/sessions/${sessionId}/submit`, { method: 'POST', token: sessionToken }),
};
