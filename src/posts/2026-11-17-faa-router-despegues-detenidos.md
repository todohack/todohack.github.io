---
title: "Un router nuevo detuvo todos los despegues de Estados Unidos"
description: Por qué la FAA paró los despegues en todo EE. UU. el 13 de noviembre de 2026: un router nuevo saturó una red antigua. Parecía un ciberataque y no lo fue.
gancho: "Un router nuevo dejó en tierra a todos los aviones de Estados Unidos."
gancho_texto: "No fue un ataque, pero se comportó exactamente como uno: mil intentos de conexión cada pocos segundos contra una red antigua."
tags: [resiliencia, caidas]
---

La tarde del 13 de noviembre de 2026, ningún avión pudo despegar en Estados Unidos. Los que ya estaban en el aire siguieron su ruta y aterrizaron con normalidad; los que estaban en tierra se quedaron ahí. En redes sociales nadie dudaba: tenía que ser un ciberataque.

No lo fue. Y, sin embargo, lo que lo causó se comportó igual que uno. Por eso este caso me parece tan útil para entender cómo funcionan las redes críticas por dentro.

## Qué pasó

A las 2:54 de la tarde, hora de Costa Rica, la autoridad de aviación de Estados Unidos (FAA) ordenó detener los despegues en todo el país. La orden duró unas cuatro horas y media, pero el efecto se arrastró durante días:

- Más de 4.100 vuelos cancelados y 3.200 retrasados hasta el sábado, según FlightAware.
- En México, la autoridad de aviación civil reportó 193 vuelos y unos 18.000 pasajeros afectados.
- Europa suspendió durante horas algunas salidas hacia Estados Unidos.

Durante la emergencia, los controladores empezaron a ver la red de radiocomunicaciones, la que usan para guiar a los aviones, cada vez más inestable.

## Cómo pudo pasar

La causa no está cerrada, pero lo que contaron las autoridades dibuja una escena muy concreta. En una instalación remota del sur de Arkansas, el contratista de telecomunicaciones de la FAA, L3Harris, estaba haciendo una tarea rutinaria: cambiar líneas de cobre antiguas por fibra óptica.

Como parte de ese trabajo se instaló un router nuevo. Ese equipo empezó a lanzar unas **mil solicitudes de conexión cada cuatro o cinco segundos** contra la red de la FAA. Los equipos más viejos de la red no estaban hechos para ese volumen: se saturaron y empezaron a dar información inconsistente. Para frenarlo, desactivaron una función de difusión en unos sesenta routers parecidos.

> Una avalancha de conexiones que satura una red hasta que deja de funcionar tiene nombre en seguridad: ataque de denegación de servicio. Aquí no hubo atacante. Hubo un equipo nuevo, bien intencionado, conectado a una red que no podía con él.

El propio responsable de la FAA advirtió que esto todavía no es la explicación completa. Falta saber si fue un error de instalación, un fallo humano o un problema del equipo. Las autoridades sí descartaron un ciberataque o una interferencia extranjera.

## Por qué todos pensaron en un ataque

Porque fue la tercera caída grande en una semana. El 12 de noviembre se había caído [Microsoft 365](/caida-microsoft-365-noviembre/), y el 16 una falla de software paró las salidas de United Airlines durante más de hora y media. Ninguna fue un ataque.

Lo que tienen en común me preocupa más que un hacker: sistemas que dependen de una sola pieza y redes antiguas que reciben equipos nuevos sin que nadie pruebe cómo van a convivir. El gobierno pide ahora 50.000 millones de dólares para renovar todo el sistema de control aéreo. El dinero ayuda, pero la lección de Arkansas es otra: el riesgo no está solo en lo viejo, sino en el momento de mezclarlo con lo nuevo.

## Lo que se aprende para cualquier red

::: leccion
- Antes de conectar un equipo nuevo a una red vieja, pruébalo aparte y comprueba cuánto tráfico genera.
- Haz los cambios por partes: primero en un sitio, luego en el resto, nunca en todos a la vez.
- Vigila los picos de conexiones: mil intentos cada pocos segundos deberían disparar una alarma, venga de un atacante o de un equipo propio.
- Ten un plan para operar en modo degradado: los aviones en el aire pudieron aterrizar porque eso estaba previsto.
:::

::: fuentes Fuentes
- [Wikipedia: 2026 FAA nationwide ground stop](https://en.wikipedia.org/wiki/2026_FAA_nationwide_ground_stop)
- [Scripps News: What caused the FAA ground stop? Officials point to router failure during update](https://www.scrippsnews.com/life/travel/what-caused-the-faa-ground-stop-officials-point-to-router-failure)
- [GPB: FAA blames Friday's ground stop on 'equipment issue' during telecoms network upgrade](https://www.gpb.org/news/2026/11/14/faa-blames-fridays-ground-stop-on-equipment-issue-during-telecoms-network-upgrade)
- [El Comercio: EE. UU. descarta un ciberataque tras la suspensión de vuelos](https://www.elcomercio.com/actualidad/mundo/ee-uu-descarta-ciberataque-suspension-vuelos-preve-normalidad/)
- [Infobae: United Airlines afirmó que no hay indicios de un ciberataque](https://www.infobae.com/estados-unidos/2026/11/17/united-airlines-afirmo-que-no-hay-indicios-de-un-ciberataque-en-el-problema-de-software-que-provoco-los-retrasos-en-los-vuelos/)
:::

---

La próxima vez que veas una caída enorme y todos griten «¡hackeo!», espera un par de días. Muchas veces el atacante resulta ser un cambio que alguien hizo con la mejor intención.
