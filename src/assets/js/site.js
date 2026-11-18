// Lightbox de capturas: todas las del artículo forman una secuencia navegable (flechas, teclado, deslizar).
const shots = [...document.querySelectorAll('a[data-lightbox]')];
if (shots.length) {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lb = document.createElement('dialog');
  lb.className = 'lb';
  lb.setAttribute('aria-label', 'Visor de capturas');
  lb.innerHTML = `
    <figure class="lb-stage"><img class="lb-img" alt=""><figcaption class="lb-cap"><span class="lb-title"></span><span class="lb-count"></span></figcaption></figure>
    <button type="button" class="lb-btn lb-close" aria-label="Cerrar">${svg('M6 6l12 12M18 6L6 18')}</button>
    <button type="button" class="lb-btn lb-prev" aria-label="Captura anterior">${svg('M15 5l-7 7 7 7')}</button>
    <button type="button" class="lb-btn lb-next" aria-label="Captura siguiente">${svg('M9 5l7 7-7 7')}</button>`;
  document.body.append(lb);
  const img = lb.querySelector('.lb-img');
  let cur = 0;

  function svg(d) { return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`; }
  function show(i, dir = 0) {
    cur = (i + shots.length) % shots.length;
    const a = shots[cur];
    img.style.width = '';
    img.src = a.href;
    img.alt = a.querySelector('img').alt;
    // Capturas pequeñas: se amplían hasta 1,6x si caben en pantalla, para que se lean bien.
    img.decode().then(() => {
      const mobile = innerWidth <= 700;
      const fit = Math.min(1.6, (innerWidth - (mobile ? 24 : 176)) / img.naturalWidth, (innerHeight - (mobile ? 190 : 140)) / img.naturalHeight);
      if (fit > 1) img.style.width = Math.round(img.naturalWidth * fit) + 'px';
    }).catch(() => {});
    lb.querySelector('.lb-title').textContent = img.alt;
    lb.querySelector('.lb-count').textContent = `${cur + 1} / ${shots.length}`;
    lb.toggleAttribute('data-single', shots.length === 1);
    [cur - 1, cur + 1].forEach(n => { const s = shots[(n + shots.length) % shots.length]; if (s) new Image().src = s.href; });
    if (dir && !still) img.animate([{ opacity: 0, transform: `translateX(${dir * 40}px)` }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }
  // Entrada: la imagen "crece" desde la miniatura que se pulsó.
  function open(i) {
    show(i);
    lb.showModal();
    document.documentElement.classList.add('lb-open');
    if (still) return;
    const from = shots[i].querySelector('img').getBoundingClientRect();
    img.decode().catch(() => {}).then(() => {
      const to = img.getBoundingClientRect();
      if (!to.width) return;
      img.animate([
        { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`, transformOrigin: '0 0' },
        { transform: 'none', transformOrigin: '0 0' },
      ], { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' });
    });
  }
  shots.forEach((a, i) => a.addEventListener('click', e => { e.preventDefault(); open(i); }));
  lb.querySelector('.lb-prev').addEventListener('click', () => show(cur - 1, -1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(cur + 1, 1));
  lb.querySelector('.lb-close').addEventListener('click', () => lb.close());
  lb.addEventListener('close', () => { document.documentElement.classList.remove('lb-open'); shots[cur].focus(); });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) lb.close(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(cur - 1, -1);
    if (e.key === 'ArrowRight') show(cur + 1, 1);
  });
  let x0 = null;
  lb.addEventListener('pointerdown', e => { x0 = e.clientX; });
  lb.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
}

// Aviso breve abajo de la pantalla (copiar enlace, Instagram).
const toast = msg => {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.append(t); }
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('is-on'), 3200);
};
const copyUrl = async (b, msg) => {
  try { await navigator.clipboard.writeText(b.dataset.url); b.dispatchEvent(new Event('copied')); toast(msg); return true; }
  catch { toast(b.dataset.url); return false; }
};

// Copiar enlace del artículo. Los botones compactos no tienen texto: solo el aviso.
document.querySelectorAll('.copy-link').forEach(b => b.addEventListener('click', async () => {
  const label = b.querySelector('span');
  if (await copyUrl(b, 'Enlace copiado') && label) { label.textContent = 'Enlace copiado'; setTimeout(() => { label.textContent = 'Copiar enlace'; }, 2500); }
}));

// Instagram no acepta compartir con un enlace: en el móvil se abre el menú de compartir del sistema
// (donde aparece Instagram); en la computadora se copia el enlace para pegarlo en Instagram.
document.querySelectorAll('.share-native').forEach(b => b.addEventListener('click', async () => {
  if (navigator.share) {
    try { await navigator.share({ title: b.dataset.title, url: b.dataset.url }); } catch { /* cancelado */ }
    return;
  }
  copyUrl(b, 'Enlace copiado: pégalo en tu historia o mensaje de Instagram');
}));

// Disqus solo carga al pedirlo (evita rastreadores y peso en cada visita).
document.querySelectorAll('.load-comments').forEach(b => b.addEventListener('click', () => {
  window.disqus_config = function () { this.page.url = b.dataset.url; this.page.identifier = b.dataset.id; };
  const s = document.createElement('script');
  s.src = `https://${b.dataset.shortname}.disqus.com/embed.js`;
  s.setAttribute('data-timestamp', Date.now());
  document.body.append(s);
  b.remove();
}));

// Buscador + filtro por tema en /blog/. Estado en la URL (?q=…&tema=…) para poder compartir búsquedas.
const q = document.getElementById('q');
if (q) {
  const filters = document.querySelectorAll('.filter');
  const cards = [...document.querySelectorAll('.card')];
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  const params = new URLSearchParams(location.search);
  let tema = params.get('tema') || '';
  q.value = params.get('q') || '';
  if (params.has('buscar')) q.focus();
  const apply = () => {
    const words = norm(q.value).split(/\s+/).filter(Boolean);
    let n = 0;
    cards.forEach(c => {
      const ok = (!tema || c.dataset.temas.split(' ').includes(tema)) && words.every(w => c.dataset.search.includes(w));
      c.hidden = !ok; n += ok;
    });
    document.querySelectorAll('.year').forEach(y => { y.hidden = !y.querySelector('.card:not([hidden])'); });
    filters.forEach(f => f.setAttribute('aria-pressed', String(f.dataset.tema === tema)));
    document.querySelector('.results').textContent = words.length || tema ? `${n} ${n === 1 ? 'artículo' : 'artículos'}` : '';
    document.querySelector('.empty').hidden = n > 0;
    const p = new URLSearchParams();
    if (q.value.trim()) p.set('q', q.value.trim());
    if (tema) p.set('tema', tema);
    history.replaceState(null, '', p.size ? `?${p}` : location.pathname);
  };
  q.addEventListener('input', apply);
  filters.forEach(f => f.addEventListener('click', () => { tema = f.dataset.tema; apply(); }));
  document.querySelector('.link-reset').addEventListener('click', () => { tema = ''; q.value = ''; apply(); q.focus(); });
  apply();
}
// Tecla "/" abre el buscador desde cualquier página (salvo mientras se escribe en un campo).
addEventListener('keydown', e => {
  if (e.key !== '/' || e.ctrlKey || e.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.querySelector('dialog.term[open]')) return;
  e.preventDefault();
  q ? q.focus() : (location.href = '/blog/?buscar');
});

// Tema claro/oscuro: respeta el sistema hasta que el visitante elige; la elección se recuerda.
const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const setLabel = () => {
  const next = `Cambiar a tema ${root.dataset.theme === 'dark' ? 'claro' : 'oscuro'}`;
  toggle.setAttribute('aria-label', next);
  toggle.title = next;
};
if (!root.dataset.theme) root.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
setLabel();
const swap = () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch {}
  const bg = getComputedStyle(document.body).backgroundColor;
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', bg));
  setLabel();
};
toggle.addEventListener('click', () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { swap(); return document.dispatchEvent(new Event('themechange')); }
  // Sin View Transitions (p. ej. Firefox): todos los colores se funden a la vez.
  if (!document.startViewTransition) {
    root.classList.add('theme-fade');
    swap();
    document.dispatchEvent(new Event('themechange'));
    return setTimeout(() => root.classList.remove('theme-fade'), 400);
  }
  // Una sola animación para toda la pantalla: el tema nuevo se revela en círculo desde el botón.
  const r = toggle.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.classList.add('theme-anim');
  const vt = document.startViewTransition(swap);
  vt.ready.then(() => root.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
    { duration: 560, easing: 'cubic-bezier(.65, 0, .35, 1)', pseudoElement: '::view-transition-new(root)' },
  ));
  vt.finished.finally(() => { root.classList.remove('theme-anim'); document.dispatchEvent(new Event('themechange')); });
});

// Índice del artículo: resalta la sección visible, barra de progreso y versión flotante en pantallas estrechas.
const toc = document.querySelector('.toc');
if (toc) {
  const wide = matchMedia('(min-width: 1240px)');
  const syncOpen = () => { toc.open = wide.matches; };
  syncOpen();
  wide.addEventListener('change', syncOpen);
  const links = [...toc.querySelectorAll('ol a')];
  const targets = links.map(a => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
  const mark = id => links.forEach(a => a.classList.toggle('active', a.hash === `#${id}`));
  const spy = new IntersectionObserver(entries => {
    const seen = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (seen) mark(seen.target.id);
  }, { rootMargin: '0px 0px -70% 0px' });
  targets.forEach(t => spy.observe(t));
  links.forEach(a => a.addEventListener('click', () => { if (!wide.matches) toc.open = false; }));

  const bar = document.querySelector('.progress');
  const post = document.querySelector('.post');
  let ticking = false;
  const update = () => {
    const r = post.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    bar.style.setProperty('--p', p.toFixed(4));
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// Pie fijo del móvil: se esconde al bajar (más espacio para leer) y vuelve al subir o al llegar al final.
const foot = document.querySelector('.main-foot');
if (foot) {
  let lastY = scrollY, busy = false;
  const sync = () => {
    busy = false;
    const y = scrollY, end = y + innerHeight >= document.documentElement.scrollHeight - 8;
    if (Math.abs(y - lastY) < 6 && !end) return; // ignora el temblor del dedo
    root.classList.toggle('foot-hidden', y > lastY && y > 80 && !end);
    lastY = y;
  };
  addEventListener('scroll', () => { if (!busy) { busy = true; requestAnimationFrame(sync); } }, { passive: true });
}

// Campo de datos tipo terminal dentro del menú lateral: retícula de puntos donde caen flujos hexadecimales solo
// alrededor del cursor. Al entrar, un pulso de barrido sale del puntero. Escritorio con ratón y sin "menos movimiento".
const side = document.querySelector('.sidebar');
const cv = side && side.querySelector('.matrix');
if (cv && matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = cv.getContext('2d');
  const CH = '0123456789ABCDEF';
  const CELL = 13, R = 130, TRAIL = 10, PULSE = 650;
  let cols = 0, rows = 0, chars = [], heads = [], speeds = [], raf = 0, last = 0;
  let mx = -1e3, my = -1e3, fx = -1e3, fy = -1e3, alpha = 0, inside = false, px = 0, py = 0, pt = -1e4;
  const pick = () => CH[(Math.random() * CH.length) | 0];
  const resize = () => {
    const dpr = devicePixelRatio || 1, w = side.clientWidth, h = side.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / CELL); rows = Math.ceil(h / CELL);
    chars = Array.from({ length: cols * rows }, pick);
    heads = Array.from({ length: cols }, () => Math.random() * rows);
    speeds = Array.from({ length: cols }, () => .2 + Math.random() * .38);
  };
  const frame = t => {
    raf = requestAnimationFrame(frame);
    if (t - last < (inside ? 33 : 55)) return; // ~30 fps con el ratón; la lluvia de fondo, más lenta
    last = t;
    alpha += ((inside ? 1 : 0) - alpha) * .12; // aparece y desaparece con suavidad
    fx += (mx - fx) * .3; fy += (my - fy) * .3; // el foco sigue al cursor con un leve retardo, sin saltos
    const w = side.clientWidth, h = side.clientHeight;
    ctx.clearRect(0, 0, w, h);
    for (let c = 0; c < cols; c++) heads[c] = (heads[c] + speeds[c]) % (rows + TRAIL);
    const dark = root.dataset.theme === 'dark';
    // En claro el verde translúcido sobre blanco casi desaparece: tono más profundo, más opacidad y trazo más grueso.
    const tint = dark ? '74,222,128' : '5,150,105', bright = dark ? '214,255,228' : '4,120,87';
    const gain = dark ? 1 : 2.4, curve = dark ? 1.8 : 1.3;
    ctx.font = `${dark ? 500 : 600} ${CELL - 2}px "SF Mono", ui-monospace, Menlo, Consolas, monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    // Lluvia de fondo, siempre activa y tenue para no competir con el menú; el foco del ratón la intensifica.
    const amb = dark ? .12 : .1 * gain;
    for (let c = 0; c < cols; c++) {
      const hd = heads[c] | 0;
      for (let l = 0; l < TRAIL; l++) {
        const r = hd - l;
        if (r < 0 || r >= rows) continue;
        const x = c * CELL + CELL / 2, y = r * CELL + CELL / 2;
        if (alpha > .05 && Math.hypot(x - fx, y - fy) < R) continue;
        const k = r * cols + c;
        if (l === 0) chars[k] = pick();
        ctx.fillStyle = `rgba(${l === 0 ? bright : tint},${amb * (1 - l / TRAIL) ** 1.4 * (l === 0 ? 1.5 : 1)})`;
        ctx.fillText(chars[k], x, y);
      }
    }
    const pr = (t - pt) / PULSE * R * 1.7;                    // radio del pulso de entrada
    const pa = Math.max(0, 1 - (t - pt) / PULSE);            // y su intensidad, que se apaga al crecer
    // Solo se recorren las celdas dentro del foco (y del pulso mientras dura): barato aunque el menú sea alto.
    const ax = pa > 0 ? [fx - R, fx + R, px - pr - 20, px + pr + 20] : [fx - R, fx + R];
    const ay = pa > 0 ? [fy - R, fy + R, py - pr - 20, py + pr + 20] : [fy - R, fy + R];
    const c0 = Math.max(0, (Math.min(...ax) / CELL) | 0), c1 = Math.min(cols - 1, (Math.max(...ax) / CELL) | 0);
    const r0 = Math.max(0, (Math.min(...ay) / CELL) | 0), r1 = Math.min(rows - 1, (Math.max(...ay) / CELL) | 0);
    for (let c = c0; c <= c1; c++) for (let r = r0; r <= r1; r++) {
      const x = c * CELL + CELL / 2, y = r * CELL + CELL / 2, d = Math.hypot(x - fx, y - fy);
      const ring = pa > 0 ? Math.max(0, 1 - Math.abs(Math.hypot(x - px, y - py) - pr) / 16) * pa : 0;
      if (d > R && !ring) continue;
      const focus = d < R ? (1 - d / R) ** curve : 0;       // brillo que decae suave desde el cursor
      const lag = heads[c] - r;                              // distancia por detrás de la cabeza del flujo
      const trail = lag >= 0 && lag < TRAIL ? (1 - lag / TRAIL) ** 1.4 : 0;
      const k = r * cols + c;
      if (!trail && !ring) {
        // retícula de fondo: un punto, no un carácter, para que el foco se lea limpio
        const v = (dark ? .4 : .5) * focus * alpha;
        if (v < .03) continue;
        ctx.fillStyle = `rgba(${tint},${Math.min(1, v)})`;
        ctx.fillRect(x - .75, y - .75, 1.5, 1.5);
        continue;
      }
      const v = Math.min(1, (trail * .95 * focus + ring * .7) * alpha * gain);
      if (v < .03) continue;
      const head = lag >= 0 && lag < 1;
      if (head || ring > .5) chars[k] = pick();              // solo el frente cambia; la estela queda fija y legible
      ctx.fillStyle = head ? `rgba(${bright},${Math.min(1, v * 1.6)})` : `rgba(${tint},${v * .85})`;
      ctx.fillText(chars[k], x, y);
    }
  };
  side.addEventListener('mousemove', e => { const b = side.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top; });
  side.addEventListener('mouseenter', e => {
    const b = side.getBoundingClientRect();
    mx = fx = px = e.clientX - b.left; my = fy = py = e.clientY - b.top; pt = performance.now();
    inside = true;
    if (!raf) { if (!cols) resize(); raf = requestAnimationFrame(frame); }
  });
  side.addEventListener('mouseleave', () => { inside = false; });
  const start = () => { if (!raf && !document.hidden) { if (!cols) resize(); raf = requestAnimationFrame(frame); } };
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else start(); });
  start();
  addEventListener('resize', () => { cols = 0; if (raf) resize(); });
}

// ---------- Glitch de letras (bienvenida y títulos de los posts) ----------
// Cada letra va por su cuenta: invisible, cambiada por otra o ya bien. Avanza a saltos, no con fundido.
// Las invisibles conservan su hueco y la altura queda fija, así que el titular no mueve la página.
function glitchIn(h, text, steps = 13) {
  h.textContent = text;
  h.style.minHeight = h.offsetHeight + 'px';
  h.setAttribute('aria-label', text);
  const glyphs = 'ABCDEFGHKMNPRSTXZabdeghkmnpqrsxz0123456789#$%&@';
  const rnd = () => glyphs[Math.random() * glyphs.length | 0];
  const cells = [...text].map(c => {
    const el = document.createElement('span');
    el.setAttribute('aria-hidden', 'true');
    el.textContent = c;
    const r = Math.random();
    return { el, c, state: c === ' ' ? 'ok' : r < .45 ? 'off' : r < .8 ? 'bad' : 'ok' };
  });
  h.replaceChildren(...cells.map(x => x.el));
  const paint = x => {
    x.el.className = x.state === 'ok' ? '' : 'g-' + x.state;
    x.el.textContent = x.state === 'bad' ? rnd() : x.c;
  };
  cells.forEach(paint);
  let n = 0;
  const tick = () => {
    n++;
    const k = n / steps;
    for (const x of cells) {
      if (x.c === ' ') continue;
      if (n >= steps) x.state = 'ok';
      else if (x.state !== 'ok') { if (Math.random() < k * .6) x.state = 'ok'; else if (Math.random() < .35) x.state = x.state === 'off' ? 'bad' : 'off'; }
      else if (k < .7 && Math.random() < .06) x.state = Math.random() < .5 ? 'off' : 'bad';
      paint(x);
    }
    if (n < steps) return setTimeout(tick, 55 + Math.random() * 45);
    h.textContent = text;
    h.removeAttribute('aria-label');
    h.style.minHeight = '';
  };
  setTimeout(tick, 120);
}

// Títulos de los posts: el mismo glitch, más corto, al entrar en cada artículo
const postTitle = document.querySelector('.post-header h1');
if (postTitle && !matchMedia('(prefers-reduced-motion: reduce)').matches) glitchIn(postTitle, postTitle.textContent, 9);

// ---------- Bienvenida: un mensaje al azar en cada visita, con efecto glitch ----------
const welcome = document.querySelector('.welcome');
const welcomeData = document.getElementById('welcome-data');
if (welcome && welcomeData) {
  const msgs = JSON.parse(welcomeData.textContent);
  const h = welcome.querySelector('.welcome-h');
  const p = welcome.querySelector('.welcome-p');
  const link = welcome.querySelector('.welcome-link');
  let last = -1;
  try { last = +localStorage.getItem('welcome-last'); } catch (e) {}
  let i = Math.floor(Math.random() * msgs.length);
  if (msgs.length > 1 && i === last) i = (i + 1) % msgs.length;
  try { localStorage.setItem('welcome-last', i); } catch (e) {}
  const m = msgs[i];
  p.textContent = m.p;
  link.hidden = !m.href;
  if (m.href) link.href = m.href;
  const show = () => welcome.classList.add('is-ready');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    h.textContent = m.h;
    show();
  } else {
    welcome.classList.add('is-ready');
    glitchIn(h, m.h, 13);
  }
}

// ---------- Aviso de traducción según el idioma del navegador ----------
// No se usa el país (un tico en EE. UU. quiere leer en español) ni se redirige solo: Google rastrea en inglés
// y una redirección automática le escondería las páginas originales. Se ofrece, y se recuerda si se rechaza.
(() => {
  const OFFER = {
    en: ['This page is in Spanish.', 'Read in English', 'No, thanks'],
    pt: ['Esta página está em espanhol.', 'Ler em português', 'Não, obrigado'],
    fr: ['Cette page est en espagnol.', 'Lire en français', 'Non merci'],
    de: ['Diese Seite ist auf Spanisch.', 'Auf Deutsch lesen', 'Nein, danke'],
    it: ['Questa pagina è in spagnolo.', 'Leggi in italiano', 'No, grazie'],
    'zh-CN': ['此页面为西班牙语。', '用中文阅读', '不用了'],
    ja: ['このページはスペイン語です。', '日本語で読む', 'いいえ'],
    ko: ['이 페이지는 스페인어로 되어 있습니다.', '한국어로 읽기', '괜찮아요'],
    ru: ['Эта страница на испанском.', 'Читать на русском', 'Нет, спасибо'],
    ar: ['هذه الصفحة باللغة الإسبانية.', 'اقرأ بالعربية', 'لا، شكرًا'],
    hi: ['यह पेज स्पेनिश में है।', 'हिंदी में पढ़ें', 'नहीं, धन्यवाद'],
  };
  const pref = (navigator.languages && navigator.languages[0]) || navigator.language || '';
  const base = pref.toLowerCase().startsWith('zh') ? 'zh-CN' : pref.slice(0, 2).toLowerCase();
  if (!base || base === 'es' || !OFFER[base]) return;
  try { if (localStorage.getItem('translate-offer') === 'no') return; } catch (e) {}
  const link = document.querySelector(`.translate-menu a[lang="${base}"]`);
  const main = document.getElementById('main');
  if (!link || !main) return;
  const [msg, yes, no] = OFFER[base];
  const bar = document.createElement('div');
  bar.className = 'translate-offer';
  bar.lang = base;
  if (base === 'ar') bar.dir = 'rtl';
  bar.innerHTML = '<p></p><a class="btn"></a><button type="button" class="translate-offer-no"></button>';
  bar.querySelector('p').textContent = msg;
  const a = bar.querySelector('a');
  a.textContent = yes;
  a.href = link.href;
  const b = bar.querySelector('button');
  b.textContent = no;
  b.addEventListener('click', () => { try { localStorage.setItem('translate-offer', 'no'); } catch (e) {} bar.remove(); });
  main.prepend(bar);
})();

// ================= Detalles hacker =================
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const escH = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
let casesP; // índice de artículos para la terminal y la 404, se pide una sola vez
// CTF: solo se guardan los SHA-256 de las banderas, no las banderas
const FLAG_NAMES = {
  '5ea622e4ff7ba38ee29ed2cdf92de855bff5ed491fc7b37072edf9e82292c638': 'la consola',
  'd4349bf8aefdd53fd459c0926e75d39225f95168c282d3114a801ff09a3b6cfe': 'el código fuente',
  '74613f8d47e15faa266f70f1013abee3dc8d9df0024c367e2c58dc8fa170be56': 'los robots',
  'f694590678d0fc34d535160df051c1461c623c22fb40ad0e5d6307724306638d': 'el historial',
  '5105eba6726eb985c2d9629e132bf677b9fbe608c537fd06de3564a80257be6e': 'la red profunda',
};
const gotFlags = () => { try { return JSON.parse(localStorage.getItem('flags')) || []; } catch (e) { return []; } };
const HIDDEN = {
  '.secreto': 'Si lees esto, ya vas bien.\nHay 5 banderas con formato FLAG{…}:\n  1. donde hablan los navegadores cuando nadie los mira (F12)\n  2. en el código fuente de cualquier página\n  3. en el archivo que leen los robots de los buscadores\n  4. en el historial de alguien descuidado\n  5. al final de la red profunda (escribe dungeon)\nCuando tengas una: submit FLAG{…}',
  '.bash_history': 'ls -la\ncd /var/www\nnano config.php\ngit push --force   # perdón, equipo\necho RkxBR3tiYXNlNjRfbm9fZXNfY2lmcmFkb30= | base64 -d\nrm -rf node_modules\nhistory -c   # se me olvidó ejecutar esto',
};
const FORTUNES = [
  'La contraseña más segura es la que no recuerdas porque la guarda tu gestor de contraseñas.',
  'Si el correo tiene prisa, tú no.',
  'El eslabón más débil no es el firewall: es el humano con sueño un viernes a las 5.',
  'Las copias de seguridad que nunca restauraste son solo esperanza.',
  'No existe la nube: es el ordenador de otra persona.',
  '«Funciona en mi máquina» no es una política de seguridad.',
  'Actualizar hoy es más barato que pagar un rescate mañana.',
  'Un buen hacker lee más de lo que teclea.',
  'Si es gratis y no sabes por qué, el producto eres tú.',
  'El 2FA por SMS es mejor que nada. Una passkey es mejor que el SMS.',
  'Cada servicio que dejas sin usar es una puerta que dejas sin vigilar.',
  'Escanear sin permiso es delito. Escanear tu laboratorio es aprender.',
  'Los logs que no lees no te salvan.',
  'Mínimo privilegio: nadie necesita ser administrador para leer el correo.',
  'Antes de culpar al hacker, revisa la configuración por defecto.',
];
const pickF = () => FORTUNES[Math.random() * FORTUNES.length | 0];
const cases = () => casesP || (casesP = fetch('/terminal.json').then(r => r.json()).catch(() => []));

// ---------- Modo root: Konami (↑↑↓↓←→←→BA) o el comando «root». Fósforo verde y líneas de barrido ----------
const setRoot = on => {
  root.classList.toggle('root-mode', on);
  if (on && root.dataset.theme !== 'dark') toggle.click();
  try { on ? sessionStorage.setItem('root', '1') : sessionStorage.removeItem('root'); } catch (e) {}
};
try { if (sessionStorage.getItem('root')) root.classList.add('root-mode'); } catch (e) {}
{
  const K = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let k = 0;
  addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    k = key === K[k] ? k + 1 : (key === K[0] ? 1 : 0);
    if (k === K.length) { k = 0; const on = !root.classList.contains('root-mode'); if (on && root.classList.contains('neon-mode')) { root.classList.remove('neon-mode'); try { sessionStorage.removeItem('neon'); } catch (e) {} } setRoot(on); toast(on ? '# acceso root concedido' : '$ de vuelta a usuario normal'); }
  });
}

// ---------- Modo neón (atardecer de los 80, rosa y cian): escribir NEONCITY en cualquier parte o el comando «neon» ----------
const setNeon = on => {
  if (on) setRoot(false); // un disfraz a la vez
  root.classList.toggle('neon-mode', on);
  if (on && root.dataset.theme !== 'dark') toggle.click();
  try { on ? sessionStorage.setItem('neon', '1') : sessionStorage.removeItem('neon'); } catch (e) {}
};
try { if (sessionStorage.getItem('neon')) root.classList.add('neon-mode'); } catch (e) {}
{
  let typed = '';
  addEventListener('keydown', e => {
    if (e.key.length !== 1 || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
    typed = (typed + e.key.toLowerCase()).slice(-8);
    if (typed === 'neoncity') { typed = ''; const on = !root.classList.contains('neon-mode'); setNeon(on); toast(on ? 'TRUCO ACTIVADO · modo neón' : 'Truco desactivado'); }
  });
}

// ---------- Terminal: tecla ` o Ctrl+K, o «Terminal» en el menú ----------
let term;
const openTerm = () => {
  if (!term) term = buildTerm();
  if (!term.dlg.open) term.dlg.showModal();
  term.input.focus();
};
function buildTerm() {
  const dlg = document.createElement('dialog');
  dlg.className = 'term';
  dlg.setAttribute('aria-label', 'Terminal de TodoHack');
  dlg.innerHTML = `<div class="term-bar"><span class="term-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="term-title">visitante@todohack: ~</span><button type="button" class="term-x" aria-label="Cerrar terminal">esc</button></div>
<div class="term-out" role="log" aria-live="polite"></div>
<form class="term-in"><label><span class="term-ps" aria-hidden="true">visitante@todohack:~$</span><input name="c" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Escribe un comando"></label></form>`;
  document.body.append(dlg);
  const out = dlg.querySelector('.term-out'), input = dlg.querySelector('input');
  const print = (html, cls = '') => { const p = document.createElement('div'); p.className = 'tl ' + cls; p.innerHTML = html; out.append(p); out.scrollTop = out.scrollHeight; return p; };
  const hist = []; let hi = 0;
  const game = async name => {
    const form = dlg.querySelector('.term-in');
    form.hidden = true; dlg.classList.add('term-game');
    try {
      const v = document.querySelector('meta[name="games-v"]');
      const g = await import(`/assets/js/games.js?v=${v ? v.content : ''}`);
      await g.run(name, { out, dlg });
    } catch (e) { print('No se pudo cargar el juego.', 't-err'); }
    form.hidden = false; dlg.classList.remove('term-game');
    if (dlg.open) input.focus();
  };
  const go = href => { dlg.close(); location.href = href; };
  const pick = async a => { const L = await cases(); const n = parseInt(a, 10); return L[n - 1] || L.find(c => c.s === a); };
  const row = (c, i) => `<span class="t-n">[${String(i + 1).padStart(2, '0')}]</span> <span class="t-d">${c.f}</span> <a href="/${c.s}/">${escH(c.t)}</a>`;
  const C = {
    help: () => print(`comandos:
  <b>ls</b> [palabra]      lista los casos (filtra por palabra)
  <b>cat</b> &lt;n&gt;           resumen del caso n
  <b>open</b> &lt;n&gt;          abre el caso n (también: cd &lt;n&gt;)
  <b>cd</b> blog|sobre-mi|~  ir a una sección
  <b>grep</b> &lt;texto&gt;      busca en títulos, resúmenes y etiquetas
  <b>whoami</b>  <b>date</b>  <b>uptime</b>  <b>neofetch</b>  <b>history</b>
  <b>theme</b> [claro|oscuro]  <b>matrix</b>  <b>root</b>  <b>hack</b>
  <b>juegos</b>           minijuegos y un roguelike
  <b>flags</b>            tus banderas del CTF · <b>submit</b> FLAG{…}
  <b>clear</b>  <b>exit</b>
atajos: ↑ ↓ historial · Tab autocompleta · Esc cierra
(hay comandos que no salen en esta lista)`),
    ls: async a => {
      if (/^-\w*a/.test(a || '')) return print('.  ..  <b>.bash_history</b>  <b>.secreto</b>  casos/  juegos/');
      const L = await cases(), w = (a || '').toLowerCase();
      const R = L.map((c, i) => [c, i]).filter(([c]) => !w || (c.t + ' ' + c.g.join(' ')).toLowerCase().includes(w));
      print(R.length ? R.map(([c, i]) => row(c, i)).join('\n') : `ls: nada coincide con «${escH(a)}»`);
    },
    grep: async a => {
      if (!a) return print('uso: grep &lt;texto&gt;', 't-err');
      const L = await cases(), w = a.toLowerCase();
      const R = L.map((c, i) => [c, i]).filter(([c]) => (c.t + ' ' + c.d + ' ' + c.g.join(' ')).toLowerCase().includes(w));
      print(R.length ? R.map(([c, i]) => row(c, i)).join('\n') + `\n<span class="t-d">${R.length} coincidencia${R.length > 1 ? 's' : ''}</span>` : `grep: «${escH(a)}» no aparece en ningún caso`);
    },
    cat: async a => {
      if (HIDDEN[a]) return print(HIDDEN[a]);
      if (a === '/etc/passwd') return print('root:x:0:0:root:/root:/bin/bash\nvisitante:x:1000:1000:sin contraseña, sin problemas:/home/visitante:/bin/todosh\n(Las contraseñas de verdad no viven aquí desde los 90: están en /etc/shadow, y ese no te lo enseño.)');
      if (a === '/etc/shadow') return print('cat: /etc/shadow: Permiso denegado. Bien intentado.', 't-err');
      const c = await pick(a);
      if (!c) return print(`cat: ${escH(a || '')}: no existe. Prueba «ls».`, 't-err');
      print(`<b>${escH(c.t)}</b>\n<span class="t-d">${c.f} · ${c.g.map(escH).join(', ')}</span>\n${escH(c.d)}\n→ <a href="/${c.s}/">open ${escH(a)}</a>`);
    },
    open: async a => { const c = await pick(a); c ? go(`/${c.s}/`) : print(`open: ${escH(a || '')}: no existe. Prueba «ls».`, 't-err'); },
    cd: a => {
      const D = { '': '/', '~': '/', '/': '/', '..': '/', blog: '/blog/', articulos: '/blog/', 'sobre-mi': '/sobre-mi/', about: '/sobre-mi/' };
      return (a || '') in D ? go(D[a || '']) : C.open(a);
    },
    whoami: () => print('visitante. Sin cuenta, sin contraseña, sin nombre: así debería ser internet.'),
    date: () => print(new Date().toString()),
    uptime: async () => {
      const L = await cases(), first = L.length ? new Date(L[L.length - 1].f) : new Date();
      print(`arriba desde ${first.toISOString().slice(0, 10)} · ${Math.floor((Date.now() - first) / 864e5)} días · ${L.length} casos publicados`);
    },
    neofetch: async () => {
      const L = await cases(), st = document.querySelector('.status-line');
      const logo = [
        ' _____         _       _   _            _',
        '|_   _|__   __| | ___ | | | | __ _  ___| | __',
        "  | |/ _ \\ / _` |/ _ \\| |_| |/ _` |/ __| |/ /",
        '  | | (_) | (_| | (_) |  _  | (_| | (__|   <',
        '  |_|\\___/ \\__,_|\\___/|_| |_|\\__,_|\\___|_|\\_\\',
      ].join('\n');
      print(`<span class="t-logo">${escH(logo)}</span>
<b>host</b>     todohack.github.io
<b>casos</b>    ${L.length}
<b>build</b>    ${st ? escH(st.textContent.split('·')[0].replace('build', '').trim()) : '?'}
<b>tema</b>     ${root.dataset.theme === 'dark' ? 'oscuro' : 'claro'}${root.classList.contains('root-mode') ? ' (root)' : ''}
<b>idioma</b>   ${escH(navigator.language || '?')}
<b>shell</b>    todosh 1.0`);
    },
    history: () => print(hist.map((h, i) => `${String(i + 1).padStart(3)}  ${escH(h)}`).join('\n') || '(vacío)'),
    theme: a => {
      const want = a === 'claro' ? 'light' : a === 'oscuro' ? 'dark' : (root.dataset.theme === 'dark' ? 'light' : 'dark');
      if (root.dataset.theme !== want) toggle.click();
      print(`tema: ${want === 'dark' ? 'oscuro' : 'claro'}`);
    },
    matrix: () => { const on = root.classList.toggle('matrix-boost'); print(on ? 'matrix: al máximo. Mira el menú.' : 'matrix: de vuelta a la lluvia tenue.'); },
    neon: () => { const on = !root.classList.contains('neon-mode'); setNeon(on); print(on ? 'TRUCO ACTIVADO · modo neón. Pista: escribir NEONCITY en cualquier página hace lo mismo.' : 'Modo neón apagado.'); },
    root: () => { const on = !root.classList.contains('root-mode'); if (on) setNeon(false); setRoot(on); print(on ? '# acceso root concedido. Pista: ↑↑↓↓←→←→BA hace lo mismo.' : '$ de vuelta a usuario normal.'); },
    sudo: a => /sandwich|sándwich/.test(a || '') ? print('Vale. 🥪') : print('[sudo] contraseña para visitante: ********\nvisitante no está en el archivo sudoers. Este incidente será reportado. (Es broma.)', 't-err'),
    rm: () => print('rm: permiso denegado. No rompas lo que lees.', 't-err'),
    hack: async () => {
      input.disabled = true;
      const steps = ['escaneando puertos de todohack.github.io…', 'puerto 443 abierto: es una web estática, no hay nada que robar', 'buscando contraseñas en el código fuente…', '0 encontradas: aquí no se guardan secretos en el código', 'probando inyección SQL…', 'no hay base de datos. Ni login. Ni formulario.'];
      for (const s of steps) { print(`<span class="t-d">[${new Date().toLocaleTimeString()}]</span> ${s}`); await new Promise(r => setTimeout(r, calm ? 0 : 420)); }
      print('Conclusión: lo que de verdad funciona es leer y practicar en laboratorios legales.\n→ <a href="/blog/">cd blog</a>', 't-ok');
      input.disabled = false; input.focus();
    },
    juegos: () => {
      const r = k => { try { return localStorage.getItem(k) || '—'; } catch (e) { return '—'; } };
      print(`<b>snake</b>     el gusano que come paquetes          récord ${r('hs-snake')}
<b>crack</b>     descifra la contraseña en 6 intentos  racha ${r('crack-racha')}
<b>phish</b>     ¿phishing o legítimo? 8 casos         récord ${r('hs-phish')}/8
<b>dungeon</b>   roguelike: baja 10 capas de la red profunda   récord ${r('hs-dungeon')}
Esc sale de cualquier juego.`);
    },
    snake: () => game('snake'), crack: () => game('crack'), phish: () => game('phish'), dungeon: () => game('dungeon'),
    fortune: () => print(pickF()),
    ping: a => {
      const host = escH(a || 'todohack.github.io');
      print(`PING ${host}: 56 bytes de datos\n${[0, 1, 2, 3].map(i => `64 bytes de ${host}: icmp_seq=${i + 1} ttl=57 tiempo=${(14 + Math.random() * 20).toFixed(1)} ms`).join('\n')}\n--- 4 paquetes enviados, 4 recibidos, 0% perdidos (simulado) ---`);
    },
    nmap: a => print(`Iniciando nmap contra ${escH(a || 'localhost')} (simulación, aquí no se escanea nada)
PUERTO    ESTADO   SERVICIO
22/tcp    cerrado  ssh
80/tcp    abierto  http   → redirige a 443
443/tcp   abierto  https  (sitio estático)
1337/tcp  filtrado ¿?
Recuerda: escanear equipos ajenos sin permiso es delito. En tu laboratorio, todo lo que quieras.`),
    ssh: () => print('visitante@todohack: Permission denied (publickey).\nSin llave no hay puerta. Así se protege un servidor de verdad.', 't-err'),
    vim: () => print('Has entrado en vim. Para salir escribe :q\n…es broma, esto no es vim. Pero ya sabes cómo salir la próxima vez.'),
    ':q': () => print('Has salido de vim. Mucha gente no lo logra nunca.', 't-ok'),
    nano: () => print('nano: demasiado amable para este blog. Prueba vim (y que la fuerza te acompañe).'),
    cafe: () => print('HTTP 418: soy una tetera. No preparo café (RFC 2324, de verdad existe).'),
    xyzzy: () => print('Nada ocurre.'),
    '42': () => print('Es la respuesta. Ahora falta averiguar cuál era la pregunta.'),
    hola: () => print('Hola, visitante. Si buscas algo que hacer: <b>juegos</b>. Si buscas algo que leer: <b>ls</b>.'),
    make: a => print(/sandwich|sándwich/.test(a || '') ? '¿Qué? Háztelo tú.' : 'make: *** No hay objetivo. Alto.', 't-err'),
    secretos: () => print('Hay 5 banderas escondidas con el formato FLAG{…}. Ninguna requiere romper nada: solo mirar donde casi nadie mira.\nEmpieza con <b>ls -a</b>. Cuando tengas una: <b>submit FLAG{…}</b>. Tu progreso: <b>flags</b>.'),
    base64: a => {
      const [flag, ...rest] = (a || '').split(' ');
      try {
        if (flag === '-d') return print(escH(decodeURIComponent(escape(atob(rest.join(''))))));
        return print(btoa(unescape(encodeURIComponent(a || ''))));
      } catch (e) { return print('base64: entrada no válida', 't-err'); }
    },
    flags: () => {
      const got = gotFlags();
      print(`banderas: ${got.length}/5\n${Object.values(FLAG_NAMES).map(n => `${got.includes(n) ? '<span class="t-ok">[✓]</span>' : '[ ]'} ${n}`).join('\n')}${got.length < 5 ? '\npista: escribe <b>secretos</b>' : ''}`);
    },
    submit: async a => {
      const f = (a || '').trim();
      if (!f) return print('uso: submit FLAG{…}', 't-err');
      let hex = '';
      try { hex = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(f)))].map(b => b.toString(16).padStart(2, '0')).join(''); } catch (e) { return print('submit: tu navegador no puede verificar banderas aquí.', 't-err'); }
      const name = FLAG_NAMES[hex];
      if (!name) return print('Bandera incorrecta. Revisa mayúsculas y llaves.', 't-err');
      const got = gotFlags();
      if (got.includes(name)) return print(`Ya tenías «${name}».`);
      got.push(name);
      try { localStorage.setItem('flags', JSON.stringify(got)); } catch (e) {}
      print(`<b>¡Bandera válida!</b> «${name}» · ${got.length}/5`, 't-ok');
      if (got.length === 5) { print('Las tienes todas. Eres de los que leen el código fuente: así empieza todo hacker de verdad. 🏁', 't-ok'); setRoot(true); }
    },
    sl: async () => {
      input.disabled = true;
      const train = ['   ___ ____', '  |_T_|____|__[]__', '  (o)(o)--(o)(o)  '];
      const p = print('', 't-ok');
      for (let i = 34; i >= -18; i -= 2) {
        p.textContent = train.map(l => (i > 0 ? ' '.repeat(i) + l : l.slice(-i))).join('\n');
        await new Promise(r => setTimeout(r, calm ? 0 : 55));
      }
      p.textContent = '(querías escribir «ls». Todo el mundo lo hace.)';
      input.disabled = false; input.focus();
    },
    clear: () => { out.textContent = ''; },
    exit: () => dlg.close(),
  };
  Object.assign(C, { dir: C.ls, ll: C.ls, man: C.help, cls: C.clear, quit: C.exit, games: C.juegos, gusano: C.snake, mazmorra: C.dungeon, roguelike: C.dungeon, descifra: C.crack, coffee: C.cafe, hello: C.hola, secret: C.secretos, banderas: C.flags });
  const run = async line => {
    print(`<span class="term-ps">visitante@todohack:~$</span> ${escH(line)}`, 't-cmd');
    if (!line) return;
    hist.push(line); hi = hist.length;
    const [cmd, ...rest] = line.split(/\s+/);
    const f = Object.hasOwn(C, cmd.toLowerCase()) && C[cmd.toLowerCase()];
    if (f) await f(rest.join(' ').trim());
    else print(`${escH(cmd)}: comando no encontrado. Escribe <b>help</b>.`, 't-err');
  };
  let queue = Promise.resolve(); // en orden: un comando lento no deja que el siguiente se le adelante
  dlg.querySelector('form').addEventListener('submit', e => { e.preventDefault(); const v = input.value.trim(); input.value = ''; queue = queue.then(() => run(v)); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && hi > 0) { e.preventDefault(); input.value = hist[--hi]; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; }
    else if (e.key === 'Tab' && input.value) {
      e.preventDefault();
      const m = Object.keys(C).filter(k => k.startsWith(input.value.toLowerCase()));
      if (m.length === 1) input.value = m[0] + ' ';
      else if (m.length > 1) print(m.join('  '), 't-d');
    }
  });
  dlg.querySelector('.term-x').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { if (location.hash === '#terminal') history.replaceState(null, '', location.pathname + location.search); });
  print(`TodoHack shell 1.0 · ${new Date().toLocaleDateString()}\nEscribe <b>help</b> para ver los comandos, o <b>ls</b> para ver los casos.`, 't-d');
  return { dlg, input };
}
addEventListener('keydown', e => {
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
  if ((e.key === '`' && !e.ctrlKey && !e.metaKey) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); openTerm(); }
});
document.querySelectorAll('a[href="#terminal"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openTerm(); }));
if (location.hash === '#terminal') openTerm();

// ---------- Línea de estado: ping real de esta carga (de la petición a la primera respuesta) ----------
{
  const ping = document.querySelectorAll('.st-ping');
  const show = () => {
    const n = performance.getEntriesByType('navigation')[0];
    if (n && n.responseStart > 0) ping.forEach(p => { p.textContent = Math.max(1, Math.round(n.responseStart - n.requestStart)) + ' ms'; });
  };
  document.readyState === 'complete' ? show() : addEventListener('load', show);
}

// ---------- Pestaña oculta: el título avisa de la «conexión» en pausa ----------
{
  const t0 = document.title; let back;
  document.addEventListener('visibilitychange', () => {
    clearTimeout(back);
    if (document.hidden) document.title = '// sesión en pausa… · TodoHack';
    else { document.title = '> reconectado'; back = setTimeout(() => { document.title = t0; }, 1400); }
  });
}

// ---------- Progreso de lectura con contador tipo descarga ----------
{
  const bar = document.querySelector('.progress'), post = document.querySelector('.post');
  if (bar && post) {
    const tag = document.createElement('div');
    tag.className = 'progress-tag'; tag.setAttribute('aria-hidden', 'true');
    document.body.append(tag);
    let hide, busy = false;
    const draw = () => {
      const r = post.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      const n = Math.round(p * 12);
      tag.textContent = `[${'▓'.repeat(n)}${'░'.repeat(12 - n)}] ${String(Math.round(p * 100)).padStart(3)}%${p >= .99 ? ' · caso leído' : ''}`;
      tag.classList.add('on'); clearTimeout(hide); hide = setTimeout(() => tag.classList.remove('on'), 1200);
      busy = false;
    };
    addEventListener('scroll', () => { if (!busy) { busy = true; requestAnimationFrame(draw); } }, { passive: true });
  }
}

// ---------- Bloques de código como ventana de terminal, con su lenguaje y botón de copiar ----------
document.querySelectorAll('.prose pre').forEach(pre => {
  const code = pre.querySelector('code');
  const lang = (code && (code.className.match(/lang-(\w+)/) || [])[1]) || 'shell';
  const win = document.createElement('div');
  win.className = 'code-win';
  win.innerHTML = `<div class="code-bar"><span class="term-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="code-lang">${escH(lang)}</span><button type="button" class="code-copy">copiar</button></div>`;
  pre.before(win); win.append(pre);
  const b = win.querySelector('button');
  b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText((code || pre).textContent); b.textContent = 'copiado'; } catch (e) { b.textContent = 'no se pudo'; }
    setTimeout(() => { b.textContent = 'copiar'; }, 1600);
  });
});

// ---------- Menú: las etiquetas se «descifran» al pasar el ratón ----------
if (!calm && matchMedia('(hover: hover)').matches) {
  const G = '01<>/#$%&*+=?ABCDEFXZ';
  document.querySelectorAll('.nav a span').forEach(s => {
    const txt = s.textContent; let id;
    s.closest('a').addEventListener('mouseenter', () => {
      let f = 0; clearInterval(id);
      id = setInterval(() => {
        s.textContent = [...txt].map((c, i) => i < f / 2 ? c : G[Math.random() * G.length | 0]).join('');
        if (++f > txt.length * 2) { clearInterval(id); s.textContent = txt; }
      }, 28);
    });
  });
}

// ---------- 404: traza de terminal con la ruta pedida y casos parecidos ----------
{
  const tr = document.querySelector('.nf-trace');
  if (tr) {
    let path = location.pathname;
    try { path = decodeURIComponent(path); } catch (e) {}
    const words = path.toLowerCase().split(/[^a-z0-9áéíóúñ]+/).filter(w => w.length > 3);
    tr.innerHTML = `$ curl -I https://todohack.github.io${escH(path)}\nHTTP/2 404\nx-motivo: la ruta no existe o cambió de nombre\n$ grep -ri "${escH(words.join(' ') || path)}" /blog`;
    cases().then(L => {
      const hits = L.filter(c => words.some(w => (c.s + ' ' + c.t).toLowerCase().includes(w))).slice(0, 3);
      tr.innerHTML += '\n' + (hits.length ? hits.map(c => `→ <a href="/${c.s}/">${escH(c.t)}</a>`).join('\n') : '(sin coincidencias) → <a href="/blog/">cd /blog</a>');
    });
  }
}

// ---------- Para quien abre las herramientas de desarrollo ----------
console.log('%c\n  T O D O H A C K\n', 'font: 700 20px monospace; color: #f2b33d; background: #0b111d; padding: 6px 12px;');
console.log('%c¿Curioseando el código? Bien hecho: así se aprende.\nPulsa ` (o Ctrl+K) en la página para abrir la terminal. Y hay un código secreto clásico… ↑↑↓↓', 'font: 13px monospace; color: #93b4f2;');
console.log('%cTu primera bandera: FLAG{mira_la_consola} · escríbela en la terminal con «submit»', 'font: 12px monospace; color: #4ade80;');
