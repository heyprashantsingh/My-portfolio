import React from "react";

function Flower({ id, petals }) {
  const angles = Array.from({ length: petals }, (_, i) => (360 / petals) * i);
  const petal = (angle, scale, key) => (
    <ellipse
      key={key}
      cx="0"
      cy="-50"
      rx="17"
      ry="46"
      transform={`rotate(${angle}) scale(${scale})`}
      fill={`url(#petal-${id})`}
      stroke="currentColor"
      strokeOpacity=".35"
      strokeWidth=".8"
    />
  );

  return (
    <svg className="flower__svg" viewBox="-100 -100 200 200" focusable="false">
      <defs>
        <radialGradient id={`petal-${id}`} cx="50%" cy="100%" r="100%">
          <stop offset="0" stopColor="currentColor" stopOpacity=".95" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".12" />
        </radialGradient>
      </defs>
      {angles.map((a) => petal(a, 1, `o-${a}`))}
      <g transform="rotate(18)">{angles.map((a) => petal(a, 0.6, `i-${a}`))}</g>
      <circle r="13" fill="currentColor" fillOpacity=".9" />
      <circle r="5" fill="#080a09" />
    </svg>
  );
}

// Decorative only; animated by About.jsx.
export default function Flowers() {
  return (
    <div className="flowers" aria-hidden="true">
      <div className="flower flower--a"><div className="flower__float"><Flower id="a" petals={10} /></div></div>
      <div className="flower flower--b"><div className="flower__float"><Flower id="b" petals={8} /></div></div>
      <div className="flower flower--c"><div className="flower__float"><Flower id="c" petals={7} /></div></div>
    </div>
  );
}
