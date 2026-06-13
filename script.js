const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const quoteForm = document.querySelector("[data-quote-form]");

function setMenu(open) {
  menuButton?.setAttribute("aria-expanded", String(open));
  nav?.classList.toggle("is-open", open);
  document.body.classList.toggle("is-menu-open", open);
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  setMenu(!isOpen);
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    setMenu(false);
  }
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.14 },
);

document
  .querySelectorAll(".section-intro, .product-card, .image-card, .case-card, .process-list li, .technical-panel, .quote-form")
  .forEach((element) => {
    element.setAttribute("data-reveal", "");
    revealObserver.observe(element);
  });

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(quoteForm);
  const body = [
    `Equipment to protect: ${data.get("equipment") || "-"}`,
    `Approx. dimensions: ${data.get("dimensions") || "-"}`,
    `Quantity: ${data.get("quantity") || "-"}`,
    `Destination country: ${data.get("destination") || "-"}`,
    `Deadline: ${data.get("deadline") || "-"}`,
    `Contact: ${data.get("contact") || "-"}`,
    "",
    "Photos/drawings: I will attach them to this email.",
  ].join("\n");

  window.location.href = `mailto:contact@xcase.ro?subject=${encodeURIComponent(
    "Quote request - XCASE",
  )}&body=${encodeURIComponent(body)}`;
});
