import { useEffect } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "./motion.js";

/*
 * Selected item grows (up to `max`, capped so text never overflows its row),
 * the others shrink and fade. Works with hover, keyboard focus and tap.
 * No React state: everything runs through GSAP + classList.
 */
export function useSelectScale(listRef, { item, scaleTarget, fade, max = 1.5 }) {
  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion()) return undefined;

    const items = Array.from(list.querySelectorAll(item));
    const targets = items.map((el) => el.querySelector(scaleTarget));
    const fades = items.map((el) => Array.from(el.querySelectorAll(fade)));
    gsap.set(targets, { transformOrigin: "0% 50%" });

    let active = -1;
    let lastPointer = "mouse";

    const fitScale = (el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const current = gsap.getProperty(el, "scale") || 1;
      const textWidth = range.getBoundingClientRect().width / current;
      return Math.max(1, Math.min(max, (el.offsetWidth * 0.96) / (textWidth || 1)));
    };

    const apply = (index) => {
      active = index;
      items.forEach((row, i) => {
        const selected = i === index;
        const idle = index === -1;
        gsap.to(targets[i], {
          scale: idle ? 1 : selected ? fitScale(targets[i]) : 0.9,
          x: selected ? 6 : 0,
          duration: 0.55,
          ease: selected ? "back.out(1.6)" : "power3.out",
          overwrite: "auto",
        });
        gsap.to(fades[i], { opacity: idle || selected ? 1 : 0.38, duration: 0.4, ease: "power3.out", overwrite: "auto" });
        row.classList.toggle("is-selected", selected);
      });
    };

    const indexOf = (e) => items.indexOf(e.target.closest(item));
    const onPointerDown = (e) => { lastPointer = e.pointerType; };
    const onOver = (e) => {
      if (e.pointerType !== "mouse") return;
      const i = indexOf(e);
      if (i > -1 && i !== active) apply(i);
    };
    const onLeave = (e) => { if (e.pointerType === "mouse") apply(-1); };
    const onFocusIn = (e) => {
      const i = indexOf(e);
      if (i > -1 && i !== active) apply(i);
    };
    const onFocusOut = (e) => { if (!list.contains(e.relatedTarget)) apply(-1); };
    const onClick = (e) => {
      const i = indexOf(e);
      if (i === -1) return;
      // touch: tap again to deselect; mouse: hover already selected, click keeps it
      apply(lastPointer === "touch" && i === active ? -1 : i);
    };
    const onOutsideTap = (e) => {
      if (e.pointerType === "touch" && !list.contains(e.target)) apply(-1);
    };

    list.addEventListener("pointerdown", onPointerDown);
    list.addEventListener("pointerover", onOver);
    list.addEventListener("pointerleave", onLeave);
    list.addEventListener("focusin", onFocusIn);
    list.addEventListener("focusout", onFocusOut);
    list.addEventListener("click", onClick);
    document.addEventListener("pointerdown", onOutsideTap, { passive: true });

    return () => {
      list.removeEventListener("pointerdown", onPointerDown);
      list.removeEventListener("pointerover", onOver);
      list.removeEventListener("pointerleave", onLeave);
      list.removeEventListener("focusin", onFocusIn);
      list.removeEventListener("focusout", onFocusOut);
      list.removeEventListener("click", onClick);
      document.removeEventListener("pointerdown", onOutsideTap);
      gsap.killTweensOf([...targets, ...fades.flat()]);
      gsap.set(targets, { clearProps: "transform" });
      gsap.set(fades.flat(), { clearProps: "opacity" });
      items.forEach((row) => row.classList.remove("is-selected"));
    };
  }, [listRef, item, scaleTarget, fade, max]);
}
