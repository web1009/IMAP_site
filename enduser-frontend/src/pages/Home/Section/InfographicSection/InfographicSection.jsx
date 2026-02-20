import './InfographicSection.css';
import { introContent, infographicCards } from './infographicData';

export default function InfographicSection() {
  return (
    <section className="infographic-section">
      <div className="infographic-layout">

        {/* LEFT TEXT */}
        <div className="infographic-text">
          <h2>{introContent.title}</h2>
          <p>{introContent.desc}</p>
        </div>

        {/* RIGHT GRID */}
        <div className="infographic-wrapper">
          <div className="infographic-grid">
            {infographicCards.map((card, index) => (
              <div
                key={card.id}
                className="infographic-box"
                style={{
                  animationDelay: `${index * 0.15}s`,
                  backgroundImage: `url(${card.bg})`
                }}
              >

                <h4 className="infographic-value">{card.title}</h4>
                <p className="infographic-label">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}



