// /mainmenu/main.js
document.addEventListener('DOMContentLoaded', () => {
  /* =========================
   * HERO SLIDER (autoplay + dots + caption + aksesibilitas)
   * ========================= */
  const slider = document.getElementById('heroSlider');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('img.slide'));
    const dotsBox = slider.querySelector('#heroDots, .dots');
    const caption = slider.querySelector('#heroCaption, .caption');
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');

    if (slides.length >= 2) {
      // build dots
      let dots = [];
      if (dotsBox) {
        dotsBox.innerHTML = '';
        const frag = document.createDocumentFragment();
        for (let i = 0; i < slides.length; i++) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'dot';
          b.title = `Gambar ${i + 1}`;
          b.setAttribute('aria-label', `Gambar ${i + 1} dari ${slides.length}`);
          b.dataset.index = String(i);
          frag.appendChild(b);
        }
        dotsBox.appendChild(frag);
        dots = Array.from(dotsBox.querySelectorAll('button'));
      }

      // state
      let index = 0;
      let timer = null;
      const DURATION = 3000;

      const updateCaption = () => {
        if (caption) caption.textContent = `Gambar ${index + 1} dari ${slides.length}`;
      };

      const show = (i) => {
        index = (i + slides.length) % slides.length;
        slides.forEach((s, j) => s.classList.toggle('is-active', j === index));
        dots.forEach((d, j) => d.classList.toggle('active', j === index));
        updateCaption();
      };

      const next = () => show(index + 1);
      const prev = () => show(index - 1);

      const start = () => {
        stop();
        timer = setInterval(next, DURATION);
      };
      const stop = () => {
        if (timer) clearInterval(timer);
        timer = null;
      };

      // events: dots
      dots.forEach((d) => {
        d.addEventListener('click', (e) => {
          const i = Number((e.currentTarget).dataset.index || 0);
          show(i);
          start();
        });
      });

      // events: arrows (jika ada di HTML)
      if (prevBtn) prevBtn.addEventListener('click', () => { prev(); start(); });
      if (nextBtn) nextBtn.addEventListener('click', () => { next(); start(); });

      // pause on hover
      slider.addEventListener('mouseenter', stop);
      slider.addEventListener('mouseleave', start);

      // pause saat tab tidak aktif
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop(); else start();
      });

      // keyboard (aksesibilitas)
      slider.setAttribute('tabindex', '0');
      slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { next(); start(); }
        if (e.key === 'ArrowLeft') { prev(); start(); }
      });

      // init
      show(0);
      start();
    } else if (slides.length === 1) {
      // kalau cuma 1 slide, pastikan terlihat
      slides[0].classList.add('is-active');
      if (caption) caption.textContent = '';
    }
  }

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

  // aktifkan link sesuai URL
  const links = Array.from(document.querySelectorAll('.nav-list .nav-link'));
  if (links.length) {
    links.forEach(l => l.classList.remove('active'));

    const currentFile = decodeURIComponent(location.pathname.split('/').pop() || '').toLowerCase();
    let matched = false;

    // 1) cocokkan nama file href
    for (const link of links) {
      const href = (link.getAttribute('href') || '').split('#')[0].split('?')[0];
      const file = href.substring(href.lastIndexOf('/') + 1).toLowerCase();
      if (file && currentFile === file) {
        link.classList.add('active');
        matched = true;
        break;
      }
    }

    // 2) paksa "Berita" aktif untuk halaman galeri/artikel
    if (!matched && ['galery.html', 'artikel.html', 'artikel1.html'].includes(currentFile)) {
      const berita = document.querySelector('.nav-list .nav-link[href$="galery.html"]');
      if (berita) {
        berita.classList.add('active');
        matched = true;
      }
    }

    // 3) fallback: Home (root/blank/#)
    if (!matched) {
      const home = document.querySelector(
        '.nav-list .nav-link[href$="index.html"], .nav-list .nav-link[href="#"], .nav-list .nav-link:first-child'
      );
      if (home) home.classList.add('active');
    }

    // pindah active saat klik + tutup menu mobile
    links.forEach(link => {
      link.addEventListener('click', () => {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        if (menu && menu.classList.contains('is-open')) {
          menu.classList.remove('is-open');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // efek header saat scroll (untuk .site-header & CSS body.scrolled)
  const onScroll = () => {
    if (window.scrollY > 4) document.body.classList.add('scrolled');
    else document.body.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});

// === Animasi Scroll: Berita Muncul dari Kiri (1 per 1 & terus aktif) ===
document.addEventListener('DOMContentLoaded', () => {
  const newsItems = document.querySelectorAll('.np-item');
  if (!newsItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const el = entry.target;

        // Saat elemen masuk viewport
        if (entry.isIntersecting) {
          // hilangkan class show dulu biar bisa retrigger
          el.classList.remove('show');

          // beri sedikit jeda (biar smooth satu-satu)
          const delay = [...newsItems].indexOf(el) * 115; // jeda antar item 150ms
          setTimeout(() => {
            el.classList.add('show');
          }, delay);
        } else {
          // saat keluar viewport → sembunyikan lagi agar bisa animasi ulang
          el.classList.remove('show');
        }
      });
    },
    {
      threshold: 0.12, // mulai animasi saat 25% terlihat
      rootMargin: '0px 0px -10% 0px'
    }
  );

  newsItems.forEach(item => observer.observe(item));
});

// === Animasi Scroll: layanan Muncul dari Kiri (1 per 1 & terus aktif) ===
document.addEventListener('DOMContentLoaded', () => {
  const newsItems = document.querySelectorAll('.service-card');
  if (!newsItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const el = entry.target;

        // Saat elemen masuk viewport
        if (entry.isIntersecting) {
          // hilangkan class show dulu biar bisa retrigger
          el.classList.remove('show');

          // beri sedikit jeda (biar smooth satu-satu)
          const delay = [...newsItems].indexOf(el) * 170; // jeda antar item 150ms
          setTimeout(() => {
            el.classList.add('show');
          }, delay);
        } else {
          // saat keluar viewport → sembunyikan lagi agar bisa animasi ulang
          el.classList.remove('show');
        }
      });
    },
    {
      threshold: 0.12, // mulai animasi saat 25% terlihat
      rootMargin: '0px 0px -10% 0px'
    }
  );

  newsItems.forEach(item => observer.observe(item));
});
