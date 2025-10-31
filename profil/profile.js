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

// === Animasi Scroll: bidang Muncul dari Kiri (1 per 1 & terus aktif) ===
document.addEventListener('DOMContentLoaded', () => {
  const newsItems = document.querySelectorAll('.bidang-card');
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

document.addEventListener('DOMContentLoaded', () => {
  // ===== Fade-in saat elemen terlihat =====
  (function () {
    const els = document.querySelectorAll('.fade-in');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
  })();

  // ===== Lightbox zoom =====
  (function () {
    const modal = document.getElementById('orgLightbox');
    const imgEl = document.querySelector('#struktur-organisasi .org-img');
    if (!modal || !imgEl) return;

    const closeBtn = modal.querySelector('.lightbox-close');
    const imgFull = modal.querySelector('.lightbox-img');
    const openBtns = document.querySelectorAll('#struktur-organisasi .zoom-btn');

    if (!closeBtn || !imgFull || !openBtns.length) return;

    const open = () => {
      imgFull.src = imgEl.currentSrc || imgEl.src; // dukung srcset
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    openBtns.forEach(btn => btn.addEventListener('click', open));
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  })();
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 10) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  });
});