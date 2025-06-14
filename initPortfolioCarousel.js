export function initPortfolioCarousel() {
  const carousel = document.querySelector('.portfolio-carousel');
  if (!carousel) throw new Error('initPortfolioCarousel: Missing .portfolio-carousel element');
  const slidesContainer = carousel.querySelector('.carousel-slides');
  if (!slidesContainer) throw new Error('initPortfolioCarousel: Missing .carousel-slides element');
  const slides = Array.from(slidesContainer.querySelectorAll('.carousel-slide'));
  if (slides.length === 0) throw new Error('initPortfolioCarousel: No .carousel-slide elements found');
  const prevBtn = carousel.querySelector('.carousel-prev');
  if (!prevBtn) throw new Error('initPortfolioCarousel: Missing .carousel-prev button');
  const nextBtn = carousel.querySelector('.carousel-next');
  if (!nextBtn) throw new Error('initPortfolioCarousel: Missing .carousel-next button');

  let currentIndex = 0;
  const totalSlides = slides.length;
  let isTransitioning = false;

  // store previous attributes to restore on destroy
  const prevRole = carousel.getAttribute('role');
  const prevAriaLabel = carousel.getAttribute('aria-label');
  const prevTabIndex = carousel.getAttribute('tabindex');

  // accessibility enhancements
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Portfolio Carousel');
  if (!carousel.hasAttribute('tabindex')) {
    carousel.setAttribute('tabindex', '0');
  }
  prevBtn.setAttribute('aria-label', 'Previous slide');
  nextBtn.setAttribute('aria-label', 'Next slide');

  slidesContainer.style.transition = 'transform 0.5s ease';

  function updateSlidePosition() {
    const offset = -currentIndex * 100;
    slidesContainer.style.transform = `translateX(${offset}%)`;
  }

  function goToPrevSlide() {
    isTransitioning = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlidePosition();
  }

  function goToNextSlide() {
    isTransitioning = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlidePosition();
  }

  function onPrevClick(e) {
    e.preventDefault();
    if (!isTransitioning) goToPrevSlide();
  }

  function onNextClick(e) {
    e.preventDefault();
    if (!isTransitioning) goToNextSlide();
  }

  function onKeydown(e) {
    if (isTransitioning) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNextSlide();
    }
  }

  function onTransitionEnd(e) {
    if (e.target === slidesContainer && e.propertyName === 'transform') {
      isTransitioning = false;
      prevBtn.disabled = false;
      nextBtn.disabled = false;
    }
  }

  prevBtn.addEventListener('click', onPrevClick);
  nextBtn.addEventListener('click', onNextClick);
  carousel.addEventListener('keydown', onKeydown);
  slidesContainer.addEventListener('transitionend', onTransitionEnd);

  updateSlidePosition();

  function destroy() {
    prevBtn.removeEventListener('click', onPrevClick);
    nextBtn.removeEventListener('click', onNextClick);
    carousel.removeEventListener('keydown', onKeydown);
    slidesContainer.removeEventListener('transitionend', onTransitionEnd);

    slidesContainer.style.transition = '';
    slidesContainer.style.transform = '';
    currentIndex = 0;

    if (prevRole === null) carousel.removeAttribute('role');
    else carousel.setAttribute('role', prevRole);
    if (prevAriaLabel === null) carousel.removeAttribute('aria-label');
    else carousel.setAttribute('aria-label', prevAriaLabel);
    if (prevTabIndex === null) carousel.removeAttribute('tabindex');
    else carousel.setAttribute('tabindex', prevTabIndex);

    prevBtn.removeAttribute('aria-label');
    nextBtn.removeAttribute('aria-label');
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  return { destroy };
}