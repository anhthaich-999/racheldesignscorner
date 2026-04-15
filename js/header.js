/* ==============================================
   Header — Sticky scroll effect + mobile menu
   ============================================== */

document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  const overlay = document.querySelector('.overlay');
  const mobileClose = document.querySelector('.nav-mobile-close');

  // Sticky header scroll effect
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Mobile menu
  function openMenu() {
    navMobile && navMobile.classList.add('open');
    overlay && overlay.classList.add('active');
    hamburger && hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMobile && navMobile.classList.remove('open');
    overlay && overlay.classList.remove('active');
    hamburger && hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger && hamburger.addEventListener('click', function () {
    if (navMobile.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileClose && mobileClose.addEventListener('click', closeMenu);
  overlay && overlay.addEventListener('click', closeMenu);

  // Close on nav link click
  if (navMobile) {
    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // Announcement close
  const announcementClose = document.querySelector('.announcement-close');
  const announcementBar = document.querySelector('.announcement-bar');
  if (announcementClose && announcementBar) {
    announcementClose.addEventListener('click', function () {
      announcementBar.classList.add('hidden');
    });
  }

  // Active nav link on scroll
  var sections = document.querySelectorAll('section[id], footer[id]');
  var navLinks = document.querySelectorAll('.nav-desktop a, .nav-mobile a');

  function setActiveNav() {
    var scrollPos = window.scrollY + 120;
    var currentId = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();
});
