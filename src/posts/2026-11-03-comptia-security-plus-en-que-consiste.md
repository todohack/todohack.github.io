---
title: "CompTIA Security+: en qué consiste y qué cubre"
description: Qué es la certificación Security+ (SY0-701), cómo se reparte el examen en sus cinco dominios y qué conocimiento de seguridad resume, explicado sin rodeos.
tags: [certificaciones]
---

Abre cualquier oferta de empleo de ciberseguridad para principiantes y haz la prueba: tarde o temprano aparece "Security+". Esta certificación no la tengo, la estoy estudiando. Aun así, creo que vale la pena resumir en qué consiste y, sobre todo, qué conocimiento organiza. Si estás empezando, su temario es un mapa muy útil de lo que un analista de seguridad debería dominar.

## ¿Qué es Security+?

Es una certificación de nivel inicial-intermedio, neutral respecto a fabricantes (no es de Cisco, ni de Microsoft, ni de AWS), centrada en los fundamentos de la seguridad. Está pensada para el primer puesto serio en seguridad: analista de SOC, administrador de seguridad, soporte con responsabilidades de seguridad. Es de las pocas que aparece como requisito en puestos de gobierno y empresas grandes.

La versión vigente es la **SY0-701** (de 2023). CompTIA ya anunció la V8 para finales de 2026, y la SY0-701 se retira en junio de 2027, así que si vas a certificarte, confirma antes cuál es la versión activa.

## Cómo es el examen

- Hasta 90 preguntas, de opción múltiple y basadas en rendimiento (*PBQ*: pequeños escenarios donde resuelves algo en un entorno simulado, no solo eliges una letra).
- 90 minutos.
- Se aprueba con 750 sobre 900.
- Validez de 3 años, renovable acumulando créditos de formación continua (CE).

> Las preguntas basadas en rendimiento son las que más pesan y las que más gente falla. No basta con memorizar: hay que saber aplicar.

## Los cinco dominios

Todo el temario se reparte en cinco bloques. Mira los pesos, porque te dicen dónde estudiar más:

<div class="table-wrap">
<table>
<thead><tr><th>Dominio</th><th>Peso</th></tr></thead>
<tbody>
<tr><td>4.0 Operaciones de seguridad</td><td>28 %</td></tr>
<tr><td>2.0 Amenazas, vulnerabilidades y mitigaciones</td><td>22 %</td></tr>
<tr><td>5.0 Gestión y supervisión del programa de seguridad</td><td>20 %</td></tr>
<tr><td>3.0 Arquitectura de seguridad</td><td>18 %</td></tr>
<tr><td>1.0 Conceptos generales de seguridad</td><td>12 %</td></tr>
</tbody>
</table>
</div>

Más de la mitad del examen (operaciones y amenazas) es trabajo del día a día de un analista. Vamos uno por uno.

### 1.0 Conceptos generales (12 %)

Los cimientos. La tríada CIA (confidencialidad, integridad, disponibilidad), los tipos de controles (preventivos, de detección, correctivos; técnicos, administrativos, físicos), Zero Trust, criptografía básica (cifrado simétrico y asimétrico, *hashing*, PKI, certificados) y la importancia de gestionar bien los cambios.

### 2.0 Amenazas, vulnerabilidades y mitigaciones (22 %)

El catálogo de lo que puede salir mal: actores de amenaza (desde *script kiddies* hasta estados), vectores de ataque, tipos de malware, ingeniería social (phishing y familia), vulnerabilidades de aplicaciones, web, nube y cadena de suministro, y cómo mitigarlas. Si lees los [casos de este blog](/toolshell-sharepoint/), aquí es donde encajan todos.

### 3.0 Arquitectura de seguridad (18 %)

Cómo se diseña una infraestructura segura: modelos *on-premise*, nube e híbridos, segmentación de redes, Zero Trust aplicado, resiliencia (copias de seguridad, redundancia, recuperación) y protección de datos (clasificación, cifrado en reposo y en tránsito).

### 4.0 Operaciones de seguridad (28 %)

El dominio más grande, y con razón: es lo que hace un SOC a diario. Hardening de sistemas, gestión de identidades y accesos (IAM, MFA, privilegio mínimo), monitoreo y herramientas (SIEM), gestión de vulnerabilidades, respuesta a incidentes y análisis forense básico.

### 5.0 Gestión y supervisión (20 %)

La parte de gobernanza: gestión de riesgos, cumplimiento normativo, auditorías, riesgo de terceros y concienciación del personal. Aquí Security+ se da la mano con [ISO 27001](/iso-27001-auditor-interno/) y con las leyes de [protección de datos](/ley-8968-proteccion-datos-costa-rica/).

## Dónde hacer exámenes simulados

Practicar con preguntas de prueba es lo que más mueve la aguja, sobre todo para las PBQ. Algunos sitios para hacerlo:

- [CertMaster Practice (CompTIA)](https://www.comptia.org/en-us/certifications/security/v7/practice-questions/ "Security+ Practice Questions"): el simulador oficial, de pago, con preguntas adaptativas que insisten en lo que fallas.
- [Professor Messer](https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/ "Curso y prácticas SY0-701"): un curso gratuito completo en video con preguntas de práctica; el recurso favorito de la comunidad.
- [ExamCompass](https://www.examcompass.com/comptia/security-plus-certification/free-security-plus-practice-tests "Free Security+ Practice Tests"): baterías de preguntas gratis por dominio, buenas para repasar.

> Haz los simulados con tiempo (90 minutos) para acostumbrarte al ritmo: son 90 preguntas y se pasan rápido.

## Por qué vale la pena aunque no te certifiques

- Es un índice de todo. Aunque no te presentes al examen, el temario te dice qué conceptos deberías conocer para trabajar en seguridad.
- Habla el idioma de la industria. Términos como Zero Trust, SIEM, CIA o PBQ aparecen en toda oferta de empleo, y Security+ te los ordena.
- Combina teoría técnica y de gestión. No es solo "hackear": también cubre riesgo, cumplimiento y operación, que es lo que piden los puestos reales.

## Cómo estudiarla

1. Descarga los objetivos oficiales del examen: son gratis y son la lista exacta de lo que entra.
2. Estudia por dominio, dedicando más tiempo a los de mayor peso (4.0 y 2.0).
3. Practica las PBQ con simuladores (arriba tienes dónde): son las que marcan la diferencia.
4. Apóyate en lo práctico de este blog: el [laboratorio](/Kali-Linux-para-Hackers/), [Nmap](/nmap-desde-cero/) y [Wireshark](/wireshark-tu-primera-captura/) le dan sentido a la teoría.

::: leccion
- Security+ (SY0-701) es la certificación de fundamentos de seguridad más pedida en ofertas de empleo.
- El examen: hasta 90 preguntas (incluidas simulaciones), 90 minutos, se aprueba con 750/900.
- Cinco dominios; operaciones (28 %) y amenazas (22 %) son casi la mitad.
- Aunque no te certifiques, su temario es un mapa excelente de lo que hay que saber.
:::

::: fuentes Fuentes
- [CompTIA Security+ (página oficial)](https://www.comptia.org/en-us/certifications/security/v7/)
- [Objetivos del examen SY0-701 y guía de estudio](https://www.comptia.org/en-us/blog/what-is-on-the-comptia-security-exam/)
- Material de estudio del curso CompTIA Security+ SY0-701 (guía oficial y plan de 90 días).
:::

---

Si estás pensando en Security+, empieza hoy por una cosa: baja los objetivos oficiales y marca con una cruz el dominio en el que te sientes más flojo.
