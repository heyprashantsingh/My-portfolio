import React from "react";

const milestones = [
  {
    type: "EDUCATION",
    date: "CURRENT",
    title: "B.Tech — CSIT",
    place: "GL Bajaj, Greater Noida",
    description: "Studying computer science and information technology while building a foundation in web and digital work.",
  },
  {
    type: "EXPERIENCE",
    date: "2026 — PRESENT",
    title: "Web & Digital Work",
    place: "Independent projects",
    description: "Working on websites, digital projects, event-related work and creative online experiences.",
  },
];

export default function Experience() {
  return (
    <section className="experience page-section" id="experience" aria-labelledby="experience-title">
      <div className="section-kicker" data-reveal><span>06 / EXPERIENCE &amp; EDUCATION</span><span>EVERY STEP COUNTS</span></div>
      <div className="experience__heading-row">
        <h2 className="display-heading" id="experience-title" data-reveal>MY<br /><span>JOURNEY</span><i>.</i></h2>
        <p data-reveal>Learning, experimenting and turning ideas into things people can use.</p>
      </div>
      <div className="journey-list">
        {milestones.map((item, index) => (
          <article className="journey-item" data-reveal key={item.type}>
            <div className="journey-item__marker"><span>0{index + 1}</span><i /></div>
            <div className="journey-item__body">
              <div className="journey-item__meta"><span>{item.type}</span><span>{item.date}</span></div>
              <h3>{item.title}</h3>
              <p className="journey-item__place">{item.place}</p>
              <p className="journey-item__description">{item.description}</p>
            </div>
            <span className="journey-item__arrow" aria-hidden="true">↗</span>
          </article>
        ))}
      </div>
    </section>
  );
}
