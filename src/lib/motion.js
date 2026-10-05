import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isFinePointer = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const getTier = () => {
  const width = window.innerWidth;
  if (width <= 760) return "mobile";
  if (width <= 1100) return "tablet";
  return "desktop";
};

// One-shot "it happened" gate: late subscribers are called immediately.
function createGate() {
  let done = false;
  const subscribers = new Set();
  return {
    isDone: () => done,
    fire() {
      done = true;
      subscribers.forEach((fn) => fn());
      subscribers.clear();
    },
    on(fn) {
      if (done) {
        fn();
        return () => {};
      }
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
  };
}

export const introGate = createGate(); // cinematic intro finished
export const heroGate = createGate(); // hero particle sequence finished (or skipped)

// Called from main.jsx before React renders so the UI never flashes before the intro.
export function prepareIntro() {
  if (prefersReducedMotion()) return;
  const root = document.documentElement;
  root.classList.add("is-intro");
  // Safety net: never leave the page hidden if something fails.
  window.setTimeout(() => root.classList.remove("is-intro"), 6000);
}

// Pinned sections live in a .pin-spacer; use the spacer for the true document position.
export function scrollToId(id) {
  const target = document.getElementById(id);
  if (!target) return false;
  const anchor = target.parentElement?.classList.contains("pin-spacer")
    ? target.parentElement
    : target;
  const y = id === "home" ? 0 : anchor.getBoundingClientRect().top + window.scrollY;
  gsap.to(window, {
    scrollTo: { y, autoKill: true },
    duration: prefersReducedMotion() ? 0 : 1.1,
    ease: "power3.inOut",
    overwrite: true,
  });
  return true;
}
