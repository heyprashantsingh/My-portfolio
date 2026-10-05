import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Flowers from "./Flowers.jsx";
import { prefersReducedMotion } from "../lib/motion.js";

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return undefined;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".flower").forEach((flower, i) => {
        const dir = i % 2 ? -1 : 1;
        const svg = flower.querySelector(".flower__svg");
        const floater = flower.querySelector(".flower__float");
        const span = { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.2 };

        // grow in as the section arrives
        gsap.fromTo(
          flower,
          { scale: 0.15, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: `top ${85 - i * 8}%`, end: `top ${25 - i * 5}%`, scrub: 1 },
          },
        );
        // depth parallax and scroll-driven rotation (separate layers, so no conflicts)
        gsap.fromTo(flower, { yPercent: -10 * (i + 1) }, { yPercent: 10 * (i + 1), ease: "none", scrollTrigger: span });
        gsap.fromTo(svg, { rotation: -50 * dir }, { rotation: 70 * dir, ease: "none", scrollTrigger: span });

        // barely-there idle float, only runs while the section is on screen
        const idle = gsap.to(floater, { y: -16, rotation: 4 * dir, duration: 4 + i, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true });
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => idle.paused(!self.isActive),
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about page-section" id="about" aria-labelledby="about-title" ref={sectionRef}>
      <Flowers />
      <div className="section-kicker" data-reveal><span>01 / ABOUT</span><span>THE PERSON BEHIND THE PIXELS</span></div>
      <div className="about__content">
        <h2 className="display-heading about__heading" id="about-title" data-reveal>
          BUILDING DIGITAL<br /><span>EXPERIENCES</span><i>.</i>
        </h2>
        <div className="about__body" data-reveal>
          <span className="about__asterisk" aria-hidden="true">✳</span>
          <p>
            I&apos;m Prashant Singh, a CSIT student and aspiring web developer focused on creating modern websites and engaging digital experiences. I work with web technologies, UI/UX design and Figma to turn ideas into clean and functional interfaces.
          </p>
          <a className="text-link" href="#experience">A LITTLE ABOUT MY JOURNEY <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="about__footnote"><span>CURIOUS BY NATURE</span><span>DESIGN MINDED · DETAIL FOCUSED</span></div>
    </section>
  );
}
