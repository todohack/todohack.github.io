---
title: "DeepSeek dejó su base de datos abierta a todo internet"
description: Sin exploits ni malware: una base ClickHouse sin contraseña expuso chats y claves API en plena fiebre por la IA.
tags: [ia, cloud, configuracion]
---

Todo el mundo hablaba de lo barato que había sido entrenar el modelo de **DeepSeek**. Mientras tanto, un equipo de investigadores encontró algo mucho menos glamuroso: una base de datos de la empresa abierta a cualquiera que supiera dónde mirar. No hizo falta ningún exploit. Bastó una mala configuración.

## Qué pasó

El 29 de enero de 2025, **Wiz Research** publicó que había encontrado una base de datos ClickHouse de DeepSeek expuesta en internet, **sin ningún tipo de autenticación**. Estaba en los subdominios `oauth2callback.deepseek.com` y `dev.deepseek.com` (puertos `8123` y `9000`).

Dentro había más de un millón de líneas de registros (logs) con:

- Historial de chats de usuarios.
- Claves API y otros secretos.
- Detalles del *backend* y metadatos operativos.

Wiz avisó de inmediato y DeepSeek cerró el acceso rápidamente.

## Cómo lo encontraron

Con reconocimiento básico, el mismo que se hace en cualquier prueba de intrusión autorizada:

1. Mapearon unos 30 subdominios públicos de la empresa.
2. Escanearon puertos fuera de los típicos 80 y 443, que son los de las páginas web normales.
3. Se toparon con la interfaz web de ClickHouse respondiendo sin pedir credenciales.

Según Wiz, lo encontraron "en minutos". Les bastó un `SHOW TABLES` para ver qué había, sin lanzar consultas intrusivas.

> Si un investigador lo encuentra en minutos, asume que un atacante también. Los escáneres masivos revisan todo internet de forma continua.

Lo que me parece más instructivo es lo poco sofisticado que fue todo. No hubo vulnerabilidad de software de por medio, solo una puerta que alguien dejó sin cerrar. Y eso le puede pasar a cualquier empresa, incluso a una que acaba de sacudir la industria de la IA.

::: leccion
- Haz un inventario de tu superficie de ataque: subdominios y puertos, no solo lo que crees que publicaste.
- Ninguna base de datos debe responder a internet sin autenticación y sin estar detrás de una red privada o VPN.
- No guardes secretos en los logs: enmascara claves, tokens y datos de usuarios antes de registrarlos.
- Si algo quedó expuesto, rota las claves aunque creas que nadie lo vio.
- Publica un `security.txt` para que quien encuentre un fallo sepa a quién avisar.
:::

::: fuentes Fuentes
- [Wiz Research: Wiz uncovers exposed DeepSeek database](https://www.wiz.io/blog/wiz-research-uncovers-exposed-deepseek-database-leak)
- [Infosecurity Magazine: DeepSeek database leaks sensitive data](https://www.infosecurity-magazine.com/news/deepseek-database-leaks-sensitive/)
:::

---

Prueba algo hoy: pídele a alguien de tu equipo la lista de todo lo que tu empresa tiene publicado en internet. Si nadie la tiene, ya encontraste tu primer pendiente.
