# Todohack

Blog de ciberseguridad en español: incidentes reales contados en cinco minutos, laboratorios para practicar en casa y lo que he aprendido de cada certificación.

→ [todohack.github.io](https://todohack.github.io)

![Todohack](src/assets/img/og-todohack.jpg)

## Cómo funciona

Los artículos son archivos Markdown en `src/posts/`. `build.js` los convierte en el sitio estático y GitHub Actions lo publica en cada push a `master`. No hay `package.json` ni dependencias: solo Node.

```bash
node build.js
npx http-server _site -p 8080
```

## Escribir un artículo

Crea `src/posts/AAAA-MM-DD-slug.md`:

```markdown
---
title: "Título"
description: Una frase para Google y redes sociales.
tags: [ransomware, identidad]
---

Texto en Markdown.

::: leccion
- Lo que el lector puede aplicar hoy.
:::

::: fuentes Fuentes
- [Medio: título](https://...)
:::
```

Las etiquetas tienen que existir en `TAG_TEMA` (en `build.js`); si falta alguna, el build avisa.

## Portadas

Se generan con `tools/portadas/riso2.js`: cada artículo tiene su escena en el objeto `S`. Para generar una:

```bash
sh tools/portadas/render.sh slug-del-articulo
```

Sin argumentos las regenera todas. Necesita Microsoft Edge y Python con Pillow. El número de la esquina (LAB, CASO, CERT) se calcula solo por fecha.

## Licencia

Código bajo [MIT](LICENSE). Artículos e imágenes bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es).
