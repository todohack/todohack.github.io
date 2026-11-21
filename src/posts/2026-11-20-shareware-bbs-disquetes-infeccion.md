---
title: "Shareware y BBS: cuando un programa gratis infectaba"
description: El shareware nació como un pacto de confianza: pruébalo y paga si te gusta. Las BBS y los disquetes que lo hicieron triunfar también repartieron troyanos.
gancho: "El primer ransomware no llegó por internet. Llegó por correo, en un disquete."
gancho_texto: "Las BBS y los disquetes compartidos hicieron famoso al shareware. También fueron la primera autopista del malware."
tags: [historia, malware]
---

En 1982, Andrew Fluegelman publicó un programa de comunicaciones para la IBM PC, PC-Talk, con una propuesta rara para la época: cópialo, compártelo, y si te sirve, mándame lo que te parezca justo. Lo llamó *freeware* y él mismo lo describió como un experimento de economía más que de altruismo. Casi al mismo tiempo, Jim Knopf hizo lo mismo con PC-File, y Bob Wallace, el noveno empleado de Microsoft, dejó la empresa en 1983 para distribuir su procesador de texto PC-Write con un nombre que se quedó: **shareware**.

Funcionó. Según los registros de la época, para 1984 Knopf recibía unos 1.000 dólares diarios por PC-File, y para 1988 más de 27.000 usuarios registrados de PC-Write pagaban 1,5 millones de dólares al año. Todo se basaba en la confianza: el autor confiaba en que pagaras, y tú confiabas en que el programa hacía lo que decía.

Esta es la primera de tres entregas sobre cómo las páginas para bajar programas pasaron de ser un pacto de confianza a uno de los focos de infección más constantes de la informática.

## Cómo viajaba el software

Antes de la web, el shareware se movía por tres caminos:

<table>
<thead><tr><th>Canal</th><th>Cómo funcionaba</th></tr></thead>
<tbody>
<tr><td>BBS</td><td>Computadoras que recibían llamadas por módem. Te conectabas, bajabas archivos y los subías a otra BBS. En 1994, InfoWorld estimaba 60.000 BBS en Estados Unidos con 17 millones de usuarios</td></tr>
<tr><td>Disquetes</td><td>Amigos, clubes de usuarios y ferias de computación copiaban y repartían discos</td></tr>
<tr><td>Catálogos</td><td>Distribuidores vendían por una pequeña suma colecciones de miles de programas en disquete y luego en CD-ROM</td></tr>
</tbody>
</table>

El modelo dio su golpe más famoso con los juegos. Apogee popularizó el shareware por episodios: el primero gratis y completo, el resto pagando. id Software lo llevó al extremo con Doom, el 10 de diciembre de 1993. Al subir el primer episodio al servidor FTP de la Universidad de Wisconsin, tantas personas intentaron bajarlo a la vez que la red de la universidad colapsó.

## El problema: nadie revisaba nada

Esa misma facilidad para compartir tenía un lado oscuro. Un archivo pasaba de una BBS a otra, de un disquete a otro, sin que nadie verificara quién lo había hecho ni qué contenía. Si alguien escondía código malicioso dentro de un juego o una utilidad, la red de confianza lo repartía igual de rápido que el programa legítimo.

Además existían las BBS "elite" o de *warez*, dedicadas a distribuir software comercial pirateado. Bajar un programa crackeado de un desconocido era, y sigue siendo, una de las formas más directas de meter algo ajeno en tu computadora.

> Lo que me parece revelador de esta época es que el shareware y el malware usaban exactamente las mismas autopistas. La diferencia entre un programa útil y un troyano era solo la intención de quien lo subía, y desde la pantalla no había forma de saberla.

## El disquete que pedía rescate

El caso más claro de esa época no llegó por una BBS, sino por correo. En 1989, el biólogo Joseph Popp envió un disquete titulado "AIDS Information Introductory Diskette" a una lista de correo. Parecía software informativo sobre el sida.

Al instalarlo, el programa reemplazaba el archivo `AUTOEXEC.BAT` y contaba los arranques de la computadora. Al llegar a **90 arranques**, ocultaba las carpetas y cifraba los nombres de los archivos del disco C:. Luego pedía "renovar la licencia" pagando **189 dólares** a un apartado postal en Panamá.

Se le considera uno de los primeros ejemplos documentados de ransomware. Tenía un punto débil: el cifrado era simple, y pronto aparecieron herramientas para recuperar los archivos. Popp fue arrestado y acusado en el Reino Unido, pero lo declararon no apto para ser juzgado.

## El aleteo

<table>
<thead><tr><th>Lo que pasó en los 80 y 90</th><th>Lo que vemos hoy</th></tr></thead>
<tbody>
<tr><td>Software repartido sin verificar al autor</td><td>La firma digital de código y la verificación de hashes, que buscan responder "¿quién hizo esto y fue modificado?"</td></tr>
<tr><td>Troyanos escondidos en programas útiles</td><td>Los instaladores falsos y los cracks con ladrones de contraseñas, que veremos en la tercera entrega</td></tr>
<tr><td>Un disquete "informativo" que pedía rescate</td><td>El ransomware, hoy una industria criminal completa</td></tr>
<tr><td>El modelo "prueba gratis y paga"</td><td>Las versiones de prueba y el *freemium* actuales, herederos directos del shareware</td></tr>
</tbody>
</table>

El shareware casi desapareció como palabra, reemplazado por "versión de prueba" o "freemium". Pero la pregunta de fondo sigue siendo la misma de 1985: ¿de dónde viene este archivo y por qué debería confiar en él?

::: leccion
- Baja programas solo desde el sitio oficial del autor o desde una tienda o gestor de paquetes confiable, nunca de un sitio que solo "los tiene".
- Desconfía de los programas crackeados: son el disfraz favorito del malware desde la época de las BBS.
- Verifica el hash (SHA-256) cuando el autor lo publique, y revisa que el instalador tenga una firma digital válida.
- Escanea cualquier archivo que llegue en memoria USB, disco o adjunto antes de abrirlo.
- Ten respaldos fuera de tu computadora: el primer ransomware ya pedía rescate en 1989.
:::

::: fuentes Fuentes
- [Wikipedia: Shareware](https://en.wikipedia.org/wiki/Shareware)
- [Wikipedia: Andrew Fluegelman](https://en.wikipedia.org/wiki/Andrew_Fluegelman)
- [Wikipedia: Bob Wallace (computer scientist)](https://en.wikipedia.org/wiki/Bob_Wallace_(computer_scientist))
- [Wikipedia: Bulletin board system](https://en.wikipedia.org/wiki/Bulletin_board_system)
- [Wikipedia: Doom (1993 video game)](https://en.wikipedia.org/wiki/Doom_(1993_video_game))
- [Wikipedia: AIDS (Trojan horse)](https://en.wikipedia.org/wiki/AIDS_(Trojan_horse))
:::

---

**Serie Descargas peligrosas:** BBS y disquetes · [Los portales de descarga y sus instaladores](/portales-descarga-adware-instaladores/) · [Anuncios y sitios falsos hoy](/descargas-falsas-anuncios-hoy/)
