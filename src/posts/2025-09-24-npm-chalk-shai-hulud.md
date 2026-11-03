---
title: "npm bajo ataque: de chalk y debug al gusano Shai-Hulud"
description: Un phishing a un solo desarrollador envenenó paquetes con miles de millones de descargas. Una semana después llegó un gusano que se replicaba solo.
tags: [supply-chain, phishing, desarrollo]
---

Si programas en JavaScript, es muy probable que tu proyecto dependa de chalk o debug aunque nunca los hayas instalado a propósito. Vienen dentro de otras librerías, que vienen dentro de otras. En septiembre de 2025 esas dependencias invisibles se convirtieron en el vehículo de dos ataques encadenados a npm, el repositorio donde el mundo JavaScript comparte su código.

## Qué pasó

**8 de septiembre de 2025.** Un correo que imitaba al soporte de npm, con un falso aviso de verificación en dos pasos, engañó al mantenedor Josh Junon (*qix*). Con su cuenta, los atacantes publicaron versiones maliciosas de chalk, debug, ansi-styles y otros paquetes que suman más de **2.600 millones de descargas semanales**. El código robaba criptomonedas cambiando direcciones en el navegador. Se retiraron en pocas horas.

Una semana después apareció **Shai-Hulud**, un gusano autorreplicante. KrebsOnSecurity reportó al menos 187 paquetes infectados, y CISA alertó después de más de 500.

## Cómo funcionaba el gusano

1. Al instalarse, buscaba tokens de npm y otros secretos en la máquina, usando *TruffleHog*.
2. Con cada token robado, publicaba versiones infectadas de los paquetes de esa víctima.
3. Exfiltraba los secretos a repositorios públicos de GitHub llamados *Shai-Hulud*.

> Es la definición de efecto dominó: cada desarrollador infectado se convertía en el siguiente atacante.

Me llama la atención que todo empezó con un correo, no con una vulnerabilidad en código. Un solo mantenedor, un solo mensaje convincente, y miles de millones de descargas quedaron expuestas. Cuando tanto depende de una persona, su bandeja de entrada pasa a ser infraestructura crítica.

::: leccion
- Usa passkeys o llaves FIDO2 en cuentas de mantenedores; los códigos TOTP se pueden robar con phishing.
- Fija versiones con lockfile y usa `npm ci` en tus pipelines.
- Desactiva los scripts de instalación en CI cuando puedas (`npm ci --ignore-scripts`).
- Usa tokens de publicación de corta vida y con alcance mínimo.
- Escanea tus repositorios en busca de secretos y de repos que no reconozcas.
:::

::: fuentes Fuentes
- [KrebsOnSecurity: Self-replicating worm hits 180+ software packages](https://krebsonsecurity.com/2025/09/self-replicating-worm-hits-180-software-packages/)
- [Check Point: The great npm heist, September 2025](https://blog.checkpoint.com/crypto/the-great-npm-heist-september-2025/)
- [Anvilogic: CISA alert on Shai-Hulud npm worm](https://www.anvilogic.com/threat-reports/cisa-shai-hulud-npm-worm)
:::

---

Abre el `package.json` de tu proyecto más importante y revisa si hay un lockfile. Si no lo hay, ya sabes qué arreglar primero.
