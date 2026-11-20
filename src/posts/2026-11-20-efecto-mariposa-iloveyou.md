---
title: "ILOVEYOU: la carta de amor que obligó a escribir leyes"
description: En mayo de 2000 un correo con asunto ILOVEYOU infectó a decenas de millones de PC. Su autor no pudo ser condenado, y eso cambió leyes y el correo.
gancho: "Abriste una carta de amor. Era un programa que se reenviaba a todos tus contactos."
gancho_texto: "Una tesis rechazada en Manila terminó en el gusano más famoso de la historia y en una ley que no existía."
tags: [historia, phishing]
---

El 4 de mayo de 2000 llegó un correo con un asunto que nadie quería ignorar: ILOVEYOU. Adentro, una línea pidiendo revisar la carta de amor adjunta, y un archivo: `LOVE-LETTER-FOR-YOU.TXT.vbs`.

Windows ocultaba por defecto las extensiones de los tipos de archivo conocidos, así que mucha gente solo vio `LOVE-LETTER-FOR-YOU.TXT`. Un inocente archivo de texto. Lo abrieron.

## Qué pasaba al abrirlo

El archivo era un script de Visual Basic. Al ejecutarse:

1. Se copiaba en el sistema para arrancar con cada reinicio.
2. Se enviaba a **todos los contactos** de la libreta de direcciones, con el mismo asunto.
3. Sobrescribía archivos del disco (imágenes, scripts y otros) con copias de sí mismo, y ocultaba los archivos de música.
4. Intentaba descargar un troyano para robar contraseñas.

Como el correo venía de alguien conocido, la gente confiaba. Y como cada víctima lo reenviaba a toda su libreta, el crecimiento fue explosivo. El gusano avanzó con el día laboral: Hong Kong, luego Europa, luego Estados Unidos.

## El tamaño del golpe

Se habla de **decenas de millones** de computadoras con Windows infectadas en unos diez días, y se estima que afectó a cerca del 10 % de las computadoras conectadas a internet. Los daños suelen calcularse en unos 10.000 millones de dólares, aunque es una cifra difícil de medir y no hay un conteo preciso.

Entre los afectados estuvieron la Cámara de los Comunes británica, que apagó sus servidores de correo durante dos horas, y varias agencias de Estados Unidos, entre ellas el Departamento de Defensa. La NASA perdió archivos que no pudo recuperar de sus respaldos.

## Una tesis rechazada

El rastro llevó a Manila, a Onel de Guzman, un exestudiante de AMA Computer College. Según lo que se supo después, había propuesto como tesis un programa para robar contraseñas de acceso a internet; la universidad la rechazó por ilegal. De Guzman tenía problemas para pagar su conexión por línea telefónica y creía que el acceso a internet debía ser un derecho.

En 2019, el periodista Geoff White lo encontró en un puesto de reparación de celulares en Manila, y De Guzman reconoció su autoría. Dijo que al principio el programa estaba pensado para funcionar solo en Manila y que luego quitó esa restricción.

> Lo que más me llama la atención es la cadena: una tesis rechazada, un problema económico personal y una opción de Windows que escondía extensiones. Ninguna de esas piezas, sola, explicaba lo que pasó. Juntas, paralizaron correos en todo el mundo.

## Sin ley, sin condena

Cuando la policía filipina llegó, había un problema: **Filipinas no tenía una ley contra el hackeo**. Los fiscales intentaron acusarlo con leyes sobre fraude con dispositivos de acceso y daños, pero retiraron los cargos porque no encajaban con los hechos.

## La tormenta: lo que cambió

<table>
<thead><tr><th>Aleteo de 2000</th><th>Lo que tenemos hoy</th></tr></thead>
<tbody>
<tr><td>No había delito aplicable en Filipinas</td><td>En junio de 2000, Filipinas aprobó la Ley de Comercio Electrónico (Ley 8792), que incluyó el hackeo y la propagación de virus. No pudo aplicarse retroactivamente. El caso empujó a muchos países a tipificar los delitos informáticos</td></tr>
<tr><td>Outlook dejaba a cualquier script leer la libreta y enviar correos</td><td>El 15 de mayo de 2000, Microsoft anunció la Outlook E-mail Security Update: bloqueo de adjuntos <code>.vbs</code>, <code>.js</code> y otros ejecutables, y avisos cuando un programa intenta usar la libreta de direcciones</td></tr>
<tr><td>La gente confiaba en un correo porque venía de un conocido</td><td>La regla de oro del phishing actual: el remitente conocido no garantiza nada, porque su cuenta o su computadora pueden estar comprometidas</td></tr>
<tr><td>Extensiones ocultas por defecto</td><td>La extensión doble (<code>.pdf.exe</code>, <code>.txt.vbs</code>) sigue siendo un truco de los atacantes, y una razón para mostrar siempre las extensiones</td></tr>
</tbody>
</table>

Cuando hoy tu correo bloquea un adjunto ejecutable o te advierte de un archivo sospechoso, estás viendo una consecuencia directa de aquella carta de amor.

En Costa Rica, por cierto, el Código Penal tipifica desde la reforma de la Ley 9048 de 2012 delitos como la propagación de programas dañinos y el sabotaje informático.

::: leccion
- Activa la opción de mostrar siempre las extensiones de archivo en Windows. Un `.txt.vbs` o un `.pdf.exe` se delatan solos.
- Desconfía de un adjunto inesperado aunque venga de alguien conocido: confirma por otro canal antes de abrirlo.
- No ejecutes scripts (`.vbs`, `.js`, `.bat`, `.ps1`) que lleguen por correo o mensajería.
- Mantén respaldos fuera de la computadora: ILOVEYOU sobrescribía archivos, y quien no tenía copias las perdió.
:::

::: fuentes Fuentes
- [Wikipedia: ILOVEYOU](https://en.wikipedia.org/wiki/ILOVEYOU)
- [Microsoft: Outlook security solution to help protect customers against computer viruses (15 de mayo de 2000)](https://news.microsoft.com/source/2000/05/15/microsoft-to-deliver-major-outlook-security-solution-to-help-protect-customers-against-computer-viruses/)
- [BetaNews: Microsoft issues patch for Outlook in wake of Love Bug](https://betanews.com/article/microsoft-issues-patch-for-outlook-in-wake-of-love-bug/)
- [The Register: ILOVEYOU, 20 years later](https://www.theregister.com/2020/05/05/iloveyou_20_years/)
:::

---

**Serie Efecto mariposa:** [Brain (1986)](/efecto-mariposa-brain-1986/) · [El gusano Morris (1988)](/efecto-mariposa-gusano-morris/) · ILOVEYOU (2000) · [Blaster y el Patch Tuesday (2001-2003)](/efecto-mariposa-blaster-patch-tuesday/) · [Stuxnet (2010)](/efecto-mariposa-stuxnet/)
