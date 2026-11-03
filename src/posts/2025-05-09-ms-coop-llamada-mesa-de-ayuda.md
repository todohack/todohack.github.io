---
title: "M&S y Co-op: les bastó una llamada a la mesa de ayuda"
description: Dos gigantes del comercio británico cayeron por el mismo punto débil, un soporte técnico que restablecía contraseñas por teléfono.
tags: [ingenieria-social, ransomware, identidad]
---

Si vienes del soporte técnico, como yo, este caso te va a doler. En abril de 2025, dos de las cadenas comerciales más grandes de Reino Unido, **Marks & Spencer** y **Co-op**, sufrieron ciberataques que arrancaron de la forma más simple: una llamada telefónica.

## Qué pasó

M&S comunicó un incidente el 22 de abril de 2025 y, días después, detuvo los pedidos en su web y su app. La recuperación tardó semanas. Analistas de Deutsche Bank estimaron un golpe inicial de unos 30 millones de libras en beneficios.

Poco después, Co-op confirmó su propio ataque. El grupo de ransomware DragonForce dijo a la BBC que había robado datos de empleados y potencialmente de millones de clientes.

Según BleepingComputer, el ataque a M&S se atribuyó al grupo Scattered Spider, que usó el ransomware de DragonForce.

## Cómo lo hicieron

Según Reuters, los atacantes llamaron a la mesa de ayuda de TI, se hicieron pasar por empleados y convencieron al personal de restablecer contraseñas. Con esas credenciales válidas entraron, se movieron por la red y desplegaron el ransomware, que cifra los archivos para exigir un pago.

> El firewall más caro del mundo no sirve si el soporte entrega la llave por teléfono. La ingeniería social ataca procesos, no máquinas.

Lo que más me pesa de este caso es que quien contestó el teléfono probablemente quería ayudar. Esa es la parte cruel: a una mesa de ayuda se le exige rapidez y amabilidad, y justo eso es lo que el atacante explota. Si el proceso no le da al agente una forma clara de decir "no puedo verificarte", la culpa no es de la persona.

::: leccion
- Verifica la identidad fuera de banda antes de restablecer contraseñas o MFA: devolución de llamada a un número registrado, videollamada o aprobación del jefe directo.
- Las cuentas privilegiadas nunca se restablecen por teléfono sin doble aprobación.
- Entrena a tu mesa de ayuda con guiones de ataques reales; es la primera línea de defensa.
- Usa MFA resistente a phishing (FIDO2, *passkeys*) para que una contraseña robada no sea suficiente.
- Ten copias de seguridad aisladas y un plan de continuidad probado.
:::

::: fuentes Fuentes
- [Business Insurance: M&S, Co-op attackers duped IT help desks into resetting passwords](https://www.businessinsurance.com/ms-co-op-cyberattackers-duped-it-help-desks-into-resetting-passwords-report/)
:::

---

Si trabajas en soporte, hazle una pregunta a tu equipo esta semana: ¿qué hacemos exactamente cuando alguien llama diciendo que perdió su acceso y tiene mucha prisa?
