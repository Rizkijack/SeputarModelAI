import { describe, it, expect, beforeEach } from "vitest";
import { loadScript, makeModel, modelNames, pressKey, rows, scrollTo, type } from "./helpers/dom.js";

const importAnthropic = () => import("../anthropic.js");

const models = [
  makeModel({
    id: "opus",
    name: "Claude Opus",
    apiName: "claude-opus-latest",
    status: "active",
    context: "200K tokens",
    inputPrice: "$15.00",
    outputPrice: "$75.00"
  }),
  makeModel({
    id: "sonnet",
    name: "Claude Sonnet",
    apiName: "claude-sonnet-latest",
    category: "coding",
    categoryLabel: "Coding",
    status: "limited",
    context: "1M tokens",
    inputPrice: "$3.00",
    outputPrice: "—"
  }),
  makeModel({ id: "instant", name: "Claude Instant", apiName: "claude-instant-1", status: "deprecated" }),
  makeModel({ id: "claude-1", name: "Claude 1", apiName: "claude-1", status: "retired" }),
  makeModel({
    id: "mystery",
    name: "Claude Mystery",
    apiName: "claude-x",
    status: "unknown-status",
    context: "100K tokens",
    inputPrice: "$0.80",
    outputPrice: "$4.00"
  })
];

const load = () => loadScript(importAnthropic, { models, globals: ["ANTHROPIC_MODELS"] });

const badges = () => [...document.querySelectorAll("#compareBody .badge")].map((b) => b.textContent);

describe("anthropic.js — status handling", () => {
  beforeEach(() => load());

  it("hides both deprecated and retired models by default", () => {
    expect(modelNames()).toEqual(["Claude Opus", "Claude Sonnet", "Claude Mystery"]);
  });

  it("labels active, limited and unknown statuses", () => {
    expect(badges()).toEqual(expect.arrayContaining(["Active", "Limited"]));
    expect(document.querySelectorAll(".badge-ga")).toHaveLength(2);
    expect(document.querySelectorAll(".badge-limited")).toHaveLength(1);
  });

  it("marks legacy rows and their badges once legacy models are shown", () => {
    document.querySelector("#toggleLegacy").click();
    expect(modelNames()).toHaveLength(5);
    expect(badges()).toEqual(expect.arrayContaining(["Deprecated", "Retired"]));
    expect(document.querySelectorAll("#compareBody tr.legacy")).toHaveLength(2);
    expect(document.querySelector("#toggleLegacy").textContent).toBe("Sembunyikan model legacy");
  });

  it("renders seven columns per row", () => {
    expect(rows()[0].querySelectorAll("td")).toHaveLength(7);
  });

  it("shows the status label inside the detail modal", () => {
    document.querySelectorAll(".btn-detail")[1].click();
    const content = document.querySelector("#modalContent").textContent;
    expect(content).toContain("Claude Sonnet");
    expect(content).toContain("Limited");
  });

  it("shows the empty state with a 7-column span", () => {
    type("#searchInput", "gemini");
    expect(document.querySelector(".empty-state")).not.toBeNull();
    expect(document.querySelector("#compareBody td").getAttribute("colspan")).toBe("7");
  });
});

describe("anthropic.js — filtering, sorting and modal", () => {
  beforeEach(() => load());

  it("filters by category", () => {
    document.querySelector('.filter-btn[data-filter="coding"]').click();
    expect(modelNames()).toEqual(["Claude Sonnet"]);
  });

  it("searches by api name and category label", () => {
    type("#searchInput", "claude-x");
    expect(modelNames()).toEqual(["Claude Mystery"]);
    type("#searchInput", "coding");
    expect(modelNames()).toEqual(["Claude Sonnet"]);
  });

  it("sorts by name in both directions", () => {
    const th = document.querySelector('.sortable[data-sort="name"]');
    th.click();
    expect(modelNames()).toEqual(["Claude Mystery", "Claude Opus", "Claude Sonnet"]);
    th.click();
    expect(modelNames()).toEqual(["Claude Sonnet", "Claude Opus", "Claude Mystery"]);
    expect(th.classList.contains("sort-active")).toBe(true);
  });

  it("sorts by context and price, pushing unpriced models last", () => {
    document.querySelector('.sortable[data-sort="context"]').click();
    expect(modelNames()).toEqual(["Claude Mystery", "Claude Opus", "Claude Sonnet"]);
    document.querySelector('.sortable[data-sort="inputPrice"]').click();
    expect(modelNames()).toEqual(["Claude Mystery", "Claude Sonnet", "Claude Opus"]);
    document.querySelector('.sortable[data-sort="outputPrice"]').click();
    expect(modelNames()).toEqual(["Claude Mystery", "Claude Opus", "Claude Sonnet"]);
  });

  it("sorts by parameter count and ignores unknown sort keys", () => {
    document.querySelector('.sortable[data-sort="params"]').click();
    expect(modelNames()).toHaveLength(3);
    document.querySelector('.sortable[data-sort="unknown"]').click();
    expect(modelNames()).toEqual(["Claude Opus", "Claude Sonnet", "Claude Mystery"]);
  });

  it("closes the modal via the close button, the backdrop and Escape", () => {
    const overlay = document.querySelector("#modalOverlay");
    const open = () => document.querySelectorAll(".btn-detail")[0].click();

    open();
    expect(document.body.style.overflow).toBe("hidden");
    document.querySelector("#modalClose").click();
    expect(overlay.classList.contains("show")).toBe(false);
    expect(document.body.style.overflow).toBe("");

    open();
    overlay.click();
    expect(overlay.classList.contains("show")).toBe(false);

    open();
    pressKey("Escape");
    expect(overlay.classList.contains("show")).toBe(false);
  });

  it("ignores unknown model ids", () => {
    window.openModal("not-a-model");
    expect(document.querySelector("#modalOverlay").classList.contains("show")).toBe(false);
  });

  it("wires the navbar scroll effect and mobile menu", () => {
    scrollTo(80);
    expect(document.querySelector("#navbar").classList.contains("scrolled")).toBe(true);
    const links = document.querySelector(".nav-links");
    document.querySelector("#navToggle").click();
    expect(links.classList.contains("open")).toBe(true);
    links.querySelector("a").click();
    expect(links.classList.contains("open")).toBe(false);
  });
});
