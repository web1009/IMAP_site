// sections/HeroSection/HeroSection.jsx
import { useState } from 'react';
import { heroSlides } from './heroData';
import './HeroSection.css';

export default function HeroSection() {
  const [heroSlide, setHeroSlide] = useState(0);
  const activeSlide = heroSlides[heroSlide];

  return (
    <section className="hero-section">
      {/* Background images */}
      {heroSlides.map((slide, index) => (
        <img
          key={slide.id}
          src={slide.image}
          alt=""
          className={`hero-image ${index === heroSlide ? 'active' : ''}`}
        />
      ))}

      <div className="hero-overlay" />

      {/* Text */}
      <div
        className={`hero-content-wrapper ${activeSlide.id === 1 ? 'center' : ''
          }`}
      >
        <h1 className="hero-title">{activeSlide.title}</h1>
        <p className="hero-description">
          {activeSlide.description.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${heroSlide === index ? 'active' : ''}`}
            onClick={() => setHeroSlide(index)}
          />
        ))}
      </div>

      {/* Infographic bubbles (slide별) */}
      {/* Infographic bubbles (slide별) */}
      {activeSlide.bubbles?.length > 0 && (
        <div className="bubbles">
          {activeSlide.bubbles.map((bubble, index) => (
            <div
              key={bubble.id}
              className={`bubble ${bubble.colorType}`}
              style={{
                top: bubble.top,
                left: bubble.left,
                width: bubble.size,
                height: bubble.size,
                animationDelay: `${index * 0.3}s`
              }}
            >
              <span className="bubble-percent">{bubble.text}</span>
              <span className="bubble-label">{bubble.label}</span>
            </div>
          ))}
        </div>
      )}


      {/* Square boxes effect (m2 only) */}
      {activeSlide.squareBoxes && (
        <div className="square-boxes">
          {activeSlide.squareBoxes.map((box, index) => (
            <div
              key={box.id}
              className={`square-box ${box.colorType}`}
              style={{
                top: box.top,
                left: box.left,
                width: box.size,
                animationDelay: `${index * 0.15}s`
              }}
            >
              <div className="square-content">
                <div className="square-label">{box.label}</div>
                <div className="square-desc">{box.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}



    </section>
  );
}

