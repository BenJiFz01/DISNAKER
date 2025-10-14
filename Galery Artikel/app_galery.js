// ===== Drawer logic (tetap) =====
const drawer = document.getElementById('filterDrawer');
const overlay = document.getElementById('drawerOverlay');
const btnFilter = document.getElementById('btnFilter');
const btnClose = document.getElementById('btnClose');
const btnReset = document.getElementById('btnReset');
const btnApply = document.getElementById('btnApply');

function openDrawer(){
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  overlay.hidden = false;
  overlay.classList.add('show');
  btnFilter.setAttribute('aria-expanded', 'true');
}
function closeDrawer(){
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
  if(e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
});

// chip toggle
document.querySelectorAll('.drawer .chip').forEach(chip=>{
  chip.addEventListener('click', ()=> chip.classList.toggle('active'));
});
// reset chip saat reset form
btnReset?.addEventListener('click', ()=>{
  document.querySelectorAll('.drawer .chip.active').forEach(c=>c.classList.remove('active'));
});

// ====== Filtering, Search, Sort ======
const grid = document.getElementById('grid');
const cards = () => Array.from(grid.querySelectorAll('.card'));
const qInput = document.getElementById('q');

// utils
const parseISO = s => s ? new Date(s + 'T00:00:00') : null;
const includes = (hay, needle) => hay.toLowerCase().includes(needle.toLowerCase());

function getFilterState(){
  const form = drawer.querySelector('form');
  const data = new FormData(form);

  // kategori (checkbox jenis)
  const jenis = data.getAll('jenis'); // array string

  // tanggal
  const from = parseISO(data.get('from'));
  const to   = parseISO(data.get('to'));

  // tags dari chip aktif
  const tags = [...drawer.querySelectorAll('.chip.active')].map(c=>c.dataset.tag);

  // sort
  const sort = data.get('sort') || 'new';

  // query
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

    // by date range
    if (from || to){
      const cd = parseISO(card.dataset.date);
      if (from && cd < from) show = false;
      if (to && cd > to) show = false;
    }

    // by tags
    if (tags.length){
      const ct = (card.dataset.tags || '').split(',').map(s=>s.trim()).filter(Boolean);
      const hit = tags.some(t => ct.includes(t));
      if (!hit) show = false;
    }

    // by search query (title + excerpt)
    if (query){
      const title = card.dataset.title || '';
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

  // buat array dengan nilai sort
  const items = visible.map(c => ({
    el: c,
    date: c.dataset.date,
    title: c.dataset.title.toLowerCase()
  }));

  if (sort === 'new'){
    items.sort((a,b)=> (a.date < b.date ? 1 : -1)); // terbaru dulu
  } else if (sort === 'popular'){
    // placeholder: tanpa data view, fallback ke terbaru
    items.sort((a,b)=> (a.date < b.date ? 1 : -1));
  } else if (sort === 'az'){
    items.sort((a,b)=> a.title.localeCompare(b.title));
  }

  // re-append sesuai urutan
  const frag = document.createDocumentFragment();
  items.forEach(it => frag.appendChild(it.el));
  grid.appendChild(frag);
}

// trigger apply dari drawer
btnApply?.addEventListener('click', ()=>{
  applyFilters();
  applySort();
  closeDrawer();
});

// live search saat user mengetik
qInput?.addEventListener('input', ()=>{
  applyFilters();
  applySort();
});

// initial run
applyFilters();
applySort();