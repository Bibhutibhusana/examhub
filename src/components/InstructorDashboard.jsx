import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function InstructorDashboard() {
  const [exams, setExams] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const db = getFirestore();
    const unsubAuth = auth.onAuthStateChanged(user => {
      if (!user) return setExams([]);
      const q = query(collection(db, 'exams'), where('ownerId', '==', user.uid));
      const unsub = onSnapshot(q, snap => {
        const rows = [];
        snap.forEach(d => rows.push({ id: d.id, ...d.data() }));
        setExams(rows);
      });
      return () => unsub();
    });
    return () => unsubAuth();
  }, [auth]);

  return (
    <div className="exam-ui instructor-dashboard">
      <h2>Your Exams</h2>
      <div className="exam-list">
        {exams.map(e => (
          <div className="exam-card" key={e.id}>
            <h4>{e.title}</h4>
            <div>Duration: {e.durationSeconds ? `${e.durationSeconds / 60} mins` : '—'}</div>
            <div>Published: {e.published ? 'yes' : 'no'}</div>
          </div>
        ))}
        {exams.length === 0 && <p>No exams yet. Create one below.</p>}
      </div>
    </div>
  );
}
