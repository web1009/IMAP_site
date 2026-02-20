import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import MyPage from '../pages/MyPage/MyPage';
import './Layout.css';

function Layout({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isMyPage = location.pathname.startsWith('/mypage');

  return (
    <div className="layout-wrapper">
      <div className="layout-header">
        <Navigation />
      </div>

      <main className={`layout-main ${isHomePage && !isMyPage ? 'layout-main-home' : ''}`}>
        {/* 일반 페이지: 마이페이지가 아니면 표시 */}
        <div style={{ display: isMyPage ? 'none' : 'block' }}>
          {children}
        </div>
        {/* 마이페이지: 항상 마운트, 다른 페이지 갔다 와도 내용 유지 */}
        <div style={{ display: isMyPage ? 'block' : 'none' }}>
          <MyPage />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Layout;

