---
title: "Microsoft Authenticator: una app falsa podía robar tu cuenta de trabajo"
description: Qué fue AuthMask (CVE-2026-80097), la falla de Microsoft Authenticator en Android que dejaba a una app sin permisos llevarse tu acceso al correo, Teams y archivos del trabajo, y qué hacer hoy.
gancho: "Una app decía «soy Teams» y Microsoft Authenticator le creía."
gancho_texto: "Así funcionaba AuthMask: sin permisos especiales, se llevaba el acceso a tu cuenta de trabajo."
tags: [identidad, vulnerabilidades, parcheo]
---

Instalamos Microsoft Authenticator para estar más seguros. Es la app que aprueba nuestros inicios de sesión y la que nos recomienda cualquier equipo de TI. Por eso este caso me parece tan incómodo: hasta su corrección en septiembre, en Android, esa misma app podía entregarle las llaves de tu cuenta de trabajo a cualquier otra app que se lo pidiera con el nombre correcto.

## Qué pasó

El investigador Ofek Levin, de la empresa Enclave, encontró la falla y la llamó **AuthMask**. Microsoft la corrigió y le asignó el identificador CVE-2026-80097 el 8 de septiembre de 2026, con una gravedad de 8,6 sobre 10. Los detalles se publicaron el 23 de octubre.

Afecta solo a Android: desde la versión 6.0.0 hasta antes de la **6.2606.4246**, que es la que la corrige. No hay ataques reales confirmados; Enclave lo demostró en pruebas controladas.

## Cómo funcionaba, sin tecnicismos

En Android, Authenticator hace de recepcionista para las apps de Microsoft. Cuando Teams u Outlook necesitan entrar a tu cuenta, no te piden la contraseña otra vez: se la piden a Authenticator, que les entrega un pase de acceso (lo que técnicamente se llama un *token*).

El problema estaba en cómo el recepcionista comprobaba quién le pedía el pase. No verificaba la identidad real de la app: se fiaba de lo que la propia app decía de sí misma. Había un control, pero comparaba la petición con datos de Teams que cualquier app del teléfono puede leer. Era como pedir un carné y compararlo con una foto pegada en la puerta.

Así que una app maliciosa podía decir «soy Teams» y recibir el pase de Teams. Sin pedir ningún permiso especial y, según Enclave, sin que vieras ningún aviso.

## Qué se llevaba el atacante

Con esos pases, la app podía actuar como tú en tu cuenta de trabajo:

- Leer y enviar correos.
- Leer y cambiar archivos, el calendario y los sitios de SharePoint.
- Mandar mensajes de Teams en tu nombre.

Y hay algo que, para mí, es lo más grave. Haciéndose pasar por el propio Authenticator, podía cambiar tus métodos de inicio de sesión, incluso crear una llave de acceso (*passkey*) nueva. Eso significa que el atacante podía quedarse dentro aunque después borraras la app maliciosa. Te limpias el teléfono y él sigue teniendo su propia llave.

## El matiz: ¿hacía falta que hicieras algo?

Aquí Microsoft y Enclave no cuentan lo mismo. Enclave dice que, una vez instalada la app falsa, el robo era silencioso. Microsoft, en su evaluación, indica que hacía falta interacción del usuario: instalar la app y completar un inicio de sesión en Authenticator.

En lo que ambos coinciden es en el punto de partida: necesitabas tener instalada una app maliciosa. Por eso este caso es también un recordatorio de lo que cuesta instalar cualquier cosa que no venga de una tienda de confianza.

## Qué haría yo hoy

Actualizar no basta si ya te robaron un pase: los pases robados antes del parche pueden seguir sirviendo. Por eso la lista tiene dos partes.

::: leccion
- Abre Google Play y comprueba que tu Microsoft Authenticator está en la versión 6.2606.4246 o superior.
- No instales apps de fuera de las tiendas oficiales, sobre todo en el teléfono que usas para el trabajo.
- Revisa tus métodos de inicio de sesión en tu cuenta de Microsoft: si ves una llave de acceso o un dispositivo que no reconoces, avisa a TI.
- Si administras equipos: exige con tu MDM la versión mínima de Authenticator, vigila en Entra los cambios de métodos de autenticación y, si sospechas algo, revoca las sesiones del usuario.
- Usa políticas de acceso condicional que exijan dispositivos que cumplan las reglas de la empresa.
:::

::: fuentes Fuentes
- [Help Net Security: Microsoft Authenticator vulnerability let rogue Android apps steal work account access](https://www.helpnetsecurity.com/2026/10/27/microsoft-authenticator-vulnerability-patchedcve-2026-80097/)
- [The Hacker News: Microsoft Authenticator flaw let permissionless Android apps steal work account tokens](https://thehackernews.com/2026/10/microsoft-authenticator-flaw-let.html)
- [eSecurity Planet: Microsoft Authenticator flaw scores 8.6](https://www.esecurityplanet.com/threats/news-microsoft-authenticator-android-flaw-cve-2026-80097/)
- [GitHub Advisory Database: CVE-2026-80097](https://github.com/advisories/GHSA-wp3h-mh9h-f6cm)
:::

---

La próxima vez que una app te pida instalar «una herramienta para ver mejor tus documentos de Teams», acuérdate de AuthMask. A veces la amenaza no entra rompiendo la cerradura: entra diciendo que es de la casa.
