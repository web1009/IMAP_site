import React from 'react';
import { Link } from 'react-router-dom';

function ProfileSection({ userName, userInfo, onMenuClick }) {
  return (
    <section className="mypage-profile-section">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <img src="/images/user.jpg" alt="프로필" className="avatar-image" />
          </div>
        </div>
        <div className="profile-info">
          <div className="profile-name">{localStorage.getItem('userName') } 님</div>
          <div className="profile-email">{userInfo.email}</div>
        </div>
      </div>

      <div className="profile-quick-links">
        <Link
          to="/mypage/reservations"
          className="quick-link-item"
        >
          <div className="quick-link-icon">
            <i className="bi bi-calendar-check"></i>
          </div>
          <div className="quick-link-label">예약목록</div>
        </Link>
        <div
          className="quick-link-item"
          onClick={() => onMenuClick('usage-history')}
          style={{ cursor: 'pointer' }}
        >
          <div className="quick-link-icon">
            <i className="bi bi-wallet2"></i>
          </div>
          <div className="quick-link-label">이용내역</div>
        </div>
        <div
          className="quick-link-item"
          onClick={() => onMenuClick('review-write')}
          style={{ cursor: 'pointer' }}
        >
          <div className="quick-link-icon">
            <i className="bi bi-pencil-square"></i>
          </div>
          <div className="quick-link-label">리뷰</div>
        </div>
        <div
          className="quick-link-item"
          onClick={() => onMenuClick('inquiry')}
          style={{ cursor: 'pointer' }}
        >
          <div className="quick-link-icon">
            <i className="bi bi-question-circle"></i>
          </div>
          <div className="quick-link-label">문의</div>
        </div>
      </div>
    </section>
  );
}

export default ProfileSection;

