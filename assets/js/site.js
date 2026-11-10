/*-----------------------------------*\
  Jay Chan — site behaviour
  Header state, mobile nav, reveal, progress, form
\*-----------------------------------*/

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header state + progress ---------- */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".progress");

  function onScroll() {
    var y = window.scrollY || 0;
    if (header) header.classList.toggle("is-stuck", y > 8);
    if (progress) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(100, (y / max) * 100) : 0;
      progress.style.width = pct + "%";
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
  }

  /* ---------- theme ---------- */
  var themeBtn = document.querySelector(".theme-toggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var themeKey = "jay-theme";

  function paintTheme(theme) {
    var dark = theme === "dark";
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    if (themeMeta) themeMeta.setAttribute("content", dark ? "#141310" : "#f4f1ea");
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", String(dark));
      themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  paintTheme(document.documentElement.getAttribute("data-theme") || "light");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      paintTheme(next);
      try { localStorage.setItem(themeKey, next); } catch (e) {}
    });
  }

  var themeSaved = null;
  try { themeSaved = localStorage.getItem(themeKey); } catch (e) {}
  if (!themeSaved && window.matchMedia) {
    var themeMq = window.matchMedia("(prefers-color-scheme: dark)");
    if (themeMq.addEventListener) {
      themeMq.addEventListener("change", function (e) {
        paintTheme(e.matches ? "dark" : "light");
      });
    }
  }

  /* ---------- reveal ---------- */
  var revealables = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- skill bars ---------- */
  document.querySelectorAll(".skill-fill").forEach(function (bar) {
    var w = bar.getAttribute("data-width") || "50";
    bar.style.setProperty("--v", w + "%");
  });

  /* ---------- current year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
