// /mainmenu/main.js
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const sentinel = document.querySelector('.hero-sentinel');
  if (!header || !sentinel) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      // Jika sentinel TIDAK terlihat -> sudah melewati video -> detach
      header.classList.toggle('detached', !entry.isIntersecting);
    }, { threshold: 0 });
    io.observe(sentinel);
  } else {
    // Fallback
    const heroH = document.querySelector('.hero-video-section')?.offsetHeight || window.innerHeight;
    const onScroll = () => header.classList.toggle('detached', window.scrollY > heroH - 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const btn = document.getElementById('unmuteBtn');
  const vid = document.getElementById('heroVideo');

  btn.addEventListener('click', () => {
    vid.muted = !vid.muted;
    btn.textContent = vid.muted ? '🔈 Aktifkan Suara' : '🔊 Matikan Suara';
  });
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
