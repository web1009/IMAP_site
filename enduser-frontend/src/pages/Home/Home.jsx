// src/pages/Home.jsx
import { Helmet } from 'react-helmet-async';

import MainPopup from './MainPopup';
import HeroSection from './Section/HeroSection/HeroSection';
import InfographicSection from './Section/InfographicSection/InfographicSection';
import BrandSection from './Section/BrandSection/BrandSection';
import FitSignalSection from './Section/FitSignalSection/FitSignalSection';
import NetworkSection from './Section/Network/NetworkSection';
import BannerSection from './Section/BannerSection/BannerSection';
import SlideSection from './Section/SlideSection/SlideSection';
import SignSection from './Section/SignSection/SignSection';
import NewsSection from './Section/NewsSection/NewsSection';
import './Home.css';

export default function Home() {
  return (
    <>
      <MainPopup />
      <Helmet>
        <title>IMAP - 메인</title>
        <meta name="description" content="FITNEEDS - 원하는 지역의 쉽고 빠른 예약 가능" />
      </Helmet>

      <HeroSection />
      <InfographicSection />
      <BrandSection />
      <FitSignalSection />
      <NetworkSection />
      <BannerSection />
      <SlideSection />
      <NewsSection />
      <SignSection />
    </>
  );
}
