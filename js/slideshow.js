/* ==============================================
   Hero Slideshow — Auto-play, fade, dots
   ============================================== */

document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (slides.length === 0) return;

  let current = 0;
  let interval;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() {
    goTo(current + 1);
  }

  function startAutoplay() {
    interval = setInterval(next, 5000);
  }

  function stopAutoplay() {
    clearInterval(interval);
  }

  // Dot clicks
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      stopAutoplay();
      goTo(i);
      startAutoplay();
    });
  });

  // Pause on hover
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', stopAutoplay);
    hero.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
});
