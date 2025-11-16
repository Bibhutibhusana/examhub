import React from 'react';
import '../css/Contact.css';

export default function Contact() {
  return (
    <section id="contact" className="contact-section">
        <div className="responsive-container">
      <h2>Contact Me</h2>
      <p>
        I'm open to freelance work or full-time opportunities. Feel free to reach out!
      </p>

      <div className="contact-details">
        <p><strong>Email:</strong> <a href="mailto:youremail@example.com">legendbibhu@gmail.com</a></p>
        <p><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/bibhutibhusana-sahani-8815271b7/" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/in/bibhutibhusana-sahani-8815271b7/</a></p>
        <p><strong>GitHub:</strong> <a href="https://github.com/Bibhutibhusana" target="_blank" rel="noopener noreferrer">https://github.com/Bibhutibhusana</a></p>
      </div>

      {/* Optional: add a contact form here later */}
      </div>
    </section>
  );
}
