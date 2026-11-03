---
title: "Ley 8968: la protección de datos en Costa Rica en una página"
description: Qué datos protege la ley costarricense, qué derechos te da, qué plazos y multas fija la PRODHAB y qué cambia para quien trabaja en seguridad.
tags: [certificaciones, privacidad]
---

Cada vez que das tu cédula, tu teléfono o tu correo para una promoción, alguien guarda esos datos. La pregunta es qué puede hacer con ellos y qué puedes exigirle tú. En el [post de ISO 27001](/iso-27001-auditor-interno/) vimos cómo se gestiona la seguridad de la información. Hoy toca la ley que dice qué se puede hacer con los datos de las personas. Hice el curso de Ley de Protección de Datos Personales de la Academia Hacker Mentor (40 horas), junto con los talleres de delegado de protección de datos, gestión de incidentes, borrado seguro y teletrabajo. Este es el resumen, aterrizado a Costa Rica.

## ¿Qué ley aplica?

La **Ley 8968 de Protección de la Persona frente al Tratamiento de sus Datos Personales**, aprobada en julio de 2011 y vigente desde el 5 de setiembre de 2011. La desarrolla su reglamento (Decreto Ejecutivo 37554-JP, vigente desde marzo de 2013 y reformado en 2016).

Parte de un derecho que la Sala Constitucional ya venía reconociendo a partir del artículo 24 de la Constitución: la autodeterminación informativa, es decir, tu derecho a controlar qué se hace con la información sobre ti. La ley lo reconoce como derecho fundamental (art. 4).

- Aplica a bases de datos automatizadas o manuales, públicas o privadas (art. 2).
- No aplica a las bases de uso exclusivamente interno, personal o doméstico, siempre que no se vendan ni se comercialicen.
- Protege a cualquier persona, sin importar su nacionalidad o residencia (art. 1).

> Hay un proyecto para sustituirla por una ley al estilo del RGPD europeo (expediente 23.097, presentado en 2022), pero a noviembre de 2026 no ha sido aprobado. La norma vigente sigue siendo la 8968.

## El principio central: consentimiento informado

Antes de recoger datos personales hay que informar a la persona, de forma expresa, precisa e inequívoca (art. 5):

- Que existe una base de datos y quién es el responsable.
- Para qué se recogen los datos y quién los va a recibir o consultar.
- Si responder es obligatorio o voluntario, y qué pasa si se niega.
- Qué derechos tiene y cómo ejercerlos.

Después hay que obtener su consentimiento expreso, por escrito o por medios electrónicos. Puede revocarlo cuando quiera, sin efecto retroactivo. Solo se exceptúan los casos de orden judicial, los datos de acceso irrestricto que provienen de fuentes públicas y los que una ley obliga a entregar.

## Qué datos protege y cuáles son especiales

La ley distingue tres categorías (art. 9):

- Datos sensibles: los del fuero íntimo, como origen racial, opiniones políticas, convicciones religiosas, condición socioeconómica, información biomédica o genética y vida u orientación sexual (art. 3). Nadie está obligado a darlos y su tratamiento está prohibido, salvo excepciones tasadas como la atención médica o el interés vital de la persona.
- Datos de acceso restringido: aunque estén en registros públicos, solo interesan a su titular o a la Administración.
- Datos de acceso irrestricto: los que están en bases públicas de acceso general.

Los datos de comportamiento crediticio tienen sus propias reglas, alineadas con el sistema financiero.

## Calidad y conservación

Los datos deben ser actuales, veraces, exactos y adecuados al fin para el que se recogieron (art. 6). El responsable tiene que eliminar los que ya no sean necesarios, y los datos que puedan afectar a la persona no se conservan más de 10 años desde los hechos registrados. Si hace falta guardarlos más tiempo, deben desasociarse de su titular.

## Tus derechos y el plazo de 5 días

La ley garantiza el derecho de acceso, rectificación y supresión, y el de consentir la cesión de tus datos (art. 7). El responsable debe atender tu solicitud gratis y resolverla en **5 días hábiles**.

Con el derecho de acceso puedes saber:

- Si existen datos tuyos en una base y cuáles son.
- Con qué finalidad se recogieron y qué uso se les ha dado.
- El registro completo que tienen de ti, explicado sin códigos ni tecnicismos.

> La ley costarricense no incluye el derecho de portabilidad ni el de oponerse a decisiones automatizadas que sí tiene el RGPD. Es una de las razones por las que se discute reformarla.

Para mí, ese es su punto más débil. La 8968 se escribió en 2011, antes de que los algoritmos decidieran a quién se le aprueba un crédito o qué anuncio ves. Protege bien lo básico, pero se quedó corta frente a cómo se usan hoy los datos.

## Seguridad y confidencialidad

El responsable debe aplicar medidas técnicas y organizativas para evitar que los datos se alteren, se pierdan o se accedan sin autorización, con la seguridad física y lógica más adecuada según la tecnología disponible (art. 10). Todos los que intervienen en el tratamiento quedan obligados a guardar secreto, incluso después de dejar el puesto (art. 11).

El reglamento concreta qué se espera como mínimo:

1. Describir qué datos personales se tratan.
2. Mantener un inventario de la infraestructura tecnológica, con equipos, programas y licencias.
3. Hacer un análisis de riesgos y decidir las medidas de seguridad.
4. Calcular el riesgo residual y tener un plan para cubrir las medidas que faltan.
5. Revisar las medidas periódicamente (la recomendación es una vez al año).

Si te suena a ISO 27001 es porque lo es: la misma lógica de riesgos, en versión legal.

## Brechas de seguridad

Si hay una vulneración (pérdida, robo, destrucción o acceso indebido), el responsable debe informar a los titulares afectados en un máximo de **5 días hábiles** desde que ocurrió, para que puedan protegerse. El aviso debe explicar qué pasó, qué datos se comprometieron, qué medidas correctivas se tomaron y dónde obtener más información (reglamento, arts. 38 y 39).

> Mucho material de estudio usa las 72 horas del RGPD. En Costa Rica el plazo para avisar a los afectados es de 5 días hábiles. No confundas las dos normas en un examen ni, sobre todo, en un incidente real.

## Transferencias, encargados y protocolos

- Transferencias: solo con autorización expresa del titular (art. 14). Enviar datos al extranjero sin su consentimiento es una falta gravísima.
- Encargados: si contratas a un proveedor (nube, nómina, *call center*), él solo puede tratar los datos según tus instrucciones, pero tú sigues siendo responsable y debes verificar que cumpla las medidas de seguridad.
- Protocolos de actuación (art. 12): un código interno con políticas de privacidad, capacitación del personal, control interno y canales gratuitos para atender a los titulares. Es la versión costarricense de las normas corporativas vinculantes.

## La PRODHAB y el registro de bases de datos

Vigila el cumplimiento la Agencia de Protección de Datos de los Habitantes (PRODHAB), un órgano adscrito al Ministerio de Justicia y Paz (art. 15). Puede actuar de oficio o por denuncia, pedir información, acceder a las bases de datos y sancionar (art. 16).

Toda base de datos, pública o privada, que se use para distribuir, difundir o comercializar datos personales debe inscribirse en el registro de la PRODHAB (art. 21). Tratar datos sin estar inscrito cuando corresponde es una falta gravísima.

> A diferencia del RGPD, la ley costarricense no exige un delegado de protección de datos. Aun así, el curso dedica un taller entero a esa figura: es buena práctica y casi seguro llegará con la reforma.

## Faltas y multas

Las multas se calculan en salarios base del puesto de auxiliar judicial I, que se actualiza cada año con la Ley de Presupuesto (art. 28):

<div class="table-wrap">
<table>
<thead><tr><th>Falta</th><th>Ejemplos (arts. 29 a 31)</th><th>Sanción</th></tr></thead>
<tbody>
<tr><td>Leve</td><td>Recoger datos sin informar bien a la persona; usar mecanismos inseguros para guardarlos o transmitirlos</td><td>Hasta 5 salarios base</td></tr>
<tr><td>Grave</td><td>Tratar datos sin consentimiento; usarlos para otra finalidad; negarse sin motivo a dar acceso o a rectificar y eliminar</td><td>De 5 a 20 salarios base</td></tr>
<tr><td>Gravísima</td><td>Tratar datos sensibles; obtener datos con engaño o amenazas; revelar datos secretos; no inscribir la base; transferir datos al extranjero sin consentimiento</td><td>De 15 a 30 salarios base y suspensión de la base de datos de 1 a 6 meses</td></tr>
</tbody>
</table>
</div>

Para una empresa cuyo negocio son los datos, la suspensión de la base puede doler más que la multa.

## Qué cambia para quien trabaja en seguridad

- Un incidente ya no es solo técnico: si hay datos personales, empiezan a correr los 5 días hábiles para avisar a los afectados. El plan de respuesta debe decir quién decide y quién redacta el aviso.
- Guardar datos de forma insegura ya es una falta, aunque no haya fuga: la ley sanciona el uso de mecanismos inseguros.
- El borrado tiene que ser real: la supresión y el límite de 10 años obligan a borrar de forma segura, también en copias de seguridad y equipos que se dan de baja (control 8.10 de ISO 27001).
- ISO 27001 y la Ley 8968 se complementan: la norma te da el sistema de gestión y la ley te dice qué resultado exige sobre los datos personales.

::: leccion
- En Costa Rica rige la Ley 8968 y su reglamento; la base de todo es la autodeterminación informativa y el consentimiento informado.
- Tienes derecho a acceder, rectificar y suprimir tus datos, gratis, con respuesta en 5 días hábiles.
- Ante una brecha, el responsable debe avisar a los afectados en 5 días hábiles. No son las 72 horas del RGPD.
- La PRODHAB registra las bases comerciales y sanciona con multas de hasta 30 salarios base y la suspensión de la base de datos.
:::

::: fuentes Fuentes
- [Ley 8968 en el Sistema Costarricense de Información Jurídica (SCIJ)](https://www.pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?param1=NRTC&nValor1=1&nValor2=70975)
- [Agencia de Protección de Datos de los Habitantes (PRODHAB)](https://www.prodhab.go.cr/)
- [Expediente 23.097: proyecto de Ley de Protección de Datos Personales](https://delfino.cr/asamblea/proyecto/23097)
- Material del curso Ley de Protección de Datos Personales y talleres de Hacker Mentor (2024).
:::

---

La próxima vez que una tienda te pida tus datos, pregunta para qué los quiere y quién más los verá. Tienes derecho a saberlo, y si algún día lo pides, la ley les da 5 días hábiles para responderte.
