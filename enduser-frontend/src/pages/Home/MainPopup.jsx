import { useState, useEffect } from 'react';
import './MainPopup.css';

const SIGN_FORM_ID = 'sign-form';

export default function MainPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleApply = () => {
    setIsOpen(false);
    const el = document.getElementById(SIGN_FORM_ID);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="main-popup-overlay" onClick={handleClose}>
      <div className="main-popup-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="main-popup-close"
          onClick={handleClose}
          aria-label="닫기"
        >
          ×
        </button>
        <img
          src="/images/main/popup.png"
          alt="팝업"
          className="main-popup-image"
        />
        <button
          type="button"
          className="main-popup-apply-btn"
          onClick={handleApply}
        >
          신청하기
        </button>
      </div>
    </div>
  );
}
