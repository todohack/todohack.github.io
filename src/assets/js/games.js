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
// Pantallas de texto con estética de terminal: cada línea entra con un barrido de cursor y los números cuentan hacia arriba.
// Cada línea del html debe cerrar sus propias etiquetas. data-n="123" marca un número que cuenta.
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveal = (el, html, step = 55) => {
  const lines = html.split('\n');
  el.innerHTML = lines.map((l, i) => `<span class="rv" style="--d:${i * step}ms">${l || ' '}</span>`).join('\n');
  el.querySelectorAll('[data-n]').forEach(n => {
    const end = +n.dataset.n, line = n.closest('.rv'), delay = parseFloat(line.style.getPropertyValue('--d')) || 0;
    if (still || !end) { n.textContent = end; return; }
    const t0 = performance.now() + delay, dur = 700;
    const tick = t => { const k = Math.min(1, Math.max(0, (t - t0) / dur)); n.textContent = String(Math.round(end * (1 - (1 - k) ** 3))).padStart(String(end).length); if (k < 1 && n.isConnected) requestAnimationFrame(tick); };
    n.textContent = '0'.padStart(String(end).length); requestAnimationFrame(tick);
  });
};
const N = v => `<b data-n="${v}">${v}</b>`;
const cols2 = (l, r, w = 24) => { const vis = l.replace(/<[^>]+>/g, ''); return l + ' '.repeat(Math.max(2, w - [...vis].length)) + r; };
const dots = (label, w = 12) => (label + ' ').padEnd(w, '.') + ' ';
const boxed = (txt, cls) => { const w = [...txt].length + 4; return [`<span class="${cls}">+${'='.repeat(w)}+</span>`, `<span class="${cls}">|  ${txt}  |</span>`, `<span class="${cls}">+${'='.repeat(w)}+</span>`]; };
const stamp = t => `[${(t / 1000).toFixed(3).padStart(8)}]`;

// ---------- Sprites pixel art (8×8, dibujados aquí mismo, sin imágenes) ----------
const TS = 16; // casilla en pantalla: sprite de 8×8 a escala 2
const SPR_DEF = {
  // Héroe: capucha con luz lateral, cara en sombra, ojos ámbar y portátil encendido
  me: [['................', '.....aaaaaa.....', '....ahhhhhba....', '...ahhbbbbbba...', '..ahbccccccbba..', '..ahbcddddcbba..', '..ahbdeddedbba..', '..ahbddddddbba..', '..ahbcddddcbba..', '..abbbccccbbba..', '.abbbbbbbbbbbba.', 'abbbllllllllbbba', 'abbblsssssslbbba', 'abbblsssssslbbba', 'abbbkkkkkkkkbbba', '.aaaaaaaaaaaaaa.'],
    { a: '#0b111d', h: '#5f80c2', b: '#34508a', c: '#1c2a45', d: '#070b14', e: '#f2b33d', l: '#9aa4b5', s: '#4ade80', k: '#5b6577' }],
  // bot de spam: robot con un sobre en el pecho
  b: [['.......cc.......', '.......aa.......', '...aaaaaaaaaa...', '..abbbbbbbbbba..', '..abddbbbbddba..', '..abddbbbbddba..', '..abbbbbbbbbba..', '..abbeeeeeebba..', '...aaaaaaaaaa...', '..affffffffffa..', '..affgffffgffa..', '..afffggggfffa..', '..affffffffffa..', '...aaaaaaaaaa...', '...aa......aa...', '..aaa......aaa..'],
    { a: '#2b3445', b: '#9aa4b5', c: '#f87171', d: '#22d3ee', e: '#5b6577', f: '#f1f5f9', g: '#94a3b8' }],
  // scraper: araña que teje su red
  s: [['................', '.a....bbbb....a.', '..a..bbbbbb..a..', '...abbbbbbbba...', 'aaaabbcbbcbbaaaa', '....bbbbbbbb....', '...abbbddbbba...', 'aaaabbddddbbaaaa', '....bbbddbbb....', '...abbbbbbbba...', '..a..bbbbbb..a..', '.a....bbbb....a.', 'a......ee......a', '.......ee.......', '......eeee......', '................'],
    { a: '#6b7385', b: '#8b5cf6', c: '#fca5a5', d: '#c4b5fd', e: '#e5e7eb' }],
  // gusano: cuerpo segmentado que se replica
  g: [['................', '................', '................', '................', '..........aaaa..', '.........abbbba.', '..aaa...abbcbbba', '.abbba.abbbbbba.', 'abdbbbabdbbbba..', 'abbbbbbbbbbba...', '.abdbbbbdbba....', '..aaaaaaaaa.....', '................', '................', '................', '................'],
    { a: '#14532d', b: '#4ade80', c: '#0b111d', d: '#166534' }],
  // keylogger: teclado con un ojo espía y patas
  k: [['................', '................', '......cccc......', '.....cddddc.....', '.....cdeedc.....', '......cccc......', '.......cc.......', 'aaaaaaaaaaaaaaaa', 'abfbfbfbfbfbfbba', 'aaaaaaaaaaaaaaaa', 'abfbfbfbfbfbfbba', 'aaaaaaaaaaaaaaaa', 'abbbffffffffbbba', 'aaaaaaaaaaaaaaaa', '.g..g......g..g.', 'g..g........g..g'],
    { a: '#1f2937', b: '#374151', f: '#e5e7eb', c: '#f2b33d', d: '#ffffff', e: '#ef4444', g: '#f2b33d' }],
  // troyano: caballo de madera sobre ruedas
  t: [['................', '......aa........', '.....aaaa.......', '....abbbba......', '...abbcbba......', '..abbbbbba......', '.abbbbbbbaa.....', '.aaa.abbbbbbbaa.', '.....abbbbbbbbba', '.....abbbbbbbbba', '.....abddbbbddba', '.....aabaaaabaa.', '......ab....ab..', '.....eeeeeeeeee.', '......fe....fe..', '......ff....ff..'],
    { a: '#7c2d12', b: '#c2410c', c: '#0b111d', d: '#9a3412', e: '#78350f', f: '#1f2937' }],
  // phisher: pez que muerde el anzuelo... o lo lanza
  f: [['...........c....', '...........c....', '...........c....', '...........c....', '........c..c....', '.........cc.....', '...aaaaaa.......', '..abbbbbba....a.', '.abbdbbbbba..aa.', 'abbbbbbbbbbaaba.', 'aebbbbbbbbbbbba.', '.abbbbbbbbba.aa.', '..abbbbbbba...a.', '...aaaaaaa......', '................', '................'],
    { a: '#1e3a8a', b: '#60a5fa', c: '#e5e7eb', d: '#0b111d', e: '#f87171' }],
  // exploit kit: caja de herramientas con calavera
  x: [['................', '.....aaaaaa.....', '.....a....a.....', '..aaaaaaaaaaaa..', '..abbbbbbbbbba..', '..abbbccccbbba..', '..abbccccccbba..', '..abbcdccdcbba..', '..abbccccccbba..', '..abbbcdcdbbba..', '..aaaaaaaaaaaa..', '..abbbbeebbbba..', '..abbbbbbbbbba..', '..aaaaaaaaaaaa..', '................', '................'],
    { a: '#450a0a', b: '#ef4444', c: '#fff7ed', d: '#0b111d', e: '#f2b33d' }],
  // rootkit: fantasma con la marca # de root
  r: [['................', '.....aaaaaa.....', '...aabbbbbbaa...', '..abbbbbbbbbba..', '..abbccbbccbba..', '..abbccbbccbba..', '.abbbbbbbbbbbba.', '.abbbbdbbdbbbba.', '.abbddddddddbba.', '.abbbbdbbdbbbba.', '.abbddddddddbba.', '.abbbbdbbdbbbba.', '.abbbbbbbbbbbba.', '.abbabbbbbbabba.', '.aa.abba.abba.a.', '....aa....aa....'],
    { a: '#4c1d95', b: '#a78bfa', c: '#1e1b4b', d: '#ede9fe' }],
  // botnet DDoS: enjambre de nodos
  D: [['aa.....aa....aa.', 'ab.....ab....ab.', '....aa.....aa...', '....ab.....ab...', '.aa.....aa....aa', '.ab.....ab....ab', '......aa....aa..', '......ab....ab..', 'aa.......aa.....', 'ab.......ab.....', '....aa.......aa.', '....ab.......ab.', '.......aa.......', '.......ab.......', '..aa........aa..', '..ab........ab..'],
    { a: '#fb923c', b: '#7c2d12' }],
  // zero-day: ojo rojo agrietado
  z: [['................', '.....aaaaaa.....', '...aabbbbbbaa...', '..abbbbbbbbfba..', '.abbbccccccfbba.', '.abbcceeeefcbba.', 'abbcceeddeeccbba', 'abbceeddddeecbba', 'abbceeddddeecbba', 'abbcceeddeeccbba', '.abbcceeeeccbba.', '.abbbccccccbbba.', '..abbbbbbbbbba..', '...aabbbbbbaa...', '.....aaaaaa.....', '................'],
    { a: '#450a0a', b: '#991b1b', c: '#ef4444', e: '#fecaca', d: '#0b111d', f: '#ffffff' }],
  // grupo APT: operador con pasamontañas y visor rojo
  A: [['................', '.....aaaaaa.....', '....abbbbbba....', '...abbbbbbbba...', '...abccccccba...', '...abcddddcba...', '...abccccccba...', '...abbbbbbbba...', '....abbbbbba....', '..aaaeeeeeeaaa..', '.aeeeeffeeeeeea.', '.aeeeeeffeeeeea.', '.aeeeeeeeeeeeea.', '.aeeeeeeeeeeeea.', '.aaaaaaaaaaaaaa.', '................'],
    { a: '#030712', b: '#1f2937', c: '#7f1d1d', d: '#ef4444', e: '#111827', f: '#f87171' }],
  // Señor del Ransomware: calavera con candado
  R: [['....aaaaaaaa....', '..aabbbbbbbbaa..', '.abbbbbbbbbbbba.', 'abbbbbbbbbbbbbba', 'abbccbbbbbbccbba', 'abccccbbbbccccba', 'abbccbbbbbbccbba', 'abbbbbbccbbbbbba', '.abbbbbccbbbbba.', '..abcbcbcbcbcba.', '...aaaaaaaaaa...', '.....eeeeee.....', '....e......e....', '...ffffffffff...', '...ffffggffff...', '...ffffffffff...'],
    { a: '#4a044e', b: '#f0abfc', c: '#0b111d', e: '#e5e7eb', f: '#f2b33d', g: '#0b111d' }],
  '!': [['........', '.aaaaaa.', '.aabbaa.', '.abbbba.', '.abbbba.', '.aabbaa.', '.aaaaaa.', '........'], { a: '#e5e7eb', b: '#22c55e' }],
  $: [['........', '..aaaa..', '.aabbaa.', '.abaaba.', '.abaaba.', '.aabbaa.', '..aaaa..', '........'], { a: '#f2b33d', b: '#fde68a' }],
  '%': [['..b..b..', '...b..b.', '.aaaaa..', '.accca.a', '.accca.a', '.aaaaaa.', '..aaaa..', '........'], { a: '#e5e7eb', b: '#9ca3af', c: '#7c2d12' }],
  '?': [['........', '.aaaaaa.', '.abbbaa.', '.aaaaaa.', '.abbbba.', '.aaaaaa.', '.abbaaa.', '.aaaaaa.'], { a: '#fef3c7', b: '#2563eb' }],
  ')': [['.......a', '......aa', '.....aa.', '....aa..', '.c.aa...', '..cc....', '.c..c...', '........'], { a: '#93c5fd', c: '#f2b33d' }],
  '[': [['.aaaaaa.', 'aabbbbaa', 'abbccbba', 'abbccbba', 'abbbbbba', '.abbbba.', '..abba..', '...aa...'], { a: '#64748b', b: '#3b82f6', c: '#e5e7eb' }],
  '*': [['........', '.aaa....', 'a...a...', 'a...aaaa', '.aaa.a.a', '.....a..', '........', '........'], { a: '#f2b33d' }],
  '>': [['..aaaa..', '.abbbba.', 'abccccba', 'abcddcba', 'abcddcba', 'abccccba', '.abbbba.', '..aaaa..'], { a: '#166534', b: '#22c55e', c: '#4ade80', d: '#0b111d' }],
  // Iconos de armas
  w_key: [['........', 'aaaaaaaa', 'abababba', 'aaaaaaaa', 'abbbbbba', 'aaaaaaaa', '........', '........'], { a: '#374151', b: '#e5e7eb' }],
  w_duck: [['...aa...', '..abba..', '..abcbdd', '...abba.', '.aabbbba', 'abbbbbba', '.abbbba.', '..aaaa..'], { a: '#a16207', b: '#facc15', c: '#0b111d', d: '#f97316' }],
  w_floppy: [['aaaaaaa.', 'abcccbba', 'abcccbba', 'abbbbbba', 'adddddda', 'addeedda', 'adddedda', 'aaaaaaaa'], { a: '#1e293b', b: '#3b82f6', c: '#cbd5e1', d: '#f1f5f9', e: '#ef4444' }],
  w_xss: [['......a.', '.....a..', '....bb..', '...bcb..', '..bcb...', '.bcb....', 'dbb.....', 'd.......'], { a: '#e5e7eb', b: '#94a3b8', c: '#a3e635', d: '#64748b' }],
  w_book: [['.aaaaaa.', 'abbbbbba', 'abccccba', 'abbbbbba', 'abccbbba', 'abbbbbba', 'adddddda', '.aaaaaa.'], { a: '#450a0a', b: '#b91c1c', c: '#fde68a', d: '#f1f5f9' }],
  w_cookie: [['..aaaa..', '.abbbba.', 'abcbbbba', 'abbbbcba', 'abbcbbba', 'abbbbbca', '.abcbba.', '..aaaa..'], { a: '#78350f', b: '#d6a77a', c: '#3f1d0b' }],
  w_bomb: [['.....cd.', '....c...', '..aaaa..', '.abbbba.', 'abbbbbba', 'abebbbba', '.abbbba.', '..aaaa..'], { a: '#0b111d', b: '#374151', c: '#9ca3af', d: '#f97316', e: '#e5e7eb' }],
  w_kiwi: [['........', '...aaa..', '..abdba.', '.abbbbcc', 'abbbbba.', 'abbbbba.', '.a.a....', '.a.a....'], { a: '#3f2d14', b: '#8b6b3d', c: '#e5e7eb', d: '#0b111d' }],
  w_shark: [['....a...', '...aa...', '..aba...', '.abba...', 'abbba...', 'cccccccc', '.c.c.c.c', '........'], { a: '#1e3a8a', b: '#60a5fa', c: '#22d3ee' }],
  w_lateral: [['........', '..a.....', '.aaaaaaa', '..a.....', '.....b..', 'bbbbbbb.', '.....b..', '........'], { a: '#c084fc', b: '#22d3ee' }],
  w_msf: [['aaaaaaaa', 'abbbbbba', 'abcbbcba', 'abccccba', 'abcbbcba', '.abbbba.', '..abba..', '...aa...'], { a: '#1e3a8a', b: '#2563eb', c: '#e5e7eb' }],
  w_chain: [['........', '.aaa....', 'a...a...', 'a..aaaa.', '.aaa...a', '...a...a', '....aaa.', '........'], { a: '#cbd5e1' }],
  w_zero: [['..aaaa..', '.abbbba.', 'abbccbba', 'abcbbcba', 'abcbbcba', 'abbccbba', '.abbbba.', '..aaaa..'], { a: '#7f1d1d', b: '#ef4444', c: '#fecaca' }],
  // Iconos de armaduras
  a_hood: [['..aaaa..', '.abbbba.', 'abbccbba', 'abccccba', 'abbbbbba', 'abbbbbba', 'abbaabba', 'aaa..aaa'], { a: '#1e293b', b: '#3a5488', c: '#0b111d' }],
  a_av: [['aaaaaaaa', 'abbbbbba', 'abbbbcba', 'abbbcbba', 'acbcbbba', '.abcbba.', '..abba..', '...aa...'], { a: '#14532d', b: '#22c55e', c: '#f1f5f9' }],
  a_vpn: [['..aaaa..', '.a....a.', '.a....a.', 'bbbbbbbb', 'bccccccb', 'bcccdccb', 'bcccdccb', 'bbbbbbbb'], { a: '#9ca3af', b: '#1e3a8a', c: '#3b82f6', d: '#0b111d' }],
  a_fw: [['...c....', '..cdc...', 'aaaaaaaa', 'abbabbba', 'aaaaaaaa', 'abbbabba', 'aaaaaaaa', 'abbabbba'], { a: '#7c2d12', b: '#c2410c', c: '#f97316', d: '#facc15' }],
  a_mfa: [['.aaaaaa.', '.abbbba.', '.acbcba.', '.abcbca.', '.abbbba.', '.abbbba.', '.aadaaa.', '.aaaaaa.'], { a: '#1f2937', b: '#0b111d', c: '#4ade80', d: '#9ca3af' }],
  a_box: [['aaaaaaaa', 'acbbbbca', 'abcbbcba', 'abbccbba', 'abbccbba', 'abcbbcba', 'acbbbbca', 'aaaaaaaa'], { a: '#78350f', b: '#d6a77a', c: '#92400e' }],
  a_edr: [['aaaaaaaa', 'abbbbbba', 'abbccbba', 'abcddcba', 'abbccbba', '.abbbba.', '..abba..', '...aa...'], { a: '#312e81', b: '#6366f1', c: '#f1f5f9', d: '#0b111d' }],
  a_honey: [['.aaaaaa.', '..bbbb..', '.bccccb.', 'bccddccb', 'bccccccb', 'bccccccb', '.bccccb.', '..bbbb..'], { a: '#78350f', b: '#a16207', c: '#f59e0b', d: '#fde68a' }],
  a_backup: [['........', 'aaaaaaaa', 'abbbbbba', 'aaaaaaaa', 'acccccca', 'aaaaaaaa', 'adddddda', 'aaaaaaaa'], { a: '#0b111d', b: '#3b82f6', c: '#22c55e', d: '#f2b33d' }],
  a_waf: [['aaaaaaaa', 'abbbbbba', 'acbbbbca', 'acbccbca', 'abcbbcba', '.abbbba.', '..abba..', '...aa...'], { a: '#134e4a', b: '#14b8a6', c: '#f1f5f9' }],
  a_zt: [['.aaaaaa.', 'abbbbbba', 'abcbbcba', 'abbccbba', 'abbccbba', 'abcbbcba', 'abbbbbba', '.aaaaaa.'], { a: '#4c1d95', b: '#7c3aed', c: '#f1f5f9' }],
  pkt: [['........', '.aaaaaa.', '.abbbba.', '.ab..ba.', '.abbbba.', '.aaaaaa.', '........', '........'], { a: '#93b4f2', b: '#3b5a96' }],
};
// Color principal de cada sprite: tiñe partículas y números flotantes
const SPR_COL = { b: '#9aa4b5', s: '#8b5cf6', g: '#4ade80', k: '#e5e7eb', t: '#c2410c', f: '#60a5fa', x: '#ef4444', r: '#a78bfa', D: '#fb923c', z: '#ef4444', A: '#e5e7eb', R: '#f0abfc', '!': '#22c55e', $: '#f2b33d', '%': '#d6a77a', '?': '#93c5fd', ')': '#93c5fd', '[': '#3b82f6', '*': '#f2b33d' };
let SPR, WHITE, TILE;
const paint = (rows, pal) => {
  const c = document.createElement('canvas'); c.width = rows[0].length; c.height = rows.length;
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
  SPR_DEF.D2 = [SPR_DEF.D[0].map((r, i, a) => { const q = a[(i + 2) % a.length]; return q.slice(-1) + q.slice(0, -1); }), { a: '#fdba74', b: '#9a3412' }];
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
const fxLayer = () => ({ floats: [], parts: [], rings: [], beams: [], shake: 0, fade: 0 });
const burst = (fx, x, y, col, n = 14, now = performance.now()) => {
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, v = 30 + Math.random() * 80; fx.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, col, t: now, life: 350 + Math.random() * 350 }); }
};
const drawFx = (ctx, fx, t) => {
  fx.beams = fx.beams.filter(b => t - b.t < 260);
  for (const b of fx.beams) { // rayos de hechizo: línea brillante que se desvanece
    ctx.globalAlpha = 1 - (t - b.t) / 260; ctx.strokeStyle = b.col; ctx.lineWidth = 3; ctx.shadowColor = b.col; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke(); ctx.shadowBlur = 0;
  }
  fx.parts = fx.parts.filter(p => t - p.t < p.life);
  for (const p of fx.parts) {
    const a = (t - p.t) / 1000;
    ctx.globalAlpha = 1 - (t - p.t) / p.life;
    ctx.fillStyle = p.col;
    ctx.fillRect(Math.round(p.x + p.vx * a), Math.round(p.y + p.vy * a + 160 * a * a), 2, 2);
  }
  fx.rings = fx.rings.filter(r => t - r.t < 520);
  for (const r of fx.rings) {
    const k = Math.max(0, (t - r.t) / 520); // un efecto creado tras la marca del fotograma daría un radio negativo
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
// esc (opcional): si devuelve true, Esc lo gestiona el juego (cerrar una tienda) y no se sale
function session(T, m, onKey, cleanup, esc) {
  return new Promise(res => {
    let over = false;
    const send = e => { if (!over) onKey(e, end); };
    const kd = e => {
      if (e.key === 'Escape') { e.preventDefault(); if (esc && esc()) return; return end(); }
      if (m.text && e.key.length === 1) return; // lo recoge el evento input (teclados móviles)
      send(e);
    };
    const inp = () => { const v = m.keyEl.value; m.keyEl.value = ''; for (const ch of v) send({ key: ch, preventDefault() {} }); };
    const cancel = e => { e.preventDefault(); if (esc && esc()) return; end(); };
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
      ? `<b class="g-bad">GUSANO DETENIDO</b> · ${score} paquetes · récord ${best('hs-snake', score)}\n${touch ? 'toca «otra vez»' : 'Espacio u Enter'} para jugar otra vez · Esc salir`
      : `paquetes ${score} · récord ${+store.get('hs-snake') || 0} · ${touch ? 'usa las flechas' : 'flechas o WASD para girar'} · Esc sale`;
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
    else if (dead && ['r', 'R', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); reset(); }
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
  const m = mount(T, { pad: '<div class="pad-acts"><button type="button" data-k="p">← phishing</button><button type="button" data-k="l">legítimo →</button><button type="button" data-k="Escape">salir</button></div>' });
  let deck, i, ok, answered;
  const draw = extra => {
    const c = deck[i];
    m.scr.innerHTML = `¿PHISHING O LEGÍTIMO? · caso ${i + 1}/${deck.length} · aciertos ${ok}\n\n${esc(c.t)}\n\n${extra || '← o A: phishing · → o D: legítimo · esc sale'}`;
    T.out.scrollTop = T.out.scrollHeight;
  };
  const finish = () => {
    const rank = ok === deck.length ? 'Ojo de halcón. Nadie te pesca.' : ok >= 6 ? 'Muy bien. Un par más y eres el filtro antispam de tu familia.' : ok >= 4 ? 'Vas bien, pero los estafadores también practican.' : 'Cuidado: hoy te habrían pescado. Lee el blog y vuelve a intentarlo.';
    reveal(m.scr, [...boxed(`RESULTADO ${ok}/${deck.length}`, ok >= 6 ? 'g-ok' : 'g-bad'), `${dots('récord')}${N(best('hs-phish', ok))}`, '', esc(rank), '', '[r] otra ronda · [esc] salir <span class="rv-cur"></span>'].join('\n'), 90);
    answered = 'end';
  };
  const reset = () => { deck = [...CASES].sort(() => Math.random() - .5).slice(0, 8); i = 0; ok = 0; answered = false; draw(); };
  reset();
  return session(T, m, e => {
    if (answered === 'end') { if (['r', 'R', 'Enter', ' '].includes(e.key)) reset(); return; }
    if (answered) { answered = false; if (++i >= deck.length) return finish(); return draw(); }
    const k = { ArrowLeft: 'p', a: 'p', A: 'p', p: 'p', ArrowRight: 'l', d: 'l', D: 'l', l: 'l' }[e.key];
    if (!k) return;
    e.preventDefault();
    const right = (k === 'p') === !!deck[i].p;
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
  { g: 'R', n: 'Señor del Ransomware', d: 10, hp: 120, a: 14, f: 5, xp: 120, sp: 'boss' },
];
// Armas: daño extra + una propiedad. t = capa mínima en la que puede aparecer.
const WEAPONS = [
  { s: 'w_key', n: 'teclado mecánico', d: 0, t: 0, p: '', x: 'Tu arma de siempre. Clac, clac.' },
  { s: 'w_duck', n: 'Rubber Ducky', d: 1, t: 1, p: 'fast', x: 'Teclea más rápido que tú: 30% de golpe doble.' },
  { s: 'w_floppy', n: 'payload ofuscado', d: 2, t: 2, p: 'pierce', x: 'El antivirus no lo ve venir: ignora la defensa.' },
  { s: 'w_xss', n: 'XSS persistente', d: 2, t: 2, p: 'poison', x: 'Deja código malicioso: daño durante 3 turnos.' },
  { s: 'w_book', n: 'diccionario rockyou', d: 3, t: 3, p: 'brute', x: 'Fuerza bruta: falla 3 de cada 10, pero a veces encuentra la clave y pega doble.' },
  { s: 'w_cookie', n: 'secuestro de sesión', d: 3, t: 3, p: 'drain', x: 'Te quedas con su sesión: te curas un tercio del daño.' },
  { s: 'w_bomb', n: 'desbordamiento de búfer', d: 3, t: 4, p: 'stun', x: 'Segfault: 25% de dejarlo aturdido un turno.' },
  { s: 'w_kiwi', n: 'Mimikatz', d: 3, t: 4, p: 'loot', x: 'Vuelca credenciales: cada baja te da criptos.' },
  { s: 'w_shark', n: 'Wireshark afilado', d: 3, t: 5, p: 'reveal', x: 'Ves todo el tráfico: nada invisible ni disfrazado se te escapa.' },
  { s: 'w_lateral', n: 'movimiento lateral', d: 4, t: 5, p: 'chain', x: 'Pivota: el golpe salta a otro enemigo cercano.' },
  { s: 'w_msf', n: 'Metasploit', d: 4, t: 6, p: 'cleave', x: 'Módulo multiobjetivo: golpea a todos los que te rodean.' },
  { s: 'w_chain', n: 'cadena ROP', d: 5, t: 7, p: 'crit', x: 'Gadgets bien encadenados: 25% de golpe triple.' },
  { s: 'w_zero', n: 'zero-day propio', d: 6, t: 8, p: 'zero', x: 'Nadie tiene parche: ignora la defensa y 25% de golpe triple.' },
];
// Armaduras: defensa + una propiedad.
const ARMORS = [
  { s: 'a_hood', n: 'sudadera con capucha', d: 0, t: 0, p: '', x: 'Mucho estilo, cero protección.' },
  { s: 'a_av', n: 'antivirus gratuito', d: 1, t: 1, p: '', x: 'Algo es algo.' },
  { s: 'a_vpn', n: 'VPN', d: 1, t: 1, p: 'dodge', x: 'No saben dónde estás: 15% de esquivar.' },
  { s: 'a_fw', n: 'firewall de host', d: 2, t: 2, p: '', x: 'Filtra lo básico.' },
  { s: 'a_mfa', n: 'MFA reforzado', d: 2, t: 3, p: 'mfa', x: 'Inmune a los robos del keylogger y a los engaños del phisher.' },
  { s: 'a_box', n: 'sandbox', d: 2, t: 3, p: 'thorns', x: 'Quien te ataca se ejecuta aislado: le devuelves 2 de daño.' },
  { s: 'a_edr', n: 'EDR', d: 3, t: 4, p: 'regen', x: 'Detecta y repara: recuperas vida el doble de rápido.' },
  { s: 'a_honey', n: 'honeypot', d: 2, t: 5, p: 'decoy', x: 'Señuelo: 25% de que el ataque vaya contra la trampa.' },
  { s: 'a_backup', n: 'backup 3-2-1', d: 2, t: 5, p: 'revive', x: 'Si caes, restauras desde la copia una vez, con media vida.' },
  { s: 'a_waf', n: 'WAF', d: 4, t: 6, p: '', x: 'Filtra casi todo lo que llega.' },
  { s: 'a_zt', n: 'arquitectura Zero Trust', d: 5, t: 8, p: 'dodge', x: 'No confía en nadie: mucha defensa y 15% de esquivar.' },
];
const PROP = { fast: 'golpe doble', pierce: 'perfora', poison: 'veneno', brute: 'fuerza bruta', drain: 'roba vida', stun: 'aturde', loot: 'saqueo', reveal: 'revela', chain: 'en cadena', cleave: 'barrido', crit: 'crítico', zero: 'perfora + crítico', dodge: 'esquiva', mfa: 'anti robo', thorns: 'espinas', regen: 'regenera', decoy: 'señuelo', revive: 'resucita' };
// Hechizos: se aprenden con los scripts (?) y gastan CPU, que se regenera sola.
const SPELLS = {
  scan: { n: 'Escaneo de puertos', c: 2, x: 'Revela la capa entera y todo lo que se esconde.' },
  sqli: { n: 'Inyección SQL', c: 3, x: 'Rayo contra el enemigo visible más cercano.' },
  emp: { n: 'Pulso EMP', c: 5, x: 'Daña a todos los enemigos a la vista.' },
  hotfix: { n: 'Parche en caliente', c: 4, x: 'Te cura sin gastar parches.' },
  crypt: { n: 'Cifrado AES', c: 4, x: 'Escudo que absorbe daño.' },
  proxy: { n: 'Proxy', c: 2, x: 'Te teletransporta a otro punto de la capa.' },
  quar: { n: 'Cuarentena', c: 4, x: 'Congela 5 turnos al enemigo más cercano.' },
  flood: { n: 'SYN flood', c: 4, x: 'Aturde 2 turnos a todo lo que te rodea.' },
  social: { n: 'Ingeniería social', c: 6, x: 'Convence al enemigo más cercano de luchar a tu lado.' },
  priv: { n: 'Escalada de privilegios', c: 5, x: 'Daño doble durante 6 turnos.' },
  exfil: { n: 'Exfiltración', c: 2, x: 'Atrae hacia ti todos los objetos a la vista.' },
  kill9: { n: 'kill -9', c: 7, x: 'Fulmina a un enemigo a la vista (al jefe le quita 25).' },
};
const ART = { a: o => (o.ar === 'la' ? 'a la' : 'al'), el: o => (o.ar === 'la' ? 'La' : 'El') };
const gearTxt = g => `${g.n} (+${g.d}${g.p ? ', ' + PROP[g.p] : ''})`;
const gearScore = g => g.d + (g.p ? 2 : 0);

function dungeon(T) {
  const W = 46, H = 17, R = 7, LAST = 10;
  sprites();
  const m = mount(T, { pad: touch ? dpad(true, [['Enter', 'acción'], ['f', 'hechizo'], ['q', 'cambiar'], ['r', 'parche'], ['Escape', 'salir']]) : '' });
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
  const ring = (x, y, r, col) => fx.rings.push({ x: x * TS + 8, y: y * TS + 8, r, col, t: now() });
  const beam = (a, b, col) => fx.beams.push({ x1: a.x * TS + 8, y1: a.y * TS + 8, x2: b.x * TS + 8, y2: b.y * TS + 8, col, t: now() });
  const lunge = (e, tx, ty) => { e.lg = { dx: Math.sign(tx - e.x), dy: Math.sign(ty - e.y), t: now() }; };
  const cheb = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  let P, depth, map, seen, vis, mons, items, stairs, turn, log, state, cause, killer = null, shownLog = 0, said = 0;
  const say = t => { log.push(t); said++; if (log.length > 50) log.shift(); };
  const walk = (x, y) => x >= 0 && y >= 0 && x < W && y < H && map[y][x] > 0;
  const monAt = (x, y) => mons.find(o => o.x === x && o.y === y);
  const itemAt = (x, y) => items.find(o => o.x === x && o.y === y);
  const busy = (x, y) => monAt(x, y) || itemAt(x, y) || (x === P.x && y === P.y) || (stairs && x === stairs.x && y === stairs.y);
  const need = l => 10 * l + 5 * l * l;
  const cpuMax = () => 7 + P.lvl;
  const atkNow = () => (P.atk + P.w.d) * (P.priv > 0 ? 2 : 1);
  const defNow = () => P.def + P.a.d;

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
  const spawn = (t, pos) => { if (!pos) return; const k = 1 + .16 * Math.max(0, depth - t.d); mons.push({ ...t, ...pos, hp: Math.round(t.hp * k), a: Math.round(t.a * (1 + .09 * Math.max(0, depth - t.d))), xp: Math.round(t.xp * (t.sp === 'boss' ? 1 : .6)), awake: false, hidden: t.sp === 'mimic' }); };
  // El equipo profundo es mejor: casi siempre sale de los 4 niveles más altos disponibles
  const rollGear = list => { const pool = list.filter(g => g.t >= 1 && g.t <= depth); return { ...(Math.random() < .7 ? pickOne(pool.slice(-4)) : pickOne(pool)) }; };
  const rollItem = () => {
    const r = Math.random();
    const k = r < .26 ? '!' : r < .46 ? '$' : r < .58 ? '%' : r < .74 ? '?' : r < .88 ? ')' : '[';
    return k === ')' ? { k, w: rollGear(WEAPONS) } : k === '[' ? { k, a: rollGear(ARMORS) } : { k };
  };

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
    depth++; fx.fade = now(); fx.parts = []; fx.floats = []; fx.rings = []; fx.beams = [];
    const first = rooms[0], last = rooms[rooms.length - 1];
    mons = []; items = []; stairs = null;
    P.x = first.cx; P.y = first.cy; P.vx = undefined; cam = -999;
    if (depth < LAST) stairs = { x: last.cx, y: last.cy };
    const pool = MON.filter(t => t.d <= depth && t.sp !== 'boss');
    for (let i = 0; i < 3 + depth + (depth >> 1); i++) spawn(Math.random() < .7 ? pickOne(pool.slice(-4)) : pickOne(pool), freeIn(rooms[rnd(1, rooms.length - 1)]));
    if (depth === LAST) spawn(MON[MON.length - 1], freeIn(last));
    for (let i = rnd(5, 8); i > 0; i--) { const pos = freeIn(pickOne(rooms)); if (pos) items.push({ ...pos, ...rollItem() }); }
    say(depth === 1 ? 'Entras en la red profunda. Busca la salida verde y pulsa Espacio encima para bajar. WASD mover · Espacio acción · F hechizo · Q cambiar · R parche.'
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
  const revealing = () => P.w.p === 'reveal';
  const shown = o => revealing() || !(o.sp === 'invis' && !o.seen && cheb(o, P) > 1);
  const disguised = o => o.hidden && !revealing();

  const HELP = 'WASD o flechas mover · Espacio acción (bajar, coger o esperar) · F hechizo · Q cambiar hechizo · R parche · Esc salir';
  const render = () => {
    if (state !== 'play') return;
    const msgs = log.slice(-2), newest = msgs[msgs.length - 1] || ' ', fresh = said !== shownLog;
    shownLog = said;
    m.scr.innerHTML = `${msgs.length > 1 ? `<span class="g-dim">${esc(msgs[0])}</span>` : ' '}\n<span class="${fresh ? 'rv rv-fast' : ''}">› ${esc(newest)}</span>`;
    const pct = Math.max(0, P.hp / P.max), xpPct = P.xp / need(P.lvl), sp = SPELLS[P.spells[P.sel]];
    hud.innerHTML = `<span class="hud-hp ${pct <= .25 ? 'is-low' : ''}"><b>HP</b><i><s style="width:${(pct * 100).toFixed(0)}%"></s></i>${P.hp}/${P.max}</span>`
      + `<span class="hud-cpu"><b>CPU</b><i><s style="width:${(P.cpu / cpuMax() * 100).toFixed(0)}%"></s></i>${P.cpu}/${cpuMax()}</span>`
      + `<span class="hud-xp"><b>Nv ${P.lvl}</b><i><s style="width:${(Math.min(1, xpPct) * 100).toFixed(0)}%"></s></i></span>`
      + `<span>Capa <b>${depth}</b>/${LAST}</span><span>ATK <b>${atkNow()}</b></span><span>DEF <b>${defNow()}</b></span>`
      + `<span class="${P.energy < 80 ? 'is-low' : ''}">Energía <b>${P.energy}</b></span><span>₿ <b>${P.gold}</b></span><span>Parches <b>${P.patches}</b></span>`
      + (P.shield > 0 ? `<span class="hud-buff">Escudo <b>${P.shield}</b></span>` : '') + (P.priv > 0 ? `<span class="hud-buff">Root ×2 <b>${P.priv}</b></span>` : '')
      + `<span class="hud-gear">Arma <b>${esc(gearTxt(P.w))}</b></span><span class="hud-gear">Armadura <b>${esc(gearTxt(P.a))}</b></span>`
      + `<span class="hud-spell ${P.cpu < sp.c ? 'is-low' : ''}">Hechizo <b>${esc(sp.n)}</b> (${sp.c} CPU) · ${P.spells.length}/${Object.keys(SPELLS).length} conocidos</span>`
      + `<span class="hud-turn">turno ${turn}</span>`
      + (touch ? '' : '<span class="hud-keys">WASD mover · Espacio acción · F hechizo · Q cambiar · R parche</span>');
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
      const g = it.k === '*' ? '#f2b33d' : (it.w || it.a) && (it.w || it.a).p ? '#c084fc' : ''; // el equipo con propiedad brilla
      if (g) { ctx.shadowColor = g; ctx.shadowBlur = 10 + 4 * Math.sin(t / 200); }
      ctx.drawImage(SPR[(it.w || it.a) ? (it.w || it.a).s : it.k], it.x * TS, it.y * TS + b, TS, TS);
      ctx.shadowBlur = 0;
    }
    for (const o of mons) {
      if (!vis[o.y][o.x] || !shown(o)) continue;
      const key = disguised(o) ? '!' : o.g === 'D' && Math.floor(t / 180) % 2 ? 'D2' : o.g;
      const glow = o.ally ? '#4ade80' : o.stun > 0 ? '#93c5fd' : o.sp === 'boss' ? '#f0abfc' : o.poison ? '#a3e635' : '';
      sprAt(SPR[key], WHITE[key], o, t, o.x * 1.7 + o.y, o.sp === 'invis' && !o.seen && !revealing() ? .5 : 1, glow);
      if (!disguised(o) && o.hp < o.max) { // barra de vida sobre los heridos (verde si es aliado)
        ctx.fillStyle = '#05080f'; ctx.fillRect(Math.round(o.vx * TS) + 2, Math.round(o.vy * TS) - 3, 12, 3);
        ctx.fillStyle = o.ally ? '#4ade80' : '#f87171'; ctx.fillRect(Math.round(o.vx * TS) + 2, Math.round(o.vy * TS) - 3, Math.max(1, Math.round(12 * o.hp / o.max)), 3);
      }
    }
    if (state === 'play') {
      sprAt(SPR.me, WHITE.me, P, t, 0, 1, P.conf ? '#c084fc' : P.priv > 0 ? '#f87171' : '');
      if (P.shield > 0) { // burbuja de cifrado
        ctx.globalAlpha = .35 + .15 * Math.sin(t / 150); ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(P.vx * TS + 8, P.vy * TS + 8, 11, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1;
      }
    }
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
      P.lvl++; P.max += 3; P.hp = Math.min(P.max, P.hp + 3);
      if (P.lvl % 2 === 0) P.atk++; if (P.lvl % 4 === 0) P.def++;
      P.cpu = cpuMax();
      say(`Subes a nivel ${P.lvl}. Más vida y la CPU al máximo.`);
      ring(P.x, P.y, 40, '#f2b33d'); float(P.x, P.y - .6, `NIVEL ${P.lvl}`, '#f2b33d');
    }
  };
  const kill = o => {
    mons.splice(mons.indexOf(o), 1);
    pop(o.x, o.y, SPR_COL[o.g] || '#fff', o.sp === 'boss' ? 60 : 16);
    if (o.ally) { say(`Tu aliado ${o.n} cae luchando.`); return; }
    P.xp += o.xp; P.kills++;
    if (o.sp === 'boss') { fx.shake = now(); items.push({ x: o.x, y: o.y, k: '*' }); say('El Señor del Ransomware cae y suelta la clave maestra (*). ¡Recógela!'); }
    else {
      say(`Eliminas ${ART.a(o)} ${o.n}.`);
      if (P.w.p === 'loot') { const g = rnd(3, 8) * depth; P.gold += g; float(o.x, o.y - .5, `+${g} ₿`, '#f2b33d'); }
      else if (Math.random() < .2 && !itemAt(o.x, o.y)) items.push({ x: o.x, y: o.y, k: '$' });
    }
    levelUp();
  };
  const hurt = (o, d, col = '#fde68a') => {
    o.hp -= d; o.awake = true; o.fl = now();
    float(o.x, o.y, `−${d}`, col);
    if (o.hp <= 0) return kill(o), true;
    if (o.sp === 'split' && !o.ally && mons.length < 30) {
      const pos = freeNear(o.x, o.y);
      if (pos && o.hp >= 2) { o.hp = Math.ceil(o.hp / 2); mons.push({ ...o, ...pos, poison: null }); say('¡El gusano se replica!'); }
    }
    return false;
  };
  const foesAround = (x, y) => mons.filter(o => !o.ally && Math.max(Math.abs(o.x - x), Math.abs(o.y - y)) <= 1);
  // Un golpe del jugador con todas las propiedades del arma
  const strike = (o, extra = true) => {
    if (o.hidden) { o.hidden = false; say(`¡Ese parche era un ${o.n}!`); }
    const w = P.w;
    if (w.p === 'brute' && Math.random() < .3) { float(o.x, o.y, 'fallo', '#9ca3af'); say('Fallas: la contraseña no estaba en el diccionario.'); return; }
    let d = atkNow() + rnd(0, 2) - (w.p === 'pierce' || w.p === 'zero' ? 0 : o.f);
    if ((w.p === 'crit' || w.p === 'zero') && Math.random() < .25) { d *= 3; float(o.x, o.y - .6, '¡CRÍTICO!', '#f87171'); }
    if (w.p === 'brute' && Math.random() < .25) { d *= 2; float(o.x, o.y - .6, 'clave encontrada', '#f2b33d'); }
    d = Math.max(1, d);
    if (hurt(o, d)) return;
    say(`Golpeas ${ART.a(o)} ${o.n} (−${d}).`);
    if (w.p === 'poison') { o.poison = { d: 1 + Math.ceil(depth / 3), n: 3 }; }
    if (w.p === 'stun' && Math.random() < .25) { o.stun = 1; float(o.x, o.y - .6, 'segfault', '#93c5fd'); }
    if (w.p === 'drain') { const h = Math.ceil(d / 3); P.hp = Math.min(P.max, P.hp + h); float(P.x, P.y, `+${h}`, '#4ade80'); }
    if (extra && w.p === 'fast' && Math.random() < .3 && mons.includes(o)) { say('¡Golpe doble!'); strike(o, false); }
    if (extra && w.p === 'chain') {
      const next = mons.find(f => !f.ally && f !== o && cheb(f, o) <= 2 && vis[f.y][f.x]);
      if (next) { beam(o, next, '#c084fc'); hurt(next, Math.max(1, Math.ceil(d / 2))); }
    }
  };
  const attack = o => {
    lunge(P, o.x, o.y);
    if (P.w.p === 'cleave') { const around = foesAround(P.x, P.y); around.forEach(f => strike(f)); if (around.length > 1) say(`Barrido: ${around.length} enemigos alcanzados.`); }
    else strike(o);
  };
  const teleport = o => { for (let k = 0; k < 200; k++) { const x = rnd(1, W - 2), y = rnd(1, H - 2); if (walk(x, y) && !busy(x, y)) { o.x = x; o.y = y; return; } } };
  const hit = o => {
    if (o.hidden) { o.hidden = false; say(`¡Ese parche era un ${o.n}!`); }
    lunge(o, P.x, P.y);
    const a = P.a;
    if (a.p === 'dodge' && Math.random() < .15) { float(P.x, P.y, 'esquivas', '#93c5fd'); say(`Esquivas ${ART.a(o)} ${o.n}.`); return; }
    if (a.p === 'decoy' && Math.random() < .25) { float(P.x, P.y, 'señuelo', '#c084fc'); say(`${ART.el(o)} ${o.n} ataca al honeypot.`); return; }
    let d = Math.max(1, o.a + rnd(0, 2) - Math.floor(defNow() * .8));
    if (P.shield > 0) { const ab = Math.min(P.shield, d); P.shield -= ab; d -= ab; float(P.x, P.y - .5, `cifrado −${ab}`, '#22d3ee'); }
    if (d > 0) {
      P.hp -= d; P.fl = now(); fx.shake = now(); float(P.x, P.y, `−${d}`, '#f87171');
      say(`${ART.el(o)} ${o.n} te golpea (−${d}).`);
    }
    if (a.p === 'thorns' && hurt(o, 2, '#c084fc')) return checkDeath(o);
    if (a.p !== 'mfa') {
      if (o.sp === 'steal' && P.gold > 0) { const s = Math.min(P.gold, rnd(5, 15) * depth); P.gold -= s; say(`¡El keylogger te roba ${s} ₿ y huye!`); teleport(o); o.awake = false; }
      if (o.sp === 'confuse' && Math.random() < .5) { P.conf = 4; say('El phisher te engaña: estás confundido.'); }
    }
    if (o.sp === 'boss' && Math.random() < .35) { P.energy = Math.max(0, P.energy - 40); say('El ransomware cifra tus reservas: −40 de energía.'); }
    checkDeath(o);
  };
  const checkDeath = o => {
    if (P.hp > 0) return;
    if (P.a.p === 'revive' && !P.a.used) {
      P.a.used = true; P.hp = Math.ceil(P.max / 2);
      ring(P.x, P.y, 50, '#4ade80'); float(P.x, P.y - .6, 'RESTAURADO', '#4ade80');
      return say('Caes... y restauras desde el backup 3-2-1. Una sola vez.');
    }
    killer = o;
    die(o ? `${ART.el(o).toLowerCase()} ${o.n}` : 'agotamiento: se acabó el café');
  };
  const step = (o, tx, ty) => {
    const sx = Math.sign(tx - o.x), sy = Math.sign(ty - o.y);
    for (const [mx, my] of [[sx, sy], [sx, 0], [0, sy]]) {
      const nx = o.x + mx, ny = o.y + my;
      if ((mx || my) && walk(nx, ny) && !monAt(nx, ny) && !(nx === P.x && ny === P.y)) { o.x = nx; o.y = ny; return; }
    }
  };
  const allyTurn = o => {
    let foe = null, fd = 99;
    for (const f of mons) if (!f.ally) { const d = cheb(o, f); if (d < fd) { fd = d; foe = f; } }
    if (foe && fd <= 1) {
      lunge(o, foe.x, foe.y);
      const d = Math.max(1, o.a + rnd(0, 2) - foe.f);
      if (!hurt(foe, d, '#86efac')) say(`Tu aliado ${o.n} ataca ${ART.a(foe)} ${foe.n}.`);
      return;
    }
    if (foe && fd <= 6) return step(o, foe.x, foe.y);
    if (cheb(o, P) > 2) step(o, P.x, P.y);
  };
  const monTurn = o => {
    if (state !== 'play' || !mons.includes(o)) return;
    if (o.poison) {
      const pd = o.poison.d; if (--o.poison.n <= 0) o.poison = null;
      if (hurt(o, pd, '#a3e635')) return;
    }
    if (o.stun > 0) { o.stun--; return; }
    if (o.ally) return allyTurn(o);
    const dist = cheb(o, P);
    if (!o.awake) { if (vis[o.y][o.x] && dist <= 6 && Math.random() < .7) o.awake = true; else return; }
    if (o.hidden && dist > 1) return; // el troyano espera quieto, disfrazado de parche
    if (dist <= 1) return hit(o);
    const al = mons.find(f => f.ally && cheb(f, o) <= 1);
    if (al && Math.random() < .6) { lunge(o, al.x, al.y); hurt(al, Math.max(1, o.a + rnd(0, 2) - al.f), '#f87171'); return; }
    step(o, P.x, P.y);
  };
  const endTurn = () => {
    turn++;
    P.energy = Math.max(0, P.energy - 1);
    if (P.priv > 0 && --P.priv === 0) say('Pierdes los privilegios de root.');
    if (turn % 4 === 0 && P.cpu < cpuMax()) P.cpu++;
    if (P.energy === 80) say('Te estás quedando sin energía. Busca café (%).');
    if (P.energy === 0 && turn % 3 === 0) { P.hp--; if (P.hp <= 0) { checkDeath(null); if (state !== 'play') return; } }
    if (turn % (P.a.p === 'regen' ? 6 : 12) === 0 && P.hp < P.max && P.energy > 0) P.hp++; // regeneración lenta
    for (const o of [...mons]) { monTurn(o); if (o.sp === 'fast') monTurn(o); }
    if (state === 'play') { fov(); render(); }
  };
  const equip = it => {
    const slot = it.w ? 'w' : 'a', gear = it.w || it.a, old = P[slot];
    P[slot] = gear;
    items.splice(items.indexOf(it), 1);
    if (old.d > 0 || old.p) items.push({ x: P.x, y: P.y, k: it.k, [slot]: old }); // el equipo viejo queda en el suelo
    pop(P.x, P.y, SPR_COL[it.k], 12); float(P.x, P.y - .4, gear.n, '#c084fc');
    say(`Equipas ${gearTxt(gear)}: ${gear.x}`);
  };
  const pickup = () => {
    if (stairs && P.x === stairs.x && P.y === stairs.y) say(touch ? 'Salida a la capa inferior: toca «acción» para bajar.' : 'Salida a la capa inferior: pulsa Espacio para bajar.');
    for (const it of items.filter(i => i.x === P.x && i.y === P.y)) { if (state !== 'play') break; take(it); } // varios objetos en la misma casilla
  };
  const take = it => {
    if (it.w || it.a) {
      const gear = it.w || it.a, cur = it.w ? P.w : P.a;
      if (gearScore(gear) > gearScore(cur)) return equip(it);
      return say(`Aquí hay ${gearTxt(gear)}: ${gear.x} ${touch ? 'Toca «acción»' : 'Pulsa Espacio'} para cambiarlo por tu ${it.w ? 'arma' : 'armadura'}.`);
    }
    items.splice(items.indexOf(it), 1);
    pop(P.x, P.y, SPR_COL[it.k] || '#fff', 10);
    if (it.k === '!') { P.patches++; float(P.x, P.y - .4, '+parche', '#22c55e'); say('Recoges un parche de seguridad (p para aplicarlo).'); }
    else if (it.k === '?') {
      const unknown = Object.keys(SPELLS).filter(k => !P.spells.includes(k));
      if (unknown.length) {
        const k = pickOne(unknown); P.spells.push(k); P.sel = P.spells.length - 1;
        float(P.x, P.y - .4, SPELLS[k].n, '#93c5fd'); say(`Aprendes «${SPELLS[k].n}»: ${SPELLS[k].x} (z lo lanza, c cambia de hechizo)`);
      } else { P.cpu = cpuMax(); say('Ya conoces todos los scripts: este te recarga la CPU.'); }
    }
    else if (it.k === '$') { const g = rnd(4, 12) * depth; P.gold += g; say(`+${g} ₿ en criptos abandonadas.`); }
    else if (it.k === '%') { P.energy = Math.min(700, P.energy + 220); float(P.x, P.y - .4, 'café', '#d6a77a'); say('Un café cargado. La energía vuelve.'); }
    else if (it.k === '*') win();
  };
  const move = (dx, dy) => {
    let conf = false;
    if (P.conf > 0) { P.conf--; conf = true; [dx, dy] = pickOne([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]); }
    const nx = P.x + dx, ny = P.y + dy, o = monAt(nx, ny);
    if (o && o.ally) { o.x = P.x; o.y = P.y; P.x = nx; P.y = ny; pickup(); } // intercambias el sitio con tu aliado
    else if (o) attack(o);
    else if (walk(nx, ny)) { P.x = nx; P.y = ny; pickup(); }
    else if (!conf) return; // chocar con la pared no gasta turno
    else say('Das tumbos, confundido.');
    if (state === 'play') endTurn();
  };
  const usePatch = () => {
    if (!P.patches) { say('No te quedan parches.'); return render(); }
    P.patches--; const h = 8 + depth * 2; P.hp = Math.min(P.max, P.hp + h);
    float(P.x, P.y, `+${h}`, '#4ade80'); ring(P.x, P.y, 22, '#4ade80');
    say(`Aplicas un parche: +${h} HP.`); endTurn();
  };
  const nearestFoe = () => mons.filter(o => !o.ally && vis[o.y][o.x] && shown(o)).sort((a, b) => cheb(a, P) - cheb(b, P))[0];
  const cast = () => {
    const k = P.spells[P.sel], sp = SPELLS[k];
    if (P.cpu < sp.c) { say(`CPU insuficiente para «${sp.n}» (necesitas ${sp.c}).`); return render(); }
    const needsTarget = ['sqli', 'quar', 'social', 'kill9'].includes(k);
    const tgt = needsTarget ? nearestFoe() : null;
    if (needsTarget && (!tgt || (k === 'social' && tgt.sp === 'boss'))) { say(k === 'social' && tgt ? 'El Señor del Ransomware no se deja convencer.' : 'No hay ningún objetivo a la vista.'); return render(); }
    P.cpu -= sp.c;
    if (tgt) { tgt.hidden = false; beam(P, tgt, k === 'social' ? '#4ade80' : k === 'quar' ? '#93c5fd' : '#f87171'); }
    if (k === 'scan') {
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (walk(x, y) || isWall(x, y)) seen[y][x] = true;
      mons.forEach(o => { o.hidden = false; o.seen = true; }); ring(P.x, P.y, 90, '#4ade80');
      say('Escaneo de puertos: ves toda la capa y nada se esconde.');
    } else if (k === 'sqli') { const d = 4 + Math.round(1.5 * depth); if (!hurt(tgt, d, '#f87171')) say(`' OR 1=1 -- La inyección SQL golpea ${ART.a(tgt)} ${tgt.n} (−${d}).`); }
    else if (k === 'emp') {
      const list = mons.filter(o => !o.ally && vis[o.y][o.x]);
      ring(P.x, P.y, R * TS, '#22d3ee'); fx.shake = now();
      list.forEach(o => hurt(o, 3 + depth, '#22d3ee'));
      say(list.length ? `¡Pulso EMP! ${list.length} enemigo${list.length > 1 ? 's' : ''} afectado${list.length > 1 ? 's' : ''}.` : 'Pulso EMP... contra nadie.');
    } else if (k === 'hotfix') { const h = 5 + Math.round(1.5 * depth); P.hp = Math.min(P.max, P.hp + h); float(P.x, P.y, `+${h}`, '#4ade80'); ring(P.x, P.y, 22, '#4ade80'); say(`Parche en caliente: +${h} HP sin reiniciar.`); }
    else if (k === 'crypt') { P.shield = 6 + depth; ring(P.x, P.y, 18, '#22d3ee'); say(`Cifrado AES: un escudo absorbe los próximos ${P.shield} de daño.`); }
    else if (k === 'proxy') { pop(P.x, P.y, '#93c5fd', 18); teleport(P); P.vx = undefined; pop(P.x, P.y, '#93c5fd', 18); say('Proxy: reapareces en otro punto de la capa.'); }
    else if (k === 'quar') { tgt.stun = 5; float(tgt.x, tgt.y - .5, 'cuarentena', '#93c5fd'); say(`${ART.el(tgt)} ${tgt.n} queda en cuarentena 5 turnos.`); }
    else if (k === 'flood') {
      const around = foesAround(P.x, P.y); around.forEach(o => { o.stun = 2; float(o.x, o.y - .5, 'SYN', '#93c5fd'); });
      ring(P.x, P.y, 26, '#93c5fd'); say(around.length ? `SYN flood: ${around.length} enemigo${around.length > 1 ? 's' : ''} aturdido${around.length > 1 ? 's' : ''}.` : 'SYN flood... a nadie.');
    } else if (k === 'social') { tgt.ally = true; tgt.awake = true; tgt.stun = 0; float(tgt.x, tgt.y - .5, 'aliado', '#4ade80'); say(`Ingeniería social: ${ART.el(tgt).toLowerCase()} ${tgt.n} ahora lucha a tu lado.`); }
    else if (k === 'priv') { P.priv = 6; ring(P.x, P.y, 30, '#f87171'); say('Escalada de privilegios: eres root. Daño doble durante 6 turnos.'); }
    else if (k === 'exfil') {
      const list = items.filter(it => vis[it.y][it.x] && !(it.x === P.x && it.y === P.y));
      list.forEach(it => { beam(it, P, '#f2b33d'); it.x = P.x; it.y = P.y; });
      say(list.length ? `Exfiltración: ${list.length} objeto${list.length > 1 ? 's' : ''} hacia ti.` : 'Exfiltración: no hay nada que robar a la vista.');
      pickup();
    } else if (k === 'kill9') {
      if (tgt.sp === 'boss') { if (!hurt(tgt, 25, '#f87171')) say('kill -9 al jefe: aguanta, pero pierde 25.'); }
      else { hurt(tgt, tgt.hp, '#f87171'); say(`kill -9: proceso ${tgt.n} terminado sin preguntas.`); }
    }
    if (state === 'play') endTurn();
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
    const mod = killer ? killer.n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_') + '.ko' : 'cafeina.ko';
    const t = turn * 1000 + rnd(0, 999);
    const rec = sc >= b && sc > 0;
    reveal(m.scr, [
      `<span class="g-dim">${stamp(t)} todosh: visitante@capa${depth} desconectado</span>`,
      `<span class="g-dim">${stamp(t + 64)} ${mod}: ${killer ? 'escritura en memoria protegida' : 'cafeína bajo el umbral'}</span>`,
      `<span class="g-dim">${stamp(t + 131)} Call Trace: hit+0x3f · monTurn+0x1f</span>`,
      `<span class="g-dim">${stamp(t + 202)} ---[ fin de la traza ]---</span>`,
      ...boxed('*** KERNEL PANIC - CONEXIÓN TERMINADA ***', 'g-bad rv-glitch'),
      ` ${dots('causa')}<b class="g-bad">${esc(cause)}</b>`,
      cols2(` ${dots('capa')}${N(depth)}/${LAST}`, `${dots('nivel', 9)}${N(P.lvl)}`),
      cols2(` ${dots('turnos')}${N(turn)}`, `${dots('bajas', 9)}${N(P.kills)}`),
      ` ${dots('arma')}<b class="g-item">${esc(gearTxt(P.w))}</b>`,
      ` ${dots('armadura')}<b class="g-item">${esc(gearTxt(P.a))}</b>`,
      cols2(` ${dots('hechizos')}${N(P.spells.length)}/${Object.keys(SPELLS).length}`, `${dots('criptos', 9)}${N(P.gold)} ₿`),
      cols2(` ${dots('puntos')}<b class="g-me" data-n="${sc}">${sc}</b>`, `${dots('récord', 9)}${N(b)}${rec ? '  <b class="rv-blink g-me">★ NUEVO RÉCORD</b>' : ''}`),
      '',
      ` <span class="g-dim">› ${esc(log[log.length - 1] || '')}</span>`,
      '',
      ' [Espacio] reconectar desde la capa 1   [Esc] salir <span class="rv-cur"></span>',
    ].join('\n'), 70);
  };
  const win = () => {
    state = 'won'; cv.hidden = hud.hidden = true;
    const sc = score(true), b = best('hs-dungeon', sc);
    store.set('dungeon-win', '1');
    reveal(m.scr, [
      '<span class="g-ok">[ OK ]</span> clave maestra verificada',
      '<span class="g-ok">[ OK ]</span> rescates cancelados en 10 capas',
      '<span class="g-ok">[ OK ]</span> descifrando la red profunda',
      ' [<span class="rv-bar g-ok">########################</span>] 100%',
      ...boxed('*** ACCESO TOTAL ***', 'g-ok rv-glitch'),
      ' El Señor del Ransomware ya no cobra rescates a nadie.',
      cols2(` ${dots('nivel')}${N(P.lvl)}`, `${dots('turnos', 9)}${N(turn)}`),
      cols2(` ${dots('bajas')}${N(P.kills)}`, `${dots('criptos', 9)}${N(P.gold)} ₿`),
      ` ${dots('arma')}<b class="g-item">${esc(gearTxt(P.w))}</b>`,
      ` ${dots('armadura')}<b class="g-item">${esc(gearTxt(P.a))}</b>`,
      cols2(` ${dots('puntos')}<b class="g-me" data-n="${sc}">${sc}</b>`, `${dots('récord', 9)}${N(b)}`),
      '',
      ` Tu recompensa: <b class="g-boss rv-blink">${atob('RkxBR3tyZXlfZGVfbGFfcmVkX3Byb2Z1bmRhfQ==')}</b>`,
      ' <span class="g-dim">(guárdala y escríbela con «submit» en la terminal)</span>',
      '',
      ' [Espacio] jugar otra vez   [Esc] salir <span class="rv-cur"></span>',
    ].join('\n'), 110);
  };
  const reset = () => {
    P = { hp: 20, max: 20, atk: 3, def: 0, lvl: 1, xp: 0, energy: 450, gold: 0, patches: 2, conf: 0, kills: 0, x: 0, y: 0,
      w: { ...WEAPONS[0] }, a: { ...ARMORS[0] }, spells: ['scan'], sel: 0, cpu: 8, shield: 0, priv: 0 };
    depth = 0; turn = 0; log = []; said = 0; shownLog = 0; killer = null; state = 'play'; cv.hidden = hud.hidden = false;
    size(); gen(); render();
  };
  const KEYS = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0], W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0],
    k: [0, -1], j: [0, 1], h: [-1, 0], l: [1, 0], y: [-1, -1], u: [1, -1], b: [-1, 1], n: [1, 1],
    8: [0, -1], 2: [0, 1], 4: [-1, 0], 6: [1, 0], 7: [-1, -1], 9: [1, -1], 1: [-1, 1], 3: [1, 1],
    Home: [-1, -1], PageUp: [1, -1], End: [-1, 1], PageDown: [1, 1],
  };
  reset();
  raf = requestAnimationFrame(frame);
  addEventListener('resize', size);
  return session(T, m, e => {
    if (state !== 'play') { if ((state === 'dead' || state === 'won') && ['r', 'R', 'Enter', ' '].includes(e.key)) { e.preventDefault(); reset(); } return; }
    const d = KEYS[e.key];
    if (d) { e.preventDefault(); return move(...d); }
    // Espacio o Enter: una sola tecla de acción según lo que tengas debajo (bajar, coger equipo o esperar)
    if (e.key === ' ' || e.key === 'Enter' || e.key === '>') {
      e.preventDefault();
      if (stairs && P.x === stairs.x && P.y === stairs.y) { gen(); return render(); }
      const it = itemAt(P.x, P.y);
      if (it && (it.w || it.a)) { equip(it); return endTurn(); }
      return endTurn();
    }
    if (e.key === '.' || e.key === '5') { e.preventDefault(); return endTurn(); }
    if (e.key === 'r' || e.key === 'R' || e.key === 'p') return usePatch();
    if (e.key === 'f' || e.key === 'F' || e.key === 'z' || e.key === 'e') return cast();
    if (e.key === 'q' || e.key === 'Q' || e.key === 'c' || e.key === 'Tab') {
      e.preventDefault();
      P.sel = (P.sel + 1) % P.spells.length; const sp = SPELLS[P.spells[P.sel]];
      say(`Hechizo listo: «${sp.n}» (${sp.c} CPU). ${sp.x}`); return render();
    }
    if (e.key === 'g') {
      const it = itemAt(P.x, P.y);
      if (it && (it.w || it.a)) { equip(it); return endTurn(); }
      say('Aquí no hay equipo que coger.'); return render();
    }
    if (e.key === '?') { say(HELP); return render(); }
  }, () => { cancelAnimationFrame(raf); removeEventListener('resize', size); });
}

// ===================== ciudad: Ciudad Zero-Day (premio del CTF) =====================
// Mundo abierto visto desde arriba: robas o compras autos, los mejoras en el taller, compras armas y cumples misiones contra «Los Cifrados».
const CITY_W = [
  { n: 'puños', d: 12, cd: .35, melee: true, r: 12, arc: .9 },
  { n: 'teclado mecánico', d: 16, cd: .4, melee: true, r: 13, arc: 1, price: 40, x: 'Clac, clac. Ideal para discusiones técnicas.' },
  { n: 'llave de torque', d: 22, cd: .5, melee: true, r: 14, arc: 1, price: 90, x: 'Aprieta tornillos y argumentos.' },
  { n: 'bate de reinicio', d: 26, cd: .6, melee: true, r: 16, arc: 1.3, stun: .6, price: 150, x: 'Apaga y vuelve a encender. Aturde un instante.' },
  { n: 'táser de diagnóstico', d: 10, cd: .7, melee: true, r: 13, arc: .8, stun: 2.2, price: 220, x: 'Poco daño, pero deja al objetivo aturdido 2 s.' },
  { n: 'katana de fibra óptica', d: 48, cd: .55, melee: true, r: 19, arc: 1.6, price: 650, x: 'Corta en arco amplio: varios enemigos a la vez.' },
  { n: 'pistola de ping', d: 18, cd: .3, sp: 340, ammo: 60, price: 150, ap: 25, x: 'Fiable y con buen alcance.' },
  { n: 'escopeta DDoS', d: 11, cd: .75, sp: 300, pel: 5, spread: .5, ammo: 24, price: 450, ap: 40, x: 'Cinco perdigones de golpe. Brutal de cerca.' },
  { n: 'subfusil de fuerza bruta', d: 8, cd: .09, sp: 380, spread: .14, ammo: 150, price: 700, ap: 45, x: 'Ráfaga continua. Gasta munición sin piedad.' },
  { n: 'lanzador EMP', d: 70, cd: 1.1, sp: 210, boom: 46, ammo: 8, price: 1200, ap: 80, x: 'Proyectil que explota en área. Para autos y grupos.' },
  { n: 'cañón de fibra', d: 55, cd: .9, beam: true, ammo: 15, price: 2000, ap: 90, x: 'Rayo que atraviesa todo lo que encuentra.' },
];
const GUN0 = 6; // primer arma de fuego en la lista
// Autos: velocidad máxima, aceleración, vida, precio en el concesionario
const CAR_T = {
  sedan: { n: 'sedán', max: 205, acc: 240, hp: 80, price: 300 }, taxi: { n: 'taxi', max: 205, acc: 240, hp: 85, price: 400 },
  sport: { n: 'deportivo', max: 265, acc: 340, hp: 70, price: 1200 }, van: { n: 'furgón', max: 160, acc: 190, hp: 120, price: 0 },
  offroad: { n: 'todoterreno', max: 220, acc: 270, hp: 140, price: 900, x: 'No pierde velocidad en césped ni aceras.' },
  armored: { n: 'blindado', max: 178, acc: 210, hp: 320, price: 2500, x: 'Aguanta balas y choques; embiste sin miedo.' },
  soc: { n: 'furgoneta del SOC', max: 185, acc: 230, hp: 140 }, exfil: { n: 'furgoneta RW', max: 150, acc: 200, hp: 170 },
};
const CITY_MISSIONS = [
  { t: 'Primer contacto' }, { t: 'El pendrive' }, { t: 'Apaga el C2' }, { t: 'Furgoneta de exfiltración' }, { t: 'Antenas zombi' }, { t: 'El jefe de Los Cifrados' },
];
const AVS = ['Av. Kernel', 'Av. Firewall', 'Av. Proxy', 'Av. Sudo', 'Av. Root', 'Av. Socket', 'Av. Bash', 'Av. Hash', 'Av. Daemon', 'Av. Cron', 'Av. Shell', 'Av. Vector'];
const CALLES = ['Calle Ping', 'Calle 404', 'Calle Token', 'Calle Cookie', 'Calle Ribera', 'Calle Payload', 'Calle Puerto', 'Calle Buffer', 'Calle Muelle'];
const CITY_SIGNS = ['HACK', '404', 'ROOT', 'VPN', '0DAY', 'SUDO', 'PING', 'CAFE', 'BYTE', 'SSH', 'NEON', 'RAM', 'LOGS', 'TOR'];
const CAR_COLS = ['#ef4444', '#3b82f6', '#22c55e', '#e5e7eb', '#a855f7', '#14b8a6', '#f472b6', '#64748b', '#0ea5e9'];
const PAINTS = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7', '#ec4899', '#e5e7eb', '#111827'];
const NEONS = ['#ff3fc8', '#3ee8ff', '#4ade80', '#f2b33d', '#a855f7'];
const SKINS = ['#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#ffdbac'];
const HAIRS = ['#1f1300', '#4a2511', '#7c4a1e', '#d4a017', '#111827', '#7f1d1d'];
const SHIRTS = ['#64748b', '#a16207', '#0e7490', '#7c3aed', '#be185d', '#4d7c0f', '#b45309', '#1d4ed8', '#e5e7eb'];
// Personalidades: cómo hablan y cómo reaccionan si las atacas
const PERSONAS = {
  timido: { w: 22, sp: 22, react: 'flee', lines: ['Disculpe… no, nada, perdón.', 'Prefiero no meterme en problemas.', 'Voy rapidito a casa, que ya es tarde.'] },
  valiente: { w: 12, sp: 24, react: 'fight', lines: ['Ni se le ocurra tocarme, ¿eh?', 'Yo hice karate en el colegio, mae.', 'Aquí se respeta al vecino.'], angry: ['¡Ahora sí se metió en un lío!', '¡Venga pues, a ver!'] },
  armado: { w: 6, sp: 22, react: 'shoot', lines: ['Tengo licencia y buena puntería.', 'Calma, que no quiero problemas.', 'Cuidado con lo que hace por aquí.'], angry: ['¡Alto ahí!', '¡Último aviso!'] },
  curioso: { w: 12, sp: 24, react: 'flee', film: true, lines: ['¿Qué pasó por allá? Voy a ver.', 'Esto lo subo a redes ya mismo.', '¿Usted es de la resistencia? ¡Qué tuanis!'] },
  chismoso: { w: 12, sp: 20, react: 'flee', chat: true, lines: ['¿Ya supo lo del vecino? Le cifraron hasta las fotos de la boda.', 'Dicen que Nodo era sysadmin del banco.', 'A mi prima le robaron la cuenta por usar la misma contraseña en todo.', 'El del quinto piso le abrió un adjunto a un «príncipe nigeriano».'] },
  distraido: { w: 16, sp: 15, react: 'flee', phone: true, lines: ['Un momento, que estoy respondiendo un correo…', '¿Eh? Perdón, iba viendo el teléfono.', '¡Uy! Casi me como el poste.'] },
  anciano: { w: 10, sp: 11, react: 'flee', old: true, lines: ['En mis tiempos los virus venían en disquete.', 'Mijo, no le dé su clave a nadie, ni a su tía.', 'Antes el ransomware se llamaba secuestro, y punto.'] },
  turista: { w: 10, sp: 20, react: 'flee', cam: true, lines: ['Excuse me… ¿dónde queda el muelle?', '¡Qué ciudad más bonita! Lástima el malware.', '¿Esto es la Av. Kernel? Mi mapa no carga.'] },
};
const PERSONA_POOL = Object.entries(PERSONAS).flatMap(([k, v]) => Array(v.w).fill(k));
const CIV_LINES = [
  'Mae, me llegó un SMS de «Correos» pidiéndome ₡1 250. Ni pedí nada.', '¿Usted también tiene la contraseña en un papelito bajo el teclado?',
  'Pura vida… hasta que te cifran el disco.', 'Activé la verificación en dos pasos. Me siento invencible.',
  'El café de la esquina tiene wifi gratis. Yo no me conecto ni loco.', 'Mi jefe me pidió tarjetas de regalo por correo. Muy raro, ¿verdad?',
  'Hice copia de seguridad ayer. La primera en diez años.', '¿Ha visto los drones del SOC? Vigilan a quien arma escándalo.',
  'El QR del parquímetro estaba pegado encima del otro. Casi caigo.', 'Si es gratis y no sabe por qué, el producto es usted.',
  'Las farolas parpadean desde que llegaron Los Cifrados.', 'Mi abuela ya usa passkeys y yo sigo con 123456. Qué vergüenza.',
  'Me llamó el «banco» pidiendo el código del SMS. Les colgué.', 'No conecte memorias USB que encuentre tiradas. Se lo digo por experiencia.',
  'En la armería 0xDEAD venden una katana de fibra óptica. ¡Una katana!', 'Dicen que en el taller le ponen turbo hasta a un taxi.',
  'Leí en TodoHack que el candado del navegador no garantiza nada.', 'Wepa, qué noche más linda para no abrir correos raros.',
];
const RUMORS = ['Dicen que Los Cifrados se juntan cerca de {p}.', 'Vi gente rara rondando por {p}. Yo que usted iría con cuidado.', 'Mi primo trabaja de noche por {p} y oye ruido de servidores.'];
const FLEE_LINES = ['¡Llamen al SOC!', '¡Corran!', '¡Mis datos no!', '¡Ay, mae!', '¡Socorro!', '¡Qué torta!'];
const FILM_LINES = ['¡Esto va directo a redes!', '¡Grabando, grabando!', '¡Qué video más viral!'];
const GANG_LINES = ['¡Paga el rescate en Monero!', '¡Tus archivos son nuestros!', '¡Aquí no pasa nadie sin la clave!', '¡Doble extorsión, mae!', '¡El jefe quiere tus datos!'];
const DRONE_LINES = ['UNIDAD SOC: DETÉNGASE', 'SUJETO IDENTIFICADO', 'REGISTRANDO INCIDENTE', 'ALTO, CIUDADANO'];
const HONKS = ['¡Piii!', '¡Muévase, mae!', '¡Está en verde!', '¡Piii piii!'];
const RES_LINES = ['Nodo te espera en el círculo verde.', 'Aquí parcheamos lo que Los Cifrados rompen.', 'Tus autos comprados quedan aparcados aquí.', 'La armería está en el Barrio Neón; el taller, en el Puerto Industrial.', 'Los drones solo te siguen si haces daño a civiles.'];

function ciudad(T) {
  const TW = 16, BK = 9, NBX = 11, NBY = 8, MW = 2 + BK * NBX + 2 + 2, MH = 2 + BK * NBY + 2 + 2;
  const hold = (k, t) => `<button type="button" data-h="${k}">${t}</button>`;
  const pad = touch ? `<div class="pad-dirs">${['', hold('up', '↑'), '', hold('left', '←'), '', hold('right', '→'), '', hold('down', '↓'), ''].map(x => x || '<span></span>').join('')}</div>`
    + `<div class="pad-acts">${hold('fire', 'disparar')}${hold('nitro', 'turbo')}<button type="button" data-k="e">acción</button><button type="button" data-k="q">arma</button><button type="button" data-k="m">destino</button><button type="button" data-k="Escape">salir</button></div>` : '';
  const m = mount(T, { pad });
  const cv = document.createElement('canvas'); cv.className = 'game-cv';
  const hud = document.createElement('div'); hud.className = 'game-hud';
  const dlg = document.createElement('div'); dlg.className = 'city-dlg'; dlg.hidden = true;
  m.scr.classList.add('game-log'); m.scr.after(dlg); dlg.after(cv); cv.after(hud);
  let ctx, zoom = 2, VW = 320, VH = 180;
  const size = () => {
    const w = Math.min(760, T.out.clientWidth - 8);
    zoom = w >= 600 ? 2 : 1.5;
    const h = Math.round(w * (w >= 600 ? .56 : .7));
    ctx = setupCanvas(cv, w, h); ctx.scale(zoom, zoom);
    VW = w / zoom; VH = h / zoom;
  };
  const fx = fxLayer();
  const now = () => performance.now();
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const angDiff = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), f = c => clamp(Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k), 0, 255); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; };
  let log = [], said = 0, shownLog = -1;
  const say = t => { log.push(t); said++; if (log.length > 30) log.shift(); };

  // ---------- Mapa ----------
  const map = new Uint8Array(MW * MH); // 0 calle · 1 acera · 2 edificio · 3 parque · 4 agua · 5 árbol · 6 plaza
  const bid = new Uint16Array(MW * MH); // identificador de edificio: casillas con el mismo id forman un edificio
  const at = (tx, ty) => tx < 0 || ty < 0 || tx >= MW || ty >= MH ? 4 : map[ty * MW + tx];
  const SPECIAL = { '1,1': 'base', '8,6': 'c2', '10,7': 'dock', '2,6': 'armeria', '6,6': 'taller', '5,2': 'lot', '9,1': 'hospital', '1,6': 'casino', '0,5': 'market', '4,5': 'bar', '10,0': 'obs' };
  const RIVER = 4; // fila de manzanas que ocupa el río; las avenidas lo cruzan como puentes
  const MERGES = [[5, 0, 'mplaza'], [8, 2, 'stadium'], [2, 2, 'mpark'], [3, 6, 'mplaza']]; // supermanzanas que cortan una avenida
  // Barrios: cada zona tiene su arquitectura, el color de sus aceras y su densidad de neón
  const BARRIOS = {
    bash: { n: 'Barrio Bash', kinds: ['house', 'house', 'apart', 'house', 'green'], park: .22, walk: '#4a4338', signs: .15 },
    kernel: { n: 'Distrito Kernel', kinds: ['office', 'office', 'mall', 'office', 'data'], park: .06, walk: '#3d4558', signs: .35 },
    sudo: { n: 'Campus Sudo', kinds: ['lab', 'data', 'lab', 'green'], park: .35, walk: '#384a40', signs: .2 },
    neon: { n: 'Barrio Neón', kinds: ['club', 'mall', 'club', 'apart'], park: .08, walk: '#3d3049', signs: 1 },
    puerto: { n: 'Puerto Industrial', kinds: ['ware', 'containers', 'ware', 'containers', 'data'], park: .04, walk: '#3f3f3f', signs: .1 },
  };
  const barrioOf = (bx, by) => by < RIVER ? (bx < 4 ? 'bash' : bx < 8 ? 'kernel' : 'sudo') : (bx < 5 ? 'neon' : 'puerto');
  const SHOPB = { armeria: 1, taller: 1, hospital: 1, casino: 1, bar: 1, obs: 1 };
  const btype = {};
  for (let by = 0; by < NBY; by++) for (let bx = 0; bx < NBX; bx++) btype[bx + ',' + by] = by === RIVER ? 'river' : SPECIAL[bx + ',' + by] || (Math.random() < BARRIOS[barrioOf(bx, by)].park ? 'park' : 'build');
  for (const [bx, by, k] of MERGES) btype[bx + ',' + by] = btype[(bx + 1) + ',' + by] = k;
  const rr = (tx, ty) => [(tx - 2) % BK, (ty - 2) % BK];
  const BTYPES = ['office', 'apart', 'ware', 'mall', 'data', 'green', 'apart', 'office'];
  const kindOfB = {}; // tipo de cada edificio
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
    let t;
    if (tx < 2 || ty < 2 || tx >= MW - 2 || ty >= MH - 2) t = 4;
    else {
      const [rx, ry] = rr(tx, ty), bx = Math.floor((tx - 2) / BK), by = Math.floor((ty - 2) / BK);
      if (rx < 2 || ry < 2 || bx >= NBX || by >= NBY) t = 0;
      else if (btype[bx + ',' + by] === 'river') t = 4;
      else if (rx === 2 || rx === 8 || ry === 2 || ry === 8) t = 1;
      else {
        const k = btype[bx + ',' + by];
        if (k === 'build' || SHOPB[k]) {
          t = 2;
          const id = SHOPB[k] ? 1000 + bx * 10 + by : 1 + bx * 40 + by * 4 + (rx < 5 ? 0 : 1) + (ry < 5 ? 0 : 2);
          bid[ty * MW + tx] = id;
          const ks = BARRIOS[barrioOf(bx, by)].kinds;
          kindOfB[id] = SHOPB[k] ? k : ks[(bx * 7 + by * 3 + (rx < 5 ? 0 : 1) * 5 + (ry < 5 ? 0 : 2)) % ks.length];
        } else t = k === 'park' ? ((rx === 5 || ry === 5) ? 6 : Math.random() < .25 ? 5 : 3) : 6;
      }
    }
    map[ty * MW + tx] = t;
  }
  // Supermanzanas: se elimina el tramo de avenida entre dos manzanas y se convierte en parque con lago o en plaza con fuente
  const fieldSet = new Set(), beachSet = new Set(), pierSet = new Set();
  for (const [bx, by, k] of MERGES) {
    const x0 = 2 + BK * bx + 3, x1 = 2 + BK * (bx + 1) + 7, y0 = 2 + BK * by + 3, y1 = 2 + BK * by + 7, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
      const e = ((tx - cx) / 3.2) ** 2 + ((ty - cy) / 1.6) ** 2;
      const wob = Math.sin(tx * 1.3) * .25 + Math.cos(ty * 1.7) * .25; // orilla irregular
      if (k === 'stadium') {
        const se = ((tx - cx) / ((x1 - x0) / 2 + .5)) ** 2 + ((ty - cy) / ((y1 - y0) / 2 + .5)) ** 2;
        const gate = Math.abs(tx - cx) < 1 && ty > cy;
        map[ty * MW + tx] = se < .42 || gate ? 6 : se <= 1 ? 2 : 6;
        if (map[ty * MW + tx] === 2) { bid[ty * MW + tx] = 2000; kindOfB[2000] = 'stadium'; }
        if (se < .42) fieldSet.add(ty * MW + tx);
      } else map[ty * MW + tx] = k === 'mpark' ? (e + wob < 1 ? 4 : e > 2 && Math.random() < .14 ? 5 : 3) : (e < .35 ? 4 : 6);
    }
    for (const ty of [2 + BK * by + 2, 2 + BK * by + 8]) for (const tx of [2 + BK * (bx + 1), 2 + BK * (bx + 1) + 1]) map[ty * MW + tx] = 1; // sin tramos de calle sin salida
  }
  // Costa suroeste: playa de arena con orilla irregular, palmeras, muelle de madera y un faro sobre las rocas
  const BEACH_X = 2 + BK * 3 - 1, BEACH_Y = 2 + BK * 7 + 2;
  const shoreY = tx => BEACH_Y + 4 + Math.round(Math.sin(tx * .45) * 1.5 + Math.sin(tx * 1.3 + 1) * .8);
  for (let ty = BEACH_Y; ty < MH; ty++) for (let tx = 0; tx <= BEACH_X; tx++) {
    const i = ty * MW + tx; beachSet.add(i); bid[i] = 0;
    map[i] = ty >= shoreY(tx) ? 4 : (ty > BEACH_Y && Math.random() < .06 ? 5 : 7);
  }
  for (let ty = shoreY(14) - 2; ty < MH; ty++) for (const tx of [14, 15]) { map[ty * MW + tx] = 6; pierSet.add(ty * MW + tx); }
  const FARO = { x: 5 * TW + 8, y: (shoreY(5) - 1) * TW + 8 };
  map[Math.floor(FARO.y / TW) * MW + 5] = 2; bid[Math.floor(FARO.y / TW) * MW + 5] = 3000; kindOfB[3000] = 'faro';
  for (let bx = 0; bx < 3; bx++) btype[bx + ',7'] = 'beach';
  const tAt = (x, y) => at(Math.floor(x / TW), Math.floor(y / TW));
  const solid = t => t === 2 || t === 4 || t === 5; // 7 = arena (transitable)
  const free = (x, y, r) => !solid(tAt(x - r, y - r)) && !solid(tAt(x + r, y - r)) && !solid(tAt(x - r, y + r)) && !solid(tAt(x + r, y + r));
  const los = (a, b) => { const d = dist(a, b), n = Math.ceil(d / 8); for (let i = 1; i < n; i++) if (tAt(a.x + (b.x - a.x) * i / n, a.y + (b.y - a.y) * i / n) === 2) return false; return true; };
  const inter = (bx, by) => ({ x: (2 + BK * bx) * TW + TW, y: (2 + BK * by) * TW + TW, bx, by });
  const blockMid = (bx, by) => ({ x: (2 + BK * bx + 5) * TW + 8, y: (2 + BK * by + 5) * TW + 8, bx, by });
  const door = (bx, by) => ({ x: (2 + BK * bx + 5) * TW + 8, y: (2 + BK * by + 8) * TW + 8, bx, by }); // acera frente a la fachada sur
  const interName = p => `${AVS[p.bx]} y ${CALLES[p.by]}`;
  const isInter = (tx, ty) => { const [rx, ry] = rr(tx, ty); return at(tx, ty) === 0 && rx < 2 && ry < 2; };
  // Puntos de interés: tiendas y servicios
  const POI = [
    { k: 'armeria', n: 'Armería 0xDEAD', ...door(2, 6), col: '#ef4444', ico: 'gun' },
    { k: 'taller', n: 'Taller Pit Stop Overclock', ...door(6, 6), col: '#f97316', ico: 'wrench' },
    { k: 'lot', n: 'Concesionario AutoHash', ...door(5, 2), col: '#22d3ee', ico: 'car' },
    { k: 'hospital', n: 'Hospital San Parche', ...door(9, 1), col: '#f1f5f9', ico: 'cross' },
    { k: 'casino', n: 'Casino Bit Royale', ...door(1, 6), col: '#facc15', ico: 'dice' },
    { k: 'market', n: 'Mercado nocturno', ...door(0, 5), col: '#fb923c', ico: 'food' },
    { k: 'bar', n: 'Bar 0DAY', ...door(4, 5), col: '#a78bfa', ico: 'cup' },
  ];
  // Lugares por descubrir: la primera visita da una recompensa
  const PLACES = [
    { k: 'faro', n: 'Faro del Checksum', x: FARO.x + 18, y: FARO.y - 14 }, { k: 'playa', n: 'Playa Pixel', x: 9 * TW, y: (BEACH_Y + 2) * TW },
    { k: 'muelle', n: 'Muelle de madera', x: 15 * TW, y: (MH - 2) * TW }, { k: 'estadio', n: 'Estadio Byte', x: (2 + BK * 9) * TW + 8, y: (2 + BK * 2 + 8) * TW + 8 },
    { k: 'obs', n: 'Observatorio Sudo', ...door(10, 0) }, { k: 'parque', n: 'Gran Parque del Cifrado', x: (2 + BK * 3) * TW + 8, y: (2 + BK * 2 + 7) * TW + 8 },
    { k: 'puente', n: 'Puente de Av. Socket', x: (2 + BK * 5) * TW + TW, y: (2 + BK * RIVER + 5) * TW }, { k: 'mercado', n: 'Mercado nocturno', ...door(0, 5) },
    { k: 'casino', n: 'Casino Bit Royale', ...door(1, 6) }, { k: 'bar', n: 'Bar 0DAY', ...door(4, 5) },
  ];
  const streetAt = (x, y) => {
    const tx = Math.floor(x / TW), ty = Math.floor(y / TW), t = at(tx, ty), [rx, ry] = rr(tx, ty), bx = Math.floor((tx - 2) / BK), by = Math.floor((ty - 2) / BK);
    if (beachSet.has(ty * MW + tx)) return pierSet.has(ty * MW + tx) ? 'Muelle de madera' : t === 4 ? 'Bahía de los Logs' : 'Playa Pixel';
    if (fieldSet.has(ty * MW + tx) || kindOfB[bid[ty * MW + tx]] === 'stadium') return 'Estadio Byte';
    if (t === 4) return by === RIVER && tx > 1 && tx < MW - 2 ? 'Río Base64' : (btype[bx + ',' + by] || '').startsWith('m') ? 'Lago del parque' : 'Bahía de los Logs';
    if (t === 6 || t === 1 || t === 3) {
      const k = btype[bx + ',' + by];
      const named = { market: 'Mercado nocturno', casino: 'Casino Bit Royale', bar: 'Bar 0DAY', obs: 'Observatorio Sudo', stadium: 'Estadio Byte', mpark: 'Gran Parque del Cifrado', mplaza: barrioOf(clamp(bx, 0, NBX - 1), clamp(by, 0, NBY - 1)) === 'neon' ? 'Plaza Neón' : 'Plaza del Kernel', base: 'Refugio de la resistencia', c2: 'Plaza roja (C2)', dock: 'Muelle de carga', park: 'Parque del Cifrado César', lot: 'Concesionario AutoHash', armeria: 'Armería 0xDEAD', taller: 'Taller Pit Stop Overclock', hospital: 'Hospital San Parche' };
      if (named[k] && (t !== 1 || SHOPB[k] || k === 'lot' || k === 'market')) return named[k];
    }
    if (t !== 0) return '';
    if (rx < 2 && ry < 2) return `${AVS[clamp(bx, 0, NBX)]} / ${CALLES[clamp(by, 0, NBY)]}`;
    if (rx < 2 && by === RIVER && ry >= 2) return `Puente de ${AVS[clamp(bx, 0, NBX)]}`;
    return rx < 2 ? AVS[clamp(bx, 0, NBX)] : CALLES[clamp(by, 0, NBY)];
  };
  const barrioAt = (x, y) => { const bx = clamp(Math.floor((Math.floor(x / TW) - 2) / BK), 0, NBX - 1), by = clamp(Math.floor((Math.floor(y / TW) - 2) / BK), 0, NBY - 1); return barrioOf(bx, by === RIVER ? RIVER - 1 : by);
  };

  let gameT = 0;
  const light = (ix, iy, axis) => {
    const t = (gameT + (ix * 3 + iy * 5) % 12) % 12;
    if (axis === 'v') return t < 5 ? 'g' : t < 6 ? 'y' : 'r';
    return t < 6 ? 'r' : t < 11 ? 'g' : 'y';
  };

  const lamps = [], manholes = [], props = [], signs = [];
  for (let by = 0; by < NBY; by++) for (let bx = 0; bx < NBX; bx++) {
    const ox = 2 + BK * bx, oy = 2 + BK * by;
    if (btype[bx + ',' + by] === 'river') continue;
    for (const [rx, ry, dx, dy] of [[2, 2, -5, -5], [8, 2, 5, -5], [2, 8, -5, 5], [8, 8, 5, 5]]) { const l = { x: (ox + rx) * TW + 8 + dx, y: (oy + ry) * TW + 8 + dy }; if (!solid(tAt(l.x, l.y))) lamps.push(l); } // ninguna farola dentro del agua
    const bar = BARRIOS[barrioOf(bx, by)];
    if (btype[bx + ',' + by] === 'build' && Math.random() < bar.signs) signs.push({ x: (ox + 3) * TW + 3, y: (oy + 3) * TW + 3, txt: CITY_SIGNS[(bx * 5 + by * 3) % CITY_SIGNS.length], col: NEONS[(bx * 3 + by) % 4], ph: Math.random() * 10 });
    if (btype[bx + ',' + by] === 'build' && bar.signs >= 1) signs.push({ x: (ox + 5) * TW + 2, y: (oy + 6) * TW + 2, txt: pickOne(['CLUB', 'BAR', 'LIVE', '24H', 'KARAOKE', 'DJ']), col: pickOne(NEONS), ph: Math.random() * 10 });
  }
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
    const t = at(tx, ty), [rx, ry] = rr(tx, ty), r = Math.random();
    if (t === 1 && !((rx === 2 || rx === 8) && (ry === 2 || ry === 8)) && ry !== 8 && r < .07) props.push({ x: tx * TW + 8, y: ty * TW + 8, k: pickOne(['bench', 'bin', 'hydrant', 'bin', 'plant']) });
    if (t === 0 && !isInter(tx, ty) && r < .025) manholes.push({ x: tx * TW + 8, y: ty * TW + 8, t: Math.random() * 3 });
  }

  // ---------- Pintado del mapa (una vez) ----------
  const mapCv = document.createElement('canvas'); mapCv.width = MW * TW; mapCv.height = MH * TW;
  const mini = document.createElement('canvas'); mini.width = MW; mini.height = MH;
  {
    const g = mapCv.getContext('2d'), mg = mini.getContext('2d');
    const ROOF = { casino: '#3b1d0b', bar: '#1f1a2e', obs: '#cbd5e1', stadium: '#374151', faro: '#57534e', house: '#8b3a2b', lab: '#c4ccd8', club: '#17101f', containers: '#3f3f46', office: '#1d3557', apart: '#7a3b2e', ware: '#4b5563', mall: '#3f3a52', data: '#141a24', green: '#24402c', armeria: '#3b0d0d', taller: '#3a3a3a', hospital: '#d9dde4' };
    const WALL = { casino: '#2a1407', bar: '#130f1d', obs: '#94a3b8', stadium: '#1f2937', faro: '#3f3f46', house: '#5c2a20', lab: '#8a94a3', club: '#0d0814', containers: '#27272a', office: '#122238', apart: '#4a2620', ware: '#2d333d', mall: '#2a2638', data: '#0b0f16', green: '#1c2b22', armeria: '#250707', taller: '#232323', hospital: '#a8afba' };
    for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
      const t = at(tx, ty), x = tx * TW, y = ty * TW, [rx, ry] = rr(tx, ty), h = (tx * 73 + ty * 151) % 97;
      if (t === 0) {
        g.fillStyle = '#1b1f2b'; g.fillRect(x, y, TW, TW);
        g.fillStyle = '#202532'; g.fillRect(x + (h % 13), y + (h % 11), 2, 1);
        g.fillStyle = '#c99a2e';
        if (rx === 0 && ry >= 2) g.fillRect(x + TW - 1, y + 4, 2, 8);
        if (ry === 0 && rx >= 2) g.fillRect(x + 4, y + TW - 1, 8, 2);
        g.fillStyle = '#d6dae3';
        if (rx < 2 && (ry === 2 || ry === 8)) for (let i = 1; i < TW; i += 4) g.fillRect(x + i, y + 3, 2, 10);
        if (ry < 2 && (rx === 2 || rx === 8)) for (let i = 1; i < TW; i += 4) g.fillRect(x + 3, y + i, 10, 2);
        g.fillStyle = '#e5e7eb';
        if (rx === 0 && ry === 7) g.fillRect(x, y + TW - 1, TW, 1);
        if (rx === 1 && ry === 3) g.fillRect(x, y, TW, 1);
        if (ry === 1 && rx === 7) g.fillRect(x + TW - 1, y, 1, TW);
        if (ry === 0 && rx === 3) g.fillRect(x, y, 1, TW);
        g.fillStyle = '#9aa4b5'; // barandillas de los puentes sobre el río
        if (at(tx - 1, ty) === 4) g.fillRect(x, y, 2, TW); if (at(tx + 1, ty) === 4) g.fillRect(x + TW - 2, y, 2, TW);
        if (at(tx, ty - 1) === 4) g.fillRect(x, y, TW, 2); if (at(tx, ty + 1) === 4) g.fillRect(x, y + TW - 2, TW, 2);
      } else if (t === 1) {
        const wb = BARRIOS[barrioOf(clamp(Math.floor((tx - 2) / BK), 0, NBX - 1), clamp(Math.floor((ty - 2) / BK), 0, NBY - 1))].walk;
        g.fillStyle = wb; g.fillRect(x, y, TW, TW); g.fillStyle = shade(wb, -.15); g.fillRect(x, y, TW, 1); g.fillRect(x, y, 1, TW); g.fillRect(x + 8, y, 1, TW);
        g.fillStyle = shade(wb, .18);
        if (at(tx - 1, ty) === 0) g.fillRect(x, y, 2, TW); if (at(tx + 1, ty) === 0) g.fillRect(x + TW - 2, y, 2, TW);
        if (at(tx, ty - 1) === 0) g.fillRect(x, y, TW, 2); if (at(tx, ty + 1) === 0) g.fillRect(x, y + TW - 2, TW, 2);
      } else if (t === 2) {
        const id = bid[ty * MW + tx], kind = kindOfB[id], base = ROOF[kind];
        const same = (dx, dy) => at(tx + dx, ty + dy) === 2 && bid[(ty + dy) * MW + tx + dx] === id;
        const front = !same(0, 1) && kind !== 'faro' && kind !== 'stadium'; // fila de la fachada sur: se ve el muro con ventanas (efecto 2,5D)
        g.fillStyle = base; g.fillRect(x, y, TW, TW);
        // cubierta según el tipo de edificio
        if (kind === 'office') { g.save(); g.beginPath(); g.rect(x, y, TW, TW); g.clip(); g.fillStyle = shade(base, .15); for (let i = -16; i < 16; i += 6) { g.beginPath(); g.moveTo(x + i, y + 16); g.lineTo(x + i + 4, y + 16); g.lineTo(x + i + 20, y); g.lineTo(x + i + 16, y); g.fill(); } g.restore(); g.fillStyle = shade(base, -.25); g.fillRect(x, y + 7, TW, 1); g.fillRect(x + 7, y, 1, TW); }
        else if (kind === 'apart') { g.fillStyle = shade(base, -.2); for (let i = 0; i < TW; i += 3) g.fillRect(x, y + i, TW, 1); if (h < 20) { g.fillStyle = '#2b2b2b'; g.fillRect(x + 10, y + 3, 3, 3); g.fillStyle = '#6b7280'; g.fillRect(x + 10, y + 2, 3, 1); } if (h > 80) { g.fillStyle = '#596276'; g.fillRect(x + 3, y + 4, 5, 4); } }
        else if (kind === 'ware') { g.fillStyle = shade(base, .12); for (let i = 0; i < TW; i += 2) g.fillRect(x + i, y, 1, TW); }
        else if (kind === 'mall') { g.fillStyle = 'rgba(56,189,248,.35)'; g.fillRect(x + 3, y + 3, 4, 4); g.fillRect(x + 9, y + 3, 4, 4); g.fillRect(x + 3, y + 9, 4, 4); g.fillRect(x + 9, y + 9, 4, 4); }
        else if (kind === 'data') { g.fillStyle = '#374151'; for (const [cx, cy] of [[4, 4], [12, 4], [4, 12], [12, 12]]) { g.beginPath(); g.arc(x + cx, y + cy, 3, 0, 6.283); g.fill(); } g.fillStyle = '#4ade80'; g.fillRect(x + 8, y + 8, 1, 1); }
        else if (kind === 'green') { g.fillStyle = '#2f6b3f'; g.fillRect(x + 2, y + 2, 5, 5); g.fillRect(x + 9, y + 9, 5, 5); g.fillStyle = '#7c4a1e'; g.fillRect(x + 2, y + 9, 5, 5); }
        else if (kind === 'taller') { g.fillStyle = shade(base, .1); if ((tx + ty) % 2) g.fillRect(x, y, TW, TW); }
        else if (kind === 'stadium') { const a = Math.atan2(ty - 0, tx - 0); g.fillStyle = ['#b91c1c', '#1d4ed8', '#f2b33d'][(tx + ty) % 3]; for (let i = 2; i < TW; i += 4) g.fillRect(x, y + i, TW, 2); }
        else if (kind === 'casino') { g.fillStyle = '#7c2d12'; g.fillRect(x + 1, y + 1, 14, 14); g.fillStyle = '#facc15'; if ((tx + ty) % 2) g.fillRect(x + 6, y + 6, 4, 4); }
        else if (kind === 'bar') { g.fillStyle = '#2e1065'; g.fillRect(x + 2, y + 2, 12, 12); }
        else if (kind === 'faro') { g.fillStyle = '#78716c'; g.beginPath(); g.arc(x + 8, y + 8, 8, 0, 6.283); g.fill(); }
        else if (kind === 'house') { g.fillStyle = shade(base, .14); g.fillRect(x, y, TW, 7); g.fillStyle = shade(base, -.18); g.fillRect(x, y + 8, TW, 8); g.fillStyle = shade(base, .35); g.fillRect(x, y + 7, TW, 1); if (h < 18) { g.fillStyle = '#3f3f46'; g.fillRect(x + 11, y + 2, 3, 4); } }
        else if (kind === 'lab') { g.fillStyle = 'rgba(56,189,248,.45)'; g.fillRect(x + 2, y + 5, 12, 3); g.fillStyle = '#94a3b8'; if (h < 30) g.fillRect(x + 4, y + 10, 4, 3); }
        else if (kind === 'containers') { const C = ['#b91c1c', '#1d4ed8', '#15803d', '#c2410c', '#0e7490', '#a16207']; for (const yy of [2, 9]) { const c0 = C[(h + yy) % 6]; g.fillStyle = c0; g.fillRect(x + 1, y + yy, 14, 5); g.fillStyle = shade(c0, -.3); for (let i = 3; i < 14; i += 3) g.fillRect(x + 1 + i, y + yy, 1, 5); } }
        // pretil
        g.fillStyle = shade(base, .28);
        if (!same(-1, 0)) g.fillRect(x, y, 2, TW); if (!same(0, -1)) g.fillRect(x, y, TW, 2);
        g.fillStyle = '#0b0e16';
        if (!same(1, 0)) g.fillRect(x + TW - 2, y, 2, TW);
        if (kind === 'club') { const nc = id % 2 ? '#ff3fc8' : '#3ee8ff'; g.shadowColor = nc; g.shadowBlur = 6; g.fillStyle = nc; if (!same(-1, 0)) g.fillRect(x + 2, y, 1, TW); if (!same(0, -1)) g.fillRect(x, y + 2, TW, 1); if (!same(1, 0)) g.fillRect(x + TW - 3, y, 1, TW); g.shadowBlur = 0; }
        if (front) {
          const wall = WALL[kind];
          g.fillStyle = wall; g.fillRect(x, y + 7, TW, 9);
          g.fillStyle = shade(wall, .3); g.fillRect(x, y + 7, TW, 1);
          for (let wx = 2; wx < TW - 2; wx += 4) {
            const lit = (tx * 31 + wx * 7 + ty * 13) % 5;
            g.fillStyle = kind === 'office' ? (lit < 3 ? '#7dd3fc' : '#1e3a5f') : kind === 'data' ? (lit < 2 ? '#4ade80' : '#14532d') : lit < 2 ? '#fde68a' : lit < 3 ? '#93c5fd' : '#151a24';
            g.fillRect(x + wx, y + 9, 2, 3);
          }
          g.fillStyle = '#05080f'; g.fillRect(x, y + 14, TW, 2);
          if (!same(1, 0)) { g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(x + TW - 2, y + 7, 2, 9); }
        }
      } else if (t === 7 || (t === 5 && beachSet.has(ty * MW + tx))) {
        g.fillStyle = '#b8955c'; g.fillRect(x, y, TW, TW); g.fillStyle = '#a5844f'; g.fillRect(x + (h % 13), y + (h % 11), 2, 1); g.fillRect(x + (h % 7) + 4, y + (h % 5) + 6, 1, 1);
        if (at(tx, ty + 1) === 4) { g.fillStyle = 'rgba(241,245,249,.55)'; g.fillRect(x, y + TW - 2, TW, 2); } // espuma de la orilla
        if (t === 5) { g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(x + 10, y + 12, 6, 3, 0, 0, 6.283); g.fill(); g.strokeStyle = '#7c4a1e'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 8, y + 14); g.quadraticCurveTo(x + 6, y + 8, x + 8, y + 4); g.stroke(); g.fillStyle = '#15803d'; for (let a = 0; a < 6.28; a += 1.05) { g.beginPath(); g.ellipse(x + 8 + Math.cos(a) * 4, y + 4 + Math.sin(a) * 3, 4, 1.6, a, 0, 6.283); g.fill(); } }
      } else if (t === 3 || t === 5) {
        g.fillStyle = '#1b4329'; g.fillRect(x, y, TW, TW); g.fillStyle = '#21502f'; g.fillRect(x + (h % 12), y + (h % 9), 2, 2); g.fillRect(x + (h % 7) + 5, y + (h % 5) + 8, 1, 2);
        g.fillStyle = '#e879f9'; if (h % 11 === 0) g.fillRect(x + 4, y + 11, 1, 1); g.fillStyle = '#fde047'; if (h % 13 === 0) g.fillRect(x + 11, y + 4, 1, 1);
      } else if (t === 4) {
        g.fillStyle = '#0a2540'; g.fillRect(x, y, TW, TW); g.fillStyle = '#0d2c4b'; if ((tx + ty) % 2) g.fillRect(x, y, TW, TW);
      } else {
        const bx = Math.floor((tx - 2) / BK), by = Math.floor((ty - 2) / BK), k = btype[bx + ',' + by];
        g.fillStyle = k === 'base' ? '#173225' : k === 'c2' ? '#3a1720' : k === 'park' ? '#6b5b45' : k === 'lot' ? '#262b36' : '#4a3825'; g.fillRect(x, y, TW, TW);
        g.fillStyle = k === 'base' ? '#1c3d2d' : k === 'c2' ? '#451b26' : k === 'park' ? '#7a6a52' : k === 'lot' ? '#e5e7eb' : '#5b4630';
        if (pierSet.has(ty * MW + tx)) { g.fillStyle = '#7c5a36'; g.fillRect(x, y, TW, TW); g.fillStyle = '#5c4026'; for (let i = 0; i < TW; i += 4) g.fillRect(x, y + i, TW, 1); g.fillStyle = '#3f2a17'; g.fillRect(tx === 14 ? x : x + TW - 2, y, 2, TW); }
        else if (fieldSet.has(ty * MW + tx)) { g.fillStyle = (tx % 2) ? '#15803d' : '#166534'; g.fillRect(x, y, TW, TW); }
        else if (k === 'market') { g.fillStyle = '#4a3a2a'; g.fillRect(x, y, TW, TW); if ((tx + ty) % 2) { g.fillStyle = '#3d2f22'; g.fillRect(x, y, TW, TW); } }
        else if (k === 'dock') for (let i = 0; i < TW; i += 4) g.fillRect(x, y + i, TW, 1);
        else if (k === 'lot') { if (rx % 2) g.fillRect(x, y, 1, 10); }
        else if ((tx + ty) % 2) g.fillRect(x, y, TW, TW);
      }
      if (t !== 2) { g.fillStyle = 'rgba(0,0,0,.35)'; if (at(tx - 1, ty) === 2) g.fillRect(x, y, 4, TW); if (at(tx, ty - 1) === 2) g.fillRect(x, y, TW, 3); }
      if (t === 5 && !beachSet.has(ty * MW + tx)) { g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.arc(x + 10, y + 11, 7, 0, 6.283); g.fill(); g.fillStyle = '#14532d'; g.beginPath(); g.arc(x + 8, y + 8, 7, 0, 6.283); g.fill(); g.fillStyle = '#1e7a3d'; g.beginPath(); g.arc(x + 7, y + 7, 4, 0, 6.283); g.fill(); g.fillStyle = '#2fa352'; g.fillRect(x + 5, y + 5, 2, 2); }
      mg.fillStyle = t === 7 ? '#b8955c' : t === 0 ? '#2a3040' : t === 1 ? '#4b5366' : t === 2 ? '#141824' : t === 4 ? '#0a2540' : t === 6 ? '#5b4630' : '#1b4329';
      mg.fillRect(tx, ty, 1, 1);
    }
    // fondo un poco más oscuro: así personas, autos y objetos destacan sobre él
    g.fillStyle = 'rgba(3,5,10,.24)'; g.fillRect(0, 0, mapCv.width, mapCv.height);
    g.textAlign = 'center';
    for (const [k, v] of Object.entries(btype)) {
      const [bx, by] = k.split(',').map(Number), c = blockMid(bx, by);
      if (v === 'build' && (bx * 5 + by) % 7 === 3) { g.fillStyle = '#1f2937'; g.beginPath(); g.arc(c.x, c.y - 8, 11, 0, 6.283); g.fill(); g.strokeStyle = '#f2b33d'; g.lineWidth = 1.5; g.beginPath(); g.arc(c.x, c.y - 8, 9, 0, 6.283); g.stroke(); g.fillStyle = '#f2b33d'; g.fillRect(c.x - 4, c.y - 13, 2, 10); g.fillRect(c.x + 2, c.y - 13, 2, 10); g.fillRect(c.x - 2, c.y - 9, 4, 2); }
      const label = (txt, col, yy) => { g.font = 'bold 8px "JetBrains Mono", monospace'; g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 8; g.fillText(txt, c.x, yy); g.shadowBlur = 0; };
      if (v === 'base') label('REFUGIO', '#4ade80', c.y - 26);
      if (v === 'c2') { g.strokeStyle = '#7f1d1d'; g.lineWidth = 1; for (let i = -30; i <= 30; i += 10) { g.beginPath(); g.moveTo(c.x + i, c.y - 34); g.lineTo(c.x + i, c.y + 34); g.stroke(); } }
      if (v === 'armeria') { g.strokeStyle = '#ef4444'; g.lineWidth = 2; g.beginPath(); g.arc(c.x, c.y - 10, 12, 0, 6.283); g.stroke(); g.beginPath(); g.moveTo(c.x - 17, c.y - 10); g.lineTo(c.x + 17, c.y - 10); g.moveTo(c.x, c.y - 27); g.lineTo(c.x, c.y + 7); g.stroke(); label('ARMERÍA 0xDEAD', '#f87171', c.y + 33); }
      if (v === 'taller') { g.fillStyle = '#facc15'; for (let i = -36; i < 36; i += 8) g.fillRect(c.x + i, c.y - 36, 4, 3); label('PIT STOP', '#fb923c', c.y - 12); label('OVERCLOCK', '#fb923c', c.y - 2); g.fillStyle = '#6b7280'; for (let i = -24; i <= 16; i += 20) g.fillRect(c.x + i, c.y + 30, 14, 6); }
      if (v === 'hospital') { g.fillStyle = '#ef4444'; g.fillRect(c.x - 4, c.y - 22, 8, 22); g.fillRect(c.x - 11, c.y - 15, 22, 8); label('HOSPITAL', '#f1f5f9', c.y + 33); }
      if (v === 'mplaza' && btype[(bx - 1) + ',' + by] !== 'mplaza') label(barrioOf(bx, by) === 'neon' ? 'PLAZA NEÓN' : 'PLAZA DEL KERNEL', '#f2b33d', c.y - 26);
      if (v === 'mpark' && btype[(bx - 1) + ',' + by] !== 'mpark') label('GRAN PARQUE', '#86efac', c.y - 26);
      if (v === 'dock') { g.strokeStyle = '#facc15'; g.lineWidth = 2; for (const dx of [-24, 18]) { g.strokeRect(c.x + dx - 4, c.y - 30, 8, 8); g.beginPath(); g.moveTo(c.x + dx, c.y - 26); g.lineTo(c.x + dx, c.y + 50); g.stroke(); g.beginPath(); g.moveTo(c.x + dx - 3, c.y - 26); g.lineTo(c.x + dx + 3, c.y + 50); g.stroke(); } label('MUELLE', '#facc15', c.y + 33); }
      if (v === 'casino') { g.fillStyle = '#facc15'; g.shadowColor = '#facc15'; g.shadowBlur = 10; g.fillRect(c.x - 34, c.y - 36, 68, 3); g.fillRect(c.x - 34, c.y + 20, 68, 3); g.shadowBlur = 0; g.fillStyle = '#f8fafc'; g.fillRect(c.x - 9, c.y - 22, 18, 18); g.fillStyle = '#0b111d'; for (const [dx, dy] of [[-5, -18], [3, -18], [-1, -14], [-5, -10], [3, -10]]) g.fillRect(c.x + dx, c.y + dy, 2, 2); label('CASINO', '#facc15', c.y + 10); label('BIT ROYALE', '#f472b6', c.y + 33); }
      if (v === 'bar') { label('BAR 0DAY', '#a78bfa', c.y + 33); g.fillStyle = '#a78bfa'; g.fillRect(c.x - 6, c.y - 20, 12, 14); g.fillStyle = '#fde68a'; g.fillRect(c.x - 4, c.y - 16, 8, 8); }
      if (v === 'obs') { g.fillStyle = '#e2e8f0'; g.beginPath(); g.arc(c.x, c.y - 6, 22, 0, 6.283); g.fill(); g.fillStyle = '#94a3b8'; g.beginPath(); g.arc(c.x, c.y - 6, 22, 0, 6.283); g.stroke(); g.fillStyle = '#0b111d'; g.fillRect(c.x - 3, c.y - 28, 6, 22); label('OBSERVATORIO', '#e2e8f0', c.y + 33); }
      if (v === 'market') { const AW = ['#ef4444', '#f2b33d', '#22c55e', '#3b82f6', '#ec4899']; for (let i = 0; i < 5; i++) { const sx = c.x - 34 + i * 15, sy = c.y - 18 + (i % 2) * 22; g.fillStyle = AW[i]; g.fillRect(sx, sy, 12, 6); g.fillStyle = '#f8fafc'; for (let j = 0; j < 12; j += 4) g.fillRect(sx + j, sy, 2, 6); g.fillStyle = '#78350f'; g.fillRect(sx + 1, sy + 6, 10, 4); } label('MERCADO', '#fde68a', c.y - 28); }
      if (v === 'stadium' && btype[(bx - 1) + ',' + by] !== 'stadium') { const ex = c.x + BK * TW / 2; g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1; g.strokeRect(ex - 34, c.y - 14, 68, 28); g.beginPath(); g.moveTo(ex, c.y - 14); g.lineTo(ex, c.y + 14); g.stroke(); g.beginPath(); g.arc(ex, c.y, 6, 0, 6.283); g.stroke(); label('ESTADIO BYTE', '#f8fafc', c.y - 44); }
      if (v === 'build' && barrioOf(bx, by) === 'kernel' && (bx + by) % 2) { // torre redonda de cristal
        const gr = g.createRadialGradient(c.x - 8, c.y - 12, 4, c.x, c.y - 4, 30); gr.addColorStop(0, '#3b82f6'); gr.addColorStop(1, '#0f2547');
        g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.arc(c.x + 4, c.y, 30, 0, 6.283); g.fill();
        g.fillStyle = gr; g.beginPath(); g.arc(c.x, c.y - 4, 28, 0, 6.283); g.fill(); g.strokeStyle = '#93c5fd'; g.lineWidth = 1.5; g.beginPath(); g.arc(c.x, c.y - 4, 28, 0, 6.283); g.stroke();
        g.strokeStyle = 'rgba(147,197,253,.35)'; for (let r = 8; r < 28; r += 6) { g.beginPath(); g.arc(c.x, c.y - 4, r, 0, 6.283); g.stroke(); }
      }
      if (v === 'lot') { g.fillStyle = '#1e293b'; g.fillRect(c.x - 30, c.y - 38, 60, 18); g.fillStyle = 'rgba(56,189,248,.4)'; g.fillRect(c.x - 28, c.y - 36, 56, 14); label('AUTOHASH', '#22d3ee', c.y - 26); }
    }
    g.textAlign = 'start';
    for (const p of props) {
      if (p.k === 'bench') { g.fillStyle = '#7c4a1e'; g.fillRect(p.x - 5, p.y - 2, 10, 4); g.fillStyle = '#a16207'; g.fillRect(p.x - 5, p.y - 2, 10, 1); }
      if (p.k === 'bin') { g.fillStyle = '#14532d'; g.fillRect(p.x - 2, p.y - 2, 4, 4); g.fillStyle = '#22863f'; g.fillRect(p.x - 2, p.y - 2, 4, 1); }
      if (p.k === 'hydrant') { g.fillStyle = '#b91c1c'; g.fillRect(p.x - 2, p.y - 2, 4, 4); g.fillStyle = '#fca5a5'; g.fillRect(p.x - 1, p.y - 1, 1, 1); }
      if (p.k === 'plant') { g.fillStyle = '#57534e'; g.fillRect(p.x - 3, p.y - 3, 6, 6); g.fillStyle = '#16a34a'; g.beginPath(); g.arc(p.x, p.y, 3, 0, 6.283); g.fill(); }
    }
    for (const mh of manholes) { g.fillStyle = '#11141c'; g.beginPath(); g.arc(mh.x, mh.y, 4, 0, 6.283); g.fill(); g.fillStyle = '#2a2f3d'; g.fillRect(mh.x - 3, mh.y - 1, 6, 1); g.fillRect(mh.x - 1, mh.y - 3, 1, 6); }
    for (const l of lamps) { g.fillStyle = '#0b0e16'; g.fillRect(l.x - 1, l.y - 1, 3, 3); g.fillStyle = '#6b7280'; g.fillRect(l.x, l.y, 1, 1); }
  }

  // ---------- Sprites ----------
  const sprCache = {};
  const personSpr = (pal, frame, white) => {
    const key = pal.s + pal.h + pal.k + frame + (white ? 'w' : '');
    if (sprCache[key]) return sprCache[key];
    const rows = frame ? ['..oooo..', '.osssso.', 'osdhhkso', 'osdhhkko', 'osdhhkko', 'osdhhkso', '.ossssk.', '..oooo..'] : ['..oooo..', '.ossssk.', 'osdhhkso', 'osdhhkko', 'osdhhkko', 'osdhhkso', '.osssso.', '..oooo..'];
    const P2 = white ? { o: '#ffffff', s: '#ffffff', d: '#ffffff', h: '#ffffff', k: '#ffffff' } : { o: '#0b111d', s: pal.s, d: shade(pal.s, -.35), h: pal.h, k: pal.k };
    return (sprCache[key] = paint(rows, P2));
  };
  const carSpr = (type, col) => {
    const key = type + col;
    if (sprCache[key]) return sprCache[key];
    const big = type === 'offroad' || type === 'armored';
    const c = document.createElement('canvas'); c.width = 20; c.height = big ? 13 : 11; const g = c.getContext('2d'); const o = big ? 1 : 0;
    const dark = shade(col, -.4), lite = shade(col, .3);
    g.fillStyle = '#05080f'; for (const x of [3, 14]) { if (big) { g.fillRect(x - 1, 0, 5, 2); g.fillRect(x - 1, 11, 5, 2); } else { g.fillRect(x, 0, 3, 1); g.fillRect(x, 10, 3, 1); } }
    g.fillStyle = col; g.fillRect(1, 1 + o, 18, 9);
    g.fillStyle = dark; g.fillRect(1, 1 + o, 18, 1); g.fillRect(1, 9 + o, 18, 1); g.fillRect(1, 1 + o, 1, 9);
    if (type === 'armored') { g.fillStyle = shade(col, .15); g.fillRect(3, 3 + o, 12, 5); g.fillStyle = dark; for (let i = 4; i < 15; i += 3) g.fillRect(i, 3 + o, 1, 5); g.fillStyle = '#0b1324'; g.fillRect(15, 3 + o, 2, 5); }
    else if (type === 'van' || type === 'soc' || type === 'exfil') { g.fillStyle = lite; g.fillRect(3, 2 + o, 10, 7); g.fillStyle = dark; g.fillRect(3, 5 + o, 10, 1); g.fillStyle = '#0b1324'; g.fillRect(13, 2 + o, 2, 7); }
    else { g.fillStyle = lite; g.fillRect(15, 3 + o, 3, 5); g.fillRect(7, 2 + o, 5, 7); g.fillStyle = '#0b1324'; g.fillRect(4, 2 + o, 2, 7); g.fillRect(13, 2 + o, 2, 7); g.fillStyle = '#7dd3fc'; g.fillRect(14, 3 + o, 1, 2); }
    if (type === 'offroad') { g.fillStyle = '#1f2937'; g.fillRect(6, 2 + o, 7, 1); g.fillRect(6, 8 + o, 7, 1); g.fillStyle = '#fde68a'; g.fillRect(10, 3 + o, 1, 5); }
    g.fillStyle = '#fde68a'; g.fillRect(19, 2 + o, 1, 2); g.fillRect(19, 7 + o, 1, 2);
    g.fillStyle = '#991b1b'; g.fillRect(0, 2 + o, 1, 2); g.fillRect(0, 7 + o, 1, 2);
    if (type === 'taxi') { g.fillStyle = '#f8fafc'; g.fillRect(8, 4, 3, 3); g.fillStyle = '#0b111d'; g.fillRect(9, 5, 1, 1); g.fillStyle = '#111827'; for (let i = 2; i < 18; i += 2) g.fillRect(i, 9, 1, 1); }
    if (type === 'sport') { g.fillStyle = '#f8fafc'; g.fillRect(2, 5, 17, 1); g.fillStyle = dark; g.fillRect(1, 2, 1, 7); }
    if (type === 'van') { g.fillStyle = '#f8fafc'; g.fillRect(6, 3, 4, 3); }
    if (type === 'exfil') { g.fillStyle = '#f87171'; g.font = 'bold 6px monospace'; g.fillText('RW', 4, 8); }
    return (sprCache[key] = c);
  };
  const carWhite = type => { const k = 'w-' + type; if (sprCache[k]) return sprCache[k]; const src = carSpr(type, '#888888'), c = document.createElement('canvas'); c.width = src.width; c.height = src.height; const g = c.getContext('2d'); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = '#ffffff'; g.fillRect(0, 0, c.width, c.height); return (sprCache[k] = c); };
  const PAL = {
    me: { s: '#34508a', h: '#5f80c2', k: '#0b111d' }, gang: { s: '#7f1d1d', h: '#111827', k: '#1f2937' }, boss: { s: '#701a75', h: '#f0abfc', k: '#f0abfc' },
    lia: { s: '#0e7490', h: '#4a2511', k: '#c68642' }, nodo: { s: '#166534', h: '#9ca3af', k: '#8d5524' }, res: { s: '#15803d', h: '#1f1300', k: '#e0ac69' }, jog: { s: '#f472b6', h: '#d4a017', k: '#ffdbac' },
    clerk: { s: '#f1f5f9', h: '#111827', k: '#e0ac69' },
  };

  // ---------- Estado ----------
  let prog = (() => { try { return JSON.parse(store.get('city')) || {}; } catch (e) { return {}; } })();
  // Migración: el progreso antiguo tenía 6 armas; ahora hay 11 (5 de cuerpo a cuerpo nuevas)
  if (prog.own && prog.own.length === 6) { const o = prog.own, a = prog.ammo || []; prog.own = [o[0], false, false, false, false, false, o[1], o[2], o[3], o[4], o[5]]; prog.ammo = [0, 0, 0, 0, 0, 0, a[1] || 0, a[2] || 0, a[3] || 0, a[4] || 0, a[5] || 0]; }
  let P, cars, peds, drones, bullets, pickups, objs, birds, steam, bubbles, swings, mission, MI = prog.mi || 0, state = 'play', raf = 0, lastT = now(), hudT = 0, banner = null;
  let curBarrio = '', needLeave = false, talk = null, shop = null, route = [], routeT = 0, routeKey = '', street = '', streetT = 0, ambT = 0, waypoint = -1, poiLeave = null;
  const keys = {};
  const base = blockMid(1, 1);
  const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  const laneOpts = (tx, ty) => {
    const [rx, ry] = rr(tx, ty), o = [];
    if (rx < 2) o.push(rx === 0 ? 1 : 3);
    if (ry < 2) o.push(ry === 0 ? 2 : 0);
    return o.filter(d => at(tx + DIRS[d][0], ty + DIRS[d][1]) === 0);
  };
  const roadTiles = [], walkTiles = [], plazaTiles = [];
  for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) {
    const t = at(tx, ty);
    if (t === 0 && laneOpts(tx, ty).length === 1) roadTiles.push([tx, ty]);
    if (t === 1) walkTiles.push([tx, ty]);
    if (t === 6 || t === 3 || t === 7) plazaTiles.push([tx, ty]);
  }
  const offscreen = (x, y, pad = 40) => Math.abs(x - P.x) > VW / 2 + pad || Math.abs(y - P.y) > VH / 2 + pad;
  // una sola amenaza de la banda a la vez: si gritan todos, no se lee nada
  const bubble = (e, txt, kind = '') => { if (!e || bubbles.some(b => b.e === e || (kind === 'bad' && b.kind === 'bad'))) return; bubbles.push({ e, txt, kind, t: now(), dur: 2600 + txt.length * 40 }); if (bubbles.length > 5) bubbles.shift(); };
  const makeCar = (type, x, y, ang, extra = {}) => {
    const T2 = CAR_T[type], c = { x, y, ang, speed: 0, type, kind: type === 'soc' ? 'soc' : type === 'exfil' ? 'van' : 'civ', col: type === 'taxi' ? '#facc15' : type === 'soc' ? '#1e293b' : type === 'exfil' ? '#111111' : type === 'armored' ? '#3f4652' : pickOne(CAR_COLS),
      eng: 0, arm: 0, turbo: false, neon: null, nitro: 1, ai: null, drv: false, wait: 0, sig: null, ...extra };
    c.max = c.hp = Math.round(T2.hp * (1 + .4 * c.arm)); cars.push(c); return c;
  };
  const spawnCar = (kind = 'civ', far = true) => {
    for (let k = 0; k < 40; k++) {
      const [tx, ty] = pickOne(roadTiles), x = tx * TW + 8, y = ty * TW + 8;
      if (far && !offscreen(x, y)) continue;
      if (cars.some(c => Math.hypot(c.x - x, c.y - y) < 26)) continue;
      const dir = laneOpts(tx, ty)[0], r = Math.random();
      const type = kind === 'soc' ? 'soc' : kind === 'van' ? 'exfil' : r < .5 ? 'sedan' : r < .64 ? 'taxi' : r < .74 ? 'sport' : r < .86 ? 'van' : r < .96 ? 'offroad' : 'armored';
      return makeCar(type, x, y, dir * Math.PI / 2, { tx, ty, dir, ai: kind === 'soc' ? 'chase' : 'lane', drv: true });
    }
    return null;
  };
  const spawnPed = (kind = 'civ', x, y) => {
    if (x === undefined) for (let k = 0; k < 30; k++) { const [tx, ty] = pickOne(kind === 'jog' ? plazaTiles : walkTiles); x = tx * TW + 8; y = ty * TW + 8; if (offscreen(x, y)) break; }
    const persona = kind === 'civ' ? pickOne(PERSONA_POOL) : null, pp = persona && PERSONAS[persona];
    const pal = PAL[kind] || { s: pp && pp.old ? '#78716c' : pickOne(SHIRTS), h: pp && pp.old ? '#e5e7eb' : pp && pp.cam ? '#fbbf24' : pickOne(HAIRS), k: pickOne(SKINS) };
    if (persona === 'valiente') pal.s = '#1f2937';
    const p = { x, y, ang: Math.random() * 6.28, kind, persona, pal, hp: kind === 'boss' ? 650 : kind === 'gang' ? 40 : persona === 'valiente' ? 45 : 20, cd: Math.random(), flee: 0, tgt: null, stopT: 0, stun: 0 };
    p.max = p.hp; peds.push(p); return p;
  };
  const spawnBirds = (far = true) => {
    for (let k = 0; k < 20; k++) {
      const [tx, ty] = pickOne(Math.random() < .5 ? plazaTiles : walkTiles), x = tx * TW + 8, y = ty * TW + 8;
      if (far && !offscreen(x, y)) continue;
      for (let i = 0; i < rnd(3, 6); i++) birds.push({ x: x + rnd(-10, 10), y: y + rnd(-10, 10), fly: 0, vx: 0, vy: 0, ph: Math.random() * 6 });
      return;
    }
  };
  // Autos comprados: aparcados en el refugio con sus mejoras
  const parkOwned = () => {
    (prog.cars || []).forEach((oc, i) => makeCar(oc.type, base.x - 40 + (i % 4) * 26, base.y + 46 + Math.floor(i / 4) * 16, 0, { col: oc.col, eng: oc.eng || 0, arm: oc.arm || 0, turbo: !!oc.turbo, neon: oc.neon || null, owned: i }));
  };
  const saveCar = c => { if (c.owned === undefined || !prog.cars || !prog.cars[c.owned]) return; prog.cars[c.owned] = { type: c.type, col: c.col, eng: c.eng, arm: c.arm, turbo: c.turbo, neon: c.neon }; persist(); };

  const reset = (keepProgress = true) => {
    if (!keepProgress) { prog = {}; MI = 0; }
    P = { x: base.x, y: base.y + 40, ang: -Math.PI / 2, hp: 100, armor: prog.armor || 0, car: null, w: 0, cd: 0, cash: prog.cash || 0, heat: 0, lastCrime: -99, kills: 0, fl: 0,
      own: [...(prog.own || [true, false, false, false, false, false, false, false, false, false, false])], ammo: [...(prog.ammo || Array(11).fill(0))] };
    cars = []; peds = []; drones = []; bullets = []; pickups = []; objs = []; birds = []; steam = []; bubbles = []; swings = []; mission = null; state = 'play'; banner = null; talk = null; shop = null; dlg.hidden = true;
    cv.hidden = hud.hidden = false;
    size();
    for (let i = 0; i < 38; i++) spawnCar('civ', false);
    for (let i = 0; i < 56; i++) spawnPed('civ');
    for (let i = 0; i < 5; i++) spawnPed('jog');
    for (let i = 0; i < 6; i++) spawnBirds(false);
    const nodo = spawnPed('nodo', base.x, base.y - 12); nodo.name = 'Nodo'; nodo.fixed = true;
    for (let i = 0; i < 3; i++) { const r = spawnPed('res', base.x + rnd(-30, 30), base.y + rnd(-20, 20)); r.fixed = true; }
    for (const poi of POI) { const c = spawnPed('clerk', poi.x + 12, poi.y - 2); c.fixed = true; c.clerk = poi.k; }
    for (let i = 0; i < 6; i++) { const p = inter(rnd(4, 10), rnd(5, 8)); for (let j = 0; j < 3; j++) spawnPed('gang', p.x + rnd(-20, 20), p.y + rnd(-20, 20)); } // patrullas lejos del refugio
    for (let i = 0; i < 10; i++) { const [tx, ty] = pickOne(walkTiles); pickups.push({ x: tx * TW + 8, y: ty * TW + 8, k: pickOne(['hp', 'cash', 'ammo', 'cash', 'cash']) }); }
    parkOwned();
    const guns = P.own.map((o, i) => o && i >= GUN0 && P.ammo[i] > 0 ? i : -1).filter(i => i >= 0);
    P.w = guns.length ? guns[guns.length - 1] : P.own.lastIndexOf(true);
    say(MI < CITY_MISSIONS.length ? 'Ciudad Zero-Day. Sigue la ruta verde hasta Nodo. WASD mover · Espacio atacar · E acción (hablar, auto, continuar) · Q arma · M destino · Mayús turbo.' : 'Ciudad liberada. Pasea, compra y mejora autos: te lo ganaste.');
  };
  const persist = () => { prog = { ...prog, mi: MI, cash: P.cash, own: [...P.own], ammo: [...P.ammo], armor: Math.round(P.armor) }; store.set('city', JSON.stringify(prog)); };

  // ---------- Diálogos ----------
  const showDialog = (lines, onEnd) => { talk = { lines, i: 0, onEnd }; state = 'talk'; for (const k in keys) keys[k] = false; renderDialog(); };
  const renderDialog = () => {
    const [who, txt] = talk.lines[talk.i];
    dlg.hidden = false;
    dlg.innerHTML = `<b class="city-who">${esc(who)}</b><span class="rv" style="--dur:${Math.min(1.4, .3 + txt.length * .012).toFixed(2)}s;--st:${Math.min(60, txt.length)}">${esc(txt)}</span><small>${touch ? 'toca «acción»' : 'E, Enter o Espacio'} para continuar · ${talk.i + 1}/${talk.lines.length}</small>`;
  };
  const advance = () => {
    if (++talk.i < talk.lines.length) return renderDialog();
    dlg.hidden = true; const f = talk.onEnd; talk = null; state = 'play'; if (f) f();
  };

  // ---------- Tiendas ----------
  const shopItems = k => {
    const pay = (price, fn) => () => { if (P.cash < price) { say(`Te faltan ${price - P.cash} ₿.`); return; } P.cash -= price; fn(); persist(); burst(fx, P.x, P.y, '#f2b33d', 10); };
    if (k === 'armeria') {
      const list = [];
      CITY_W.forEach((w, i) => {
        if (!w.price) return;
        if (!P.own[i]) list.push({ label: w.n, price: w.price, desc: w.x, buy: pay(w.price, () => { P.own[i] = true; if (!w.melee) P.ammo[i] += w.ammo; P.w = i; say(`Compras ${w.n}. Ya la tienes en la mano.`); }) });
        else if (!w.melee) list.push({ label: `munición: ${w.n}`, price: w.ap, desc: `+${Math.ceil(w.ammo / 2)} disparos (tienes ${P.ammo[i]})`, buy: pay(w.ap, () => { P.ammo[i] += Math.ceil(w.ammo / 2); say(`Munición para ${w.n}.`); }) });
      });
      list.push({ label: 'chaleco antibalas', price: 250, desc: `Absorbe el 70% del daño hasta gastarse (tienes ${Math.round(P.armor)}%).`, buy: pay(250, () => { P.armor = 100; say('Te pones el chaleco. Pesa, pero salva.'); }) });
      list.push({ label: 'botiquín', price: 60, desc: '+50 de vida al momento.', buy: pay(60, () => { P.hp = Math.min(100, P.hp + 50); say('Te vendas como puedes: +50 de vida.'); }) });
      return list;
    }
    if (k === 'lot') return ['sport', 'offroad', 'armored', 'sedan', 'taxi'].map(t => ({ label: CAR_T[t].n, price: CAR_T[t].price, desc: CAR_T[t].x || `${CAR_T[t].hp} de vida · ${Math.round(CAR_T[t].max * .6)} km/h`,
      buy: pay(CAR_T[t].price, () => {
        prog.cars = prog.cars || []; const col = t === 'taxi' ? '#facc15' : t === 'armored' ? '#3f4652' : pickOne(PAINTS);
        prog.cars.push({ type: t, col, eng: 0, arm: 0, turbo: false, neon: null });
        const c = makeCar(t, door(5, 1).x, door(5, 1).y + 26, 0, { col, owned: prog.cars.length - 1 });
        say(`Compras un ${CAR_T[t].n}. Te espera frente al concesionario y quedará aparcado en el refugio.`); fx.rings.push({ x: c.x, y: c.y, r: 30, col: '#22d3ee', t: now() });
      }) }));
    if (k === 'taller') {
      const c = P.car;
      if (!c) return [{ label: 'sin auto', price: 0, desc: 'Entra al taller conduciendo un auto para mejorarlo.', buy: () => say('Vuelve con un auto.') }];
      const L = [{ label: 'reparar', price: 40, desc: `Vida del auto: ${Math.round(c.hp)}/${c.max}`, buy: pay(40, () => { c.hp = c.max; c.dead = false; say('Como nuevo. Bueno, casi.'); }) }];
      if (c.eng < 3) L.push({ label: `motor nivel ${c.eng + 1}`, price: 300 * (c.eng + 1), desc: '+12% de velocidad y aceleración.', buy: pay(300 * (c.eng + 1), () => { c.eng++; say(`Motor nivel ${c.eng}: ruge más que un servidor sin ventilación.`); saveCar(c); }) });
      if (c.arm < 3) L.push({ label: `blindaje nivel ${c.arm + 1}`, price: 350 * (c.arm + 1), desc: '+40% de vida del auto.', buy: pay(350 * (c.arm + 1), () => { c.arm++; const k2 = c.hp / c.max; c.max = Math.round(CAR_T[c.type].hp * (1 + .4 * c.arm)); c.hp = Math.round(c.max * k2); say(`Blindaje nivel ${c.arm}.`); saveCar(c); }) });
      if (!c.turbo) L.push({ label: 'turbo nitro', price: 800, desc: 'Mantén Mayús (o «turbo») para acelerar a fondo. Se recarga solo.', buy: pay(800, () => { c.turbo = true; say('Turbo instalado. Mayús para usarlo.'); saveCar(c); }) });
      L.push({ label: 'neón bajo el chasis', price: 150, desc: `Color: ${c.neon ? 'cambia al siguiente' : 'instala el primero'}.`, buy: pay(150, () => { c.neon = NEONS[(NEONS.indexOf(c.neon) + 1) % NEONS.length]; say('Neón instalado. Discreción: cero.'); saveCar(c); }) });
      L.push({ label: 'pintura nueva', price: 100, desc: 'Cambia de color (y despista un poco al SOC).', buy: pay(100, () => { c.col = PAINTS[(PAINTS.indexOf(c.col) + 1) % PAINTS.length]; P.heat = Math.max(0, P.heat - 1); say('Pintura nueva. El SOC te pierde un poco la pista.'); saveCar(c); }) });
      if (c.owned === undefined) L.push({ label: 'aviso', price: 0, desc: 'Este auto no es tuyo: las mejoras se pierden si lo dejas. Cómpralo en AutoHash para conservarlo.', buy: () => {} });
      return L;
    }
    if (k === 'market') return [['gallo pinto', 10, 20, 'Arroz, frijoles y energía para toda la noche.'], ['casado', 18, 35, 'El plato completo: el que te deja como nuevo.'], ['chifrijo', 15, 28, 'Chicharrón, frijoles y pico de gallo. Pura vida.'], ['agua de pipa', 8, 15, 'Hidratación natural, directo del coco.'], ['café chorreado', 6, 10, 'Recién chorreado, como en casa de la abuela.']]
      .map(([n2, pr, hp, d]) => ({ label: n2, price: pr, desc: `+${hp} de vida · ${d}`, buy: pay(pr, () => { P.hp = Math.min(100, P.hp + hp); say(`Te comes un ${n2}: +${hp} de vida. ¡Qué rico, mae!`); }) }));
    if (k === 'bar') return [
      { label: 'café negro', price: 5, desc: '+10 de vida y los ojos bien abiertos.', buy: pay(5, () => { P.hp = Math.min(100, P.hp + 10); say('Café negro. El camarero te guiña: «aquí nadie pregunta».'); }) },
      { label: 'escuchar rumores', price: 0, desc: 'Gratis: los hackers del bar siempre saben algo.', buy: () => { const left = PLACES.filter(pl => !(prog.visited || []).includes(pl.k)); const o = objective(); say(o && mission ? `Rumor: lo que buscas está por ${streetAt(o.pt.x, o.pt.y) || 'ahí'}.` : left.length ? `Rumor: deberías conocer ${pickOne(left).n}. Dicen que vale la pena.` : 'Rumor: ya conoces la ciudad mejor que nadie.'); } },
      { label: 'invitar una ronda', price: 25, desc: 'Nadie te delata esta noche: baja el rastreo.', buy: pay(25, () => { P.heat = Math.max(0, P.heat - 2); say('Brindis general. Si alguien vio algo, ya lo olvidó.'); }) },
    ];
    if (k === 'casino') return casinoItems();
    if (k === 'hospital') return [
      { label: 'curación completa', price: 50, desc: `Vida ${Math.round(P.hp)}/100.`, buy: pay(50, () => { P.hp = 100; say('La enfermera te deja como nuevo y te recuerda actualizar el antivirus.'); }) },
      { label: 'vacuna antiphishing', price: 0, desc: 'Gratis: «Si te meten prisa, desconfía». No cura, pero ayuda.', buy: () => say('Enfermera: «Y no abra adjuntos raros, ¿eh?»') },
    ];
    return [];
  };
  const openShop = poi => { shop = { poi, i: 0, bet: shop && shop.bet || 1 }; state = 'shop'; for (const k in keys) keys[k] = false; if (P.car) P.car.speed = 0; renderShop(); };
  const closeShop = () => { shop = null; state = 'play'; dlg.hidden = true; poiLeave = POI.findIndex(p => dist(p, P) < 20); };
  const renderShop = () => {
    const items = [...shopItems(shop.poi.k), { label: 'salir', price: 0, desc: '', buy: closeShop }];
    shop.i = clamp(shop.i, 0, items.length - 1); shop.items = items;
    dlg.hidden = false;
    dlg.innerHTML = `<b class="city-who">${esc(shop.poi.n)}</b><small>Tienes <b>${P.cash} ₿</b></small>${shop.show ? `<pre class="casino-show">${shop.show}</pre>` : ''}<ul class="city-shop">${items.map((it, i) => `<li data-i="${i}" class="${i === shop.i ? 'on' : ''}${it.price > P.cash ? ' off' : ''}"><span>${esc(it.label)}</span><b>${it.price ? it.price + ' ₿' : ''}</b>${it.desc ? `<em>${esc(it.desc)}</em>` : ''}</li>`).join('')}</ul><small>${touch ? 'Toca un artículo para comprarlo' : '↑↓ elegir · E o Enter comprar · Q o Esc salir'}</small>`;
    dlg.querySelectorAll('li').forEach(li => li.addEventListener('click', e => { e.stopPropagation(); shop.i = +li.dataset.i; buy(); }));
  };
  const buy = () => { if (shop.busy) return; const it = shop.items[shop.i]; it.buy(); if (shop) renderShop(); };

  // ---------- Casino Bit Royale: tragamonedas, ruleta, carrera de bots y tragamonedas de autos (la casa siempre gana… casi) ----------
  const BETS = [10, 50, 100, 500];
  const casinoItems = () => {
    const bet = BETS[shop.bet];
    return [
      { label: `apuesta: ${bet} ₿ (cambiar)`, price: 0, desc: 'Elige cuánto apostar en los juegos de abajo.', buy: () => { shop.bet = (shop.bet + 1) % BETS.length; } },
      { label: 'tragamonedas Hash', price: bet, desc: 'Tres iguales ×8 · tres 7 ×25 · dos iguales ×1,5.', buy: () => casino('slots') },
      { label: 'ruleta: rojo', price: bet, desc: 'Impares rojos. Paga ×2.', buy: () => casino('roul', 'rojo') },
      { label: 'ruleta: negro', price: bet, desc: 'Pares negros. Paga ×2.', buy: () => casino('roul', 'negro') },
      { label: 'ruleta: verde (0)', price: bet, desc: 'Solo el cero. Paga ×30.', buy: () => casino('roul', 'verde') },
      ...['Bot-404 (favorito)', 'Bot-Ping', 'Bot-Sudo', 'Bot-Glitch (sorpresa)'].map((n2, i) => ({ label: `carrera: ${n2}`, price: bet, desc: `Paga ×${[2.2, 3.3, 4.4, 6.6][i]}.`, buy: () => casino('race', i) })),
      { label: 'tragamonedas de autos', price: 200, desc: 'Tres autos iguales: ¡te lo llevas! Dos iguales te devuelven la apuesta.', buy: () => casino('cars') },
    ];
  };
  const casino = (game, choice) => {
    const bet = game === 'cars' ? 200 : BETS[shop.bet];
    if (P.cash < bet) { say(`Necesitas ${bet} ₿ para jugar.`); return; }
    P.cash -= bet; shop.busy = true;
    let f = 0;
    const done = (txt, win, car) => { if (win) { P.cash += win; burst(fx, P.x, P.y, '#facc15', 20); } shop.show = txt + (car ? '' : win ? `\n<b class="g-ok">+${win} ₿</b>` : '\n<span class="g-bad">la casa gana</span>'); shop.busy = false; persist(); say(car ? `Casino: ¡ganas un ${car}!` : win ? `Casino: ganas ${win} ₿.` : 'Casino: esta vez gana la casa. Como el ransomware.'); if (shop) renderShop(); };
    const tick = (fn, n, ms) => { const id = setInterval(() => { if (!shop) return clearInterval(id); f++; fn(f); if (shop) renderShop(); if (f >= n) clearInterval(id); }, ms); };
    if (game === 'slots' || game === 'cars') {
      const SYM = game === 'slots' ? ['7', 'BTC', 'RAM', '404', 'SSH', 'CPU'] : ['DEP', '4x4', 'BLI', 'TAX', 'SED', '---'], W = game === 'slots' ? [1, 3, 4, 4, 4, 4] : [3, 3, 2, 4, 4, 4];
      const roll = () => { let r = Math.random() * W.reduce((a, b) => a + b), i = 0; while ((r -= W[i]) > 0) i++; return SYM[i]; };
      const res = [roll(), roll(), roll()];
      tick(n => {
        const shown = res.map((x, i) => n < 6 + i * 4 ? pickOne(SYM) : x);
        shop.show = `[ ${shown.map(x => x.padEnd(3)).join(' | ')} ]`;
        if (n < 14) return;
        const same3 = res[0] === res[1] && res[1] === res[2], same2 = !same3 && (res[0] === res[1] || res[1] === res[2] || res[0] === res[2]);
        if (game === 'slots') return done(shop.show, same3 ? bet * (res[0] === '7' ? 25 : 8) : same2 ? Math.round(bet * 1.5) : 0);
        const CAR = { DEP: 'sport', '4x4': 'offroad', BLI: 'armored', TAX: 'taxi', SED: 'sedan' };
        if (same3 && CAR[res[0]]) {
          const t2 = CAR[res[0]]; prog.cars = prog.cars || []; const col = t2 === 'taxi' ? '#facc15' : t2 === 'armored' ? '#3f4652' : pickOne(PAINTS);
          prog.cars.push({ type: t2, col, eng: 0, arm: 0, turbo: false, neon: null });
          const c = makeCar(t2, P.x + 30, P.y + 22, 0, { col, owned: prog.cars.length - 1 }); fx.rings.push({ x: c.x, y: c.y, r: 40, col: '#facc15', t: now() });
          banner = { txt: '¡PREMIO MAYOR!', sub: `Ganas un ${CAR_T[t2].n}`, t: now(), ok: true };
          return done(`${shop.show}\n<b class="g-ok">¡Ganas un ${CAR_T[t2].n}! Te espera en la puerta.</b>`, 0, CAR_T[t2].n);
        }
        return done(shop.show, same2 && !res.includes('---') ? bet : 0);
      }, 14, 80);
    } else if (game === 'roul') {
      const n0 = rnd(0, 36), col = n0 === 0 ? 'verde' : n0 % 2 ? 'rojo' : 'negro';
      tick(n => {
        const k = n < 16 ? rnd(0, 36) : n0, c2 = k === 0 ? 'verde' : k % 2 ? 'rojo' : 'negro';
        shop.show = `ruleta → <b class="${c2 === 'rojo' ? 'g-bad' : c2 === 'verde' ? 'g-ok' : ''}">${String(k).padStart(2)} ${c2}</b>`;
        if (n >= 16) done(shop.show + ` · apostaste a ${choice}`, choice === col ? bet * (col === 'verde' ? 30 : 2) : 0);
      }, 16, 90);
    } else {
      const PR = [.4, .27, .2, .13], PAY = [2.2, 3.3, 4.4, 6.6], NAMES = ['Bot-404', 'Bot-Ping', 'Bot-Sudo', 'Bot-Glitch'];
      let r = Math.random(), win = 0; while ((r -= PR[win]) > 0 && win < 3) win++;
      const pos = [0, 0, 0, 0];
      tick(n => {
        for (let i = 0; i < 4; i++) pos[i] = Math.min(i === win ? 20 : 19, pos[i] + Math.random() * 1.6 + (i === win ? .35 : 0));
        if (n === 18) pos[win] = 20;
        shop.show = NAMES.map((nm, i) => `${nm.padEnd(10)} ${'█'.repeat(Math.round(pos[i])).padEnd(20, '·')}${pos[i] >= 20 ? ' ◀ META' : ''}`).join('\n');
        if (n >= 18) done(shop.show + `\ngana ${NAMES[win]}`, choice === win ? Math.round(bet * PAY[win]) : 0);
      }, 18, 110);
    }
  };

  // ---------- Combate ----------
  const crime = v => { P.heat = Math.min(5.99, P.heat + v); P.lastCrime = gameT; };
  const scare = (b, x, y) => { const a = Math.atan2(b.y - y, b.x - x) + (Math.random() - .5); b.fly = 1; b.vx = Math.cos(a) * rnd(60, 90); b.vy = Math.sin(a) * rnd(60, 90) - 20; };
  const alarm = (x, y, r = 150) => {
    peds.forEach(p => {
      if (p.kind !== 'civ' || p.fixed || p.aggro > gameT) return;
      const d = Math.hypot(p.x - x, p.y - y), pp = PERSONAS[p.persona];
      if (d > r || (pp.phone && d > 60)) return;
      if (pp.film && d > 50 && !(p.film > gameT)) { p.film = gameT + 6; p.filmAt = { x, y }; bubble(p, pickOne(FILM_LINES)); return; }
      if (p.flee <= 0 && Math.random() < .3) bubble(p, pickOne(FLEE_LINES));
      p.flee = 3; p.from = { x, y };
    });
    birds.forEach(b => { if (!b.fly && Math.hypot(b.x - x, b.y - y) < r) scare(b, x, y); });
  };
  const killPed = (p, byPlayer) => {
    peds.splice(peds.indexOf(p), 1);
    burst(fx, p.x, p.y, p.kind === 'civ' ? '#e2b48c' : p.kind === 'boss' ? '#f0abfc' : '#f87171', p.kind === 'boss' ? 50 : 12);
    if (!byPlayer) return;
    if (p.kind === 'gang' || p.kind === 'boss') { P.kills++; if (Math.random() < .6) pickups.push({ x: p.x, y: p.y, k: pickOne(['cash', 'cash', 'ammo', 'hp']) }); }
    else { crime(1); say('Un civil cae. El SOC te tiene en la mira.'); }
    if (p.kind === 'boss') bossDown();
  };
  const hurtPed = (p, d, byPlayer = true, stun = 0) => {
    if (p.kind === 'nodo' || p.fixed) return;
    p.hp -= d; p.fl = now(); if (stun) p.stun = gameT + stun;
    fx.floats.push({ x: p.x, y: p.y - 6, txt: `−${Math.round(d)}`, col: '#fde68a', t: now() });
    if (p.kind === 'civ' || p.kind === 'jog') {
      if (byPlayer) crime(.15);
      const react = p.persona ? PERSONAS[p.persona].react : 'flee';
      if (byPlayer && (react === 'fight' || react === 'shoot') && p.hp > p.max * .35) { if (!(p.aggro > gameT)) bubble(p, pickOne(PERSONAS[p.persona].angry), 'bad'); p.aggro = gameT + 9; }
      else { p.aggro = 0; p.flee = 4; p.from = { x: P.x, y: P.y }; if (Math.random() < .4) bubble(p, pickOne(FLEE_LINES)); }
    } else if (p.kind === 'gang' || p.kind === 'boss') { if (!p.alert) bubble(p, p.kind === 'boss' ? '¿Vienes a pagar el rescate? El precio acaba de subir.' : pickOne(GANG_LINES), 'bad'); p.alert = true; }
    if (p.hp <= 0) killPed(p, byPlayer);
  };
  const explode = (x, y, r, d, byPlayer) => {
    fx.rings.push({ x, y, r: r * 1.4, col: '#fb923c', t: now() }); burst(fx, x, y, '#fb923c', 30); burst(fx, x, y, '#fde68a', 14); fx.shake = now();
    alarm(x, y, 200);
    for (const p of [...peds]) { const k = Math.hypot(p.x - x, p.y - y); if (k < r) hurtPed(p, d * (1 - k / r / 2), byPlayer); }
    for (const dr of [...drones]) if (Math.hypot(dr.x - x, dr.y - y) < r) hurtDrone(dr, d, byPlayer);
    for (const c of cars) if (!c.dead && Math.hypot(c.x - x, c.y - y) < r) hurtCar(c, d, byPlayer);
    for (const o of objs) if (o.hp > 0 && Math.hypot(o.x - x, o.y - y) < r) hurtObj(o, d);
    if (!P.car && Math.hypot(P.x - x, P.y - y) < r) hurtPlayer(d * (byPlayer ? .4 : .8));
  };
  const hurtCar = (c, d, byPlayer) => {
    if (c.dead) return;
    c.hp -= d * (c.type === 'armored' ? .55 : 1); c.fl = now();
    if (byPlayer && c.kind === 'civ' && c !== P.car && c.ai === 'lane') { c.ai = null; alarm(c.x, c.y, 80); }
    if (c.hp > 0) return;
    c.dead = true; c.speed = 0; c.deadT = gameT;
    if (byPlayer) { if (c.kind === 'civ' && c.owned === undefined) crime(.7); if (c.kind === 'soc') crime(.6); }
    if (c.owned !== undefined && prog.cars) { prog.cars.splice(c.owned, 1); cars.forEach(o => { if (o.owned > c.owned) o.owned--; }); say(`Tu ${CAR_T[c.type].n} queda destruido. Lo pierdes.`); persist(); }
    if (c.kind === 'van' && mission && mission.kind === 'van') missionDone();
    if (c === P.car) { P.car = null; P.x += 12; hurtPlayer(30); say('¡El auto explota contigo dentro!'); }
    explode(c.x, c.y, 40, 45, byPlayer);
  };
  const hurtDrone = (dr, d, byPlayer) => {
    dr.hp -= d; dr.fl = now();
    if (dr.hp > 0) return;
    drones.splice(drones.indexOf(dr), 1); burst(fx, dr.x, dr.y, '#22d3ee', 16);
    if (byPlayer) crime(.4);
  };
  const hurtObj = (o, d) => {
    if (o.hp <= 0) return;
    o.hp -= d; o.fl = now();
    if (o.hp <= 0) { burst(fx, o.x, o.y, o.k === 'rack' ? '#4ade80' : '#c084fc', 24); fx.rings.push({ x: o.x, y: o.y, r: 30, col: '#c084fc', t: now() }); say(o.k === 'rack' ? 'Rack destruido.' : 'Antena derribada.'); }
  };
  const hurtPlayer = d => {
    if (state !== 'play') return;
    if (P.car) { hurtCar(P.car, d * .6, false); return; }
    if (P.armor > 0) { const ab = Math.min(P.armor, d * .7); P.armor -= ab; d -= ab; }
    P.hp -= d; P.fl = now(); fx.shake = now(); fx.floats.push({ x: P.x, y: P.y - 6, txt: `−${Math.round(d)}`, col: '#f87171', t: now() });
    if (P.hp <= 0) die();
  };
  const hostile = p => p.kind === 'gang' || p.kind === 'boss' || p.aggro > gameT;
  const aim = () => {
    let best = null, bd = 190;
    const targets = [...peds.filter(hostile), ...drones, ...objs.filter(o => o.hp > 0), ...cars.filter(c => !c.dead && (c.kind === 'soc' || c.kind === 'van'))];
    for (const e of targets) { const d = dist(P, e), a = Math.atan2(e.y - P.y, e.x - P.x); if (d < bd && Math.abs(angDiff(P.ang, a)) < .55 && los(P, e)) { bd = d; best = a; } }
    return best ?? P.ang;
  };
  const fire = () => {
    const w = CITY_W[P.w];
    if (P.cd > 0) return;
    if (!w.melee && P.ammo[P.w] <= 0) { say(`Sin munición para ${w.n}. Compra más en la armería.`); P.w = P.own.slice(0, GUN0).lastIndexOf(true); return; }
    if (w.melee && P.car) return;
    P.cd = w.cd; if (!w.melee) P.ammo[P.w]--;
    const a = P.car ? P.car.ang : aim();
    if (!P.car) P.ang = a;
    alarm(P.x, P.y, w.melee ? 40 : 150);
    if (w.melee) { // golpe en arco: alcanza a todo lo que esté delante
      swings.push({ x: P.x, y: P.y, a, r: w.r, arc: w.arc, t: now(), col: P.w === 5 ? '#3ee8ff' : P.w === 4 ? '#facc15' : '#e5e7eb' });
      let hitAny = false;
      for (const e of [...peds, ...drones]) {
        if (e.fixed) continue;
        const d = dist(P, e), ea = Math.atan2(e.y - P.y, e.x - P.x);
        if (d > w.r + 4 || Math.abs(angDiff(a, ea)) > w.arc / 2) continue;
        hitAny = true;
        if (drones.includes(e)) hurtDrone(e, w.d, true);
        else { hurtPed(e, w.d, true, w.stun || 0); const k = 6; if (free(e.x + Math.cos(ea) * k, e.y + Math.sin(ea) * k, 3)) { e.x += Math.cos(ea) * k; e.y += Math.sin(ea) * k; } }
      }
      for (const o of objs) if (o.hp > 0 && dist(P, o) < w.r + 6) { hurtObj(o, w.d); hitAny = true; }
      if (hitAny) { fx.shake = now() - 140; burst(fx, P.x + Math.cos(a) * 10, P.y + Math.sin(a) * 10, '#e5e7eb', 5); }
      return;
    }
    const ox = P.x + Math.cos(a) * 9, oy = P.y + Math.sin(a) * 9;
    burst(fx, ox, oy, '#fde68a', 5);
    if (w.beam) {
      let end = { x: ox, y: oy };
      const hitSet = new Set();
      for (let s = 0; s < 240; s += 4) {
        const x = ox + Math.cos(a) * s, y = oy + Math.sin(a) * s; end = { x, y };
        if (tAt(x, y) === 2) break;
        for (const p of peds) if (!p.fixed && Math.hypot(p.x - x, p.y - y) < 6) hitSet.add(p);
        for (const dr of drones) if (Math.hypot(dr.x - x, dr.y - y) < 7) hitSet.add(dr);
        for (const c of cars) if (!c.dead && c !== P.car && Math.hypot(c.x - x, c.y - y) < 8) hitSet.add(c);
        for (const o of objs) if (o.hp > 0 && Math.hypot(o.x - x, o.y - y) < 9) hitSet.add(o);
      }
      fx.beams.push({ x1: ox, y1: oy, x2: end.x, y2: end.y, col: '#3ee8ff', t: now() });
      for (const e of hitSet) { if (peds.includes(e)) hurtPed(e, w.d, true); else if (drones.includes(e)) hurtDrone(e, w.d, true); else if (cars.includes(e)) hurtCar(e, w.d, true); else hurtObj(e, w.d); }
      return;
    }
    for (let i = 0; i < (w.pel || 1); i++) {
      const aa = a + (Math.random() - .5) * (w.spread || .04);
      bullets.push({ x: ox, y: oy, vx: Math.cos(aa) * w.sp, vy: Math.sin(aa) * w.sp, life: w.boom ? 1.4 : .75, d: w.d, own: 'p', boom: w.boom });
    }
  };
  const enemyShot = (from, ang, d = 7, sp = 220) => bullets.push({ x: from.x + Math.cos(ang) * 7, y: from.y + Math.sin(ang) * 7, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 1.2, d, own: 'e' });

  // ---------- Autos ----------
  const toggleCar = () => {
    if (P.car) {
      const c = P.car, ok = [[Math.PI / 2, 13], [-Math.PI / 2, 13], [Math.PI, 14], [0, 14]].map(([da, r]) => ({ x: c.x + Math.cos(c.ang + da) * r, y: c.y + Math.sin(c.ang + da) * r })).find(p => free(p.x, p.y, 4));
      if (!ok) return say('No hay sitio para bajarte aquí.');
      P.x = ok.x; P.y = ok.y; c.drv = false; c.ai = null; P.car = null;
      return say('Te bajas del auto.');
    }
    const c = cars.filter(c => !c.dead && dist(c, P) < 18).sort((a, b) => dist(a, P) - dist(b, P))[0];
    if (!c) return say('No hay nada cerca: acércate a una persona o a un auto y pulsa E.');
    if (c.kind === 'soc') return say('La furgoneta del SOC está blindada. Mejor huye.');
    if (c.kind === 'van') return say('La furgoneta va cerrada: destrúyela.');
    if (c.drv && c.owned === undefined) {
      const p = spawnPed('civ', c.x + Math.cos(c.ang + Math.PI / 2) * 12, c.y + Math.sin(c.ang + Math.PI / 2) * 12);
      if (PERSONAS[p.persona].react === 'fight' && Math.random() < .6) { p.aggro = gameT + 8; bubble(p, '¡Bájese de mi auto, sinvergüenza!', 'bad'); }
      else { p.flee = 5; p.from = { x: c.x, y: c.y }; bubble(p, pickOne(['¡Oiga, que es de leasing!', '¡Tengo el 2FA en ese teléfono!', '¡Mi auto no, mae!', '¡Lo voy a reportar al SOC!'])); }
      crime(.25);
    }
    c.drv = true; c.ai = 'player'; c.speed = 0; c.sig = null; P.car = c;
    say(`${c.owned !== undefined ? 'Tu' : 'Conduces un'} ${CAR_T[c.type].n}${c.eng ? ` (motor ${c.eng})` : ''}${c.turbo ? ' con turbo (Mayús)' : ''}. E para bajarte.`);
  };
  const drive = (c, thr, steer, dt, boost = false) => {
    const T2 = CAR_T[c.type], tile = tAt(c.x, c.y);
    let max = T2.max * (1 + .12 * c.eng), acc = T2.acc * (1 + .12 * c.eng);
    if (c.type !== 'offroad') { if (tile === 3 || tile === 6 || tile === 7) max *= .6; else if (tile === 1) max *= .85; } // el todoterreno no se frena fuera del asfalto
    if (boost && c.turbo && c.nitro > 0) { max *= 1.45; acc *= 2; c.nitro = Math.max(0, c.nitro - dt / 3); if (Math.random() < .7) burst(fx, c.x - Math.cos(c.ang) * 11, c.y - Math.sin(c.ang) * 11, Math.random() < .5 ? '#38bdf8' : '#f97316', 1); }
    else if (c.turbo) c.nitro = Math.min(1, c.nitro + dt / 8);
    if (thr) c.speed += thr * (Math.sign(thr) === Math.sign(c.speed) || !c.speed ? (thr > 0 ? acc : 140) : 420) * dt;
    else c.speed *= Math.pow(.4, dt);
    if (c.speed > max) c.speed = Math.max(max, c.speed - 300 * dt);
    c.speed = clamp(c.speed, -80, T2.max * 1.6);
    c.ang += steer * 2.9 * dt * Math.min(1, Math.abs(c.speed) / 70) * Math.sign(c.speed || 1);
    const nx = c.x + Math.cos(c.ang) * c.speed * dt, ny = c.y + Math.sin(c.ang) * c.speed * dt;
    if (free(nx, ny, 5)) { c.x = nx; c.y = ny; }
    else {
      if (Math.abs(c.speed) > 110) { hurtCar(c, Math.abs(c.speed) * .06, false); burst(fx, nx, ny, '#fde68a', 6); if (c === P.car) fx.shake = now(); }
      if (free(nx, c.y, 5)) c.x = nx; else if (free(c.x, ny, 5)) c.y = ny; else c.speed *= -.3;
      c.speed *= .7;
    }
  };
  const laneCar = (c, dt) => {
    const sp = c.kind === 'van' ? 105 : c.type === 'sport' ? 68 : 55;
    const fx0 = DIRS[c.dir][0], fy0 = DIRS[c.dir][1];
    const blocker = [...cars, ...(P.car ? [] : [P])].find(o => o !== c && !o.dead && Math.hypot(o.x - c.x - fx0 * 15, o.y - c.y - fy0 * 15) < 11);
    const pedAhead = peds.some(p => Math.hypot(p.x - c.x - fx0 * 14, p.y - c.y - fy0 * 14) < 9);
    if ((blocker || pedAhead) && c.kind !== 'van') {
      c.speed = 0; c.wait += dt;
      if (c.wait > 3 && (blocker === P.car || blocker === P || pedAhead) && Math.random() < dt * .6) bubble(c, pickOne(HONKS), 'car');
      return;
    }
    const nx = (c.tx + fx0) * TW + 8, ny = (c.ty + fy0) * TW + 8, d = Math.hypot(nx - c.x, ny - c.y);
    if (d > TW - 1 && c.kind !== 'van') {
      const ax = c.tx + fx0, ay = c.ty + fy0, bx = ax + fx0, by = ay + fy0;
      if (!isInter(c.tx, c.ty) && !isInter(ax, ay) && isInter(bx, by)) {
        const ix = Math.floor((bx - 2) / BK), iy = Math.floor((by - 2) / BK);
        if (light(ix, iy, c.dir % 2 ? 'v' : 'h') !== 'g') { c.speed = 0; c.wait = 0; c.redLight = true; return; }
      }
    }
    c.redLight = false; c.wait = 0; c.speed = sp;
    const step = sp * dt;
    if (d <= step) {
      c.x = nx; c.y = ny; c.tx += fx0; c.ty += fy0;
      const o = laneOpts(c.tx, c.ty), old = c.dir;
      if (!o.length) c.dir = (c.dir + 2) % 4;
      else if (!(o.includes(c.dir) && Math.random() < .55)) c.dir = pickOne(o);
      if (c.dir !== old) c.sig = { right: (c.dir - old + 4) % 4 === 1, until: gameT + 1.4 };
    } else { c.x += (nx - c.x) / d * step; c.y += (ny - c.y) / d * step; }
    c.ang += angDiff(c.ang, c.dir * Math.PI / 2) * Math.min(1, dt * 12);
  };

  // ---------- Misiones ----------
  const M_PT = { 0: inter(4, 1), 1: inter(3, 7) };
  const missionIntro = i => ({
    0: [['Nodo', 'Por fin llegas. Soy Nodo, de la resistencia. Los Cifrados han secuestrado la red de toda la ciudad.'], ['Nodo', `Nuestra informante, Lía, te espera en ${interName(M_PT[0])}. Sigue la ruta amarilla y no llames la atención.`], ['Nodo', 'Con el dinero de las misiones podrás comprar armas en la armería y autos en AutoHash. Pulsa M para ver las tiendas.']],
    1: [['Nodo', `Lía confirmó que Los Cifrados guardan un pendrive con claves de descifrado en ${interName(M_PT[1])}.`], ['Nodo', 'Hay cuatro guardias. Toma el pendrive y vuelve aquí. En cuanto lo toques, sonarán todas sus alarmas.']],
    2: [['Nodo', `El pendrive tenía la dirección de su servidor de mando y control: la plaza roja del Puerto Industrial, entre ${AVS[8]} y ${AVS[9]}.`], ['Nodo', 'Destruye los tres racks antes de 100 segundos o migrarán a otro servidor. Un bate o una katana también sirven.']],
    3: [['Lía', '¡Una furgoneta negra con matrícula RW sale ahora mismo con datos robados del hospital!'], ['Lía', 'Necesitas un auto rápido: roba uno o usa el tuyo. Persíguela y destrúyela antes de 80 segundos.']],
    4: [['Nodo', 'Han montado cuatro antenas en las esquinas de la ciudad. Reparten el malware a cada teléfono.'], ['Nodo', 'Derríbalas todas, en el orden que quieras. Un todoterreno corta camino por los parques.']],
    5: [['Nodo', 'Es la hora. El jefe de Los Cifrados está en el muelle, al sureste, con toda su banda.'], ['Nodo', 'Pásate por la armería si te hace falta un chaleco. Si cae, sus claves maestras quedan libres para todos.']],
  }[i]);
  const missionOutro = i => ({
    1: [['Nodo', 'Las claves funcionan: media ciudad recupera sus archivos. Toma algo de dinero: gástalo bien.']],
    2: [['Nodo', 'Sin su C2, sus bots se quedan sordos. Llévate la escopeta DDoS: te hará falta.']],
    3: [['Lía', '¡La tienes! Los datos del hospital no saldrán de la ciudad. Toma el subfusil que le quitamos a un guardia.']],
    4: [['Nodo', 'Las antenas han caído y los teléfonos vuelven a ser de sus dueños. El lanzador EMP es tuyo.']],
  }[i]);
  const startMission = () => {
    const i = MI; mission = { i, kind: '', t0: gameT, time: 0 }; waypoint = -1;
    banner = { txt: `MISIÓN ${i + 1}: ${CITY_MISSIONS[i].t.toUpperCase()}`, t: now() };
    const guards = (p, n) => { for (let j = 0; j < n; j++) { const g = spawnPed('gang', p.x + rnd(-26, 26), p.y + rnd(-26, 26)); g.m = true; } };
    if (i === 0) { mission.kind = 'goto'; mission.pt = M_PT[0]; const l = spawnPed('lia', mission.pt.x + 14, mission.pt.y - 14); l.fixed = true; l.name = 'Lía'; l.m = true; }
    if (i === 1) { mission.kind = 'fetch'; const p = M_PT[1]; pickups.push({ x: p.x, y: p.y, k: 'drive', m: true }); mission.pt = p; guards(p, 4); }
    if (i === 2) { mission.kind = 'destroy'; mission.time = 100; const c = blockMid(8, 6); objs = [[-24, -16], [20, -10], [0, 22]].map(([dx, dy]) => ({ x: c.x + dx, y: c.y + dy, k: 'rack', hp: 90, max: 90 })); guards(c, 3); }
    if (i === 3) { mission.kind = 'van'; mission.time = 80; const v = spawnCar('van', false); mission.van = v; if (v) v.m = true; }
    if (i === 4) { mission.kind = 'destroy'; objs = [inter(0, 0), inter(NBX, 0), inter(0, NBY - 1), inter(NBX, NBY)].map(p => ({ x: p.x, y: p.y, k: 'tower', hp: 110, max: 110, bx: p.bx, by: p.by })); }
    if (i === 5) { mission.kind = 'boss'; const d = blockMid(10, 7); const b = spawnPed('boss', d.x, d.y); b.m = true; mission.boss = b; guards(d, 6); }
  };
  const REWARD = [[150, 6, 'pistola de ping'], [400, 0, ''], [500, 7, 'escopeta DDoS'], [600, 8, 'subfusil de fuerza bruta'], [800, 9, 'lanzador EMP'], [2000, 10, 'cañón de fibra']];
  const missionDone = () => {
    if (!mission) return;
    const i = mission.i, [cash, w, wn] = REWARD[i];
    P.cash += cash;
    if (w) { P.own[w] = true; P.ammo[w] += CITY_W[w].ammo; P.w = w; }
    P.ammo[6] += 20;
    banner = { txt: 'MISIÓN COMPLETADA', sub: `+${cash} ₿${wn ? ' · ' + wn : ''}`, t: now(), ok: true };
    say(`Misión completada: +${cash} ₿${wn ? `. Desbloqueas: ${wn}.` : '.'}`);
    burst(fx, P.x, P.y, '#4ade80', 30); fx.rings.push({ x: P.x, y: P.y, r: 60, col: '#4ade80', t: now() });
    MI++; objs = []; mission = null; needLeave = true; persist();
    peds = peds.filter(p => p.kind !== 'lia');
    if (MI >= CITY_MISSIONS.length) setTimeout(victory, 1600);
    else { const o = missionOutro(i); if (o) setTimeout(() => { if (state === 'play') showDialog(o); }, 900); }
  };
  const missionFail = why => {
    say(`Misión fallida: ${why} Vuelve al refugio para reintentarlo.`); banner = { txt: 'MISIÓN FALLIDA', sub: why, t: now(), ok: false };
    peds = peds.filter(p => !p.m); cars = cars.filter(c => !c.m); pickups = pickups.filter(p => !p.m); objs = []; mission = null;
  };
  const bossDown = () => { say('El jefe de Los Cifrados cae. Sus claves quedan libres para todos.'); missionDone(); };
  const dests = () => [...POI, ...PLACES.filter(pl => !(prog.visited || []).includes(pl.k) && !POI.some(q => q.k === pl.k || (pl.k === 'mercado' && q.k === 'market')))];
  const objective = () => {
    if (!mission && waypoint >= 0) { const p = dests()[waypoint]; if (p) return { pt: p, txt: `Destino: ${p.n}`, col: p.col || '#f472b6' }; }
    if (!mission) return MI < CITY_MISSIONS.length ? { pt: base, txt: 'Ve al refugio y habla con Nodo', col: '#4ade80' } : null;
    const k = mission.kind, col = '#f2b33d';
    if (k === 'goto') return { pt: mission.pt, txt: `Reúnete con Lía en ${interName(mission.pt)}`, col };
    if (k === 'fetch') return { pt: mission.pt, txt: `Recupera el pendrive en ${interName(mission.pt)}`, col };
    if (k === 'return') return { pt: base, txt: 'Vuelve al refugio con el pendrive', col };
    if (k === 'destroy') {
      const left = objs.filter(o => o.hp > 0).sort((a, b) => dist(a, P) - dist(b, P)), o = left[0];
      if (!o) return null;
      return { pt: o, txt: o.k === 'rack' ? `Destruye los racks del C2 (quedan ${left.length})` : `Derriba la antena de ${interName(o)} (quedan ${left.length})`, col };
    }
    if (k === 'van') return mission.van && !mission.van.dead ? { pt: mission.van, txt: P.car ? 'Persigue y destruye la furgoneta RW' : 'Consigue un auto (E) y persigue la furgoneta RW', col: '#f87171' } : null;
    if (k === 'boss') return mission.boss ? { pt: mission.boss, txt: 'Acaba con el jefe de Los Cifrados en el muelle', col: '#f87171' } : null;
  };
  const missionUpdate = () => {
    // tiendas: entrar en la puerta abre el menú (una vez por visita)
    const pi = POI.findIndex(p => dist(p, P) < 12);
    if (pi !== poiLeave) { poiLeave = null; if (pi >= 0 && (POI[pi].k === 'taller' ? !!P.car : !P.car || POI[pi].k === 'hospital')) { if (waypoint === pi) waypoint = -1; return openShop(POI[pi]); } }
    if (pi >= 0 && POI[pi].k === 'taller' && !P.car && poiLeave === null) { poiLeave = pi; say('El taller trabaja con autos: vuelve conduciendo uno.'); }
    if (pi >= 0 && POI[pi].k !== 'taller' && POI[pi].k !== 'hospital' && P.car && poiLeave === null) { poiLeave = pi; say(`Bájate del auto para entrar en ${POI[pi].n}.`); }
    if (!mission) {
      if (dist(P, base) > 30) needLeave = false; // tras entregar una misión hay que salir del círculo y volver a entrar
      if (MI < CITY_MISSIONS.length && dist(P, base) < 16 && !P.car && !needLeave) { const i = MI; showDialog(missionIntro(i), startMission); }
      return;
    }
    if (mission.time && gameT - mission.t0 > mission.time) return missionFail(mission.kind === 'van' ? 'los datos salieron de la ciudad.' : 'se acabó el tiempo.');
    if (mission.kind === 'goto' && dist(P, mission.pt) < 24) {
      mission.kind = 'talking';
      showDialog([['Lía', '¿Eres el nuevo? Tranquilo: aquí nadie mira, todos van con la cabeza en el teléfono.'], ['Lía', 'Toma esta pistola de ping. Hace ruido pero funciona. Y recuerda: el SOC persigue a quien hace daño a civiles.']], missionDone);
    }
    else if (mission.kind === 'return' && dist(P, base) < 18) { say('Entregas el pendrive a Nodo.'); missionDone(); }
    else if (mission.kind === 'destroy' && objs.length && objs.every(o => o.hp <= 0)) missionDone();
  };

  const computeRoute = goal => {
    const sx = Math.floor(P.x / TW), sy = Math.floor(P.y / TW), gx = Math.floor(goal.x / TW), gy = Math.floor(goal.y / TW);
    const ok = (x, y) => { const t = at(x, y); return P.car ? t === 0 || t === 1 || t === 3 || t === 6 : !solid(t); };
    const prev = new Int32Array(MW * MH).fill(-1), q = [sy * MW + sx]; prev[sy * MW + sx] = sy * MW + sx;
    for (let h = 0; h < q.length; h++) {
      const c = q[h], cx = c % MW, cy = (c / MW) | 0;
      if (cx === gx && cy === gy) break;
      for (const [dx, dy] of DIRS) { const nx = cx + dx, ny = cy + dy, n = ny * MW + nx; if (nx < 0 || ny < 0 || nx >= MW || ny >= MH || prev[n] !== -1 || (!ok(nx, ny) && !(nx === gx && ny === gy))) continue; prev[n] = c; q.push(n); }
    }
    const end = gy * MW + gx; if (prev[end] === -1) return [];
    const path = []; for (let c = end; c !== sy * MW + sx; c = prev[c]) path.push(c);
    return path.reverse().map(c => ({ x: (c % MW) * TW + 8, y: ((c / MW) | 0) * TW + 8 }));
  };
  const compass = a => ['este', 'sureste', 'sur', 'suroeste', 'oeste', 'noroeste', 'norte', 'noreste'][((Math.round(a / (Math.PI / 4)) % 8) + 8) % 8];

  // ---------- Bucle ----------
  const update = dt => {
    gameT += dt; P.cd = Math.max(0, P.cd - dt);
    const ix = (keys.right ? 1 : 0) - (keys.left ? 1 : 0), iy = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
    if (P.car) {
      drive(P.car, -iy, ix, dt, keys.nitro);
      P.x = P.car.x; P.y = P.car.y; P.ang = P.car.ang;
    } else if (ix || iy) {
      const l = Math.hypot(ix, iy), sp = 78 * dt;
      P.ang = Math.atan2(iy, ix);
      const nx = P.x + ix / l * sp, ny = P.y + iy / l * sp;
      if (free(nx, P.y, 4)) P.x = nx;
      if (free(P.x, ny, 4)) P.y = ny;
      P.moving = true;
    } else P.moving = false;
    if (keys.fire) fire();

    for (const c of cars) {
      if (c.dead) continue;
      if (c.ai === 'lane') laneCar(c, dt);
      else if (c.ai === 'chase') {
        const tgt = P.car || P, a = Math.atan2(tgt.y - c.y, tgt.x - c.x), d = angDiff(c.ang, a);
        drive(c, dist(c, tgt) < 30 && Math.abs(d) > 1.5 ? -1 : 1, clamp(d * 2, -1, 1), dt);
      } else if (c !== P.car) drive(c, 0, 0, dt);
    }
    cars = cars.filter(c => !(c.dead && gameT - c.deadT > 12));
    for (let i = 0; i < cars.length; i++) {
      const a = cars[i]; if (a.dead) continue;
      for (let j = i + 1; j < cars.length; j++) {
        const b = cars[j]; if (b.dead) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 13 && d > 0) {
          const rel = Math.abs(a.speed - b.speed), nx = (a.x - b.x) / d, ny = (a.y - b.y) / d, push = (13 - d) / 2;
          if (a.ai !== 'lane' && free(a.x + nx * push, a.y + ny * push, 5)) { a.x += nx * push; a.y += ny * push; }
          if (b.ai !== 'lane' && free(b.x - nx * push, b.y - ny * push, 5)) { b.x -= nx * push; b.y -= ny * push; }
          if (rel > 70) {
            const byP = a === P.car || b === P.car, ka = b.type === 'armored' ? 2 : 1, kb = a.type === 'armored' ? 2 : 1; // el blindado reparte el doble
            hurtCar(a, rel * .08 * ka, byP); hurtCar(b, rel * .08 * kb, byP); burst(fx, (a.x + b.x) / 2, (a.y + b.y) / 2, '#fde68a', 6);
            if (byP) { fx.shake = now(); const v = a === P.car ? b : a; if (v.kind === 'civ' && v.owned === undefined) bubble(v, pickOne(['¡Mi auto nuevo!', '¡Aprenda a manejar!', '¿¡Qué le pasa, mae!?'])); }
          }
          for (const c of [a, b]) if (c.ai === 'lane' && c.kind === 'civ' && (a === P.car || b === P.car) && rel > 40) c.ai = null;
          if (a.ai !== 'lane') a.speed *= .5; if (b.ai !== 'lane') b.speed *= .5;
        }
      }
      if (Math.abs(a.speed) > 45) {
        for (const p of [...peds]) if (!p.fixed && Math.hypot(p.x - a.x, p.y - a.y) < 9) { hurtPed(p, p.kind === 'boss' ? 40 : 100, a === P.car); if (a === P.car) a.speed *= .8; }
        if (!P.car && a.ai !== 'lane' && Math.hypot(P.x - a.x, P.y - a.y) < 9) { hurtPlayer(a.kind === 'soc' ? 25 : 15); const k = Math.atan2(P.y - a.y, P.x - a.x); if (free(P.x + Math.cos(k) * 10, P.y + Math.sin(k) * 10, 4)) { P.x += Math.cos(k) * 10; P.y += Math.sin(k) * 10; } }
      }
      if (Math.abs(a.speed) > 30) for (const b of birds) if (!b.fly && Math.hypot(b.x - a.x, b.y - a.y) < 40) scare(b, a.x, a.y);
    }

    for (const p of [...peds]) {
      if (!peds.includes(p)) continue;
      const d = dist(p, P);
      if (p.stun > gameT) { p.moving = false; continue; }
      if (p.stopT > 0) { p.stopT -= dt; p.moving = false; p.ang = Math.atan2(P.y - p.y, P.x - p.x); continue; }
      if (p.fixed) { p.moving = false; if (d < 60) p.ang = Math.atan2(P.y - p.y, P.x - p.x); continue; }
      if (p.aggro > gameT) { // el vecino se defiende: a puñetazos o con su pistola
        const a = Math.atan2(P.y - p.y, P.x - p.x), shoot = PERSONAS[p.persona].react === 'shoot', keep = shoot ? 70 : 9;
        p.ang = a; p.moving = d > keep;
        if (d > keep) { const nx = p.x + Math.cos(a) * 48 * dt, ny = p.y + Math.sin(a) * 48 * dt; if (free(nx, p.y, 3)) p.x = nx; if (free(p.x, ny, 3)) p.y = ny; }
        p.cd -= dt;
        if (p.cd <= 0) {
          if (shoot && d < 200 && los(p, P)) { enemyShot(p, a + (Math.random() - .5) * .2, 6); p.cd = 1.1; }
          else if (!shoot && d < 13) { hurtPlayer(5); swings.push({ x: p.x, y: p.y, a, r: 10, arc: .9, t: now(), col: '#fca5a5' }); p.cd = .8; }
        }
        if (p.hp < p.max * .35) { p.aggro = 0; p.flee = 5; p.from = { x: P.x, y: P.y }; bubble(p, '¡Está bien, está bien, me voy!'); }
        continue;
      }
      if (p.kind === 'civ' || p.kind === 'jog') {
        const pp = PERSONAS[p.persona] || {};
        let sp = p.kind === 'jog' ? 42 : pp.sp || 22, a;
        if (p.flee > 0) { p.flee -= dt; sp = pp.old ? 30 : 58; a = Math.atan2(p.y - p.from.y, p.x - p.from.x) + Math.sin(gameT * 3 + p.x) * .4; }
        else if (p.film > gameT) { const fd = dist(p, p.filmAt); a = Math.atan2(p.filmAt.y - p.y, p.filmAt.x - p.x); if (fd < 55) { p.ang = a; p.moving = false; continue; } sp = 34; }
        else {
          const want = p.kind === 'jog' ? [3, 6] : [1];
          if (!p.tgt || Math.hypot(p.tgt.x - p.x, p.tgt.y - p.y) < 4) { const tx = Math.floor(p.x / TW) + rnd(-3, 3), ty = Math.floor(p.y / TW) + rnd(-3, 3); if (want.includes(at(tx, ty))) p.tgt = { x: tx * TW + 8, y: ty * TW + 8 }; }
          if (!p.tgt) continue;
          a = Math.atan2(p.tgt.y - p.y, p.tgt.x - p.x);
        }
        const nx = p.x + Math.cos(a) * sp * dt, ny = p.y + Math.sin(a) * sp * dt;
        if (free(nx, ny, 3)) { p.x = nx; p.y = ny; p.ang = a; p.moving = true; } else { p.tgt = null; p.moving = false; }
        continue;
      }
      if (!p.alert && d < 170 && los(p, P)) { p.alert = true; bubble(p, p.kind === 'boss' ? '¿Vienes a pagar el rescate? El precio acaba de subir.' : pickOne(GANG_LINES), 'bad'); }
      if (!p.alert || d > 320) { p.moving = false; continue; }
      const a = Math.atan2(P.y - p.y, P.x - p.x);
      p.ang = a;
      const keep = p.kind === 'boss' ? 60 : 85, sp = (p.kind === 'boss' ? 26 : 40) * dt;
      const ma = d > keep ? a : a + Math.PI / 2 * (Math.sin(gameT + p.x) > 0 ? 1 : -1);
      const nx = p.x + Math.cos(ma) * sp, ny = p.y + Math.sin(ma) * sp;
      if (free(nx, p.y, 4)) p.x = nx; if (free(p.x, ny, 4)) p.y = ny;
      p.moving = true;
      p.cd -= dt;
      if (p.cd <= 0 && d < 240 && los(p, P)) {
        if (p.kind === 'boss') { for (let k = -2; k <= 2; k++) enemyShot(p, a + k * .22, 9, 200); p.cd = 1.3; }
        else { enemyShot(p, a + (Math.random() - .5) * .18, 7); p.cd = 1 + Math.random() * .6; }
      }
    }

    for (const b of birds) {
      if (b.fly) { b.x += b.vx * dt; b.y += b.vy * dt; b.fly += dt; continue; }
      if (!P.car && Math.hypot(b.x - P.x, b.y - P.y) < 26 && (P.moving || keys.fire)) scare(b, P.x, P.y);
    }
    birds = birds.filter(b => b.fly < 2.5);
    if (birds.length < 22 && Math.random() < dt * .4) spawnBirds(true);
    for (const mh of manholes) { mh.t -= dt; if (mh.t <= 0) { mh.t = .25 + Math.random() * .5; if (!offscreen(mh.x, mh.y)) steam.push({ x: mh.x + rnd(-2, 2), y: mh.y, t: gameT }); } }
    steam = steam.filter(s => gameT - s.t < 1.6);
    ambT -= dt;
    if (ambT <= 0) {
      ambT = 2 + Math.random() * 2;
      const near = peds.filter(p => !offscreen(p.x, p.y, -20) && p.flee <= 0 && !(p.aggro > gameT) && (p.kind === 'civ' || p.kind === 'jog' || p.kind === 'res'));
      const p = pickOne(near);
      if (p) {
        const pp = PERSONAS[p.persona];
        bubble(p, p.kind === 'res' ? pickOne(RES_LINES) : p.kind === 'jog' ? pickOne(['Uf… diez kilómetros más.', '¡Buenas! No paro, que pierdo el ritmo.', 'Correr despeja más que reiniciar el router.']) : pp && Math.random() < (pp.chat ? .9 : .6) ? pickOne(pp.lines) : pickOne(CIV_LINES));
        if (p.persona === 'turista' && Math.random() < .5) { burst(fx, p.x, p.y, '#ffffff', 4); }
      }
      const dr = drones.find(d => !offscreen(d.x, d.y)); if (dr && Math.random() < .5) bubble(dr, pickOne(DRONE_LINES), 'drone');
    }
    bubbles = bubbles.filter(b => now() - b.t < b.dur && (b.e === P || peds.includes(b.e) || cars.includes(b.e) || drones.includes(b.e)));
    swings = swings.filter(s => now() - s.t < 180);

    const stars = Math.floor(P.heat);
    if (gameT - P.lastCrime > 9) P.heat = Math.max(0, P.heat - .2 * dt);
    if (drones.length < stars && Math.random() < dt) { const a = Math.random() * 6.28; drones.push({ x: P.x + Math.cos(a) * 230, y: P.y + Math.sin(a) * 230, hp: 26, max: 26, cd: 1.5, ph: Math.random() * 6 }); }
    if (!stars) drones = drones.filter(dr => !offscreen(dr.x, dr.y));
    for (const dr of drones) {
      const d = dist(dr, P), a = Math.atan2(P.y - dr.y, P.x - dr.x) + (d < 80 ? Math.PI / 2 : 0);
      const sp = (stars ? 70 : -60) * dt;
      dr.x += Math.cos(a) * sp; dr.y += Math.sin(a) * sp;
      dr.cd -= dt;
      if (stars && dr.cd <= 0 && d < 200) { enemyShot(dr, Math.atan2(P.y - dr.y, P.x - dr.x) + (Math.random() - .5) * .25, 6, 240); dr.cd = 1.3; }
    }
    const socs = cars.filter(c => c.kind === 'soc' && !c.dead).length;
    if (stars >= 3 && socs < stars - 2 && Math.random() < dt * .5) spawnCar('soc', true);
    if (!stars) for (const c of cars) if (c.kind === 'soc' && c.ai === 'chase') c.ai = null;

    for (const b of bullets) {
      b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
      if (tAt(b.x, b.y) === 2) { b.life = 0; burst(fx, b.x, b.y, '#9aa4b5', 3); if (b.boom) explode(b.x, b.y, b.boom, b.d, true); continue; }
      if (b.own === 'p') {
        const hit = peds.find(p => !p.fixed && Math.hypot(p.x - b.x, p.y - b.y) < 6) || drones.find(dr => Math.hypot(dr.x - b.x, dr.y - b.y) < 7)
          || cars.find(c => !c.dead && c !== P.car && Math.hypot(c.x - b.x, c.y - b.y) < 8) || objs.find(o => o.hp > 0 && Math.hypot(o.x - b.x, o.y - b.y) < 9);
        if (hit) {
          b.life = 0;
          if (b.boom) explode(b.x, b.y, b.boom, b.d, true);
          else if (peds.includes(hit)) hurtPed(hit, b.d, true); else if (drones.includes(hit)) hurtDrone(hit, b.d, true); else if (cars.includes(hit)) hurtCar(hit, b.d, true); else hurtObj(hit, b.d);
        }
      } else if (Math.hypot(P.x - b.x, P.y - b.y) < (P.car ? 9 : 5)) { b.life = 0; hurtPlayer(b.d); }
      else if (b.life <= 0 && b.boom) explode(b.x, b.y, b.boom, b.d, true);
    }
    bullets = bullets.filter(b => b.life > 0);

    for (const pk of [...pickups]) {
      if (Math.hypot(pk.x - P.x, pk.y - P.y) > 11) continue;
      pickups.splice(pickups.indexOf(pk), 1);
      burst(fx, pk.x, pk.y, '#f2b33d', 8);
      if (pk.k === 'hp') { P.hp = Math.min(100, P.hp + 35); say('Parche aplicado: +35 de vida.'); }
      else if (pk.k === 'cash') { const c = rnd(20, 80); P.cash += c; fx.floats.push({ x: pk.x, y: pk.y - 6, txt: `+${c} ₿`, col: '#f2b33d', t: now() }); }
      else if (pk.k === 'ammo') { const owned = P.own.map((o, i) => o && i >= GUN0 ? i : 0).filter(Boolean); if (owned.length) { const w = pickOne(owned); P.ammo[w] += Math.ceil(CITY_W[w].ammo / 3); say(`Munición para ${CITY_W[w].n}.`); } else P.cash += 25; }
      else if (pk.k === 'drive') { say('¡Tienes el pendrive! Sigue la ruta de vuelta al refugio antes de que te alcancen.'); if (mission) mission.kind = 'return'; crime(1.2); }
    }
    missionUpdate();
    for (const pl of PLACES) {
      if ((prog.visited || []).includes(pl.k) || dist(P, pl) > 24) continue;
      prog.visited = [...(prog.visited || []), pl.k]; P.cash += 60; persist();
      banner = { txt: 'LUGAR DESCUBIERTO', sub: `${pl.n} · +60 ₿ (${prog.visited.length}/${PLACES.length})`, t: now(), ok: true };
      say(`Descubres ${pl.n}. +60 ₿.${pl.k === 'obs' ? ' Desde la cúpula ves toda la ciudad: los lugares que te faltan aparecen en el minimapa.' : ''}`);
    }
    const obj = objective();
    if (obj) { const k = `${Math.floor(obj.pt.x / TW)},${Math.floor(obj.pt.y / TW)},${!!P.car}`; if (gameT - routeT > .4 || k !== routeKey) { route = computeRoute(obj.pt); routeT = gameT; routeKey = k; } } else route = [];
    const st = streetAt(P.x, P.y), bz = barrioAt(P.x, P.y);
    if (bz !== curBarrio) { curBarrio = bz; street = `${BARRIOS[bz].n.toUpperCase()}${st ? ' · ' + st : ''}`; streetT = now(); } // al cambiar de barrio se anuncia su nombre
    else if (st && !street.endsWith(st)) { street = st; streetT = now(); }
    if (cars.filter(c => c.kind === 'civ' && !c.dead && c.owned === undefined).length < 36 && Math.random() < dt) spawnCar('civ', true);
    if (peds.filter(p => p.kind === 'civ').length < 52 && Math.random() < dt) spawnPed('civ');
  };

  // ---------- Dibujo ----------
  const drawPerson = (p, t) => {
    if (p.kind === 'me') { ctx.strokeStyle = 'rgba(62,232,255,.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(p.x, p.y + 1, 7, 5, 0, 0, 6.283); ctx.stroke(); }
    const d4 = ((Math.round(p.ang / (Math.PI / 2)) % 4) + 4) % 4, fr = p.moving ? Math.floor(t / 140) % 2 : 0, fl = p.fl && t - p.fl < 90;
    const s = p.kind === 'boss' ? 12 : 8, pp = p.persona && PERSONAS[p.persona];
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(Math.round(p.x) + 1, Math.round(p.y) + 2, s / 2, s / 2.6, 0, 0, 6.283); ctx.fill();
    ctx.save(); ctx.translate(Math.round(p.x), Math.round(p.y)); ctx.rotate(d4 * Math.PI / 2);
    ctx.globalAlpha = .4; const ws = personSpr(p.pal, fr, true); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) ctx.drawImage(ws, -s / 2 + dx, -s / 2 + dy, s, s); ctx.globalAlpha = 1; // halo que lo separa del suelo
    ctx.drawImage(personSpr(p.pal, fr, fl), -s / 2, -s / 2, s, s);
    ctx.restore();
    const fx2 = p.x + Math.cos(p.ang) * 5, fy2 = p.y + Math.sin(p.ang) * 5;
    if (pp && pp.phone && !(p.flee > 0)) { ctx.fillStyle = '#22d3ee'; ctx.fillRect(Math.round(fx2) - 1, Math.round(fy2) - 1, 2, 2); }
    if (p.film > gameT) { ctx.fillStyle = '#111827'; ctx.fillRect(Math.round(fx2) - 1, Math.round(fy2) - 2, 3, 3); ctx.fillStyle = Math.floor(t / 300) % 2 ? '#ef4444' : '#7f1d1d'; ctx.fillRect(Math.round(fx2), Math.round(fy2) - 1, 1, 1); }
    if (pp && pp.old) { ctx.strokeStyle = '#7c4a1e'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x + 3, p.y + 2); ctx.lineTo(p.x + 5, p.y + 5); ctx.stroke(); }
    if (pp && pp.cam) { ctx.fillStyle = '#1f2937'; ctx.fillRect(Math.round(p.x) - 1, Math.round(p.y) + 3, 3, 2); }
    const armed = p.kind === 'gang' || p.kind === 'boss' || (p.aggro > gameT && p.persona === 'armado') || (p === P && P.w >= GUN0);
    if (armed) { ctx.strokeStyle = '#9aa4b5'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p.x + Math.cos(p.ang) * 3, p.y + Math.sin(p.ang) * 3); ctx.lineTo(p.x + Math.cos(p.ang) * 8, p.y + Math.sin(p.ang) * 8); ctx.stroke(); }
    else if (p === P && P.w > 0) { const col = P.w === 5 ? '#3ee8ff' : P.w === 4 ? '#facc15' : P.w === 3 ? '#a16207' : '#9ca3af'; ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p.x + Math.cos(p.ang + .6) * 3, p.y + Math.sin(p.ang + .6) * 3); ctx.lineTo(p.x + Math.cos(p.ang + .3) * (P.w === 5 ? 11 : 8), p.y + Math.sin(p.ang + .3) * (P.w === 5 ? 11 : 8)); ctx.stroke(); }
    if (p.stun > gameT) { ctx.fillStyle = '#facc15'; for (let i = 0; i < 3; i++) { const a = t / 200 + i * 2.1; ctx.fillRect(Math.round(p.x + Math.cos(a) * 5), Math.round(p.y - 7 + Math.sin(a) * 2), 1, 1); } }
    if ((p.kind === 'gang' || p.kind === 'boss' || p.aggro > gameT) && dist(p, P) < 170) { const b = Math.sin(t / 150) * 1.5; ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(p.x - 3, p.y - 13 + b); ctx.lineTo(p.x + 3, p.y - 13 + b); ctx.lineTo(p.x, p.y - 9 + b); ctx.fill(); }
    if (p.name && dist(p, P) < 90) { ctx.font = 'bold 6px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.lineWidth = 2; ctx.strokeStyle = '#05080f'; ctx.strokeText(p.name, p.x, p.y - 8); ctx.fillStyle = p.kind === 'lia' ? '#3ee8ff' : '#4ade80'; ctx.fillText(p.name, p.x, p.y - 8); }
  };
  const hpBar = (e, w = 12) => { if (e.hp >= e.max) return; ctx.fillStyle = '#05080f'; ctx.fillRect(Math.round(e.x - w / 2), Math.round(e.y - 11), w, 2); ctx.fillStyle = '#f87171'; ctx.fillRect(Math.round(e.x - w / 2), Math.round(e.y - 11), Math.max(1, Math.round(w * e.hp / e.max)), 2); };
  const wrap = (txt, max) => { const out = []; let line = ''; for (const w of txt.split(' ')) { if (ctx.measureText(line + ' ' + w).width > max && line) { out.push(line); line = w; } else line = line ? line + ' ' + w : w; } if (line) out.push(line); return out.slice(0, 3); };
  const drawBubble = (b, t) => {
    const e = b.e, age = t - b.t, a = age < 150 ? age / 150 : age > b.dur - 300 ? (b.dur - age) / 300 : 1;
    ctx.font = '6px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
    const lines = wrap(b.txt, 96), w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 8, h = lines.length * 7 + 5;
    const x = clamp(e.x, w / 2 + 2, MW * TW - w / 2 - 2), y = e.y - 12 - h;
    ctx.globalAlpha = Math.max(0, a);
    ctx.fillStyle = b.kind === 'bad' ? '#450a0a' : b.kind === 'drone' ? '#082f49' : b.kind === 'car' ? '#422006' : '#f1f5f9';
    ctx.beginPath(); ctx.roundRect(x - w / 2, y, w, h, 3); ctx.fill();
    ctx.beginPath(); ctx.moveTo(e.x - 3, y + h); ctx.lineTo(e.x + 3, y + h); ctx.lineTo(e.x, y + h + 4); ctx.fill();
    ctx.fillStyle = b.kind === 'bad' ? '#fca5a5' : b.kind === 'drone' ? '#67e8f9' : b.kind === 'car' ? '#fde68a' : '#0b111d';
    lines.forEach((l, i) => ctx.fillText(l, x, y + 7 + i * 7));
    ctx.globalAlpha = 1;
  };
  const poiIcon = (p, x, y, s, t) => {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = '#05080f'; ctx.globalAlpha = .85; ctx.beginPath(); ctx.roundRect(-s, -s, s * 2, s * 2, 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = p.col; ctx.fillStyle = p.col; ctx.lineWidth = 1;
    if (p.ico === 'gun') { ctx.beginPath(); ctx.arc(0, 0, s * .55, 0, 6.283); ctx.stroke(); ctx.fillRect(-s * .8, -.5, s * 1.6, 1); ctx.fillRect(-.5, -s * .8, 1, s * 1.6); }
    if (p.ico === 'wrench') { ctx.fillRect(-s * .6, s * .3, s * 1.1, s * .3); ctx.beginPath(); ctx.arc(s * .45, -s * .2, s * .35, 0, 6.283); ctx.stroke(); ctx.save(); ctx.rotate(-.8); ctx.fillRect(-s * .7, -.6, s * 1.3, 1.4); ctx.restore(); }
    if (p.ico === 'car') { ctx.fillRect(-s * .7, -s * .2, s * 1.4, s * .5); ctx.fillRect(-s * .4, -s * .5, s * .8, s * .3); ctx.fillStyle = '#05080f'; ctx.fillRect(-s * .5, s * .2, s * .25, s * .25); ctx.fillRect(s * .25, s * .2, s * .25, s * .25); }
    if (p.ico === 'dice') { ctx.fillStyle = '#f8fafc'; ctx.fillRect(-s * .6, -s * .6, s * 1.2, s * 1.2); ctx.fillStyle = '#0b111d'; for (const [a, b] of [[-.3, -.3], [.3, .3], [0, 0]]) ctx.fillRect(a * s - .7, b * s - .7, 1.5, 1.5); }
    if (p.ico === 'food') { ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(0, s * .1, s * .65, 0, Math.PI); ctx.fill(); ctx.fillStyle = '#fb923c'; ctx.fillRect(-s * .5, -s * .2, s, s * .3); }
    if (p.ico === 'cup') { ctx.fillRect(-s * .45, -s * .5, s * .8, s); ctx.strokeRect(s * .35, -s * .2, s * .3, s * .4); }
    if (p.ico === 'cross') { ctx.fillStyle = '#ef4444'; ctx.fillRect(-s * .2, -s * .6, s * .4, s * 1.2); ctx.fillRect(-s * .6, -s * .2, s * 1.2, s * .4); }
    ctx.restore();
  };
  const draw = t => {
    const cx = clamp(P.x, VW / 2, MW * TW - VW / 2), cy = clamp(P.y, VH / 2, MH * TW - VH / 2);
    const [shx, shy] = shakeOffset(fx, t);
    const ox = Math.round(cx - VW / 2 - shx), oy = Math.round(cy - VH / 2 - shy);
    const vis = (x, y, pad = 24) => x > ox - pad && x < ox + VW + pad && y > oy - pad && y < oy + VH + pad;
    ctx.save();
    ctx.fillStyle = '#05080f'; ctx.fillRect(0, 0, VW, VH);
    ctx.translate(-ox, -oy);
    ctx.drawImage(mapCv, Math.max(0, ox), Math.max(0, oy), Math.ceil(VW) + 2, Math.ceil(VH) + 2, Math.max(0, ox), Math.max(0, oy), Math.ceil(VW) + 2, Math.ceil(VH) + 2);
    ctx.fillStyle = 'rgba(96,165,250,.25)';
    for (let ty = Math.max(0, Math.floor(oy / TW)); ty <= Math.min(MH - 1, Math.floor((oy + VH) / TW)); ty++) for (let tx = Math.max(0, Math.floor(ox / TW)); tx <= Math.min(MW - 1, Math.floor((ox + VW) / TW)); tx++) {
      if (at(tx, ty) !== 4) continue;
      if (Math.floor((ty - 2) / BK) === RIVER && (ty - 2) % BK >= 2 && tx > 1 && tx < MW - 2) { const k2 = (ty * 5 + tx) % 9; ctx.fillStyle = 'rgba(147,197,253,.28)'; ctx.fillRect(tx * TW + ((t / 45 + k2 * 5) % TW), ty * TW + (k2 % 14) + 1, 5, 1); ctx.fillStyle = 'rgba(96,165,250,.25)'; continue; }
      const k = (tx * 7 + ty * 13) % 16, s = (t / 90 + k * 3) % 20;
      if (s < 12) ctx.fillRect(tx * TW + k % 10, ty * TW + (k * 5) % 14, 4 + (s > 6 ? 12 - s : s) * .5, 1);
    }
    // autos expuestos en el concesionario
    { const c = blockMid(5, 1); if (vis(c.x, c.y, 80)) ['sport', 'offroad', 'armored', 'sedan', 'taxi'].forEach((ty2, i) => { const x = c.x - 34 + (i % 3) * 32, y = c.y - 4 + Math.floor(i / 3) * 26; ctx.drawImage(carSpr(ty2, ty2 === 'taxi' ? '#facc15' : ty2 === 'armored' ? '#3f4652' : PAINTS[i * 2]), x - 10, y - 5); ctx.font = '5px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#4ade80'; ctx.fillText(`${CAR_T[ty2].price} ₿`, x, y + 12); }); }
    const obj = objective();
    if (route.length) {
      ctx.fillStyle = obj ? obj.col : '#4ade80';
      const off = Math.floor(t / 120) % 3;
      for (let i = off; i < Math.min(route.length, 140); i += 3) { const r = route[i]; if (vis(r.x, r.y)) { ctx.globalAlpha = .55 + .25 * Math.sin(t / 200 + i); ctx.fillRect(r.x - 1.5, r.y - 1.5, 3, 3); } }
      ctx.globalAlpha = 1;
    }
    if (obj) { const pul = 8 + 3 * Math.sin(t / 160); ctx.strokeStyle = obj.col; ctx.lineWidth = 2; ctx.globalAlpha = .85; ctx.beginPath(); ctx.arc(obj.pt.x, obj.pt.y, pul + 4, 0, 6.283); ctx.stroke(); ctx.globalAlpha = .25; ctx.fillStyle = obj.col; ctx.beginPath(); ctx.arc(obj.pt.x, obj.pt.y, pul + 4, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
    if (vis(FARO.x, FARO.y, 140)) {
      const a = t / 900; ctx.globalCompositeOperation = 'lighter';
      const g2 = ctx.createRadialGradient(FARO.x, FARO.y, 2, FARO.x, FARO.y, 130); g2.addColorStop(0, 'rgba(253,230,138,.35)'); g2.addColorStop(1, 'rgba(253,230,138,0)');
      ctx.fillStyle = g2; ctx.beginPath(); ctx.moveTo(FARO.x, FARO.y); ctx.arc(FARO.x, FARO.y, 130, a - .18, a + .18); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(FARO.x, FARO.y, 5, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(FARO.x, FARO.y, 3.5, 0, 6.283); ctx.stroke(); ctx.fillStyle = '#fde68a'; ctx.fillRect(FARO.x - 1, FARO.y - 1, 2, 2);
    }
    for (const p of POI) if (vis(p.x, p.y, 30)) { const b = Math.sin(t / 250) * 1.5; ctx.shadowColor = p.col; ctx.shadowBlur = 8; poiIcon(p, p.x, p.y - 2 + b, 5, t); ctx.shadowBlur = 0; }
    for (let iy = 0; iy <= NBY; iy++) for (let ix = 0; ix <= NBX; ix++) {
      const tx = 2 + BK * ix, ty = 2 + BK * iy, x0 = tx * TW, y0 = ty * TW;
      if (!vis(x0 + 16, y0 + 16, 40)) continue;
      const lv = light(ix, iy, 'v'), lh = light(ix, iy, 'h'), col = l => l === 'g' ? '#22c55e' : l === 'y' ? '#facc15' : '#ef4444';
      for (const [dx, dy, l] of [[-5, -5, lv], [36, 36, lv], [36, -5, lh], [-5, 36, lh]]) {
        if (at(Math.floor((x0 + dx) / TW), Math.floor((y0 + dy) / TW)) !== 1) continue;
        ctx.fillStyle = '#0b0e16'; ctx.fillRect(x0 + dx - 2, y0 + dy - 2, 5, 5);
        ctx.fillStyle = col(l); ctx.shadowColor = col(l); ctx.shadowBlur = 6; ctx.fillRect(x0 + dx - 1, y0 + dy - 1, 3, 3); ctx.shadowBlur = 0;
      }
    }
    for (const s of steam) { const a = (gameT - s.t) / 1.6; ctx.fillStyle = `rgba(203,213,225,${.25 * (1 - a)})`; ctx.beginPath(); ctx.arc(s.x + Math.sin(a * 6) * 2, s.y - a * 16, 2 + a * 4, 0, 6.283); ctx.fill(); }
    for (const pk of pickups) {
      if (!vis(pk.x, pk.y)) continue;
      const b = Math.round(Math.sin(t / 200 + pk.x) * 1.5);
      if (pk.k === 'drive') { ctx.shadowColor = '#22d3ee'; ctx.shadowBlur = 10; ctx.fillStyle = '#22d3ee'; ctx.fillRect(pk.x - 3, pk.y - 5 + b, 6, 9); ctx.fillStyle = '#cbd5e1'; ctx.fillRect(pk.x - 2, pk.y - 8 + b, 4, 3); ctx.shadowBlur = 0; continue; }
      const gc = pk.k === 'hp' ? '#4ade80' : pk.k === 'cash' ? '#f2b33d' : '#93c5fd'; ctx.strokeStyle = gc; ctx.globalAlpha = .5 + .3 * Math.sin(t / 180); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(pk.x, pk.y, 8 + Math.sin(t / 180), 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.drawImage(SPR[pk.k === 'hp' ? '!' : pk.k === 'cash' ? '$' : '?'], pk.x - 7, pk.y - 7 + b, 14, 14);
    }
    for (const o of objs) {
      if (o.hp <= 0) { ctx.fillStyle = '#1f2937'; ctx.fillRect(o.x - 5, o.y - 3, 10, 6); continue; }
      const fl = o.fl && t - o.fl < 90;
      if (o.k === 'rack') {
        ctx.fillStyle = fl ? '#fff' : '#111827'; ctx.fillRect(o.x - 6, o.y - 8, 12, 16); ctx.fillStyle = '#374151'; ctx.fillRect(o.x - 5, o.y - 7, 10, 14);
        for (let i = 0; i < 4; i++) { ctx.fillStyle = (Math.floor(t / 150) + i) % 3 ? '#4ade80' : '#f87171'; ctx.fillRect(o.x - 3, o.y - 5 + i * 3, 2, 1); ctx.fillRect(o.x + 1, o.y - 5 + i * 3, 2, 1); }
      } else {
        ctx.strokeStyle = fl ? '#fff' : '#9aa4b5'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(o.x - 6, o.y + 8); ctx.lineTo(o.x, o.y - 10); ctx.lineTo(o.x + 6, o.y + 8); ctx.moveTo(o.x - 4, o.y + 2); ctx.lineTo(o.x + 4, o.y + 2); ctx.moveTo(o.x - 3, o.y - 3); ctx.lineTo(o.x + 3, o.y - 3); ctx.stroke();
        const k = (t / 900) % 1; ctx.strokeStyle = '#c084fc'; ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(o.x, o.y - 10, 3 + k * 16, 0, 6.283); ctx.stroke(); ctx.globalAlpha = 1;
        ctx.fillStyle = Math.floor(t / 300) % 2 ? '#f87171' : '#7f1d1d'; ctx.fillRect(o.x - 1, o.y - 12, 3, 3);
      }
      hpBar(o, 14);
    }
    for (const b of birds) {
      if (!vis(b.x, b.y)) continue;
      const peck = !b.fly && Math.sin(t / 160 + b.ph) > .7 ? 1 : 0, flap = b.fly && Math.floor(t / 80 + b.ph) % 2;
      ctx.fillStyle = '#9ca3af';
      if (b.fly) { ctx.fillRect(b.x - (flap ? 3 : 1), b.y - 1, flap ? 7 : 3, flap ? 1 : 3); ctx.fillStyle = '#6b7280'; ctx.fillRect(b.x - 1, b.y - 1, 2, 2); }
      else { ctx.fillRect(b.x - 1, b.y - 1 + peck, 3, 2); ctx.fillStyle = '#4b5563'; ctx.fillRect(b.x + 1, b.y - 1 + peck, 1, 1); }
    }
    for (const p of peds) if (vis(p.x, p.y)) { drawPerson(p, t); if (p.kind === 'gang' || p.kind === 'boss' || p.aggro > gameT) hpBar(p, p.kind === 'boss' ? 24 : 12); }
    for (const c of cars) {
      if (!vis(c.x, c.y, 60)) continue;
      ctx.save(); ctx.translate(Math.round(c.x), Math.round(c.y)); ctx.rotate(c.ang);
      if (!c.dead && c.neon) { ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 16); g.addColorStop(0, c.neon + 'aa'); g.addColorStop(1, c.neon + '00'); ctx.fillStyle = g; ctx.fillRect(-16, -12, 32, 24); ctx.globalCompositeOperation = 'source-over'; }
      if (!c.dead) { ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-9, -4, 20, 12); }
      if (c.drv && !c.dead) {
        const g = ctx.createLinearGradient(10, 0, 62, 0); g.addColorStop(0, 'rgba(253,230,138,.26)'); g.addColorStop(1, 'rgba(253,230,138,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(10, -3); ctx.lineTo(62, -16); ctx.lineTo(62, 16); ctx.lineTo(10, 3); ctx.fill();
      }
      const spr = carSpr(c.dead ? 'sedan' : c.type, c.dead ? '#1f2328' : c.col);
      if (!c.dead) { const ws = carWhite(c.type); ctx.globalAlpha = .28; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) ctx.drawImage(ws, -10 + dx, -Math.floor(ws.height / 2) + dy); ctx.globalAlpha = 1; }
      ctx.drawImage(spr, -10, -Math.floor(spr.height / 2));
      if (!c.dead) {
        if (c.drv && Math.abs(c.speed) < 8) { ctx.fillStyle = '#ef4444'; ctx.shadowColor = '#ef4444'; ctx.shadowBlur = 5; ctx.fillRect(-10, -3, 1, 2); ctx.fillRect(-10, 2, 1, 2); ctx.shadowBlur = 0; }
        if (c.sig && gameT < c.sig.until && Math.floor(t / 250) % 2) { ctx.fillStyle = '#fbbf24'; const sy = c.sig.right ? 4 : -5; ctx.fillRect(8, sy, 2, 1); ctx.fillRect(-10, sy, 1, 1); }
        if (c.kind === 'soc') { const b = Math.floor(t / 120) % 2; ctx.fillStyle = b ? '#3b82f6' : '#ef4444'; ctx.fillRect(-1, -3, 2, 3); ctx.fillStyle = b ? '#ef4444' : '#3b82f6'; ctx.fillRect(-1, 0, 2, 3); ctx.globalAlpha = .35; ctx.beginPath(); ctx.arc(0, 0, 11, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
        if (c.owned !== undefined && c !== P.car) { ctx.rotate(-c.ang); ctx.fillStyle = '#4ade80'; ctx.font = 'bold 6px monospace'; ctx.textAlign = 'center'; ctx.fillText('★', 0, -8); }
        if (c.fl && t - c.fl < 80) { ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(-10, -5, 20, 11); }
      } else { ctx.fillStyle = `rgba(251,146,60,${.5 + .3 * Math.sin(t / 60)})`; ctx.fillRect(-3, -2, 5, 4); if (Math.random() < .3) burst(fx, c.x, c.y, '#475569', 1); }
      ctx.restore();
      if (!c.dead && (c.kind === 'van' || c.kind === 'soc' || c.hp < c.max * .6)) hpBar(c, 16);
    }
    if (!P.car && state !== 'dying') drawPerson({ ...P, kind: 'me', pal: PAL.me }, t);
    for (const s of swings) { // estela del golpe cuerpo a cuerpo
      const k = Math.min(1, Math.max(0, (now() - s.t) / 180)); ctx.strokeStyle = s.col; ctx.globalAlpha = 1 - k; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * (.7 + k * .3), s.a - s.arc / 2, s.a + s.arc / 2); ctx.stroke(); ctx.globalAlpha = 1;
    }
    for (const dr of drones) {
      const b = Math.sin(t / 150 + dr.ph) * 1.5;
      ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(dr.x + 5, dr.y + 9, 6, 3, 0, 0, 6.283); ctx.fill();
      ctx.fillStyle = dr.fl && t - dr.fl < 90 ? '#fff' : '#1f2937'; ctx.fillRect(dr.x - 3, dr.y - 3 + b, 6, 6);
      ctx.fillStyle = Math.floor(t / 40) % 2 ? '#9aa4b5' : '#475569';
      for (const [dx, dy] of [[-5, -5], [5, -5], [-5, 5], [5, 5]]) ctx.fillRect(dr.x + dx - 2, dr.y + dy - 1 + b, 4, 2);
      ctx.fillStyle = Math.floor(t / 250) % 2 ? '#ef4444' : '#22d3ee'; ctx.fillRect(dr.x - 1, dr.y - 1 + b, 2, 2);
      hpBar(dr, 10);
    }
    for (const b of bullets) {
      ctx.strokeStyle = b.own === 'p' ? (b.boom ? '#22d3ee' : '#fde68a') : '#f87171'; ctx.lineWidth = b.boom ? 3 : 1.5;
      ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * .02, b.y - b.vy * .02); ctx.stroke();
    }
    drawFx(ctx, fx, t);
    ctx.globalCompositeOperation = 'lighter';
    for (const l of lamps) {
      if (!vis(l.x, l.y, 30)) continue;
      const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, 26); g.addColorStop(0, 'rgba(253,224,160,.22)'); g.addColorStop(1, 'rgba(253,224,160,0)');
      ctx.fillStyle = g; ctx.fillRect(l.x - 26, l.y - 26, 52, 52);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.font = 'bold 8px "JetBrains Mono", monospace'; ctx.textAlign = 'start'; ctx.textBaseline = 'top';
    for (const s of signs) {
      if (!vis(s.x, s.y, 40)) continue;
      if (Math.sin(t / 1000 + s.ph) > .96 && Math.floor(t / 60) % 2) continue;
      ctx.shadowColor = s.col; ctx.shadowBlur = 8 + 2 * Math.sin(t / 300 + s.ph); ctx.fillStyle = s.col; ctx.fillText(s.txt, s.x, s.y); ctx.shadowBlur = 0;
    }
    ctx.textBaseline = 'alphabetic';
    for (const b of bubbles) if (vis(b.e.x, b.e.y, 60)) drawBubble(b, t);
    ctx.restore();
    const vg = ctx.createRadialGradient(VW / 2, VH / 2, VH * .35, VW / 2, VH / 2, VW * .7);
    vg.addColorStop(0, 'rgba(5,8,15,0)'); vg.addColorStop(1, 'rgba(5,8,15,.3)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, VW, VH);
    if (obj) {
      const sx = obj.pt.x - ox, sy = obj.pt.y - oy;
      if (sx < 8 || sy < 8 || sx > VW - 8 || sy > VH - 8) {
        const a = Math.atan2(sy - VH / 2, sx - VW / 2);
        const ax = clamp(VW / 2 + Math.cos(a) * VW, 10, VW - 10), ay = clamp(VH / 2 + Math.sin(a) * VW, 32, VH - 10);
        ctx.save(); ctx.translate(ax, ay); ctx.rotate(a); ctx.fillStyle = obj.col; ctx.globalAlpha = .75 + .25 * Math.sin(t / 150);
        ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(-5, -6); ctx.lineTo(-2, 0); ctx.lineTo(-5, 6); ctx.fill(); ctx.restore(); ctx.globalAlpha = 1;
      }
      const meters = route.length * 5, dir = compass(Math.atan2(obj.pt.y - P.y, obj.pt.x - P.x));
      const txt = obj.txt, sub = meters > 8 ? `${meters} m al ${dir}` : 'has llegado';
      ctx.font = 'bold 8px "JetBrains Mono", monospace'; ctx.textAlign = 'left';
      const maxW = VW - MW * .5 - 14; // el recuadro no pisa el minimapa
      let line = txt; while (ctx.measureText(line).width > maxW - 12 && line.length > 8) line = line.slice(0, -2);
      if (line !== txt) line = line.trimEnd() + '…';
      const w = Math.min(maxW, Math.max(ctx.measureText(line).width, ctx.measureText(sub).width) + 12);
      ctx.fillStyle = 'rgba(5,8,15,.78)'; ctx.beginPath(); ctx.roundRect(4, 4, w, 22, 3); ctx.fill();
      ctx.fillStyle = obj.col; ctx.fillRect(4, 4, 2, 22);
      ctx.fillStyle = '#f1f5f9'; ctx.fillText(line, 9, 13);
      ctx.font = '7px "JetBrains Mono", monospace'; ctx.fillStyle = obj.col; ctx.fillText(sub, 9, 22);
    }
    if (P.car && P.car.turbo) { ctx.fillStyle = 'rgba(5,8,15,.7)'; ctx.fillRect(VW - 52, VH - 12, 48, 7); ctx.fillStyle = P.car.nitro > .2 ? '#38bdf8' : '#f87171'; ctx.fillRect(VW - 51, VH - 11, 46 * P.car.nitro, 5); ctx.font = '5px "JetBrains Mono", monospace'; ctx.fillStyle = '#e5e7eb'; ctx.textAlign = 'right'; ctx.fillText('NITRO', VW - 54, VH - 7); }
    if (street) {
      const k = (t - streetT) / 3200;
      if (k < 1) { ctx.globalAlpha = k < .1 ? k * 10 : k > .75 ? (1 - k) / .25 : 1; ctx.font = 'bold 9px "JetBrains Mono", monospace'; ctx.textAlign = 'left'; ctx.lineWidth = 3; ctx.strokeStyle = '#05080f'; ctx.strokeText(street, 6, VH - 8); ctx.fillStyle = '#e5e7eb'; ctx.fillText(street, 6, VH - 8); ctx.globalAlpha = 1; }
    }
    const ms = .5, mw = MW * ms, mh = MH * ms, mx = VW - mw - 4, my = 4;
    ctx.globalAlpha = .88; ctx.fillStyle = '#05080f'; ctx.fillRect(mx - 1, my - 1, mw + 2, mh + 2); ctx.drawImage(mini, mx, my, mw, mh); ctx.globalAlpha = 1;
    if (route.length) { ctx.strokeStyle = obj ? obj.col : '#4ade80'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(mx + P.x / TW * ms, my + P.y / TW * ms); for (let i = 0; i < route.length; i += 2) ctx.lineTo(mx + route[i].x / TW * ms, my + route[i].y / TW * ms); ctx.stroke(); }
    const dot = (e, c, s = 2) => { ctx.fillStyle = c; ctx.fillRect(Math.round(mx + e.x / TW * ms - s / 2), Math.round(my + e.y / TW * ms - s / 2), s, s); };
    peds.forEach(p => { if (p.kind === 'gang' || p.kind === 'boss') dot(p, '#f87171'); });
    drones.forEach(d => dot(d, '#22d3ee'));
    POI.forEach(p => dot(p, p.col, 2));
    const seenAll = (prog.visited || []).includes('obs');
    PLACES.forEach(pl => { const v = (prog.visited || []).includes(pl.k); if (v || seenAll) dot(pl, v ? '#64748b' : '#f472b6', 2); });
    if (obj && Math.floor(t / 300) % 2) dot(obj.pt, obj.col, 3);
    dot(base, '#4ade80', 2);
    dot(P, '#ffffff', 3);
    if (mission && mission.time) {
      const left = Math.max(0, Math.ceil(mission.time - (gameT - mission.t0)));
      ctx.font = 'bold 12px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = '#05080f';
      const s = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`; ctx.strokeText(s, VW / 2, 40); ctx.fillStyle = left < 15 ? '#f87171' : '#f2b33d'; ctx.fillText(s, VW / 2, 40);
    }
    if (banner) {
      const k = (t - banner.t) / 2600;
      if (k > 1) banner = null;
      else {
        const sc = k < .1 ? .6 + k * 4 : 1, a = k > .8 ? (1 - k) / .2 : 1;
        ctx.save(); ctx.globalAlpha = a; ctx.translate(VW / 2, VH * .42); ctx.scale(sc, sc);
        ctx.font = 'bold 13px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.lineWidth = 4; ctx.strokeStyle = '#05080f';
        const col = banner.ok === false ? '#f87171' : banner.ok ? '#4ade80' : '#f2b33d';
        ctx.strokeText(banner.txt, 0, 0); ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.fillText(banner.txt, 0, 0); ctx.shadowBlur = 0;
        if (banner.sub) { ctx.font = '9px "JetBrains Mono", monospace'; ctx.strokeText(banner.sub, 0, 14); ctx.fillStyle = '#e5e7eb'; ctx.fillText(banner.sub, 0, 14); }
        ctx.restore();
      }
    }
  };
  const nearTalk = () => peds.filter(p => p.kind !== 'gang' && p.kind !== 'boss' && !(p.aggro > gameT) && dist(p, P) < 22).sort((a, b) => dist(a, P) - dist(b, P))[0];
  const renderHud = () => {
    if (said !== shownLog) {
      const msgs = log.slice(-2), fresh = shownLog !== -1; shownLog = said;
      m.scr.innerHTML = `${msgs.length > 1 ? `<span class="g-dim">${esc(msgs[0])}</span>` : ' '}\n<span class="${fresh ? 'rv rv-fast' : ''}">› ${esc(msgs[msgs.length - 1] || '')}</span>`;
    }
    const w = CITY_W[P.w], stars = Math.floor(P.heat), nt = !P.car && nearTalk(), nc = !P.car && cars.some(c => !c.dead && c.kind !== 'soc' && c.kind !== 'van' && dist(c, P) < 18);
    hud.innerHTML = `<span class="hud-hp ${P.hp <= 25 ? 'is-low' : ''}"><b>HP</b><i><s style="width:${Math.max(0, P.hp)}%"></s></i>${Math.max(0, Math.round(P.hp))}</span>`
      + (P.armor > 0 ? `<span class="hud-cpu"><b>Chaleco</b><i><s style="width:${P.armor}%"></s></i></span>` : '')
      + (P.car ? `<span class="hud-cpu"><b>${esc(CAR_T[P.car.type].n)}</b><i><s style="width:${Math.max(0, P.car.hp / P.car.max * 100).toFixed(0)}%"></s></i>${Math.round(Math.abs(P.car.speed) * .6)} km/h</span>` : '')
      + `<span>Arma <b>${esc(w.n)}</b>${w.melee ? '' : ` (${P.ammo[P.w]})`}</span><span>₿ <b>${P.cash}</b></span>`
      + `<span class="${stars ? 'is-low' : ''}">Rastreo <b>${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</b></span>`
      + `<span class="hud-spell">${mission ? `Misión ${mission.i + 1}: <b>${esc(CITY_MISSIONS[mission.i].t)}</b>` : MI < CITY_MISSIONS.length ? `Siguiente misión: <b>${esc(CITY_MISSIONS[MI].t)}</b>` : '<b>Ciudad liberada</b>'}</span>`
      + (nt ? `<span class="hud-buff">[E] hablar con ${esc(nt.name || (nt.clerk ? 'el dependiente' : 'la persona'))}</span>` : nc ? '<span class="hud-buff">[E] subir al auto</span>' : '')
      + `<span class="hud-turn">${MI}/${CITY_MISSIONS.length} misiones · ${(prog.visited || []).length}/${PLACES.length} lugares</span>`
      + (touch ? '' : '<span class="hud-keys">WASD mover · Espacio atacar · E acción · Q arma · M destino · Mayús turbo</span>');
  };
  const frame = t => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(.05, (t - lastT) / 1000); lastT = t;
    if (state !== 'play' && state !== 'dying' && state !== 'talk' && state !== 'shop') return;
    if (state === 'play') update(dt);
    draw(t);
    if (t - hudT > 120) { hudT = t; renderHud(); }
  };
  const talkTo = () => {
    const p = nearTalk();
    if (!p) return say('No hay nadie cerca para hablar. Acércate a alguien y pulsa T.');
    p.stopT = 3;
    if (p.kind === 'nodo') return bubble(p, MI < CITY_MISSIONS.length ? (mission ? 'Concéntrate en la misión. La ruta amarilla te guía.' : 'Entra en el círculo verde cuando estés listo.') : 'Lo lograste. Esta ciudad te debe una.');
    if (p.kind === 'lia') return bubble(p, 'Acércate más, que no muerdo. Tengo algo para ti.');
    if (p.kind === 'res') return bubble(p, pickOne(RES_LINES));
    if (p.clerk) return bubble(p, { armeria: '¿Algo para defenderse? Entre por la puerta, que no muerdo.', taller: 'Tráigame el auto y se lo dejo volando.', lot: 'Tenemos el blindado en oferta… bueno, casi.', hospital: 'Si está herido, pase. Si no, también: hay café.' }[p.clerk]);
    const obj = objective();
    if (obj && mission && Math.random() < .35) return bubble(p, pickOne(RUMORS).replace('{p}', streetAt(obj.pt.x, obj.pt.y) || 'el centro'));
    const pp = PERSONAS[p.persona];
    bubble(p, p.kind === 'jog' ? '¡No paro, que pierdo el ritmo! Pero cuidado con Los Cifrados.' : pp && Math.random() < .65 ? pickOne(pp.lines) : pickOne(CIV_LINES));
  };
  const die = () => {
    state = 'dying'; burst(fx, P.x, P.y, '#f2b33d', 40); fx.shake = now();
    if (mission) missionFail('te desconectaron.');
    setTimeout(() => {
      state = 'dead'; cv.hidden = hud.hidden = true; dlg.hidden = true;
      const lost = Math.round(P.cash * .1); P.cash -= lost; P.armor = 0; persist();
      reveal(m.scr, [
        `<span class="g-dim">${stamp(gameT * 1000)} soc: objetivo neutralizado en Ciudad Zero-Day</span>`,
        `<span class="g-dim">${stamp(gameT * 1000 + 70)} hospital San Parche: reiniciando paciente…</span>`,
        ...boxed('*** CONEXIÓN PERDIDA ***', 'g-bad rv-glitch'),
        cols2(` ${dots('bajas')}${N(P.kills)}`, `${dots('misiones', 10)}${N(MI)}/${CITY_MISSIONS.length}`),
        cols2(` ${dots('criptos')}${N(P.cash)} ₿`, `${dots('factura', 10)}<b class="g-bad">−${lost} ₿</b>`),
        '',
        ' [Espacio] despertar en el hospital   [Esc] salir <span class="rv-cur"></span>',
      ].join('\n'), 80);
    }, 900);
  };
  const victory = () => {
    state = 'won'; cv.hidden = hud.hidden = true; dlg.hidden = true;
    const sc = P.cash + P.kills * 10, b = best('hs-city', sc);
    store.set('city-win', '1');
    reveal(m.scr, [
      '<span class="g-ok">[ OK ]</span> claves de Los Cifrados publicadas',
      '<span class="g-ok">[ OK ]</span> rescates anulados en toda la ciudad',
      ' [<span class="rv-bar g-ok">########################</span>] 100%',
      ...boxed('*** CIUDAD LIBERADA ***', 'g-ok rv-glitch'),
      ' Las farolas vuelven a encenderse. Nadie paga rescates hoy.',
      ' <span class="g-dim">Nodo: «Pura vida, visitante. Esta ciudad te debe una.»</span>',
      cols2(` ${dots('bajas')}${N(P.kills)}`, `${dots('criptos', 10)}${N(P.cash)} ₿`),
      cols2(` ${dots('puntos')}<b class="g-me" data-n="${sc}">${sc}</b>`, `${dots('récord', 10)}${N(b)}`),
      '',
      ' [c] seguir paseando con todo el arsenal   [r] empezar de cero   [esc] salir <span class="rv-cur"></span>',
    ].join('\n'), 100);
  };

  const KEYMAP = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ' ': 'fire', j: 'fire', J: 'fire', f: 'fire', F: 'fire', Shift: 'nitro' };
  const kdown = e => { const k = KEYMAP[e.key]; if (k && state === 'play') { keys[k] = true; e.preventDefault(); } };
  const kup = e => { const k = KEYMAP[e.key]; if (k) keys[k] = false; };
  const blur = () => { for (const k in keys) keys[k] = false; };
  m.keyEl.addEventListener('keydown', kdown); m.keyEl.addEventListener('keyup', kup); addEventListener('blur', blur);
  m.box.querySelectorAll('[data-h]').forEach(b => {
    const on = e => { e.preventDefault(); if (state === 'talk') { if (b.dataset.h === 'fire') advance(); return; } keys[b.dataset.h] = true; try { b.setPointerCapture(e.pointerId); } catch (x) {} };
    const off = () => { keys[b.dataset.h] = false; };
    b.addEventListener('pointerdown', on); ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => b.addEventListener(ev, off));
  });
  dlg.addEventListener('click', () => { if (state === 'talk') advance(); });
  sprites();
  reset();
  raf = requestAnimationFrame(frame);
  addEventListener('resize', size);
  return session(T, m, e => {
    if (state === 'talk') { if (['e', 'E', 'Enter', ' ', 't', 'T'].includes(e.key)) { e.preventDefault(); advance(); } return; }
    if (state === 'shop') {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { e.preventDefault(); shop.i = (shop.i - 1 + shop.items.length) % shop.items.length; renderShop(); }
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { e.preventDefault(); shop.i = (shop.i + 1) % shop.items.length; renderShop(); }
      else if (['e', 'E', 'Enter', ' '].includes(e.key)) { e.preventDefault(); buy(); }
      else if (['q', 'Q', 'Backspace'].includes(e.key)) closeShop();
      return;
    }
    if (state === 'dead') { if (['r', 'R', ' ', 'Enter', 'e', 'E'].includes(e.key)) { reset(); const h = door(9, 1); P.x = h.x + 30; P.y = h.y; say('Despiertas en el Hospital San Parche. La factura llegará por correo… cifrado.'); } return; }
    if (state === 'won') {
      if (e.key === 'c' || e.key === 'C') { P.own = P.own.map(() => true); P.ammo = P.ammo.map((a, i) => a + (CITY_W[i].ammo || 0)); persist(); state = 'play'; cv.hidden = hud.hidden = false; say('Paseo libre: la ciudad es tuya.'); }
      if (e.key === 'r' || e.key === 'R') { store.set('city', '{}'); reset(false); }
      return;
    }
    if (state !== 'play') return;
    if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
      if (P.car) toggleCar();
      else {
        const p = nearTalk(), c = cars.filter(c => !c.dead && c.kind !== 'soc' && c.kind !== 'van' && dist(c, P) < 18).sort((a, b) => dist(a, P) - dist(b, P))[0];
        if (p && (!c || dist(p, P) < dist(c, P))) talkTo(); else toggleCar();
      }
    }
    if (e.key === 't' || e.key === 'T') talkTo();
    if (e.key === 'm' || e.key === 'M') { const L = dests(); waypoint = waypoint + 1 >= L.length ? -1 : waypoint + 1; say(waypoint >= 0 ? `Destino marcado: ${L[waypoint].n}. Sigue la ruta.` : 'Destino borrado.'); }
    if (e.key === 'q' || e.key === 'Q' || e.key === 'Tab') {
      e.preventDefault();
      const n = CITY_W.length;
      for (let i = 1; i <= n; i++) { const w = (P.w + i) % n; if (P.own[w] && (w < GUN0 || P.ammo[w] > 0)) { P.w = w; break; } }
      say(`Arma: ${CITY_W[P.w].n}.`);
    }
  }, () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('blur', blur); m.keyEl.removeEventListener('keydown', kdown); m.keyEl.removeEventListener('keyup', kup); },
  () => { if (state === 'shop') { closeShop(); return true; } return false; });
}

const GAMES = { snake, crack, phish, dungeon, ciudad };
export const run = (name, T) => GAMES[name](T);
