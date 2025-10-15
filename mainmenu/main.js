// mainmenu/main.js

// === Hero Slider Autoplay + Tombol + Dots ===
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  // ambil semua img.slide yang ADA DI DALAM heroSlider (dimanapun posisinya)
  const slides = Array.from(slider.querySelectorAll('img.slide'));
  if (slides.length < 2) return;

  const dotsWrap = slider.querySelector('#heroDots') || slider.querySelector('.dots');
  const caption  = slider.querySelector('#heroCaption') || slider.querySelector('.caption');
  const prevBtn  = slider.querySelector('.prev');
  const nextBtn  = slider.querySelector('.next');

  let index = 0;
  let timer = null;
  const DURATION = 3000;

  // --- build dots sesuai jumlah slide ---
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dot';
      dot.dataset.index = String(i);
      dot.title = `Gambar ${i + 1}`;
      dot.setAttribute('aria-label', `Gambar ${i + 1} dari ${slides.length}`);
      dotsWrap.appendChild(dot);
    });
  }
  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.dot')) : [];

  function updateCaption() {
    if (caption) caption.textContent = `Gambar ${index + 1} dari ${slides.length}`;
  }

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle('is-active', j === index));
    dots.forEach((d, j) => d.classList.toggle('active', j === index));
    updateCaption();
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, DURATION);
  }

  // --- events panah ---
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });

  // --- events dots (klik dot ke-3 harus jalan) ---
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const i = Number((e.currentTarget).dataset.index);
      show(i);
      resetTimer();
    });
  });

  // --- pause saat hover ---
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', resetTimer);

  // --- init ---
  show(0);          // aktifkan slide & dot pertama + caption
  resetTimer();     // autoplay langsung jalan
});


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
