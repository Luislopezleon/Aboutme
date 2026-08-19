import { initLang } from "./i18n.js";
import { initTheme } from "./theme.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  initLang();
  initTheme();
  initClock();
  initCursorDot();
  initNav();
  initSplitText();
  initGenericReveal();
  initAboutPanel();
  initTimeline();
  initTerminalTyping();
  initProjectsHorizontal();
  initMagneticLinks();
  initScrollProgress();
  initDividerReveal();
  initSkillsGridGlow();

  requestAnimationFrame(() => document.body.classList.remove("is-loading"));
});

/* --------------------------------------------------------------------
   Clock
   -------------------------------------------------------------------- */
function initClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString("es-ES", { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
}

/* --------------------------------------------------------------------
   Custom cursor dot — expands on interactive elements
   -------------------------------------------------------------------- */
function initCursorDot() {
  const dot = document.querySelector(".cursor-dot");
  if (!dot || prefersReducedMotion) return;
  if (window.matchMedia("(pointer: coarse)").matches) return;

  let mx = 0, my = 0, cx = 0, cy = 0;
  let visible = false;

  window.addEventListener("pointermove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!visible) { visible = true; dot.classList.add("is-visible"); }
  });
  window.addEventListener("pointerleave", () => {
    visible = false;
    dot.classList.remove("is-visible");
  });

  // Smooth follow with lerp
  function animate() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  }
  animate();

  // Expand on interactive elements
  const interactives = "a, button, .magnetic, .project-card__badge--link, .skills__tags li, .topbar__brand";
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest(interactives)) dot.classList.add("is-hovering");
  });
  document.addEventListener("pointerout", (e) => {
    if (e.target.closest(interactives)) dot.classList.remove("is-hovering");
  });
}

/* --------------------------------------------------------------------
   Nav — pill indicator
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
   Split Text — splits hero title into individual characters with
   a 3D rotation reveal animation
   -------------------------------------------------------------------- */
function initSplitText() {
  const titles = document.querySelectorAll("[data-split]");
  titles.forEach((title) => {
    const blocks = title.querySelectorAll(".lang-block");
    blocks.forEach((block) => {
      const text = block.textContent.trim();
      block.textContent = "";
      let charIndex = 0;

      text.split("").forEach((char) => {
        if (char === " ") {
          const space = document.createElement("span");
          space.className = "word-space";
          block.appendChild(space);
        } else {
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = char;
          span.style.setProperty("--char-i", charIndex);
          block.appendChild(span);
          charIndex++;
        }
      });
    });
  });
}

/* --------------------------------------------------------------------
   Generic reveal-on-scroll
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
    { threshold: 0.15 }
  );
  els.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------
   About — Cinematic panel growth
   Slow, deliberate, satisfying. The panel starts tiny, grows into
   a full-bleed hero with smooth spring-like easing. Content fades in
   progressively DURING the growth so there's no dead time.
   -------------------------------------------------------------------- */
function initAboutPanel() {
  const section = document.querySelector(".about");
  const panel = document.querySelector(".about__panel");
  if (!section || !panel) return;

  const MIN_W = 18, MAX_W = 96; // vw
  const MIN_H = 16, MAX_H = 88; // vh
  const MIN_R = 44, MAX_R = 0; // px (full bleed = no radius)

  function fade(progress, start, end) {
    return Math.min(Math.max((progress - start) / (end - start), 0), 1);
  }

  // Custom easing — starts slow, accelerates in the middle, decelerates at end
  function cinematicEase(t) {
    // smooth S-curve (sine-based)
    return t < 0.5
      ? (1 - Math.cos(t * Math.PI)) / 2
      : (1 - Math.cos(t * Math.PI)) / 2;
  }

  let ticking = false;
  let currentW = MIN_W, currentH = MIN_H, currentR = MIN_R;
  let targetW = MIN_W, targetH = MIN_H, targetR = MIN_R;

  function update() {
    const rect = section.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const progress = total > 0 ? scrolled / total : 0;

    // Growth spans 0% — 60% of scroll (slow, cinematic)
    const growRaw = Math.min(progress / 0.6, 1);
    const eased = cinematicEase(growRaw);

    targetW = MIN_W + (MAX_W - MIN_W) * eased;
    targetH = MIN_H + (MAX_H - MIN_H) * eased;
    targetR = MIN_R + (MAX_R - MIN_R) * eased;

    // Lerp for extra smoothness
    currentW += (targetW - currentW) * 0.12;
    currentH += (targetH - currentH) * 0.12;
    currentR += (targetR - currentR) * 0.12;

    panel.style.setProperty("--panel-w", `${currentW}vw`);
    panel.style.setProperty("--panel-h", `${currentH}vh`);
    panel.style.setProperty("--panel-r", `${currentR}px`);

    // Content reveals overlap with growth — starts early, staggers in
    panel.style.setProperty("--panel-grid-o", fade(progress, 0.05, 0.25));
    panel.style.setProperty("--panel-label-o", fade(progress, 0.15, 0.35));
    panel.style.setProperty("--panel-heading-o", fade(progress, 0.25, 0.50));
    panel.style.setProperty("--panel-body-o", fade(progress, 0.40, 0.65));

    ticking = false;
    // Keep animating if lerping hasn't converged
    if (Math.abs(targetW - currentW) > 0.01) {
      requestAnimationFrame(update);
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { currentW = targetW; currentH = targetH; currentR = targetR; update(); });
}

/* --------------------------------------------------------------------
   Timeline
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
    { threshold: 0.25 }
  );
  items.forEach((item) => observer.observe(item));

  updateFill();
  window.addEventListener("scroll", updateFill, { passive: true });
  window.addEventListener("resize", updateFill);
}

/* --------------------------------------------------------------------
   Terminal typing
   -------------------------------------------------------------------- */
function initTerminalTyping() {
  const terminal = document.querySelector(".terminal");
  const lines = document.querySelectorAll("[data-type-line]");
  if (!terminal || !lines.length) return;

  let started = false;

  function typeLine(line, cps = 60) {
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
        if (i <= full.length) setTimeout(step, 1000 / cps);
        else resolve();
      };
      step();
    });
  }

  async function runSequence() {
    for (const line of lines) {
      await typeLine(line);
      await new Promise((r) => setTimeout(r, 60));
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
    { threshold: 0.35 }
  );
  observer.observe(terminal);
}

/* --------------------------------------------------------------------
   Projects — Horizontal scroll driven by vertical scrolling
   Cards slide horizontally as you scroll vertically through the
   300vh container. Smooth, premium Apple-style.
   -------------------------------------------------------------------- */
function initProjectsHorizontal() {
  const wrapper = document.querySelector(".projects-scroll");
  const track = document.getElementById("projects-track");
  if (!wrapper || !track) return;

  let ticking = false;

  function update() {
    const rect = wrapper.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const progress = total > 0 ? scrolled / total : 0;

    // Calculate how far to shift: total track width minus one viewport
    const trackWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;
    const maxShift = trackWidth - viewportWidth + 100; // 100px end padding

    const shift = progress * maxShift;
    track.style.transform = `translateX(-${shift}px)`;

    // Subtle parallax on individual cards
    const cards = track.querySelectorAll(".project-card");
    cards.forEach((card, i) => {
      const cardProgress = progress * cards.length - i;
      const rotation = Math.max(-2, Math.min(2, (cardProgress - 0.5) * 1.5));
      const scale = 1 - Math.abs(cardProgress - 0.5) * 0.02;
      card.style.transform = `rotateY(${rotation}deg) scale(${Math.max(0.96, scale)})`;
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update);
}

/* --------------------------------------------------------------------
   Magnetic links
   -------------------------------------------------------------------- */
function initMagneticLinks() {
  if (prefersReducedMotion) return;
  document.querySelectorAll(".magnetic").forEach((link) => {
    const inner = link.querySelector(".magnetic__inner");
    if (!inner) return;

    link.addEventListener("mousemove", (e) => {
      const rect = link.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
      inner.style.transform = `translate(${x}px, ${y}px)`;
    });

    link.addEventListener("mouseleave", () => {
      inner.style.transform = "translate(0, 0)";
    });
  });
}

/* --------------------------------------------------------------------
   Scroll progress bar
   -------------------------------------------------------------------- */
function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;

  let ticking = false;
  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

/* --------------------------------------------------------------------
   Section dividers — line draws on scroll
   -------------------------------------------------------------------- */
function initDividerReveal() {
  const dividers = document.querySelectorAll(".section-divider");
  if (!dividers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  dividers.forEach((d) => observer.observe(d));
}

/* --------------------------------------------------------------------
   Skills grid — radial glow follows cursor across the whole grid
   -------------------------------------------------------------------- */
function initSkillsGridGlow() {
  if (prefersReducedMotion) return;
  const groups = document.querySelectorAll(".skills__group");
  groups.forEach((group) => {
    group.addEventListener("mousemove", (e) => {
      const rect = group.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      group.style.setProperty("--mouse-x", `${x}px`);
      group.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}
