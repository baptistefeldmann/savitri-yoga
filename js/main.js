/* =========================================================
   Savitri Yoga · Saint-Malo — Interactions
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Année dans le footer ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mode clair / sombre ---------- */
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const stored = localStorage.getItem("savitri-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("savitri-theme", next);
  });

  /* ---------- Menu mobile ---------- */
  const navToggle = $("#navToggle");
  const mainNav = $("#mainNav");
  const closeNav = () => {
    mainNav?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  };
  navToggle?.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  $$("#mainNav a").forEach((a) => a.addEventListener("click", closeNav));

  /* ---------- Header au défilement + barre de progression ---------- */
  const header = $("#siteHeader");
  const progress = $("#scrollProgress");
  const toTop = $("#toTop");
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("scrolled", y > 10);
    toTop?.classList.toggle("show", y > 600);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ---------- Animations d'apparition ----------
     IntersectionObserver pour l'effet, + filets de sécurité pour
     garantir que le contenu ne reste JAMAIS masqué (observer inactif,
     rendu hors-écran, navigateur exotique...). */
  const revealEls = $$(".reveal");
  const show = (el) => el.classList.add("visible");
  const inViewport = (el) => {
    const r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || 0) + 80 && r.bottom > 0;
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
    // Révèle immédiatement ce qui est déjà à l'écran (above-the-fold)
    revealEls.forEach((el) => { if (inViewport(el)) show(el); });
    // Filet de sécurité : si rien n'a été révélé, on affiche tout
    setTimeout(() => {
      if (!document.querySelector(".reveal.visible")) revealEls.forEach(show);
    }, 1200);
  } else {
    revealEls.forEach(show);
  }

  /* ---------- Planning & lieux (rendu depuis data/contenu.js) ----------
     Le contenu vit dans window.SAVITRI_DATA. On génère ici le tableau
     des horaires, les cartes de lieux et les boutons de filtre. En cas
     de données absentes ou mal formées, on affiche un message clair
     plutôt qu'une page cassée. */
  const escapeHTML = (str) =>
    String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));

  const scheduleBody = $("#scheduleBody");
  const filtersEl = $("#scheduleFilters");
  const locationsGrid = $("#locationsGrid");

  const showDataError = (msg) => {
    console.error("[Savitri] " + msg);
    if (scheduleBody) {
      scheduleBody.innerHTML =
        `<tr><td colspan="4" style="padding:1.5rem;color:#c0392b">⚠️ ${escapeHTML(msg)}</td></tr>`;
    }
  };

  function renderPlanning() {
    const data = window.SAVITRI_DATA;
    if (!data || !Array.isArray(data.lieux) || !Array.isArray(data.planning)) {
      showDataError("Contenu introuvable ou invalide dans data/contenu.js. Vérifiez le fichier (guillemets, virgules).");
      return;
    }

    // Table de correspondance id -> nom du lieu
    const nomParId = {};
    data.lieux.forEach((l) => { nomParId[l.id] = l.nom; });

    // 1) Boutons de filtre : "Tous les lieux" + un par lieu
    if (filtersEl) {
      const boutons = [{ id: "all", nom: "Tous les lieux" }].concat(data.lieux);
      filtersEl.innerHTML = boutons
        .map((b, i) =>
          `<button class="chip${i === 0 ? " is-active" : ""}" data-filter="${escapeHTML(b.id)}" type="button">${escapeHTML(b.nom)}</button>`
        )
        .join("");
    }

    // 2) Lignes du planning
    if (scheduleBody) {
      scheduleBody.innerHTML = data.planning
        .map((c) => {
          const lieuNom = nomParId[c.lieu] || c.lieu || "—";
          return `<tr data-loc="${escapeHTML(c.lieu)}">` +
            `<td data-th="Jour">${escapeHTML(c.jour)}</td>` +
            `<td data-th="Horaire">${escapeHTML(c.horaire)}</td>` +
            `<td data-th="Cours">${escapeHTML(c.cours)}</td>` +
            `<td data-th="Lieu">${escapeHTML(lieuNom)}</td>` +
            `</tr>`;
        })
        .join("");
    }

    // 3) Cartes de lieux
    if (locationsGrid) {
      locationsGrid.innerHTML = data.lieux
        .map((l) =>
          `<article class="loc-card"><h4>${escapeHTML(l.nom)}</h4>` +
          `<p>${escapeHTML(l.adresse).replace(/\n/g, "<br />")}</p></article>`
        )
        .join("");
    }

    // 4) Comportement des filtres (attaché après génération)
    const filterChips = $$(".schedule-filters .chip");
    const rows = $$("#scheduleBody tr");
    filterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        filterChips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        const f = chip.dataset.filter;
        rows.forEach((r) => {
          r.style.display = f === "all" || r.dataset.loc === f ? "" : "none";
        });
      });
    });
  }

  try {
    renderPlanning();
  } catch (err) {
    showDataError("Erreur de lecture de data/contenu.js : " + err.message);
  }

  /* ---------- Galerie (photos noir & blanc du studio + lightbox) ----------
     Photos reprises du site original (galerie N&B). object-fit: cover gère
     le recadrage ; loading="lazy" diffère le chargement hors-écran. */
  const gallery = $("#gallery");
  const photos = [
    { src: "assets/photos/galerie/nb-01.jpg", cap: "Recueillement" },
    { src: "assets/photos/galerie/nb-02.jpg", cap: "Posture assise" },
    { src: "assets/photos/galerie/nb-03.jpg", cap: "En cercle" },
    { src: "assets/photos/galerie/nb-04.jpg", cap: "Cours collectif" },
    { src: "assets/photos/galerie/nb-05.jpg", cap: "Flexion avant" },
    { src: "assets/photos/galerie/nb-06.jpg", cap: "Coin méditation" },
    { src: "assets/photos/galerie/nb-07.jpg", cap: "Souffle" },
    { src: "assets/photos/galerie/nb-08.jpg", cap: "Relaxation" },
    { src: "assets/photos/galerie/nb-09.jpg", cap: "Au studio" },
    { src: "assets/photos/galerie/nb-10.jpg", cap: "Ambiance du studio" },
    { src: "assets/photos/galerie/nb-11.jpg", cap: "Posture debout" },
    { src: "assets/photos/galerie/nb-12.jpg", cap: "Étirement" },
  ];

  if (gallery) {
    photos.forEach((p, i) => {
      const btn = document.createElement("button");
      btn.className = "gallery-item";
      btn.type = "button";
      btn.setAttribute("aria-label", "Agrandir : " + p.cap);
      btn.dataset.index = i;
      btn.innerHTML =
        `<img src="${p.src}" alt="${escapeHTML(p.cap)}" loading="lazy" />` +
        `<span class="cap">${escapeHTML(p.cap)}</span>`;
      gallery.appendChild(btn);
    });
  }

  const lightbox = $("#lightbox");
  const lightboxContent = $("#lightboxContent");
  const lightboxClose = $("#lightboxClose");
  const openLightbox = (i) => {
    const p = photos[i];
    lightboxContent.innerHTML = `<img src="${p.src}" alt="${escapeHTML(p.cap)}" />`;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  };
  const hideLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  };
  gallery?.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (item) openLightbox(Number(item.dataset.index));
  });
  lightboxClose?.addEventListener("click", hideLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) hideLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) hideLightbox();
  });

  /* ---------- Formulaire de contact (validation + envoi Netlify Forms) ---------- */
  const form = $("#contactForm");
  const success = $("#formSuccess");
  const setError = (name, msg) => {
    const field = form.querySelector(`[name="${name}"]`)?.closest(".field");
    const err = form.querySelector(`.error[data-for="${name}"]`);
    if (field) field.classList.toggle("invalid", Boolean(msg));
    if (err) err.textContent = msg || "";
  };
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    // Le formulaire porte name="contact" (requis par Netlify) : on lit donc les
    // valeurs par id plutôt que via form.name (qui renverrait "contact").
    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const message = $("#message").value.trim();

    if (!name) { setError("name", "Merci d'indiquer votre nom."); ok = false; }
    else setError("name", "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", "Adresse email invalide."); ok = false;
    } else setError("email", "");

    if (message.length < 10) {
      setError("message", "Votre message est un peu court (10 caractères min.)."); ok = false;
    } else setError("message", "");

    if (!ok) return;

    // Affiche la confirmation et réinitialise le formulaire
    const showSent = () => {
      form.reset();
      if (success) {
        success.hidden = false;
        setTimeout(() => { success.hidden = true; }, 6000);
      }
    };

    // Soumission compatible Netlify Forms : POST AJAX vers la même page, encodé
    // en application/x-www-form-urlencoded (inclut le champ caché form-name).
    const payload = new URLSearchParams(new FormData(form)).toString();
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload,
    })
      .then((res) => { if (!res.ok) throw new Error(String(res.status)); showSent(); })
      .catch(() => { showSent(); }); // en local (hors Netlify), l'endpoint n'existe pas : on simule l'envoi
  });

  /* ---------- Widget de respiration guidée ---------- */
  const circle = $("#breatheCircle");
  const word = $("#breatheWord");
  const toggleBtn = $("#breatheToggle");
  const cyclesEl = $("#breatheCycles");
  const modeChips = $$(".breathe-modes .chip");

  const patterns = {
    // [libellé, durée(s)] par phase
    calm: [["Inspirez", 4], ["Retenez", 7], ["Expirez", 8]],
    box: [["Inspirez", 4], ["Retenez", 4], ["Expirez", 4], ["Pause", 4]],
    energy: [["Inspirez", 4], ["Expirez", 4]],
  };

  let running = false;
  let mode = "calm";
  let phase = 0;
  let cycles = 0;
  let timer = null;

  modeChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      modeChips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      mode = chip.dataset.mode;
      if (running) restart();
    });
  });

  function applyPhase() {
    const [label, secs] = patterns[mode][phase];
    if (word) word.textContent = label;
    circle.classList.remove("grow", "shrink", "hold");
    circle.style.transitionDuration = secs + "s";
    if (label === "Inspirez") circle.classList.add("grow");
    else if (label === "Expirez") circle.classList.add("shrink");
    else circle.classList.add("hold");

    timer = setTimeout(() => {
      phase = (phase + 1) % patterns[mode].length;
      if (phase === 0) {
        cycles += 1;
        if (cyclesEl) cyclesEl.textContent = String(cycles);
      }
      applyPhase();
    }, secs * 1000);
  }

  function start() {
    running = true;
    phase = 0;
    toggleBtn.textContent = "Arrêter";
    applyPhase();
  }
  function stop() {
    running = false;
    clearTimeout(timer);
    toggleBtn.textContent = "Commencer";
    circle.classList.remove("grow", "shrink", "hold");
    circle.style.transitionDuration = "1s";
    if (word) word.textContent = "Prêt ?";
  }
  function restart() {
    clearTimeout(timer);
    phase = 0;
    applyPhase();
  }
  toggleBtn?.addEventListener("click", () => (running ? stop() : start()));
})();
