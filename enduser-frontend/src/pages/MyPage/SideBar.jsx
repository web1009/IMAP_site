import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './SideBar.css';

function SideBar({ activeMenu, onMenuClick }) {
  const location = useLocation();
  const [isMyExerciseOpen, setIsMyExerciseOpen] = useState(true);
  const [isReservationOpen, setIsReservationOpen] = useState(true);

  const isMyPageActive = location.pathname.startsWith('/mypage');

  const handleMenuClick = (menuId) => {
    if (onMenuClick) onMenuClick(menuId);
  };

  return (
    <aside className="mypage-sidebar">
      {/* 나의 운동 섹션 */}
      <div className="sidebar-section">
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <button 
              className="sidebar-menu-button"
              onClick={() => setIsMyExerciseOpen(!isMyExerciseOpen)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>나의 예약</span>
              <span style={{ fontSize: '0.75rem' }}>{isMyExerciseOpen ? '▲' : '▼'}</span>
            </button>
            {isMyExerciseOpen && (
              <ul className="sidebar-submenu">
                <li 
                  className={`sidebar-submenu-item ${isMyPageActive && activeMenu === null ? 'active' : ''}`}
                  onClick={() => handleMenuClick(null)}
                  style={{ cursor: 'pointer' }}
                >
                  예약관리
                </li>
                <li 
                  className={`sidebar-submenu-item ${isMyPageActive && activeMenu === 'review-write' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('review-write')}
                  style={{ cursor: 'pointer' }}
                >
                  리뷰쓰기
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* 예약목록 섹션 */}
      <div className="sidebar-section">
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <button 
              className="sidebar-menu-button"
              onClick={() => setIsReservationOpen(!isReservationOpen)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>예약목록</span>
              <span style={{ fontSize: '0.75rem' }}>{isReservationOpen ? '▲' : '▼'}</span>
            </button>
            {isReservationOpen && (
              <ul className="sidebar-submenu">
                <li
                  className={`sidebar-submenu-item ${isMyPageActive && activeMenu === 'reservations' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('reservations')}
                  style={{ cursor: 'pointer' }}
                >
                  예약내역
                </li>
                <li 
                  className={`sidebar-submenu-item ${isMyPageActive && activeMenu === 'payment-history' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('payment-history')}
                  style={{ cursor: 'pointer' }}
                >
                  결제내역
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default SideBar;

