import { describe, it, expect, beforeEach } from "vitest";
import {
  loadScript,
  makeModel,
  modelNames,
  pressKey,
  rows,
  scrollTo,
  type
} from "./helpers/dom.js";

const importCompare = () => import("../compare.js");

const zeta = makeModel({
  id: "zeta",
  name: "Zeta Model",
  apiName: "zeta-latest",
  params: "10B",
  context: "32K tokens",
  inputPrice: "$1.00",
  outputPrice: "$2.00",
  tagline: "Andal untuk produksi."
});

const alpha = makeModel({
  id: "alpha",
  name: "Alpha Model",
  apiName: "alpha-latest",
  category: "coding",
  categoryLabel: "Coding",
  params: "Proprietary",
  context: "1M tokens",
  inputPrice: "$0.50",
  outputPrice: "—",
  modalities: ["Teks", "Vision"],
  openWeight: true,
  tagline: "Spesialis koding."
});

const legacy = makeModel({
  id: "legacy",
  name: "Legacy Model",
  apiName: "legacy-latest",
  params: "200B",
  context: "128K tokens",
  inputPrice: "—",
  outputPrice: "$10.00",
  status: "deprecated"
});

const MODELS = [zeta, alpha, legacy];

const load = (models = MODELS) => loadScript(importCompare, { models });

const clickFilter = (filter) => document.querySelector(`.filter-btn[data-filter="${filter}"]`).click();
const clickSort = (key) => document.querySelector(`.sortable[data-sort="${key}"]`).click();

describe("compare.js — rendering", () => {
  beforeEach(() => load());

  it("renders only non-deprecated models by default", () => {
    expect(modelNames()).toEqual(["Zeta Model", "Alpha Model🔓"]);
  });

  it("renders api name, specs, modality and status badges", () => {
    const row = rows()[1];
    expect(row.querySelector(".model-api").textContent).toBe("alpha-latest");
    expect(row.querySelector(".open-weight")).not.toBeNull();
    expect([...row.querySelectorAll(".badge-modality")].map((b) => b.textContent)).toEqual(["Teks", "Vision"]);
    expect(row.querySelector(".badge-ga").textContent).toBe("GA");
    expect([...row.querySelectorAll("td")].map((td) => td.textContent.trim())).toEqual(
      expect.arrayContaining(["Proprietary", "1M tokens", "$0.50", "—"])
    );
  });

  it("shows an empty state when nothing matches", async () => {
    type("#searchInput", "tidak-ada-model-ini");
    expect(rows()).toHaveLength(1);
    expect(document.querySelector(".empty-state").textContent).toContain("Tidak ada model ditemukan");
  });

  it("renders an empty state instead of crashing when no data is loaded", async () => {
    await loadScript(importCompare, { models: null });
    expect(document.querySelector(".empty-state")).not.toBeNull();
  });
});

describe("compare.js — filtering", () => {
  beforeEach(() => load());

  it("filters by category and marks the active button", () => {
    clickFilter("coding");
    expect(modelNames()).toEqual(["Alpha Model🔓"]);
    expect(document.querySelector('.filter-btn[data-filter="all"]').classList.contains("active")).toBe(false);
    expect(document.querySelector('.filter-btn[data-filter="coding"]').classList.contains("active")).toBe(true);
  });

  it("toggles legacy models and updates the button label", () => {
    const btn = document.querySelector("#toggleLegacy");
    btn.click();
    expect(modelNames()).toContain("Legacy Model");
    expect(btn.textContent).toBe("Sembunyikan Legacy");
    expect(btn.classList.contains("active")).toBe(true);
    expect(rows()[2].classList.contains("deprecated")).toBe(true);

    btn.click();
    expect(modelNames()).not.toContain("Legacy Model");
    expect(btn.textContent).toBe("Tampilkan Legacy");
    expect(btn.classList.contains("active")).toBe(false);
  });

  it("searches case-insensitively across name, api name and tagline", () => {
    type("#searchInput", "  ZETA  ");
    expect(modelNames()).toEqual(["Zeta Model"]);

    type("#searchInput", "alpha-latest");
    expect(modelNames()).toEqual(["Alpha Model🔓"]);

    type("#searchInput", "koding");
    expect(modelNames()).toEqual(["Alpha Model🔓"]);

    type("#searchInput", "Coding");
    expect(modelNames()).toEqual(["Alpha Model🔓"]);
  });

  it("combines category filter with search", () => {
    clickFilter("generalist");
    type("#searchInput", "alpha");
    expect(document.querySelector(".empty-state")).not.toBeNull();
  });
});

describe("compare.js — sorting", () => {
  beforeEach(() => load());

  it("sorts by name and reverses on the second click", () => {
    clickSort("name");
    expect(modelNames()).toEqual(["Alpha Model🔓", "Zeta Model"]);
    clickSort("name");
    expect(modelNames()).toEqual(["Zeta Model", "Alpha Model🔓"]);
  });

  it("marks only the active sort column", () => {
    clickSort("name");
    clickSort("context");
    const active = [...document.querySelectorAll(".sort-active")].map((th) => th.dataset.sort);
    expect(active).toEqual(["context"]);
  });

  it("sorts numerically by context, normalising K and M suffixes", () => {
    clickSort("context");
    expect(modelNames()).toEqual(["Zeta Model", "Alpha Model🔓"]);
  });

  it("sorts by parameter count, treating 'Proprietary' as zero", () => {
    clickSort("params");
    expect(modelNames()).toEqual(["Alpha Model🔓", "Zeta Model"]);
  });

  it("sorts by input price", () => {
    clickSort("inputPrice");
    expect(modelNames()).toEqual(["Alpha Model🔓", "Zeta Model"]);
  });

  it("sorts unpriced models ('—') last", () => {
    clickSort("outputPrice");
    expect(modelNames()).toEqual(["Zeta Model", "Alpha Model🔓"]);
  });

  it("keeps the original order for unknown sort keys", () => {
    clickSort("unknown");
    expect(modelNames()).toEqual(["Zeta Model", "Alpha Model🔓"]);
  });
});

describe("compare.js — modal", () => {
  beforeEach(() => load());

  const openFirstDetail = () => document.querySelectorAll(".btn-detail")[1].click();

  it("opens with the full model detail and locks page scrolling", () => {
    openFirstDetail();
    const content = document.querySelector("#modalContent").textContent;
    expect(document.querySelector("#modalOverlay").classList.contains("show")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    expect(content).toContain("Alpha Model");
    expect(content).toContain("alpha-latest");
    expect(content).toContain("Teks, Vision");
    expect(content).toContain("🔓 Open-Weight");
    expect(content).toContain("Spesialis koding.");
    expect([...document.querySelectorAll(".strength-list li")].map((li) => li.textContent)).toEqual(
      alpha.strengths
    );
  });

  it("labels closed-weight models as proprietary", () => {
    document.querySelectorAll(".btn-detail")[0].click();
    expect(document.querySelector("#modalContent").textContent).toContain("🔒 Proprietary");
  });

  it("closes via the close button, the overlay backdrop and Escape", () => {
    const overlay = document.querySelector("#modalOverlay");

    openFirstDetail();
    document.querySelector("#modalClose").click();
    expect(overlay.classList.contains("show")).toBe(false);
    expect(document.body.style.overflow).toBe("");

    openFirstDetail();
    overlay.click();
    expect(overlay.classList.contains("show")).toBe(false);

    openFirstDetail();
    document.querySelector("#modalContent").click();
    expect(overlay.classList.contains("show")).toBe(true);

    pressKey("Escape");
    expect(overlay.classList.contains("show")).toBe(false);
  });

  it("ignores other keys", () => {
    openFirstDetail();
    pressKey("Enter");
    expect(document.querySelector("#modalOverlay").classList.contains("show")).toBe(true);
  });

  it("exposes openModal on window and ignores unknown ids", () => {
    expect(typeof window.openModal).toBe("function");
    window.openModal("does-not-exist");
    expect(document.querySelector("#modalOverlay").classList.contains("show")).toBe(false);
    expect(document.querySelector("#modalContent").innerHTML).toBe("");
  });
});

describe("compare.js — navbar", () => {
  beforeEach(() => load());

  it("toggles the scrolled class past the 30px threshold", () => {
    const navbar = document.querySelector("#navbar");
    expect(navbar.classList.contains("scrolled")).toBe(false);
    scrollTo(120);
    expect(navbar.classList.contains("scrolled")).toBe(true);
    scrollTo(0);
    expect(navbar.classList.contains("scrolled")).toBe(false);
  });

  it("opens the mobile menu and closes it when a link is clicked", () => {
    const links = document.querySelector(".nav-links");
    document.querySelector("#navToggle").click();
    expect(links.classList.contains("open")).toBe(true);
    links.querySelector("a").click();
    expect(links.classList.contains("open")).toBe(false);
  });

  it("initialises without throwing when the page has no compare widgets", async () => {
    await expect(loadScript(importCompare, { markup: "<main></main>", models: MODELS })).resolves.not.toThrow();
  });
});
