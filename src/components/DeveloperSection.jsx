import dev1 from "../assets/images/developer.png";
import dev2 from "../assets/images/developer.png";

export default function DeveloperSection() {
  const developers = [
    {
      name: "Romit Raman",
      role: "24BIT0558",
      image: dev1,
      email:"romit.raman2024@vitstudent.ac.in",
      desc: "CGPA: 8.68",

    },
    {
      name: "Aniket Agrawal",
      role:"24BIT0533",
      image: dev2,
      email:"aniket.agrawal2024@vitstudent.ac.in",
      desc: "CGPA: 9.34",
    },
  ];

  return (
    <section className="developer-section">
      <div className="developer-container">
        <h2 className="section-title">Meet The Developers</h2>

        <div className="developer-grid">
          {developers.map((dev, index) => (
            <div key={index} className="developer-card">

              <img src={dev.image} alt={dev.name} />

              <h3>{dev.name}</h3>
              <p className="developer-role">{dev.role}</p>
            <p className="developer-role">{dev.email}</p>
              <p className="developer-desc">{dev.desc}</p>

              <div className="developer-links">
                <a href="#">LinkedIn</a>
                <a href="#">GitHub</a>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
