/* ==============================================
   Scroll Reveal — IntersectionObserver
   ============================================== */

document.addEventListener('DOMContentLoaded', function () {
  var reveals = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    reveals.forEach(function (el) {
      el.classList.add('revealed');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
});
