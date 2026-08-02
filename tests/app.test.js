import { describe, it, expect } from "vitest";
import { loadScript, scrollTo } from "./helpers/dom.js";

const importApp = () => import("../app.js");

const homeMarkup = `
  <nav id="navbar">
    <button id="navToggle"></button>
    <div class="nav-links"><a href="#a">A</a><a href="#b">B</a></div>
  </nav>
`;

const loadHome = (markup = homeMarkup) => loadScript(importApp, { markup, globals: [] });

describe("app.js — navbar scroll", () => {
  it("starts unscrolled and adds the class past 30px", async () => {
    await loadHome();
    const navbar = document.querySelector("#navbar");
    expect(navbar.classList.contains("scrolled")).toBe(false);
    scrollTo(31);
    expect(navbar.classList.contains("scrolled")).toBe(true);
  });

  it("removes the class when scrolling back to the top", async () => {
    await loadHome();
    scrollTo(500);
    scrollTo(10);
    expect(document.querySelector("#navbar").classList.contains("scrolled")).toBe(false);
  });

  it("applies the scrolled class immediately when the page loads mid-scroll", async () => {
    await loadScript(importApp, { markup: homeMarkup, globals: [], scrollY: 200 });
    expect(document.querySelector("#navbar").classList.contains("scrolled")).toBe(true);
  });
});

describe("app.js — mobile menu", () => {
  it("toggles the menu open and closed", async () => {
    await loadHome();
    const links = document.querySelector(".nav-links");
    const toggle = document.querySelector("#navToggle");
    toggle.click();
    expect(links.classList.contains("open")).toBe(true);
    toggle.click();
    expect(links.classList.contains("open")).toBe(false);
  });

  it("closes the menu after navigating via a link", async () => {
    await loadHome();
    const links = document.querySelector(".nav-links");
    document.querySelector("#navToggle").click();
    links.querySelectorAll("a")[1].click();
    expect(links.classList.contains("open")).toBe(false);
  });
});

describe("app.js — defensive init", () => {
  it("does nothing when the navbar and menu are absent", async () => {
    await expect(loadHome("<main></main>")).resolves.not.toThrow();
    expect(() => scrollTo(100)).not.toThrow();
  });

  it("skips the mobile menu when only the navbar exists", async () => {
    await loadHome('<nav id="navbar"></nav>');
    scrollTo(100);
    expect(document.querySelector("#navbar").classList.contains("scrolled")).toBe(true);
  });
});
