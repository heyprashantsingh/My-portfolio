import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import BackgroundVideo from "./components/BackgroundVideo.jsx";
import ParticleLayer from "./components/ParticleLayer.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import CodeShare from "./components/CodeShare.jsx";
import Services from "./components/Services.jsx";
import Experience from "./components/Experience.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

import {
  getTier,
  introGate,
  prefersReducedMotion,
  scrollToId,
} from "./lib/motion.js";

gsap.registerPlugin(ScrollTrigger);

const UI = ".navbar, #page-content, .footer";
const STAGE = ".site-background__stage";
const FRAME = ".site-background__frame";
const HEADINGS = ".display-heading, .contact__title";

const STAR_FIELD = ".star-gazing";
const STAR_LAYERS = ".star-gazing__layer";

const STACK = [
  {
    scale: 0.9,
    rotationX: 5,
    opacity: 0.3,
    origin: "50% 100%",
  },
  {
    scale: 0.94,
    rotationX: 3,
    opacity: 0.5,
    origin: "50% 0%",
  },
  {
    scale: 0.92,
    rotationX: -3,
    opacity: 0.45,
    origin: "50% 50%",
  },
  {
    scale: 0.95,
    rotationX: 2,
    opacity: 0.5,
    origin: "50% 100%",
  },
  {
    scale: 0.9,
    rotationX: -4,
    opacity: 0.4,
    origin: "50% 0%",
  },
  {
    scale: 0.94,
    rotationX: 3,
    opacity: 0.5,
    origin: "50% 50%",
  },
  {
    scale: 0.93,
    rotationX: 2,
    opacity: 0.5,
    origin: "50% 100%",
  },
];

export default function App() {
  const contentRef = useRef(null);

  /* =========================================
     IN-PAGE ANCHOR NAVIGATION
  ========================================= */

  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="#"]');

      if (
        !link ||
        e.defaultPrevented ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey
      ) {
        return;
      }

      const href = link.getAttribute("href");

      if (!href) return;

      const id = href.slice(1);

      if (id && scrollToId(id)) {
        e.preventDefault();
      }
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  /* =========================================
     MAIN CINEMATIC SYSTEM
  ========================================= */

  useEffect(() => {
    const root = document.documentElement;

    if (prefersReducedMotion()) {
      root.classList.remove("is-intro");
      introGate.fire();

      return undefined;
    }

    let alive = true;

    const tier = getTier();

    const rest =
      tier === "mobile"
        ? {
            rotationY: -8,
            rotationX: 2,
            scale: 1.06,
          }
        : {
            rotationY: -16,
            rotationX: 5,
            scale: 1.1,
          };

    root.style.overflow = "hidden";

    /* =========================================
       CINEMATIC INTRO
    ========================================= */

    const intro = gsap.context(() => {
      gsap.set(UI, {
        autoAlpha: 0,
      });

      gsap.set(STAGE, {
        transformPerspective: 1400,
        transformOrigin: "50% 50%",
        ...rest,
      });

      gsap.set(FRAME, {
        transformPerspective: 1200,
        rotationY: -34,
        rotationX: 10,
        scale: 0.62,
        borderRadius: 28,
        boxShadow:
          "0 40px 120px rgba(0,0,0,.55), 0 0 0 1px rgba(213,255,112,.14)",
      });

      root.classList.remove("is-intro");

      const introTimeline = gsap.timeline({
        defaults: {
          overwrite: "auto",
        },

        onComplete: () => {
          if (!alive) return;

          root.style.overflow = "";

          gsap.to(".site-background__video", {
            scale: 1.05,
            duration: 16,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });

          introGate.fire();

          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });
        },
      });

      introTimeline
        .to(FRAME, {
          rotationY: -26,
          scale: 0.7,
          duration: 0.55,
          ease: "sine.inOut",
        })

        .to(FRAME, {
          scale: 2.6,
          rotationY: -4,
          rotationX: 0,
          borderRadius: 0,
          filter: "blur(6px)",
          duration: 0.85,
          ease: "expo.in",
        })

        .to(
          ".site-background__flash",
          {
            opacity: 1,
            duration: 0.14,
            ease: "power2.in",
          },
          "-=0.14"
        )

        .set(FRAME, {
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          borderRadius: 0,
          filter: "none",
          boxShadow: "none",
        })

        .to(".site-background__flash", {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        })

        .to(
          UI,
          {
            autoAlpha: 1,
            duration: 0.7,
            ease: "power3.out",
          },
          "<0.05"
        )

        .fromTo(
          "[data-hero-reveal]",
          {
            y: 60,
            rotationX: -14,
            scale: 0.97,
            transformPerspective: 900,
            autoAlpha: 0,
          },
          {
            y: 0,
            rotationX: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.09,
            ease: "power4.out",
          },
          "<0.1"
        )

        .fromTo(
          ".hero__title",
          {
            letterSpacing: "-0.14em",
          },
          {
            letterSpacing: "-0.105em",
            duration: 1.2,
            ease: "power3.out",
          },
          "<"
        );
    });

    /* =========================================
       SCROLL SYSTEM
    ========================================= */

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 761px)",
      },
      (mctx) => {
        const { desktop } = mctx.conditions;

        const vh = () => window.innerHeight;

        const sections = gsap.utils.toArray(".page-section");

        /* =====================================
           3D STAR GAZING SYSTEM

           IMPORTANT:
           Hero is intentionally excluded.

           Stars become visible only when
           Building Digital Experience enters.
        ===================================== */

        gsap.set(STAR_FIELD, {
          autoAlpha: 0,
        });

        gsap.set(STAR_LAYERS, {
          transformPerspective: 1200,
          transformOrigin: "50% 50%",
          force3D: true,
        });

        /*
          Three layers start at different depths.
          This creates the 3D space.
        */

        gsap.set(".star-gazing__layer--far", {
          scale: 0.72,
          z: -500,
          rotation: 0,
        });

        gsap.set(".star-gazing__layer--mid", {
          scale: 0.86,
          z: -220,
          rotation: 0,
        });

        gsap.set(".star-gazing__layer--near", {
          scale: 1,
          z: 0,
          rotation: 0,
        });

        /*
          About = Building Digital Experience.
          This is the exact point where the
          star-gazing world begins.
        */

        const aboutSection = sections[1];

        if (aboutSection) {
          ScrollTrigger.create({
            trigger: aboutSection,
            start: "top 82%",
            end: "bottom top",

            onEnter: () => {
              gsap.to(STAR_FIELD, {
                autoAlpha: 1,
                duration: 1.1,
                ease: "power3.out",
              });
            },

            onLeaveBack: () => {
              gsap.to(STAR_FIELD, {
                autoAlpha: 0,
                duration: 0.6,
                ease: "power2.out",
              });
            },
          });
        }

        /*
          Normal slow movement.
          The three layers rotate in opposite
          directions to create depth.
        */

        gsap.to(".star-gazing__layer--far", {
          rotation: 360,
          duration: 220,
          repeat: -1,
          ease: "none",
        });

        gsap.to(".star-gazing__layer--mid", {
          rotation: -360,
          duration: 145,
          repeat: -1,
          ease: "none",
        });

        gsap.to(".star-gazing__layer--near", {
          rotation: 360,
          duration: 90,
          repeat: -1,
          ease: "none",
        });

        /*
          SCROLL = FORWARD CAMERA MOVEMENT

          Fast scroll:
          stars rapidly move toward camera.

          Slow scroll:
          stars remain subtle.
        */

        if (sections.length > 1) {
          sections.slice(1).forEach((section) => {
            ScrollTrigger.create({
              trigger: section,
              start: "top bottom",
              end: "bottom top",

              onUpdate: (self) => {
                const velocity = Math.abs(self.getVelocity());

                const speed = gsap.utils.clamp(
                  0,
                  1,
                  velocity / 1700
                );

                /*
                  FAR layer
                */

                gsap.to(".star-gazing__layer--far", {
                  scale: 0.72 + speed * 1.1,
                  z: -500 + speed * 850,
                  opacity: 0.22 + speed * 0.5,
                  duration: 0.2,
                  ease: "power3.out",
                  overwrite: "auto",
                });

                /*
                  MID layer
                */

                gsap.to(".star-gazing__layer--mid", {
                  scale: 0.86 + speed * 1.9,
                  z: -220 + speed * 950,
                  opacity: 0.35 + speed * 0.55,
                  duration: 0.18,
                  ease: "power3.out",
                  overwrite: "auto",
                });

                /*
                  NEAR layer

                  This one gives the strongest
                  hyperspace feeling.
                */

                gsap.to(".star-gazing__layer--near", {
                  scale: 1 + speed * 3.8,
                  z: speed * 1100,
                  opacity: 0.48 + speed * 0.52,
                  duration: 0.16,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              },

              onLeave: () => {
                gsap.to(STAR_LAYERS, {
                  scale: 1,
                  z: 0,
                  opacity: 0.5,
                  duration: 0.8,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              },

              onLeaveBack: () => {
                gsap.to(STAR_LAYERS, {
                  scale: 1,
                  z: 0,
                  opacity: 0.5,
                  duration: 0.6,
                  ease: "power3.out",
                  overwrite: "auto",
                });
              },
            });
          });
        }

        /* =====================================
           VIDEO ROTATION
        ===================================== */

        gsap.to(STAGE, {
          rotationY: 0,
          rotationX: 0,
          scale: 1,
          ease: "none",

          scrollTrigger: {
            trigger: contentRef.current,
            start: "top top",
            end: () => `+=${vh() * 2.2}`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        /* =====================================
           BACKGROUND GLOW PARALLAX
        ===================================== */

        gsap.to(".site-background__glow", {
          yPercent: 14,
          ease: "none",

          scrollTrigger: {
            trigger: contentRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        /* =====================================
           HERO CAMERA PUSH
        ===================================== */

        gsap.to(".hero__content", {
          scale: 1.06,
          yPercent: -6,
          ease: "none",

          scrollTrigger: {
            trigger: contentRef.current,
            start: "top top",
            end: () => `+=${vh()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        /* =====================================
           CINEMATIC SECTION STACKING
        ===================================== */

        if (desktop) {
          sections.slice(0, -1).forEach((panel, i) => {
            const cfg =
              STACK[i] ?? STACK[STACK.length - 1];

            ScrollTrigger.create({
              trigger: panel,
              start: "bottom bottom",
              end: () => `+=${vh()}`,
              pin: true,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            });

            gsap.to(panel, {
              scale: cfg.scale,
              rotationX: cfg.rotationX,
              opacity: cfg.opacity,
              transformOrigin: cfg.origin,
              transformPerspective: 1400,
              ease: "none",

              scrollTrigger: {
                trigger: sections[i + 1],
                start: "top bottom",
                end: "top top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
          });
        }

        /* =====================================
           PROJECT VISUAL PARALLAX
        ===================================== */

        gsap
          .utils
          .toArray(".lost-window, .portfolio-window")
          .forEach((el) => {
            const container =
              el.closest(".project-card__visual");

            if (!container) return;

            gsap.fromTo(
              el,
              {
                y: -18,
              },
              {
                y: 18,
                ease: "none",

                scrollTrigger: {
                  trigger: container,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                },
              }
            );
          });

        /* =====================================
           TEXT REVEALS
        ===================================== */

        gsap.utils.toArray("[data-reveal]").forEach((el) => {
          const trigger = {
            trigger: el,
            start: "top 88%",
            once: true,
          };

          if (el.matches(HEADINGS)) {
            const wipe = el.matches(".contact__title");

            gsap.fromTo(
              el,
              {
                autoAlpha: 0,
                y: 56,
                filter: "blur(8px)",

                clipPath: wipe
                  ? "polygon(0 0, 0 0, 0 100%, 0 100%)"
                  : "inset(0% 0% 100% 0%)",
              },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",

                clipPath: wipe
                  ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                  : "inset(-10% -5% -10% -5%)",

                duration: 1.1,

                ease: "expo.out",

                clearProps: "clipPath,filter",

                scrollTrigger: trigger,
              }
            );
          } else {
            gsap.fromTo(
              el,
              {
                y: 28,
                autoAlpha: 0,
              },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.85,
                ease: "power3.out",
                scrollTrigger: trigger,
              }
            );
          }
        });

        /* =====================================
           PROJECT CARD REVEALS
        ===================================== */

        gsap.utils.toArray(".project-card").forEach((card) => {
          const visual =
            card.querySelector(".project-card__visual");

          const art =
            card.querySelector(
              ".project-art, .project-card__visual > img"
            );

          const text =
            card.querySelectorAll(
              ".project-card__meta, :scope > h3, :scope > p"
            );

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
              once: true,
            },
          });

          if (visual) {
            tl.fromTo(
              visual,
              {
                clipPath: "inset(0% 0% 100% 0%)",
              },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 1.1,
                ease: "power4.inOut",
                clearProps: "clipPath",
              }
            );
          }

          if (art) {
            tl.fromTo(
              art,
              {
                scale: 1.25,
              },
              {
                scale: 1,
                duration: 1.4,
                ease: "power3.out",
                clearProps: "transform",
              },
              "<"
            );
          }

          if (text.length) {
            tl.fromTo(
              text,
              {
                y: 22,
                autoAlpha: 0,
              },
              {
                y: 0,
                autoAlpha: 1,
                stagger: 0.08,
                duration: 0.7,
                ease: "power3.out",
              },
              "-=0.7"
            );
          }
        });

        /* =====================================
           SCROLL VELOCITY TYPOGRAPHY
        ===================================== */

        if (desktop) {
          const headings =
            gsap.utils.toArray(HEADINGS);

          if (headings.length) {
            const proxy = {
              v: 0,
            };

            const setSkew = gsap.quickSetter(
              headings,
              "skewY",
              "deg"
            );

            const skewTo = gsap.quickTo(proxy, "v", {
              duration: 0.5,
              ease: "power3.out",

              onUpdate: () => {
                setSkew(proxy.v);
              },
            });

            const settle = () => {
              skewTo(0);
            };

            ScrollTrigger.create({
              start: 0,
              end: "max",

              onUpdate: (self) => {
                const velocity =
                  self.getVelocity() / -700;

                skewTo(
                  gsap.utils.clamp(
                    -1.4,
                    1.4,
                    velocity
                  )
                );
              },
            });

            ScrollTrigger.addEventListener(
              "scrollEnd",
              settle
            );
          }
        }

        return () => {
          gsap.killTweensOf([
            STAGE,
            FRAME,
            ".site-background__video",
            ".site-background__glow",
            ".hero__content",
            ".hero__title",
            HEADINGS,
            STAR_FIELD,
            STAR_LAYERS,
          ]);
        };
      }
    );

    /* =========================================
       FONT / LAYOUT REFRESH
    ========================================= */

    document.fonts.ready.then(() => {
      if (alive) {
        ScrollTrigger.refresh();
      }
    });

    /* =========================================
       CLEANUP
    ========================================= */

    return () => {
      alive = false;

      mm.revert();

      intro.revert();

      gsap.killTweensOf([
        STAGE,
        FRAME,
        ".site-background__video",
        ".site-background__glow",
        ".hero__content",
        ".hero__title",
        STAR_FIELD,
        STAR_LAYERS,
      ]);

      root.style.overflow = "";

      ScrollTrigger.refresh();
    };
  }, []);

  /* =========================================
     PAGE
  ========================================= */

  return (
    <>
      <BackgroundVideo />

      <ParticleLayer />

      {/* 3D STAR GAZING
          Hidden during Hero.
          Activates from Building Digital Experience. */}
      <div className="star-gazing" aria-hidden="true">
        <div className="star-gazing__layer star-gazing__layer--far" />
        <div className="star-gazing__layer star-gazing__layer--mid" />
        <div className="star-gazing__layer star-gazing__layer--near" />
      </div>

      <Navbar />

      <main
        id="page-content"
        ref={contentRef}
      >
        <Hero />

        <About />

        <Skills />

        <Projects />

        <CodeShare />

        <Services />

        <Experience />

        <Contact />
      </main>

      <Footer />
    </>
  );
}