import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './PortfolioOverview.css';
import {
  PAGE_META,
  HERO,
  STEP_FLOW,
  STEP_HEADING,
  CONSULTING_TITLE,
  CONSULTING_CARDS,
  EDUCATION_TITLE,
  EDUCATION_ITEMS,
  NETWORK_TITLE,
  NETWORK_ITEMS,
  BEFORE_AFTER,
  CTA,
} from './portfolioData';

export default function PortfolioOverview() {
  return (
    <>
      <Helmet>
        <title>{PAGE_META.title}</title>
        <meta name="description" content={PAGE_META.description} />
      </Helmet>

      {/* ① Hero */}
      <section className="guide-hero">
        <div className="guide-hero-inner">
          <h1 className="guide-hero-title">{HERO.title}</h1>
          <p className="guide-hero-desc">{HERO.desc}</p>
          <Link to="/#sign-form" className="guide-cta-btn guide-cta-btn-primary">
            {HERO.ctaText}
          </Link>
        </div>
      </section>

      {/* ② Step Flow */}
      <section className="guide-step">
        <div className="guide-container">
          <div className="guide-step-alert">
            <p className="guide-step-heading">{STEP_HEADING}</p>
            <div className="guide-step-flow">
              {STEP_FLOW.map((step, i) => (
                <React.Fragment key={step.label}>
                  <div className="guide-step-item">
                    <span className="guide-step-icon"><i className={`bi ${step.icon}`} /></span>
                    <span className="guide-step-label">{step.label}</span>
                  </div>
                  {i < STEP_FLOW.length - 1 && <span className="guide-step-arrow" aria-hidden>→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Program Process - 1번 이미지 (흰 배경) */}
          <div className="guide-step-info-wrapper">
            <img
              src="/images/program/info2.png"
              alt="Program process detail 1"
              className="guide-step-info-image"
            />
          </div>
        </div>

        {/* Program Process - 2번 이미지 (페이지 전체 그레이 배경) */}
        <div className="guide-step-info-band">
          <div className="guide-container">
            <div className="guide-step-info-wrapper">
              <img
                src="/images/program/info.png"
                alt="Program process detail 2"
                className="guide-step-info-image"
              />
            </div>
          </div>
        </div>

        {/* Program Process - 3번 이미지 (흰 배경) */}
        <div className="guide-container">
          <div className="guide-step-info-wrapper">
            <img
              src="/images/program/info3.png"
              alt="Program process detail 3"
              className="guide-step-info-image"
            />
          </div>
        </div>
      </section>

      {/* ③ Consulting */}
      <section className="guide-section guide-consulting">
        <div className="guide-container">
          <h2 className="guide-section-title">
            <span className="guide-section-icon">
              {CONSULTING_TITLE.iconSrc ? (
                <img
                  src={CONSULTING_TITLE.iconSrc}
                  alt={CONSULTING_TITLE.text}
                  className="guide-section-icon-img"
                />
              ) : (
                CONSULTING_TITLE.icon
              )}
            </span>
            {CONSULTING_TITLE.text}
          </h2>
          <div className="guide-card-grid">
            {CONSULTING_CARDS.map((card) => (
              <div key={card.title} className="guide-card">
                <h3 className="guide-card-title">{card.title}</h3>
                <ul className="guide-card-list">
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ④ Education */}
      <section className="guide-section guide-education">
        <div className="guide-container">
          <h2 className="guide-section-title">
            <span className="guide-section-icon">
              {EDUCATION_TITLE.iconSrc ? (
                <img
                  src={EDUCATION_TITLE.iconSrc}
                  alt={EDUCATION_TITLE.text}
                  className="guide-section-icon-img"
                />
              ) : (
                EDUCATION_TITLE.icon
              )}
            </span>
            {EDUCATION_TITLE.text}
          </h2>
          <div className="guide-edu-grid">
            {EDUCATION_ITEMS.map((item) => (
              <div key={item.label} className="guide-edu-item">
                <span className="guide-edu-icon"><i className={`bi ${item.icon}`} /></span>
                <span className="guide-edu-label">{item.label}</span>
                <span className="guide-edu-desc">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑤ Network */}
      <section className="guide-section guide-network">
        <div className="guide-container">
          <h2 className="guide-section-title">
            <span className="guide-section-icon">
              {NETWORK_TITLE.iconSrc ? (
                <img
                  src={NETWORK_TITLE.iconSrc}
                  alt={NETWORK_TITLE.text}
                  className="guide-section-icon-img"
                />
              ) : (
                NETWORK_TITLE.icon
              )}
            </span>
            {NETWORK_TITLE.text}
          </h2>
          <div className="guide-network-grid">
            {NETWORK_ITEMS.map((item) => (
              <div key={item.title} className="guide-network-card">
                <span className="guide-network-icon"><i className={`bi ${item.icon}`} /></span>
                <h3 className="guide-network-title">{item.title}</h3>
                <p className="guide-network-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑥ Before / After */}
      <section className="guide-beforeafter">
        <div className="guide-container">
          <h2 className="guide-section-title guide-section-title-light">{BEFORE_AFTER.sectionTitle}</h2>
          {BEFORE_AFTER.subTitle && (
            <p className="guide-beforeafter-subtitle">{BEFORE_AFTER.subTitle}</p>
          )}
          <div className="guide-ba-grid">
            <div className="guide-ba-block guide-ba-before">
              <span className="guide-ba-label">{BEFORE_AFTER.before.label}</span>
              <ul className="guide-ba-list">
                {BEFORE_AFTER.before.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <span className="guide-ba-arrow" aria-hidden>→</span>
            <div className="guide-ba-block guide-ba-after">
              <span className="guide-ba-label">{BEFORE_AFTER.after.label}</span>
              <ul className="guide-ba-list">
                {BEFORE_AFTER.after.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ⑦ CTA → 프로그램 이미지 파노라마 */}
      <section className="guide-cta">
        <div className="guide-cta-panorama">
          <div className="guide-cta-track">
            {CTA.panoramaImages.concat(CTA.panoramaImages).map((src, index) => (
              <div className="guide-cta-image-wrapper" key={`${src}-${index}`}>
                <img src={src} alt="program visual" className="guide-cta-image" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
