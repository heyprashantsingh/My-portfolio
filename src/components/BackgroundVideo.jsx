import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Drop portfolio-bg.mp4 into src/assets. Set ENABLE_SCROLL_SCRUB to true to scrub the clip by scroll.
const videoFiles = import.meta.glob("../assets/portfolio-bg.mp4", {
  eager: true,
  query: "?url",
  import: "default",
});
const videoSrc = Object.values(videoFiles)[0] ?? "";
const ENABLE_SCROLL_SCRUB = false;

/*
 * Structure (each layer is animated by a different owner so tweens never fight):
 *   stage  -> scroll-driven rotation toward the viewer   (App.jsx)
 *   frame  -> intro zoom / blur / rounded "screen"       (App.jsx)
 *   video  -> idle breathing + mouse parallax            (App.jsx / interactions.js)
 */
export default function BackgroundVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!ENABLE_SCROLL_SCRUB || !videoSrc || !video) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: "#page-content",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: ({ progress }) => {
        if (video.readyState >= 2 && Number.isFinite(video.duration)) {
          video.currentTime = progress * video.duration;
        }
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div className="site-background" aria-hidden="true">
      <div className="site-background__stage">
        <div className="site-background__frame">
          {videoSrc && (
            <video
              ref={videoRef}
              className="site-background__video"
              src={videoSrc}
              autoPlay={!ENABLE_SCROLL_SCRUB}
              loop={!ENABLE_SCROLL_SCRUB}
              muted
              playsInline
              preload="metadata"
            />
          )}
        </div>
      </div>
      <div className="site-background__shade" />
      <div className="site-background__glow" />
      <div className="site-background__flash" />
    </div>
  );
}
