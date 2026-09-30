document.getElementById("year").textContent = new Date().getFullYear();

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

// Fade sections and cards in as they scroll into view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll("section:not(.hero), .card").forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});
