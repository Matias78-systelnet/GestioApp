/* ═══ components.js — Plantillas HTML reutilizables ═══
 * Reglas:
 *  - Todo texto que venga de datos pasa por Utils.esc().
 *  - Nada de onclick: usar data-go / data-action (ver actions.js).
 *  - Íconos decorativos con aria-hidden (usar Components.icon()).
 */

const Components = {

  icon(name, cls = '') {
    return `<i class="bi ${name}${cls ? ' ' + cls : ''}" aria-hidden="true"></i>`;
  },

  // ── Logo ──
  logo(dark = false) {
    return `
    <span class="logo-g ${dark ? 'logo-dark' : ''}">
      <span class="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" focusable="false"><path d="M19 7.5A8 8 0 1 0 20 13h-7"/></svg>
        <span class="logo-dot"></span>
      </span>
      <span class="logo-word">Gestio<span>App</span></span>
    </span>`;
  },

  // ── Barra naranja de soporte ──
  topBar() {
    const s = CONFIG.support;
    const tel = s.phone.replace(/\s/g, '');
    return `
    <div class="topbar-g">
      <div class="container-xl d-flex justify-content-between align-items-center gap-3">
        <nav class="d-flex gap-3 gap-sm-4" aria-label="Ayuda">
          <a href="mailto:${Utils.esc(s.email)}?subject=Soporte%20GestioApp">${Components.icon('bi-life-preserver')} Soporte</a>
          <a href="#/${s.faqRoute}" data-go="${s.faqRoute}">${Components.icon('bi-question-circle')} FAQs</a>
        </nav>
        <div class="d-flex gap-3 gap-sm-4">
          <a href="mailto:${Utils.esc(s.email)}" class="d-none d-sm-inline-flex">${Components.icon('bi-envelope')} ${Utils.esc(s.email)}</a>
          <a href="tel:${Utils.esc(tel)}" aria-label="Llamar a soporte: ${Utils.esc(s.phone)}">${Components.icon('bi-telephone')} <span class="mono">${Utils.esc(s.phone)}</span></a>
        </div>
      </div>
    </div>`;
  },

  // ── Layout de la app autenticada ──
  appLayout(activePage) {
    const user = Auth.getUser() || { name: 'Usuario', role: '', email: '' };
    const items = Object.keys(ROUTES).filter(k => ROUTES[k].nav && Auth.canView(k));
    const current = k => (k === activePage ? ' aria-current="page"' : '');
    const helpHref = `mailto:${Utils.esc(CONFIG.support.email)}?subject=Solicitud%20de%20asistencia%20GestioApp`;

    return `
    <div class="app-shell">
      ${Components.topBar()}
      <header class="navbar-g" id="navbar">
        <div class="container-xl d-flex align-items-center justify-content-between gap-3 navbar-row">
          <a href="#/${Auth.firstAllowedRoute()}" data-go="${Auth.firstAllowedRoute()}" class="brand-link" aria-label="${Utils.esc(CONFIG.app.name)}, ir al inicio">${Components.logo()}</a>

          <nav class="d-none d-lg-block" aria-label="Principal">
            <ul class="nav-list-g">
              ${items.map(k => `<li><a href="#/${k}" data-go="${k}" class="nav-g${k === activePage ? ' active' : ''}"${current(k)}>${ROUTES[k].title}</a></li>`).join('')}
            </ul>
          </nav>

          <div class="d-flex align-items-center gap-2 gap-sm-3">
            <a href="${helpHref}" class="btn btn-brand d-none d-xl-inline-flex">${Components.icon('bi-headset')} Solicitar asistencia</a>
            <div class="profile-g" id="profile">
              <button type="button" class="profile-btn" data-action="toggle-profile" aria-expanded="false" aria-controls="profile-menu">
                <span class="avatar-g" aria-hidden="true">${Utils.esc(Utils.initials(user.name))}<span class="avatar-status"></span></span>
                <span class="profile-text d-none d-xl-block">
                  <strong>${Utils.esc(user.name)}</strong>
                  <small>${Utils.esc(user.role)}</small>
                </span>
                <span class="visually-hidden d-xl-none">Menú de ${Utils.esc(user.name)}</span>
                ${Components.icon('bi-chevron-down', 'd-none d-xl-block')}
              </button>
              <div class="profile-menu" id="profile-menu" hidden>
                <div class="profile-head">
                  <strong>${Utils.esc(user.name)}</strong>
                  <small>${Utils.esc(user.email)} · ${Utils.esc(user.role)}</small>
                </div>
                ${Auth.canView('configuracion') ? `<a href="#/configuracion" data-go="configuracion">${Components.icon('bi-gear')} Configuración</a>` : ''}
                <button type="button" class="danger" data-action="logout">${Components.icon('bi-box-arrow-right')} Cerrar sesión</button>
              </div>
            </div>
            <button type="button" class="burger-g d-lg-none" id="burger" data-action="toggle-menu" aria-expanded="false" aria-controls="mobile-menu">
              ${Components.icon('bi-list')}<span class="visually-hidden">Abrir menú de navegación</span>
            </button>
          </div>
        </div>
        <nav class="mobile-menu-g d-lg-none" id="mobile-menu" aria-label="Principal (móvil)" hidden>
          <div class="container-xl py-3">
            <ul class="list-unstyled m-0">
              ${items.map(k => `<li><a href="#/${k}" data-go="${k}" class="nav-mobile-g${k === activePage ? ' active' : ''}"${current(k)}>${Components.icon(ROUTES[k].icon)} ${ROUTES[k].title}</a></li>`).join('')}
            </ul>
            <div class="d-flex gap-2 mt-3 pt-3 mobile-menu-foot">
              <a href="${helpHref}" class="btn btn-brand flex-fill">${Components.icon('bi-headset')} Solicitar asistencia</a>
              <button type="button" class="btn btn-ghost-light" data-action="logout">${Components.icon('bi-box-arrow-right')}<span class="visually-hidden">Cerrar sesión</span></button>
            </div>
          </div>
        </nav>
      </header>

      <main id="main" class="page-g" tabindex="-1"></main>

      <footer class="footer-g">
        <div class="container-xl d-flex flex-column flex-sm-row justify-content-between gap-2">
          <span>© ${new Date().getFullYear()} ${Utils.esc(CONFIG.app.company)} — ${Utils.esc(CONFIG.app.country)}</span>
          <span class="mono">v${Utils.esc(CONFIG.app.version)}${Api.mode === 'mock' ? ' · modo demostración' : ''}</span>
        </div>
      </footer>
    </div>`;
  },

  // ── Menús del navbar ──
  toggleMenu(force) {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('burger');
    if (!menu || !btn) return;
    const open = force !== undefined ? force : menu.hidden;
    menu.hidden = !open;
    requestAnimationFrame(() => menu.classList.toggle('open', open));
    btn.setAttribute('aria-expanded', String(open));
    btn.innerHTML = Components.icon(open ? 'bi-x-lg' : 'bi-list')
      + `<span class="visually-hidden">${open ? 'Cerrar' : 'Abrir'} menú de navegación</span>`;
    if (open) menu.querySelector('a, button')?.focus();
  },

  toggleProfile(force) {
    const wrap = document.getElementById('profile');
    if (!wrap) return;
    const menu = document.getElementById('profile-menu');
    const btn = wrap.querySelector('.profile-btn');
    const open = force !== undefined ? force : menu.hidden;
    menu.hidden = !open;
    wrap.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open) menu.querySelector('a, button')?.focus();
  },

  // returnFocus: al cerrar con Escape, el foco vuelve al botón que abrió el menú
  closeMenus(returnFocus = false) {
    const profileOpen = document.getElementById('profile')?.classList.contains('open');
    const menuOpen = document.getElementById('mobile-menu') && !document.getElementById('mobile-menu').hidden;
    if (profileOpen) {
      Components.toggleProfile(false);
      if (returnFocus) document.querySelector('.profile-btn')?.focus();
    }
    if (menuOpen) {
      Components.toggleMenu(false);
      if (returnFocus) document.getElementById('burger')?.focus();
    }
  },

  // ── Hero de cada página interna ──
  pageHero({ eyebrow, title, accent = '', subtitle = '', subtitleId = '', actions = '', image = 'racks' }) {
    return `
    <section class="hero-g hero-page" data-bg="${image}" aria-labelledby="page-title">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="container-xl position-relative d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-4">
        <div class="stagger">
          ${eyebrow ? `<p class="eyebrow-g reveal"><span aria-hidden="true"></span>${eyebrow}</p>` : ''}
          <h1 class="hero-title-sm reveal" id="page-title" tabindex="-1">${title}${accent ? ` <em>${accent}</em>` : ''}</h1>
          <p class="hero-sub reveal"${subtitleId ? ` id="${subtitleId}"` : ''}>${subtitle}</p>
        </div>
        ${actions ? `<div class="d-flex flex-wrap gap-2 reveal">${actions}</div>` : ''}
      </div>
    </section>`;
  },

  // Aplica las fotos de fondo vía CSSOM (compatible con CSP estricta)
  applyBackgrounds(root) {
    root.querySelectorAll('[data-bg]').forEach(el => {
      const url = CONFIG.images[el.dataset.bg];
      if (url) el.style.setProperty('--hero-img', `url("${url.replace(/"/g, '%22')}")`);
    });
  },

  sectionHeader(title, eyebrow = '', id = '') {
    return `
    <div class="section-head-g">
      <div>
        ${eyebrow ? `<p class="kicker-g">${eyebrow}</p>` : ''}
        <h2${id ? ` id="${id}"` : ''}>${title}</h2>
      </div>
    </div>`;
  },

  statCard(label, value, icon, tone = 'brand', tag = '', alert = false) {
    return `
    <li class="col-6 col-md-4 col-lg reveal">
      <div class="stat-g tone-${tone}">
        <div class="d-flex justify-content-between align-items-center gap-2">
          <span class="stat-icon-g">${Components.icon(icon)}</span>
          ${tag}
        </div>
        <p class="stat-value">${Utils.esc(value)}</p>
        <p class="stat-label">${label}</p>
        ${alert ? '<span class="stat-alert" aria-hidden="true"></span>' : ''}
      </div>
    </li>`;
  },

  // ── Modal ── role: 'dialog' | 'alertdialog'
  modal(id, titleHtml, bodyHtml, footerHtml = '', size = '', role = 'dialog') {
    return `
    <div id="${id}" class="modal-g" aria-hidden="true">
      <div class="modal-box-g ${size}" role="${role}" aria-modal="true" aria-labelledby="${id}-title">
        <div class="modal-head-g">
          <h2 id="${id}-title">${titleHtml}</h2>
          <button type="button" class="modal-x" data-action="modal-close">${Components.icon('bi-x-lg')}<span class="visually-hidden">Cerrar</span></button>
        </div>
        <div class="modal-body-g">${bodyHtml}</div>
        ${footerHtml ? `<div class="modal-foot-g">${footerHtml}</div>` : ''}
      </div>
    </div>`;
  },

  // ── Campo de formulario accesible (label + ayuda + error enlazados) ──
  field({ id, name, label, type = 'text', placeholder = '', required = false, autocomplete = 'off', hint = '', inputmode = '', cls = '', value = '' }) {
    const describedBy = [hint ? id + '-hint' : '', id + '-error'].filter(Boolean).join(' ');
    return `
    <div class="mb-3">
      <label for="${id}" class="form-label label-g">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
      <input type="${type}" id="${id}" name="${name}" class="form-control input-g ${cls}" placeholder="${Utils.esc(placeholder)}"
        autocomplete="${autocomplete}" ${inputmode ? `inputmode="${inputmode}"` : ''} ${required ? 'required aria-required="true"' : ''}
        aria-describedby="${describedBy}" value="${Utils.esc(value)}">
      ${hint ? `<p class="field-hint" id="${id}-hint">${hint}</p>` : ''}
      <p class="field-error" id="${id}-error" hidden></p>
    </div>`;
  },

  selectField({ id, name, label, options, required = false, hint = '' }) {
    const opts = options.map(o => (typeof o === 'string'
      ? `<option value="${Utils.esc(o)}">${Utils.esc(o)}</option>`
      : `<option value="${Utils.esc(o.value)}">${Utils.esc(o.label)}</option>`)).join('');
    const describedBy = [hint ? id + '-hint' : '', id + '-error'].filter(Boolean).join(' ');
    return `
    <div class="mb-3">
      <label for="${id}" class="form-label label-g">${label}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
      <select id="${id}" name="${name}" class="form-select input-g" ${required ? 'required aria-required="true"' : ''} aria-describedby="${describedBy}">${opts}</select>
      ${hint ? `<p class="field-hint" id="${id}-hint">${hint}</p>` : ''}
      <p class="field-error" id="${id}-error" hidden></p>
    </div>`;
  },

  formIntro() {
    return '<p class="form-note">Los campos con <span class="req" aria-hidden="true">*</span><span class="visually-hidden">asterisco</span> son obligatorios.</p><p class="form-summary" hidden></p>';
  },

  // ── Badge ──
  badge(text, type = 'default', dot = false) {
    const classes = {
      pri: 'badge-g-brand', grn: 'badge-g-green', red: 'badge-g-red',
      ylw: 'badge-g-amber', dark: 'badge-g-dark', default: 'badge-g-slate',
    };
    return `<span class="badge-g ${classes[type] || classes.default}">${dot ? '<i class="dot" aria-hidden="true"></i>' : ''}${Utils.esc(text)}</span>`;
  },

  empty(text) {
    return `<p class="empty-g">${text}</p>`;
  },
};

// Cerrar el menú de perfil al hacer clic fuera
document.addEventListener('click', (e) => {
  const p = document.getElementById('profile');
  if (p && p.classList.contains('open') && !p.contains(e.target)) Components.toggleProfile(false);
});

// Navbar más opaco al hacer scroll
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });
