
import React from "react";
import { site } from "../data/site.js";

export default function Contact() {
  const email = "singhhouse843@gmail.com";
  const instagram = "https://instagram.com/noor___ka___jharna";

  return (
    <section
      className="contact page-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="section-kicker" data-reveal>
        <span>07 / CONTACT</span>
      </div>

      <p className="eyebrow contact__eyebrow" data-reveal>
        GOOD THINGS START WITH A CONVERSATION
      </p>

      <h2 className="contact__title" id="contact-title" data-reveal>
        LET&apos;S WORK
        <br />
        <span>TOGETHER</span>
        <i>.</i>
      </h2>

      <div className="contact__bottom" data-reveal>
        <p>
          Have a project, an opportunity or an interesting idea?
          <br />
          I&apos;d love to hear about it.
        </p>

        <a
          className="button button--light contact__button"
          href={`mailto:${email}`}
        >
          Get in touch <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="contact__details">
        <div className="contact__email">
          <span>EMAIL</span>
          <a href={`mailto:${email}`}>{email}</a>
        </div>

        <div className="contact__socials">
          <span>ELSEWHERE</span>

          <div>
            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
            >
              Instagram <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

