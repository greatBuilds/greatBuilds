document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu on link click (mobile)
    nav.addEventListener('click', (e) => {
      if (e.target.matches('a') && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
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
    }
  }, true);

  // Reposition on resize/scroll
  window.addEventListener('resize', () => { if (loginPopover && loginPopover.classList.contains('is-open')) positionLoginPopover(); });
  window.addEventListener('scroll', () => { if (loginPopover && loginPopover.classList.contains('is-open')) positionLoginPopover(); }, true);

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setCurrentUser(null);
      refreshAuthUI();
      alert('You have been signed out.');
    });
  }

  refreshAuthUI();
});
