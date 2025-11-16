import React, { useEffect, useState } from 'react';

export default function PreExamCheck({ onComplete }) {
  const [cameraOk, setCameraOk] = useState(null);
  const [micOk, setMicOk] = useState(null);
  const [networkOk, setNetworkOk] = useState(true);

  useEffect(() => {
    async function checkMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraOk(true);
        stream.getTracks().forEach(t => t.stop());
      } catch (e) {
        setCameraOk(false);
      }

      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicOk(true);
        s.getTracks().forEach(t => t.stop());
      } catch (e) {
        setMicOk(false);
      }
    }
    checkMedia();

    // simple network check
    fetch('https://www.google.com', { mode: 'no-cors' }).catch(() => setNetworkOk(false));
  }, []);

  const ready = cameraOk !== null && micOk !== null && networkOk;

  return (
    <div className="exam-ui precheck">
      <h3>Pre-Exam System Check</h3>
      <ul>
        <li>Camera: {cameraOk === null ? 'Checking…' : cameraOk ? 'OK' : 'No access'}</li>
        <li>Microphone: {micOk === null ? 'Checking…' : micOk ? 'OK' : 'No access'}</li>
        <li>Network: {networkOk ? 'OK' : 'Offline / unstable'}</li>
      </ul>
      <p>Please consent to camera recording for proctoring if required.</p>
      <div className="precheck-actions">
        <button disabled={!ready} onClick={() => onComplete({ cameraOk, micOk, networkOk })}>Proceed to exam</button>
      </div>
    </div>
  );
}
