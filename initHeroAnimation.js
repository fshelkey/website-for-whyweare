export function initHeroAnimation() {
  const hero = document.querySelector('.hero');
  if (!hero) {
    console.warn('initHeroAnimation: .hero element not found.');
    return;
  }
  // Respect user preference for reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.classList.add('reduced-motion');
    return;
  }
  // Trigger CSS animation on next repaint for smoother start
  requestAnimationFrame(() => {
    hero.classList.add('animate-bg');
  });
}