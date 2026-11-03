---
title: "Asegura tu cuenta de Azure: MFA, acceso condicional y mínimo privilegio"
description: Cinco ajustes que cierran las puertas más usadas por los atacantes en Microsoft Azure, en el orden en que conviene aplicarlos.
tags: [azure, identidad, cloud]
---

## Por dónde entran de verdad

En casi todos los incidentes en la nube que hemos analizado aquí, el atacante no rompió ningún cifrado: entró con una cuenta válida. Por eso, en Microsoft Azure, la seguridad empieza por la identidad.

Esta guía reúne cinco ajustes de **Microsoft Entra ID** y **Azure** que cierran las puertas más usadas, en el orden en que conviene aplicarlos.

> Antes de cambiar nada, asegúrate de tener otra forma de entrar a tu cuenta. Bloquearte a ti mismo es el error más común en esta configuración.

## 1. Crea cuentas de emergencia

Antes de endurecer el acceso, crea dos cuentas de acceso de emergencia (*break-glass*):

- Con rol de Administrador global.
- Con contraseñas largas, guardadas fuera de línea y en lugares distintos.
- Excluidas de las políticas de acceso condicional que vas a crear.

Si una política mal configurada bloquea a todos los administradores, estas cuentas te dejan volver a entrar.

## 2. Activa MFA para todos

La autenticación multifactor (MFA) frena la gran mayoría de ataques con contraseñas robadas. Microsoft empezó en 2024 a exigir MFA para iniciar sesión en el portal de Azure, pero no te quedes ahí: actívala para todas las cuentas.

- Si no tienes licencias *Premium*, activa los valores predeterminados de seguridad (*Security defaults*) en *Entra ID > Información general > Propiedades*. Son gratuitos y exigen MFA a todos.
- Si tienes Entra ID P1 o superior, usa acceso condicional (siguiente paso), que te da más control.
- Prefiere la app Microsoft Authenticator o las passkeys antes que los SMS.

## 3. Crea tus primeras políticas de acceso condicional

El acceso condicional es un conjunto de reglas del tipo "si pasa esto, exige aquello". Con Entra ID P1, ve a *Entra ID > Protección > Acceso condicional* y empieza con estas tres:

1. Exigir MFA a todos los usuarios, excluyendo las cuentas de emergencia.
2. Bloquear la autenticación heredada (protocolos antiguos como POP o IMAP), que no admiten MFA.
3. Exigir MFA reforzada a los roles de administrador.

> Crea cada política primero en modo **Solo informe** (*Report-only*). Revisa unos días qué habría bloqueado y luego actívala. Así evitas sorpresas.

## 4. Aplica mínimo privilegio con RBAC

El control de acceso basado en roles (RBAC) de Azure decide quién puede hacer qué. Las reglas básicas:

- Evita el rol Propietario (*Owner*) salvo para quien realmente lo necesita.
- Asigna roles al ámbito más pequeño posible: mejor un *grupo de recursos* que toda la *suscripción*.
- Usa roles específicos como Lector (*Reader*) o Colaborador (*Contributor*) en lugar de los más amplios.
- Si tienes Entra ID P2, usa PIM (*Privileged Identity Management*) para que los permisos de administrador sean temporales y se activen solo cuando se necesitan.

Para revisar quién tiene permisos en tu suscripción desde **Azure CLI**:

```bash
az role assignment list --all --query "[].{usuario:principalName, rol:roleDefinitionName, ambito:scope}" --output table
```

## 5. Vigila con Defender for Cloud

Microsoft Defender for Cloud incluye de forma gratuita una evaluación de tu postura de seguridad, con una puntuación segura (*Secure Score*) y recomendaciones concretas.

- Revísala una vez por semana y prioriza las recomendaciones de identidad y de exposición a internet.
- Configura alertas de presupuesto en *Cost Management*. Un gasto repentino es, muchas veces, la primera señal de que alguien usa tu cuenta para minar criptomonedas.

::: leccion
- Crea dos cuentas de emergencia antes de endurecer el acceso, y exclúyelas de las políticas.
- MFA para todos: con *Security defaults* gratis, o con acceso condicional si tienes P1.
- Prueba en modo Solo informe antes de activar cualquier política de acceso condicional.
- Mínimo privilegio: nada de *Owner* por defecto y roles en el ámbito más pequeño posible.
- Revisa la puntuación segura y las alertas de gasto: también son detección.
:::

---

Empieza por lo más simple: entra hoy a tu tenant y cuenta cuántas cuentas siguen sin MFA. Ese número te dice por dónde seguir.
