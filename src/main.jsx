import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { prepareIntro } from "./lib/motion.js";
import "./index.css";
import "./App.css";
import "./cinematic.css"; // must come after App.css: it deliberately overrides a few rules

prepareIntro(); // hides the UI via CSS before first paint, so nothing flashes before the intro

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
