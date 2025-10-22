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
