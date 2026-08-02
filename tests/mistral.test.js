import { describe, it, expect, beforeEach } from "vitest";
import { loadScript, makeModel, modelNames, pressKey, rows, scrollTo, type } from "./helpers/dom.js";

const importMistral = () => import("../mistral.js");

const large = makeModel({
  id: "large",
  name: "Large 3",
  apiName: "mistral-large-latest",
  params: "675B",
  context: "262K tokens",
  inputPrice: "$2.00",
  outputPrice: "$6.00"
});

const codestral = makeModel({
  id: "codestral",
  name: "Codestral",
  apiName: "codestral-latest",
  category: "coding",
  categoryLabel: "Coding",
  params: "22B",
  context: "256K tokens",
  inputPrice: "$0.30",
  outputPrice: "$0.90",
  openWeight: true
});

const mixtral = makeModel({
  id: "mixtral",
  name: "Mixtral 8x7B",
  apiName: "open-mixtral-8x7b",
  params: "47B",
  context: "32K tokens",
  status: "deprecated"
});

const load = (models = [large, codestral, mixtral]) =>
  loadScript(importMistral, { models, globals: ["MISTRAL_MODELS"] });

describe("mistral.js", () => {
  beforeEach(() => load());

  it("reads models from window.MISTRAL_MODELS and hides deprecated ones", () => {
    expect(modelNames()).toEqual(["Large 3", "Codestral🔓"]);
  });

  it("filters by category", () => {
    document.querySelector('.filter-btn[data-filter="coding"]').click();
    expect(modelNames()).toEqual(["Codestral🔓"]);
  });

  it("uses the Mistral-specific legacy button label", () => {
    const btn = document.querySelector("#toggleLegacy");
    btn.click();
    expect(btn.textContent).toBe("Sembunyikan Legacy");
    expect(modelNames()).toContain("Mixtral 8x7B");
    btn.click();
    expect(btn.textContent).toBe("Tampilkan Legacy");
  });

  it("searches by api name", () => {
    type("#searchInput", "open-mixtral");
    expect(document.querySelector(".empty-state")).not.toBeNull();
    document.querySelector("#toggleLegacy").click();
    type("#searchInput", "open-mixtral");
    expect(modelNames()).toEqual(["Mixtral 8x7B"]);
  });

  it("sorts by context and by price", () => {
    document.querySelector('.sortable[data-sort="context"]').click();
    expect(modelNames()).toEqual(["Codestral🔓", "Large 3"]);
    document.querySelector('.sortable[data-sort="inputPrice"]').click();
    expect(modelNames()).toEqual(["Codestral🔓", "Large 3"]);
    document.querySelector('.sortable[data-sort="inputPrice"]').click();
    expect(modelNames()).toEqual(["Large 3", "Codestral🔓"]);
  });

  it("renders eight columns per row", () => {
    expect(rows()[0].querySelectorAll("td")).toHaveLength(8);
  });

  it("opens and closes the detail modal", () => {
    document.querySelectorAll(".btn-detail")[0].click();
    const overlay = document.querySelector("#modalOverlay");
    expect(overlay.classList.contains("show")).toBe(true);
    expect(document.querySelector("#modalContent").textContent).toContain("mistral-large-latest");
    pressKey("Escape");
    expect(overlay.classList.contains("show")).toBe(false);
  });

  it("ignores unknown model ids", () => {
    window.openModal("nope");
    expect(document.querySelector("#modalOverlay").classList.contains("show")).toBe(false);
  });

  it("sorts unpriced output and 'Proprietary' parameters to the front/back correctly", async () => {
    await load([
      large,
      makeModel({ id: "free", name: "Free Model", params: "Proprietary", outputPrice: "—", inputPrice: "$0.10" })
    ]);
    document.querySelector('.sortable[data-sort="outputPrice"]').click();
    expect(modelNames()).toEqual(["Large 3", "Free Model"]);
    document.querySelector('.sortable[data-sort="params"]').click();
    expect(modelNames()).toEqual(["Free Model", "Large 3"]);
  });

  it("sorts by name in both directions, normalising million-token contexts", async () => {
    await load([large, makeModel({ id: "huge", name: "Ministral Huge", context: "1M tokens" })]);
    const th = document.querySelector('.sortable[data-sort="name"]');
    th.click();
    expect(modelNames()).toEqual(["Large 3", "Ministral Huge"]);
    th.click();
    expect(modelNames()).toEqual(["Ministral Huge", "Large 3"]);
    document.querySelector('.sortable[data-sort="context"]').click();
    expect(modelNames()).toEqual(["Large 3", "Ministral Huge"]);
  });

  it("ignores unknown sort keys", () => {
    document.querySelector('.sortable[data-sort="unknown"]').click();
    expect(modelNames()).toEqual(["Large 3", "Codestral🔓"]);
  });

  it("shows the empty state when the search matches nothing", () => {
    type("#searchInput", "claude");
    expect(document.querySelector(".empty-state")).not.toBeNull();
    expect(document.querySelector("#compareBody td").getAttribute("colspan")).toBe("8");
  });

  it("closes the modal via the close button and the backdrop", () => {
    const overlay = document.querySelector("#modalOverlay");
    document.querySelectorAll(".btn-detail")[0].click();
    document.querySelector("#modalClose").click();
    expect(overlay.classList.contains("show")).toBe(false);

    document.querySelectorAll(".btn-detail")[0].click();
    overlay.click();
    expect(overlay.classList.contains("show")).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });

  it("wires the navbar scroll effect and mobile menu", () => {
    scrollTo(100);
    expect(document.querySelector("#navbar").classList.contains("scrolled")).toBe(true);
    const links = document.querySelector(".nav-links");
    document.querySelector("#navToggle").click();
    expect(links.classList.contains("open")).toBe(true);
    links.querySelector("a").click();
    expect(links.classList.contains("open")).toBe(false);
  });
});
