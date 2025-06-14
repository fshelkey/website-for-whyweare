export function initScrollSpy() {
  const sections = Array.from(document.querySelectorAll('section[id]')).filter(s => s.id);
  if (sections.length === 0) {
    console.warn('initScrollSpy: no sections with id found');
    return;
  }
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
  if (navLinks.length === 0) {
    console.warn('initScrollSpy: no nav links found');
    return;
  }

  // Map section IDs to nav link elements
  const linkMap = sections.reduce((map, section) => {
    const id = section.id;
    // Basic escaping for selector
    const safeId = id.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');
    const selector = `.nav-link[href="#${safeId}"]`;
    const link = document.querySelector(selector);
    if (link) {
      map[id] = link;
    }
    return map;
  }, {});

  // Utility to clear and set active link
  function setActiveLink(id) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link === linkMap[id]);
    });
  }

  // IntersectionObserver approach
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50% 0px',
      threshold: 0
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    }, observerOptions);
    sections.forEach(section => observer.observe(section));
  } else {
    // Fallback for browsers without IntersectionObserver
    const sectionData = sections.map(section => ({
      id: section.id,
      offsetTop: section.getBoundingClientRect().top + window.pageYOffset
    }));

    function onScroll() {
      const scrollPos = window.pageYOffset + window.innerHeight / 2;
      let currentId = sectionData[0].id;
      for (let i = 0; i < sectionData.length; i++) {
        if (scrollPos >= sectionData[i].offsetTop) {
          currentId = sectionData[i].id;
        } else {
          break;
        }
      }
      setActiveLink(currentId);
    }

    window.addEventListener('scroll', throttle(onScroll, 100));
    onScroll();
  }
}

// Throttle function to limit how often a function can fire.
function throttle(fn, wait) {
  let lastTime = 0;
  let timeout = null;
  return function (...args) {
    const now = Date.now();
    const remaining = wait - (now - lastTime);
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      lastTime = now;
      fn.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastTime = Date.now();
        timeout = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}