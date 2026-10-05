import React from "react";

// Markup only. The particle transformation lives in ParticleLayer.jsx (a viewport-level canvas)
// so it is never clipped by the heading or affected by transformed/pinned ancestors.
export default function Hero() {
  return (
    <section className="hero page-section" id="home" aria-labelledby="hero-title">
      <div className="hero__content">
        <p className="eyebrow hero__eyebrow" data-hero-reveal>
          Independent web creator <span className="eyebrow__dot" />
        </p>

        <h1 className="hero__title" id="hero-title">
          <span className="hero__line">
            <span data-hero-reveal>PRASHANT </span>
          </span>
          <span className="hero__line hero__line--second">
            <span data-hero-reveal>
              SINGH<span className="hero__period">.</span>
            </span>
          </span>
        </h1>

        <div className="hero__bottom" data-hero-reveal>
          <p className="hero__role">
            WEB DEVELOPER <span>+</span> UI/UX DESIGNER
          </p>

          <p className="hero__description">
            I create modern websites and digital experiences with clean interfaces, thoughtful design and user-focused interactions.
          </p>

          <div className="hero__actions">
            <a className="button button--light" href="#projects">
              Explore projects <span aria-hidden="true">↘</span>
            </a>
            <a className="button button--text" href="#contact">
              Let&apos;s chat <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      <a className="hero__scroll" href="#about">
        <span className="hero__scroll-line" />
        Scroll to explore <span aria-hidden="true">↓</span>
      </a>

      <span className="hero__index" aria-hidden="true">
        01 — 08
      </span>
    </section>
  );
}
