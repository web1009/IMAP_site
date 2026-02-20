// src/pages/Section/BrandSection/BrandSection.jsx
import { useEffect, useRef, useState } from 'react';
import brandData from './brandData';
import './BrandSection.css';

export default function BrandSection() {
  const refs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.dataset.index));
          }
        });
      },
      { threshold: 0.4 }
    );

    refs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="brand-section">
      {brandData.map((brand, index) => (
        <div
          key={brand.id}
          ref={el => (refs.current[index] = el)}
          data-index={index}
          className={`brand-card ${activeIndex === index ? 'active' : ''
            }`}
        >
          <div className="brand-content">
            <div className="brand-text">
              <span className="brand-en">{brand.en}</span>
              <h3>{brand.title}</h3>
              <p className="brand-desc">{brand.desc}</p>

              <div className="timeline-indicator">
                <span className="timeline-arrow"></span>
              </div>

              <ul>
                {brand.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="brand-image"
               style={{ backgroundImage: `url(${brand.bg})` }}>
            </div>
          </div>

        </div>
      ))}
    </section>
  );
}

