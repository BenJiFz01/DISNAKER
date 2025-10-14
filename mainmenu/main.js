// Toggle mobile menu
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
});

// =========================
// ACTIVE STATE NAV-LINK
// =========================
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    // Hapus active sebelumnya
    document.querySelectorAll('.nav-link.active')
      .forEach(x => x.classList.remove('active'));

    // Tambah active ke link yang diklik
    e.currentTarget.classList.add('active');

    // Tutup menu (mode mobile)
    if (menu && menu.classList.contains('open')) {
      menu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
});

// =========================
// AUTO-SLIDE BANNER 3 GAMBAR (dengan preload & fallback)
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const cards = [...document.querySelectorAll('.banner-cards .card img')];
  const dots  = [...document.querySelectorAll('.slider-dots .dot')];

  // PASTIKAN nama file benar, hindari spasi di nama file
  const slides = [
    ['img/image1.jpg', 'img/image2.jpg', 'img/image3.jpg'],
    ['img/image2.jpg', 'img/image3.jpg', 'img/image1.jpg'],
    ['img/image3.jpg', 'img/image1.jpg', 'img/image2.jpg']
  ];

  const unique = [...new Set(slides.flat())];
  const okMap = new Map();

  // Preload semua gambar
  const preloadAll = Promise.all(
    unique.map(src => new Promise(res => {
      const im = new Image();
      im.onload  = () => { okMap.set(src, true);  res(); };
      im.onerror = () => { okMap.set(src, false); res(); };
      im.src = src;
    }))
  );

  preloadAll.then(() => {
    let idx = 0;

    const setImg = (imgEl, src) => {
      // kalau file ada -> tampilkan, kalau tidak -> fallback card
      if (okMap.get(src)) {
        imgEl.parentElement.classList.remove('card--fallback');
        imgEl.style.display = '';
        if (imgEl.src !== location.origin + '/' + src && imgEl.src !== src) {
          imgEl.src = src;
        }
      } else {
        imgEl.style.display = 'none';
        imgEl.parentElement.classList.add('card--fallback');
      }
    };

    const apply = (i) => {
      const set = slides[i % slides.length];
      cards.forEach((img, k) => setImg(img, set[k]));
      dots.forEach(d => d.classList.remove('active'));
      dots[i % dots.length].classList.add('active');
      idx = (i + 1) % slides.length;
    };

    // klik dot manual
    dots.forEach((d, i) => d.addEventListener('click', () => apply(i)));

    // mulai
    apply(0);
    setInterval(() => apply(idx), 4000);
  });
});

