---
title: "¿Es phishing? Aprende a leer las cabeceras de un correo"
description: El remitente que ves se puede falsificar. Las cabeceras no mienten tanto: aprende a revisar SPF, DKIM y DMARC en dos minutos.
tags: [phishing, correo, ingenieria-social]
---

El nombre que aparece como remitente en tu bandeja es lo más fácil de falsificar de todo el correo. Cualquiera puede escribir "Tu Banco" en ese campo. Por eso, en casos como el de [M&S y Co-op](/ms-coop-llamada-mesa-de-ayuda/), el engaño sigue siendo la puerta de entrada favorita.

La buena noticia es que cada correo lleva unas **cabeceras** técnicas que cuentan su recorrido real. Leerlas lleva dos minutos y se aprende rápido.

## 1. Abre las cabeceras completas

- **Gmail**: abre el correo, pulsa los **tres puntos** (⋮) y elige **Mostrar original**.
- **Outlook (web)**: abre el correo, pulsa los **tres puntos** (…) y elige **Ver > Ver origen del mensaje**.

Verás un bloque largo de texto técnico. No hace falta entenderlo todo, solo buscar cuatro cosas.

## 2. Revisa los tres sellos de autenticación

Busca la línea `Authentication-Results`. Ahí aparecen tres comprobaciones que hace tu proveedor de correo:

<div class="table-wrap">
<table>
<thead><tr><th>Sello</th><th>Qué comprueba</th></tr></thead>
<tbody>
<tr><td><strong>SPF</strong></td><td>Que el servidor que envió el correo está autorizado por ese dominio</td></tr>
<tr><td><strong>DKIM</strong></td><td>Que el correo lleva una firma válida del dominio y no se modificó por el camino</td></tr>
<tr><td><strong>DMARC</strong></td><td>Que SPF o DKIM cuadran con el dominio que <em>ves</em> en el remitente</td></tr>
</tbody>
</table>
</div>

Un correo legítimo de una empresa grande suele mostrar algo así:

```text
spf=pass   dkim=pass   dmarc=pass
```

> Si ves `dmarc=fail` en un correo que dice venir de tu banco o de tu empresa, desconfía: el dominio que aparece en el remitente no coincide con quien realmente lo envió.

## 3. Compara los remitentes

Busca estas líneas y compáralas:

- `From`: el remitente que ves en tu bandeja.
- `Return-Path`: a dónde vuelven los rebotes.
- `Reply-To`: a quién le responderás si pulsas *Responder*.

Si el `From` dice `soporte@tubanco.com` pero el `Reply-To` apunta a una dirección de Gmail o a un dominio parecido (como `tubanco-seguridad.com`), es una señal clara de fraude. Lo que aparece arriba y lo que realmente recibe tu respuesta no tienen por qué coincidir.

## 4. Revisa los enlaces sin hacer clic

Pasa el ratón por encima de cada enlace (o mantén pulsado en el móvil) y mira la dirección real que aparece. Cuidado con:

- Dominios casi idénticos, como `micros0ft.com` o `paypa1.com`.
- Subdominios engañosos: `tubanco.com.verificar-cuenta.net` pertenece a `verificar-cuenta.net`, no a tu banco.
- Acortadores de enlaces, que esconden el destino.

## 5. Si es phishing, repórtalo

- Usa el botón **Reportar phishing** de tu correo: ayuda a bloquearlo para otros.
- Si es del trabajo, avisa a tu equipo de seguridad antes de borrarlo.
- No respondas ni descargues adjuntos.

::: leccion
- El nombre del remitente se puede falsificar; las cabeceras cuentan la historia real.
- Busca `Authentication-Results`: un `dmarc=fail` en un correo de una marca conocida es una alarma.
- Compara From, Return-Path y Reply-To: si apuntan a dominios distintos, desconfía.
- Pasa el ratón por los enlaces antes de hacer clic.
- Reporta en lugar de solo borrar: proteges a los demás.
:::

---

La próxima vez que un correo te haga dudar, ábrelo en modo "original" y busca el `dmarc`. Cuéntame qué encontraste.
