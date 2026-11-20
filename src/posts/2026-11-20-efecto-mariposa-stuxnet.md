---
title: "Stuxnet: el día que un virus rompió máquinas de verdad"
description: Una memoria USB, cuatro fallos desconocidos y centrifugadoras en Irán. Stuxnet demostró que el código podía causar daño físico y abrió una era nueva.
gancho: "No robó datos. Hizo girar centrifugadoras hasta romperlas."
gancho_texto: "Stuxnet cruzó una red aislada en una memoria USB y mostró a los operadores datos normales mientras saboteaba las máquinas."
tags: [historia, infraestructura-critica]
---

El 17 de junio de 2010, Sergey Ulasen, de una pequeña empresa antivirus de Bielorrusia llamada VirusBlokAda, encontró un programa extraño en computadoras de clientes en Irán. Lo bautizaron primero como Rootkit.Tmphider. El mundo lo conoce como **Stuxnet**.

Con los meses, los análisis revelaron algo que nadie había visto antes: un programa diseñado no para robar información, sino para sabotear máquinas físicas.

## Cómo llegaba a una red sin internet

El objetivo probable eran las instalaciones de enriquecimiento de uranio de Natanz, en Irán. Esas redes estaban aisladas de internet. Stuxnet resolvió el problema de la forma más simple: entraba en una **memoria USB** infectada, cruzando el aislamiento físico.

Una vez dentro, se movía por la red interna y buscaba algo muy concreto: computadoras con el software Step7 de Siemens, que se usa para programar los controladores lógicos programables (PLC) que manejan maquinaria industrial. Si no los encontraba, se quedaba quieto. Para llegar hasta ahí usaba **cuatro vulnerabilidades de día cero**, algo inédito para un solo programa, y controladores firmados con certificados robados a empresas legítimas.

## Lo que hacía en las máquinas

Cuando encontraba su objetivo, Stuxnet enviaba órdenes maliciosas a los PLC mientras mostraba a los operadores un bucle de valores normales. En la sala de control todo parecía en orden. En la planta, las centrifugadoras recibían instrucciones que las dañaban.

Se ha reportado que destruyó cerca de 1.000 centrifugadoras en Natanz, aunque otras fuentes hablan de una interrupción más breve del enriquecimiento, e Irán pudo haber difundido información confusa sobre el daño.

> Lo que más me impresiona de Stuxnet no es la sofisticación técnica, sino el engaño a los operadores. Atacó la confianza en las pantallas: si lo que ves en el monitor puede ser mentira, toda la seguridad industrial tiene que repensarse.

## Quién estaba detrás

Ni Estados Unidos ni Israel lo han reconocido oficialmente. Sin embargo, varios medios independientes lo atribuyen a una operación conjunta de ambos países, conocida como Olympic Games. En junio de 2012, The New York Times informó que la operación había empezado bajo la presidencia de George W. Bush y continuado con Barack Obama.

## Se escapó

Stuxnet estaba hecho para un objetivo muy específico, pero no se quedó ahí. Según el reportaje del Times, un error de programación en una actualización le permitió salir del entorno previsto, posiblemente a través de la computadora de un ingeniero conectada después a internet. Para finales de septiembre de 2010, Symantec contaba más de 100.000 equipos infectados en el mundo, más de 60.000 en Irán.

## La tormenta: lo que cambió

<table>
<thead><tr><th>Aleteo de 2010</th><th>Lo que tenemos hoy</th></tr></thead>
<tbody>
<tr><td>Primer malware conocido que espiaba y saboteaba sistemas industriales</td><td>La seguridad de sistemas industriales (OT/ICS) como especialidad propia, con sus normas, equipos y centros de monitoreo</td></tr>
<tr><td>Una red "aislada" atravesada con una memoria USB</td><td>La certeza de que el aislamiento físico no basta: control de dispositivos extraíbles y monitoreo dentro de la red</td></tr>
<tr><td>Código con capacidad de daño físico, hecho por un Estado</td><td>El reconocimiento de las armas cibernéticas. El exdirector de la CIA y la NSA Michael Hayden dijo que había legitimado este tipo de ataques</td></tr>
<tr><td>Un arma que se escapó de su objetivo</td><td>El temor, hoy concreto, de que el código de un ataque sea estudiado y reutilizado por otros</td></tr>
</tbody>
</table>

Antes de Stuxnet, un virus podía borrar archivos o tumbar servidores. Después de Stuxnet, quedó claro que también podía afectar la electricidad, el agua o una fábrica.

::: leccion
- Las redes aisladas también se atacan: controla qué memorias USB y dispositivos se conectan a los equipos críticos.
- No confíes ciegamente en lo que muestra una pantalla de control. Los sistemas críticos necesitan verificaciones independientes y alarmas físicas.
- En entornos industriales, separa la red de oficina de la red de planta, y vigila el tráfico entre ambas.
- Los certificados digitales pueden ser robados. Una firma válida no siempre significa un programa legítimo.
:::

::: fuentes Fuentes
- [Wikipedia: Stuxnet](https://en.wikipedia.org/wiki/Stuxnet)
- [The New York Times: Obama order sped up wave of cyberattacks against Iran (2012)](https://www.nytimes.com/2012/06/01/world/middleeast/obama-ordered-wave-of-cyberattacks-against-iran.html)
- [Krebs on Security: Experts warn of new Windows shortcut flaw (julio de 2010)](https://krebsonsecurity.com/2010/07/experts-warn-of-new-windows-shortcut-flaw/)
:::

---

**Serie Efecto mariposa:** [Brain (1986)](/efecto-mariposa-brain-1986/) · [El gusano Morris (1988)](/efecto-mariposa-gusano-morris/) · [ILOVEYOU (2000)](/efecto-mariposa-iloveyou/) · [Blaster y el Patch Tuesday (2001-2003)](/efecto-mariposa-blaster-patch-tuesday/) · Stuxnet (2010)
