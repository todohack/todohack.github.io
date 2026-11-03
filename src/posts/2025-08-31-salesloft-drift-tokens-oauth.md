---
title: "Salesloft Drift: tokens OAuth robados abren decenas de Salesforce"
description: Los atacantes no necesitaron contraseñas. Usaron la llave que una integración de terceros ya tenía dentro.
tags: [supply-chain, cloud, identidad]
---

Piensa en cuántas aplicaciones conectaste alguna vez a tu correo, tu CRM o tu nube con un simple botón de "Permitir acceso". Cada una guarda un **token**, algo parecido a una llave que le dice al sistema "esta app ya tiene permiso". En agosto de 2025, alguien robó las llaves de una de esas integraciones y abrió las puertas de muchas empresas a la vez.

## Qué pasó

**Google Threat Intelligence (Mandiant)** publicó que el grupo UNC6395 usó tokens OAuth robados de **Drift**, el chatbot de ventas de Salesloft, para entrar a instancias de Salesforce de sus clientes entre el 8 y el 18 de agosto de 2025.

Desde ahí exportaron datos de forma masiva y buscaron secretos dentro de ellos: claves de AWS, tokens de Snowflake y contraseñas. El 20 de agosto, Salesloft y Salesforce revocaron todos los tokens de Drift. Días después se supo que también se había accedido a correos de algunas cuentas de Google Workspace conectadas a Drift.

## Cómo lo hicieron

- Abusaron de la relación de confianza con un tercero: los clientes confiaban en Drift, y Drift tenía acceso a sus datos.
- Usaron tokens de aplicación robados, sin pasar por contraseña ni MFA.
- Lanzaron consultas masivas a Salesforce y luego borraron los trabajos de consulta para esconderse.

> Un token OAuth se salta tu MFA. Para el sistema, quien lo usa ya está autenticado. Por eso los permisos de cada integración importan tanto como las contraseñas.

Lo que me parece revelador es que las víctimas no cometieron ningún error visible. Ninguna contraseña se filtró, ningún empleado cayó en un engaño. El problema estaba en una app que alguien conectó hace meses y que nadie volvió a mirar.

::: leccion
- Haz un inventario de tus integraciones OAuth y revoca las que no uses.
- Aplica mínimo privilegio: evita conceder acceso completo (*full access*) a apps de terceros.
- Restringe por IP las apps conectadas y quita el permiso de API a perfiles que no lo necesitan.
- No guardes secretos en tickets ni en notas del CRM; escanéalos con herramientas como *TruffleHog*.
- Ante un incidente de un proveedor: revoca, rota y revisa los logs de todo lo que estaba conectado.
:::

::: fuentes Fuentes
- [Google Cloud Threat Intelligence: Data theft from Salesforce instances via Salesloft Drift](https://cloud.google.com/blog/topics/threat-intelligence/data-theft-salesforce-instances-via-salesloft-drift)
- [The Hacker News: Google warns of Salesloft OAuth breach](https://thehackernews.com/2025/08/google-warns-salesloft-oauth-breach.html)
:::

---

Abre hoy la lista de aplicaciones conectadas a tu cuenta de Google, Microsoft o Salesforce. Cuéntame cuántas encontraste que ya no usabas.
