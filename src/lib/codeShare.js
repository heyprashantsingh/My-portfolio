const supportedLanguages = new Set([
  "javascript",
  "typescript",
  "xml",
  "css",
  "json",
  "python",
  "bash",
  "plaintext",
]);

function toBase64Url(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

function fromBase64Url(value) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function makeShareUrl(language, code) {
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const payload = toBase64Url(JSON.stringify({ language, code }));
  return `${window.location.origin}${window.location.pathname}${window.location.search}#share/${id}/${payload}`;
}

export function readShareFromHash(hash = window.location.hash) {
  const match = hash.match(/^#share\/([\w-]+)\/([\w-]+)$/u);
  if (!match) return null;

  try {
    const value = JSON.parse(fromBase64Url(match[2]));
    if (typeof value.code !== "string" || typeof value.language !== "string") return null;
    return {
      id: match[1],
      code: value.code,
      language: supportedLanguages.has(value.language) ? value.language : "plaintext",
      url: `${window.location.origin}${window.location.pathname}${window.location.search}${hash}`,
    };
  } catch {
    return null;
  }
}

export async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  if (!copied) throw new Error("Copy was not available in this browser.");
}
