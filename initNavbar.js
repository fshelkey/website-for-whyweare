export function initNavbar() {
  const toggle = document.querySelector('.navbar-toggler');
  const menu = document.querySelector('.navbar-collapse');
  if (!toggle) throw new Error('initNavbar: .navbar-toggler element not found');
  if (!menu) throw new Error('initNavbar: .navbar-collapse element not found');

  // Initialize ARIA state
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', menu.id || '');

  // Toggle menu visibility
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('show');
    toggle.setAttribute('aria-expanded', isOpen.toString());
  });

  // Smooth-scroll handler
  function smoothScroll(event) {
    event.preventDefault();
    const trigger = event.currentTarget;
    const href = trigger.getAttribute('href') || trigger.getAttribute('data-target');
    if (!href || !href.startsWith('#')) return;
    // Sanitize selector
    const safeId = href.replace(/[^#A-Za-z0-9\-_]/g, '');
    const target = document.querySelector(safeId);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Collapse mobile menu if open
    if (menu.classList.contains('show')) {
      menu.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    }
    // Update URL hash without jump
    history.replaceState(null, '', safeId);
  }

  // Bind smooth scroll to nav links
  const navLinks = document.querySelectorAll('.navbar .nav-link[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', smoothScroll);
  });

  // Bind smooth scroll to CTA button
  const cta = document.querySelector('.btn-cta[href^="#"], .btn-cta[data-target]');
  if (!cta) {
    console.warn('initNavbar: .btn-cta element with href or data-target not found');
  } else {
    cta.addEventListener('click', smoothScroll);
  }

  // Close menu on ESC key when open
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('show')) {
      menu.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
}