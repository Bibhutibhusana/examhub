export default function Skills() {
  const skills = [
    { name: "Angular" },
    { name: "React" },
    { name: "Node.js" },
    { name: "Spring Boot" },
    { name: "REST APIs" },
    { name: "UI/UX" },
  ];

  return (
    <section id="skills">
      <div className="responsive-container">
        <h2>My Skills</h2>
        <ul className="skills-list">
          {skills.map((skill) => (
            <li key={skill.name} className="skill-item">
              {skill.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
