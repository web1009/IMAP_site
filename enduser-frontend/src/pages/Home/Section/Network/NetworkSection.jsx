// src/pages/Section/Network/NetworkSection.jsx

import networkData from './networkData';
import './NetworkSection.css';

export default function NetworkSection() {
  const data = networkData[0];

  return (
    <section className="network-section">
      <div className="network-header">
        <span className="network-en">{data.en}</span>
        <h2 className="network-title">{data.title}</h2>
        <p className="network-desc">{data.desc}</p>
      </div>

      <div className="network-container">
        {data.programs.map((program, index) => (
          <div className="network-card" key={index}
          style={{ backgroundImage: `url(${program.bg})` }}>
            {/* 기본 상태 */}
            <div className="network-card-front">
              <span className="network-card-title">{program.title}</span>
            </div>

            {/* hover 상태 */}
            <div className="network-card-back">
              <span className="network-card-en">{program.en}</span>
              <p className="network-card-desc">{program.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
