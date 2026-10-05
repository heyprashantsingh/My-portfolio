import React, { useEffect, useMemo, useState } from "react";
import hljs from "highlight.js/lib/common";
import { copyText, makeShareUrl, readShareFromHash } from "../lib/codeShare.js";

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "xml", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "python", label: "Python" },
  { value: "bash", label: "Bash" },
  { value: "plaintext", label: "Plain text" },
];

const startingCode = `function createSomethingGood(idea) {
  return {
    idea,
    madeWith: "curiosity",
    readyToShare: true,
  };
}`;

function highlightedMarkup(code, language) {
  if (!code) return "";
  if (language === "plaintext") {
    return code.replace(/[&<>"']/gu, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }
  return hljs.highlight(code, { language, ignoreIllegals: true }).value;
}

export default function CodeShare() {
  const [sharedCode, setSharedCode] = useState(() => readShareFromHash());
  const [language, setLanguage] = useState(() => readShareFromHash()?.language ?? "javascript");
  const [code, setCode] = useState(() => readShareFromHash()?.code ?? startingCode);
  const [notice, setNotice] = useState("");

  const highlighted = useMemo(() => highlightedMarkup(code, language), [code, language]);
  const sharedHighlighted = useMemo(
    () => sharedCode ? highlightedMarkup(sharedCode.code, sharedCode.language) : "",
    [sharedCode],
  );

  useEffect(() => {
    if (!sharedCode) return;
    requestAnimationFrame(() => document.getElementById("code")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, []);

  async function handleCopy(value, message) {
    try {
      await copyText(value);
      setNotice(message);
    } catch {
      setNotice("Copy was unavailable. Select the text and copy it manually.");
    }
    window.setTimeout(() => setNotice(""), 2600);
  }

  function handleShare() {
    if (!code.trim()) {
      setNotice("Add some code before sharing.");
      window.setTimeout(() => setNotice(""), 2600);
      return;
    }
    const url = makeShareUrl(language, code);
    const share = readShareFromHash(new URL(url).hash);
    setSharedCode(share);
    window.history.pushState({}, "", url);
    setNotice("Share link created. Copy it to send your code.");
    window.setTimeout(() => setNotice(""), 3200);
  }

  function startAnother() {
    setSharedCode(null);
    setCode(startingCode);
    setLanguage("javascript");
    window.history.pushState({}, "", `${window.location.pathname}${window.location.search}#code`);
  }

  return (
    <section className="code-share page-section" id="code" aria-labelledby="code-title">
      <div className="section-kicker" data-reveal><span>04 / CODE SHARING</span><span>WRITE IT · SHARE IT</span></div>
      <div className="code-share__heading-row">
        <div>
          <p className="eyebrow code-share__eyebrow" data-reveal>SNIPPET STUDIO</p>
          <h2 className="display-heading" id="code-title" data-reveal>CODE, MADE<br /><span>SHAREABLE</span><i>.</i></h2>
        </div>
        <p className="code-share__intro" data-reveal>Paste a snippet, choose its language and make a link anyone can open. No account needed.</p>
      </div>

      {sharedCode ? (
        <div className="shared-code" data-reveal>
          <div className="shared-code__top">
            <div><span className="live-dot" /> SHARED CODE <span className="shared-code__id">/{sharedCode.id.slice(0, 8)}</span></div>
            <span className="language-pill">{languages.find((item) => item.value === sharedCode.language)?.label ?? "Plain text"}</span>
          </div>
          <pre className="code-panel code-panel--shared"><code className={`hljs language-${sharedCode.language}`} dangerouslySetInnerHTML={{ __html: sharedHighlighted }} /></pre>
          <div className="shared-code__actions">
            <button className="button button--light" type="button" onClick={() => handleCopy(sharedCode.code, "Code copied to clipboard.")}>Copy code <span aria-hidden="true">⧉</span></button>
            <button className="button button--outline" type="button" onClick={() => handleCopy(sharedCode.url, "Share link copied to clipboard.")}>Copy share link <span aria-hidden="true">↗</span></button>
            <button className="text-link shared-code__new" type="button" onClick={startAnother}>Create another snippet <span aria-hidden="true">＋</span></button>
          </div>
        </div>
      ) : (
        <div className="code-studio" data-reveal>
          <div className="code-studio__toolbar">
            <div className="code-studio__dots" aria-hidden="true"><i /><i /><i /></div>
            <label className="sr-only" htmlFor="code-language">Programming language</label>
            <select id="code-language" value={language} onChange={(event) => setLanguage(event.target.value)}>
              {languages.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
            </select>
            <span className="code-studio__live"><span className="live-dot" /> LIVE PREVIEW</span>
          </div>
          <div className="code-studio__panes">
            <label className="code-editor" htmlFor="code-input">
              <span className="code-pane__label">EDITOR <span>01</span></span>
              <textarea
                id="code-input"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                spellCheck="false"
                autoCapitalize="off"
                autoComplete="off"
                aria-label="Enter or paste code"
              />
            </label>
            <div className="code-preview">
              <span className="code-pane__label">HIGHLIGHTED PREVIEW <span>02</span></span>
              <pre className="code-panel"><code className={`hljs language-${language}`} dangerouslySetInnerHTML={{ __html: highlighted || " " }} /></pre>
            </div>
          </div>
          <div className="code-studio__footer">
            <p>Your snippet stays in this share URL. It is not uploaded to a server.</p>
            <div className="code-studio__actions">
              <button className="button button--outline" type="button" onClick={() => handleCopy(code, "Code copied to clipboard.")}>Copy code <span aria-hidden="true">⧉</span></button>
              <button className="button button--light" type="button" onClick={handleShare}>Share code <span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </div>
      )}
      <p className={`code-share__notice${notice ? " is-visible" : ""}`} role="status" aria-live="polite">{notice}</p>
    </section>
  );
}
