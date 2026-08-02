import { vi } from "vitest";

/** Markup shared by every provider comparison page (mistral/openai/qwen/anthropic). */
export const comparePageMarkup = `
  <nav id="navbar">
    <button id="navToggle"></button>
    <div class="nav-links"><a href="#a">A</a><a href="#b">B</a></div>
  </nav>
  <button class="filter-btn active" data-filter="all">Semua</button>
  <button class="filter-btn" data-filter="generalist">Generalist</button>
  <button class="filter-btn" data-filter="coding">Coding</button>
  <input id="searchInput" />
  <button id="toggleLegacy">Tampilkan Legacy</button>
  <table>
    <thead>
      <tr>
        <th class="sortable" data-sort="name">Model</th>
        <th class="sortable" data-sort="params">Parameter</th>
        <th class="sortable" data-sort="context">Konteks</th>
        <th class="sortable" data-sort="inputPrice">Input</th>
        <th class="sortable" data-sort="outputPrice">Output</th>
        <th class="sortable" data-sort="unknown">Lainnya</th>
      </tr>
    </thead>
    <tbody id="compareBody"></tbody>
  </table>
  <div id="modalOverlay"><div id="modalContent"></div><button id="modalClose"></button></div>
`;

/** Builds a model record; overrides win over the defaults. */
export function makeModel(overrides = {}) {
  return {
    id: "model-a",
    family: "Fixture",
    name: "Model A",
    apiName: "model-a-latest",
    version: "1.0",
    category: "generalist",
    categoryLabel: "Generalist / Flagship",
    params: "10B",
    context: "32K tokens",
    inputPrice: "$1.00",
    outputPrice: "$2.00",
    modalities: ["Teks"],
    openWeight: false,
    status: "general-availability",
    release: "2026-01",
    tagline: "Model fixture untuk pengujian.",
    strengths: ["Cepat", "Murah"],
    bestFor: "Pengujian unit.",
    story: "Sebuah model fiksi.",
    ...overrides
  };
}

/**
 * Renders `markup`, publishes `models` on the given window globals and
 * (re-)executes the script under test so its IIFE initialises against the DOM.
 * `importer` must be a callback doing the dynamic import from the test file,
 * e.g. `() => import("../compare.js")`.
 */
export async function loadScript(importer, { markup = comparePageMarkup, models = [], globals = ["PROVIDER_MODELS"], scrollY = 0 } = {}) {
  document.body.innerHTML = markup;
  document.body.style.overflow = "";
  for (const name of globals) {
    if (models === null) delete window[name];
    else window[name] = models;
  }
  window.scrollY = scrollY;
  vi.resetModules();
  await importer();
}

export const rows = () => [...document.querySelectorAll("#compareBody tr")];

export const modelNames = () =>
  [...document.querySelectorAll("#compareBody .model-name")].map((el) => el.textContent.trim());

export function scrollTo(y) {
  window.scrollY = y;
  window.dispatchEvent(new window.Event("scroll"));
}

export function pressKey(key) {
  document.dispatchEvent(new window.KeyboardEvent("keydown", { key }));
}

export function type(selector, value) {
  const input = document.querySelector(selector);
  input.value = value;
  input.dispatchEvent(new window.Event("input"));
}
