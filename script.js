document.getElementById("year").textContent = new Date().getFullYear();

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
