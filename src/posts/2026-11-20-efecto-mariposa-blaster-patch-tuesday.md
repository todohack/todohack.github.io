---
title: "Code Red, Slammer y Blaster: el origen del Patch Tuesday"
description: Entre 2001 y 2003, tres gusanos usaron fallos ya parcheados de Windows. Su resaca cambió cómo Microsoft programa y por qué actualizas cada segundo martes.
gancho: "¿Por qué Windows se actualiza el segundo martes de cada mes? Por un gusano."
gancho_texto: "Tres gusanos en tres años aprovecharon fallos con parche disponible. Microsoft tuvo que cambiar su forma de trabajar."
tags: [historia, parcheo]
---

Si alguna vez te preguntaste por qué las actualizaciones de Windows llegan el segundo martes de cada mes, la respuesta tiene nombre: Blaster. Y detrás de Blaster hay otros dos gusanos que, entre 2001 y 2003, pusieron a Microsoft contra la pared.

Lo curioso es que ninguno de los tres usó una vulnerabilidad desconocida. **Todos aprovecharon fallos que ya tenían parche.** El problema no era el código: era que nadie lo actualizaba.

## Code Red, julio de 2001

Code Red atacaba el servidor web de Microsoft, IIS, mediante un desbordamiento de búfer que se había parchado un mes antes. Se observó por primera vez el 15 de julio de 2001, y el 19 de julio ya había **359.000 equipos infectados**.

Las páginas web de los servidores infectados mostraban un mensaje: "Hacked By Chinese!". Y entre los días 20 y 27 de cada mes, los equipos infectados lanzaban ataques de denegación de servicio contra varias direcciones IP, entre ellas la del servidor web de la Casa Blanca.

## SQL Slammer, enero de 2003

Slammer fue una demostración de lo que puede hacer muy poco código. Todo el gusano ocupaba **376 bytes** y cabía en un solo paquete de red. No necesitaba que nadie abriera nada: bastaba con que el paquete llegara a un SQL Server sin parchear.

Infectó a la mayoría de sus 75.000 víctimas en unos 10 minutos. El parche existía desde julio de 2002, seis meses antes, y aun así había muchas instalaciones sin aplicar, incluidas varias de la propia Microsoft. Entre sus efectos, la mayoría de los 13.000 cajeros de Bank of America dejaron de procesar transacciones.

## Blaster, agosto de 2003

Blaster empezó a propagarse el 11 de agosto de 2003. Usaba un fallo del servicio RPC de Windows parchado en julio, y no necesitaba que el usuario hiciera nada: bastaba con estar conectado a internet.

En la práctica, muchos usuarios veían una ventana que anunciaba que Windows se iba a reiniciar porque el servicio RPC había terminado inesperadamente, con una cuenta regresiva. Y se reiniciaba. Una y otra vez. Dentro del código había un mensaje dirigido a Bill Gates, pidiéndole que dejara de ganar dinero y arreglara su software. El gusano también intentaba atacar `windowsupdate.com`, el sitio de las actualizaciones, aunque con poco éxito.

> Me resulta irónico que el gusano más molesto de la época atacara justamente el sitio de las actualizaciones. Era como si supiera que su única debilidad era que la gente instalara los parches.

## La tormenta: lo que cambió

<table>
<thead><tr><th>Aleteo</th><th>Lo que tenemos hoy</th></tr></thead>
<tbody>
<tr><td>Clientes grandes furiosos tras Code Red y Nimda</td><td>El 15 de enero de 2002, Bill Gates envió el memorando de Trustworthy Computing: la seguridad, la privacidad y la fiabilidad pasaban a ser prioridad de la empresa</td></tr>
<tr><td>Parches publicados en cualquier momento, difíciles de planificar</td><td>En octubre de 2003, tras Blaster, Microsoft formalizó el <strong>Patch Tuesday</strong>: parches agrupados el segundo martes de cada mes, para que las empresas pudieran planificar</td></tr>
<tr><td>Windows XP salía a internet sin protección activa</td><td>En agosto de 2004, Windows XP SP2 trajo el Firewall de Windows activado por defecto y el nuevo Centro de seguridad</td></tr>
<tr><td>Seguridad como algo que se añade al final</td><td>El desarrollo seguro (lo que Microsoft formalizó como Security Development Lifecycle) y la idea de "seguro por defecto"</td></tr>
</tbody>
</table>

Hoy damos por sentado que el sistema operativo viene con firewall encendido y que se actualiza solo. Hace poco más de veinte años, eso no era así, y hicieron falta tres gusanos para cambiarlo.

## La lección que no envejece

Code Red, Slammer y Blaster tienen algo en común con muchos ataques actuales: el parche existía. En [el Octubre Negro de 2026](/octubre-negro-2026/) vimos lo mismo con otros nombres. La brecha entre que sale una corrección y que se instala sigue siendo una de las ventanas favoritas de los atacantes.

::: leccion
- Instala las actualizaciones de seguridad pronto. Los tres gusanos de esta historia usaron fallos con parche disponible desde semanas o meses antes.
- Mantén el firewall activado y no expongas a internet servicios que no necesitas (bases de datos, RPC, escritorio remoto).
- En una empresa, ten un ciclo de parcheo: inventario, pruebas rápidas y despliegue. El Patch Tuesday existe para que puedas planificarlo.
- Un gusano no necesita que hagas clic. Si un servicio vulnerable está expuesto, basta con que esté encendido.
:::

::: fuentes Fuentes
- [Wikipedia: Code Red (computer worm)](https://en.wikipedia.org/wiki/Code_Red_(computer_worm))
- [Wikipedia: SQL Slammer](https://en.wikipedia.org/wiki/SQL_Slammer)
- [Wikipedia: Blaster (computer worm)](https://en.wikipedia.org/wiki/Blaster_(computer_worm))
- [Wikipedia: Trustworthy computing](https://en.wikipedia.org/wiki/Trustworthy_computing)
- [Wikipedia: Patch Tuesday](https://en.wikipedia.org/wiki/Patch_Tuesday)
- [CISA: Security improvements in Windows XP Service Pack 2 (2004)](https://cisa.gov/news-events/alerts/2004/08/30/security-improvements-windows-xp-service-pack-2)
:::

---

**Serie Efecto mariposa:** [Brain (1986)](/efecto-mariposa-brain-1986/) · [El gusano Morris (1988)](/efecto-mariposa-gusano-morris/) · [ILOVEYOU (2000)](/efecto-mariposa-iloveyou/) · Blaster y el Patch Tuesday (2001-2003) · [Stuxnet (2010)](/efecto-mariposa-stuxnet/)
