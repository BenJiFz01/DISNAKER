/* ================================
   Disnakertrans — artikel.js
================================ */

(function () {
  'use strict';

  // Helper: DOM ready
  const onReady = (fn) =>
    document.readyState !== 'loading'
      ? fn()
      : document.addEventListener('DOMContentLoaded', fn);

  // Helper: debounce
  const debounce = (fn, delay = 150) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), delay); };
  };

  onReady(() => {
    /* ===== 1) Navbar Toggle (Mobile) ===== */
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const menu   = document.getElementById('primary-menu');

    const openMenu = () => {
      toggle?.classList.add('is-active');
      toggle?.setAttribute('aria-expanded', 'true');
      menu?.classList.add('show');
    };
    const closeMenu = () => {
      toggle?.classList.remove('is-active');
      toggle?.setAttribute('aria-expanded', 'false');
      menu?.classList.remove('show');
    };

    if (toggle && menu) {
      // toggle click
      toggle.addEventListener('click', () => {
        const isOpen = toggle.classList.contains('is-active');
        isOpen ? closeMenu() : openMenu();
      });
      // klik di luar
      document.addEventListener('click', (e) => {
        if (!menu.classList.contains('show')) return;
        const inside = menu.contains(e.target) || toggle.contains(e.target);
        if (!inside) closeMenu();
      });
      // klik link: tutup
      menu.addEventListener('click', (e) => { if (e.target.tagName === 'A') closeMenu(); });
      // ESC
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
      // resize ke desktop
      window.addEventListener('resize', debounce(() => { if (window.innerWidth > 768) closeMenu(); }, 120));
    }

    /* ===== 2) Shadow header saat scroll (sama galery) ===== */
    const applyShadow = () => document.body.classList.toggle('scrolled', window.scrollY > 6);
    applyShadow();
    window.addEventListener('scroll', debounce(applyShadow, 60));

    /* ===== 3) Highlight menu aktif (otomatis) ===== */
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-list .nav-link').forEach(a => {
      const href = (a.getAttribute('href') || '').split('/').pop();
      if (href === current) a.classList.add('active');
    });

    /* ===== 4) Estimasi waktu baca ===== */
    const article  = document.querySelector('.article-content');
    const readSpan = document.querySelector('.meta-primary .read');
    if (article && readSpan) {
      const words = (article.innerText || '').trim().split(/\s+/).filter(Boolean).length;
      const minutes = Math.max(1, Math.round(words / 220));
      readSpan.textContent = `${minutes} menit baca`;
    }

    /* ===== 5) Share Sosial + Salin ===== */
    const share = document.querySelector('.share');
    if (share) {
      const h1 = document.querySelector('.article-header h1');
      const title = (h1?.textContent || document.title).trim().slice(0,120);
      const url = location.href;
      const popup = (u) => window.open(u, '_blank', 'noopener,noreferrer,width=680,height=540');

      const map = {
        wa: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
        fb: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        x:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        in: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
      };

      share.querySelectorAll('a').forEach(a => {
        const label = (a.getAttribute('aria-label') || a.textContent || '').toLowerCase();
        const txt = a.textContent.trim().toLowerCase();
        if (label.includes('whatsapp') || txt === 'wa') a.addEventListener('click', e => { e.preventDefault(); popup(map.wa); });
        if (label.includes('facebook') || txt === 'fb')  a.addEventListener('click', e => { e.preventDefault(); popup(map.fb); });
        if (label.includes('twitter') || label.includes('x/') || txt === 'x') a.addEventListener('click', e => { e.preventDefault(); popup(map.x); });
        if (label.includes('linkedin') || txt === 'in')  a.addEventListener('click', e => { e.preventDefault(); popup(map.in); });
      });

      // tombol Salin
      const copy = document.createElement('a');
      copy.href='#'; copy.setAttribute('aria-label','Salin tautan'); copy.textContent='⧉'; copy.style.userSelect='none';
      copy.addEventListener('click', async (e) => {
        e.preventDefault();
        try { await navigator.clipboard.writeText(url); copy.textContent='✓'; setTimeout(()=>copy.textContent='⧉', 1200); }
        catch { prompt('Salin tautan berikut:', url); }
      });
      share.appendChild(copy);
    }

    /* ===== 6) Smooth anchor ===== */
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(a=>{
      a.addEventListener('click', e=>{
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el){ e.preventDefault(); window.scrollTo({top: el.getBoundingClientRect().top + window.pageYOffset - 80, behavior:'smooth'}); }
      });
    });

    /* ===== 7) Lazy load fallback ===== */
    document.querySelectorAll('img:not([loading])').forEach(img => img.setAttribute('loading','lazy'));
  });
})();