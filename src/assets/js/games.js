// Juegos de la terminal de TodoHack. Solo se descarga cuando alguien escribe un comando de juego.
// run(nombre, { out, dlg }) devuelve una promesa que se resuelve al salir del juego.

const store = {
  get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
};
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pickOne = a => a[Math.random() * a.length | 0];
const esc = t => String(t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const touch = matchMedia('(hover: none)').matches;
const best = (k, score) => { const b = +store.get(k) || 0; if (score > b) store.set(k, score); return Math.max(b, score); };

// ---------- Sprites pixel art (8×8, dibujados aquí mismo, sin imágenes) ----------
const TS = 16; // casilla en pantalla: sprite de 8×8 a escala 2
const SPR_DEF = {
  me: [['..aaaa..', '.aaaaaa.', 'aabbbbaa', 'aabcbcaa', 'aabbbbaa', '.aaaaaa.', '.adddda.', '.aa..aa.'], { a: '#3a5488', b: '#0b111d', c: '#f2b33d', d: '#4ade80' }],
  b: [['...c....', '...a....', '.aaaaaa.', '.adaada.', '.aaaaaa.', '.aeeeea.', '..a..a..', '.aa..aa.'], { a: '#9aa4b5', c: '#f87171', d: '#22d3ee', e: '#5b6577' }],
  s: [['a......a', '.a.bb.a.', '..bbbb..', 'abbccbba', '..bbbb..', '.a.bb.a.', 'a..aa..a', '........'], { a: '#6b7385', b: '#8b5cf6', c: '#fca5a5' }],
  g: [['........', '.....aa.', '....abca', '.aa.aaaa', 'abaaaa..', 'aaaa....', '.aa.....', '........'], { a: '#4ade80', b: '#166534', c: '#0b111d' }],
  k: [['........', 'aaaaaaaa', 'abababba', 'aaaaaaaa', 'abbbbbba', 'aaaaaaaa', '.c....c.', 'c......c'], { a: '#374151', b: '#e5e7eb', c: '#f2b33d' }],
  t: [['...aa...', '..aaaa..', '.aabaaa.', 'aaaaaaa.', '....aaa.', '...aaaa.', '..aaaaa.', '.cccccc.'], { a: '#c2410c', b: '#0b111d', c: '#7c2d12' }],
  f: [['.....c..', '.....c..', '..aaac..', '.aaaaa.b', 'adaaaaab', '.aaaaa.b', '..aaa...', '........'], { a: '#60a5fa', b: '#2563eb', c: '#e5e7eb', d: '#0b111d' }],
  x: [['.aaaaaa.', 'abbbbbba', 'abcbbcba', 'abbbbbba', 'abcbcbba', 'abbbbbba', '.aaaaaa.', '........'], { a: '#7f1d1d', b: '#ef4444', c: '#fff7ed' }],
  r: [['..aaaa..', '.aaaaaa.', 'aabaabaa', 'aaaaaaaa', 'aaaaaaaa', 'aaaaaaaa', 'a.aa.aa.', '........'], { a: '#a78bfa', b: '#1e1b4b' }],
  D: [['a..a..a.', '..a..a..', '.a..a..a', 'a..a..a.', '..a..a..', '.a..a..a', 'a..a..a.', '........'], { a: '#fb923c' }],
  D2: [['.a..a..a', 'a..a..a.', '..a..a..', '.a..a..a', 'a..a..a.', '..a..a..', '.a..a..a', '........'], { a: '#fdba74' }],
  z: [['..aaaa..', '.abbbba.', 'abbccbba', 'abcddcba', 'abcddcba', 'abbccbba', '.abbbba.', '..aaaa..'], { a: '#991b1b', b: '#fecaca', c: '#ef4444', d: '#0b111d' }],
  A: [['..aaaa..', '.aaaaaa.', '.abbbba.', '.acbbca.', '.abbbba.', 'aaaaaaaa', 'a.aaaa.a', '..a..a..'], { a: '#1f2937', b: '#e5e7eb', c: '#ef4444' }],
  R: [['.aaaaaa.', 'aaaaaaaa', 'abbaabba', 'aaaaaaaa', '.abaaba.', '.cc..cc.', 'cccddccc', 'cccccccc'], { a: '#f0abfc', b: '#4a044e', c: '#f2b33d', d: '#0b111d' }],
  '!': [['........', '.aaaaaa.', '.aabbaa.', '.abbbba.', '.abbbba.', '.aabbaa.', '.aaaaaa.', '........'], { a: '#e5e7eb', b: '#22c55e' }],
  $: [['........', '..aaaa..', '.aabbaa.', '.abaaba.', '.abaaba.', '.aabbaa.', '..aaaa..', '........'], { a: '#f2b33d', b: '#fde68a' }],
  '%': [['..b..b..', '...b..b.', '.aaaaa..', '.accca.a', '.accca.a', '.aaaaaa.', '..aaaa..', '........'], { a: '#e5e7eb', b: '#9ca3af', c: '#7c2d12' }],
  '?': [['........', '.aaaaaa.', '.abbbaa.', '.aaaaaa.', '.abbbba.', '.aaaaaa.', '.abbaaa.', '.aaaaaa.'], { a: '#fef3c7', b: '#2563eb' }],
  ')': [['.......a', '......aa', '.....aa.', '....aa..', '.c.aa...', '..cc....', '.c..c...', '........'], { a: '#93c5fd', c: '#f2b33d' }],
  '[': [['.aaaaaa.', 'aabbbbaa', 'abbccbba', 'abbccbba', 'abbbbbba', '.abbbba.', '..abba..', '...aa...'], { a: '#64748b', b: '#3b82f6', c: '#e5e7eb' }],
  '*': [['........', '.aaa....', 'a...a...', 'a...aaaa', '.aaa.a.a', '.....a..', '........', '........'], { a: '#f2b33d' }],
  '>': [['..aaaa..', '.abbbba.', 'abccccba', 'abcddcba', 'abcddcba', 'abccccba', '.abbbba.', '..aaaa..'], { a: '#166534', b: '#22c55e', c: '#4ade80', d: '#0b111d' }],
  pkt: [['........', '.aaaaaa.', '.abbbba.', '.ab..ba.', '.abbbba.', '.aaaaaa.', '........', '........'], { a: '#93b4f2', b: '#3b5a96' }],
};
// Color principal de cada sprite: tiñe partículas y números flotantes
const SPR_COL = { b: '#9aa4b5', s: '#8b5cf6', g: '#4ade80', k: '#e5e7eb', t: '#c2410c', f: '#60a5fa', x: '#ef4444', r: '#a78bfa', D: '#fb923c', z: '#ef4444', A: '#e5e7eb', R: '#f0abfc', '!': '#22c55e', $: '#f2b33d', '%': '#d6a77a', '?': '#93c5fd', ')': '#93c5fd', '[': '#3b82f6', '*': '#f2b33d' };
let SPR, WHITE, TILE;
const paint = (rows, pal) => {
  const c = document.createElement('canvas'); c.width = c.height = 8;
  const x = c.getContext('2d');
  rows.forEach((r, y) => [...r].forEach((ch, i) => { if (pal[ch]) { x.fillStyle = pal[ch]; x.fillRect(i, y, 1, 1); } }));
  return c;
};
const tile = (base, fn) => {
  const c = document.createElement('canvas'); c.width = c.height = TS;
  const x = c.getContext('2d'); x.fillStyle = base; x.fillRect(0, 0, TS, TS); fn(x); return c;
};
const sprites = () => {
  if (SPR) return;
  SPR = {}; WHITE = {};
  for (const [k, [rows, pal]] of Object.entries(SPR_DEF)) {
    SPR[k] = paint(rows, pal);
    WHITE[k] = paint(rows, Object.fromEntries(Object.keys(pal).map(c => [c, '#ffffff'])));
  }
  const dots = (x, col, n, seed) => { x.fillStyle = col; for (let i = 0; i < n; i++) { const v = (seed * 9301 + i * 49297) % 233280; x.fillRect((v % 8) * 2, ((v / 8 | 0) % 8) * 2, 2, 2); } };
  TILE = {
    floor: [0, 1, 2, 3].map(i => tile('#131c2e', x => { x.fillStyle = '#18233a'; x.fillRect(0, 0, TS, 1); x.fillRect(0, 0, 1, TS); dots(x, '#1b2740', 3, i + 1); })),
    path: [0, 1].map(i => tile('#0d1424', x => dots(x, '#152037', 4, i + 7))),
    wall: [0, 1].map(i => tile('#2a3a5e', x => {
      x.fillStyle = '#3a4f7c'; x.fillRect(0, 0, TS, 3);
      x.fillStyle = '#1d2a47'; x.fillRect(0, 8, TS, 1); x.fillRect(i ? 4 : 10, 3, 1, 5); x.fillRect(i ? 11 : 3, 9, 1, 7);
      x.fillStyle = '#0f1729'; x.fillRect(0, TS - 1, TS, 1);
    })),
  };
};
// Partículas, números flotantes, anillos y temblor: lo comparten snake y dungeon
const fxLayer = () => ({ floats: [], parts: [], rings: [], shake: 0, fade: 0 });
const burst = (fx, x, y, col, n = 14, now = performance.now()) => {
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, v = 30 + Math.random() * 80; fx.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, col, t: now, life: 350 + Math.random() * 350 }); }
};
const drawFx = (ctx, fx, t) => {
  fx.parts = fx.parts.filter(p => t - p.t < p.life);
  for (const p of fx.parts) {
    const a = (t - p.t) / 1000;
    ctx.globalAlpha = 1 - (t - p.t) / p.life;
    ctx.fillStyle = p.col;
    ctx.fillRect(Math.round(p.x + p.vx * a), Math.round(p.y + p.vy * a + 160 * a * a), 2, 2);
  }
  fx.rings = fx.rings.filter(r => t - r.t < 520);
  for (const r of fx.rings) {
    const k = (t - r.t) / 520;
    ctx.globalAlpha = 1 - k; ctx.strokeStyle = r.col; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(r.x, r.y, 6 + k * r.r, 0, 6.283); ctx.stroke();
  }
  fx.floats = fx.floats.filter(f => t - f.t < 800);
  ctx.font = 'bold 11px "JetBrains Mono", ui-monospace, monospace'; ctx.textAlign = 'center';
  for (const f of fx.floats) {
    const k = (t - f.t) / 800;
    ctx.globalAlpha = k < .7 ? 1 : (1 - k) / .3;
    const y = f.y - 6 - k * 18;
    ctx.lineWidth = 3; ctx.strokeStyle = '#05080f'; ctx.strokeText(f.txt, f.x, y);
    ctx.fillStyle = f.col; ctx.fillText(f.txt, f.x, y);
  }
  ctx.globalAlpha = 1;
};
const shakeOffset = (fx, t) => { const k = 1 - (t - fx.shake) / 240; return k > 0 ? [(Math.random() - .5) * 7 * k, (Math.random() - .5) * 7 * k] : [0, 0]; };
const setupCanvas = (cv, w, h) => {
  const dpr = Math.min(2, devicePixelRatio || 1), ctx = cv.getContext('2d');
  cv.width = w * dpr; cv.height = h * dpr; cv.style.width = w + 'px'; cv.style.aspectRatio = `${w} / ${h}`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = false;
  return ctx;
};


// Cruceta táctil: las teclas que envía son las mismas que las del teclado
const dpad = (diag, extra = []) => {
  const D = diag
    ? [['y', '↖'], ['ArrowUp', '↑'], ['u', '↗'], ['ArrowLeft', '←'], ['.', '·'], ['ArrowRight', '→'], ['b', '↙'], ['ArrowDown', '↓'], ['n', '↘']]
    : [['', ''], ['ArrowUp', '↑'], ['', ''], ['ArrowLeft', '←'], ['', ''], ['ArrowRight', '→'], ['', ''], ['ArrowDown', '↓'], ['', '']];
  return `<div class="pad-dirs">${D.map(([k, t]) => k ? `<button type="button" data-k="${k}" aria-label="${k}">${t}</button>` : '<span></span>').join('')}</div>`
    + (extra.length ? `<div class="pad-acts">${extra.map(([k, t]) => `<button type="button" data-k="${k}">${t}</button>`).join('')}</div>` : '');
};

function mount(T, { text = false, pad = '' } = {}) {
  const box = document.createElement('div');
  box.className = 'game';
  box.innerHTML = `<pre class="game-screen"></pre>${pad ? `<div class="game-pad">${pad}</div>` : ''}${text ? '<input class="game-key" autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="send" aria-label="Escribe tu respuesta">' : ''}`;
  T.out.append(box);
  const scr = box.querySelector('.game-screen');
  const keyEl = text ? box.querySelector('.game-key') : box;
  if (!text) box.tabIndex = 0;
  const focus = () => keyEl.focus({ preventScroll: true });
  box.addEventListener('pointerdown', e => { if (!e.target.closest('button')) setTimeout(focus); });
  setTimeout(() => { focus(); T.out.scrollTop = T.out.scrollHeight; });
  return { box, scr, keyEl, focus, text };
}

// Ciclo de vida común: teclado, botones táctiles, Esc y cierre de la terminal terminan el juego.
function session(T, m, onKey, cleanup) {
  return new Promise(res => {
    let over = false;
    const send = e => { if (!over) onKey(e, end); };
    const kd = e => {
      if (e.key === 'Escape') { e.preventDefault(); return end(); }
      if (m.text && e.key.length === 1) return; // lo recoge el evento input (teclados móviles)
      send(e);
    };
    const inp = () => { const v = m.keyEl.value; m.keyEl.value = ''; for (const ch of v) send({ key: ch, preventDefault() {} }); };
    const cancel = e => { e.preventDefault(); end(); };
    function end() {
      if (over) return;
      over = true;
      m.keyEl.removeEventListener('keydown', kd);
      if (m.text) m.keyEl.removeEventListener('input', inp);
      T.dlg.removeEventListener('cancel', cancel);
      T.dlg.removeEventListener('close', end);
      if (cleanup) cleanup();
      m.box.classList.add('done');
      res();
    }
    m.keyEl.addEventListener('keydown', kd);
    if (m.text) m.keyEl.addEventListener('input', inp);
    T.dlg.addEventListener('cancel', cancel);
    T.dlg.addEventListener('close', end);
    m.box.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.k === 'Escape') return end();
      send({ key: b.dataset.k, preventDefault() {} });
      if (!over) m.focus();
    }));
  });
}

// ===================== snake: el gusano que come paquetes =====================
function snake(T) {
  const W = 26, H = 13;
  sprites();
  const m = mount(T, { pad: touch ? dpad(false, [['r', 'otra vez'], ['Escape', 'salir']]) : '' });
  const cv = document.createElement('canvas'); cv.className = 'game-cv';
  m.scr.before(cv);
  const z = T.out.clientWidth >= 640 ? 1.5 : 1;
  const ctx = setupCanvas(cv, W * TS * z, H * TS * z);
  ctx.scale(z, z);
  const fx = fxLayer();
  let s, dir, next, food, score, dead, timer, speed, raf, stepT = 0, deadT = 0;
  const place = () => { do food = [rnd(0, W - 1), rnd(0, H - 1)]; while (s.some(p => p[0] === food[0] && p[1] === food[1])); };
  const hud = () => {
    m.scr.innerHTML = dead
      ? `<b class="g-bad">GUSANO DETENIDO</b> · ${score} paquetes · récord ${best('hs-snake', score)}\n[r] otra vez · [esc] salir`
      : `paquetes ${score} · récord ${+store.get('hs-snake') || 0} · flechas o hjkl para girar · esc sale`;
  };
  const frame = t => {
    raf = requestAnimationFrame(frame);
    const [sx, sy] = shakeOffset(fx, t);
    ctx.save();
    ctx.fillStyle = '#070b14'; ctx.fillRect(0, 0, W * TS, H * TS);
    ctx.translate(Math.round(sx), Math.round(sy));
    ctx.fillStyle = '#0d1424';
    for (let y = 0; y < H; y++) for (let x = (y & 1); x < W; x += 2) ctx.fillRect(x * TS, y * TS, TS, TS);
    // paquete: late y gira su brillo
    const pul = 1 + .12 * Math.sin(t / 140);
    const fs = TS * pul, fo = (TS - fs) / 2;
    ctx.shadowColor = '#93b4f2'; ctx.shadowBlur = 8 + 4 * Math.sin(t / 140);
    ctx.drawImage(SPR.pkt, food[0] * TS + fo, food[1] * TS + fo, fs, fs);
    ctx.shadowBlur = 0;
    // cuerpo: segmentos redondeados con degradado de verde a azul
    const k = dead ? 1 : Math.min(1, (t - stepT) / speed);
    s.forEach((p, i) => {
      if (i === 0) return;
      const fade = dead ? Math.max(0, 1 - (t - deadT - i * 30) / 300) : 1;
      if (fade <= 0) return;
      ctx.globalAlpha = fade;
      const hue = 140 + (i / s.length) * 80;
      ctx.fillStyle = `hsl(${hue} 70% ${55 - (i % 2) * 8}%)`;
      const pad = 2 + Math.min(2, i / 6);
      ctx.beginPath(); ctx.roundRect(p[0] * TS + pad, p[1] * TS + pad, TS - pad * 2, TS - pad * 2, 4); ctx.fill();
    });
    ctx.globalAlpha = 1;
    // cabeza: un poco adelantada mientras avanza, con ojos que miran hacia donde va
    const h = s[0], hx = h[0] * TS + (dead ? 0 : (k - 1) * dir[0] * TS * .25), hy = h[1] * TS + (dead ? 0 : (k - 1) * dir[1] * TS * .25);
    ctx.fillStyle = dead ? '#f87171' : '#f2b33d';
    ctx.beginPath(); ctx.roundRect(hx + 1, hy + 1, TS - 2, TS - 2, 5); ctx.fill();
    ctx.fillStyle = '#0b111d';
    const ex = dir[0] * 3, ey = dir[1] * 3;
    const [e1, e2] = dir[0] ? [[8 + ex, 5], [8 + ex, 11]] : [[5, 8 + ey], [11, 8 + ey]];
    ctx.fillRect(hx + e1[0] - 1, hy + e1[1] - 1, 3, 3); ctx.fillRect(hx + e2[0] - 1, hy + e2[1] - 1, 3, 3);
    drawFx(ctx, fx, t);
    ctx.restore();
    if (dead && t - deadT < 300) { ctx.fillStyle = `rgba(248,113,113,${.25 * (1 - (t - deadT) / 300)})`; ctx.fillRect(0, 0, W * TS, H * TS); }
  };
  const step = () => {
    dir = next;
    const h = [s[0][0] + dir[0], s[0][1] + dir[1]];
    if (h[0] < 0 || h[1] < 0 || h[0] >= W || h[1] >= H || s.some(p => p[0] === h[0] && p[1] === h[1])) {
      dead = true; deadT = performance.now(); fx.shake = deadT; clearInterval(timer);
      burst(fx, s[0][0] * TS + 8, s[0][1] * TS + 8, '#f87171', 22);
      return hud();
    }
    s.unshift(h); stepT = performance.now();
    if (h[0] === food[0] && h[1] === food[1]) {
      score++;
      burst(fx, food[0] * TS + 8, food[1] * TS + 8, '#93b4f2', 12);
      fx.floats.push({ x: food[0] * TS + 8, y: food[1] * TS + 8, txt: '+1', col: '#93b4f2', t: stepT });
      place(); hud();
      if (score % 3 === 0 && speed > 60) { speed -= 10; clearInterval(timer); timer = setInterval(step, speed); }
    } else s.pop();
  };
  const reset = () => { s = [[5, 6], [4, 6], [3, 6]]; dir = next = [1, 0]; score = 0; dead = false; speed = 130; place(); clearInterval(timer); timer = setInterval(step, speed); hud(); };
  const DIRS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], k: [0, -1], j: [0, 1], h: [-1, 0], l: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
  reset();
  raf = requestAnimationFrame(frame);
  return session(T, m, e => {
    const d = DIRS[e.key];
    if (d) { e.preventDefault(); if (!(d[0] === -dir[0] && d[1] === -dir[1])) next = d; }
    else if (e.key === 'r' && dead) reset();
  }, () => { clearInterval(timer); cancelAnimationFrame(raf); });
}

// ===================== crack: descifra la contraseña =====================
const WORDS = ['CLAVE', 'VIRUS', 'TOKEN', 'PROXY', 'LINUX', 'CIFRA', 'REDES', 'DATOS', 'LOGIN', 'ADMIN', 'SHELL', 'MACRO', 'PATCH', 'FALLO', 'ERROR', 'CACHE', 'BYTES', 'TRAZA', 'CARGA', 'SPOOF', 'PHISH', 'DEBUG', 'NODOS', 'LLAVE', 'SALTO', 'FIRMA', 'ALIAS', 'RUTAS', 'PIXEL', 'BOTON'];
function crack(T) {
  const m = mount(T, { text: true, pad: touch ? '<div class="pad-acts"><button type="button" data-k="Backspace">borrar</button><button type="button" data-k="Enter">probar</button><button type="button" data-k="Escape">salir</button></div>' : '' });
  let secret, rows, cur, over;
  const norm = c => c.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  const score = g => {
    const res = Array(5).fill('no'), left = {};
    [...secret].forEach((c, i) => { if (g[i] === c) res[i] = 'ok'; else left[c] = (left[c] || 0) + 1; });
    [...g].forEach((c, i) => { if (res[i] !== 'ok' && left[c]) { res[i] = 'near'; left[c]--; } });
    return res;
  };
  const draw = (msg = '') => {
    const lines = ['DESCIFRA LA CONTRASEÑA · 5 letras, 6 intentos', ''];
    for (let i = 0; i < 6; i++) {
      const r = rows[i];
      if (r) lines.push('  ' + [...r.g].map((c, j) => `<b class="c-${r.s[j]}">${c}</b>`).join(' '));
      else if (i === rows.length && !over) lines.push('  ' + [...cur.padEnd(5, '_')].map(c => `<b class="c-cur">${c}</b>`).join(' '));
      else lines.push('  ' + Array(5).fill('<b class="c-empty">·</b>').join(' '));
    }
    const used = {};
    rows.forEach(r => [...r.g].forEach((c, j) => { const s = r.s[j]; if (used[c] !== 'ok') used[c] = s === 'ok' ? 'ok' : (used[c] === 'near' ? 'near' : s); }));
    lines.push('', 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').map(c => used[c] ? `<span class="k-${used[c]}">${c}</span>` : c).join(''));
    lines.push('', msg || (over ? '' : 'escribe y pulsa Enter · verde: bien · ámbar: está en otro sitio · esc sale'));
    m.scr.innerHTML = lines.join('\n');
  };
  const reset = () => { secret = pickOne(WORDS); rows = []; cur = ''; over = false; draw(); };
  reset();
  return session(T, m, e => {
    if (over) { if (e.key === 'r' || e.key === 'R' || e.key === 'Enter') reset(); return; }
    if (e.key === 'Backspace') { e.preventDefault(); cur = cur.slice(0, -1); return draw(); }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (cur.length < 5) return draw('faltan letras');
      rows.push({ g: cur, s: score(cur) });
      const won = cur === secret; cur = '';
      if (won || rows.length === 6) {
        over = true;
        const streak = won ? (+store.get('crack-racha') || 0) + 1 : 0;
        store.set('crack-racha', streak);
        return draw(won
          ? `<b class="g-ok">ACCESO CONCEDIDO</b> en ${rows.length} intento${rows.length > 1 ? 's' : ''} · racha ${streak}\nEn la vida real una clave de 5 letras cae en milisegundos: usa frases largas.\n[r] otra · [esc] salir`
          : `<b class="g-bad">ACCESO DENEGADO</b>. La contraseña era <b>${secret}</b>.\n[r] otra · [esc] salir`);
      }
      return draw();
    }
    const c = norm(e.key);
    if (/^[A-ZÑ]$/.test(c) && cur.length < 5) { cur += c; draw(); }
  });
}

// ===================== phish: ¿phishing o legítimo? =====================
const CASES = [
  { p: 1, t: 'De: "Soporte Microsoft" <alerta@micros0ft-seguridad.com>\nAsunto: Tu cuenta se cerrará hoy\n«Verifica tu contraseña en las próximas 2 horas: bit.ly/verif-ms»', w: 'Un cero en lugar de la «o», urgencia y enlace acortado. Microsoft no te cierra la cuenta por correo.' },
  { p: 0, t: 'De: notificaciones@github.com\nAsunto: Nuevo inicio de sesión desde Windows · Chrome\n«Si fuiste tú, ignora este correo. Si no, revisa tu cuenta entrando a github.com.»', w: 'No pide datos ni trae enlaces raros: te manda a entrar tú mismo al sitio.' },
  { p: 1, t: 'SMS de «Correos CR»:\n«Tu paquete está retenido. Paga ₡1 250 de aduana aquí: correos-cr.delivery-pago.top»', w: 'Dominio .top que no es de Correos y un cobro pequeño para quedarse con tu tarjeta.' },
  { p: 1, t: 'WhatsApp de un número desconocido:\n«Hola mamá, se me cayó el teléfono al agua, este es mi número nuevo. ¿Me haces un SINPE urgente?»', w: 'La estafa del familiar. Llama al número de siempre antes de mandar un colón.' },
  { p: 0, t: 'Aviso dentro de la app oficial de tu banco:\n«Nunca te pediremos tu clave ni códigos por teléfono. Activa la verificación en dos pasos en Ajustes.»', w: 'Es un consejo dentro de la app, no pide nada ni te saca a otra web.' },
  { p: 1, t: 'De: rrhh@tu-empresa.com.facturas-online.net\nAsunto: Ajuste salarial 2026.xlsm\n«Habilita las macros para ver tu nuevo salario.»', w: 'El dominio real es facturas-online.net, y «habilita las macros» es la puerta clásica del malware.' },
  { p: 1, t: 'Llamada: «Somos del soporte de su banco. Detectamos un fraude; para bloquearlo díctenos el código que le acaba de llegar por SMS.»', w: 'Ese código sirve para autorizar operaciones. Nadie legítimo te lo pide.' },
  { p: 0, t: 'De: no-reply@accounts.google.com\nAsunto: Alerta de seguridad\n«Se añadió una nueva passkey a tu cuenta. Revisa la actividad en myaccount.google.com.»', w: 'Dominio correcto y no pide credenciales. Aun así, revísalo entrando tú, no desde el correo.' },
  { p: 1, t: 'Anuncio en redes:\n«Netflix gratis 12 meses por el aniversario. Solo inicia sesión aquí: netf1ix-promo.com»', w: 'Regalo demasiado bueno y un «1» en lugar de la «l». Busca la promo en la web oficial.' },
  { p: 0, t: 'Tu jefe, por el canal interno de siempre:\n«Recuerda que la reunión de mañana es a las 9.»', w: 'No pide dinero, datos ni prisa. No todo es un ataque.' },
  { p: 1, t: 'De: facturacion@uber-eats-soporte.help\n«Tu pedido se cobró dos veces. Para el reembolso, escribe los datos de tu tarjeta.»', w: 'Dominio inventado y te pide la tarjeta. Los reembolsos se gestionan dentro de la app.' },
  { p: 1, t: 'Un código QR pegado encima del parquímetro:\n«Paga aquí más rápido».', w: 'Quishing: QR falsos sobre los reales. Paga desde la app oficial o en el aparato.' },
  { p: 0, t: 'Correo desde el dominio oficial de tu universidad:\n«El sistema de matrícula estará en mantenimiento el sábado de 8 a 12.»', w: 'Solo informa: sin enlaces, sin pedidos, sin urgencia.' },
  { p: 1, t: 'Ventana emergente en el navegador:\n«¡Tu PC tiene 5 virus! Llama ya al 800-SOPORTE.»', w: 'Scareware: una web no puede escanear tu equipo. Cierra la pestaña.' },
];
function phish(T) {
  const m = mount(T, { pad: '<div class="pad-acts"><button type="button" data-k="p">phishing</button><button type="button" data-k="l">legítimo</button><button type="button" data-k="Escape">salir</button></div>' });
  let deck, i, ok, answered;
  const draw = extra => {
    const c = deck[i];
    m.scr.innerHTML = `¿PHISHING O LEGÍTIMO? · caso ${i + 1}/${deck.length} · aciertos ${ok}\n\n${esc(c.t)}\n\n${extra || '[p] phishing · [l] legítimo · esc sale'}`;
    T.out.scrollTop = T.out.scrollHeight;
  };
  const finish = () => {
    const rank = ok === deck.length ? 'Ojo de halcón. Nadie te pesca.' : ok >= 6 ? 'Muy bien. Un par más y eres el filtro antispam de tu familia.' : ok >= 4 ? 'Vas bien, pero los estafadores también practican.' : 'Cuidado: hoy te habrían pescado. Lee el blog y vuelve a intentarlo.';
    m.scr.innerHTML = `RESULTADO: ${ok}/${deck.length} · récord ${best('hs-phish', ok)}\n${rank}\n\n[r] otra ronda · [esc] salir`;
    answered = 'end';
  };
  const reset = () => { deck = [...CASES].sort(() => Math.random() - .5).slice(0, 8); i = 0; ok = 0; answered = false; draw(); };
  reset();
  return session(T, m, e => {
    if (answered === 'end') { if (e.key === 'r') reset(); return; }
    if (answered) { answered = false; if (++i >= deck.length) return finish(); return draw(); }
    if (e.key !== 'p' && e.key !== 'l') return;
    const right = (e.key === 'p') === !!deck[i].p;
    if (right) ok++;
    answered = true;
    draw(`${right ? '<b class="g-ok">✓ Correcto.</b>' : '<b class="g-bad">✗ No.</b>'} Era ${deck[i].p ? 'phishing' : 'legítimo'}. ${esc(deck[i].w)}\n\n(cualquier tecla para seguir)`);
  });
}

// ===================== dungeon: La red profunda (roguelike) =====================
const MON = [
  { g: 'b', n: 'bot de spam', d: 1, hp: 3, a: 2, f: 0, xp: 2 },
  { g: 's', n: 'scraper', d: 1, hp: 5, a: 2, f: 0, xp: 3 },
  { g: 'g', n: 'gusano', d: 2, hp: 6, a: 3, f: 0, xp: 4, sp: 'split' },
  { g: 'k', n: 'keylogger', d: 3, hp: 7, a: 3, f: 1, xp: 6, sp: 'steal' },
  { g: 't', n: 'troyano', d: 3, hp: 10, a: 4, f: 1, xp: 8, sp: 'mimic' },
  { g: 'f', n: 'phisher', d: 4, hp: 9, a: 4, f: 1, xp: 8, sp: 'confuse' },
  { g: 'x', n: 'exploit kit', d: 5, hp: 13, a: 5, f: 2, xp: 12 },
  { g: 'r', n: 'rootkit', d: 6, hp: 14, a: 6, f: 2, xp: 15, sp: 'invis' },
  { g: 'D', n: 'botnet DDoS', d: 7, hp: 13, a: 5, f: 2, xp: 16, sp: 'fast', ar: 'la' },
  { g: 'z', n: 'zero-day', d: 8, hp: 22, a: 8, f: 3, xp: 24 },
  { g: 'A', n: 'grupo APT', d: 9, hp: 28, a: 9, f: 4, xp: 30 },
  { g: 'R', n: 'Señor del Ransomware', d: 10, hp: 95, a: 13, f: 5, xp: 120, sp: 'boss' },
];
const EXPLOITS = ['un exploit de desbordamiento', 'una inyección SQL afilada', 'un payload ofuscado', 'una cadena ROP', 'un XSS persistente'];
const SHIELDS = ['un firewall de aplicación', 'un parche de kernel', 'segmentación de red', 'MFA reforzado', 'un EDR nuevo'];
const ART = { a: o => (o.ar === 'la' ? 'a la' : 'al'), el: o => (o.ar === 'la' ? 'La' : 'El') };

function dungeon(T) {
  const W = 46, H = 17, R = 7, LAST = 10;
  sprites();
  const m = mount(T, { pad: touch ? dpad(true, [['p', 'parche'], ['e', 'script'], ['>', 'bajar'], ['Escape', 'salir']]) : '' });
  const cv = document.createElement('canvas'); cv.className = 'game-cv';
  const hud = document.createElement('div'); hud.className = 'game-hud';
  m.scr.classList.add('game-log'); m.scr.after(cv); cv.after(hud);
  let ctx, cols = W, cam = 0, raf = 0, lastT = performance.now(), zoom = 1;
  // Zoom según el espacio (sprites grandes en escritorio); si el mapa no cabe, la cámara sigue al jugador
  const size = () => {
    const w = T.out.clientWidth - 8;
    zoom = w >= 700 && innerHeight >= 760 ? 2 : w >= 560 ? 1.5 : 1;
    cols = Math.max(12, Math.min(W, Math.floor(w / (TS * zoom))));
    ctx = setupCanvas(cv, cols * TS * zoom, H * TS * zoom);
    ctx.scale(zoom, zoom);
  };
  const fx = fxLayer();
  const now = () => performance.now();
  const float = (x, y, txt, col) => fx.floats.push({ x: x * TS + 8, y: y * TS + 4, txt, col, t: now() });
  const pop = (x, y, col, n) => burst(fx, x * TS + 8, y * TS + 8, col, n);
  const lunge = (e, tx, ty) => { e.lg = { dx: Math.sign(tx - e.x), dy: Math.sign(ty - e.y), t: now() }; };
  let P, depth, map, seen, vis, mons, items, stairs, turn, log, state, cause;
  const say = t => { log.push(t); if (log.length > 50) log.shift(); };
  const walk = (x, y) => x >= 0 && y >= 0 && x < W && y < H && map[y][x] > 0;
  const monAt = (x, y) => mons.find(o => o.x === x && o.y === y);
  const itemAt = (x, y) => items.find(o => o.x === x && o.y === y);
  const busy = (x, y) => monAt(x, y) || itemAt(x, y) || (x === P.x && y === P.y) || (stairs && x === stairs.x && y === stairs.y);
  const need = l => 8 * l + 4 * l * l;

  const carve = (a, b) => {
    const hz = Math.random() < .5;
    const [x1, y1, x2, y2] = [a.cx, a.cy, b.cx, b.cy];
    const H1 = (y, xa, xb) => { for (let x = Math.min(xa, xb); x <= Math.max(xa, xb); x++) if (!map[y][x]) map[y][x] = 2; };
    const V1 = (x, ya, yb) => { for (let y = Math.min(ya, yb); y <= Math.max(ya, yb); y++) if (!map[y][x]) map[y][x] = 2; };
    if (hz) { H1(y1, x1, x2); V1(x2, y1, y2); } else { V1(x1, y1, y2); H1(y2, x1, x2); }
  };
  const freeIn = r => { for (let k = 0; k < 40; k++) { const x = rnd(r.x, r.x + r.w - 1), y = rnd(r.y, r.y + r.h - 1); if (!busy(x, y)) return { x, y }; } return null; };
  const freeNear = (x, y) => { for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) if (walk(x + dx, y + dy) && !busy(x + dx, y + dy)) return { x: x + dx, y: y + dy }; return null; };
  // Los enemigos viejos se endurecen en capas profundas: un bot de la capa 8 ya no cae de un golpe
  const spawn = (t, pos) => { if (!pos) return; const k = 1 + .1 * Math.max(0, depth - t.d); mons.push({ ...t, ...pos, hp: Math.round(t.hp * k), a: Math.round(t.a * (1 + .05 * Math.max(0, depth - t.d))), xp: Math.round(t.xp * (t.sp === 'boss' ? 1 : .8)), awake: false, hidden: t.sp === 'mimic' }); };
  const rollItem = () => { const r = Math.random(); return r < .28 ? '!' : r < .5 ? '$' : r < .64 ? '%' : r < .78 ? '?' : r < .89 ? ')' : '['; };

  const gen = () => {
    let rooms;
    do {
      map = Array.from({ length: H }, () => Array(W).fill(0)); // 0 roca · 1 sala · 2 pasillo
      rooms = [];
      for (let i = 0; i < 80 && rooms.length < 8; i++) {
        const w = rnd(4, 10), h = rnd(3, 5), x = rnd(1, W - w - 2), y = rnd(1, H - h - 2);
        if (rooms.some(r => x <= r.x + r.w + 1 && x + w + 1 >= r.x && y <= r.y + r.h + 1 && y + h + 1 >= r.y)) continue;
        rooms.push({ x, y, w, h, cx: x + (w >> 1), cy: y + (h >> 1) });
        for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) map[yy][xx] = 1;
      }
    } while (rooms.length < 4);
    rooms.sort((a, b) => a.cx - b.cx); // pasillos de izquierda a derecha: menos cruces
    for (let i = 1; i < rooms.length; i++) carve(rooms[i - 1], rooms[i]);
    carve(rooms[0], rooms[rnd(2, rooms.length - 1)]); // un bucle extra para poder huir
    seen = map.map(r => r.map(() => false));
    depth++; fx.fade = now(); fx.parts = []; fx.floats = []; fx.rings = [];
    const first = rooms[0], last = rooms[rooms.length - 1];
    mons = []; items = []; stairs = null;
    P.x = first.cx; P.y = first.cy; P.vx = undefined; cam = -999;
    if (depth < LAST) stairs = { x: last.cx, y: last.cy };
    const pool = MON.filter(t => t.d <= depth && t.sp !== 'boss');
    for (let i = 0; i < 3 + depth + (depth >> 2); i++) spawn(Math.random() < .7 ? pickOne(pool.slice(-4)) : pickOne(pool), freeIn(rooms[rnd(1, rooms.length - 1)]));
    if (depth === LAST) spawn(MON[MON.length - 1], freeIn(last));
    for (let i = rnd(4, 7); i > 0; i--) { const pos = freeIn(pickOne(rooms)); if (pos) items.push({ ...pos, k: rollItem() }); }
    say(depth === 1 ? 'Entras en la red profunda. Encuentra el > para bajar de capa. Pulsa ? para ver los controles.'
      : depth === LAST ? 'Capa 10. Todo huele a cifrado: el Señor del Ransomware está cerca.' : `Bajas a la capa ${depth}.`);
    fov();
  };

  const los = (x0, y0, x1, y1) => {
    let dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, err = dx + dy;
    for (;;) {
      if (x0 === x1 && y0 === y1) return true;
      if (!(x0 === P.x && y0 === P.y) && !walk(x0, y0)) return false;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  };
  const fov = () => {
    vis = map.map(r => r.map(() => false));
    for (let y = Math.max(0, P.y - R); y <= Math.min(H - 1, P.y + R); y++)
      for (let x = Math.max(0, P.x - R); x <= Math.min(W - 1, P.x + R); x++)
        if ((x - P.x) ** 2 + (y - P.y) ** 2 <= R * R && los(P.x, P.y, x, y)) { vis[y][x] = true; seen[y][x] = true; }
  };
  const isWall = (x, y) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (walk(x + dx, y + dy)) return true; return false; };
  const shown = o => !(o.sp === 'invis' && !o.seen && Math.max(Math.abs(o.x - P.x), Math.abs(o.y - P.y)) > 1);

  const HELP = 'flechas o hjkl mover · yubn diagonales · . esperar · > bajar · p parche · e script · esc salir';
  const render = () => {
    if (state !== 'play') return;
    const msgs = log.slice(-2);
    m.scr.innerHTML = `${msgs.length > 1 ? `<span class="g-dim">${esc(msgs[0])}</span>` : ' '}\n${esc(msgs[msgs.length - 1] || ' ')}`;
    const pct = Math.max(0, P.hp / P.max), xpPct = P.xp / need(P.lvl);
    hud.innerHTML = `<span class="hud-hp ${pct <= .25 ? 'is-low' : ''}"><b>HP</b><i><s style="width:${(pct * 100).toFixed(0)}%"></s></i>${P.hp}/${P.max}</span>`
      + `<span class="hud-xp"><b>Nv ${P.lvl}</b><i><s style="width:${(Math.min(1, xpPct) * 100).toFixed(0)}%"></s></i></span>`
      + `<span>Capa <b>${depth}</b>/${LAST}</span><span>ATK <b>${P.atk}</b></span><span>DEF <b>${P.def}</b></span>`
      + `<span class="${P.energy < 80 ? 'is-low' : ''}">Energía <b>${P.energy}</b></span><span>₿ <b>${P.gold}</b></span>`
      + `<span>Parches <b>${P.patches}</b></span><span>Scripts <b>${P.scripts}</b></span><span class="hud-turn">turno ${turn}</span>`;
  };
  const sprAt = (spr, white, e, t, seed, alpha = 1, glow = '') => {
    let ox = 0, oy = 0;
    if (e.lg) { const a = (t - e.lg.t) / 150; if (a < 1) { const k = Math.sin(a * Math.PI) * 6; ox = e.lg.dx * k; oy = e.lg.dy * k; } else e.lg = null; }
    const bob = Math.sin(t / 240 + seed) > .2 ? -1 : 0; // dos fotogramas de respiración, a lo clásico
    const x = Math.round(e.vx * TS + ox), y = Math.round(e.vy * TS + oy + bob);
    ctx.globalAlpha = alpha;
    if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 10 + 5 * Math.sin(t / 180); }
    ctx.drawImage(e.fl && t - e.fl < 110 ? white : spr, x, y, TS, TS);
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  };
  const frame = t => {
    raf = requestAnimationFrame(frame);
    if (state !== 'play' && state !== 'dying') return;
    const dt = Math.min(.05, (t - lastT) / 1000); lastT = t;
    const ease = 1 - Math.pow(1e-6, dt);
    for (const e of [P, ...mons]) {
      if (e.vx === undefined || Math.abs(e.vx - e.x) + Math.abs(e.vy - e.y) > 3) { e.vx = e.x; e.vy = e.y; }
      e.vx += (e.x - e.vx) * ease; e.vy += (e.y - e.vy) * ease;
    }
    const camT = cols >= W ? 0 : Math.max(0, Math.min(W - cols, P.vx - cols / 2 + .5));
    cam = Math.abs(camT - cam) > cols ? camT : cam + (camT - cam) * ease;
    const [sx, sy] = shakeOffset(fx, t);
    ctx.save();
    ctx.fillStyle = '#05080f'; ctx.fillRect(0, 0, cols * TS, H * TS);
    ctx.translate(Math.round(-cam * TS + sx), Math.round(sy));
    const x0 = Math.max(0, Math.floor(cam) - 1), x1 = Math.min(W - 1, Math.ceil(cam + cols));
    for (let y = 0; y < H; y++) for (let x = x0; x <= x1; x++) {
      if (!seen[y][x]) continue;
      const k = map[y][x];
      const img = k === 1 ? TILE.floor[(x * 7 + y * 13) & 3] : k === 2 ? TILE.path[(x * 5 + y * 3) & 1] : isWall(x, y) ? TILE.wall[(x + y) & 1] : null;
      if (!img) continue;
      ctx.drawImage(img, x * TS, y * TS);
      if (!vis[y][x]) { ctx.fillStyle = 'rgba(5,8,15,.62)'; ctx.fillRect(x * TS, y * TS, TS, TS); }
    }
    if (stairs && seen[stairs.y][stairs.x]) {
      const v = vis[stairs.y][stairs.x], pul = .8 + .2 * Math.sin(t / 220);
      ctx.globalAlpha = v ? pul : .35;
      if (v) { ctx.shadowColor = '#4ade80'; ctx.shadowBlur = 12 * pul; }
      ctx.drawImage(SPR['>'], stairs.x * TS, stairs.y * TS, TS, TS);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
    for (const it of items) {
      if (!vis[it.y][it.x]) continue;
      const b = (it.k === '$' || it.k === '*') ? Math.round(Math.sin(t / 200 + it.x) * 1.5) : 0;
      if (it.k === '*') { ctx.shadowColor = '#f2b33d'; ctx.shadowBlur = 14; }
      ctx.drawImage(SPR[it.k], it.x * TS, it.y * TS + b, TS, TS);
      ctx.shadowBlur = 0;
    }
    for (const o of mons) {
      if (!vis[o.y][o.x] || !shown(o)) continue;
      const key = o.hidden ? '!' : o.g === 'D' && Math.floor(t / 180) % 2 ? 'D2' : o.g;
      sprAt(SPR[key], WHITE[key], o, t, o.x * 1.7 + o.y, o.sp === 'invis' && !o.seen ? .5 : 1, o.sp === 'boss' ? '#f0abfc' : '');
      if (!o.hidden && o.hp < o.max) { // barra de vida sobre los enemigos heridos
        ctx.fillStyle = '#05080f'; ctx.fillRect(Math.round(o.vx * TS) + 2, Math.round(o.vy * TS) - 3, 12, 3);
        ctx.fillStyle = '#f87171'; ctx.fillRect(Math.round(o.vx * TS) + 2, Math.round(o.vy * TS) - 3, Math.max(1, Math.round(12 * o.hp / o.max)), 3);
      }
    }
    if (state === 'play') sprAt(SPR.me, WHITE.me, P, t, 0, 1, P.conf ? '#c084fc' : '');
    // luz de antorcha alrededor del jugador, con parpadeo
    const cx = P.vx * TS + 8, cy = P.vy * TS + 8, r = (R + .6) * TS * (1 + .03 * Math.sin(t / 90) + .02 * Math.sin(t / 37));
    const g = ctx.createRadialGradient(cx, cy, r * .2, cx, cy, r);
    g.addColorStop(0, 'rgba(242,179,61,.07)'); g.addColorStop(.65, 'rgba(5,8,15,.08)'); g.addColorStop(1, 'rgba(5,8,15,.6)');
    ctx.fillStyle = g; ctx.fillRect(x0 * TS, 0, (x1 - x0 + 1) * TS, H * TS);
    drawFx(ctx, fx, t);
    ctx.restore();
    const fa = (t - fx.fade) / 450; // fundido al bajar de capa
    if (fa < 1) { ctx.fillStyle = `rgba(5,8,15,${1 - fa})`; ctx.fillRect(0, 0, cols * TS, H * TS); }
    if (P.hp <= P.max / 4 && state === 'play') { ctx.fillStyle = `rgba(248,113,113,${.06 + .05 * Math.sin(t / 160)})`; ctx.fillRect(0, 0, cols * TS, H * TS); }
  };

  const levelUp = () => {
    while (P.xp >= need(P.lvl)) {
      P.lvl++; P.max += 4; P.hp = Math.min(P.max, P.hp + 4);
      P.atk++; if (P.lvl % 3 === 0) P.def++;
      say(`Subes a nivel ${P.lvl}. Te sientes más afilado.`);
      fx.rings.push({ x: P.x * TS + 8, y: P.y * TS + 8, r: 40, col: '#f2b33d', t: now() }); float(P.x, P.y - .6, `NIVEL ${P.lvl}`, '#f2b33d');
    }
  };
  const kill = o => {
    mons.splice(mons.indexOf(o), 1);
    P.xp += o.xp; P.kills++;
    pop(o.x, o.y, SPR_COL[o.g] || '#fff', o.sp === 'boss' ? 60 : 16);
    if (o.sp === 'boss') fx.shake = now();
    if (o.sp === 'boss') { items.push({ x: o.x, y: o.y, k: '*' }); say('El Señor del Ransomware cae y suelta la clave maestra (*). ¡Recógela!'); }
    else { say(`Eliminas ${ART.a(o)} ${o.n}.`); if (Math.random() < .2 && !itemAt(o.x, o.y)) items.push({ x: o.x, y: o.y, k: '$' }); }
    levelUp();
  };
  const hurt = (o, d) => {
    o.hp -= d; o.awake = true; o.fl = now();
    float(o.x, o.y, `−${d}`, '#fde68a');
    if (o.hp <= 0) return kill(o), true;
    if (o.sp === 'split' && mons.length < 30) {
      const pos = freeNear(o.x, o.y);
      if (pos && o.hp >= 2) { o.hp = Math.ceil(o.hp / 2); mons.push({ ...o, ...pos }); say('¡El gusano se replica!'); }
    }
    return false;
  };
  const attack = o => {
    if (o.hidden) { o.hidden = false; say(`¡Ese parche era un ${o.n}!`); }
    const d = Math.max(1, P.atk + rnd(0, 2) - o.f);
    lunge(P, o.x, o.y);
    if (!hurt(o, d)) say(`Golpeas ${ART.a(o)} ${o.n} (−${d}).`);
  };
  const teleport = o => { for (let k = 0; k < 200; k++) { const x = rnd(1, W - 2), y = rnd(1, H - 2); if (walk(x, y) && !busy(x, y)) { o.x = x; o.y = y; return; } } };
  const hit = o => {
    if (o.hidden) { o.hidden = false; say(`¡Ese parche era un ${o.n}!`); }
    const d = Math.max(1, o.a + rnd(0, 2) - P.def);
    P.hp -= d;
    lunge(o, P.x, P.y); P.fl = now(); fx.shake = now(); float(P.x, P.y, `−${d}`, '#f87171');
    say(`${ART.el(o)} ${o.n} te golpea (−${d}).`);
    if (o.sp === 'steal' && P.gold > 0) { const s = Math.min(P.gold, rnd(5, 15) * depth); P.gold -= s; say(`¡El keylogger te roba ${s} ₿ y huye!`); teleport(o); o.awake = false; }
    if (o.sp === 'confuse' && Math.random() < .5) { P.conf = 4; say('El phisher te engaña: estás confundido.'); }
    if (o.sp === 'boss' && Math.random() < .35) { P.energy = Math.max(0, P.energy - 40); say('El ransomware cifra tus reservas: −40 de energía.'); }
    if (P.hp <= 0) die(`${ART.el(o).toLowerCase()} ${o.n}`);
  };
  const monTurn = o => {
    if (state !== 'play' || !mons.includes(o)) return;
    const dx = P.x - o.x, dy = P.y - o.y, dist = Math.max(Math.abs(dx), Math.abs(dy));
    if (!o.awake) { if (vis[o.y][o.x] && dist <= 6 && Math.random() < .7) o.awake = true; else return; }
    if (o.hidden && dist > 1) return; // el troyano espera quieto, disfrazado de parche
    if (dist <= 1) return hit(o);
    const sx = Math.sign(dx), sy = Math.sign(dy);
    for (const [mx, my] of [[sx, sy], [sx, 0], [0, sy]]) {
      if ((mx || my) && walk(o.x + mx, o.y + my) && !monAt(o.x + mx, o.y + my)) { o.x += mx; o.y += my; return; }
    }
  };
  const endTurn = () => {
    turn++;
    P.energy = Math.max(0, P.energy - 1);
    if (P.energy === 80) say('Te estás quedando sin energía. Busca café (%).');
    if (P.energy === 0 && turn % 3 === 0) { P.hp--; if (P.hp <= 0) return die('agotamiento: se acabó el café'); }
    if (turn % 12 === 0 && P.hp < P.max && P.energy > 0) P.hp++; // regeneración lenta
    for (const o of [...mons]) { monTurn(o); if (o.sp === 'fast') monTurn(o); }
    if (state === 'play') { fov(); render(); }
  };
  const pickup = () => {
    if (stairs && P.x === stairs.x && P.y === stairs.y) say('Aquí hay un acceso a la capa inferior. Pulsa > para bajar.');
    const it = itemAt(P.x, P.y);
    if (!it) return;
    items.splice(items.indexOf(it), 1);
    pop(P.x, P.y, SPR_COL[it.k] || '#fff', 10);
    const tag = { ')': 'ATK +1', '[': 'DEF +1', '%': 'café', '!': '+parche', '?': '+script' }[it.k];
    if (tag) float(P.x, P.y - .4, tag, SPR_COL[it.k]);
    if (it.k === '!') { P.patches++; say('Recoges un parche de seguridad (p para aplicarlo).'); }
    else if (it.k === '?') { P.scripts++; say('Recoges un script misterioso (e para ejecutarlo).'); }
    else if (it.k === '$') { const g = rnd(4, 12) * depth; P.gold += g; say(`+${g} ₿ en criptos abandonadas.`); }
    else if (it.k === '%') { P.energy = Math.min(700, P.energy + 220); say('Un café cargado. La energía vuelve.'); }
    else if (it.k === ')') { P.atk++; say(`Equipas ${pickOne(EXPLOITS)}: ATK +1.`); }
    else if (it.k === '[') { P.def++; say(`Instalas ${pickOne(SHIELDS)}: DEF +1.`); }
    else if (it.k === '*') win();
  };
  const move = (dx, dy) => {
    let conf = false;
    if (P.conf > 0) { P.conf--; conf = true; [dx, dy] = pickOne([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]); }
    const nx = P.x + dx, ny = P.y + dy, o = monAt(nx, ny);
    if (o) attack(o);
    else if (walk(nx, ny)) { P.x = nx; P.y = ny; pickup(); }
    else if (!conf) return; // chocar con la pared no gasta turno
    else say('Das tumbos, confundido.');
    if (state === 'play') endTurn();
  };
  const usePatch = () => {
    if (!P.patches) { say('No te quedan parches.'); return render(); }
    P.patches--; const h = 8 + depth * 2; P.hp = Math.min(P.max, P.hp + h);
    float(P.x, P.y, `+${h}`, '#4ade80'); fx.rings.push({ x: P.x * TS + 8, y: P.y * TS + 8, r: 22, col: '#4ade80', t: now() });
    say(`Aplicas un parche: +${h} HP.`); endTurn();
  };
  const useScript = () => {
    if (!P.scripts) { say('No tienes scripts.'); return render(); }
    P.scripts--;
    const eff = pickOne(['map', 'tele', 'emp', 'scan']);
    if (eff === 'map') { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (walk(x, y) || isWall(x, y)) seen[y][x] = true; say('El script era un mapa de red: ves toda la capa.'); }
    else if (eff === 'tele') { pop(P.x, P.y, '#93c5fd', 18); teleport(P); P.vx = undefined; pop(P.x, P.y, '#93c5fd', 18); say('El script te reenvía a otro punto de la capa.'); }
    else if (eff === 'emp') {
      const hitList = mons.filter(o => vis[o.y][o.x]);
      fx.rings.push({ x: P.x * TS + 8, y: P.y * TS + 8, r: R * TS, col: '#22d3ee', t: now() }); fx.shake = now();
      hitList.forEach(o => hurt(o, 6 + depth));
      say(hitList.length ? `¡Pulso EMP! ${hitList.length} enemigo${hitList.length > 1 ? 's' : ''} afectado${hitList.length > 1 ? 's' : ''}.` : 'Pulso EMP... contra nadie.');
    } else { mons.forEach(o => { o.hidden = false; o.seen = true; }); say('Escaneo completo: se acabaron los disfraces y lo invisible.'); }
    endTurn();
  };
  const score = won => P.gold + depth * 100 + P.xp * 2 + (won ? 1000 : 0);
  const die = c => {
    state = 'dying'; cause = c;
    pop(P.x, P.y, '#f2b33d', 40); fx.shake = now();
    setTimeout(() => panic(), 900);
  };
  const panic = () => {
    state = 'dead'; cv.hidden = hud.hidden = true;
    const sc = score(false), b = best('hs-dungeon', sc);
    m.scr.innerHTML = `<b class="g-bad">*** KERNEL PANIC: conexión terminada ***</b>

  causa     ${esc(cause)}
  capa      ${depth}/${LAST}        nivel   ${P.lvl}
  turnos    ${turn}           bajas   ${P.kills}
  criptos   ${P.gold} ₿
  puntos    ${sc}           récord  ${b}

  Último mensaje: ${esc(log[log.length - 1] || '')}

[r] reconectar desde la capa 1 · [esc] salir`;
  };
  const win = () => {
    state = 'won'; cv.hidden = hud.hidden = true;
    const sc = score(true), b = best('hs-dungeon', sc);
    store.set('dungeon-win', '1');
    m.scr.innerHTML = `<b class="g-ok">*** ACCESO TOTAL ***</b>

Recuperas la clave maestra y descifras la red entera.
El Señor del Ransomware ya no cobra rescates a nadie.

  nivel ${P.lvl} · ${turn} turnos · ${P.kills} bajas · ${P.gold} ₿
  puntos ${sc} · récord ${b}

Tu recompensa: <b class="g-boss">${atob('RkxBR3tyZXlfZGVfbGFfcmVkX3Byb2Z1bmRhfQ==')}</b>
(guárdala y escribe «submit» con ella en la terminal)

[r] jugar otra vez · [esc] salir`;
  };
  const reset = () => {
    P = { hp: 20, max: 20, atk: 3, def: 0, lvl: 1, xp: 0, energy: 450, gold: 0, patches: 2, scripts: 0, conf: 0, kills: 0, x: 0, y: 0 };
    depth = 0; turn = 0; log = []; state = 'play'; cv.hidden = hud.hidden = false;
    size(); gen(); render();
  };
  const KEYS = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    k: [0, -1], j: [0, 1], h: [-1, 0], l: [1, 0], y: [-1, -1], u: [1, -1], b: [-1, 1], n: [1, 1],
    8: [0, -1], 2: [0, 1], 4: [-1, 0], 6: [1, 0], 7: [-1, -1], 9: [1, -1], 1: [-1, 1], 3: [1, 1],
    Home: [-1, -1], PageUp: [1, -1], End: [-1, 1], PageDown: [1, 1],
  };
  reset();
  raf = requestAnimationFrame(frame);
  addEventListener('resize', size);
  return session(T, m, e => {
    if (state !== 'play') { if ((state === 'dead' || state === 'won') && (e.key === 'r' || e.key === 'R')) reset(); return; }
    const d = KEYS[e.key];
    if (d) { e.preventDefault(); return move(...d); }
    if (e.key === '.' || e.key === '5' || e.key === ' ') { e.preventDefault(); return endTurn(); }
    if (e.key === '>') {
      if (stairs && P.x === stairs.x && P.y === stairs.y) { gen(); return render(); }
      say(depth === LAST ? 'No hay más capas: la salida es la clave maestra.' : 'Aquí no hay acceso a otra capa.'); return render();
    }
    if (e.key === 'p') return usePatch();
    if (e.key === 'e') return useScript();
    if (e.key === '?') { say(HELP); return render(); }
  }, () => { cancelAnimationFrame(raf); removeEventListener('resize', size); });
}

const GAMES = { snake, crack, phish, dungeon };
export const run = (name, T) => GAMES[name](T);
