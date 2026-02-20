import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/common.css';


// Components
import Layout from './components/Layout';
import { MyPageDataProvider } from './context/MyPageDataContext';

// Pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import FAQ from './pages/FAQ/FAQ';
import BlogHome from './pages/BlogHome/BlogHome';
import BlogPost from './pages/BlogHome/BlogPost';
import PortfolioOverview from './pages/PortfolioOverview/PortfolioOverview';
import PortfolioItem from './pages/PortfolioItem/PortfolioItem';
import NoticeUserPage from "./pages/Notice/NoticeUserPage";
import TypeSelect from './pages/ToReservation/TypeSelect/TypeSelect';
import ScheduleListPage from './pages/ToReservation/ScheduleListPage/ScheduleListPage';
import ProgramDetailPage from './pages/ToReservation/ProgramDetailPage/ProgramDetailPage';
import PaymentForReservation from './pages/ToReservation/Payment/PaymentForReservation';
import ReservationComplete from './pages/ToReservation/ReservationComplete/ReservationComplete';


function App() {
  useEffect(() => {
    // Load Bootstrap JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <HelmetProvider>
      <MyPageDataProvider>
        <Router>
          <Layout>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<BlogHome />} />
            <Route path="/blog/post/:id" element={<BlogPost />} />
            <Route path="/portfolio" element={<PortfolioOverview />} />
            <Route path="/portfolio/item" element={<PortfolioItem />} />
            <Route path="/notice" element={<NoticeUserPage />} />
            <Route path="/type-select" element={<TypeSelect />} />
            <Route path="/schedule-list" element={<ScheduleListPage />} />
            <Route path="/program-detail" element={<ProgramDetailPage/>} />
            <Route path="/payment-reservation" element={<PaymentForReservation/>} />
            <Route path="/reservation-complete" element={<ReservationComplete/>} />
            {/* 마이페이지: Layout에서 항상 MyPage 렌더 */}
            <Route path="/mypage/*" element={null} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </Layout>
        </Router>
      </MyPageDataProvider>
    </HelmetProvider>
  );
}

export default App;

