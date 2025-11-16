import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function ExamCreate() {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [published, setPublished] = useState(false);
  const [selectedClass, setSelectedClass] = useState('class10');
  const [examType, setExamType] = useState('practice');
  const auth = getAuth();

  async function createExam(e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return alert('Sign in required');

    // Create exam metadata in Firestore
    const db = getFirestore();
    const doc = await addDoc(collection(db, 'exams'), {
      title,
      ownerId: user.uid,
      durationSeconds: duration * 60,
      published,
      selectedClass,
      examType,
      questionsPath: `/src/assets/exam/${selectedClass}/${examType}/questions.json`,
      createdAt: new Date().toISOString()
    });

    setTitle('');
    setDuration(30);
    setPublished(false);
    setSelectedClass('class10');
    setExamType('practice');
    alert('Exam created: ' + doc.id);
  }

  return (
    <form className="exam-ui exam-create" onSubmit={createExam}>
      <h3>Create Exam</h3>
      <label>
        Title
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </label>
      <label>
        Class
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
          <option value="class10">Class 10</option>
          <option value="class11">Class 11</option>
          <option value="class12">Class 12</option>
        </select>
      </label>
      <label>
        Exam Type
        <select value={examType} onChange={e => setExamType(e.target.value)}>
          <option value="practice">Practice</option>
          <option value="mock">Mock</option>
          <option value="final">Final</option>
        </select>
      </label>
      <label>
        Duration (minutes)
        <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={5} />
      </label>
      <label>
        Published
        <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
      </label>
      <button type="submit">Create</button>
    </form>
  );
}
