import React from "react";
import proj2 from "../assets/e-nirikshana_.png";
import evc from "../assets/evcell.png";
import ed from "../assets/edetection.png";
import gnext from "../assets/gnext.png";
import "../css/Projects.css";

const projectList = [
  {
    title: "eDetection Portal",
    image: ed,
    description:
      "A government portal for vehicle compliance and road safety, built using Angular and Spring Boot.",
    tech: ["Angular", "Spring Boot", "REST APIs"],
    demo: "https://vahan.parivahan.gov.in/eDetection",
  },
  {
    title: "EV Subsidy Portal",
    image: evc,
    description:
      "Form-based web app for EV subsidy applications with dynamic PDF generation.",
    tech: ["Angular", "TypeScript", "Material UI"],
    demo: "https://odtransoprtmis.nic.in/EVCell",
  },
  {
    title: "e Nirikshana",
    image: proj2,
    description:
      "Automated vehicle fitness testing portal ensuring transparency and accountability.",
    tech: ["JSF", "Spring Boot"],
    demo: "http://odtransportmis.nic.in/fcservice/",
  },
  {
    title: "GNext",
    image: gnext,
    description:
      "Clinical research management solutions to protect and improve human life.",
    tech: ["React", "TypeScript", "Bootstrap"],
    demo: "https://gnext.org.in/",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="projects-section">
      <div className="responsive-container">
        <h2>Projects</h2>
        <div className="projects-grid">
          {projectList.map((project, index) => (
            <div key={index} className="project-card">
              <img
                src={project.image}
                alt={project.title}
                className="project-img"
              />
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p className="tech-stack">
                  {project.tech.join(" • ")}
                </p>
                <div className="project-links">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
