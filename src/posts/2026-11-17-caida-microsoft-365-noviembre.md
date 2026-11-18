---
title: "La caída de Microsoft 365: un cambio de julio que nadie podía deshacer"
description: Qué tumbó Outlook, Teams y Copilot en todo el mundo del 12 al 14 de noviembre de 2026, por qué tardó tanto en volver y qué deberías tener listo para cuando tu correo deje de funcionar.
gancho: "Un cambio de julio tumbó el correo de medio mundo en noviembre."
gancho_texto: "Microsoft 365 estuvo caído casi dos días. No fue un ataque: fue un defecto escondido durante meses."
tags: [resiliencia, caidas, nube]
---

En un hotel de Alemania, el sistema que dosifica el cloro de la piscina falló. La alarma funcionó y quiso avisar al personal, como siempre, por correo electrónico. El correo no salió. Cinco personas resultaron heridas.

Ese correo dependía de Microsoft 365, que el 12 de noviembre de 2026 dejó de funcionar en buena parte del mundo. De todo lo que leí sobre esta caída, esa historia es la que más se me quedó, porque resume el problema mejor que cualquier informe técnico: hemos puesto avisos críticos en un solo canal, y casi nadie se pregunta qué pasa si ese canal se calla.

## Qué pasó

El jueves 12 de noviembre, a media mañana en Costa Rica, Outlook, Teams, Copilot y el resto de Microsoft 365 empezaron a fallar en todo el mundo. Hubo reportes en más de 70 países, y Microsoft 365 tiene unos 430 millones de usuarios.

Tras unas 16 horas el problema se redujo sobre todo al correo (Exchange Online), y el servicio no quedó del todo restablecido hasta la mañana del sábado 14. Por el camino:

- El Supremo Tribunal Federal de Brasil suspendió los plazos judiciales de esos dos días.
- En el Reino Unido, parte del sistema de salud (NHS) volvió al papel y se cancelaron algunas operaciones.
- Varios hospitales de Toronto tuvieron problemas para operar.
- Una consultora estimó la productividad perdida en unos 7.000 millones de dólares.

Microsoft lo dejó claro desde el principio: fue un problema técnico, no un ciberataque.

## Por qué se cayó

Microsoft explicó la causa preliminar, y es casi una lista de todo lo que puede salir mal a la vez:

1. **En julio** se instaló un cambio en los servidores que hacen de puerta de entrada a su red. Traía un defecto que nadie detectó, porque solo aparecía con cierta carga.
2. En noviembre, un reparto distinto del tráfico aumentó esa carga.
3. Al mismo tiempo, un mantenimiento había dejado la flota con un 14 % menos de capacidad.
4. El defecto despertó: en el peor momento, más del 80 % de esos servidores dejó de responder.

Teams, OneDrive o SharePoint pudieron pasarse a un grupo de servidores de respaldo. El correo no podía hacerlo, y por eso fue lo que más tardó.

## Por qué tardó tanto en volver

Aquí está, para mí, lo más interesante del caso. Cuando algo se rompe después de un cambio, lo normal es deshacerlo. Microsoft tiene sistemas que lo hacen solos. Pero el cambio culpable no era de esa semana: llevaba **desde julio** instalado. No había un botón de "volver atrás" que sirviera.

Y cuando por fin aplicaron la corrección, pasó lo que pasa en una tienda que abre tras un apagón: todos los que esperaban entraron a la vez. El tráfico acumulado tumbó otra vez los servidores que se estaban recuperando, y tuvieron que apagar el enrutamiento automático para controlar la entrada a mano.

> Un defecto puede dormir meses dentro de un sistema. El día que despierta, ya nadie recuerda qué cambio lo trajo.

## Lo que yo revisaría en mi empresa

No puedes evitar que Microsoft se caiga. Sí puedes decidir qué pasa en tu empresa cuando ocurra.

::: leccion
- Ten un canal de emergencia que no dependa de tu correo ni de tu chat: un grupo de mensajería en otro proveedor, una lista de teléfonos o SMS.
- Revisa qué alarmas importantes avisan solo por correo, como sensores, monitoreo o copias de seguridad, y dales un segundo camino.
- Decide antes quién comunica qué cuando todo esté caído, y guarda esa lista también en papel.
- Si administras sistemas: un cambio que nadie recuerda es un riesgo. Lleva un registro de cambios y prueba qué pasa cuando sube la carga.
:::

::: fuentes Fuentes
- [Wikipedia: 2026 Microsoft outage (cronología, alcance y consecuencias)](https://en.wikipedia.org/wiki/2026_Microsoft_outage)
- [BleepingComputer: Massive Microsoft 365 outage disrupts Outlook, Teams, Copilot worldwide](https://bleepingcomputer.com/news/microsoft/massive-microsoft-365-outage-disrupts-outlook-teams-copilot-worldwide)
- [CIO: Microsoft struggles to get M365 services back online](https://www.cio.com/article/4248249/microsoft-struggles-to-get-m365-services-back-online-after-widespread-outage.html)
:::

---

Haz la prueba hoy: si mañana se cae tu correo de trabajo, ¿cómo te avisaría tu jefe? Si no tienes respuesta, ese es tu primer pendiente.
