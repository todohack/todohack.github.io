---
title: "Download.com y SourceForge: cuando el portal infectaba"
description: Los portales de descargas nacieron para ordenar el shareware. Para ganar dinero, varios envolvieron programas legítimos en instaladores con adware.
gancho: "Bajaste Nmap del sitio más famoso de descargas. Te instaló una barra de herramientas."
gancho_texto: "Download.com, SourceForge y Softonic fueron sinónimo de descargar programas. Luego, de instaladores llenos de basura."
tags: [historia, malware]
---

Con la llegada de la web, las BBS y los disquetes quedaron atrás. En su lugar aparecieron los portales de descargas: sitios con miles de programas ordenados por categoría, reseñas y un botón grande que decía "Descargar". Para millones de personas, fueron la puerta de entrada al software.

Tucows nació en 1993 en Flint, Michigan; su nombre venía de *The Ultimate Collection Of Winsock Software*. Download.com, de CNET, abrió el 23 de octubre de 1996. Softonic empezó en Barcelona en 1997, y SourceForge, el gran almacén del software libre, en noviembre de 1999.

El problema llegó cuando tuvieron que ganar dinero con todo ese tráfico.

## El instalador que envolvía al instalador

La fórmula se repitió en varios portales: en lugar de entregarte el archivo del autor, te daban **su propio instalador**. Ese instalador descargaba el programa que querías, pero antes te ofrecía, con casillas ya marcadas y botones confusos, instalar otras cosas: barras de herramientas, cambiar tu buscador, cambiar tu página de inicio. Cada instalación de "ofertas" era dinero para el portal.

Técnicamente, el usuario "aceptaba". En la práctica, muchos ni se enteraban.

## Download.com y el caso Nmap

En agosto de 2011, Download.com introdujo un gestor de instalación propio. En diciembre de ese año, Gordon Lyon (Fyodor), autor de Nmap, el escáner de redes más conocido del mundo, publicó una denuncia furiosa: Download.com estaba entregando Nmap dentro de un instalador que añadía una barra de herramientas, cambiaba el buscador a Bing y la página de inicio a MSN, y solo después instalaba Nmap. Según Fyodor, varios antivirus marcaban ese envoltorio como malicioso.

Una herramienta de seguridad usada por profesionales, entregada con adware por el portal más famoso del mundo. La ironía no pasó desapercibida. Según Wikipedia, en julio de 2016 se informó que el instalador había sido retirado y ya no incluía adware.

## SourceForge: cuando el almacén tomó los proyectos

El caso de SourceForge dolió más, porque era la casa del software libre. En julio de 2013 lanzó DevShare, un programa opcional para que los proyectos incluyeran ofertas publicitarias en sus instaladores a cambio de una parte de los ingresos. En noviembre de 2013, el proyecto GIMP retiró sus descargas de SourceForge por los botones engañosos.

En mayo de 2015, SourceForge tomó el control de la página de GIMP para Windows, que consideraba abandonada, y sirvió un instalador con adware. En junio hizo algo parecido con las páginas de Nmap y VLC. SourceForge defendió que los proyectos estaban abandonados; los desarrolladores lo llamaron secuestro.

En enero de 2016, SourceForge fue vendido a la empresa BIZX, que en febrero eliminó DevShare y luego anunció que escanearía en busca de malware todos los proyectos.

## Softonic: el gigante en español

Softonic, quizás el portal de descargas más conocido en español, también recibió acusaciones por su "Softonic Downloader", un instalador propio. Según Wikipedia, Google retiró su publicidad del sitio en 2014. En febrero de 2015, su director ejecutivo, Scott Arpajian, eliminó el Downloader y pasó a un modelo de descarga directa, reconociendo que había facilitado malas prácticas de terceros.

> Lo que más me llama la atención de esta época es que el peligro ya no venía de un hacker anónimo en una BBS, sino de empresas grandes y conocidas. El usuario hacía lo correcto, ir a un sitio famoso, y aun así terminaba con basura instalada.

## El aleteo

<table>
<thead><tr><th>Lo que pasó</th><th>Lo que cambió</th></tr></thead>
<tbody>
<tr><td>Instaladores que añadían programas no deseados</td><td>Los antivirus empezaron a detectar estos instaladores como "programas potencialmente no deseados" (PUP o PUA)</td></tr>
<tr><td>Proyectos libres afectados sin su permiso</td><td>Muchos proyectos se mudaron a sus propios servidores y luego a GitHub, distribuyendo sus binarios directamente</td></tr>
<tr><td>Portales con mala reputación</td><td>Tucows cerró sus descargas en enero de 2021 y donó su colección al Internet Archive; la gente aprendió a buscar el sitio oficial</td></tr>
<tr><td>"Siguiente, siguiente, siguiente"</td><td>La costumbre, todavía útil, de elegir la instalación personalizada y leer cada casilla</td></tr>
</tbody>
</table>

La lección de esta época sigue vigente: un intermediario entre tú y el autor del programa es una oportunidad para que alguien meta algo en medio.

::: leccion
- Baja los programas desde el sitio oficial del autor o su repositorio oficial, no desde portales que lo "envuelven".
- Si un instalador ofrece instalar otras cosas, elige la instalación personalizada y desmarca todo lo que no pediste.
- Desconfía de los botones grandes de "Descargar" rodeados de publicidad: muchas veces son anuncios.
- Si tu buscador o tu página de inicio cambian después de instalar algo, revisa los programas instalados y las extensiones del navegador.
- Activa en tu antivirus la detección de aplicaciones potencialmente no deseadas (PUA). Windows Defender la tiene.
:::

::: fuentes Fuentes
- [Wikipedia: CNET Download](https://en.wikipedia.org/wiki/CNET_Download)
- [Fyodor (Nmap): C|Net Download.Com is now bundling Nmap with malware! (diciembre de 2011)](https://seclists.org/nmap-announce/2011/5)
- [Wikipedia: SourceForge](https://en.wikipedia.org/wiki/SourceForge)
- [Wikipedia: Softonic](https://en.wikipedia.org/wiki/Softonic)
- [Wikipedia: Tucows](https://en.wikipedia.org/wiki/Tucows)
:::

---

**Serie Descargas peligrosas:** [BBS y disquetes](/shareware-bbs-disquetes-infeccion/) · Los portales de descarga y sus instaladores · [Anuncios y sitios falsos hoy](/descargas-falsas-anuncios-hoy/)
