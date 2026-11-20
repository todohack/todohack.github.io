---
title: "El gusano Morris: el experimento que tumbó internet en 1988"
description: Un estudiante de Cornell quiso medir internet y un error de cálculo la tumbó. Del gusano Morris nacieron el primer CERT y la primera condena por hackeo.
gancho: "Quería contar cuántas computadoras había en internet. La dejó de rodillas."
gancho_texto: "Un error en una sola línea de lógica convirtió un experimento de estudiante en la primera gran crisis de internet."
tags: [historia, malware]
---

El 2 de noviembre de 1988, a las 8:30 de la noche, alguien lanzó un programa desde la red del MIT. No era del MIT: era de Robert Tappan Morris, un estudiante de doctorado de primer año en Cornell, que según la sentencia de apelación usó la red del MIT para que el rastro no llevara directo a su universidad.

En pocas horas, miles de computadoras conectadas a la internet de entonces estaban tan cargadas que no podían hacer nada más. Las universidades y centros de investigación empezaron a desconectarse de la red para protegerse.

## Cómo entraba

El gusano Morris estaba escrito en C y atacaba computadoras Unix (VAX y Sun-3 con BSD). No tenía un solo truco, tenía tres, más uno de regalo:

<table>
<thead><tr><th>Puerta</th><th>Qué aprovechaba</th></tr></thead>
<tbody>
<tr><td>sendmail</td><td>Un modo de depuración que permitía ejecutar comandos</td></tr>
<tr><td>finger</td><td>Un desbordamiento de búfer en el servicio <code>fingerd</code></td></tr>
<tr><td>rsh / rexec</td><td>Relaciones de confianza entre máquinas que permitían entrar sin contraseña</td></tr>
<tr><td>Contraseñas</td><td>Adivinaba contraseñas débiles con palabras del diccionario y variantes del nombre de usuario</td></tr>
</tbody>
</table>

Cada una de esas puertas era conocida o fácil de cerrar. Nadie lo había hecho.

## El error del 14 %

Lo que convirtió el experimento en un desastre fue una decisión de diseño. El gusano preguntaba a cada máquina si ya estaba infectada, para no repetirse. Pero Morris temía que los administradores respondieran "sí" en falso para protegerse, así que programó que se copiara de todos modos **el 14 % de las veces**.

Ese pequeño porcentaje, repetido miles de veces, hizo que las máquinas se infectaran una y otra vez. Cada copia consumía recursos hasta que la computadora quedaba inutilizable, con el mismo efecto que una bomba fork. El investigador Michael Rabin, cuya idea de usar el azar inspiró a Morris, comentó después que debió probarlo antes en un simulador.

> Lo que más me enseña este caso es que el daño no vino de la maldad, sino de un número mal pensado. En seguridad, un parámetro que parece prudente puede ser exactamente lo que vuelve catastrófico un sistema.

## Cuánto daño hizo

Aquí las cifras están en disputa, y vale la pena ser honesto con eso. La cifra más repetida es de unas **6.000 máquinas** infectadas. Paul Graham, amigo de Morris, sostiene que no fue una medición real: alguien estimó que había unas 60.000 computadoras en internet y supuso que el gusano habría infectado el 10 %. El astrónomo e investigador Clifford Stoll habló de "solo un par de miles".

El costo también es un rango: el tribunal de apelación estimó la limpieza entre 200 y 53.000 dólares por instalación, y Stoll calculó un impacto total de entre 100.000 y 10 millones de dólares.

## La tormenta: lo que cambió para siempre

<table>
<thead><tr><th>Aleteo de 1988</th><th>Lo que tenemos hoy</th></tr></thead>
<tbody>
<tr><td>Nadie sabía a quién llamar</td><td>En noviembre de 1988, por encargo de DARPA, nació en Carnegie Mellon el CERT/CC, el primer centro de respuesta a incidentes. Hoy casi cada país tiene su CSIRT, incluido el CSIRT-CR de Costa Rica</td></tr>
<tr><td>Los administradores se coordinaron por listas de correo improvisadas</td><td>La respuesta coordinada a incidentes como disciplina</td></tr>
<tr><td>No había precedentes legales</td><td>Morris fue la primera persona condenada por un delito grave bajo la Ley de Fraude y Abuso Informático de EE. UU. (1986): tres años de libertad condicional, 400 horas de servicio comunitario y una multa de algo más de 10.000 dólares</td></tr>
<tr><td>Una internet construida sobre la confianza entre colegas</td><td>La idea de que cualquier máquina conectada debe defenderse sola</td></tr>
</tbody>
</table>

La internet de 1988 era un club de universidades y laboratorios que confiaban unos en otros. El gusano Morris demostró que esa confianza era una vulnerabilidad.

## El final inesperado

Robert Tappan Morris cumplió su condena y siguió su carrera. Fue cofundador de Viaweb con Paul Graham, que vendieron a Yahoo, y en 2005 de Y Combinator, la aceleradora de startups. Hoy es profesor del MIT, la misma institución desde cuya red lanzó el gusano.

::: leccion
- Cierra las puertas conocidas: servicios con modos de depuración activos, versiones sin parchear y relaciones de confianza sin contraseña siguen siendo la entrada favorita de los atacantes.
- Las contraseñas débiles fueron un problema en 1988 y lo siguen siendo. Usa contraseñas largas y únicas, y doble factor.
- Prueba en un entorno controlado antes de soltar cualquier cosa que se propague o se repita sola, desde un script hasta una actualización.
- Ten claro a quién avisar ante un incidente. En Costa Rica, el CSIRT-CR es el punto de contacto nacional.
:::

::: fuentes Fuentes
- [Wikipedia: Morris worm](https://en.wikipedia.org/wiki/Morris_worm)
- [Wikipedia: Robert Tappan Morris](https://en.wikipedia.org/wiki/Robert_Tappan_Morris)
- [Wikipedia: CERT Coordination Center](https://en.wikipedia.org/wiki/CERT_Coordination_Center)
- [RFC 1135: The Helminthiasis of the Internet](https://www.rfc-editor.org/rfc/rfc1135)
- [Eugene Spafford: The Internet Worm Program, an analysis (1988)](http://homes.cerias.purdue.edu/~spaf/tech-reps/823.pdf)
:::

---

**Serie Efecto mariposa:** [Brain (1986)](/efecto-mariposa-brain-1986/) · El gusano Morris (1988) · [ILOVEYOU (2000)](/efecto-mariposa-iloveyou/) · [Blaster y el Patch Tuesday (2001-2003)](/efecto-mariposa-blaster-patch-tuesday/) · [Stuxnet (2010)](/efecto-mariposa-stuxnet/)
