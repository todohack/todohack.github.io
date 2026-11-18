// Generador estático de Todohack. Sin dependencias: `node build.js`
// Lee todo de src/ y escribe el sitio completo en _site/ (lo publica la GitHub Action).
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, '_site');
// Huella del contenido en la URL: tras cada cambio el navegador descarga el CSS/JS nuevo en vez de usar la caché.
const v = f => require('crypto').createHash('sha256').update(fs.readFileSync(path.join(ROOT, 'src/assets', f))).digest('hex').slice(0, 10);
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/site.json'), 'utf8'));
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fecha = d => `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
const slugify = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- Front matter (subconjunto YAML: `clave: valor` y `clave: [a, b]`) ----------
function parseFront(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('[')) v = v.slice(1, -1).split(',').map(x => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    else v = v.replace(/^["']|["']$/g, '');
    meta[kv[1]] = v;
  }
  return { meta, body: src.slice(m[0].length) };
}

// ---------- Markdown (subconjunto: lo que usan los posts) ----------
function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(esc(c)) - 1}\u0000`);
  s = s
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, t, href, title) => {
      const ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${href}"${title ? ` title="${title}"` : ''}${ext}>${t}</a>`;
    })
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?=[^*\w]|$)/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
}

function markdown(src, headings = []) {
  const lines = src.replace(/\r/g, '').split('\n');
  const out = [];
  let i = 0;
  const isBlockStart = l => /^(#{1,6}\s|```|>|\s*[-*]\s|\s*\d+\.\s|:::|<|---\s*$)/.test(l);

  function list(indent) {
    const ordered = /^\s*\d+\./.test(lines[i]);
    const items = [];
    while (i < lines.length) {
      const l = lines[i];
      const m = l.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
      const depth = m ? m[1].replace(/\t/g, '    ').length : -1;
      if (m && depth === indent) { items.push(inline(m[3])); i++; continue; }
      if (m && depth > indent) { items[items.length - 1] += list(depth); continue; }
      if (l.trim() === '' && i + 1 < lines.length && /^(\s+)([-*]|\d+\.)\s/.test(lines[i + 1])) { i++; continue; }
      break;
    }
    const tag = ordered ? 'ol' : 'ul';
    return `<${tag}>${items.map(x => `<li>${x}</li>`).join('')}</${tag}>`;
  }

  while (i < lines.length) {
    const l = lines[i];
    if (l.trim() === '') { i++; continue; }
    let m;
    if ((m = l.match(/^```(\w*)/))) {
      const buf = [];
      for (i++; i < lines.length && !lines[i].startsWith('```'); i++) buf.push(lines[i]);
      i++;
      out.push(`<pre><code${m[1] ? ` class="lang-${m[1]}"` : ''}>${esc(buf.join('\n').replace(/^\n+|\n+$/g, ''))}</code></pre>`);
    } else if ((m = l.match(/^:::\s*(\w+)\s*(.*)$/))) {
      const buf = [];
      for (i++; i < lines.length && !/^:::\s*$/.test(lines[i]); i++) buf.push(lines[i]);
      i++;
      const title = m[2] || (m[1] === 'leccion' ? 'Lo que te llevas' : '');
      const id = slugify(title);
      if (title) headings.push({ id, text: inline(title) });
      out.push(`<aside class="box box-${m[1]}"${title ? ` id="${id}"` : ''}>${title ? `<p class="box-title">${inline(title)}</p>` : ''}${markdown(buf.join('\n'))}</aside>`);
    } else if ((m = l.match(/^(#{1,6})\s+(.*)$/))) {
      const level = m[1].length, text = inline(m[2]), id = slugify(m[2]);
      if (level === 2) headings.push({ id, text });
      out.push(`<h${level} id="${id}">${text}</h${level}>`);
      i++;
    } else if (/^---\s*$/.test(l)) {
      out.push('<hr>'); i++;
    } else if (l.startsWith('>')) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith('>')) buf.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote>${markdown(buf.join('\n'))}</blockquote>`);
    } else if (/^\s*([-*]|\d+\.)\s/.test(l)) {
      out.push(list(l.match(/^\s*/)[0].replace(/\t/g, '    ').length));
    } else if (l.startsWith('<')) {
      const buf = [];
      while (i < lines.length && lines[i].trim() !== '') buf.push(lines[i++]);
      out.push(buf.join('\n'));
    } else {
      const buf = [];
      while (i < lines.length && lines[i].trim() !== '' && !isBlockStart(lines[i])) buf.push(lines[i++].trim());
      out.push(`<p>${inline(buf.join(' '))}</p>`);
    }
  }
  return out.join('\n');
}

// Autocomprobación del Markdown: si algo de esto falla, el build se detiene antes de escribir nada.
const assert = require('assert');
assert.strictEqual(markdown('Hola **hacker** y *bienvenido*'), '<p>Hola <strong>hacker</strong> y <em>bienvenido</em></p>');
assert.strictEqual(markdown('- a\n\t- b\n- c'), '<ul><li>a<ul><li>b</li></ul></li><li>c</li></ul>');
assert.strictEqual(markdown('```bash\nsudo apt update\n```'), '<pre><code class="lang-bash">sudo apt update</code></pre>');
assert.strictEqual(markdown('Usa `a*b*c` [aquí](https://x.org "t")'), '<p>Usa <code>a*b*c</code> <a href="https://x.org" title="t" target="_blank" rel="noopener">aquí</a></p>');
assert.match(markdown('::: leccion\n- Activa MFA\n:::'), /^<aside class="box box-leccion" id="lo-que-te-llevas"><p class="box-title">Lo que te llevas<\/p><ul><li>Activa MFA<\/li><\/ul><\/aside>$/);

// ---------- Temas: las etiquetas de los posts se agrupan en pocos temas legibles ----------
const TEMAS = {
  laboratorio: 'Laboratorio', identidad: 'Identidad y accesos', nube: 'Nube', 'cadena-de-suministro': 'Cadena de suministro',
  ransomware: 'Ransomware y extorsión', 'ingenieria-social': 'Ingeniería social', vulnerabilidades: 'Vulnerabilidades', ia: 'Inteligencia artificial', certificaciones: 'Certificaciones', resiliencia: 'Caídas y resiliencia',
};
const TAG_TEMA = {
  laboratorio: 'laboratorio', kali: 'laboratorio', reconocimiento: 'laboratorio', virtualizacion: 'laboratorio', redes: 'laboratorio', wireshark: 'laboratorio', presentacion: 'laboratorio',
  identidad: 'identidad', cuentas: 'identidad', basico: 'identidad', privacidad: 'identidad',
  cloud: 'nube', azure: 'nube', configuracion: 'nube',
  'supply-chain': 'cadena-de-suministro', cicd: 'cadena-de-suministro', devsecops: 'cadena-de-suministro', desarrollo: 'cadena-de-suministro', cripto: 'cadena-de-suministro',
  ransomware: 'ransomware', extorsion: 'ransomware', wiper: 'ransomware', hacktivismo: 'ransomware', continuidad: 'ransomware', 'infraestructura-critica': 'ransomware', educacion: 'ransomware',
  'ingenieria-social': 'ingenieria-social', phishing: 'ingenieria-social', correo: 'ingenieria-social',
  vulnerabilidades: 'vulnerabilidades', parcheo: 'vulnerabilidades', web: 'vulnerabilidades', apt: 'vulnerabilidades',
  ia: 'ia', defensa: 'ia',
  certificaciones: 'certificaciones',
  resiliencia: 'resiliencia', caidas: 'resiliencia', nube: 'nube',
  fraude: 'ingenieria-social', consumidor: 'ingenieria-social',
};
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// ---------- Posts ----------
const postsDir = path.join(ROOT, 'src/posts');
const posts = fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).map(file => {
  const { meta, body } = parseFront(fs.readFileSync(path.join(postsDir, file), 'utf8'));
  const m = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
  if (!m || !meta.title) throw new Error(`${file}: necesita nombre AAAA-MM-DD-slug.md y "title"`);
  const headings = [];
  const html = markdown(body, headings);
  const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const lesson = (body.match(/^:::\s*leccion[^\n]*\n([\s\S]*?)\n:::/m) || [])[1];
  return {
    ...meta,
    slug: m[2],
    date: new Date(m[1] + 'T12:00:00Z'),
    tags: meta.tags || [],
    temas: [...new Set((meta.tags || []).map(t => TAG_TEMA[t]))],
    img: meta.img || ['jpg', 'webp', 'png'].map(e => `posts/${m[2]}.${e}`).find(f => fs.existsSync(path.join(ROOT, 'src/assets/img', f))),
    html, headings,
    minutes: Math.max(1, Math.round(words / 200)),
    lessonHtml: lesson ? markdown(lesson.split('\n').filter(x => x.trim()).slice(0, 1).join('\n')) : '',
  };
}).sort((a, b) => b.date - a.date);
// Una etiqueta sin tema rompería el filtro en silencio: mejor fallar el build.
for (const p of posts) for (const t of p.tags) assert(TAG_TEMA[t], `${p.slug}: la etiqueta "${t}" no tiene tema en TAG_TEMA`);

// ---------- Plantilla ----------
// Trazos de Lucide (ISC): todos los iconos son de línea para que icons.js los anime con morphicons.
const ICONS = {
  github: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2',
  linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 0 0 4a2 2 0 1 0 0-4z',
  rss: 'M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16M5 19a1 1 0 1 0 2 0a1 1 0 1 0-2 0z',
};
const icon = (name, label) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[name]}"/></svg><span class="sr-only">${label}</span>`;

function layout({ title, description, url, image, type = 'website', body, nav = '', post, noindex }) {
  // Google corta el título hacia los 60 caracteres: si el sufijo no cabe, se omite.
  const full = !title ? `${site.title} · ${site.tagline}` : `${title} · ${site.title}`.length <= 60 ? `${title} · ${site.title}` : title;
  const abs = site.url + url;
  const img = site.url + '/assets/img/' + (image || site.ogImage);
  const author = { '@type': 'Person', name: site.author, url: site.url + '/sobre-mi/' };
  const ld = post ? { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: title, description, image: img, datePublished: post.date.toISOString().slice(0, 10), inLanguage: 'es', author, publisher: author, mainEntityOfPage: abs, keywords: post.temas.map(t => TEMAS[t]).join(', ') }
    : url === '/' ? { '@context': 'https://schema.org', '@type': 'WebSite', name: site.title, url: site.url + '/', description: site.description, inLanguage: 'es', author } : null;
  const s = site.social;
  const NAV_ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    blog: '<path d="M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M8.5 13h7M8.5 17h5"/>',
    about: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  };
  const NAV_D = {
    home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
    blog: 'M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5M8.5 13h7M8.5 17h5',
    about: 'M8 8a4 4 0 1 0 8 0a4 4 0 1 0-8 0M4 21a8 8 0 0 1 16 0',
    search: 'M4 11a7 7 0 1 0 14 0a7 7 0 1 0-14 0M20 20l-3.5-3.5',
  };
  // Al pasar el ratón cada icono se transforma en su versión «hacker»: prompt, código, identidad verificada y mira de escaneo.
  const NAV_HOVER = {
    home: 'M4 17l6-6-6-6M12 19h8',
    blog: 'M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5M10 12.5l-2.5 2.5 2.5 2.5M14 12.5l2.5 2.5-2.5 2.5',
    about: 'M8 8a4 4 0 1 0 8 0a4 4 0 1 0-8 0M4 21a8 8 0 0 1 11.5-7.2M16 19l2 2 4-4',
    search: 'M12 2v4M12 18v4M2 12h4M18 12h4M7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0M12 11.5v1',
  };
  const navItem = (href, label, key, extra = '') => `<a href="${href}" data-icon="${NAV_D[key]}" data-hover="${NAV_HOVER[key]}"${nav === key ? ' aria-current="page"' : ''}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${NAV_ICONS[key]}</svg><span>${label}</span>${extra}</a>`;
    // Redes y © en el lateral; en móvil el lateral es cabecera, así que se repiten al final del contenido.
  const foot = `    <div class="contact">
      <a href="https://github.com/${s.github}" target="_blank" rel="noopener" title="GitHub" data-icon="${ICONS.github}">${icon('github', 'GitHub')}</a>
      <a href="https://www.linkedin.com/in/${s.linkedin}" target="_blank" rel="noopener" title="LinkedIn" data-icon="${ICONS.linkedin}">${icon('linkedin', 'LinkedIn')}</a>
      <a href="/feed.xml" title="RSS" data-icon="${ICONS.rss}">${icon('rss', 'RSS')}</a>
    </div>
    <p class="copyright">© ${new Date().getFullYear()} ${esc(site.author)}</p>
`;
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(description || site.description)}">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}<link rel="canonical" href="${abs}">
${site.googleVerification ? `<meta name="google-site-verification" content="${esc(site.googleVerification)}">
` : ''}<meta property="og:site_name" content="${esc(site.title)}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title || site.title)}">
<meta property="og:description" content="${esc(description || site.description)}">
<meta property="og:url" content="${abs}">
<meta property="og:image" content="${img}">
<meta property="og:locale" content="es_CR">
${post ? `<meta property="article:published_time" content="${post.date.toISOString().slice(0, 10)}">\n${post.temas.map(t => `<meta property="article:tag" content="${esc(TEMAS[t])}">`).join('\n')}\n` : ''}${ld ? `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n` : ''}<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1522" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light dark">
<script>/* Tema antes del primer pintado para evitar parpadeo */document.documentElement.classList.add('js');addEventListener('pagereveal',function(e){if(!e.viewTransition||!e.viewTransition.types)return;var T=['glitch','crt','decrypt','terminal','rain','blinds','radar','packet','signal','firewall'],i=Math.random()*T.length|0;try{if(sessionStorage.getItem('vt')===T[i])i=(i+1)%T.length;sessionStorage.setItem('vt',T[i])}catch(x){}e.viewTransition.types.add(T[i])});try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
<link rel="icon" href="/assets/img/favicon/favicon.ico">
<link rel="apple-touch-icon" href="/assets/img/favicon/apple-touch-icon.png">
<link rel="alternate" type="application/rss+xml" title="${esc(site.title)}" href="/feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/site.css?v=${v('css/site.css')}">
</head>
<body>
<a class="skip" href="#main">Saltar al contenido</a>
<aside class="sidebar">
  <canvas class="matrix" aria-hidden="true"></canvas>
  <button type="button" class="theme-toggle" aria-label="Cambiar a tema oscuro" title="Cambiar a tema oscuro">
    <morph-icon class="i-morph" size="20" stroke-width="2" reduced-motion="user"></morph-icon>
    <svg class="i-moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
    <svg class="i-sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
  </button>
  ${translateMenu(url)}
  <div class="side-id">
    <a class="avatar" href="/"><img src="/assets/img/${site.authorImg}" alt="${esc(site.author)}" width="96" height="96"></a>
    <p class="author-name">${esc(site.author)}</p>
    <ul class="author-role" aria-label="Áreas">${site.role.split(' · ').map(r => `<li>${esc(r)}</li>`).join('')}</ul>
  </div>
  <nav class="nav" aria-label="Principal">
    ${navItem('/', 'Inicio', 'home')}
    ${navItem('/blog/', 'Artículos', 'blog')}
    ${navItem('/sobre-mi/', 'Sobre mí', 'about')}
    ${navItem('/blog/?buscar', 'Buscar', 'search', '<kbd>/</kbd>')}
  </nav>
  <footer class="side-foot">
${foot}  </footer>
</aside>
<main id="main" class="main">
${body}
<footer class="side-foot main-foot">
${foot}</footer>
</main>
<script src="/assets/js/site.js?v=${v('js/site.js')}" defer></script>
<script type="module" src="/assets/js/icons.js?v=${v('js/icons.js')}"></script>
</body>
</html>
`;
}

const tagList = temas => temas.slice(0, 2).map(t => `<a class="tag" href="/blog/?tema=${t}">${esc(TEMAS[t])}</a>`).join(' ');
const meta = p => `<time datetime="${p.date.toISOString().slice(0, 10)}">${fecha(p.date)}</time> <span>${p.minutes} min de lectura</span>`;

const cardData = p => `data-temas="${p.temas.join(' ')}" data-search="${esc(norm([p.title, p.description, ...p.tags, ...p.temas.map(t => TEMAS[t])].join(' ')))}"`;

// lesson=false en /blog/: la lección vive en el post; repetida en 27 tarjetas el ámbar deja de destacar.
function card(p, lesson = true) {
  return `<article class="card" ${cardData(p)}>
  ${p.img ? `<a class="card-thumb" href="/${p.slug}/" tabindex="-1" aria-hidden="true"><img src="/assets/img/${p.img}" alt="" width="1600" height="900" loading="lazy" style="view-transition-name: cover-${p.slug}"></a>` : ''}
  <div class="card-body">
    <p class="meta">${meta(p)}</p>
    <h3 class="card-title"><a href="/${p.slug}/">${esc(p.title)}</a></h3>
    <p class="card-desc">${esc(p.description || '')}</p>
    ${lesson && p.lessonHtml ? `<div class="card-lesson">${p.lessonHtml}</div>` : ''}
    <p class="tags">${tagList(p.temas)}</p>
  </div>
</article>`;
}

// Años anteriores en /blog/: fila compacta (miniatura, fecha, título). Clase "card" para que el filtro la trate igual.
const row = p => `<article class="card card-row" ${cardData(p)}>
  ${p.img ? `<a class="card-thumb" href="/${p.slug}/" tabindex="-1" aria-hidden="true"><img src="/assets/img/${p.img}" alt="" width="1600" height="900" loading="lazy" style="view-transition-name: cover-${p.slug}"></a>` : ''}
  <div class="card-body">
    <p class="meta">${meta(p)}</p>
    <h3 class="card-title"><a href="/${p.slug}/">${esc(p.title)}</a></h3>
  </div>
</article>`;

function write(rel, html) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// _site se regenera completo en cada build: así nunca quedan páginas huérfanas.
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, 'src/assets'), path.join(OUT, 'assets'), { recursive: true });
// src/static/ va tal cual a la raíz del sitio (p. ej. el archivo de verificación de Google Search Console).
if (fs.existsSync(path.join(ROOT, 'src/static'))) fs.cpSync(path.join(ROOT, 'src/static'), OUT, { recursive: true });

// ---------- Traducir ----------
// Sin script de Google en el sitio: cada idioma enlaza a la página traducida por el proxy translate.goog.
const LANGS = [['en', 'English'], ['pt', 'Português'], ['fr', 'Français'], ['de', 'Deutsch'], ['it', 'Italiano'], ['zh-CN', '中文'], ['ja', '日本語'], ['ko', '한국어'], ['ru', 'Русский'], ['ar', 'العربية'], ['hi', 'हिन्दी']];
const GLOBE = 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10a15.3 15.3 0 0 1-4 10a15.3 15.3 0 0 1-4-10a15.3 15.3 0 0 1 4-10z';
const translateHost = new URL(site.url).hostname.replace(/-/g, '--').replace(/\./g, '-') + '.translate.goog';
const translateMenu = url => `<details class="translate">
    <summary class="translate-btn" aria-label="Traducir esta página" title="Traducir"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${GLOBE}"/></svg></summary>
    <div class="translate-menu"><p>Traducir esta página</p><ul>${LANGS.map(([c, n]) => `<li><a href="https://${translateHost}${url}?_x_tr_sl=es&amp;_x_tr_tl=${c}&amp;_x_tr_hl=${c}" lang="${c}" rel="nofollow">${n}</a></li>`).join('')}</ul><p class="small">Traducción automática de Google.</p></div>
  </details>`;

// ---------- Compartir ----------
// Trazos de Lucide (licencia ISC). Se pintan como SVG fijo y icons.js los cambia por morph-icon.
const SHARE_ICONS = {
  whatsapp: 'M7.9 20A9 9 0 1 0 4 16.1L2 22z',
  facebook: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01',
  linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 0 0 4a2 2 0 1 0 0-4z',
  x: 'M4 4l11.7 16H20L8.3 4zM4 20l6.8-6.8M20 4l-6.8 6.8',
  telegram: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  correo: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
};
const shareSvg = d => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
function shareBar(p, compact) {
  const url = `${site.url}/${p.slug}/`, u = encodeURIComponent(url), t = encodeURIComponent(p.title), tu = encodeURIComponent(`${p.title} ${url}`);
  const links = [
    ['whatsapp', 'WhatsApp', `https://wa.me/?text=${tu}`],
    ['facebook', 'Facebook', `https://www.facebook.com/sharer/sharer.php?u=${u}`],
    ['instagram', 'Instagram', null],
    ['linkedin', 'LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ['x', 'X', `https://x.com/intent/tweet?text=${t}&amp;url=${u}`],
    ['telegram', 'Telegram', `https://t.me/share/url?url=${u}&amp;text=${t}`],
    ['correo', 'Correo', `mailto:?subject=${t}&amp;body=${u}`],
  ];
  const label = n => compact ? '' : `<span>${n}</span>`;
  const item = ([k, n, href]) => href
    ? `<a class="share-btn share-${k}" href="${href}"${k === 'correo' ? '' : ' target="_blank" rel="noopener"'} aria-label="Compartir en ${n}" title="${n}" data-icon="${SHARE_ICONS[k]}">${shareSvg(SHARE_ICONS[k])}${label(n)}</a>`
    : `<button type="button" class="share-btn share-${k} share-native" data-url="${url}" data-title="${esc(p.title)}" aria-label="Compartir en ${n}" title="${n}" data-icon="${SHARE_ICONS[k]}">${shareSvg(SHARE_ICONS[k])}${label(n)}</button>`;
  return `<div class="share${compact ? ' share-compact' : ''}"><span class="share-label">Compartir</span>${links.map(item).join('')}<button type="button" class="copy-link share-btn" data-url="${url}" aria-label="Copiar enlace" title="Copiar enlace">${compact ? '' : '<span>Copiar enlace</span>'}</button></div>`;
}

// ---------- Páginas de posts ----------
for (const [i, p] of posts.entries()) {
  const newer = posts[i - 1], older = posts[i + 1];
  const toc = p.headings.length >= 2
    ? `<aside class="toc-rail"><details class="toc" open><summary class="toc-title">En este artículo</summary><ol>${p.headings.map(h => `<li><a href="#${h.id}">${h.text}</a></li>`).join('')}</ol><a class="toc-top" href="#main">Volver arriba</a></details></aside>` : '';
  // Enlazado interno: hasta 3 posts que comparten tema, sin repetir los de anterior/siguiente.
  const related = posts.filter(q => q !== p && q !== newer && q !== older && q.temas.some(t => p.temas.includes(t))).slice(0, 3);
  write(`${p.slug}/index.html`, layout({
    title: p.title, description: p.description, url: `/${p.slug}/`, image: p.img, type: 'article', post: p,
    body: `<div class="progress" aria-hidden="true"></div>
<div class="post-grid">
<article class="post">
  <header class="post-header">
    <p class="meta">${meta(p)}</p>
    <h1>${esc(p.title)}</h1>
    ${p.description ? `<p class="post-lead">${esc(p.description)}</p>` : ''}
    <p class="tags">${tagList(p.temas)}</p>
    ${shareBar(p, true)}
  </header>
  ${p.img ? `<figure class="post-cover"><img src="/assets/img/${p.img}" alt="${esc(p['img-alt'] || p.title)}" width="1600" height="900" style="view-transition-name: cover-${p.slug}"></figure>` : ''}
  <div class="prose">
${p.html}
  </div>
  <footer class="post-footer">
    ${shareBar(p, true)}
    ${related.length ? `<section class="related" aria-label="Sigue leyendo"><h2>Sigue leyendo</h2><ul>${related.map(q => `<li><a href="/${q.slug}/">${esc(q.title)}</a></li>`).join('')}</ul></section>` : ''}
    <nav class="post-nav" aria-label="Más artículos">
      ${older ? `<a rel="prev" href="/${older.slug}/"><span>Anterior</span>${esc(older.title)}</a>` : '<span></span>'}
      ${newer ? `<a rel="next" href="/${newer.slug}/"><span>Siguiente</span>${esc(newer.title)}</a>` : ''}
    </nav>
    ${site.disqus ? `<section class="comments"><button type="button" class="load-comments" data-shortname="${site.disqus}" data-url="${site.url}/${p.slug}/" data-id="/${p.slug}/">Ver comentarios</button><div id="disqus_thread"></div><p class="small">Antes de comentar, revisa la <a href="/politica-de-comentarios/">política de comentarios</a>.</p></section>` : ''}
  </footer>
</article>
${toc}
</div>`,
  }));
}

const proofList = () => site.proof?.length ? `<dl class="proof">${site.proof.map(p => `<div><dt>${esc(p.value)}</dt><dd>${esc(p.label)}</dd></div>`).join('')}</dl>` : '';
const groups = (xs, cls) => `<div class="${cls}">${xs.map(g => `<div><h3>${esc(g.group)}</h3><ul>${g.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}</div>`;

// ---------- Inicio (portafolio + últimos posts) ----------
const latest = posts.slice(0, 6);
// Bienvenida: un mensaje por post (gancho/gancho_texto, o título/descripción) + datos sueltos de site.json.
// Un post nuevo añade su mensaje solo; el primero de site.json es el que se ve sin JavaScript.
const welcome = [...site.welcome, ...posts.map(p => ({ h: p.gancho || p.title, p: p.gancho_texto || p.description, href: `/${p.slug}/` }))];
assert(welcome.every(w => w.h && w.p), 'bienvenida: hay un mensaje sin titular o sin texto');
write('index.html', layout({
  url: '/', nav: 'home',
  body: `<section class="hero">
  <div class="welcome">
    <h1 class="welcome-h">${esc(welcome[0].h)}</h1>
    <p class="hero-lead"><span class="welcome-p">${esc(welcome[0].p)}</span> <a class="welcome-link" href="${esc(welcome[0].href || '/blog/')}"${welcome[0].href ? '' : ' hidden'}>Leer el caso</a></p>
  </div>
  <script type="application/json" id="welcome-data">${JSON.stringify(welcome).replace(/</g, '\\u003c')}</script>
  <p class="hero-actions"><a class="btn" href="/sobre-mi/">Ver mi perfil</a> <a class="btn btn-ghost" href="https://www.linkedin.com/in/${site.social.linkedin}" target="_blank" rel="noopener">Contactar por LinkedIn</a></p>
  ${proofList()}
  <ul class="focus">${site.focus.map(f => `<li><strong>${esc(f.title)}</strong>${esc(f.text)}</li>`).join('')}</ul>
</section>
<section class="section">
  <h2 class="section-title">Últimos artículos</h2>
  <p class="section-lead">Incidentes reales explicados en pocos minutos, cada uno con lo que puedes aplicar hoy.</p>
  <div class="cards">${latest.map(p => card(p)).join('\n')}</div>
  <p><a class="btn btn-ghost" href="/blog/">Ver los ${posts.length} artículos</a></p>
</section>`,
}));

// ---------- Blog (todos, agrupados por año, con buscador y filtro por tema) ----------
const count = t => posts.filter(p => p.temas.includes(t)).length;
const years = [...new Set(posts.map(p => p.date.getUTCFullYear()))];
write('blog/index.html', layout({
  title: 'Artículos', description: 'Noticias de ciberseguridad explicadas con una lección práctica.', url: '/blog/', nav: 'blog',
  body: `<header class="page-header">
  <h1>Artículos</h1>
  <form class="search" role="search" onsubmit="return false">
    <label for="q" class="sr-only">Buscar artículos</label>
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
    <input id="q" type="search" placeholder="Buscar: phishing, Azure, ransomware…" autocomplete="off" enterkeyhint="search">
    <kbd aria-hidden="true">/</kbd>
  </form>
  <div class="filters" role="group" aria-label="Filtrar por tema">
    <button type="button" class="filter" data-tema="" aria-pressed="true">Todos <span>${posts.length}</span></button>
    ${Object.keys(TEMAS).filter(count).map(t => `<button type="button" class="filter" data-tema="${t}" aria-pressed="false">${esc(TEMAS[t])} <span>${count(t)}</span></button>`).join('\n    ')}
  </div>
  <p class="results" aria-live="polite"></p>
</header>
<p class="empty" hidden>No hay artículos que coincidan. Prueba con otra palabra o elige <button type="button" class="link-reset">todos los temas</button>.</p>
${years.map((y, i) => `<section class="year"><h2 class="year-title">${y}</h2><div class="${i ? 'rows' : 'cards'}">${posts.filter(p => p.date.getUTCFullYear() === y).map(p => i ? row(p) : card(p, false)).join('\n')}</div></section>`).join('\n')}`,
}));

// ---------- Sobre mí ----------
const sec = (title, items, render) => items && items.length ? `<section class="section"><h2 class="section-title">${title}</h2>${render(items)}</section>` : '';
write('sobre-mi/index.html', layout({
  title: 'Sobre mí', description: site.description, url: '/sobre-mi/', nav: 'about',
  body: `<header class="page-header">
  <h1>Sobre mí</h1>
  <p class="post-lead">${esc(site.role)}</p>
  ${site.about.map(p => `<p class="about-p">${inline(p)}</p>`).join('\n')}
  ${proofList()}
  <p class="hero-actions"><a class="btn" href="https://www.linkedin.com/in/${site.social.linkedin}" target="_blank" rel="noopener">Contactar por LinkedIn</a> ${site.cv ? `<a class="btn btn-ghost" href="/assets/${site.cv}" download>Descargar CV</a>` : ''}</p>
</header>
${sec('Certificaciones', site.certifications, xs => groups(xs, 'skills certs'))}
${sec('Experiencia', site.experience, xs => `<ol class="timeline">${xs.map(x => `<li><p class="meta">${esc(x.period)}</p><h3>${esc(x.role)} <span class="muted">· ${esc(x.org)}</span></h3><p>${inline(x.text)}</p></li>`).join('')}</ol>`)}
${sec('Proyectos de seguridad y automatización', site.projects, xs => `<ul class="projects">${xs.map(x => `<li><h3>${x.url ? `<a href="${x.url}"${x.url.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${esc(x.name)}</a>` : esc(x.name)}</h3><p>${inline(x.text)}</p></li>`).join('')}</ul>`)}
${sec('Capacidades', site.skills, xs => groups(xs, 'skills'))}
${sec('Formación', site.education, xs => `<ol class="timeline">${xs.map(x => `<li><p class="meta">${esc(x.period)}</p><h3>${esc(x.name)} <span class="muted">· ${esc(x.org)}</span></h3>${x.text ? `<p>${inline(x.text)}</p>` : ''}</li>`).join('')}</ol>`)}`,
}));

// ---------- Páginas sueltas en Markdown (src/pages/*.md) ----------
for (const file of fs.readdirSync(path.join(ROOT, 'src/pages'))) {
  const { meta: m, body } = parseFront(fs.readFileSync(path.join(ROOT, 'src/pages', file), 'utf8'));
  const slug = file.replace(/\.md$/, '');
  write(`${slug}/index.html`, layout({ title: m.title, description: m.description, url: `/${slug}/`, body: `<article class="post page"><header class="post-header"><h1>${esc(m.title)}</h1></header><div class="prose">${markdown(body)}</div></article>` }));
}

write('404.html', layout({ title: 'Página no encontrada', url: '/404.html', noindex: true, body: `<header class="page-header"><h1>Esta página no existe</h1><p class="section-lead">Puede que el enlace haya cambiado. Busca el tema en la lista de artículos.</p><p><a class="btn" href="/blog/">Ir a los artículos</a></p></header>` }));

// ---------- sitemap y RSS ----------
const day = d => d.toISOString().slice(0, 10);
const urls = [['/', posts[0].date], ['/blog/', posts[0].date], ['/sobre-mi/', posts[0].date], ...posts.map(p => [`/${p.slug}/`, p.date])];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `<url><loc>${site.url}${u}</loc><lastmod>${day(d)}</lastmod></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
write('feed.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${esc(site.title)}</title><link>${site.url}/</link><description>${esc(site.description)}</description><language>es</language>\n${posts.map(p => `<item><title>${esc(p.title)}</title><link>${site.url}/${p.slug}/</link><guid>${site.url}/${p.slug}/</guid><pubDate>${p.date.toUTCString()}</pubDate><description>${esc(p.description || '')}</description></item>`).join('\n')}\n</channel></rss>\n`);

console.log(`OK: ${posts.length} posts generados`);
