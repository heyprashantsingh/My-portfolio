import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <a className="footer__brand" href="#home">PS<span>.</span></a>
      <p>DESIGNED WITH INTENTION<br />BUILT WITH CURIOSITY</p>
      <a className="footer__top" href="#home">BACK TO TOP <span aria-hidden="true">↑</span></a>
      <span className="footer__copyright">© {new Date().getFullYear()} PRASHANT SINGH</span>
    </footer>
  );
}
