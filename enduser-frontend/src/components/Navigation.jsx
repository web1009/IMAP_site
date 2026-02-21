import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navigation.css';
import LoginButtonAndModal from './auth/LoginButtonAndModal';

function Navigation() {
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const blogDropdownRef = useRef(null);
  const portfolioDropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdowns when route changes
  useEffect(() => {
    setBlogDropdownOpen(false);
    setPortfolioDropdownOpen(false);

  }, [location]);

  // Handle scroll to change header style - only on home page
  useEffect(() => {
    if (location.pathname !== '/') {
      setIsScrolled(true);
      return;
    }

    setIsScrolled(false);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (blogDropdownRef.current && !blogDropdownRef.current.contains(event.target)) {
        setBlogDropdownOpen(false);
      }
      if (portfolioDropdownRef.current && !portfolioDropdownRef.current.contains(event.target)) {
        setPortfolioDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={`nav-main ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container">
        <Link className="nav-logo" to="/">
          <img src="/imap.png" alt="IMAP" className="nav-logo-img" />
        </Link>
        <button
          className="nav-toggle"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav-menu"
          aria-controls="nav-menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="nav-toggle-icon"></span>
        </button>
        <div className="nav-menu-collapse" id="nav-menu">
          <ul className="nav-menu-list">
            <li className="nav-menu-item">
              <Link className="nav-menu-link" to="/">홈</Link>
            </li>

            <li className="nav-menu-item">
              <Link className="nav-menu-link" to="/about">센터 안내</Link>
            </li>
            <li className="nav-menu-item">
              <Link className="nav-menu-link" to="/portfolio">프로그램 안내</Link>
            </li>
            <li className="nav-menu-item">
              {/* <Link className="nav-menu-link" to="/contact">예약하기</Link> */}
              <Link className="nav-menu-link" to="/type-select">예약하기</Link>
            </li>

            <li
              className="nav-menu-item nav-dropdown"
              ref={portfolioDropdownRef}
              onMouseEnter={() => setPortfolioDropdownOpen(true)}
              onMouseLeave={() => setPortfolioDropdownOpen(false)}
            >
              <Link className="nav-menu-link nav-dropdown-toggle" to="/notice">
                커뮤니티
              </Link>

              <ul className={`nav-dropdown-menu ${portfolioDropdownOpen ? 'nav-dropdown-show' : ''}`}>
                <li>
                  <Link className="nav-dropdown-item" to="/notice">
                    공지사항
                  </Link>
                </li>
                <li>
                  <Link className="nav-dropdown-item" to="/faq">
                    FAQ
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-menu-item">
              <Link className="nav-menu-link" to="/blog">블로그</Link>
            </li>



            <li className="nav-menu-item">
              <Link 
                className="nav-menu-link" 
                to="/mypage"
                onClick={(e) => {
                  e.preventDefault();
                  if (location.pathname.startsWith('/mypage')) {
                    navigate('/mypage');
                  } else {
                    const last = sessionStorage.getItem('mypage_last_path');
                    navigate(last && last.startsWith('/mypage') ? last : '/mypage');
                  }
                }}
              >
                마이페이지
              </Link>
            </li>
          </ul>
        </div>

        {/* 오른쪽: 로그인/로그아웃 버튼 */}
        <div className="nav-login-area">
          <LoginButtonAndModal />
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
