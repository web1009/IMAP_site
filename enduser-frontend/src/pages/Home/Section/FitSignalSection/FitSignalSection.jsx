import fitData from "./fitData";
import "./FitSignalSection.css";

export default function FitSignalSection() {
  const data = fitData[0];

  return (
    <section className="fit-section">
      <div className="fit-header">
        <span className="fit-en">{data.en}</span>
        <h2 className="fit-title">{data.title}</h2>
        <p className="fit-desc">{data.desc}</p>
      </div>

      <div className="fit-container">
        {data.programs.map((p, i) => (
          <div
            className="fit-card"
            key={i}
            style={{ backgroundImage: `url(${p.bg})` }}
          >
            {/* 기본 상태 */}
            <div className="fit-card-front">
              <span className="fit-card-title">{p.title}</span>
            </div>

            {/* hover 상태 */}
            <div className="fit-card-back">
              <span className="fit-card-en">{p.en}</span>
              <p className="fit-card-desc">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}



