import { initLang } from "./i18n.js";
import { initTheme } from "./theme.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  initLang();
  initTheme();
  initClock();
  initCursorGlow();
  initNav();
  initGenericReveal();
  initAboutPanel();
  initTimeline();
  initTerminalTyping();
  initProjectStack();
  initMagneticLinks();

  // release the opacity guard once everything is wired up
  requestAnimationFrame(() => document.body.classList.remove("is-loading"));
});

/* --------------------------------------------------------------------
   Clock — small living detail in the topbar
   -------------------------------------------------------------------- */
function initClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  const tick = () => {
    const now = new Date();
    el.textContent = now.toLocaleTimeString("es-ES", { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
}

/* --------------------------------------------------------------------
   Cursor glow — subtle radial light that follows the pointer
   -------------------------------------------------------------------- */
function initCursorGlow() {
  const glow = document.querySelector(".cursor-glow");
  if (!glow || prefersReducedMotion) return;

  let raf = null;
  window.addEventListener("pointermove", (e) => {
    document.body.classList.add("cursor-active");
    if (raf) return;
    raf = requestAnimationFrame(() => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      raf = null;
    });
  });
  window.addEventListener("pointerleave", () => document.body.classList.remove("cursor-active"));
}

/* --------------------------------------------------------------------
   Nav — sliding pill indicator that tracks the active section
   -------------------------------------------------------------------- */
function initNav() {
  const links = Array.from(document.querySelectorAll(".pillnav__link"));
  const indicator = document.querySelector(".pillnav__indicator");
  const sections = links
    .map((link) => document.getElementById(link.dataset.section))
    .filter(Boolean);

  function moveIndicator(link) {
    if (!link || !indicator) return;
    const navRect = link.parentElement.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    indicator.style.width = `${rect.width}px`;
    indicator.style.transform = `translateX(${rect.left - navRect.left}px)`;
    indicator.classList.add("is-visible");
    links.forEach((l) => l.classList.toggle("is-active", l === link));
  }

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => moveIndicator(link));
  });
  document.querySelector(".pillnav")?.addEventListener("mouseleave", () => {
    const active = links.find((l) => l.classList.contains("is-active"));
    moveIndicator(active);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = links.find((l) => l.dataset.section === entry.target.id);
          if (link) moveIndicator(link);
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );
  sections.forEach((s) => observer.observe(s));

  window.addEventListener("resize", () => {
    const active = links.find((l) => l.classList.contains("is-active"));
    if (active) moveIndicator(active);
  });
}

/* --------------------------------------------------------------------
   Generic reveal-on-scroll for elements marked [data-reveal]
   -------------------------------------------------------------------- */
function initGenericReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  els.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------
   About section — the panel that GROWS from a small box into a
   full-bleed pinned canvas as you scroll through it, then reveals
   its content. Pure scroll-progress driven, no scroll-jacking.
   -------------------------------------------------------------------- */
function initAboutPanel() {
  const section = document.querySelector(".about");
  const panel = document.querySelector(".about__panel");
  if (!section || !panel) return;

  const MIN_W = 30, MAX_W = 92; // vw
  const MIN_H = 30, MAX_H = 82; // vh
  const MIN_R = 32, MAX_R = 8; // px

  function update() {
    const rect = section.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const progress = total > 0 ? scrolled / total : 0;

    // growth happens across the first 60% of the scroll range,
    // then content fades in across the remaining 40% while pinned full-size
    const growProgress = Math.min(progress / 0.6, 1);
    const contentProgress = Math.max((progress - 0.55) / 0.45, 0);

    const eased = 1 - Math.pow(1 - growProgress, 3); // ease-out cubic

    const w = MIN_W + (MAX_W - MIN_W) * eased;
    const h = MIN_H + (MAX_H - MIN_H) * eased;
    const r = MIN_R + (MAX_R - MIN_R) * eased;

    panel.style.setProperty("--panel-w", `${w}vw`);
    panel.style.setProperty("--panel-h", `${h}vh`);
    panel.style.setProperty("--panel-r", `${r}px`);
    panel.style.setProperty("--panel-content-o", Math.min(contentProgress * 1.4, 1));
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

/* --------------------------------------------------------------------
   Education timeline — vertical progress line that fills with scroll,
   items that slide in individually.
   -------------------------------------------------------------------- */
function initTimeline() {
  const track = document.getElementById("timeline-fill");
  const items = document.querySelectorAll("[data-tl-item]");
  const timeline = document.querySelector(".timeline");
  if (!timeline) return;

  function updateFill() {
    if (!track) return;
    const rect = timeline.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.6;
    const total = rect.height;
    const scrolled = Math.min(Math.max(viewportCenter - rect.top, 0), total);
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    track.style.height = `${pct}%`;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.3 }
  );
  items.forEach((item) => observer.observe(item));

  updateFill();
  window.addEventListener("scroll", updateFill, { passive: true });
  window.addEventListener("resize", updateFill);
}

/* --------------------------------------------------------------------
   Experience terminal — lines "type" themselves in as the terminal
   scrolls into view, like a real shell session booting up.
   -------------------------------------------------------------------- */
function initTerminalTyping() {
  const terminal = document.querySelector(".terminal");
  const lines = document.querySelectorAll("[data-type-line]");
  if (!terminal || !lines.length) return;

  let started = false;

  function typeLine(line, cps = 55) {
    return new Promise((resolve) => {
      const full = line.textContent;
      if (prefersReducedMotion) {
        line.style.opacity = 1;
        resolve();
        return;
      }
      line.textContent = "";
      line.style.opacity = 1;
      let i = 0;
      const step = () => {
        line.textContent = full.slice(0, i);
        i++;
        if (i <= full.length) {
          setTimeout(step, 1000 / cps);
        } else {
          resolve();
        }
      };
      step();
    });
  }

  async function runSequence() {
    for (const line of lines) {
      await typeLine(line);
      await new Promise((r) => setTimeout(r, 90));
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          terminal.classList.add("is-typing");
          runSequence();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );
  observer.observe(terminal);
}

/* --------------------------------------------------------------------
   Projects — cards stack with a sticky-scale illusion: each card
   pins near the top and subtly scales/dims down as the next one
   arrives on top of it, creating a fluid layered-deck feel.
   -------------------------------------------------------------------- */
function initProjectStack() {
  const cards = document.querySelectorAll(".stack__card");
  if (!cards.length) return;

  function update() {
    cards.forEach((card, index) => {
      const inner = card.querySelector(".stack__card-inner");
      const rect = card.getBoundingClientRect();
      const next = cards[index + 1];

      if (!next) return; // last card never shrinks

      const nextRect = next.getBoundingClientRect();
      const stickyTop = window.innerHeight * 0.12;
      // progress of the *next* card approaching this one
      const distance = nextRect.top - stickyTop;
      const range = window.innerHeight * 0.9;
      const progress = 1 - Math.min(Math.max(distance / range, 0), 1);

      const scale = 1 - progress * 0.08;
      const opacity = 1 - progress * 0.45;
      const translate = progress * 14;

      inner.style.transform = `scale(${scale}) translateY(-${translate}px)`;
      inner.style.opacity = opacity;
    });
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

/* --------------------------------------------------------------------
   Magnetic contact links — text nudges toward the cursor
   -------------------------------------------------------------------- */
function initMagneticLinks() {
  if (prefersReducedMotion) return;
  document.querySelectorAll(".magnetic").forEach((link) => {
    const inner = link.querySelector(".magnetic__inner");
    if (!inner) return;

    link.addEventListener("mousemove", (e) => {
      const rect = link.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
      inner.style.transform = `translate(${x}px, ${y}px)`;
    });

    link.addEventListener("mouseleave", () => {
      inner.style.transform = "translate(0, 0)";
    });
  });
}
