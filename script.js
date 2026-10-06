const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// GSAP + ScrollTrigger and Motion (window.Motion) are loaded from assets/vendor
// (copied from npm on build)
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// DialKit tuning panel: development only. Loads on localhost or with ?dial in the URL.
// Register controls with: dialkit.then(DialKit => DialKit.createDialKit("Name", {...}))
const siteRoot = new URL(".", document.currentScript.src);
const dialkitEnabled =
  ["localhost", "127.0.0.1"].includes(location.hostname) ||
  new URLSearchParams(location.search).has("dial");

window.dialkit = dialkitEnabled
  ? new Promise((resolve, reject) => {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = new URL("assets/vendor/dialkit/styles.css", siteRoot);
      document.head.append(css);

      const js = document.createElement("script");
      js.src = new URL("assets/vendor/dialkit/browser.global.js", siteRoot);
      js.onload = () => {
        DialKit.createDialRoot();
        resolve(DialKit);
      };
      js.onerror = reject;
      document.head.append(js);
    })
  : new Promise(() => {}); // never resolves in production, so dev-only tuning code stays inert

// Header gets a hairline once the page scrolls past the top
const header = document.getElementById("site-header");
const heroTop = document.getElementById("top");
if (header && heroTop) {
  new IntersectionObserver(([entry]) => {
    header.classList.toggle("is-scrolled", entry.boundingClientRect.top < 0);
  }, { threshold: [0, 1] }).observe(heroTop);
}

// Projects and principles rise in as they enter the viewport. Only elements that
// start below the fold opt in, so nothing on the first screen is ever hidden.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".project, .principle-note").forEach((el, i) => {
  if (el.getBoundingClientRect().top < window.innerHeight) return;
  el.classList.add("reveal");
  if (el.classList.contains("principle-note")) el.style.transitionDelay = `${(i % 4) * 60}ms`;
  observer.observe(el);
});

// Copy email
const copyBtn = document.getElementById("copy-email");
if (copyBtn) {
  const label = document.getElementById("copy-label");
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("yarakazem@gmail.com");
      label.textContent = "Copied";
    } catch {
      label.textContent = "Select the address to copy";
    }
    setTimeout(() => (label.textContent = "Copy"), 2000);
  });
}

// Light / dark toggle. Follows the system until the visitor chooses; the choice is remembered.
const themeBtn = document.getElementById("theme-toggle");
if (themeBtn) {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  const current = () => root.dataset.theme || (systemDark.matches ? "dark" : "light");
  const sync = () => {
    const next = current() === "dark" ? "light" : "dark";
    themeBtn.setAttribute("aria-label", `Switch to ${next} mode`);
    const board = getComputedStyle(root).getPropertyValue("--board").trim();
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", board));
  };
  themeBtn.addEventListener("click", () => {
    root.dataset.theme = current() === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch {}
    sync();
  });
  systemDark.addEventListener("change", sync);
  sync();
}

// FigJam-style entrance: the floating panels glide in from their own edges, once per page load
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  [
    [".fj-panel-left", "translateY(-14px)", "none"],
    [".fj-panel-right", "translateY(-14px)", "none"],
    [".fj-toolbar", "translateX(-50%) translateY(28px)", "translateX(-50%)"],
  ].forEach(([sel, from, to], i) => {
    document.querySelector(sel)?.animate(
      [{ opacity: 0, transform: from }, { opacity: 1, transform: to }],
      { duration: 560, delay: 80 + i * 70, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "backwards" }
    );
  });
}
