// ==========================================================================
// theme — dark/light con transición tipo "veil" circular
// ==========================================================================

export function initTheme() {
  const root = document.documentElement;
  const stored = localStorage.getItem("pf-theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const initial = stored || (prefersLight ? "light" : "dark");
  root.setAttribute("data-theme", initial);

  const toggle = document.getElementById("theme-toggle");
  const veil = document.querySelector(".theme-veil");

  toggle?.addEventListener("click", (e) => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !veil) {
      root.setAttribute("data-theme", next);
      localStorage.setItem("pf-theme", next);
      return;
    }

    const rect = toggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const maxDim = Math.hypot(window.innerWidth, window.innerHeight);

    // color the veil with the *incoming* background so it looks like a wipe
    const incomingBg = next === "dark" ? "#0a0b0d" : "#f6f5f2";
    veil.style.setProperty("--veil-x", `${x}px`);
    veil.style.setProperty("--veil-y", `${y}px`);
    veil.style.setProperty("--veil-color", incomingBg);
    veil.style.transform = "translate(-50%, -50%) scale(0)";
    veil.classList.remove("is-animating");

    requestAnimationFrame(() => {
      veil.classList.add("is-animating");
      veil.style.transform = `translate(-50%, -50%) scale(${(maxDim / 1) * 1.2})`;
    });

    window.setTimeout(() => {
      root.setAttribute("data-theme", next);
      localStorage.setItem("pf-theme", next);
    }, 320);

    window.setTimeout(() => {
      veil.classList.remove("is-animating");
      veil.style.transform = "translate(-50%, -50%) scale(0)";
    }, 640);
  });
}
