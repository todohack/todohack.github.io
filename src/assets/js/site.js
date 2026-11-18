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
  if (e.key !== '/' || e.ctrlKey || e.metaKey || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
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
    if (t - last < 33) return; // ~30 fps
    last = t;
    alpha += ((inside ? 1 : 0) - alpha) * .12; // aparece y desaparece con suavidad
    fx += (mx - fx) * .3; fy += (my - fy) * .3; // el foco sigue al cursor con un leve retardo, sin saltos
    const w = side.clientWidth, h = side.clientHeight;
    ctx.clearRect(0, 0, w, h);
    if (!inside && alpha < .02) { cancelAnimationFrame(raf); raf = 0; return; }
    for (let c = 0; c < cols; c++) heads[c] = (heads[c] + speeds[c]) % (rows + TRAIL);
    const dark = root.dataset.theme === 'dark';
    // En claro el verde translúcido sobre blanco casi desaparece: tono más profundo, más opacidad y trazo más grueso.
    const tint = dark ? '74,222,128' : '5,150,105', bright = dark ? '214,255,228' : '4,120,87';
    const gain = dark ? 1 : 2.4, curve = dark ? 1.8 : 1.3;
    ctx.font = `${dark ? 500 : 600} ${CELL - 2}px "SF Mono", ui-monospace, Menlo, Consolas, monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
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
  addEventListener('resize', () => { cols = 0; if (raf) resize(); });
}

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
    // Cada letra va por su cuenta: invisible, cambiada por otra o ya bien. Avanza a saltos, no con fundido.
    // Las invisibles conservan su hueco y la altura queda fija, así que el titular no mueve la página.
    h.textContent = m.h;
    h.style.minHeight = h.offsetHeight + 'px';
    h.setAttribute('aria-label', m.h);
    const glyphs = 'ABCDEFGHKMNPRSTXZabdeghkmnpqrsxz0123456789#$%&@';
    const rnd = () => glyphs[Math.random() * glyphs.length | 0];
    const cells = [...m.h].map(c => {
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
    welcome.classList.add('is-ready');
    const steps = 13;
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
      h.textContent = m.h;
      h.removeAttribute('aria-label');
      h.style.minHeight = '';
    };
    setTimeout(tick, 120);
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
