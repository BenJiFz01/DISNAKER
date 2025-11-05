document.addEventListener('DOMContentLoaded', () => {
  /* =========================
     Drawer (filter sidebar)
  ========================== */
  const drawer   = document.getElementById('filterDrawer');
  const overlay  = document.getElementById('drawerOverlay');
  const btnFilter= document.getElementById('btnFilter');
  const btnClose = document.getElementById('btnClose');
  const btnReset = document.getElementById('btnReset');
  const btnApply = document.getElementById('btnApply');

  function openDrawer(){
    if (!drawer || !overlay || !btnFilter) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.hidden = false;
    overlay.classList.add('show');
    btnFilter.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer(){
    if (!drawer || !overlay || !btnFilter) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('show');
    btnFilter.setAttribute('aria-expanded', 'false');
    setTimeout(()=> overlay.hidden = true, 250);
  }

  btnFilter?.addEventListener('click', openDrawer);
  btnClose?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && drawer?.classList.contains('open')) closeDrawer();
  });

  // chip toggle
  document.querySelectorAll('.drawer .chip').forEach(chip=>{
    chip.addEventListener('click', ()=> chip.classList.toggle('active'));
  });
  // reset chip saat reset form
  btnReset?.addEventListener('click', ()=>{
    document.querySelectorAll('.drawer .chip.active').forEach(c=>c.classList.remove('active'));
  });

  /* =========================
     Filtering, Search, Sort
  ========================== */
  const grid   = document.getElementById('grid');
  const qInput = document.getElementById('q');
  const cards  = () => grid ? Array.from(grid.querySelectorAll('.card')) : [];

  // utils
  const parseISO = s => s ? new Date(s + 'T00:00:00') : null;
  const includes = (hay, needle) => hay.toLowerCase().includes(needle.toLowerCase());

  function getFilterState(){
    if (!drawer) return { jenis:[], from:null, to:null, tags:[], sort:'new', query:'' };
    const form = drawer.querySelector('form');
    const data = new FormData(form);

    const jenis = data.getAll('jenis'); // array string
    const from  = parseISO(data.get('from'));
    const to    = parseISO(data.get('to'));
    const tags  = [...drawer.querySelectorAll('.chip.active')].map(c=>c.dataset.tag);
    const sort  = data.get('sort') || 'new';
    const query = (qInput?.value || '').trim();

    return { jenis, from, to, tags, sort, query };
  }

  function applyFilters(){
    const { jenis, from, to, tags, query } = getFilterState();
    cards().forEach(card=>{
      let show = true;

      // by jenis/kategori
      if (jenis.length){
        show = show && jenis.includes(card.dataset.category);
      }

      // by date range (inklusif)
      if (from || to){
        const cd = parseISO(card.dataset.date);
        if (from && cd < from) show = false;
        if (to && cd > to)     show = false;
      }

      // by tags
      if (tags.length){
        const ct = (card.dataset.tags || '')
          .split(',').map(s=>s.trim()).filter(Boolean);
        if (!tags.some(t => ct.includes(t))) show = false;
      }

      // by search query (title + excerpt)
      if (query){
        const title   = card.dataset.title   || '';
        const excerpt = card.dataset.excerpt || '';
        const hit = includes(title, query) || includes(excerpt, query);
        if (!hit) show = false;
      }

      card.classList.toggle('is-hidden', !show);
    });
  }

  function applySort(){
    const { sort } = getFilterState();
    const visible = cards().filter(c=>!c.classList.contains('is-hidden'));
    if (!visible.length || !grid) return;

    // Ambil nilai untuk sort (dengan fallback)
    const items = visible.map(c => {
      const titleAttr = (c.dataset.title || '').trim();
      // fallback ke h3 teks kalau data-title tidak ada
      const titleText = titleAttr || (c.querySelector('h3')?.textContent || '').trim();
      return {
        el: c,
        date: c.dataset.date || '',                // "YYYY-MM-DD"
        title: titleText.toLowerCase()
      };
    });

    if (sort === 'new'){
      items.sort((a,b)=> (a.date < b.date ? 1 : -1)); // terbaru dulu
    } else if (sort === 'popular'){
      // Belum ada data popular → fallback ke terbaru
      items.sort((a,b)=> (a.date < b.date ? 1 : -1));
    } else if (sort === 'az'){
      items.sort((a,b)=> a.title.localeCompare(b.title));
    }

    const frag = document.createDocumentFragment();
    items.forEach(it => frag.appendChild(it.el));
    grid.appendChild(frag);
  }

  // Apply dari tombol “Terapkan”
  btnApply?.addEventListener('click', ()=>{
    applyFilters();
    applySort();
    closeDrawer();
  });

  // Live search (debounce)
  const debounce = (fn, ms=180) => {
    let t; return (...args) => { clearTimeout(t); t=setTimeout(()=>fn(...args), ms); };
  };
  qInput?.addEventListener('input', debounce(()=>{
    applyFilters();
    applySort();
  }, 180));

  // Initial run
  applyFilters();
  applySort();

/* =========================
   Navbar: link aktif + mobile + blur
========================== */
const norm = p => decodeURIComponent(p)
  .replace(/index\.html$/i, '')
  .replace(/\/+$/, '/');

const here = norm(location.pathname || '/');

// 1) Bersihkan semua status aktif lebih dulu
document.querySelectorAll('.nav-list .nav-link').forEach(a => {
  a.classList.remove('active');
  a.removeAttribute('aria-current');
});

// 2) Tandai aktif dengan kecocokan KETAT terhadap path
let matched = false;
document.querySelectorAll('.nav-list .nav-link').forEach(a => {
  const linkPath = norm(new URL(a.href, location.origin).pathname || '/');
  if (linkPath === here) {
    a.classList.add('active');
    a.setAttribute('aria-current', 'page');
    matched = true;
  }
});

// 3) Fallback: jika belum ketemu, pakai <body data-page="...">
if (!matched) {
  const hint = document.body.getAttribute('data-page');
  if (hint) {
    const target = document.querySelector(`.nav-link[data-nav="${hint}"]`);
    if (target) {
      target.classList.add('active');
      target.setAttribute('aria-current', 'page');
    }
  }
}

// 4) Toggle mobile menu
const btn  = document.querySelector('.nav-toggle');
const list = document.querySelector('.nav-list');
if (btn && list) {
  btn.addEventListener('click', () => {
    const open = list.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// 5) Efek blur saat scroll
const onScroll = () => {
  document.body.classList.toggle('scrolled', window.scrollY > 8);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
});
