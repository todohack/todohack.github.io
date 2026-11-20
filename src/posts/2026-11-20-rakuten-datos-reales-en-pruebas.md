---
title: "Rakuten Securities: datos reales en un entorno de pruebas"
description: Hasta 11,25 millones de cuentas de una correduría japonesa expuestas desde un entorno de pruebas. Qué se filtró y por qué los datos reales no van ahí.
gancho: "El ataque no fue a producción. Fue al servidor de pruebas."
gancho_texto: "Rakuten Securities guardaba datos reales de millones de clientes donde se prueban cambios. Alguien llegó primero."
tags: [privacidad, devsecops]
---

En casi cualquier empresa que desarrolla software hay dos mundos. Producción, donde están los clientes reales, vigilada y con todos los controles. Y el entorno de pruebas, donde se ensayan los cambios antes de publicarlos, que suele tener menos vigilancia porque, en teoría, ahí no hay nada valioso.

En Rakuten Securities, una de las mayores corredurías en línea de Japón, sí lo había.

## Qué pasó

El 16 de noviembre de 2026, la empresa detectó un posible acceso no autorizado de un tercero a una parte de sus sistemas y lo cortó. Al investigar, encontró que el **11 de noviembre** información guardada en un entorno de pruebas pudo haber salido hacia fuera. Lo anunció el 17 de noviembre.

Rakuten no ha explicado cómo entró el atacante ni por qué había información de clientes reales en ese entorno. Lo que sí detalló es qué datos estaban ahí.

## Qué datos quedaron expuestos

La empresa separó dos grupos. Las cifras son "hasta" y cuentan cuentas, no personas; tampoco se sabe si un grupo está dentro del otro.

<table>
<thead><tr><th>Grupo</th><th>Datos</th></tr></thead>
<tbody>
<tr><td>Hasta 11,25 millones de cuentas</td><td>Código de sucursal y de cliente, e ID de inicio de sesión de Rakuten Securities</td></tr>
<tr><td>Hasta 4,47 millones de cuentas</td><td>Lo anterior, más nombre, fecha de nacimiento, dirección, teléfono, correo, lugar de trabajo, cuenta bancaria para retiros, ingresos y patrimonio declarados, y activos por producto</td></tr>
</tbody>
</table>

Hay también clientes que ya habían cerrado su cuenta. Según la empresa, **no se ha confirmado** la filtración de contraseñas ni de los PIN de operación, y no ha visto accesos ni operaciones fraudulentas ligadas a este incidente. Algunos medios lo contaron como "no se filtraron"; la frase oficial es más prudente.

El 19 de noviembre, la Agencia de Servicios Financieros de Japón (FSA) le ordenó entregar un informe formal.

## Por qué esto preocupa aunque no haya contraseñas

Un ID de inicio de sesión, un nombre, el banco donde recibes tu dinero y cuánto patrimonio declaraste es el kit perfecto para un fraude dirigido. Con eso, un correo o una llamada falsa de "Rakuten" suena muy creíble. No es un temor teórico: en 2025, Japón vivió una ola de cuentas de corredurías secuestradas con las que se hicieron compras ilegales de acciones.

Rakuten respondió en esa línea: recordó que sus correos no traen enlaces, que no pide datos de acceso por teléfono, y empujó el inicio de sesión con passkeys, que según la empresa ya usa más del 90 % de sus usuarios diarios. También permite a cada cliente suspender temporalmente operaciones y retiros desde la configuración de seguridad.

> Para mí, la lección de fondo es incómoda porque es muy común: el entorno de pruebas se trata como un patio trasero. Si los datos de ahí son reales, el patio trasero tiene la misma puerta que la caja fuerte, solo que sin alarma.

## La regla: datos reales, solo en producción

Copiar la base de producción a pruebas es tentador: los errores raros aparecen con datos reales y es más rápido que inventarlos. Pero cada copia multiplica los lugares donde un atacante puede encontrar lo mismo. Las alternativas existen desde hace años:

- **Datos sintéticos**: generados para que parezcan reales, sin pertenecer a nadie.
- **Enmascaramiento**: se cambian nombres, documentos y cuentas por valores falsos que conservan el formato.
- **Subconjuntos mínimos**: si de verdad hacen falta datos reales, solo los indispensables, por el menor tiempo posible, y con los mismos controles que producción.

En Costa Rica, la [Ley 8968](/ley-8968-proteccion-datos-costa-rica/) pide que los datos personales se usen para el fin con que se recogieron y con medidas de seguridad adecuadas. Una copia completa de clientes en un servidor de pruebas difícilmente encaja en ninguna de las dos cosas.

## Qué hacer

::: leccion
- Si desarrollas software: no copies datos reales a pruebas. Usa datos sintéticos o enmascarados, y si no hay otra opción, aplica a ese entorno los mismos controles, accesos y registros que a producción.
- Haz inventario de tus entornos de pruebas, demos y respaldos viejos: suelen ser donde quedan copias olvidadas de clientes.
- Borra los datos de prueba cuando termine la prueba. Un entorno que nadie usa es un entorno que nadie vigila.
- Si eres cliente de una empresa con una filtración así: espera más intentos de fraude, desconfía de correos y llamadas que usen tus datos para parecer legítimos, y activa passkeys o doble factor.
- Ojo con los mensajes que ofrecen "indemnizaciones" o demandas colectivas tras una filtración: también son un gancho clásico de estafa.
:::

::: fuentes Fuentes
- [SmartScope: Rakuten Securities potential data breach (actualizado al 20 de noviembre)](https://smartscope.blog/en/blog/rakuten-securities-potential-data-breach-up-approximately-4-2026/)
- [Cyber Delegate: Rakuten Securities warns customer data from up to 11.25 million accounts may have been exposed](https://www.cyberdelegate.com/rakuten-securities-warns-customer-data-from-up-to-11-25-million-accounts-may-have-been-exposed/)
- [Beinsure: Rakuten Securities data breach may expose 11.25 mn customer accounts](https://beinsure.com/news/rakuten-securities-data-breach-may-expose-11-25-mn-customer-accounts/)
- [The Record: Japan warns of unauthorized trades on hacked accounts (2025)](https://therecord.media/japan-warns-of-unauthorized-trades-hacked-accounts)
:::

---

La pregunta para llevarse al trabajo el lunes es sencilla: ¿cuántas copias de tus clientes existen fuera de producción? Si la respuesta es "no sé", ya tienes tarea.
