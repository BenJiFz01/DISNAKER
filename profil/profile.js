document.addEventListener('DOMContentLoaded', () => {
  /* =========================
   * NAVBAR: toggle mobile + active link + efek scroll
   * ========================= */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
});
