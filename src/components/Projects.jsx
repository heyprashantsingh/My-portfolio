import React from "react";
import { projects } from "../data/site.js";

function ProjectArt({ visual }) {
  if (visual === "lost-found") {
    return (
      <div className="project-art project-art--lost" aria-hidden="true">
        <div className="lost-window">
          <div className="lost-window__top"><i /><i /><i /><span>FOUND / 024</span></div>
          <div className="lost-window__body">
            <span className="lost-window__label">CAMPUS LOST &amp; FOUND</span>
            <strong>Good things<br />find their way.</strong>
            <div className="lost-window__item"><b>01</b><span>Black notebook</span><em>RETURNED</em></div>
            <div className="lost-window__item"><b>02</b><span>Silver key ring</span><em>FOUND</em></div>
          </div>
        </div>
        <span className="project-art__caption">A BETTER WAY TO RECONNECT</span>
      </div>
    );
  }

  return (
    <div className="project-art project-art--portfolio" aria-hidden="true">
      <div className="portfolio-window">
        <span className="portfolio-window__tiny">SELECTED WORK — 2026</span>
        <strong>Ideas into<br /><i>experiences.</i></strong>
        <span className="portfolio-window__line" />
        <span className="portfolio-window__footer">DESIGN / BUILD / REPEAT <b>↗</b></span>
      </div>
      <span className="project-art__caption">A PERSONAL DIGITAL SPACE</span>
    </div>
  );
}

export default function Projects() {
  return (
    <section className="projects page-section" id="projects" aria-labelledby="projects-title">
      <div className="section-kicker" data-reveal><span>03 / SELECTED WORK</span><span>SMALL STEPS, REAL IDEAS</span></div>
      <div className="projects__heading-row">
        <h2 className="display-heading" id="projects-title" data-reveal>FEATURED<br /><span>PROJECTS</span><i>.</i></h2>
        <p data-reveal>A couple of ideas shaped into useful digital experiences.</p>
      </div>
      <div className="projects__grid">
        {projects.map((project) => (
          <article className="project-card" data-reveal key={project.number}>
            <div className="project-card__visual">
              {project.image ? (
                <img src={project.image} alt={`${project.name} project screenshot`} loading="lazy" />
              ) : (
                <ProjectArt visual={project.visual} />
              )}
              <span className="project-card__image-note"></span>
            </div>
            <div className="project-card__meta">
              <span>{project.number} / {project.category}</span>
              <span className="project-card__arrow" aria-hidden="true">↗</span>
            </div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
