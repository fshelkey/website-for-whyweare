export function initBackToTop() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    throw new Error('Environment does not support DOM operations');
  }
  const THRESHOLD = 300;
  const SCROLL_THROTTLE_MS = 200;
  const BUTTON_ID = 'back-to-top';
  // If button already exists, do nothing and return noop
  if (document.getElementById(BUTTON_ID)) {
    return function destroy() {};
  }
  // Throttle utility
  function throttle(fn, wait) {
    let lastTime = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  }
  // Create button
  const btn = document.createElement('button');
  btn.id = BUTTON_ID;
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<i class="fas fa-chevron-up" aria-hidden="true"></i>';
  btn.classList.add('back-to-top');
  document.body.appendChild(btn);
  // Visibility toggle
  function toggleVisibility() {
    const shouldShow = window.pageYOffset > THRESHOLD;
    btn.classList.toggle('back-to-top--visible', shouldShow);
  }
  const throttledToggle = throttle(toggleVisibility, SCROLL_THROTTLE_MS);
  // Event handlers
  window.addEventListener('scroll', throttledToggle, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  // Initial check
  toggleVisibility();
  // Cleanup function
  function destroy() {
    window.removeEventListener('scroll', throttledToggle);
    btn.removeEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    if (btn.parentNode) {
      btn.parentNode.removeChild(btn);
    }
  }
  return destroy;
}