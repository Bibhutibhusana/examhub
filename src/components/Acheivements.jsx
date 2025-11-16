import React from "react";
import { BadgeCheck } from "lucide-react";
import "../css/Acheivements.css"; // custom CSS file

export default function Acheivements() {
  const certifications = [
    { name: "Problem Solving Basic", link: "https://www.hackerrank.com/certificates/f337dd20ea46" },
    { name: "Java Basic", link: "https://www.hackerrank.com/certificates/ede2540abaf8" },
    { name: "Python Basic", link: "https://www.hackerrank.com/certificates/b62f56e1dc7d" },
    { name: "Java Script Basic", link: "https://www.hackerrank.com/certificates/955608ecfc8c" },
    { name: "Angular Basic", link: "https://www.hackerrank.com/certificates/a188d8d72933" },
    { name: "React Basic", link: "https://www.hackerrank.com/certificates/3b21ea39f5b5" },
    { name: "SQL Basic", link: "https://www.hackerrank.com/certificates/e87304110a9b" },
    { name: "Angular Intermediate", link: "https://www.hackerrank.com/certificates/fc639cee0441" },
    { name: "SQL Intermediate", link: "https://www.hackerrank.com/certificates/iframe/5ad1a4eeb215" },
    { name: "Software Engineer Intern", link: "https://www.hackerrank.com/certificates/0723021874fc" },


  ];

  return (
    <section id="acheivements" className="acheivements-section">
      <h2 className="acheivements-title">
        Acheivements
      </h2>

      <div className="cert-grid">
        {certifications.map((cert, index) => (
          <a
            key={index}
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            className="cert-card"
          >
            <BadgeCheck className="cert-icon" />
            <span>{cert.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
