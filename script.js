const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const quoteForm = document.querySelector("[data-quote-form]");
const motionSection = document.querySelector("[data-motion-section]");
const motionVideo = document.querySelector("[data-motion-video]");
const motionProgress = document.querySelector("[data-motion-progress]");
const motionCallouts = [...document.querySelectorAll("[data-callout]")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

let motionReady = false;
let scrollTicking = false;

function updateMotion() {
  updateHeader();

  if (!motionSection || !motionVideo || reduceMotion.matches) {
    return;
  }

  const rect = motionSection.getBoundingClientRect();
  const scrollable = Math.max(1, rect.height - window.innerHeight);
  const progress = clamp(-rect.top / scrollable);
  const duration = Number.isFinite(motionVideo.duration) ? motionVideo.duration : 0;

  if (motionReady && duration > 0 && motionVideo.paused) {
    motionVideo.currentTime = progress * Math.max(0.1, duration - 0.08);
  }

  motionVideo.style.transform = `scale(${1.02 + progress * 0.08}) translateY(${-progress * 22}px)`;

  if (motionProgress) {
    motionProgress.style.transform = `scaleX(${progress})`;
  }

  const activeIndex = Math.min(motionCallouts.length - 1, Math.floor(progress * motionCallouts.length));
  motionCallouts.forEach((item, index) => {
    item.classList.toggle("is-active", index <= activeIndex);
  });
}

function requestMotionUpdate() {
  if (scrollTicking) {
    return;
  }

  scrollTicking = true;
  window.requestAnimationFrame(() => {
    updateMotion();
    scrollTicking = false;
  });
}

motionVideo?.addEventListener("loadedmetadata", () => {
  motionReady = true;
  updateMotion();
});

if (motionVideo?.readyState >= 1) {
  motionReady = true;
}

motionVideo?.addEventListener("canplay", () => {
  if (window.matchMedia("(max-width: 760px)").matches && !reduceMotion.matches) {
    motionVideo.loop = true;
    motionVideo.play().catch(() => {});
  }
});

window.addEventListener("scroll", requestMotionUpdate, { passive: true });
window.addEventListener("resize", requestMotionUpdate);
updateMotion();

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
