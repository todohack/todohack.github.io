// Iconos que se transforman con morphicons 1.7.1 (copiado en el repo con su integridad verificada contra npm).
// Solo donde hay un cambio de estado. Si este módulo falla, cada icono conserva su SVG fijo.
import { defineMorphIcon } from './vendor/morphicons-1.7.1/element.js';

const MOON = 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z';
const SUN = 'M12 7.5a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4';
const ARROW = 'M5 12h14M13 6l6 6-6 6';
const CLOSE = 'M6 6l12 12M18 6L6 18';
const SEARCH = 'M4 11a7 7 0 1 0 14 0a7 7 0 1 0-14 0M20 20l-3.5-3.5';
const LINK = 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7';
const CHECK = 'M5 12.5l4.5 4.5L19 7.5';
const LIST = 'M4 6h16M4 12h11M4 18h13';

defineMorphIcon();
const make = (d, size = 18, stroke = 2) => {
  const m = document.createElement('morph-icon');
  m.setAttribute('size', size);
  m.setAttribute('stroke-width', stroke);
  m.setAttribute('reduced-motion', 'user');
  m.setAttribute('icon', d);
  return m;
};

// Tema: luna ↔ sol, tras el revelado circular (site.js emite "themechange")
const themeIcon = document.querySelector('.i-morph');
const themeD = () => (document.documentElement.dataset.theme === 'dark' ? SUN : MOON);
if (themeIcon) {
  themeIcon.set(themeD());
  document.addEventListener('themechange', () => themeIcon.morphTo(themeD()));
}

// Menú: cada icono se transforma en su versión propia (data-hover) al pasar el ratón o enfocar con teclado
document.querySelectorAll('.nav a[data-icon]').forEach(a => {
  const svg = a.querySelector('svg');
  if (!svg) return;
  const m = make(a.dataset.icon, 18, 1.8);
  svg.replaceWith(m);
  const on = () => m.morphTo(a.dataset.hover || ARROW), off = () => m.morphTo(a.dataset.icon);
  a.addEventListener('mouseenter', on); a.addEventListener('mouseleave', off);
  a.addEventListener('focus', on); a.addEventListener('blur', off);
});

// Buscador: la lupa se convierte en X cuando hay texto y, al pulsarla, borra la búsqueda
const q = document.getElementById('q');
const searchSvg = q && q.closest('.search').querySelector(':scope > svg');
if (searchSvg) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'search-icon';
  const m = make(SEARCH, 18, 2);
  btn.append(m);
  searchSvg.replaceWith(btn);
  const sync = () => {
    const has = q.value.trim() !== '';
    m.morphTo(has ? CLOSE : SEARCH);
    btn.tabIndex = has ? 0 : -1;
    btn.setAttribute('aria-label', has ? 'Borrar búsqueda' : 'Buscar');
    btn.disabled = !has;
  };
  btn.addEventListener('click', () => { q.value = ''; q.dispatchEvent(new Event('input')); q.focus(); });
  q.addEventListener('input', sync);
  m.set(q.value.trim() ? CLOSE : SEARCH);
  sync();
}

// Compartir: el logo se convierte en flecha al pasar el ratón o enfocar; Instagram muestra ✓ al copiar
const OUT = 'M7 17L17 7M8 7h9v9';
document.querySelectorAll('.share-btn[data-icon]').forEach(a => {
  const svg = a.querySelector('svg');
  if (!svg) return;
  const m = make(a.dataset.icon, 18, 2);
  svg.replaceWith(m);
  const on = () => m.morphTo(OUT), off = () => m.morphTo(a.dataset.icon);
  a.addEventListener('mouseenter', on); a.addEventListener('mouseleave', off);
  a.addEventListener('focus', on); a.addEventListener('blur', off);
  a.addEventListener('copied', () => { m.morphTo(CHECK); setTimeout(off, 2500); });
});

// Copiar enlace: enlace → ✓ al copiar, y de vuelta a los 2,5 s
document.querySelectorAll('.copy-link').forEach(b => {
  const m = make(LINK, b.closest('.share-compact') ? 18 : 16, 2);
  b.prepend(m);
  b.addEventListener('copied', () => { m.morphTo(CHECK); setTimeout(() => m.morphTo(LINK), 2500); });
});

// Traducir: globo → X al abrir el menú de idiomas
const GLOBE = 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10a15.3 15.3 0 0 1-4 10a15.3 15.3 0 0 1-4-10a15.3 15.3 0 0 1 4-10z';
const tr = document.querySelector('.translate');
if (tr) {
  const svg = tr.querySelector('.translate-btn svg');
  const m = make(GLOBE, 20, 2);
  svg.replaceWith(m);
  tr.addEventListener('toggle', () => m.morphTo(tr.open ? CLOSE : GLOBE));
}

// Índice flotante (móvil): líneas → X al abrirlo
const toc = document.querySelector('.toc');
if (toc) {
  const title = toc.querySelector('.toc-title');
  const m = make(toc.open ? CLOSE : LIST, 16, 2);
  m.classList.add('toc-ico');
  title.prepend(m);
  title.classList.add('has-morph');
  toc.addEventListener('toggle', () => m.morphTo(toc.open ? CLOSE : LIST));
}

// Cambia un SVG fijo por su morph-icon y, si se indica, lo transforma al pasar el ratón o enfocar.
const swap = (svg, d, size, hoverD, host = svg.parentElement) => {
  const m = make(d, size, 2);
  svg.replaceWith(m);
  if (hoverD) {
    const on = () => m.morphTo(hoverD), off = () => m.morphTo(d);
    host.addEventListener('mouseenter', on); host.addEventListener('mouseleave', off);
    host.addEventListener('focus', on); host.addEventListener('blur', off);
  }
  return m;
};

// Redes del pie: logo → flecha de salida
document.querySelectorAll('.contact a[data-icon]').forEach(a => {
  const svg = a.querySelector('svg');
  if (svg) swap(svg, a.dataset.icon, 18, OUT, a);
});

// «Leer el caso»: flecha → flecha de salida
const caseLink = document.querySelector('.welcome-link');
if (caseLink) {
  const m = make(ARROW, 16, 2);
  m.classList.add('welcome-arrow');
  caseLink.append(m);
  const on = () => m.morphTo(OUT), off = () => m.morphTo(ARROW);
  caseLink.addEventListener('mouseenter', on); caseLink.addEventListener('mouseleave', off);
  caseLink.addEventListener('focus', on); caseLink.addEventListener('blur', off);
}

// Capturas: lupa → marco de ampliar
const ZOOM = 'M4 11a7 7 0 1 0 14 0a7 7 0 1 0-14 0M20 20l-3.5-3.5M11 8v6M8 11h6';
const EXPAND = 'M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3';
document.querySelectorAll('.shot a[data-lightbox]').forEach(a => {
  const badge = document.createElement('span');
  badge.className = 'shot-zoom';
  badge.setAttribute('aria-hidden', 'true');
  const m = make(ZOOM, 18, 2.2);
  badge.append(m);
  a.append(badge);
  a.classList.add('has-morph');
  const on = () => m.morphTo(EXPAND), off = () => m.morphTo(ZOOM);
  a.addEventListener('mouseenter', on); a.addEventListener('mouseleave', off);
  a.addEventListener('focus', on); a.addEventListener('blur', off);
});

// Visor de capturas: cerrar y flechas; las flechas se alargan al pasar el ratón
const LEFT = 'M15 5l-7 7 7 7', RIGHT = 'M9 5l7 7-7 7';
const LEFT_LONG = 'M19 12H5M11 6l-6 6 6 6', RIGHT_LONG = 'M5 12h14M13 6l6 6-6 6';
const lb = document.querySelector('.lb');
if (lb) {
  const close = lb.querySelector('.lb-close svg'), prev = lb.querySelector('.lb-prev svg'), next = lb.querySelector('.lb-next svg');
  if (close) swap(close, CLOSE, 22);
  if (prev) swap(prev, LEFT, 22, LEFT_LONG);
  if (next) swap(next, RIGHT, 22, RIGHT_LONG);
}

// «Lo que te llevas»: al entrar en pantalla, la casilla se marca y cada punto se tacha con su ✓, uno tras otro.
// Es el momento propio de los posts: lo que te llevas, marcado. Con movimiento reducido se muestra ya marcado.
const BOX = 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z';
const BOX_OK = 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM7.5 12.5l3 3 6-6.5';
const DOT = 'M11.5 12a.5.5 0 1 0 1 0a.5.5 0 1 0-1 0z';
const TICK = 'M5.5 12.5l4.5 4.5 8.5-9.5';
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.box-leccion').forEach(box => {
  const title = box.querySelector('.box-title');
  const items = [...box.querySelectorAll(':scope > ul > li')];
  if (!title) return;
  const head = make(still ? BOX_OK : BOX, 22, 2.2);
  head.classList.add('box-check');
  title.prepend(head);
  const ticks = items.map(li => {
    // morph-icon se dibuja con display: contents; el span es el que se posiciona.
    const wrap = document.createElement('span');
    wrap.className = 'box-tick';
    wrap.setAttribute('aria-hidden', 'true');
    const m = make(still ? TICK : DOT, 16, 2.4);
    wrap.append(m);
    li.prepend(wrap);
    return m;
  });
  box.classList.add('has-ticks');
  if (still) return box.classList.add('is-still');
  const run = () => {
    head.morphTo(BOX_OK);
    ticks.forEach((m, i) => setTimeout(() => { m.morphTo(TICK); items[i].classList.add('is-ticked'); }, 260 + Math.min(i, 6) * 110));
  };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(); io.disconnect(); } }), { threshold: .45 });
  io.observe(box);
});
