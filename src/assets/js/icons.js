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

// Menú: el icono se convierte en flecha al pasar el ratón o enfocar con teclado
document.querySelectorAll('.nav a[data-icon]').forEach(a => {
  const svg = a.querySelector('svg');
  if (!svg) return;
  const m = make(a.dataset.icon, 18, 1.8);
  svg.replaceWith(m);
  const on = () => m.morphTo(ARROW), off = () => m.morphTo(a.dataset.icon);
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

// Copiar enlace: enlace → ✓ al copiar, y de vuelta a los 2,5 s
document.querySelectorAll('.copy-link').forEach(b => {
  const m = make(LINK, 16, 2);
  b.prepend(m);
  b.addEventListener('copied', () => { m.morphTo(CHECK); setTimeout(() => m.morphTo(LINK), 2500); });
});

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
