---
title: "Brain, 1986: el virus que traía nombre, dirección y teléfono"
description: Dos hermanos de Lahore escribieron el primer virus para PC para proteger su software de las copias. Traía su dirección y teléfono. Cómo empezó todo.
gancho: "El primer virus de PC traía la dirección de sus autores. Y su teléfono."
gancho_texto: "Dos hermanos paquistaníes querían frenar las copias piratas de su programa. Terminaron atendiendo llamadas de medio mundo."
tags: [historia, malware]
---

Imagina insertar un disquete en tu computadora en 1987 y que, al revisarlo, aparezca una etiqueta que dice ©Brain. En el sector de arranque, un mensaje: "Welcome to the Dungeon", el nombre de una empresa, una dirección en Lahore, Pakistán, y **tres números de teléfono**. Y una frase al final que hoy suena casi cómica: contáctenos para la vacuna.

Ese fue Brain, considerado el primer virus para la IBM PC y sus compatibles. Su fecha de lanzamiento se suele dar como el 19 de enero de 1986.

Esta es la primera entrega de una serie sobre virus que, con muy poco código, cambiaron el rumbo de la informática. Efecto mariposa: un aleteo pequeño, una tormenta décadas después.

## Quiénes lo hicieron y por qué

Los autores fueron dos hermanos, Basit y Amjad Farooq Alvi, que tenían un negocio llamado Brain Computer Services en Lahore. Según contaron a la revista Time en 1988, escribieron el virus para proteger de las copias ilegales un programa médico que vendían. La idea era castigar solo a quien copiara su software sin pagar.

El problema es que un virus no entiende de intenciones. Brain se copiaba de disquete en disquete, y los disquetes viajaban. Pronto llegó al Reino Unido, a Estados Unidos y a otros países, y los teléfonos de los hermanos empezaron a sonar con gente que exigía que les limpiaran sus discos.

## Qué hacía exactamente

Brain era un virus de **sector de arranque**. Reemplazaba el sector de arranque del disquete por una copia de sí mismo y movía el original a otra parte del disco, marcándola como dañada. Los disquetes infectados mostraban unos 5 KB de sectores "malos", y la unidad se volvía más lenta.

Un detalle importante: no estaba hecho para destruir. Evitaba a propósito los discos duros y no borraba datos, a diferencia de otros virus de la época. Justamente por eso pasaba desapercibido: si no rompe nada, nadie lo busca.

> Me parece fascinante que el primer virus de PC no fuera obra de un criminal escondido, sino de dos hermanos que firmaron con su dirección. No había, todavía, la idea de que esto pudiera ser un delito ni de que alguien debiera esconderse.

## El aleteo y la tormenta

Brain no robó nada ni tumbó ninguna red. Su importancia está en lo que demostró:

<table>
<thead><tr><th>Lo que Brain hizo en 1986</th><th>Lo que eso anticipó</th></tr></thead>
<tbody>
<tr><td>Viajó sin internet, solo en disquetes compartidos</td><td>Que el código malicioso no necesita una red para propagarse: basta con que la gente comparta archivos</td></tr>
<tr><td>Se escondía en el arranque, antes que el sistema operativo</td><td>La idea de infectar lo que se ejecuta primero, que siguen usando los *bootkits* modernos</td></tr>
<tr><td>No hacía daño visible</td><td>Que el malware más exitoso es el que no se nota</td></tr>
<tr><td>Nació como "protección" contra copias</td><td>El debate, todavía vivo, sobre hasta dónde puede llegar un fabricante para proteger su software en la computadora del usuario</td></tr>
</tbody>
</table>

Ninguna de esas lecciones estaba escrita en 1986. Se aprendieron porque un programa pequeño, pensado para un problema local, salió de Lahore y dio la vuelta al mundo en bolsillos y sobres.

## 25 años después

En 2011, Mikko Hyppönen, investigador de la empresa finlandesa F-Secure, viajó a Pakistán para entrevistar a los hermanos para un documental, 25 años después de Brain. Para entonces, los Alvi dirigían un proveedor de internet, Brain NET, junto a un tercer hermano. La dirección del mensaje seguía siendo la de su negocio.

::: leccion
- Un programa no se queda donde lo pones: lo que compartes puede llegar mucho más lejos de lo que imaginas, y con él, lo que traiga escondido.
- Que algo no haga daño visible no significa que no esté ahí. Escanea memorias USB y archivos de origen desconocido antes de abrirlos.
- El arranque sigue siendo un objetivo: mantén activados el arranque seguro (Secure Boot) y las actualizaciones de firmware de tu equipo.
- Las buenas intenciones no hacen seguro un código que se copia solo. Cualquier mecanismo que se propague sin control termina fuera de control.
:::

::: fuentes Fuentes
- [Wikipedia: Brain (computer virus)](https://en.wikipedia.org/wiki/Brain_(computer_virus))
- [The Register: PC virus celebrates 20th birthday (2006)](https://www.theregister.com/off-prem/2006/01/19/pc-virus-celebrates-20th-birthday/628957)
- [F-Secure: Brain, descripción del virus](http://www.f-secure.com/v-descs/brain.shtml)
:::

---

**Serie Efecto mariposa:** Brain (1986) · [El gusano Morris (1988)](/efecto-mariposa-gusano-morris/) · [ILOVEYOU (2000)](/efecto-mariposa-iloveyou/) · [Blaster y el Patch Tuesday (2001-2003)](/efecto-mariposa-blaster-patch-tuesday/) · [Stuxnet (2010)](/efecto-mariposa-stuxnet/)
