# Todohack

**Casi todos los ataques empiezan por algo que alguien olvidó.** Una clave en un repositorio, un servidor sin parchear, una llamada a la mesa de ayuda. Todohack desarma incidentes reales para ver cómo empezaron y qué los habría frenado, en artículos que se leen en cinco minutos y sin jerga innecesaria.

[**todohack.github.io**](https://todohack.github.io)

![Todohack](src/assets/img/og-todohack.jpg)

## Qué vas a encontrar

| Serie | De qué trata |
|---|---|
| **Casos** | Un incidente real por artículo: qué pasó, cómo pudo pasar y qué revisaría yo en mi propio entorno. De Bybit y Jaguar Land Rover a PHP2Shell y el Octubre Negro de 2026. |
| **Laboratorios** | Para practicar en casa: montar Kali Linux, elegir virtualizador, primeros pasos con Nmap y Wireshark, y las ocho máquinas del programa PMJ. |
| **Certificaciones y guías** | Qué evalúa cada certificación y cómo prepararla (EHCA, AZ-900, CCNA, ISO 27001, Security+), más la ley de protección de datos de Costa Rica explicada en una página. |

Cada artículo termina con un recuadro **«Lo que te llevas»**: lo que puedes aplicar hoy, sin necesidad de leer el resto.

## Cómo está hecho

El sitio no usa frameworks ni gestores de paquetes. Un único script de Node, `build.js`, convierte los artículos en Markdown en un sitio estático, y GitHub Actions lo publica en GitHub Pages en cada push.

Se construyó así a propósito, porque es un blog de seguridad y tiene que predicar con el ejemplo:

- **Sin dependencias que vigilar.** No hay `node_modules` ni `package.json`: nada que un paquete envenenado pueda colar en el build.
- **Acciones fijadas por SHA completo** en el flujo de publicación, no por etiqueta, para que nadie pueda cambiar lo que se ejecuta sin que cambie el commit.
- **Sin rastreadores.** Los comentarios (Disqus) solo se cargan si el lector los pide.
- **Código de terceros revisado y copiado al repo.** La única librería externa (morphicons, para el icono de tema) está vendorizada con su licencia y verificada antes de añadirla.

Del lado del lector: tema claro y oscuro que sigue al sistema, índice lateral con barra de progreso, buscador por tema, visor de capturas con teclado y gestos, y respeto por `prefers-reduced-motion`.

```
src/
  site.json             Perfil, textos de la portada y enlaces
  posts/                Artículos en Markdown (AAAA-MM-DD-slug.md)
  pages/                Páginas sueltas (p. ej. política de comentarios)
  assets/
    css/site.css        Estilos y temas
    js/site.js          Tema, índice, buscador y visor de capturas
    img/posts/          Portadas (slug.jpg, 1600×900)
tools/portadas/         Generador de las portadas estilo risografía
build.js                Generador del sitio: src/ → _site/
.github/workflows/      Publicación en GitHub Pages
```

`_site/` se genera desde cero en cada build y no se guarda en el repositorio, así que borrar o renombrar un artículo nunca deja páginas huérfanas.

## Escribir un artículo

1. Crea `src/posts/AAAA-MM-DD-mi-articulo.md`. La fecha es la de publicación y el resto del nombre es la URL.
2. Empieza con el encabezado:

   ```markdown
   ---
   title: "Título del artículo"
   description: Una frase que resuma el artículo (sale en Google y al compartir).
   tags: [ransomware, identidad]
   ---
   ```

   Cada etiqueta debe tener un tema asignado en `TAG_TEMA` dentro de `build.js`; si falta, el build se detiene y te dice cuál.

3. Escribe en Markdown. Hay dos bloques propios:

   ```markdown
   ::: leccion
   - Algo concreto que el lector puede aplicar.
   :::

   ::: fuentes Fuentes
   - [Medio: título del artículo](https://...)
   :::
   ```

## Portadas

Las portadas son carteles de datos con aspecto de impresión en risografía: papel crema, tintas que se superponen, grano y marcas de registro. Cada una dibuja el dato central del artículo (una línea de tiempo, una tabla, una red) y se genera siempre igual a partir del nombre del artículo.

1. Añade la escena del artículo en `tools/portadas/riso2.js` (objeto `S['mi-articulo']`) y su entrada en `META`.
2. Genera la portada:

   ```bash
   sh tools/portadas/render.sh mi-articulo
   ```

   Sin argumentos regenera todas. Necesita Microsoft Edge (para pasar el SVG a imagen) y Python con Pillow.

El número de serie de la esquina (LAB 03, CASO 12, CERT 02) no se escribe a mano: el generador lo calcula por orden de fecha dentro de cada serie, y avisa si algún artículo se quedó sin portada.

## Probarlo en local

```bash
node build.js
```

```bash
npx http-server _site -p 8080
```

Abre `http://localhost:8080`. Antes de escribir nada, el build ejecuta sus propias pruebas del conversor de Markdown.

## Publicar

Haz push a `master`: la Action genera y publica el sitio en uno o dos minutos. La primera vez hay que elegir **Settings → Pages → Source: GitHub Actions**.

## Licencia

- **Código** (`build.js`, `tools/`, CSS y JavaScript): [MIT](LICENSE).
- **Artículos, textos e imágenes**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es). Puedes compartirlos y adaptarlos citando a Todohack con un enlace al sitio.

La librería morphicons conserva su propia licencia en `src/assets/js/vendor/morphicons-1.7.1/`.
