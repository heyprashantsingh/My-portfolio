import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { getTier, heroGate, introGate, isFinePointer, prefersReducedMotion } from "../lib/motion.js";
import { AMBIENT_VERT, FRAG, MAIN_VERT } from "../lib/particleShaders.js";

const LIMITS = {
  desktop: { gap: 3, max: 30000, ambient: 140 },
  tablet: { gap: 4, max: 14000, ambient: 80 },
  mobile: { gap: 5, max: 6500, ambient: 40 },
};
const FOV = 50;

/*
 * A single viewport-level canvas (fixed, outside every transformed/clipped ancestor).
 * - Lazy: three.js is imported only after the intro finishes.
 * - One renderer, one gsap.ticker callback, all motion in vertex shaders.
 * - During the hero sequence the canvas sits above the page; afterwards it drops behind
 *   the sections and only renders a faint ambient dust that fades out as you scroll.
 */
export default function ParticleLayer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) {
      heroGate.fire();
      return undefined;
    }

    let disposed = false;
    let disposeScene = () => {};

    const stopWaiting = introGate.on(() => {
      Promise.all([import("three"), document.fonts.ready])
        .then(([THREE]) => {
          if (!disposed) disposeScene = run(THREE);
        })
        .catch(() => heroGate.fire());
    });

    function run(THREE) {
      const tier = getTier();
      const cfg = LIMITS[tier];
      let w = document.documentElement.clientWidth;
      let h = window.innerHeight;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
      } catch {
        heroGate.fire();
        return () => {};
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tier === "desktop" ? 2 : 1.5));
      renderer.setSize(w, h, false);
      const px = renderer.getPixelRatio();

      const camZFor = (height) => height / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      let camZ = camZFor(h);
      const camera = new THREE.PerspectiveCamera(FOV, w / h, 10, camZ * 4);
      camera.position.z = camZ;
      const scene = new THREE.Scene();

      const makeMaterial = (vertexShader, uniforms) =>
        new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader: FRAG,
          uniforms: { uTime: { value: 0 }, uPx: { value: px }, uCamZ: { value: camZ }, uOpacity: { value: 1 }, ...uniforms },
          transparent: true,
          depthWrite: false,
          depthTest: false,
          blending: THREE.AdditiveBlending,
        });

      /* ---------- ambient dust ---------- */
      const count = cfg.ambient;
      const aPos = new Float32Array(count * 3);
      const aRnd = new Float32Array(count * 4);
      for (let i = 0; i < count; i++) {
        aPos[i * 3] = (Math.random() - 0.5) * w * 1.3;
        aPos[i * 3 + 1] = (Math.random() - 0.5) * h * 1.3;
        aPos[i * 3 + 2] = -300 + Math.random() * 500;
        for (let k = 0; k < 4; k++) aRnd[i * 4 + k] = Math.random();
      }
      const ambientGeo = new THREE.BufferGeometry();
      ambientGeo.setAttribute("position", new THREE.BufferAttribute(aPos, 3));
      ambientGeo.setAttribute("aRand", new THREE.BufferAttribute(aRnd, 4));
      const ambientMat = makeMaterial(AMBIENT_VERT, { uFade: { value: 1 }, uMouse: { value: new THREE.Vector2(9999, 9999) } });
      const ambient = new THREE.Points(ambientGeo, ambientMat);
      ambient.frustumCulled = false;
      scene.add(ambient);

      /* ---------- hero text particles ---------- */
      const title = document.getElementById("hero-title");
      let main = null;
      let timeline = null;
      let ending = false;

      // Draw the real title glyphs (position taken per character from the DOM) and sample them.
      function sampleTitle() {
        const sampler = document.createElement("canvas");
        sampler.width = w;
        sampler.height = h;
        const ctx = sampler.getContext("2d", { willReadFrequently: true });
        if (!ctx) return null;
        const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
        const range = document.createRange();
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const style = getComputedStyle(node.parentElement);
          ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          ctx.fillStyle = style.color;
          ctx.textBaseline = "alphabetic";
          const ascent = ctx.measureText("M").fontBoundingBoxAscent ?? parseFloat(style.fontSize) * 0.9;
          for (let i = 0; i < node.data.length; i++) {
            if (!node.data[i].trim()) continue;
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const rect = range.getBoundingClientRect();
            ctx.fillText(node.data[i], rect.left, rect.top + ascent);
          }
        }
        const { data } = ctx.getImageData(0, 0, w, h);
        const samples = [];
        for (let y = 0; y < h; y += cfg.gap) {
          for (let x = 0; x < w; x += cfg.gap) {
            const i = (y * w + x) * 4;
            if (data[i + 3] > 110) samples.push(x, y, data[i], data[i + 1], data[i + 2]);
          }
        }
        return samples;
      }

      function buildMain() {
        const samples = sampleTitle();
        if (!samples || samples.length < 50) return null;
        const keep = Math.min(1, cfg.max / (samples.length / 5));
        const pos = [];
        const scatter = [];
        const rand = [];
        const color = [];
        for (let i = 0; i < samples.length; i += 5) {
          if (Math.random() > keep) continue;
          const x = samples[i] - w / 2;
          const y = h / 2 - samples[i + 1];
          const z = camZ * (0.05 + Math.pow(Math.random(), 1.4) * 0.62);
          const k = 1 - z / camZ; // keeps the projected spread spread evenly across the screen
          pos.push(x, y, 0);
          scatter.push(
            (x * 0.35 + (Math.random() + Math.random() - 1) * w * 0.62) * k,
            (y * 0.35 + (Math.random() + Math.random() - 1) * h * 0.62) * k,
            z,
          );
          rand.push(Math.random(), Math.random(), Math.random(), 0.4 + Math.random() * 1.2);
          color.push(samples[i + 2] / 255, samples[i + 3] / 255, samples[i + 4] / 255);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute("aScatter", new THREE.Float32BufferAttribute(scatter, 3));
        geo.setAttribute("aRand", new THREE.Float32BufferAttribute(rand, 4));
        geo.setAttribute("aColor", new THREE.Float32BufferAttribute(color, 3));
        const mat = makeMaterial(MAIN_VERT, { uProgress: { value: 0 }, uBase: { value: cfg.gap * 0.9 } });
        const points = new THREE.Points(geo, mat);
        points.frustumCulled = false;
        return { geo, mat, points };
      }

      function releaseMain(m) {
        scene.remove(m.points);
        m.geo.dispose();
        m.mat.dispose();
      }

      function endMain(duration) {
        if (ending || !main) return;
        ending = true;
        timeline?.kill();
        const m = main;
        gsap.to(m.mat.uniforms.uOpacity, { value: 0, duration, ease: "power1.out" });
        gsap.to(title, {
          opacity: 1,
          duration,
          ease: "power1.out",
          onComplete: () => {
            releaseMain(m);
            main = null;
            canvas.classList.remove("is-front");
            heroGate.fire();
          },
        });
      }

      function startMain() {
        if (!title || window.scrollY > 40) {
          heroGate.fire();
          return;
        }
        main = buildMain();
        if (!main) {
          heroGate.fire();
          return;
        }
        scene.add(main.points);
        canvas.classList.add("is-front");
        renderer.render(scene, camera); // frame 0 sits exactly on the text, then hide the HTML text
        gsap.set(title, { opacity: 0 });

        const progress = { v: 0 };
        const sync = () => { main.mat.uniforms.uProgress.value = progress.v; };
        timeline = gsap
          .timeline({ defaults: { onUpdate: sync }, onComplete: () => endMain(0.35) })
          .to(progress, { v: 0.5, duration: 1.5, ease: "sine.inOut" })
          .to(progress, { v: 1, duration: 1.7, ease: "power2.inOut" }, ">0.3");
      }

      /* ---------- single render loop ---------- */
      const mouse = { x: 9999, y: 9999, tx: 9999, ty: 9999 };
      let drawn = false;
      const tick = (time) => {
        const fade = Math.max(0, 1 - window.scrollY / (h * 0.8));
        if (!main && fade < 0.01) {
          if (drawn) {
            renderer.clear();
            drawn = false;
          }
          return;
        }
        if (main) main.mat.uniforms.uTime.value = time;
        if (mouse.x > 9000) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
        mouse.x += (mouse.tx - mouse.x) * 0.08;
        mouse.y += (mouse.ty - mouse.y) * 0.08;
        ambientMat.uniforms.uTime.value = time;
        ambientMat.uniforms.uFade.value = fade;
        ambientMat.uniforms.uMouse.value.set(mouse.x, mouse.y);
        renderer.render(scene, camera);
        drawn = true;
      };
      gsap.ticker.add(tick);

      const onPointerMove = (e) => { mouse.tx = e.clientX - w / 2; mouse.ty = h / 2 - e.clientY; };
      const onScroll = () => { if (main && window.scrollY > 80) endMain(0.25); };
      let resizeTimer;
      const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const nextW = document.documentElement.clientWidth;
          if (nextW !== w && main) endMain(0.2);
          w = nextW;
          h = window.innerHeight;
          camZ = camZFor(h);
          camera.position.z = camZ;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
          ambientMat.uniforms.uCamZ.value = camZ;
        }, 150);
      };
      if (isFinePointer()) window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);

      startMain();

      return () => {
        clearTimeout(resizeTimer);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        gsap.ticker.remove(tick);
        timeline?.kill();
        if (main) {
          gsap.killTweensOf(main.mat.uniforms.uOpacity);
          releaseMain(main);
          main = null;
        }
        if (title) {
          gsap.killTweensOf(title);
          gsap.set(title, { clearProps: "opacity" });
        }
        scene.remove(ambient);
        ambientGeo.dispose();
        ambientMat.dispose();
        renderer.dispose();
        canvas.classList.remove("is-front");
      };
    }

    return () => {
      disposed = true;
      stopWaiting();
      disposeScene();
    };
  }, []);

  return <canvas ref={canvasRef} className="fx-canvas" aria-hidden="true" />;
}
