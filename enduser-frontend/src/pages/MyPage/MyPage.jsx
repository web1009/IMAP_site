import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SideBar from "./SideBar";
import '../../components/auth/modalStyles.css';
import './MyPage.css';


import ReviewWriteSection from './ReviewWriteSection';
import PaymentHistorySection from './PaymentHistorySection';
import AttendanceSection from './AttendanceSection';
import ProfileSection from './ProfileSection';
import ReservationsSection from './ReservationsSection';

// URL 기반 메뉴: /mypage, /mypage/usage-history, /mypage/review-write 등
function getActiveMenuFromPath(pathname) {
  if (pathname === '/mypage' || pathname === '/mypage/') return null;
  const m = pathname.match(/^\/mypage\/([^/]+)/);
  return m ? m[1] : null;
}

function MyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeMenu = getActiveMenuFromPath(location.pathname);

  const setActiveMenu = (menu) => {
    const path = menu ? `/mypage/${menu}` : '/mypage';
    navigate(path);
    try {
      sessionStorage.setItem('mypage_last_path', path);
    } catch {}
  };

  useEffect(() => {
    if (location.pathname.startsWith('/mypage')) {
      try {
        sessionStorage.setItem('mypage_last_path', location.pathname);
      } catch {}
    }
  }, [location.pathname]);

  const [reviewTab, setReviewTab] = useState('written'); // 'written' (작성한 리뷰만 표시)
  const [refreshKey, setRefreshKey] = useState(0); // 리뷰 작성 후 새로고침을 위한 키

  // Redux에서 로그인한 사용자 정보 가져오기
  const userName = useSelector((state) => state.auth.userName);

  // 나의 정보 수정 상태 (프로필 섹션용)
  const [userInfo, setUserInfo] = useState({
    name: userName || '',
    email: '',
    phone: '',
    address: ''
  });

  // userName이 변경될 때 userInfo 업데이트
  useEffect(() => {
    if (userName) {
      setUserInfo(prev => ({
        ...prev,
        name: userName
      }));
    }
  }, [userName]);

  // 모든 섹션 항상 렌더 + display로 숨김 → 메뉴 전환해도 언마운트 없이 상태 유지
  const showAttendance = activeMenu === null;
  const showProfile = activeMenu === null;
  const showReviewWrite = activeMenu === 'review-write';
  const showPaymentHistory = activeMenu === 'payment-history';
  const showReservations = activeMenu === 'reservations';

  return (
    <>
      <Helmet>
        <title>FITNEEDS - 마이페이지</title>
        <meta name="description" content="IMAP - 마이페이지" />
      </Helmet>

      <div className="mypage-container">
        <SideBar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

        <main className="mypage-main">
          {/* 프로필: 메인(나의 운동)일 때만 */}
          {showProfile && (
            <ProfileSection
              userName={userName}
              userInfo={userInfo}
              onMenuClick={setActiveMenu}
            />
          )}

          {/* 모든 섹션 항상 마운트, display로 표시 여부만 제어 */}
          <div style={{ display: showAttendance ? 'block' : 'none' }}>
            <AttendanceSection isVisible={showAttendance} />
          </div>
          <div style={{ display: showReviewWrite ? 'block' : 'none' }}>
            <ReviewWriteSection reviewTab={reviewTab} setReviewTab={setReviewTab} isVisible={showReviewWrite} />
          </div>
          <div style={{ display: showPaymentHistory ? 'block' : 'none' }}>
            <PaymentHistorySection isVisible={showPaymentHistory} />
          </div>
          <div style={{ display: showReservations ? 'block' : 'none' }}>
            <ReservationsSection isVisible={showReservations} />
          </div>
        </main>
      </div>
    </>
  );
}

export default MyPage;
