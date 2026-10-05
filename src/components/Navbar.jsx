import React, { useState } from "react";

const links = [
  ["Home", "home"],
  ["About", "about"],
  ["Projects", "projects"],
  ["Code", "code"],
  ["Services", "services"],
  ["Experience", "experience"],
  ["Contact", "contact"],
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <a className="navbar__brand" href="#home" onClick={closeMenu} aria-label="Prashant Singh, home">
        <span className="navbar__monogram" aria-hidden="true">PS</span>
        <span className="navbar__name">
          PRASHANT <b>SINGH</b>
        </span>
      </a>

      <button
        className={`navbar__toggle${menuOpen ? " is-open" : ""}`}
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>

      <nav className={`navbar__links${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
        {links.map(([label, id]) => (
          <a href={`#${id}`} key={id} onClick={closeMenu}>
            {label}
          </a>
        ))}
        <a className="navbar__contact" href="#contact" onClick={closeMenu}>
          Get in touch <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}
