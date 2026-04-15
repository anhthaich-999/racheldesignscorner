/* ==============================================
   Theme Toggle — Dark/Light switcher + localStorage
   ============================================== */

(function () {
  const STORAGE_KEY = 'wedding-theme';

  function getPreferred() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return 'dark'; // default dark
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Apply immediately to prevent flash
  applyTheme(getPreferred());

  document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function () {
      const current = localStorage.getItem(STORAGE_KEY) || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });
})();
