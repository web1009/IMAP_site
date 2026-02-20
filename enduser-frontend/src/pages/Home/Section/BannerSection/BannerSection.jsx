import { useState, useEffect } from 'react';
import './BannerSection.css';
import bannerData from './bannerData';

export default function BannerSection() {
  const { en, title, desc, bg } = bannerData;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSignForm = () => {
    const signSection = document.getElementById('sign-form');
    if (signSection) {
      signSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      className="banner-section"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="banner-overlay">
        <div className="banner-content">
          <h2 className={`banner-title ${isVisible ? 'animate-title' : ''}`}>
            {title}
          </h2>
        </div>
        <button 
          className={`banner-signup-btn ${isVisible ? 'animate-btn' : ''}`}
          onClick={scrollToSignForm}
        >
          {desc}
        </button>
      </div>
    </section>
  );
}

