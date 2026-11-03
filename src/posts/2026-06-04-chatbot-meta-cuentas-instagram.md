---
title: "Le pidieron al chatbot de Meta que les diera la cuenta"
description: Atacantes secuestraron cuentas de Instagram pidiéndole al asistente de IA que cambiara el correo de recuperación. Y lo hizo.
tags: [ia, identidad, ingenieria-social]
---

¿Qué hace falta para quedarte con una cuenta de Instagram de alto perfil? En junio de 2026 la respuesta fue casi absurda: pedírsela al chatbot de soporte. Hace un año hablábamos de engañar a la [mesa de ayuda por teléfono](/ms-coop-llamada-mesa-de-ayuda/). Ahora el soporte es un agente de inteligencia artificial, y también se le puede engañar, a veces con menos esfuerzo.

## Qué pasó

El 1 de junio de 2026, el medio 404 Media informó de que atacantes estaban tomando el control de cuentas de Instagram de alto perfil simplemente pidiéndole al chatbot de soporte de Meta que enviara los códigos de restablecimiento a correos que ellos controlaban. En grupos de Telegram circulaba un video con el paso a paso.

Entre las víctimas hubo cuentas institucionales y de marcas conocidas. Por ahora no hay una cifra oficial de cuentas afectadas ni una explicación detallada de Meta.

## Dónde estuvo el error

Meta había dado a su asistente la capacidad de ayudar a recuperar cuentas. El problema es que el agente aceptaba lo que el usuario afirmaba sobre ser el dueño, sin una verificación fuerte, y ejecutaba una acción sensible: cambiar el correo de recuperación.

Para mí el error de diseño es clarísimo. Es ingeniería social de toda la vida, pero contra una máquina. Un agente de IA con permisos para cambiar cuentas es un empleado de soporte que nunca se cansa y nunca sospecha, a menos que lo diseñes para hacerlo.

Y la frase "el agente decide si eres el dueño" debería sonar una alarma en cualquier equipo que esté desplegando asistentes de este tipo.

::: leccion
- Un agente de IA con poder para restablecer cuentas necesita las mismas verificaciones que un humano, o más.
- Separa la verificación de la ejecución: el agente no debe decidir solo si alguien es el dueño.
- Las acciones sensibles, como cambiar el correo o el teléfono de recuperación, requieren confirmación fuera del chat y un periodo de espera.
- Avisa al titular de inmediato ante cualquier cambio en los datos de recuperación.
- En tus cuentas personales, activa passkeys o MFA y revisa hoy tus correos de recuperación.
:::

::: fuentes Fuentes
- [404 Media: Hackers simply asked Meta AI to give them access to high-profile Instagram accounts](https://www.404media.co/hackers-simply-asked-meta-ai-to-give-them-access-to-high-profile-instagram-accounts-it-worked/)
:::

---

Si tu empresa está desplegando agentes de IA, pregunta qué acciones pueden ejecutar sin que un humano las confirme. Esa lista dice mucho.
