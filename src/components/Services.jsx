import React, { useRef } from "react";
import { services } from "../data/site.js";
import { useSelectScale } from "../lib/useSelectScale.js";

export default function Services() {
  const listRef = useRef(null);
  useSelectScale(listRef, {
    item: ".service-item",
    scaleTarget: "h3",
    fade: ".service-item__number, h3",
  });

  return (
    <section className="services page-section" id="services" aria-labelledby="services-title">
      <div className="section-kicker" data-reveal><span>05 / SERVICES</span><span>HOW I CAN HELP</span></div>
      <div className="services__heading-row">
        <h2 className="display-heading" id="services-title" data-reveal>WHAT I<br /><span>CAN DO</span><i>.</i></h2>
        <p data-reveal>Clear thinking, careful execution and a focus on making the useful feel effortless.</p>
      </div>
      <ol className="service-list" ref={listRef}>
        {services.map((service, index) => (
          <li className="service-item" data-reveal tabIndex={0} key={service}>
            <span className="service-item__number">0{index + 1}</span>
            <h3>{service}</h3>
            <span className="service-item__arrow" aria-hidden="true">↗</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
