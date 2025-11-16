import React from 'react';
import "../css/Footer.css";
function Footer() {
  return (
    <footer style={{
      backgroundColor: '#333',
      color: '#fff',
      padding: '1rem',
      textAlign: 'center',
    }} className='footer'>
      <p>© {new Date().getFullYear()} LegendBibhu. All rights reserved.</p>
      <p>
        <a href="https://github.com/Bibhutibhusana" target="_blank" rel="noopener noreferrer" style={{ color: '#61dafb' }}>GitHub</a> |{' '}
        <a href="https://www.linkedin.com/in/bibhutibhusana-sahani-8815271b7/" target="_blank" rel="noopener noreferrer" style={{ color: '#61dafb' }}>LinkedIn</a>
      </p>
    </footer>
  );
}

export default Footer;
