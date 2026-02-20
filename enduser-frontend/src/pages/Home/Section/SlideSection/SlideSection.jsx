import { useEffect, useRef } from 'react';
import slideData from './slideData';
import './SlideSection.css';

export default function SlideSection() {
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach(el => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="slide-section">
      {/* Header */}
      <div className="slide-header">
        <h2 className="slide-title">USER REVIEWS</h2>
        <p className="slide-description">
          실제 참여자들이 전하는 진솔한 경험을 확인해보세요
        </p>
      </div>

      {/* Cards */}
      <div className="slide-grid">
        {slideData.map((item, index) => (
          <div
            key={item.id}
            ref={el => (cardsRef.current[index] = el)}
            className="slide-card"
          >
            <p className="slide-text">“{item.text}”</p>
            <div className="slide-author">
              <strong>{item.author}</strong>
              <span>{item.info}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
