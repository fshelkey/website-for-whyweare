export function initScrollAnimations() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('initScrollAnimations must be run in a browser environment');
    return;
  }
  if (typeof IntersectionObserver === 'undefined') {
    console.warn('IntersectionObserver is not supported by this browser.');
    return;
  }
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (elements.length === 0) {
    console.warn('No elements found with class .animate-on-scroll');
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  elements.forEach(el => observer.observe(el));
}