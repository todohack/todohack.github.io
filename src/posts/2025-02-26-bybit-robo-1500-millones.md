---
title: "Bybit: 1.500 millones robados sin tocar su infraestructura"
description: El mayor robo cripto de la historia no atacó a Bybit, atacó la interfaz web en la que confiaban sus firmantes.
gancho: "Firmaron una transferencia normal. Les costó 1.500 millones de dólares."
gancho_texto: "Los firmantes de Bybit vieron en pantalla lo que esperaban ver. La interfaz en la que confiaban les mentía."
tags: [cripto, supply-chain, apt]
---

Los firmantes de Bybit vieron en pantalla una transferencia normal y la aprobaron. Esa firma costó más de **1.500 millones de dólares**. El 21 de febrero de 2025 se produjo el mayor robo de criptomonedas de la historia, y los atacantes nunca entraron a los sistemas del exchange. Les bastó con engañar a las personas que firmaban.

## Qué pasó

Bybit hacía una transferencia rutinaria desde su billetera fría multifirma de Ethereum (una billetera sin conexión, pensada para guardar fondos con seguridad) hacia su billetera caliente. Lo que los firmantes realmente aprobaron fue un cambio en la lógica del contrato que entregó el control a los atacantes. Se llevaron más de 400.000 ETH y stETH.

El **FBI** atribuyó el ataque a Corea del Norte (actividad conocida como *TraderTraitor*, vinculada al grupo **Lazarus**).

## Cómo lo hicieron

El eslabón débil fue un proveedor: **Safe{Wallet}**, la plataforma de multifirma que usaba Bybit.

1. Los atacantes comprometieron la computadora de un desarrollador de Safe{Wallet}.
2. Con ese acceso modificaron el JavaScript que se servía desde un *bucket* de AWS S3 del proveedor (un almacén de archivos en la nube), dos días antes del robo.
3. El código malicioso solo se activaba con las billeteras de Bybit: mostraba una transacción legítima mientras enviaba otra.
4. Dos minutos después del robo, borraron el código para cubrir sus huellas.

> Esto se conoce como **firma a ciegas**: apruebas lo que la pantalla te muestra, no lo que realmente se ejecuta. Si la interfaz está comprometida, tu firma también.

Para mí, lo más inquietante es que Bybit hizo lo que se supone que hay que hacer: billetera fría, varias firmas, revisión humana. Todo eso funcionó como debía. Falló lo que estaba debajo, una página web de un tercero en la que nadie pensaba como parte de la seguridad.

::: leccion
- Verifica cada operación de alto valor por un canal independiente: una *hardware wallet* que muestre los datos reales, no solo la web.
- Desconfía de la firma a ciegas: simula la transacción y compara los parámetros fuera de la interfaz del proveedor.
- Si sirves código de interfaz desde la nube, protege esas cuentas con MFA resistente a phishing, usa SRI (*Subresource Integrity*, que verifica que el archivo no cambió) y activa alertas ante cualquier modificación.
- Tus proveedores forman parte de tu superficie de ataque. Evalúalos como evalúas tu propia red.
:::

::: fuentes Fuentes
- [BleepingComputer: Lazarus hacked Bybit via breached Safe{Wallet} developer machine](https://www.bleepingcomputer.com/news/security/lazarus-hacked-bybit-via-a-breached-safe-wallet-developer-machine/)
- [TechTarget: FBI says Lazarus Group behind $1.5 billion Bybit heist](https://www.techtarget.com/cybersecurity/news/366619872/FBI-Lazarus-Group-behind-15-billion-Bybit-heist)
:::

---

Una pregunta para quien maneje fondos importantes: si la pantalla en la que firmas mintiera, ¿tendrías alguna otra forma de enterarte antes de aprobar?
