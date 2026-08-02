import { describe, it, expect, beforeAll } from "vitest";

const DATASETS = [
  { file: "models.js", global: "MISTRAL_MODELS", statuses: ["general-availability", "deprecated"], generic: true },
  { file: "openai-models.js", global: "OPENAI_MODELS", statuses: ["general-availability", "deprecated"], generic: true },
  { file: "qwen-models.js", global: "QWEN_MODELS", statuses: ["general-availability", "deprecated"], generic: true },
  {
    file: "anthropic_models.js",
    global: "ANTHROPIC_MODELS",
    statuses: ["active", "limited", "deprecated", "retired"],
    generic: false
  }
];

const STRING_FIELDS = [
  "id",
  "family",
  "name",
  "apiName",
  "version",
  "category",
  "categoryLabel",
  "params",
  "context",
  "inputPrice",
  "outputPrice",
  "status",
  "release",
  "tagline",
  "bestFor",
  "story"
];

const loaders = {
  "models.js": () => import("../data/models.js"),
  "openai-models.js": () => import("../data/openai-models.js"),
  "qwen-models.js": () => import("../data/qwen-models.js"),
  "anthropic_models.js": () => import("../data/anthropic_models.js")
};

describe.each(DATASETS)("data/$file", ({ file, global: globalName, statuses, generic }) => {
  let models;
  let providerModelsAtLoad;

  beforeAll(async () => {
    await loaders[file]();
    models = window[globalName];
    providerModelsAtLoad = window.PROVIDER_MODELS;
  });

  it("publishes the catalog on its own window global", () => {
    expect(Array.isArray(models)).toBe(true);
    expect(models.length).toBeGreaterThan(0);
  });

  it(`${generic ? "feeds" : "does not feed"} the generic compare engine via window.PROVIDER_MODELS`, () => {
    if (generic) expect(providerModelsAtLoad).toBe(models);
    else expect(providerModelsAtLoad).not.toBe(models);
  });

  it("uses unique model ids", () => {
    const ids = models.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("defines every field the comparison table and modal render", () => {
    const incomplete = models
      .filter((m) => STRING_FIELDS.some((f) => typeof m[f] !== "string" || m[f].trim() === ""))
      .map((m) => m.id);
    expect(incomplete).toEqual([]);
  });

  it("uses non-empty modality and strength lists plus a boolean openWeight flag", () => {
    const invalid = models
      .filter(
        (m) =>
          !Array.isArray(m.modalities) ||
          m.modalities.length === 0 ||
          !Array.isArray(m.strengths) ||
          m.strengths.length === 0 ||
          typeof m.openWeight !== "boolean"
      )
      .map((m) => m.id);
    expect(invalid).toEqual([]);
  });

  it("uses only known status values", () => {
    const unexpected = [...new Set(models.map((m) => m.status))].filter((s) => !statuses.includes(s));
    expect(unexpected).toEqual([]);
  });

  it("formats release dates as YYYY, YYYY-MM or YYYY-MM-DD", () => {
    const bad = models.filter((m) => !/^\d{4}(-\d{2}(-\d{2})?)?$/.test(m.release)).map((m) => m.id);
    expect(bad).toEqual([]);
  });

  it("formats prices as a dollar amount, 'Gratis', or an em dash", () => {
    const bad = models
      .filter((m) => [m.inputPrice, m.outputPrice].some((p) => !/^(—|Gratis|\$[\d.,]+.*)$/.test(p)))
      .map((m) => m.id);
    expect(bad).toEqual([]);
  });

  it("assigns every model a category that a filter button can select", () => {
    const bad = models.filter((m) => !/^[a-z0-9-]+$/.test(m.category)).map((m) => m.id);
    expect(bad).toEqual([]);
  });
});
