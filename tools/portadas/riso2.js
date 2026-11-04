// Portadas Todohack v3: carteles de datos impresos en risografía (1600x900). Deterministas por slug.
// Uso: node riso2.js <salida>
const fs = require('fs');
const path = require('path');
const out = process.argv[2];
if (!fs.existsSync(out)) fs.mkdirSync(out);

const INK = {
  pink: '#ff48b0', blue: '#0078bf', yellow: '#ffe800', teal: '#00838a', red: '#ff665e', black: '#262524',
  green: '#00a95c', orange: '#ff6c2f', purple: '#765ba7', federal: '#3d5588', burgundy: '#914e72', mint: '#82d8d5', violet: '#9d7ad2',
};
const PAPER = '#f2ece0';
const SANS = `'Inter', 'Segoe UI Variable Display', 'Segoe UI', sans-serif`;
const MONO = `'Cascadia Mono', 'Consolas', monospace`;

// ---------- Azar determinista y ruido ----------
function prng(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  return () => { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}
let rnd = Math.random;
const R = (a, b) => a + rnd() * (b - a);
const RI = (a, b) => Math.floor(R(a, b + 1));
const f = n => (+n).toFixed(1);
let NG;
const noiseInit = () => { NG = Array.from({ length: 64 }, () => Array.from({ length: 64 }, rnd)); };
const smooth = t => t * t * (3 - 2 * t);
function noise(x, y) { // ruido de valor suave en [0,1]
  const xi = Math.floor(x) & 63, yi = Math.floor(y) & 63, xf = smooth(x - Math.floor(x)), yf = smooth(y - Math.floor(y));
  const a = NG[yi][xi], b = NG[yi][(xi + 1) & 63], c = NG[(yi + 1) & 63][xi], d = NG[(yi + 1) & 63][(xi + 1) & 63];
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}
const fbm = (x, y) => (noise(x, y) * .6 + noise(x * 2.1, y * 2.1) * .3 + noise(x * 4.3, y * 4.3) * .1);

// ---------- Primitivas de impresión ----------
let layerN = 0;
const inkText = (color, body, op = .95) => `<g style="mix-blend-mode:multiply" opacity="${op}" fill="${color}" stroke="${color}" filter="url(#inkText)">${body}</g>`;
const ink = (color, body, op = .95) => `<g style="mix-blend-mode:multiply" opacity="${op}" fill="${color}" stroke="${color}" filter="url(#ink${(layerN++ % 3)})" transform="translate(${f(R(-2.5, 2.5))} ${f(R(-2.5, 2.5))})">${body}</g>`;
const T = (x, y, s, body, o = {}) => (o.mono && s < 18 && !o.raw ? (s = 18) : 0, `<text x="${f(x)}" y="${f(y)}" font-size="${s}" stroke="none" font-family="${o.mono ? MONO : SANS}" font-weight="${o.w || (o.mono ? 400 : 800)}" letter-spacing="${o.ls ?? (o.mono ? 0 : -s * .045)}" text-anchor="${o.a || 'start'}"${o.op ? ` opacity="${o.op}"` : ''}>${body}</text>`);
const rect = (x, y, w, h, o = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" stroke="none" ${o}/>`;
const frame = (x, y, w, h, sw = 2, o = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="none" stroke-width="${sw}" ${o}/>`;
const line = (x1, y1, x2, y2, sw = 2, o = '') => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="${sw}" ${o}/>`;
const dot = (x, y, r) => r > .35 ? `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" stroke="none"/>` : '';
// Semitono en retícula girada; t(x,y) en [0,1] da el tamaño del punto
function halftone(x0, y0, w, h, step, t, angle = 15, clip) {
  let s = '';
  const a = angle * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), cx = x0 + w / 2, cy = y0 + h / 2, ext = Math.hypot(w, h) / 2 + step;
  for (let v = -ext; v < ext; v += step) for (let u = -ext; u < ext; u += step) {
    const x = cx + u * ca - v * sa, y = cy + u * sa + v * ca;
    if (x < x0 || x > x0 + w || y < y0 || y > y0 + h || (clip && !clip(x, y))) continue;
    s += dot(x, y, Math.max(0, Math.min(1, t(x, y))) * step * .62);
  }
  return s;
}
// Tramado ordenado (Bayer 4x4) en celdas cuadradas
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + .5) / 16);
function dither(x0, y0, w, h, cell, t) {
  let s = '';
  for (let j = 0; j * cell < h; j++) for (let i = 0; i * cell < w; i++) { const x = x0 + i * cell, y = y0 + j * cell; if (t(x, y) > BAYER[(j % 4) * 4 + (i % 4)]) s += rect(x, y, cell, cell); }
  return s;
}

// ---------- Marco editorial común ----------
function poster(slug, m, inks, art) {
  layerN = 0;
  const crop = (x, y, dx, dy) => line(x, y, x + dx * 26, y, 1.4) + line(x, y, x, y + dy * 26, 1.4);
  const reg = (x, y) => `<circle cx="${x}" cy="${y}" r="11" fill="none" stroke-width="1.4"/>${line(x - 18, y, x + 18, y, 1.4)}${line(x, y - 18, x, y + 18, 1.4)}`;
  const swatches = inks.map((c, i) => `<rect x="${1352 + i * 34}" y="866" width="28" height="12" fill="${c}" stroke="none"/>`).join('');
  const marks = crop(30, 30, 1, 1) + crop(1570, 30, -1, 1) + crop(30, 870, 1, -1) + crop(1570, 870, -1, -1) + reg(800, 22) + reg(800, 878);
  const kicker = T(80, 118, 26, m.kicker, { mono: true, ls: 2.5, w: 500 });
  // Subtítulos en Inter, con salto de línea para no invadir el gráfico (ancho útil ~570 px)
  const wrap = (txt, size, max = 570) => { const out = [['']]; for (const w of txt.split(' ')) { const cur = out[out.length - 1]; const next = cur[0] ? cur[0] + ' ' + w : w; if (next.length * size * .52 > max && cur[0]) out.push([w]); else cur[0] = next; } return out.map(x => x[0]); };
  let sy = m.y + (m.lines.length - 1) * m.size * .92 + 66;
  const subs = m.sub.map((l, i) => { const size = i ? 27 : 34; return wrap(l, size).map(ln => { const t = T(82, sy, size, ln, { w: i ? 500 : 650, ls: i ? -.2 : -.6, op: i ? .78 : 1 }); sy += size * 1.25; return t; }).join('') + ((sy += i ? 0 : 6), ''); }).join('');
  const text = m.lines.map((l, i) => T(78, m.y + i * m.size * .92, m.size, l)).join('') + subs;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<defs>
${[0, 1, 2].map(k => `<filter id="ink${k}" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency="${.75 + k * .2}" numOctaves="2" seed="${slug.length * 3 + k}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${1.4 + k * .4}" result="d"/><feTurbulence type="fractalNoise" baseFrequency="${1.8 + k * .3}" numOctaves="1" seed="${slug.length + k * 7}" result="s"/><feComponentTransfer in="s" result="m"><feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 .82 .55"/></feComponentTransfer><feComposite in="d" in2="m" operator="in"/></filter>`).join('')}
<filter id="inkText" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency="2" numOctaves="1" seed="3" result="s"/><feComponentTransfer in="s" result="m"><feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 .85"/></feComponentTransfer><feComposite in="SourceGraphic" in2="m" operator="in"/></filter>
<filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="11"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".13"/></feComponentTransfer></filter>
<filter id="fiber"><feTurbulence type="turbulence" baseFrequency=".004 .09" numOctaves="2" seed="5"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".05"/></feComponentTransfer></filter>
</defs>
<rect width="1600" height="900" fill="${PAPER}"/>
${art}
${inkText(INK.black, kicker + text + line(80, 806, 1520, 806, 1.6) + T(80, 846, 23, `TODOHACK — ${m.date}`, { mono: true, ls: 1.4, w: 500 }) + T(800, 846, 23, m.tag, { mono: true, a: 'middle', ls: 1.4, w: 500 }) + T(1520, 846, 23, m.no, { mono: true, a: 'end', ls: 1.4, w: 500 }), .92)}
${ink(INK.black, marks, .55)}
${swatches}
<rect width="1600" height="900" filter="url(#fiber)" style="mix-blend-mode:multiply"/>
<rect width="1600" height="900" filter="url(#paper)" style="mix-blend-mode:multiply"/>
</svg>`;
}

const P = { x: 700, y: 70, w: 820, h: 710 }; // zona de datos

// ---------- Escenas ----------
const S = {};

S['Primer-Post'] = {
  inks: [INK.blue, INK.pink, INK.yellow],
  m: { kicker: 'N.º 00 — BIENVENIDA', lines: ['&gt; hello_'], size: 150, y: 330, sub: ['el primer paso de un laboratorio propio', 'ciberseguridad · hacking ético'] },
  art() {
    const cx = 1150, cy = 430; let rings = '', ticks = '', blips = '';
    for (let r = 40; r <= 360; r += 40) rings += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke-width="${r % 120 ? 1.3 : 2.6}"/>`;
    for (let a = 0; a < 360; a += 5) { const L = a % 30 ? 10 : 22, ra = a * Math.PI / 180; ticks += line(cx + Math.cos(ra) * 360, cy + Math.sin(ra) * 360, cx + Math.cos(ra) * (360 + L), cy + Math.sin(ra) * (360 + L), 1.5); }
    for (let i = 0; i < 9; i++) { const a = R(-1.1, -.15), r = R(80, 340); blips += `<circle cx="${f(cx + Math.cos(a) * r)}" cy="${f(cy + Math.sin(a) * r)}" r="${f(R(5, 11))}" stroke="none"/>`; }
    const sweep = halftone(cx - 370, cy - 370, 740, 740, 11, (x, y) => { const a = Math.atan2(y - cy, x - cx), r = Math.hypot(x - cx, y - cy); if (r > 360) return 0; const d = (-.1 - a); return d > 0 && d < 1.1 ? (1 - d / 1.1) * .95 : 0; }, 0);
    return ink(INK.blue, rings + ticks + line(cx - 380, cy, cx + 380, cy, 1.3) + line(cx, cy - 380, cx, cy + 380, 1.3) + T(cx + 368, cy - 8, 14, '000°', { mono: true, a: 'end' }), .85)
      + ink(INK.yellow, sweep, .95) + ink(INK.pink, blips + `<circle cx="${cx}" cy="${cy}" r="9" stroke="none"/>`, .95);
  },
};

S['Kali-Linux-para-Hackers'] = {
  inks: [INK.blue, INK.yellow, INK.pink],
  m: { kicker: 'LAB 01 — RECONOCIMIENTO', lines: ['nmap -sV'], size: 128, y: 330, sub: ['192.168.56.0/24', '256 direcciones · hosts vivos y puertos abiertos'] },
  art() {
    let grid = '', live = '', ports = '', axes = '';
    const cs = 44, x0 = 780, y0 = 92;
    for (let i = 0; i < 256; i++) {
      const c = i % 16, r = Math.floor(i / 16), x = x0 + c * cs, y = y0 + r * cs;
      grid += frame(x, y, cs - 8, cs - 8, 1.3);
      if (rnd() < .085) { live += rect(x, y, cs - 8, cs - 8); for (let k = 0; k < RI(1, 4); k++) ports += rect(x + 4 + k * 8, y + cs - 6, 5, 9); }
    }
    for (let c = 0; c < 16; c++) axes += T(x0 + c * cs + 18, y0 - 12, 12, c * 16 % 256 === 0 && c ? '' : `.${c}`, { mono: true, a: 'middle' });
    for (let r = 0; r < 16; r++) axes += T(x0 - 14, y0 + r * cs + 23, 12, `.${r * 16}`, { mono: true, a: 'end' });
    const sweep = halftone(x0 - 10, y0 - 10, 16 * cs + 10, 16 * cs + 10, 12, (x, y) => Math.max(0, 1 - Math.abs((y - y0) / (16 * cs) - .42) * 5) * (.6 + fbm(x / 90, y / 90) * .5), 45);
    return ink(INK.blue, grid + axes, .8) + ink(INK.yellow, sweep, .95) + ink(INK.pink, live + ports, .95);
  },
};

S['Virtualizadores'] = {
  inks: [INK.federal, INK.teal, INK.pink, INK.yellow],
  m: { kicker: 'LAB 02 — VIRTUALIZACIÓN', lines: ['host', '› vm', '› vm'], size: 116, y: 300, sub: ['tipo 1 · tipo 2 · aislamiento', 'VMware · VirtualBox · Hyper-V'] },
  art() {
    const L = [[730, 100, 790, 670, INK.federal, 'HARDWARE'], [800, 180, 650, 520, INK.teal, 'HIPERVISOR'], [870, 260, 510, 370, INK.pink, 'VM · KALI'], [940, 340, 370, 220, INK.yellow, 'VM · LAB']];
    return L.map(([x, y, w, h, c, lab], i) => ink(c, frame(x, y, w, h, 18 - i * 3) + (i === 3 ? halftone(x + 12, y + 12, w - 24, h - 24, 12, (xx, yy) => .5 + fbm(xx / 90, yy / 90) * .4, 45) : '') + T(x + w + 0, y - 10, 15, lab, { mono: true, a: 'end', ls: 2.5 }), .9)).join('');
  },
};

S['deepseek-base-de-datos-expuesta'] = {
  inks: [INK.teal, INK.pink, INK.yellow],
  m: { kicker: 'CASO 01 — EXPOSICIÓN EN LA NUBE', lines: [':8123', ':9000'], size: 150, y: 300, sub: ['ClickHouse sin autenticación', '30 subdominios · escaneo más allá de 80/443'] },
  art() {
    let rows = '', labels = '', hot = '', beam = '';
    const names = Array.from({ length: 30 }, (_, i) => i === 7 ? 'oauth2callback' : i === 19 ? 'dev' : `sub-${String(i + 1).padStart(2, '0')}`);
    const cols = 150, cw = 5.2, x0 = 900, y0 = 84, rh = 22.5;
    const hotCols = [Math.round(8123 / 65535 * cols), Math.round(9000 / 65535 * cols)];
    names.forEach((n, r) => {
      const y = y0 + r * rh;
      labels += T(x0 - 12, y + 12, 12.5, n, { mono: true, a: 'end' });
      for (let c = 0; c < cols; c++) { const v = (c < 2 ? .95 : 0) + (fbm(c / 9, r / 3) > .62 ? .5 : 0) * rnd(); if (v > .2) rows += rect(x0 + c * cw, y + 3, cw - 1.2, rh - 9); }
      if (r === 7 || r === 19) hotCols.forEach(c => { hot += rect(x0 + c * cw - 5, y - 2, cw + 10, rh + 2); });
    });
    [7, 19].forEach(r => { beam += line(x0 - 190, y0 + r * rh + 8, 1520, y0 + r * rh + 8, 2.4); });
    const glow = halftone(x0 + hotCols[0] * cw - 90, y0, 200, 30 * rh, 10, (x, y) => Math.max(0, 1 - Math.abs(x - (x0 + (hotCols[0] + 4) * cw)) / 100) * .8, 20);
    return ink(INK.teal, rows + labels + hotCols.map((c, i) => T(x0 + c * cw + (i ? 14 : -14), y0 + 30 * rh + 26, 15, [8123, 9000][i], { mono: true, a: i ? 'start' : 'end' })).join('') + line(x0, y0 + 30 * rh + 6, x0 + cols * cw, y0 + 30 * rh + 6, 1.5) + T(x0, y0 + 30 * rh + 26, 13, '0', { mono: true }) + T(x0 + cols * cw, y0 + 30 * rh + 26, 13, '65535', { mono: true, a: 'end' }), .9)
      + ink(INK.yellow, glow, .95) + ink(INK.pink, hot + beam, .95);
  },
};

S['bybit-robo-1500-millones'] = {
  inks: [INK.federal, INK.red, INK.yellow],
  m: { kicker: 'CASO 02 — CADENA DE SUMINISTRO', lines: ['$1,5B'], size: 176, y: 330, sub: ['400.000+ ETH en una firma', 'la interfaz mostraba otra transacción'] },
  art() {
    let legit = '', stolen = '', parts = '';
    const sx = 760, sy0 = 150, sy1 = 640;
    for (let i = 0; i < 220; i++) {
      const y0 = sy0 + (i / 220) * (sy1 - sy0), div = i > 30, y1 = div ? 560 + (i - 30) / 190 * 200 + R(-6, 6) : 110 + i * 1.6, cx = R(980, 1120);
      const d = `M${sx} ${f(y0)} C ${f(cx)} ${f(y0)}, ${f(cx + 60)} ${f(y1)}, 1500 ${f(y1)}`;
      div ? (stolen += `<path d="${d}" fill="none" stroke-width="1.1"/>`) : (legit += `<path d="${d}" fill="none" stroke-width="1.4"/>`);
      if (div && rnd() < .25) { const t = R(.3, .95), x = sx + t * (1500 - sx), y = y0 + (y1 - y0) * smooth(t); parts += `<path d="M${f(x)} ${f(y - 7)} l5 7 l-5 7 l-5 -7z" stroke="none"/>`; }
    }
    const flood = halftone(1220, 520, 300, 290, 11, (x, y) => (1 - Math.abs(y - 660) / 160) * (.5 + (x - 1220) / 600), 75);
    return ink(INK.federal, legit + rect(sx - 26, sy0 - 6, 26, sy1 - sy0 + 12) + T(sx - 36, sy0 + 10, 14, 'COLD', { mono: true, a: 'end', ls: 2 }) + T(1500, 98, 14, 'HOT WALLET', { mono: true, a: 'end', ls: 2 }), .9)
      + ink(INK.yellow, flood, .95) + ink(INK.red, stolen + parts + T(1500, 790, 14, 'ATACANTE', { mono: true, a: 'end', ls: 2 }), .9);
  },
};

S['ms-coop-llamada-mesa-de-ayuda'] = {
  inks: [INK.blue, INK.pink, INK.yellow],
  m: { kicker: 'CASO 03 — INGENIERÍA SOCIAL', lines: ['“Soy de TI…”'], size: 110, y: 300, sub: ['una llamada, un reset de contraseña', 'la mesa de ayuda como puerta de entrada'] },
  art() {
    let caller = '', desk = '', tick = '';
    const x0 = 720, mid = 470, n = 190, step = 4.2;
    for (let i = 0; i < n; i++) {
      const x = x0 + i * step, env = (Math.sin(i * .05) * .5 + .6), a1 = env * (fbm(i / 6, 1) * .9 + .1) * 220 * (i > 120 && i < 150 ? .3 : 1), a2 = env * (fbm(i / 6, 7) * .9 + .1) * 180 * (i > 118 && i < 152 ? 1.2 : .55);
      caller += rect(x, mid - a1, 2.6, a1); desk += rect(x, mid, 2.6, a2);
    }
    for (let s = 0; s <= 12; s++) tick += line(x0 + s * n * step / 12, 760, x0 + s * n * step / 12, s % 3 ? 768 : 776, 1.3) + (s % 3 ? '' : T(x0 + s * n * step / 12, 794, 12, `0${Math.floor(s / 4)}:${String(s % 4 * 15).padStart(2, '0')}`, { mono: true, a: 'middle' }));
    const win = rect(x0 + 118 * step, 90, 34 * step, 670, 'opacity=".9"');
    return ink(INK.yellow, win, .9) + ink(INK.pink, caller + T(x0, 118, 14, 'LLAMANTE', { mono: true, ls: 2 }), .9) + ink(INK.blue, desk + tick + line(x0, 760, x0 + n * step, 760, 1.3) + T(x0, 750, 14, 'MESA DE AYUDA', { mono: true, ls: 2 }) + T(x0 + 135 * step, 112, 14, 'RESET', { mono: true, a: 'middle', ls: 2 }), .9);
  },
};

S['toolshell-sharepoint'] = {
  inks: [INK.burgundy, INK.red, INK.yellow],
  m: { kicker: 'CASO 04 — DÍA CERO', lines: ['Machine', 'Key'], size: 128, y: 300, sub: ['CVE-2025-53770 · ToolShell', 'parchear no expulsa a quien copió la llave'] },
  art() {
    const hex = n => Array.from({ length: n }, () => '0123456789ABCDEF'[RI(0, 15)]).join('');
    let rack = '', rows = '', leds = '';
    for (let u = 0; u < 16; u++) { const y = 92 + u * 42; rack += frame(720, y, 230, 34, 1.6) + rect(732, y + 12, R(60, 140), 10); leds += `<circle cx="935" cy="${y + 17}" r="5" stroke="none"/>`; }
    const keyRow = 8;
    for (let r = 0; r < 18; r++) rows += T(990, 106 + r * 38, 21, hex(40), { mono: true });
    const k = hex(40);
    return ink(INK.burgundy, rack + rows + frame(706, 80, 258, 692, 3), .8)
      + ink(INK.yellow, rect(976, 106 + keyRow * 38 - 22, 548, 34) + rect(720, 92 + 9 * 42, 230, 34), .95)
      + ink(INK.red, leds + T(990, 106 + keyRow * 38, 21, k, { mono: true }) + T(1004, 106 + keyRow * 38 + 13, 21, k, { mono: true }) + T(835, 92 + 9 * 42 + 22, 13, 'spinstall0.aspx', { mono: true, a: 'middle' }), .9);
  },
};

S['salesloft-drift-tokens-oauth'] = {
  inks: [INK.purple, INK.pink, INK.mint],
  m: { kicker: 'CASO 05 — IDENTIDAD Y OAUTH', lines: ['OAuth'], size: 150, y: 330, sub: ['un token de terceros, muchas empresas', 'Salesforce · 8–18 ago 2025'] },
  art() {
    const cx = 1110, cy = 430; let orbit = '', nodes = '', hit = '', paths = '';
    [140, 230, 320].forEach((r, k) => {
      orbit += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke-width="1.2" stroke-dasharray="${k === 2 ? '2 6' : '0'}"/>`;
      const n = [18, 34, 52][k];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + k * .2, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, h = rnd() < .38;
        paths += `<path d="M${cx} ${cy} Q ${f(cx + Math.cos(a + .5) * r * .5)} ${f(cy + Math.sin(a + .5) * r * .5)} ${f(x)} ${f(y)}" fill="none" stroke-width=".9"/>`;
        h ? (hit += `<circle cx="${f(x)}" cy="${f(y)}" r="${8 - k}" stroke="none"/>`) : (nodes += `<circle cx="${f(x)}" cy="${f(y)}" r="${5 - k}" stroke="none"/>`);
      }
    });
    let days = '';
    for (let d = 0; d < 11; d++) { const a = -Math.PI * .85 + d * .07; days += line(cx + Math.cos(a) * 360, cy + Math.sin(a) * 360, cx + Math.cos(a) * 380, cy + Math.sin(a) * 380, 3) + (d % 5 === 0 ? T(cx + Math.cos(a) * 404, cy + Math.sin(a) * 404, 12, `${8 + d}`, { mono: true, a: 'middle' }) : ''); }
    const core = halftone(cx - 110, cy - 110, 220, 220, 8, (x, y) => 1 - Math.hypot(x - cx, y - cy) / 110, 30);
    return ink(INK.mint, core, .95) + ink(INK.purple, orbit + paths + nodes + `<circle cx="${cx}" cy="${cy}" r="34" stroke="none"/>`, .85) + ink(INK.pink, hit, .95);
  },
};

S['npm-chalk-shai-hulud'] = {
  inks: [INK.green, INK.pink, INK.yellow],
  m: { kicker: 'CASO 06 — CADENA DE SUMINISTRO', lines: ['187'], size: 250, y: 380, sub: ['paquetes npm infectados', 'gusano Shai-Hulud · se replicaba solo'] },
  art() {
    const cx = 1110, cy = 430, leaves = [], links = [];
    let id = 0;
    function grow(depth, a0, a1, parent) {
      const node = { id: id++, depth, a: (a0 + a1) / 2, parent, inf: false, kids: [] };
      if (depth < 5) { const n = depth === 0 ? 7 : RI(2, depth < 2 ? 6 : 4); for (let i = 0; i < n; i++) node.kids.push(grow(depth + 1, a0 + (a1 - a0) * i / n, a0 + (a1 - a0) * (i + 1) / n, node)); }
      else leaves.push(node);
      return node;
    }
    const root = grow(0, 0, Math.PI * 2, null);
    let infected = 0;
    (function infect(n) { if (infected >= 187) return; n.inf = true; infected++; n.kids.forEach(k => { if (rnd() < (n.depth < 1 ? .45 : .8)) infect(k); }); })(root);
    const rad = d => d * 70;
    const pos = n => [cx + Math.cos(n.a) * rad(n.depth), cy + Math.sin(n.a) * rad(n.depth)];
    let ok = '', bad = '', okd = '', badd = '';
    (function walk(n) {
      n.kids.forEach(k => {
        const [x1, y1] = pos(n), [x2, y2] = pos(k), r1 = rad(n.depth), mx = cx + Math.cos(k.a) * r1, my = cy + Math.sin(k.a) * r1;
        const p = `<path d="M${f(x1)} ${f(y1)} Q ${f(mx)} ${f(my)} ${f(x2)} ${f(y2)}" fill="none" stroke-width="${k.inf ? 1.8 : 1.1}"/>`;
        k.inf ? (bad += p) : (ok += p);
        const d = `<circle cx="${f(x2)}" cy="${f(y2)}" r="${k.kids.length ? 3.4 : 2.6}" stroke="none"/>`;
        k.inf ? (badd += d) : (okd += d);
        walk(k);
      });
    })(root);
    const heat = halftone(cx - 380, cy - 380, 760, 760, 10, (x, y) => { const a = Math.atan2(y - cy, x - cx), r = Math.hypot(x - cx, y - cy); const near = leaves.filter(l => l.inf).some(l => Math.abs(((l.a - a + 9 * Math.PI) % (2 * Math.PI)) - Math.PI) < .06); return near && r < 360 ? .55 * (r / 360) : 0; }, 30);
    return ink(INK.yellow, heat, .95) + ink(INK.green, ok + okd, .8) + ink(INK.pink, bad + badd + `<circle cx="${cx}" cy="${cy}" r="10" stroke="none"/>`, .95);
  },
};

S['collins-aerospace-aeropuertos'] = {
  inks: [INK.black, INK.red, INK.yellow],
  m: { kicker: 'CASO 07 — RANSOMWARE', lines: ['MUSE'], size: 160, y: 330, sub: ['check-in compartido fuera de servicio', 'Berlín · Bruselas · Heathrow'] },
  art() {
    const codes = ['BER', 'BRU', 'LHR', 'BER', 'LHR', 'BRU', 'LHR', 'BER', 'BRU', 'LHR', 'BER'];
    let cells = '', chars = '', red = '', ylw = '';
    const flap = (x, y, ch) => { cells += frame(x, y, 34, 44, 1.6, 'rx="4"') + line(x + 2, y + 22, x + 32, y + 22, 1); if (ch) chars += T(x + 17, y + 33, 28, ch, { mono: true, a: 'middle', w: 600 }); };
    chars += T(724, 112, 15, 'SALIDAS · DEPARTURES', { mono: true, ls: 3 }) + T(1516, 112, 15, '20.09.2025', { mono: true, a: 'end', ls: 2 }) + line(724, 126, 1516, 126, 1.4);
    codes.forEach((c, r) => {
      const y = 144 + r * 56, time = `${String(RI(6, 22)).padStart(2, '0')}${RI(0, 5)}0`;
      [...time].forEach((ch, i) => flap(724 + i * 38 + (i > 1 ? 10 : 0), y, ch));
      [...c].forEach((ch, i) => flap(900 + i * 38, y, ch));
      for (let i = 0; i < 9; i++) { flap(1046 + i * 38, y, ''); red += rect(1048 + i * 38, y + 2, 30, 40, 'rx="3"'); }
      ylw += rect(1392, y + 8, 124, 28, 'rx="3"');
      chars += T(1454, y + 28, 14, 'CANCEL.', { mono: true, a: 'middle', ls: 1.5 });
    });
    const halo = halftone(1030, 136, 360, 620, 12, (x, y) => .25 + fbm(x / 70, y / 70) * .35, 45);
    return ink(INK.yellow, ylw + halo, .9) + ink(INK.red, red, .85) + ink(INK.black, cells + chars, .9);
  },
};

S['f5-codigo-big-ip-robado'] = {
  inks: [INK.blue, INK.red, INK.yellow],
  m: { kicker: 'CASO 08 — ROBO DE CÓDIGO', lines: ['BIG-IP'], size: 150, y: 330, sub: ['código fuente y fallos no divulgados', 'CISA ED 26-01 · oct 2025'] },
  art() {
    const cells = [];
    (function split(x, y, w, h, d) {
      if (d > 4 || w * h < 9000) { cells.push([x, y, w, h]); return; }
      const t = R(.3, .7);
      w > h ? (split(x, y, w * t, h, d + 1), split(x + w * t, y, w * (1 - t), h, d + 1)) : (split(x, y, w, h * t, d + 1), split(x, y + h * t, w, h * (1 - t), d + 1));
    })(720, 80, 520, 690, 0);
    const stolen = new Set(cells.map((c, i) => [c, i]).filter(([c]) => c[0] > 900 && c[1] > 250 && c[1] < 560).map(([, i]) => i));
    let blue = '', red = '', ghost = '';
    cells.forEach(([x, y, w, h], i) => {
      let codeL = ''; for (let yy = y + 12; yy < y + h - 8; yy += 11) codeL += rect(x + 8 + RI(0, 3) * 10, yy, R(20, w - 24), 5);
      if (stolen.has(i)) { ghost += frame(x + 3, y + 3, w - 6, h - 6, 1.6, 'stroke-dasharray="6 5"'); red += `<g transform="translate(${f(R(290, 320))} ${f(R(-8, 8))})">${frame(x + 3, y + 3, w - 6, h - 6, 2)}${codeL}</g>`; }
      else blue += frame(x + 3, y + 3, w - 6, h - 6, 1.6) + codeL;
    });
    const tear = halftone(1200, 200, 320, 460, 12, (x, y) => .25 + fbm(x / 80, y / 80) * .45, 45);
    return ink(INK.blue, blue + ghost, .85) + ink(INK.yellow, tear, .9) + ink(INK.red, red + `<path d="M1250 430 h40 m-14 -12 l14 12 l-14 12" fill="none" stroke-width="3"/>`, .92);
  },
};

S['jaguar-land-rover-ciberataque'] = {
  inks: [INK.blue, INK.orange, INK.yellow],
  m: { kicker: 'CASO 09 — CONTINUIDAD DEL NEGOCIO', lines: ['£1,9B'], size: 160, y: 330, sub: ['semanas de producción a cero', 'estimación del Cyber Monitoring Centre'] },
  art() {
    let cal = '', stop = '', months = '', bars = '';
    const x0 = 780, y0 = 110, cs = 27;
    for (let w = 0; w < 26; w++) for (let d = 0; d < 7; d++) {
      const day = w * 7 + d, x = x0 + w * cs, y = y0 + d * cs, off = day >= 64 && day < 100, weekend = d >= 5;
      const v = off ? 0 : (weekend ? .25 : .7 + fbm(w / 3, d) * .3) * (day >= 100 ? Math.min(1, (day - 99) / 30) : 1);
      cal += halftone(x, y, cs - 4, cs - 4, 6.5, () => v, 45);
      if (off) stop += frame(x + 1, y + 1, cs - 6, cs - 6, 1.6);
    }
    ['JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'].forEach((m, i) => { months += T(x0 + i * 4.35 * cs, y0 - 14, 13, m, { mono: true, ls: 2 }); });
    ['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach((d, i) => { months += T(x0 - 14, y0 + i * cs + 18, 12, d, { mono: true, a: 'end' }); });
    for (let w = 0; w < 26; w++) { const off = w >= 9 && w < 14, h = off ? 3 : (w >= 14 ? Math.min(1, (w - 13) / 4) : 1) * R(230, 290); bars += rect(x0 + w * cs, 760 - h, cs - 6, h); }
    const band = rect(x0 + 9 * cs - 3, y0 - 4, 5 * cs + 2, 7 * cs + 4, 'opacity=".55"') + rect(x0 + 9 * cs - 3, 760 - 300, 5 * cs + 2, 300, 'opacity=".55"');
    return ink(INK.yellow, band, .9) + ink(INK.blue, cal + bars + months + line(x0, 760, x0 + 26 * cs, 760, 1.4), .88) + ink(INK.orange, stop + T(x0 + 11.5 * cs, 430, 15, 'PARADA', { mono: true, a: 'middle', ls: 2.5 }), .95);
  },
};

S['espionaje-dirigido-por-ia'] = {
  inks: [INK.purple, INK.pink, INK.teal],
  m: { kicker: 'CASO 10 — IA OFENSIVA', lines: ['80–90%'], size: 160, y: 330, sub: ['de la intrusión ejecutada por IA', '~30 objetivos · 4–6 decisiones humanas'] },
  art() {
    const cx = 1110, cy = 430; let spiral = '', targets = '', human = '';
    for (let i = 0; i < 2400; i++) { const t = i / 2400, a = t * Math.PI * 2 * 9, r = 40 + t * 300; spiral += rect(cx + Math.cos(a) * r - .8, cy + Math.sin(a) * r - .8, 1.6, R(1.6, 6), `transform="rotate(${f(a * 57.3)} ${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)})"`); }
    for (let i = 0; i < 30; i++) { const a = (i / 30) * Math.PI * 2, x = cx + Math.cos(a) * 365, y = cy + Math.sin(a) * 365; targets += `<circle cx="${f(x)}" cy="${f(y)}" r="${i % 6 === 0 ? 13 : 8}" stroke="none"/>` + line(cx + Math.cos(a) * 342, cy + Math.sin(a) * 342, x, y, 1.2); }
    [.12, .33, .51, .72, .9].forEach(t => { const a = t * Math.PI * 2 * 9, r = 40 + t * 300; human += `<path d="M${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r - 12)} l12 12 l-12 12 l-12 -12z" stroke="none"/>`; });
    const core = halftone(cx - 90, cy - 90, 180, 180, 7, (x, y) => 1 - Math.hypot(x - cx, y - cy) / 90, 0);
    return ink(INK.purple, spiral, .85) + ink(INK.teal, targets + core, .9) + ink(INK.pink, human + T(1500, 790, 13, '◆ decisión humana', { mono: true, a: 'end' }), .95);
  },
};

S['stryker-equipos-borrados'] = {
  inks: [INK.teal, INK.black, INK.red],
  m: { kicker: 'CASO 11 — WIPER', lines: ['wipe'], size: 160, y: 330, sub: ['sin ransomware, sin rescate', 'la consola de gestión como arma'] },
  art() {
    let on = '', off = '', stat = '';
    const x0 = 720, y0 = 150, cw = 13.4, ch = 15.5;
    for (let r = 0; r < 40; r++) for (let c = 0; c < 60; c++) {
      const x = x0 + c * cw, y = y0 + r * ch, edge = 22 + fbm(r / 6, 3) * 14 + Math.sin(r / 4) * 3;
      if (c < edge) on += rect(x, y, cw - 3.2, ch - 4);
      else { off += frame(x + .5, y + .5, cw - 4, ch - 5, .8); if (c < edge + 5 && rnd() < .5) stat += rect(x + R(0, 6), y + R(0, 8), R(2, 6), 2); }
    }
    let ekg = 'M720 92 '; for (let x = 720; x <= 1520; x += 8) { const flat = x > 1040; const yy = flat ? 92 : 92 + (x % 96 === 0 ? -34 : x % 96 === 8 ? 26 : x % 96 === 16 ? -8 : 0); ekg += `L${x} ${yy} `; }
    return ink(INK.teal, on + `<path d="${ekg.split('L1048')[0]}" fill="none" stroke-width="3" stroke-linejoin="round"/>`, .9) + ink(INK.black, off, .3) + ink(INK.red, stat + `<path d="M1040 92 L1520 92" fill="none" stroke-width="3"/>` + T(1520, 76, 13, 'SIN SEÑAL', { mono: true, a: 'end', ls: 2 }), .9);
  },
};

S['trivy-escaner-envenenado'] = {
  inks: [INK.red, INK.blue, INK.green],
  m: { kicker: 'CASO 12 — CI/CD', lines: ['75/76'], size: 170, y: 330, sub: ['etiquetas de trivy-action reescritas', 'fija tus Actions por SHA, no por tag'] },
  art() {
    let bad = '', good = '';
    const clean = 46, cols = 12, w = 64, h = 34;
    const tag = (x, y) => `<path d="M${f(x)} ${f(y)} h${w - 14} l14 ${h / 2} l-14 ${h / 2} h-${w - 14}z" stroke="none"/>`;
    for (let i = 0; i < 76; i++) {
      const c = i % cols, r = Math.floor(i / cols), x = 730 + c * 66, y = 290 + r * 66;
      const lab = T(x + 8, y + 22, 11.5, `v${Math.floor(i / 10)}.${i % 10}`, { mono: true });
      i === clean ? (good += tag(x, y) + `<circle cx="${x + w - 18}" cy="${y + h / 2}" r="4" fill="${PAPER}"/>`) : (bad += tag(x, y));
      bad += i === clean ? '' : '';
      good += i === clean ? '' : '';
      if (i !== clean) bad += `<circle cx="${x + w - 18}" cy="${y + h / 2}" r="4" fill="${PAPER}" stroke="none"/>`;
      if (i === clean) good += lab;
    }
    const drip = halftone(720, 80, 800, 200, 10, (x, y) => (1 - (y - 80) / 200) * (.4 + fbm(x / 40, 2) * .7), 0);
    let drops = ''; for (let i = 0; i < 26; i++) { const x = R(730, 1510), L = R(30, 190); drops += rect(x, 120, R(3, 7), L, 'rx="3"') + `<circle cx="${f(x + 2.5)}" cy="${f(120 + L)}" r="${f(R(4, 8))}" stroke="none"/>`; }
    return ink(INK.green, drip + drops, .85) + ink(INK.red, bad, .88) + ink(INK.blue, good + T(730 + (clean % cols) * 66 + 32, 290 + Math.floor(clean / cols) * 66 + 62, 12, 'limpia', { mono: true, a: 'middle' }), .95);
  },
};

S['canvas-shinyhunters-escuelas'] = {
  inks: [INK.green, INK.pink, INK.yellow],
  m: { kicker: 'CASO 13 — EXTORSIÓN', lines: ['aulas', 'en pausa'], size: 124, y: 300, sub: ['extorsión en plena temporada de exámenes', 'cuentas gratuitas como puerta trasera'] },
  art() {
    const cx = 1110, cy = 450;
    const inLock = (x, y) => { const bx = Math.abs(x - cx) < 170 && y > cy - 20 && y < cy + 230; const ring = Math.abs(Math.hypot(x - cx, y - (cy - 20)) - 108) < 26 && y < cy - 20; const legs = (Math.abs(x - (cx - 108)) < 26 || Math.abs(x - (cx + 108)) < 26) && y >= cy - 20 && y < cy; return bx || ring || legs; };
    const keyhole = (x, y) => Math.hypot(x - cx, y - (cy + 80)) < 30 || (Math.abs(x - cx) < 13 && y > cy + 80 && y < cy + 160);
    let field = '', lockD = '';
    for (let r = 0; r < 44; r++) for (let c = 0; c < 52; c++) {
      const x = 720 + c * 15.7, y = 86 + r * 15.9;
      if (inLock(x, y) && !keyhole(x, y)) lockD += `<circle cx="${f(x)}" cy="${f(y)}" r="4.6" stroke="none"/>`;
      else if (rnd() < .9) field += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(2.4 + fbm(c / 7, r / 7) * 1.8)}" stroke="none"/>`;
    }
    const glow = halftone(cx - 300, cy - 200, 600, 520, 13, (x, y) => inLock(x, y) ? 0 : .42 - Math.hypot(x - cx, y - cy - 60) / 600, 15);
    return ink(INK.green, field, .82) + ink(INK.yellow, glow, .9) + ink(INK.pink, lockD + T(cx, cy + 300, 14, 'DATOS RETENIDOS', { mono: true, a: 'middle', ls: 3 }), .95);
  },
};

S['chatbot-meta-cuentas-instagram'] = {
  inks: [INK.violet, INK.pink, INK.yellow],
  m: { kicker: 'CASO 14 — AGENTES DE IA', lines: ['“cambia mi', 'correo”'], size: 104, y: 300, sub: ['el agente de IA obedeció', 'verificar ≠ creer lo que dice el usuario'] },
  art() {
    let ph = '', bub = '', hot = '';
    ph += `<rect x="880" y="60" width="420" height="730" rx="58" fill="none" stroke-width="10"/>` + rect(1030, 82, 120, 22, 'rx="11"');
    const msgs = [[0, 250], [1, 190], [0, 300], [1, 230], [0, 270], [1, 210], [0, 160]];
    msgs.forEach(([me, w], i) => { const y = 140 + i * 84, x = me ? 1270 - w : 910, b = `<rect x="${x}" y="${y}" width="${w}" height="58" rx="24" stroke="none"/>`; i === 4 ? (hot += b + T(x + 22, y + 36, 15, 'Hecho. Correo actualizado ✓', { mono: true }).replace('<text ', `<text fill="${PAPER}" `)) : (bub += b); });
    const keyG = `<g transform="translate(1390 520) rotate(-25)"><circle r="46" fill="none" stroke-width="16"/><rect x="40" y="-8" width="150" height="16" stroke="none"/><rect x="150" y="0" width="14" height="34" stroke="none"/><rect x="176" y="0" width="14" height="24" stroke="none"/></g>`;
    const trail = halftone(1200, 380, 320, 320, 11, (x, y) => .7 - Math.hypot(x - 1390, y - 520) / 200, 30);
    return ink(INK.violet, ph + bub, .78) + ink(INK.yellow, trail + keyG, .95) + ink(INK.pink, hot, .95);
  },
};


S['nmap-desde-cero'] = {
  inks: [INK.blue, INK.pink, INK.yellow],
  m: { kicker: 'LAB 03 — RECONOCIMIENTO', lines: ['-sS -sV'], size: 128, y: 330, sub: ['puertos 1–1024 de un objetivo de laboratorio', 'open · closed · filtered'] },
  art() {
    const open = new Set([21, 22, 23, 25, 53, 80, 111, 139, 445, 512, 513, 514]);
    let closed = '', opn = '', filt = '', labels = '';
    const x0 = 740, y0 = 100, cw = 24.5, ch = 20.5;
    for (let p = 1; p <= 1024; p++) {
      const i = p - 1, c = i % 32, r = Math.floor(i / 32), x = x0 + c * cw, y = y0 + r * ch;
      if (open.has(p)) { opn += rect(x, y, cw - 4, ch - 4); labels += T(x + (cw - 4) / 2, y - 3, 10, p, { mono: true, a: 'middle' }); }
      else if (p > 600 && p < 760) filt += rect(x + 3, y + 5, cw - 10, ch - 14);
      else closed += line(x + 2, y + ch / 2 - 2, x + cw - 6, y + ch / 2 - 2, 1.4);
    }
    const legend = [['open', 0], ['closed', 1], ['filtered', 2]].map(([t, k]) => T(x0 + k * 140 + 26, 790, 13, t, { mono: true, ls: 1.5 })).join('');
    const sweep = halftone(x0 - 6, y0 - 6, 32 * cw + 8, 32 * ch + 8, 12, (x, y) => Math.max(0, .55 - Math.abs((y - y0) / (32 * ch) - .3) * 2.2), 45);
    return ink(INK.yellow, filt + rect(x0 + 280, 780, 18, 14), .95) + ink(INK.blue, closed + line(x0 + 140, 787, x0 + 160, 787, 2) + legend, .85) + ink(INK.pink, opn + labels + rect(x0, 780, 18, 14), .95);
  },
};

S['asegura-tu-cuenta-de-azure'] = {
  inks: [INK.blue, INK.pink, INK.mint],
  m: { kicker: 'LAB 04 — IDENTIDAD EN LA NUBE', lines: ['MFA'], size: 190, y: 330, sub: ['acceso condicional y mínimo privilegio', 'Microsoft Entra ID · Azure RBAC'] },
  art() {
    const gx = 1140; let ok = '', bad = '', res = '';
    for (let i = 0; i < 160; i++) {
      const y0 = 110 + R(0, 640), blocked = rnd() < .38, y1 = 200 + (i % 5) * 120 + R(-14, 14);
      if (blocked) { bad += `<path d="M720 ${f(y0)} C 900 ${f(y0)}, 1000 ${f(y0 + R(-60, 60))}, ${gx - 8} ${f(y0 + R(-40, 40))}" fill="none" stroke-width="1.1"/>`; }
      else ok += `<path d="M720 ${f(y0)} C 920 ${f(y0)}, 1040 ${f(y1)}, 1420 ${f(y1)}" fill="none" stroke-width="1"/>`;
    }
    for (let k = 0; k < 5; k++) { const y = 200 + k * 120; res += frame(1420, y - 26, 96, 52, 2, 'rx="6"') + T(1468, y + 6, 13, ['RG-PROD', 'RG-DEV', 'KEYVAULT', 'STORAGE', 'VMs'][k], { mono: true, a: 'middle' }); }
    const gate = rect(gx - 8, 90, 16, 680) + T(gx, 82, 13, 'ACCESO CONDICIONAL', { mono: true, a: 'middle', ls: 2 });
    let xs = ''; for (let i = 0; i < 26; i++) { const y = R(110, 750); xs += `<path d="M${gx - 30} ${f(y - 7)} l14 14 m0 -14 l-14 14" fill="none" stroke-width="3"/>`; }
    const shield = halftone(gx - 120, 90, 120, 680, 10, (x, y) => (x - (gx - 120)) / 120 * .7, 0);
    return ink(INK.mint, shield, .95) + ink(INK.blue, ok + res + gate, .85) + ink(INK.pink, bad + xs + T(gx - 24, 790, 13, 'SIN MFA · BLOQUEADO', { mono: true, a: 'end', ls: 1.5 }), .92);
  },
};


S['php2shell-rce-en-php'] = {
  inks: [INK.purple, INK.red, INK.yellow],
  m: { kicker: 'CASO 15 — RCE EN EL NÚCLEO', lines: ['php2shell'], size: 132, y: 330, sub: ['CVE-2026-109618 · CVE-2026-109619', 'sin autenticación · explotado desde el 21 oct'] },
  art() {
    let reqs = '', bad = '', wall = '', labels = '';
    const x0 = 800, y0 = 110, rows = 12, rh = 52, limit = 1440;
    const hitRow = 5;
    for (let r = 0; r < rows; r++) {
      const y = y0 + r * rh; let x = x0;
      labels += T(x0 - 16, y + 25, 13, `worker ${String(r + 1).padStart(2, '0')}`, { mono: true, a: 'end' });
      let k = 0;
      while (x < 1500) {
        const w = R(36, 120), poisoned = r === hitRow && k === 3, after = r === hitRow && k === 4;
        if (poisoned) { const ww = limit - x; bad += rect(x, y, ww, rh - 16) + halftone(x, y, ww, rh - 16, 7, () => .9, 0); x = limit + 6; k++; continue; }
        const b = rect(x, y + (after ? 0 : 6), Math.min(w, 1515 - x), rh - (after ? 16 : 28), 'rx="3"');
        after ? (bad += b + `<path d="M${f(x + 6)} ${y + 6} l${f(Math.min(w, 1515 - x) - 12)} ${rh - 28} m0 -${rh - 28} l-${f(Math.min(w, 1515 - x) - 12)} ${rh - 28}" stroke="${PAPER}" stroke-width="2" fill="none"/>`) : (reqs += b);
        x += w + 8; k++;
      }
    }
    wall = rect(limit, y0 - 20, 6, rows * rh + 20) + T(limit + 14, y0 - 4, 13, 'memory_limit', { mono: true }) ;
    const heat = halftone(limit - 220, y0 + (hitRow - 2) * rh, 300, rh * 5, 11, (x, y) => (1 - Math.abs(y - (y0 + hitRow * rh + 18)) / (rh * 2.5)) * (1 - Math.abs(x - limit) / 220) * .9, 30);
    return ink(INK.yellow, heat + wall, .95) + ink(INK.purple, reqs + labels, .82) + ink(INK.red, bad + T(limit - 10, y0 + rows * rh + 14, 13, 'OOM → estado obsoleto → RCE', { mono: true, a: 'end', ls: 1 }), .95);
  },
};


S['wireshark-tu-primera-captura'] = {
  inks: [INK.blue, INK.green, INK.pink],
  m: { kicker: 'LAB 05 — ANÁLISIS DE TRÁFICO', lines: ['tcp.stream'], size: 120, y: 330, sub: ['captura, filtra y sigue una conversación', 'HTTP sin cifrar = contraseñas a la vista'] },
  art() {
    const protos = ['TCP', 'TCP', 'DNS', 'TCP', 'TLS', 'ARP', 'HTTP', 'TCP', 'DNS', 'TLS'];
    let rows = '', grn = '', hot = '';
    const x0 = 720, y0 = 96, rh = 27;
    rows += T(x0 + 8, y0 - 10, 12, 'No.     Origen           Destino          Proto   Info', { mono: true, ls: .5 }) + line(x0, y0 - 4, 1520, y0 - 4, 1.4);
    for (let i = 0; i < 22; i++) {
      const y = y0 + i * rh, pr = i === 13 ? 'HTTP' : protos[RI(0, protos.length - 1)];
      const txt = `${String(i + 41).padStart(4, ' ')}   192.168.56.${i % 3 ? 102 : 101}   192.168.56.${i % 3 ? 101 : 102}   ${pr.padEnd(6, ' ')}`;
      if (i === 13) { hot += rect(x0, y + 4, 800, rh - 4) + T(x0 + 8, y + 22, 13.5, `${txt}POST /dvwa/login.php`, { mono: true }).replace('<text ', `<text fill="${PAPER}" `); continue; }
      if (pr === 'DNS' || pr === 'TLS') grn += rect(x0, y + 4, 800, rh - 4, 'opacity=".55"');
      rows += T(x0 + 8, y + 22, 13.5, txt + (pr === 'DNS' ? 'Standard query A lab.local' : pr === 'TLS' ? 'Client Hello' : pr === 'ARP' ? 'Who has 192.168.56.1?' : '[ACK] Seq=1 Ack=1'), { mono: true });
    }
    const pane = frame(x0, y0 + 22 * rh + 12, 800, 70, 1.6) + T(x0 + 14, y0 + 22 * rh + 40, 13.5, 'HTML Form URL Encoded', { mono: true }) ;
    const secret = T(x0 + 14, y0 + 22 * rh + 66, 15, 'username=admin  &amp;  password=lab-123', { mono: true, w: 600 });
    const pre = t => t.replaceAll('<text ', '<text style="white-space:pre" ');
    return ink(INK.green, grn, .5) + ink(INK.blue, pre(rows) + pane, .85) + ink(INK.pink, pre(hot) + secret, .95);
  },
};

S['contrasenas-2fa-y-passkeys'] = {
  inks: [INK.federal, INK.yellow, INK.pink],
  m: { kicker: 'LAB 06 — CUENTAS PERSONALES', lines: ['2FA'], size: 200, y: 340, sub: ['gestor de contraseñas · 2FA · passkeys', 'tres cambios, veinte minutos'] },
  art() {
    const pw = [['Pedro2024!', 10], ['Verano2025', 10], ['tubanco_123', 11], ['lámpara-río-tostada-nube-piano', 30]];
    let rows = '', bars = '', strong = '';
    pw.forEach(([w, n], i) => {
      const y = 140 + i * 120, good = i === 3;
      const label = T(730, y, 18, w, { mono: true, w: good ? 600 : 400 });
      let cells = ''; for (let k = 0; k < n; k++) cells += rect(730 + k * 25, y + 16, 19, 34, 'rx="3"');
      good ? (strong += label + cells) : (rows += label + cells + `<path d="M720 ${y + 33} h${n * 25 + 20}" stroke-width="3"/>`);
    });
    const shield = `<g transform="translate(1340 650)"><path d="M0 -110 L95 -70 V10 C95 70 50 105 0 125 C-50 105 -95 70 -95 10 V-70Z" fill="none" stroke-width="12"/><path d="M-40 5 l30 30 l55 -60" fill="none" stroke-width="14" stroke-linecap="round"/></g>`;
    const glow = halftone(1180, 500, 320, 300, 11, (x, y) => .75 - Math.hypot(x - 1340, y - 650) / 200, 30);
    return ink(INK.yellow, glow, .95) + ink(INK.federal, rows + T(730, 108, 13, 'LONGITUD = RESISTENCIA', { mono: true, ls: 2.5 }), .82) + ink(INK.pink, strong + shield, .95);
  },
};

S['es-phishing-lee-las-cabeceras'] = {
  inks: [INK.black, INK.red, INK.yellow],
  m: { kicker: 'LAB 07 — PHISHING', lines: ['dmarc=fail'], size: 112, y: 330, sub: ['el remitente se falsifica; las cabeceras no', 'SPF · DKIM · DMARC · Reply-To'] },
  art() {
    const L = [
      ['Received: from mail.tubanco-seguridad.net (203.0.113.45)', 0],
      ['Return-Path: &lt;bounce@tubanco-seguridad.net&gt;', 1],
      ['From: "Tu Banco" &lt;soporte@tubanco.com&gt;', 1],
      ['Reply-To: verificacion.tubanco@gmail.com', 1],
      ['Subject: Actividad inusual: confirme su cuenta', 0],
      ['Authentication-Results: mx.google.com;', 0],
      ['   spf=softfail smtp.mailfrom=tubanco-seguridad.net', 2],
      ['   dkim=none', 2],
      ['   dmarc=fail (p=REJECT) header.from=tubanco.com', 2],
      ['Content-Type: text/html; charset="UTF-8"', 0],
      ['X-Mailer: PHPMailer', 0],
    ];
    let txt = '', hi = '', red = '';
    L.forEach(([l, k], i) => {
      const y = 140 + i * 50;
      if (k === 1) hi += rect(712, y - 26, 808, 36);
      (k === 2 ? (red += T(724, y, 19, l, { mono: true, w: 600 })) : (txt += T(724, y, 19, l, { mono: true })));
    });
    const stamp = `<g transform="translate(1360 690) rotate(-12)"><rect x="-140" y="-46" width="280" height="92" rx="10" fill="none" stroke-width="8"/>${T(0, 18, 46, 'PHISHING', { a: 'middle', ls: 2 })}</g>`;
    return ink(INK.yellow, hi, .8) + ink(INK.black, txt + frame(700, 96, 830, 590, 1.6), .85) + ink(INK.red, red + stamp, .92);
  },
};


S['certificacion-ehca-hacking-etico'] = {
  inks: [INK.blue, INK.pink, INK.yellow],
  m: { kicker: 'CERT 01 — HACKING ÉTICO', lines: ['EHCA'], size: 200, y: 340, sub: ['Ethical Hacking Certified Associate', '50 preguntas · 75 min · aprobado 70 %'] },
  art() {
    const parts = [['Ética y marco legal', 12], ['Reconocimiento', 16], ['Escaneo', 20], ['Enumeración', 14], ['Explotación', 22], ['Informes', 16]];
    const cx = 1120, cy = 430, r0 = 170, r1 = 300; let a = -Math.PI / 2, blue = '', pink = '', lab = '';
    parts.forEach(([n, w], i) => {
      const a1 = a + w / 100 * Math.PI * 2 - .02, big = a1 - a > Math.PI ? 1 : 0;
      const P = (r, t) => `${f(cx + Math.cos(t) * r)} ${f(cy + Math.sin(t) * r)}`;
      const d = `M${P(r1, a)} A${r1} ${r1} 0 ${big} 1 ${P(r1, a1)} L${P(r0, a1)} A${r0} ${r0} 0 ${big} 0 ${P(r0, a)}Z`;
      (i === 4 || i === 0 || i === 5) ? (pink += `<path d="${d}" stroke="none"/>`) : (blue += `<path d="${d}" stroke="none"/>`);
      const m = (a + a1) / 2, lx = cx + Math.cos(m) * (r1 + 34), ly = cy + Math.sin(m) * (r1 + 34);
      lab += T(lx, ly, 14, `${n} ${w}%`, { mono: true, a: Math.cos(m) > 0 ? 'start' : 'end' });
      a = a1 + .02;
    });
    const core = halftone(cx - r0, cy - r0, r0 * 2, r0 * 2, 10, (x, y) => Math.max(0, .8 - Math.hypot(x - cx, y - cy) / r0), 15);
    return ink(INK.yellow, core, .95) + ink(INK.blue, blue + lab, .85) + ink(INK.pink, pink + T(cx, cy + 10, 18, 'CICLO DE PENTEST', { mono: true, a: 'middle', ls: 2.5 }).replace('<text ', '<text fill="#262524" '), .9);
  },
};

S['cisco-ccna-redes'] = {
  inks: [INK.teal, INK.orange, INK.yellow],
  m: { kicker: 'CERT 02 — REDES', lines: ['CCNA'], size: 200, y: 340, sub: ['Cisco Networking Academy · cursos 1, 2 y 3', 'ITN · SRWE · ENSA → examen 200-301'] },
  art() {
    const layers = ['7 APLICACIÓN', '6 PRESENTACIÓN', '5 SESIÓN', '4 TRANSPORTE', '3 RED', '2 ENLACE', '1 FÍSICA'];
    let stack = '', hl = '';
    layers.forEach((l, i) => { const y = 92 + i * 52; stack += frame(720, y, 250, 42, 1.8) + T(736, y + 27, 14, l, { mono: true, ls: 1.5 }); if (i >= 4 && i <= 5 || i === 3) hl += rect(722, y + 2, 246, 38); });
    const router = (x, y) => `<circle cx="${x}" cy="${y}" r="30" fill="none" stroke-width="3"/>${line(x - 18, y, x + 18, y, 3)}${line(x, y - 18, x, y + 18, 3)}`;
    const sw = (x, y) => frame(x - 40, y - 16, 80, 32, 3, 'rx="4"') + line(x - 24, y - 4, x + 24, y - 4, 2) + line(x - 24, y + 6, x + 24, y + 6, 2);
    let topo = router(1250, 150) + router(1430, 230) + line(1280, 160, 1400, 220, 2.5);
    const sws = [[1110, 360], [1300, 400], [1460, 430]]; sws.forEach(([x, y]) => topo += sw(x, y) + line(x, y - 16, 1250, 180, 1.6));
    let hosts = '', vlan = '';
    sws.forEach(([x, y], k) => { for (let h = 0; h < 4; h++) { const hx = x - 54 + h * 36, hy = y + 120 + (h % 2) * 40, v = (h + k) % 2; const node = rect(hx - 12, hy - 10, 24, 20, 'rx="3"') + line(x, y + 16, hx, hy - 10, 1.2); v ? (vlan += node) : (hosts += node); } });
    const acl = `<g transform="translate(1250 260)">${frame(-70, -20, 140, 40, 2.5, 'rx="20"')}${T(0, 7, 14, 'ACL · NAT · VPN', { mono: true, a: 'middle' })}</g>`;
    return ink(INK.yellow, hl + halftone(1060, 520, 460, 220, 12, () => .3, 30), .9) + ink(INK.teal, stack + topo + hosts + acl, .85) + ink(INK.orange, vlan + T(1520, 790, 13, '■ VLAN 20   □ VLAN 10', { mono: true, a: 'end' }), .92);
  },
};

S['azure-fundamentals-az-900'] = {
  inks: [INK.blue, INK.mint, INK.pink],
  m: { kicker: 'CERT 03 — NUBE', lines: ['AZ-900'], size: 180, y: 340, sub: ['Microsoft Azure Fundamentals', 'nube 25–30 % · servicios 35–40 % · gobierno 30–35 %'] },
  art() {
    const box = (x, y, w, h, lab, sw, dash = '') => frame(x, y, w, h, sw, `rx="14" ${dash}`) + T(x + 16, y + 26, 13, lab, { mono: true, ls: 2 });
    let b = box(720, 80, 800, 700, 'MANAGEMENT GROUP', 3);
    const subs = [[750, 130, 370, 620, 'SUSCRIPCIÓN · PROD'], [1140, 130, 350, 620, 'SUSCRIPCIÓN · DEV']];
    let m = '', p = '', res = '';
    subs.forEach(([x, y, w, h, l]) => { m += box(x, y, w, h, l, 2.5); for (let g = 0; g < 2; g++) { const gy = y + 50 + g * 285; p += box(x + 18, gy, w - 36, 260, `RESOURCE GROUP ${g + 1}`, 2, 'stroke-dasharray="8 6"'); for (let i = 0; i < 6; i++) { const rx = x + 50 + (i % 3) * ((w - 100) / 3), ry = gy + 80 + Math.floor(i / 3) * 95; res += `<circle cx="${f(rx + 30)}" cy="${f(ry + 20)}" r="${f(R(16, 26))}" stroke="none"/>`; } } });
    const shield = halftone(720, 80, 800, 700, 14, (x, y) => .18 + fbm(x / 160, y / 160) * .18, 45);
    return ink(INK.mint, shield + res, .9) + ink(INK.blue, b + m, .85) + ink(INK.pink, p + T(1505, 805, 13, 'RBAC · POLICY · LOCKS', { mono: true, a: 'end', ls: 2 }), .9);
  },
};


S['pmj-pentester-mentor-junior'] = {
  inks: [INK.purple, INK.yellow, INK.pink],
  m: { kicker: 'CERT 04 — PENTESTING GAMIFICADO', lines: ['PMJ'], size: 200, y: 340, sub: ['Pentester Mentor Junior · Hacker Mentor', 'misiones 0–8 + reto final de caja negra'] },
  art() {
    const pts = [[760, 700], [880, 610], [780, 500], [920, 410], [1060, 480], [1180, 380], [1080, 270], [1240, 190], [1380, 270], [1450, 130]];
    const labels = ['RECON', 'WEB', 'LFI → RCE', 'LINUX', 'SUID', 'CRON', 'WINDOWS', 'AD · KERBEROS', 'PRIVESC', 'CAJA NEGRA'];
    let path = '';
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, g = i === pts.length - 1 ? 52 : 34; path += `M${f(x0 + ux * 34)} ${f(y0 + uy * 34)} L${f(x1 - ux * g)} ${f(y1 - uy * g)} `; }
    let nodes = '', done = '', labs = '', boss = '';
    pts.forEach(([x, y], i) => {
      const last = i === pts.length - 1;
      if (last) { boss += `<path d="M${x} ${y - 46} l40 23 v46 l-40 23 l-40 -23 v-46z" stroke="none"/>`; labs += T(x, y + 72, 14, labels[i], { mono: true, a: 'middle', ls: 2 }); return; }
      (i < 7 ? (done += `<circle cx="${x}" cy="${y}" r="24" stroke="none"/>`) : (nodes += `<circle cx="${x}" cy="${y}" r="24" fill="none" stroke-width="4"/>`));
      labs += T(x, y + 6, 15, i, { mono: true, a: 'middle', w: 700 }) + T(x + (i % 2 ? 34 : -34), y - 30, 13, labels[i], { mono: true, a: i % 2 ? 'start' : 'end', ls: 1.5 });
    });
    const xp = rect(720, 780, 560, 14, 'rx="7"');
    const glow = halftone(1330, 20, 240, 240, 10, (x, y) => .85 - Math.hypot(x - 1450, y - 130) / 130, 30);
    return ink(INK.yellow, glow + done + xp, .95) + ink(INK.purple, `<path d="${path}" fill="none" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round"/>` + nodes + labs + frame(720, 780, 800, 14, 1.6, 'rx="7"') + T(1520, 770, 13, 'XP', { mono: true, a: 'end', ls: 2 }), .88) + ink(INK.pink, boss, .95);
  },
};

S['iso-27001-auditor-interno'] = {
  inks: [INK.blue, INK.yellow, INK.pink],
  m: { kicker: 'CERT 05 — GOBIERNO Y AUDITORÍA', lines: ['27001'], size: 190, y: 340, sub: ['ISO/IEC 27001:2022 · auditor interno', '93 controles · 4 temas · 11 nuevos'] },
  art() {
    // Anexo A 2022: una celda por control; en rosa los 11 controles nuevos
    const temas = [['5 · ORGANIZACIONALES', 37, [7, 23, 30]], ['6 · PERSONAS', 8, []], ['7 · FÍSICOS', 14, [4]], ['8 · TECNOLÓGICOS', 34, [9, 10, 11, 12, 16, 23, 28]]];
    const x0 = 760, px = 66, ph = 44, cw = 54, ch = 32;
    let y = 96, cells = '', news = '', labs = '';
    for (const [name, n, nuevos] of temas) {
      labs += T(x0, y + 4, 14, name, { mono: true, ls: 2 }) + T(x0 + 10 * px - 12, y + 4, 14, String(n), { mono: true, a: 'end', w: 700 });
      y += 20;
      for (let i = 0; i < n; i++) {
        const cx = x0 + (i % 10) * px, cy = y + Math.floor(i / 10) * ph;
        if (nuevos.includes(i + 1)) { news += rect(cx, cy, cw, ch, 'rx="5"'); }
        else cells += rect(cx, cy, cw, ch, 'rx="5"');
      }
      y += Math.ceil(n / 10) * ph + 26;
    }
    const glow = halftone(720, 80, 820, 700, 12, (x, yy) => .25 + fbm(x / 140, yy / 140) * .2, 30);
    return ink(INK.yellow, glow, .8) + ink(INK.blue, cells + labs, .82) + ink(INK.pink, news + T(1514, 790, 13, '■ NUEVOS EN 2022', { mono: true, a: 'end', ls: 2 }), .95);
  },
};

S['ley-8968-proteccion-datos-costa-rica'] = {
  inks: [INK.teal, INK.yellow, INK.red],
  m: { kicker: 'CERT 06 — PRIVACIDAD', lines: ['8968'], size: 210, y: 340, sub: ['Ley de Protección de Datos · Costa Rica', 'brecha → aviso a los titulares en 5 días hábiles'] },
  art() {
    // línea de tiempo de una brecha: día 0 incidente, día hábil 5 aviso a los titulares (reglamento Ley 8968, art. 38)
    const x0 = 760, x1 = 1500, y = 470, dx = (x1 - x0) / 5;
    let axis = `<path d="M${x0} ${y} H${x1}" stroke-width="4" fill="none"/>`, ticks = '', labs = '', hot = '';
    for (let d = 0; d <= 5; d++) { const x = x0 + d * dx; ticks += `<path d="M${f(x)} ${y - 16} V${y + 16}" stroke-width="3"/>`; labs += T(x, y + 52, 15, `DÍA ${d}`, { mono: true, a: 'middle', ls: 1.5 }); }
    const flag = (d, h, txt, left) => { const x = x0 + d * dx, bx = left ? x - 250 : x; return `<path d="M${f(x)} ${y} V${y - h}" stroke-width="3"/>` + rect(bx, y - h, 250, 52, 'rx="6"') + T(bx + 14, y - h + 33, 15, txt, { mono: true, ls: 1.2, raw: true }).replace('<text ', `<text fill="${PAPER}" `); };
    hot += flag(0, 300, 'OCURRE LA BRECHA');
    const marks = flag(5, 230, 'AVISO A TITULARES', true);
    // registros personales que se filtran: filas de datos difuminadas
    let rows = '';
    for (let i = 0; i < 9; i++) { const ry = 580 + i * 22, w = R(180, 640); rows += rect(x0, ry, w, 10, 'rx="3"'); }
    const leak = halftone(720, 540, 820, 240, 11, (x, yy) => .7 - (x - 720) / 900 + fbm(x / 90, yy / 90) * .2, 20);
    return ink(INK.yellow, leak, .85) + ink(INK.teal, axis + ticks + labs + rows, .85) + ink(INK.red, hot + marks, .95);
  },
};

S['maquinas-pmj-pentesting'] = {
  inks: [INK.purple, INK.yellow, INK.red],
  m: { kicker: 'LAB 08 — PENTESTING', lines: ['8 / 8'], size: 230, y: 340, sub: ['las máquinas del PMJ, comprometidas', 'enumerar · explotar · escalar · informar'] },
  art() {
    // 8 hosts en rejilla 4x2; cada uno con bandera root; los de caja negra en rojo
    const names = ['KIO', 'ETHERNAL', 'MONKEY', 'NAVIBOLT', 'STEEL', 'GAMEZONE', 'ALFRED', 'ROBOT'];
    const x0 = 740, y0 = 110, cw = 185, ch = 150, gx = 16, gy = 28;
    let boxes = '', screens = '', flags = '', labs = '', root = '';
    names.forEach((n, i) => {
      const x = x0 + (i % 4) * (cw + gx), y = y0 + Math.floor(i / 4) * (ch + gy);
      const boss = i === 7;
      boxes += frame(x, y, cw, ch - 34, 3, 'rx="8"');
      screens += halftone(x + 10, y + 10, cw - 20, ch - 72, 9, (px, py) => .28 + fbm(px / 70, py / 70) * .22, 25);
      // pata y base del monitor
      boxes += `<path d="M${f(x + cw / 2 - 18)} ${f(y + ch - 34)} h36 l8 24 h-52z" stroke="none"/>`;
      // banderita de root conquistado
      const fx = x + cw - 40, fy = y + 18;
      const fl = `<path d="M${f(fx)} ${f(fy)} v38" stroke-width="3"/>` + `<path d="M${f(fx)} ${f(fy)} l30 9 l-30 9z" stroke="none"/>`;
      if (boss) root += fl; else flags += fl;
      labs += T(x + cw / 2, y + ch + 4, 14, n, { mono: true, ls: 1, w: 700, a: 'middle' });
    });
    return ink(INK.yellow, screens, .85) + ink(INK.purple, boxes + labs + flags, .85) + ink(INK.red, root + T(x0 + 4 * (cw + gx) - gx, y0 + 2 * (ch + gy) + 34, 13, 'ROOT / SYSTEM', { mono: true, a: 'end', ls: 2 }), .95);
  },
};

S['comptia-security-plus-en-que-consiste'] = {
  inks: [INK.blue, INK.yellow, INK.pink],
  m: { kicker: 'GUÍA — FUNDAMENTOS', lines: ['Security+'], size: 150, y: 330, sub: ['CompTIA SY0-701 · cinco dominios', '90 preguntas · 90 min · se aprueba con 750/900'] },
  art() {
    // barras horizontales de los 5 dominios por peso; la mayor (operaciones) resaltada
    const doms = [['4.0 OPERACIONES', 28], ['2.0 AMENAZAS', 22], ['5.0 GESTIÓN', 20], ['3.0 ARQUITECTURA', 18], ['1.0 CONCEPTOS', 12]];
    const x0 = 760, y0 = 120, bh = 70, gap = 42, max = 28, full = 740;
    let bars = '', top = '', labs = '', ticks = '';
    doms.forEach(([n, w], i) => {
      const y = y0 + i * (bh + gap), bw = full * w / max;
      if (i === 0) top += rect(x0, y, bw, bh, 'rx="6"'); else bars += rect(x0, y, bw, bh, 'rx="6"');
      labs += T(x0, y - 12, 16, n, { mono: true, ls: 1.5 });
      labs += T(x0 + bw + 16, y + bh / 2 + 10, 30, w + '%', { mono: true, w: 700 });
    });
    // rejilla de fondo vertical
    for (let g = 0; g <= 28; g += 7) { const x = x0 + full * g / max; ticks += `<path d="M${f(x)} ${y0 - 6} V${y0 + 5 * (bh + gap) - gap + 6}" stroke-width="1.5" stroke-dasharray="3 9"/>`; }
    const glow = halftone(x0, y0, full + 120, 5 * (bh + gap), 12, (x, y) => .12 + fbm(x / 150, y / 150) * .14, 40);
    return ink(INK.yellow, glow, .8) + ink(INK.blue, ticks + bars + labs, .85) + ink(INK.pink, top, .95);
  },
};

S['octubre-negro-2026'] = {
  inks: [INK.black, INK.yellow, INK.red],
  m: { kicker: 'CASO 16 — OLEADA', lines: ['10 en 4'], size: 170, y: 330, sub: ['Octubre Negro 2026', 'del 20 al 23 de octubre · PHP2Shell, GitLab, LiteLLM…'] },
  art() {
    // un bloque por incidente apilado sobre su día; el 21 concentra seis
    const days = [['20 OCT', ['ORACLE', 'SAFEPAY']], ['21 OCT', ['PHP2SHELL', 'GITLAB', 'NODE.JS', 'LITELLM', 'CONNECTWISE', 'RAILWAY']], ['22 OCT', ['EDK II']], ['23 OCT', ['PHP']]];
    const x0 = 760, base = 700, cw = 175, gx = 20, bh = 76, gy = 10;
    let cols = '', hot = '', labs = '', axis = `<path d="M${x0 - 10} ${base + 6} H${x0 + 4 * (cw + gx)}" stroke-width="4" fill="none"/>`;
    days.forEach(([d, items], i) => {
      const x = x0 + i * (cw + gx);
      labs += T(x + cw / 2, base + 46, 18, d, { mono: true, a: 'middle', w: 700, ls: 1.5 });
      items.forEach((n, j) => {
        const y = base - (j + 1) * (bh + gy) + gy;
        const r = rect(x, y, cw, bh, 'rx="6"');
        if (i === 1) hot += r; else cols += r;
        labs += T(x + 12, y + bh / 2 + 7, 15, n, { mono: true, ls: 1, w: 700, raw: true }).replace('<text ', `<text fill="${PAPER}" `);
      });
    });
    const glow = halftone(720, 60, 840, 660, 12, (x, y) => .2 + fbm(x / 120, y / 120) * .25, 35);
    return ink(INK.yellow, glow, .75) + ink(INK.black, axis + cols, .85) + ink(INK.red, hot, .95) + labs;
  },
};

S['microsoft-authenticator-authmask'] = {
  inks: [INK.blue, INK.yellow, INK.red],
  m: { kicker: 'CASO 17 — IDENTIDAD', lines: ['AuthMask'], size: 128, y: 330, sub: ['Microsoft Authenticator · Android', 'CVE-2026-80097 · corregido en 6.2606.4246'] },
  art() {
    // dos apps dicen «soy Teams»: la real y la disfrazada; Authenticator entrega el pase a las dos
    const card = (x, y, w, h) => frame(x, y, w, h, 3, 'rx="14"');
    const key = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="20" fill="none" stroke-width="7"/>` + rect(x + 18, y - 4, 70, 9, 'rx="3"') + rect(x + 62, y + 4, 9, 18) + rect(x + 78, y + 4, 9, 14);
    const bx = 1180, by = 330, bw = 320, bh = 170;
    let blue = card(bx, by, bw, bh) + T(bx + bw / 2, by + 78, 22, 'AUTHENTICATOR', { mono: true, a: 'middle', w: 700, ls: 2 }) + T(bx + bw / 2, by + 116, 15, 'entrega el pase', { mono: true, a: 'middle', ls: 1.5 });
    blue += card(740, 140, 300, 130) + T(890, 200, 26, 'TEAMS', { mono: true, a: 'middle', w: 700, ls: 3 }) + T(890, 238, 15, 'app real', { mono: true, a: 'middle', ls: 1.5 });
    blue += `<path d="M1040 205 C1110 205 1110 380 ${bx} 380" fill="none" stroke-width="4" stroke-dasharray="3 10" stroke-linecap="round"/>` + key(1080, 300);
    // la impostora: mismo nombre, máscara con dos ojos
    let red = rect(740, 560, 300, 130, 'rx="14"') + `<path d="M1040 625 C1110 625 1110 450 ${bx} 450" fill="none" stroke-width="4" stroke-dasharray="3 10" stroke-linecap="round"/>` + key(1080, 545);
    const mask = `<path d="M790 590 q50 -26 100 0 q50 -26 100 0 v26 q-50 30 -100 6 q-50 24 -100 -6z" fill="${PAPER}" stroke="none"/>` + `<ellipse cx="840" cy="604" rx="16" ry="9" stroke="none"/><ellipse cx="940" cy="604" rx="16" ry="9" stroke="none"/>`;
    red += mask + T(890, 668, 26, '«TEAMS»', { mono: true, a: 'middle', w: 700, ls: 3 }).replace('<text ', `<text fill="${PAPER}" `);
    const glow = halftone(700, 480, 520, 300, 11, (x, y) => .75 - Math.hypot(x - 890, y - 625) / 330, 25);
    return ink(INK.yellow, glow, .85) + ink(INK.blue, blue, .88) + ink(INK.red, red, .95);
  },
};

const META = {
  'Primer-Post': ['2024-08-18', '#PRESENTACIÓN', 'N.º 00'], 'Kali-Linux-para-Hackers': ['2024-08-22', '#LABORATORIO', 'LAB 01'], 'Virtualizadores': ['2024-08-26', '#VIRTUALIZACIÓN', 'LAB 02'],
  'deepseek-base-de-datos-expuesta': ['2025-02-01', 'T1595 · T1530', 'CASO 01'], 'bybit-robo-1500-millones': ['2025-02-26', 'T1195 · T1565', 'CASO 02'], 'ms-coop-llamada-mesa-de-ayuda': ['2025-05-09', 'T1656 · T1078', 'CASO 03'],
  'toolshell-sharepoint': ['2025-07-26', 'T1190 · T1505.003', 'CASO 04'], 'salesloft-drift-tokens-oauth': ['2025-08-31', 'T1199 · T1550.001', 'CASO 05'], 'npm-chalk-shai-hulud': ['2025-09-24', 'T1195.002', 'CASO 06'],
  'collins-aerospace-aeropuertos': ['2025-09-25', 'T1486', 'CASO 07'], 'f5-codigo-big-ip-robado': ['2025-10-19', 'T1195.002 · T1190', 'CASO 08'], 'jaguar-land-rover-ciberataque': ['2025-10-24', 'T1486 · T1489', 'CASO 09'],
  'espionaje-dirigido-por-ia': ['2025-11-17', 'IA · APT', 'CASO 10'], 'stryker-equipos-borrados': ['2026-03-15', 'T1485 · T1561', 'CASO 11'], 'trivy-escaner-envenenado': ['2026-03-24', 'T1195.002 · T1552', 'CASO 12'],
  'canvas-shinyhunters-escuelas': ['2026-05-11', 'T1567 · T1491', 'CASO 13'], 'chatbot-meta-cuentas-instagram': ['2026-06-04', 'T1656 · T1098', 'CASO 14'],
  'nmap-desde-cero': ['2024-10-14', '#LABORATORIO', 'LAB 03'], 'certificacion-ehca-hacking-etico': ['2026-10-12', '#CERTIFICACIONES', 'CERT 01'], 'pmj-pentester-mentor-junior': ['2026-10-19', '#CERTIFICACIONES', 'CERT 04'], 'iso-27001-auditor-interno': ['2026-11-02', '#CERTIFICACIONES', 'CERT 05'], 'ley-8968-proteccion-datos-costa-rica': ['2026-11-02', '#PRIVACIDAD', 'CERT 06'], 'maquinas-pmj-pentesting': ['2026-11-03', '#LABORATORIO', 'LAB 08'], 'comptia-security-plus-en-que-consiste': ['2026-11-03', '#CERTIFICACIONES', 'GUÍA'], 'octubre-negro-2026': ['2026-11-03', '#VULNERABILIDADES', 'CASO 16'], 'microsoft-authenticator-authmask': ['2026-11-03', '#IDENTIDAD', 'CASO 17'], 'cisco-ccna-redes': ['2026-09-14', '#CERTIFICACIONES', 'CERT 02'], 'azure-fundamentals-az-900': ['2026-08-10', '#CERTIFICACIONES', 'CERT 03'], 'wireshark-tu-primera-captura': ['2024-11-18', '#LABORATORIO', 'LAB 05'], 'contrasenas-2fa-y-passkeys': ['2025-01-20', '#IDENTIDAD', 'LAB 06'], 'es-phishing-lee-las-cabeceras': ['2025-04-07', '#PHISHING', 'LAB 07'], 'php2shell-rce-en-php': ['2026-10-27', 'T1190', 'CASO 15'], 'asegura-tu-cuenta-de-azure': ['2025-06-23', '#AZURE · #IDENTIDAD', 'LAB 04'],
};

// número de serie = orden cronológico dentro de LAB/CASO/CERT; fecha = la del archivo del post
const POSTS = fs.readdirSync(path.join(__dirname, '../../src/posts'));
for (const slug of Object.keys(S)) {
  const f = POSTS.find(n => n.slice(11, -3) === slug);
  if (!f) throw new Error('sin post: ' + slug);
  META[slug][0] = f.slice(0, 10);
}
if (POSTS.length !== Object.keys(S).length) throw new Error('posts sin portada: ' + POSTS.length);
for (const pre of ['LAB', 'CASO', 'CERT']) {
  Object.keys(META).filter(k => META[k][2].startsWith(pre + ' ')).sort((x, y) => META[x][0].localeCompare(META[y][0]))
    .forEach((k, i) => { const no = `${pre} ${String(i + 1).padStart(2, '0')}`; META[k][2] = no; S[k].m.kicker = S[k].m.kicker.replace(/^\S+ \d\d/, no); });
}
if (process.env.LIST) { for (const k of Object.keys(META).sort((x, y) => META[x][0].localeCompare(META[y][0]))) console.log(META[k][0], META[k][2], '|', S[k].m.kicker, '|', k); process.exit(0); }
const only = process.argv.slice(3);
for (const [slug, sc] of Object.entries(S)) {
  if (only.length && !only.includes(slug)) continue;
  rnd = prng(slug); noiseInit();
  const [date, tag, no] = META[slug];
  const art = sc.art();
  fs.writeFileSync(path.join(out, `${slug}.svg`), poster(slug, { ...sc.m, date, tag, no }, sc.inks, art));
}
console.log('ok');
