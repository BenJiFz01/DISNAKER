// mainmenu/main.js

document.addEventListener('DOMContentLoaded', () => {
  // ====== Toggle mobile ======
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.getElementById('primary-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ====== Active state by URL ======
  const links = document.querySelectorAll('.nav-list .nav-link');
  if (!links.length) return;

  // bersihkan active lama (jangan hard-code di HTML)
  links.forEach(l => l.classList.remove('active'));

  // nama file saat ini (aman untuk folder ber-spasi)
  const currentFile = decodeURIComponent(location.pathname)
    .split('/').pop().toLowerCase(); // contoh: "galery.html"

  let matched = false;

  // 1) cocokan langsung berdasarkan nama file href
  for (const link of links) {
    const href = (link.getAttribute('href') || '')
      .split('#')[0].split('?')[0];
    const file = href.substring(href.lastIndexOf('/') + 1).toLowerCase();
    if (file && currentFile === file) {
      link.classList.add('active');
      matched = true;
      break;
    }
  }

  // 2) Paksa "Berita" aktif untuk halaman galeri/artikel
  if (!matched && ['galery.html', 'artikel.html', 'artikel1.html'].includes(currentFile)) {
    const berita = document.querySelector('.nav-list .nav-link[href$="galery.html"]');
    if (berita) {
      berita.classList.add('active');
      matched = true;
    }
  }

  // 3) Fallback: Home
  if (!matched) {
    const home = document.querySelector(
      '.nav-list .nav-link[href$="index.html"], .nav-list .nav-link[href="#"], .nav-list .nav-link:first-child'
    );
    if (home) home.classList.add('active');
  }

  // ====== Active pindah saat diklik (SPA/anchor) ======
  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // tutup menu mobile jika terbuka
      if (menu && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
});
