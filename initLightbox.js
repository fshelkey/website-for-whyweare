export function initLightbox() {
  const items = document.querySelectorAll('.portfolio-item');
  if (items.length === 0) {
    console.warn('initLightbox: No portfolio items found (.portfolio-item)');
    return;
  }

  const modal = document.querySelector('#lightboxModal');
  if (!modal) {
    console.warn('initLightbox: No lightbox modal element found (#lightboxModal)');
    return;
  }

  const contentContainer = modal.querySelector('.lightbox-content');
  if (!contentContainer) {
    console.warn('initLightbox: No content container found (.lightbox-content)');
    return;
  }

  const closeBtn = modal.querySelector('.modal-close');
  if (!closeBtn) {
    console.warn('initLightbox: No close button found (.modal-close)');
  }

  let lastFocusedElement = null;

  function openModal(node) {
    contentContainer.innerHTML = '';
    contentContainer.appendChild(node);
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    lastFocusedElement = document.activeElement;
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    contentContainer.innerHTML = '';
    document.body.style.overflow = '';
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) {
        console.warn('initLightbox: Portfolio item has no <img> to display');
        return;
      }
      const clone = img.cloneNode(true);
      clone.classList.add('lightbox-img');
      openModal(clone);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // ensure modal is hidden initially
  modal.setAttribute('aria-hidden', 'true');
  modal.setAttribute('tabindex', '-1');
}