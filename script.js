/* ============================================================
   Maestro Gino Da Silva - Interacciones
   Vanilla JS / sin dependencias
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Anio dinamico en el footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header con fondo al hacer scroll ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Reveal al entrar en pantalla ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = entry.target.getAttribute("data-delay") || 0;
            entry.target.style.transitionDelay = delay + "ms";
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Meta Pixel: evento de contacto al clic en WhatsApp ---------- */
  var waLinks = document.querySelectorAll('a[href*="wa.me"]');
  waLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (typeof window.fbq === "function") {
        window.fbq("track", "Contact", { content_name: "WhatsApp" });
        window.fbq("trackCustom", "ClicWhatsApp", { ubicacion: this.className || "enlace" });
      }
    });
  });

  /* ---------- Smooth scroll para anclas internas ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    });
  });

  /* ---------- Fondo de particulas (luces suaves doradas) ---------- */
  var canvas = document.getElementById("particles");
  if (canvas && !prefersReduced) {
    var ctx = canvas.getContext("2d");
    var w, h, particles, raf;
    var COLORS = ["rgba(212,175,55,", "rgba(246,226,122,", "rgba(186,148,255,"];

    function size() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function makeParticles() {
      var count = Math.min(70, Math.floor((w * h) / 26000));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.9 + 0.4,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          a: Math.random() * 0.5 + 0.1,
          tw: Math.random() * 0.02 + 0.004,
          c: COLORS[Math.floor(Math.random() * COLORS.length)],
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.tw;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        var alpha = p.a + Math.sin(p.phase) * 0.25;
        if (alpha < 0) alpha = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + alpha.toFixed(3) + ")";
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.c + "0.6)";
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    }

    function init() {
      size();
      makeParticles();
      cancelAnimationFrame(raf);
      draw();
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 200);
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) cancelAnimationFrame(raf);
      else draw();
    });

    init();
  }

  /* ---------- Parallax sutil del retrato del hero ---------- */
  var heroPortrait = document.getElementById("maestroHero");
  if (heroPortrait && !prefersReduced && window.matchMedia("(min-width: 901px)").matches) {
    window.addEventListener(
      "scroll",
      function () {
        var offset = Math.min(window.scrollY * 0.04, 24);
        heroPortrait.style.transform = "translateY(" + offset + "px)";
      },
      { passive: true }
    );
  }
})();
