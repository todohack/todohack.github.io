---
title: "F5 hackeada: roban el código de BIG-IP y CISA declara emergencia"
description: Cuando roban el código fuente de los equipos que protegen tu red, el reloj empieza a correr para todos sus clientes.
tags: [supply-chain, apt, vulnerabilidades]
---

Si alguien se llevara los planos de la cerradura que usa medio mundo, no tendrías que esperar a que abra una puerta para preocuparte. Algo así le pasó a **F5**: en octubre de 2025 supimos que un atacante se había llevado el código fuente de **BIG-IP**, unos equipos que están en el borde de la red de miles de empresas y gobiernos. Reparten el tráfico, publican aplicaciones y, muchas veces, son la puerta de entrada.

## Qué pasó

F5 reveló que un actor "altamente sofisticado", afiliado a un Estado, tuvo acceso persistente a su entorno de desarrollo de BIG-IP. Descargó archivos que incluían:

- Parte del código fuente de BIG-IP.
- Información sobre vulnerabilidades que aún no se habían publicado.

El 15 de octubre de 2025, la agencia estadounidense CISA emitió la **Directiva de Emergencia ED 26-01**. Obligó a las agencias federales a inventariar sus equipos F5 y a actualizarlos en cuestión de días. También debían desconectar los que ya no tuvieran soporte y estuvieran expuestos a internet.

## Por qué me preocupa tanto

Con el código y la lista de fallos pendientes, el atacante puede buscar vulnerabilidades nuevas con ventaja y preparar sus ataques antes de que existan parches. CISA lo calificó como una amenaza inminente.

> Robar código no rompe nada hoy, pero acorta el tiempo hasta el próximo ataque.

Lo que más me inquieta es que las víctimas no son solo F5. Son todos sus clientes, que no hicieron nada mal y aun así quedan corriendo contra el reloj. Es un tipo de riesgo que no se arregla con una buena contraseña: depende de un proveedor.

## Lo que yo revisaría

::: leccion
- Haz un inventario de tus equipos perimetrales: no puedes proteger lo que no sabes que tienes.
- Nunca dejes la interfaz de administración abierta a internet. Usa una red de gestión aparte o un servidor intermedio de acceso (*jump box*).
- Retira los equipos sin soporte: no recibirán parches para lo que se descubra con ese código.
- Cambia las credenciales y claves API que estén guardadas en los dispositivos.
- Vigila el perímetro con registros y control de integridad de archivos. Ahí apuntarán los próximos ataques.
:::

::: fuentes Fuentes
- [CISA: ED 26-01, Mitigate vulnerabilities in F5 devices](https://www.cisa.gov/news-events/directives/ed-26-01-mitigate-vulnerabilities-f5-devices)
- [The Hacker News: F5 breach exposes BIG-IP source code](https://thehackernews.com/2025/10/f5-breach-exposes-big-ip-source-code.html)
:::

---

Si en tu empresa hay un BIG-IP, pregunta hoy quién lo administra y desde dónde se puede entrar a su panel.
