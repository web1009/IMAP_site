import React from 'react';
import { Helmet } from 'react-helmet-async';
import './About.css';
import aboutData from './aboutData';

function About() {
  const { header, sections, team } = aboutData;

  return (
    <>
      <Helmet>
        <title>About - IMAP</title>
        <meta name="description" content="Learn about our mission and team" />
      </Helmet>

      {/* Header */}
      <header className="section-padding">
        <div className="section-container">
          <div className="section-row">
            <div className="section-col section-col-header">
              <div className="page-header">
                <h1 className="page-title">{header.title}</h1>
                <p className="page-subtitle">{header.subtitle}</p>
                <a className="button-primary button-large" href={header.buttonLink}>
                  {header.buttonText}
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Sections */}
      {sections.map(section => (
        <section
          key={section.id}
          className={`section-padding ${section.id === 1 ? 'section-light' : ''}`}
          id={section.id === 1 ? 'scroll-target' : undefined}
        >
          <div className="section-container">
            <div className="section-row">
              <div
                className={`section-col section-col-image ${
                  section.reverse ? 'section-col-image-reverse' : ''
                }`}
              >
                <img className="section-image" src={section.image} alt="" />
              </div>

              <div className="section-col section-col-text">
                <h2 className="section-title">{section.title}</h2>
                <p className="section-text">{section.text}</p>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Team */}
      <section className="section-padding section-light">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">{team.title}</h2>
            <p className="section-subtitle">{team.subtitle}</p>
          </div>

          <div className="team-grid">
            {team.members.map((member, i) => (
              <div key={i} className="team-item">
                <div className="team-content">
                  <img className="team-avatar" src={member.image} alt="" />
                  <h5 className="team-name">{member.name}</h5>
                  <div className="team-role">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default About;

