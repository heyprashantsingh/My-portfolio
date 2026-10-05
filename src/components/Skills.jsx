import React, { useRef } from "react";
import { skills } from "../data/site.js";
import { useSelectScale } from "../lib/useSelectScale.js";

export default function Skills() {
  const listRef = useRef(null);
  useSelectScale(listRef, {
    item: ".skill-row",
    scaleTarget: ".skill-row__name",
    fade: ".skill-row__number, .skill-row__name",
  });

  return (
    <section className="skills page-section" id="skills" aria-labelledby="skills-title">
      <div className="section-kicker" data-reveal><span>02 / CORE COMPETENCIES</span><span>TOOLS &amp; PRACTICE</span></div>
      <div className="skills__intro">
        <h2 className="display-heading" id="skills-title" data-reveal>W H A T  I<br /><span>W O R K W I T H</span><i>.</i></h2>
        <p data-reveal>Building a foundation in thoughtful design and practical web craft.</p>
      </div>
      <ul className="skills__list" aria-label="Core competencies" ref={listRef}>
        {skills.map((skill, index) => (
          <li className="skill-row" data-reveal tabIndex={0} key={skill}>
            <span className="skill-row__number">0{index + 1}</span>
            <span className="skill-row__name">{skill}</span>
            <span className="skill-row__arrow" aria-hidden="true">↗</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
