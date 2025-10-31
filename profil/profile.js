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

  (function () {
    const section = document.querySelector('#bidang');
    const grid = section?.querySelector('.bidang-grid');
    const flyout = section?.querySelector('#bidangFlyout');
    if (!section || !grid || !flyout) return;

    const titleEl = flyout.querySelector('.flyout-title');
    const descEl = flyout.querySelector('.flyout-desc');

    // reset semua kartu ke posisi normal
    function resetTransforms() {
      grid.querySelectorAll('.bidang-wrapper').forEach(w => w.style.transform = '');
    }


    function positionFlyout(cardEl) {
      const secRect = section.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();

      const gap = 14;                                      // jarak kartu <-> flyout
      const panelW = Math.min(420, Math.max(320, section.clientWidth * 0.28));
      const leftInSec = cardRect.left - secRect.left;
      const rightInSec = leftInSec + cardRect.width;
      const spaceRight = section.clientWidth - rightInSec; // ruang ke tepi kanan section
      const spaceLeft = leftInSec;

      // default: taruh flyout di kanan kartu
      let place = 'right';
      let shift = 0;

      // jika ruang kanan kurang, geser kartu ke kiri secukupnya
      const deficit = (panelW + gap) - spaceRight;
      if (deficit > 0) {
        // geser kartu ke kiri, tapi jangan melebihi ruang kiri yang tersedia
        const maxShift = Math.max(0, spaceLeft - gap);
        shift = Math.min(deficit, maxShift);
        if (shift > 0) {
          cardEl.closest('.bidang-wrapper').style.transform = `translateX(${-shift}px)`;
        } else {
          // kalau tetap tidak cukup (mis. kartu paling pojok), baru taruh flyout di kiri
          place = 'left';
        }
      } else {
        // cukup ruang kanan, pastikan transform reset
        cardEl.style.transform = '';
      }

      // set posisi panel
      flyout.style.position = 'absolute';
      const x = place === 'right'
        ? (rightInSec - shift + gap)
        : (leftInSec - panelW - gap);
      const y = Math.max(0, cardRect.top - secRect.top);

      flyout.style.left = `${x}px`;
      flyout.style.top = `${y}px`;
    }

    function showFor(el) {
      titleEl.textContent = el.dataset.title || el.getAttribute('aria-label') || '';
      descEl.textContent = el.dataset.desc || '';

      grid.querySelectorAll('.bidang').forEach(b => b.classList.remove('active'));
      el.classList.add('active');

      flyout.classList.add('show');
      grid.classList.add('is-active');   // <— tambahkan ini

      resetTransforms();
      positionFlyout(el);
    }

    function hide() {
      flyout.classList.remove('show');
      grid.classList.remove('is-active'); // <— dan ini

      grid.querySelectorAll('.bidang').forEach(b => b.classList.remove('active'));
      resetTransforms();
    }


    grid.querySelectorAll('.bidang').forEach((el) => {
      el.addEventListener('mouseenter', () => showFor(el));
      el.addEventListener('focus', () => showFor(el));
    });

    grid.addEventListener('mouseleave', (e) => {
      if (!flyout.contains(e.relatedTarget)) hide();
    });
    flyout.addEventListener('mouseleave', (e) => {
      if (!grid.contains(e.relatedTarget)) hide();
    });

    // Reposisi saat resize/scroll
    ['resize', 'scroll'].forEach(ev => {
      window.addEventListener(ev, () => {
        const active = grid.querySelector('.bidang.active');
        if (!active || !flyout.classList.contains('show')) return;

        // di layar sempit (<900px) flyout jadi static (CSS), jadi reset transform
        if (window.innerWidth <= 900) {
          flyout.style.position = 'static';
          resetTransforms();
          return;
        }
        positionFlyout(active);
      });
    });
  })();
});