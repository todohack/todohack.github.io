---
title: "ISO 27001:2022 explicada por un auditor interno"
description: Qué exige la norma de seguridad de la información, cómo se ordenan sus 93 controles y cómo es la certificación de auditor interno de CertiProf.
tags: [certificaciones]
---

Un firewall de última generación no sirve de nada si nadie sabe qué hay que proteger, ni quién responde cuando algo falla. De esa pregunta trata la ISO 27001, y por eso me interesó tanto. Hasta ahora este blog ha sido muy técnico: escanear, capturar tráfico, analizar ataques. Hoy toca el lado de la gestión. Soy **auditor interno certificado en ISO/IEC 27001:2022** por CertiProf, y aquí resumo lo que aprendí en el curso y preparando el examen.

## ¿Qué es la ISO 27001?

Es la norma internacional que explica cómo montar un SGSI (Sistema de Gestión de Seguridad de la Información). No te dice qué firewall comprar. Te pide conocer tus riesgos, decidir qué haces con cada uno y demostrar que lo cumples. Sirve para cualquier organización, pública o privada, grande o pequeña, y es la norma de la familia ISO 27000 con la que una organización se certifica.

Todo gira alrededor de tres propiedades de la información:

- Confidencialidad: solo la ve quien debe.
- Integridad: nadie la altera sin autorización.
- Disponibilidad: está ahí cuando se necesita.

## Cómo está organizada

La norma sigue la estructura común de los sistemas de gestión ISO (la misma de la ISO 9001), así que si conoces una, la otra te resultará familiar. Las cláusulas 4 a 10 son los requisitos obligatorios y siguen el ciclo PHVA (Planificar, Hacer, Verificar, Actuar):

<div class="table-wrap">
<table>
<thead><tr><th>Cláusula</th><th>De qué trata</th><th>PHVA</th></tr></thead>
<tbody>
<tr><td>4. Contexto</td><td>Entender la organización, sus partes interesadas y fijar el alcance del SGSI</td><td>Planificar</td></tr>
<tr><td>5. Liderazgo</td><td>Compromiso de la dirección, política de seguridad, roles y responsabilidades</td><td>Planificar</td></tr>
<tr><td>6. Planificación</td><td>Evaluar y tratar riesgos, fijar objetivos medibles</td><td>Planificar</td></tr>
<tr><td>7. Soporte</td><td>Recursos, competencia, concienciación, comunicación y documentación</td><td>Hacer</td></tr>
<tr><td>8. Operación</td><td>Ejecutar lo planificado: evaluaciones y tratamiento de riesgos</td><td>Hacer</td></tr>
<tr><td>9. Evaluación del desempeño</td><td>Medir, auditar y revisión por la dirección</td><td>Verificar</td></tr>
<tr><td>10. Mejora</td><td>No conformidades, acciones correctivas y mejora continua</td><td>Actuar</td></tr>
</tbody>
</table>
</div>

## El corazón: la gestión de riesgos

La norma no impone controles a ciegas. Cada control tiene que responder a un riesgo. El proceso, en resumen:

1. Inventariar los activos de información: datos, sistemas, personas, instalaciones, proveedores.
2. Identificar las amenazas (qué puede pasar) y las vulnerabilidades (por dónde puede pasar).
3. Valorar cada riesgo con probabilidad × impacto y compararlo con el nivel que la dirección acepta.
4. Elegir el tratamiento: mitigarlo con controles, evitarlo, transferirlo (un seguro, un proveedor) o aceptarlo de forma explícita.
5. Documentar el plan de tratamiento y lograr que los dueños de los riesgos aprueben el riesgo que queda (el riesgo residual).

El resultado se plasma en la **Declaración de Aplicabilidad** (*SoA*): la lista de los 93 controles del Anexo A, con cuáles aplicas, por qué, cuáles excluyes y con qué justificación. Es el documento que todo auditor pide primero.

## Anexo A: 93 controles en 4 temas

La versión 2022 reordenó los antiguos 114 controles de 14 dominios en 93 controles agrupados en 4 temas:

<div class="table-wrap">
<table>
<thead><tr><th>Tema</th><th>Controles</th><th>Ejemplos</th></tr></thead>
<tbody>
<tr><td>5. Organizacionales</td><td>37</td><td>Políticas, clasificación de la información, proveedores, gestión de incidentes</td></tr>
<tr><td>6. Personas</td><td>8</td><td>Verificación de antecedentes, concienciación, trabajo remoto</td></tr>
<tr><td>7. Físicos</td><td>14</td><td>Perímetro, escritorio y pantalla limpios, eliminación segura de equipos</td></tr>
<tr><td>8. Tecnológicos</td><td>34</td><td>Accesos privilegiados, malware, copias de seguridad, cifrado, desarrollo seguro</td></tr>
</tbody>
</table>
</div>

Hay 11 controles nuevos, y casi todos reflejan cómo ha cambiado el panorama:

- 5.7 Inteligencia de amenazas.
- 5.23 Seguridad en el uso de servicios en la nube.
- 5.30 Preparación de las TIC para la continuidad del negocio.
- 7.4 Monitoreo de la seguridad física.
- 8.9 Gestión de la configuración.
- 8.10 Eliminación de información.
- 8.11 Enmascaramiento de datos.
- 8.12 Prevención de fuga de datos (DLP).
- 8.16 Actividades de monitoreo.
- 8.23 Filtrado web.
- 8.28 Codificación segura.

### Qué cambió respecto a 2013

- El título suma ciberseguridad y protección de la privacidad.
- De los 114 controles antiguos salen los 93 actuales: 58 actualizados, 24 fusionados y 11 nuevos.
- Aparece la cláusula 6.3 (planificar los cambios del SGSI) y se piden objetivos monitoreados y documentados.
- La transición terminó el 31 de octubre de 2025: hoy cualquier certificado vigente debe ser de la versión 2022.

> Si has leído los casos de este blog, varios encajan aquí: [Trivy](/trivy-escaner-envenenado/) y [npm](/npm-chalk-shai-hulud/) son problemas de cadena de suministro (5.19 a 5.22), [DeepSeek](/deepseek-base-de-datos-expuesta/) es gestión de la configuración (8.9) y [Salesloft Drift](/salesloft-drift-tokens-oauth/) es nube y proveedores (5.23). La norma no evita los ataques, pero obliga a haberse hecho las preguntas correctas.

## Documentación obligatoria

Esto es lo mínimo que un auditor esperará encontrar por escrito:

- Alcance del SGSI (4.3) y política de seguridad (5.2).
- Proceso de evaluación y de tratamiento de riesgos (6.1.2 y 6.1.3), con sus resultados (8.2 y 8.3).
- Declaración de Aplicabilidad (6.1.3 d).
- Objetivos de seguridad (6.2) y evidencia de competencia del personal (7.2).
- Evidencia de seguimiento y medición (9.1), del programa de auditoría y sus resultados (9.2) y de la revisión por la dirección (9.3).
- Registro de las no conformidades y de las acciones tomadas (10.2).

Los documentos de los controles del Anexo A solo son obligatorios si aplicas ese control.

## Cómo se audita

Las auditorías siguen la guía ISO 19011. Hay tres tipos:

- Primera parte: la organización se audita a sí misma (auditoría interna, cláusula 9.2). Es lo que hace un auditor interno, siempre fuera de su propia área para ser imparcial.
- Segunda parte: un cliente audita a su proveedor.
- Tercera parte: un organismo de certificación independiente audita para emitir el certificado.

La ISO 19011 fija siete principios para el auditor: integridad, presentación imparcial, debido cuidado profesional, confidencialidad, independencia, enfoque basado en la evidencia y enfoque basado en el riesgo.

En la certificación, el ciclo dura 3 años. Empieza con una auditoría inicial en dos etapas (primero la documentación, después que el sistema funcione de verdad), sigue con auditorías de seguimiento anuales y termina con una recertificación.

Lo que encuentra el auditor se clasifica así:

- No conformidad: se incumple un requisito. En las auditorías de certificación se distingue entre mayor (falla el sistema o falta un requisito entero; bloquea el certificado) y menor (un incumplimiento puntual).
- Observación: todavía no incumple, pero acabará en no conformidad si no se atiende.
- Oportunidad de mejora: no incumple nada, pero podría hacerse mejor.

Una buena no conformidad tiene tres partes: la evidencia objetiva, el requisito incumplido (uno solo, el más aplicable) y una conclusión breve que el auditado pueda aceptar. Sin evidencia no hay hallazgo, porque el auditor no opina, verifica. Y todas se documentan, sean una o veinte.

## La certificación de auditor interno de CertiProf

La ISO/IEC 27001:2022 Internal Auditor (código I27001IA) acredita que conoces la norma y sabes auditar un SGSI.

- 40 preguntas de opción múltiple.
- 60 minutos, en línea y sin libro abierto.
- Se aprueba con el 80 % (32 respuestas correctas).
- No tiene requisitos previos ni exige experiencia como auditor.
- Validez de 3 años, con insignia digital verificable.

*Datos según el temario oficial (versión 11/2022) y la página de CertiProf en noviembre de 2026.*

## Cómo prepararla

1. Lee la norma, no solo resúmenes. Es corta: las cláusulas obligatorias caben en unas pocas páginas. Mejor la traducción oficial de tu país.
2. Memoriza la estructura: qué pide cada cláusula de la 4 a la 10 y los cuatro temas del Anexo A. Muchas preguntas consisten en ubicar un requisito.
3. Practica la evaluación de riesgos con una plantilla: inventario de activos, matriz probabilidad × impacto y una SoA de ejemplo.
4. Redacta no conformidades sobre casos inventados hasta que te salgan solas: requisito, evidencia y hallazgo.
5. Haz los exámenes de muestra con tiempo. 90 segundos por pregunta pasan rápido.

## Dónde obtenerla

- [Página oficial de CertiProf](https://certiprof.com/pages/certified-iso-iec-27001-auditor "ISO/IEC 27001 Internal Auditor"): temario, precio e inscripción al examen.
- [La norma ISO/IEC 27001:2022 en ISO](https://www.iso.org/standard/82875.html "ISO/IEC 27001:2022"): la versión oficial, de pago.

::: leccion
- La ISO 27001 trata de gestionar riesgos, no de comprar herramientas: cada control debe responder a un riesgo identificado.
- La Declaración de Aplicabilidad une el análisis de riesgos con los 93 controles del Anexo A.
- La versión 2022 agrupa los controles en 4 temas y añade 11 nuevos, entre ellos nube, DLP, inteligencia de amenazas y codificación segura.
- Auditar es verificar con evidencias: una no conformidad sin evidencia no vale.
:::

::: fuentes Fuentes
- [CertiProf: ISO/IEC 27001 Internal Auditor](https://certiprof.com/pages/certified-iso-iec-27001-auditor)
- [ISO: ISO/IEC 27001:2022](https://www.iso.org/standard/82875.html)
- Material del curso de preparación ISO 27001:2022 Internal Auditor / Lead Auditor (CertiProf, versión 11/2022).
:::

---

Si vienes del lado técnico, prueba un ejercicio: elige un caso de los que hemos visto en el blog y busca qué control del Anexo A habría hecho la pregunta incómoda a tiempo.
