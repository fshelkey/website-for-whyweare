export function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  if (!links.length) {
    console.warn('initSmoothScroll: No in-page links found.');
    return;
  }
  links.forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');
      if (typeof href !== 'string' || href.charAt(0) !== '#' || href === '#') {
        console.warn('initSmoothScroll: Skipping invalid href on link', link);
        return;
      }
      const targetId = href.slice(1);
      if (!targetId) {
        console.warn('initSmoothScroll: Empty fragment identifier', link);
        return;
      }
      const targetEl = document.getElementById(targetId);
      if (!targetEl) {
        console.warn(`initSmoothScroll: No element with ID "${targetId}" found.`, link);
        return;
      }
      event.preventDefault();
      // Recalculate header height in case of dynamic/responsive layouts
      const headerEl = document.querySelector('.navbar.fixed-top, .navbar.sticky-top');
      const headerOffset = headerEl && headerEl.offsetHeight ? headerEl.offsetHeight : 0;
      const elementTop = targetEl.getBoundingClientRect().top + window.pageYOffset;
      const scrollPosition = Math.max(elementTop - headerOffset, 0);
      window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    });
  });
}