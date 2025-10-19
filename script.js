document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('no-scroll', isOpen);
    });

    // Close menu on link click (mobile)
    nav.addEventListener('click', (e) => {
      if (e.target.matches('a') && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        document.body.classList.remove('no-scroll');
      }
    });

    // Close mobile nav when tapping backdrop
    const navBackdrop = document.querySelector('[data-close-nav]');
    if (navBackdrop && nav) {
      navBackdrop.addEventListener('click', () => {
        if (nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
          }
          document.body.classList.remove('no-scroll');
        }
      });
    }
  }

  // Update footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Back to top visibility
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 400) backToTop.classList.add('is-visible');
    else backToTop.classList.remove('is-visible');
  }
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  window.addEventListener('load', updateBackToTop);

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Lightweight client-side contact form handler (no backend)
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      if (!name || !email || !message) {
        alert('Please fill out all fields.');
        return;
      }

      const to = 'greatbuilds2018@gmail.com';
      const subject = `Website Contact - ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoUrl;
      setTimeout(() => form.reset(), 300);
    });
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('[data-modal-target]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const sel = el.getAttribute('data-modal-target');
      openModal(document.querySelector(sel));
    });
  });

  document.querySelectorAll('.modal [data-close], .modal .modal-backdrop').forEach(el => {
    el.addEventListener('click', () => closeModal(el.closest('.modal')));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.is-open').forEach(m => closeModal(m));
      if (nav && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Open menu');
        }
        document.body.classList.remove('no-scroll');
      }
    }
  });

  function getUsers() {
    try { return JSON.parse(localStorage.getItem('gb_users') || '{}'); } catch { return {}; }
  }
  function setUsers(users) { localStorage.setItem('gb_users', JSON.stringify(users)); }
  function setCurrentUser(email) { if (email) localStorage.setItem('gb_current_user', email); else localStorage.removeItem('gb_current_user'); }
  function getCurrentUser() { return localStorage.getItem('gb_current_user'); }

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const accountItem = document.getElementById('accountItem');
  const accountName = document.getElementById('accountName');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginLink = document.getElementById('loginLink');
  const signupLink = document.getElementById('signupLink');
  const loginToggle = document.getElementById('loginToggle');
  const loginPopover = document.getElementById('loginPopover');
  const loginPopoverForm = document.getElementById('loginPopoverForm');
  const openSignupFromPopover = document.getElementById('openSignupFromPopover');

  function positionLoginPopover() {
    if (!loginToggle || !loginPopover) return;
    const rect = loginToggle.getBoundingClientRect();
    const top = Math.round(rect.bottom + 8);
    const left = Math.round(Math.min(
      Math.max(rect.left - 220 + rect.width, 12), // try align right edge, clamp
      window.innerWidth - loginPopover.offsetWidth - 12
    ));
    loginPopover.style.top = top + 'px';
    loginPopover.style.left = left + 'px';
  }

  function openLoginPopover() {
    if (!loginPopover) return;
    loginPopover.classList.add('is-open');
    loginPopover.setAttribute('aria-hidden', 'false');
    positionLoginPopover();
    const emailInput = document.getElementById('loginPopEmail');
    if (emailInput) emailInput.focus();
  }

  function closeLoginPopover() {
    if (!loginPopover) return;
    loginPopover.classList.remove('is-open');
    loginPopover.setAttribute('aria-hidden', 'true');
  }

  function refreshAuthUI() {
    const users = getUsers();
    const current = getCurrentUser();
    if (current && users[current]) {
      if (loginLink) loginLink.classList.add('hidden');
      if (signupLink) signupLink.classList.add('hidden');
      if (accountItem) accountItem.classList.remove('hidden');
      if (accountName) accountName.textContent = users[current].name || current;
      closeLoginPopover();
    } else {
      if (loginLink) loginLink.classList.remove('hidden');
      if (signupLink) signupLink.classList.remove('hidden');
      if (accountItem) accountItem.classList.add('hidden');
      if (accountName) accountName.textContent = '';
    }
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(signupForm);
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim().toLowerCase();
      const password = (fd.get('password') || '').toString();
      if (!name || !email || !password) { alert('Please fill out all fields.'); return; }
      const users = getUsers();
      if (users[email]) { alert('An account with this email already exists.'); return; }
      users[email] = { name, email, password };
      setUsers(users);
      setCurrentUser(email);
      closeModal(document.getElementById('signupModal'));
      refreshAuthUI();
      alert('Account created. You are now signed in.');
      signupForm.reset();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(loginForm);
      const email = (fd.get('email') || '').toString().trim().toLowerCase();
      const password = (fd.get('password') || '').toString();
      const users = getUsers();
      if (!users[email] || users[email].password !== password) { alert('Invalid email or password.'); return; }
      setCurrentUser(email);
      closeModal(document.getElementById('loginModal'));
      refreshAuthUI();
      alert('Signed in successfully.');
      loginForm.reset();
    });
  }

  // Login via popover
  if (loginToggle) {
    loginToggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginPopover && loginPopover.classList.contains('is-open')) {
        closeLoginPopover();
      } else {
        openLoginPopover();
      }
    });
  }

  if (loginPopoverForm) {
    loginPopoverForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(loginPopoverForm);
      const email = (fd.get('email') || '').toString().trim().toLowerCase();
      const password = (fd.get('password') || '').toString();
      const users = getUsers();
      if (!users[email] || users[email].password !== password) { alert('Invalid email or password.'); return; }
      setCurrentUser(email);
      closeLoginPopover();
      refreshAuthUI();
      alert('Signed in successfully.');
      loginPopoverForm.reset();
    });
  }

  if (openSignupFromPopover) {
    openSignupFromPopover.addEventListener('click', () => {
      closeLoginPopover();
    });
  }

  // Close popover on outside click
  document.addEventListener('click', (e) => {
    const withinToggle = loginToggle && loginToggle.contains(e.target);
    const withinPopover = loginPopover && loginPopover.contains(e.target);
    if (!withinToggle && !withinPopover) {
      closeLoginPopover();
    }
    // Close mobile nav on outside click
    const withinNavToggle = navToggle && navToggle.contains(e.target);
    const withinNav = nav && nav.contains(e.target);
    if (nav && nav.classList.contains('is-open') && !withinNav && !withinNavToggle) {
      nav.classList.remove('is-open');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      }
      document.body.classList.remove('no-scroll');
    }
  }, true);

  // Reposition on resize/scroll
  window.addEventListener('resize', () => { if (loginPopover && loginPopover.classList.contains('is-open')) positionLoginPopover(); });
  // Close mobile nav when switching to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && nav && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      }
      document.body.classList.remove('no-scroll');
    }
  });
  window.addEventListener('scroll', () => { if (loginPopover && loginPopover.classList.contains('is-open')) positionLoginPopover(); }, true);

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setCurrentUser(null);
      refreshAuthUI();
      alert('You have been signed out.');
    });
  }

  // ========= Land Converter =========
  // Base areas in square feet for Nepali units
  const AANA_SQFT = 342.25;
  const ROPANI_SQFT = 16 * AANA_SQFT; // 5,476
  const PAISA_SQFT = AANA_SQFT / 4;   // 85.5625
  const DAAM_SQFT = AANA_SQFT / 16;   // 21.390625

  const KATTHA_SQFT = 3645;           // Terai standard
  const BIGHA_SQFT = 20 * KATTHA_SQFT; // 72,900
  const DHUR_SQFT = KATTHA_SQFT / 20;  // 182.25

  const SQM_PER_SQFT = 0.09290304;
  function sqftToSqm(sqft) { return sqft * SQM_PER_SQFT; }
  function sqmToSqft(sqm) { return sqm / SQM_PER_SQFT; }

  function rapdToSqft(r, a, p, d) {
    const totalAana = (Number(r)||0) * 16 + (Number(a)||0) + (Number(p)||0)/4 + (Number(d)||0)/16;
    return totalAana * AANA_SQFT;
  }
  function sqftToRapd(sqft) {
    let aanaTotal = sqft / AANA_SQFT;
    const r = Math.floor(aanaTotal / 16);
    aanaTotal -= r * 16;
    const a = Math.floor(aanaTotal);
    aanaTotal -= a;
    const pFloat = aanaTotal * 4;
    const p = Math.floor(pFloat + 1e-6);
    const d = Math.round((pFloat - p) * 16);
    return { r, a, p, d };
  }

  function bkdToSqft(b, k, d) {
    const totalKattha = (Number(b)||0) * 20 + (Number(k)||0) + (Number(d)||0)/20;
    return totalKattha * KATTHA_SQFT;
  }
  function sqftToBkd(sqft) {
    let katthaTotal = sqft / KATTHA_SQFT;
    const b = Math.floor(katthaTotal / 20);
    katthaTotal -= b * 20;
    const k = Math.floor(katthaTotal);
    katthaTotal -= k;
    const d = Math.round(katthaTotal * 20);
    return { b, k, d };
  }

  function fmt(n, d = 4) { return Number(n).toLocaleString(undefined, { maximumFractionDigits: d }); }
  function formatRapd(o) { return `${o.r} Ropani, ${o.a} Aana, ${o.p} Paisa, ${o.d} Daam`; }
  function formatBkd(o) { return `${o.b} Bigha, ${o.k} Kattha, ${o.d} Dhur`; }

  // R-A-P-D card
  const rConvert = document.getElementById('r_convert');
  const rClear = document.getElementById('r_clear');
  
  function updateRopaniResults() {
    const r = Number(document.getElementById('r_ropani')?.value || 0);
    const a = Number(document.getElementById('r_aana')?.value || 0);
    const p = Number(document.getElementById('r_paisa')?.value || 0);
    const d = Number(document.getElementById('r_daam')?.value || 0);
    
    const sqft = rapdToSqft(r, a, p, d);
    const sqm = sqftToSqm(sqft);
    const asBkd = sqftToBkd(sqft);
    
    // Calculate total in lower units
    const totalAana = r * 16 + a + p/4 + d/16;
    const totalPaisa = totalAana * 4;
    const totalDaam = totalPaisa * 4;
    
    const el = document.getElementById('r_results');
    if (el) {
      el.innerHTML = `
        <div><strong>Total in Ropani Units:</strong></div>
        <div>${fmt(totalAana,4)} Aana OR ${fmt(totalPaisa,3)} Paisa OR ${fmt(totalDaam,2)} Daam</div>
        <div><strong>Area:</strong> ${fmt(sqft,2)} sq ft OR ${fmt(sqm,3)} sq m</div>
        <div><strong>Bigha System:</strong> ${formatBkd(asBkd)}</div>
      `;
    }
  }
  
  if (rConvert) {
    rConvert.addEventListener('click', updateRopaniResults);
  }
  
  // Add real-time input handling
  ['r_ropani','r_aana','r_paisa','r_daam'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', updateRopaniResults);
    }
  });
  
  if (rClear) {
    rClear.addEventListener('click', () => {
      ['r_ropani','r_aana','r_paisa','r_daam'].forEach(id => { const i=document.getElementById(id); if(i) i.value=0; });
      const el = document.getElementById('r_results'); if (el) el.textContent = '';
    });
  }

  // B-K-D card
  const bConvert = document.getElementById('b_convert');
  const bClear = document.getElementById('b_clear');
  
  function updateBighaResults() {
    const b = Number(document.getElementById('b_bigha')?.value || 0);
    const k = Number(document.getElementById('b_kattha')?.value || 0);
    const d = Number(document.getElementById('b_dhur')?.value || 0);
    
    const sqft = bkdToSqft(b, k, d);
    const sqm = sqftToSqm(sqft);
    const asRapd = sqftToRapd(sqft);
    
    // Calculate total in lower units
    const totalKattha = b * 20 + k + d/20;
    const totalDhur = totalKattha * 20;
    
    const el = document.getElementById('b_results');
    if (el) {
      el.innerHTML = `
        <div><strong>Total in Bigha Units:</strong></div>
        <div>${fmt(totalKattha,4)} Kattha OR ${fmt(totalDhur,2)} Dhur</div>
        <div><strong>Area:</strong> ${fmt(sqft,2)} sq ft OR ${fmt(sqm,3)} sq m</div>
        <div><strong>Ropani System:</strong> ${formatRapd(asRapd)}</div>
      `;
    }
  }
  
  if (bConvert) {
    bConvert.addEventListener('click', updateBighaResults);
  }
  
  // Add real-time input handling
  ['b_bigha','b_kattha','b_dhur'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', updateBighaResults);
    }
  });
  
  if (bClear) {
    bClear.addEventListener('click', () => {
      ['b_bigha','b_kattha','b_dhur'].forEach(id => { const i=document.getElementById(id); if(i) i.value=0; });
      const el = document.getElementById('b_results'); if (el) el.textContent = '';
    });
  }

  // Any Unit Converter card
  const anyConvert = document.getElementById('any_convert');
  const anyClear = document.getElementById('any_clear');
  
  function updateAnyUnitResults() {
    const v = Number(document.getElementById('any_value')?.value || 0);
    const unit = document.getElementById('any_unit')?.value;
    let sqft = 0;
    switch (unit) {
      case 'sqft': sqft = v; break;
      case 'sqm': sqft = sqmToSqft(v); break;
      case 'acre': sqft = v * 43560; break;
      case 'hectare': sqft = v * 107639.104167; break;
      case 'ropani': sqft = v * ROPANI_SQFT; break;
      case 'aana': sqft = v * AANA_SQFT; break;
      case 'paisa': sqft = v * PAISA_SQFT; break;
      case 'daam': sqft = v * DAAM_SQFT; break;
      case 'bigha': sqft = v * BIGHA_SQFT; break;
      case 'kattha': sqft = v * KATTHA_SQFT; break;
      case 'dhur': sqft = v * DHUR_SQFT; break;
      default: sqft = 0;
    }
    const sqm = sqftToSqm(sqft);
    const asRapd = sqftToRapd(sqft);
    const asBkd = sqftToBkd(sqft);
    const el = document.getElementById('any_results');
    if (el) {
      el.innerHTML = `
        <div><strong>Converted:</strong></div>
        <div><strong>Area:</strong> ${fmt(sqft,2)} sq ft OR ${fmt(sqm,3)} sq m</div>
        <div><strong>International:</strong> ${fmt(sqft/43560,4)} acres OR ${fmt(sqft/107639.104167,4)} hectares</div>
        <div><strong>Ropani:</strong> ${formatRapd(asRapd)}</div>
        <div><strong>Bigha:</strong> ${formatBkd(asBkd)}</div>
      `;
    }
  }
  
  if (anyConvert) {
    anyConvert.addEventListener('click', updateAnyUnitResults);
  }
  
  // Add real-time input handling
  const anyValue = document.getElementById('any_value');
  const anyUnit = document.getElementById('any_unit');
  if (anyValue) anyValue.addEventListener('input', updateAnyUnitResults);
  if (anyUnit) anyUnit.addEventListener('change', updateAnyUnitResults);
  
  if (anyClear) {
    anyClear.addEventListener('click', () => {
      const v = document.getElementById('any_value'); if (v) v.value = 0;
      const el = document.getElementById('any_results'); if (el) el.textContent = '';
    });
  }

  // Plot calculator
  const plCalc = document.getElementById('pl_calc');
  const plClear = document.getElementById('pl_clear');
  
  function updatePlotResults() {
    const len = Number(document.getElementById('pl_len')?.value || 0);
    const wid = Number(document.getElementById('pl_wid')?.value || 0);
    const unit = document.getElementById('pl_unit')?.value;
    let sqft = 0;
    if (unit === 'ft') sqft = len * wid;
    else if (unit === 'm') sqft = sqmToSqft(len * wid);
    const sqm = sqftToSqm(sqft);
    const asRapd = sqftToRapd(sqft);
    const asBkd = sqftToBkd(sqft);
    const el = document.getElementById('pl_results');
    if (el) {
      el.innerHTML = `
        <div><strong>Area:</strong></div>
        <div>${fmt(sqft,2)} sq ft OR ${fmt(sqm,3)} sq m</div>
        <div><strong>Ropani:</strong> ${formatRapd(asRapd)}</div>
        <div><strong>Bigha:</strong> ${formatBkd(asBkd)}</div>
      `;
    }
  }
  
  if (plCalc) {
    plCalc.addEventListener('click', updatePlotResults);
  }
  
  // Add real-time input handling
  ['pl_len','pl_wid'].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.addEventListener('input', updatePlotResults);
  });
  const plUnit = document.getElementById('pl_unit');
  if (plUnit) plUnit.addEventListener('change', updatePlotResults);
  
  if (plClear) {
    plClear.addEventListener('click', () => {
      ['pl_len','pl_wid'].forEach(id => { const i = document.getElementById(id); if (i) i.value = 0; });
      const el = document.getElementById('pl_results'); if (el) el.textContent = '';
    });
  }

  // ========= end Land Converter =========

  refreshAuthUI();
});
