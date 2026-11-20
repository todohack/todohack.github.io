---
title: "Optimizely: el script de confianza que robó en 178 sitios"
description: Cómo un código inyectado en Optimizely Web robó cripto y tarjetas en webs como BBC o CNN sin hackearlas, y qué revisar si tu sitio usa scripts ajenos.
gancho: "Nadie hackeó la web de la BBC. Y aun así, la BBC sirvió malware."
gancho_texto: "Un solo proveedor de pruebas A/B fue suficiente para inyectar código en 178 organizaciones durante casi un día."
tags: [supply-chain, web]
---

El 16 de noviembre de 2026, a las 4:21 de la mañana (hora UTC), un fragmento de JavaScript apareció donde no debía. No estaba en el servidor de ninguna víctima. Estaba en el archivo que Optimizely, una plataforma de experimentos y pruebas A/B, sirve a sus clientes desde su propio dominio, `cdn.optimizely.com`.

Ese día, quien entraba a ciertas páginas de la BBC, CNN, Salesforce o Zoom (las listas de los medios varían) recibía, sin saberlo, código del atacante. Nadie tuvo que romper la seguridad de esas empresas. Bastó con cambiar lo que su proveedor de confianza les entregaba.

## Qué encontró Report URI

El hallazgo es de **Scott Helme**, fundador de Report URI, un servicio que vigila los scripts que cargan las webs. Su equipo revisó 1.611 archivos de Optimizely y encontró código malicioso en 188, repartidos en 178 organizaciones. Según The Record, 32 eran sitios financieros o bancarios; el resto, tecnología, noticias, aerolíneas y comercio.

Helme cree que la cifra real es mayor: solo pudieron revisar los archivos que tenían a mano, y Optimizely tiene más de 9.000 clientes. Para las 11:11 de la noche (UTC) de ese mismo 16 de noviembre, todos los archivos infectados que conocían ya estaban limpios.

## Qué hacía el código

El atacante no tocó el archivo principal. Escribió su código en un campo opcional llamado *Project JavaScript*, que existe precisamente para que cada cliente añada su propio código personalizado. Desde ahí cargaba un segundo script con cuatro trabajos:

<table>
<thead><tr><th>Objetivo</th><th>Cómo lo hacía</th></tr></thead>
<tbody>
<tr><td>Criptomonedas</td><td>Buscaba direcciones de billetera (Bitcoin, Ethereum, Solana, Dogecoin, Litecoin) en la página y en el portapapeles, y las cambiaba por las suyas</td></tr>
<tr><td>Tarjetas</td><td>Vigilaba los formularios de pago propios del sitio y enviaba número, vencimiento y CVV cuando tenía los tres</td></tr>
<tr><td>Sesiones</td><td>Junto al cambio de billetera, intentaba enviar la URL, las cookies sin protección <code>HttpOnly</code> y una captura de pantalla</td></tr>
<tr><td>iPhone y iPad</td><td>Cargaba en un marco oculto kits de exploits para versiones antiguas de iOS</td></tr>
</tbody>
</table>

Los pagos hechos en marcos alojados por la pasarela (como los de Stripe o Adyen) no se vieron afectados: el código no podía leer lo que pasaba dentro de ellos. Report URI confirmó al menos unos **7.000 dólares en criptomonedas** enviados al atacante. Cuántas tarjetas, cookies o teléfonos cayeron, nadie lo sabe todavía.

## Cómo entró: la parte que no cuadra

Optimizely dijo que un tercero aprovechó una vulnerabilidad en Experimentation y, según su declaración a BleepingComputer, el fallo estaba en el flujo de **registro de cuentas nuevas**. La empresa bloqueó esa ruta, borró el código inyectado, cerró sesiones, revocó tokens y contactó a los clientes afectados.

Lo que nadie ha explicado es cómo un fallo en el registro permitió modificar proyectos de clientes que ya existían. Helme, además, dijo que el mismo código se había visto antes en sitios turcos, en septiembre. Mientras Optimizely no publique un análisis completo, esas dos preguntas siguen abiertas.

> Me llama la atención que la herramienta afectada sea de marketing. No es un servidor crítico ni una base de datos: es el script que decide de qué color va el botón de "Comprar". Y aun así corría con los mismos permisos que el código del propio sitio.

## Por qué la CSP no salvó a casi nadie

La política de seguridad de contenido (CSP) es la cabecera que le dice al navegador de qué dominios puede cargar código y a dónde puede enviar datos. Report URI revisó la CSP de 159 de las organizaciones afectadas:

<table>
<thead><tr><th>Situación</th><th>Organizaciones</th></tr></thead>
<tbody>
<tr><td>Sin CSP</td><td>68</td></tr>
<tr><td>CSP que permitía ejecutar el código y enviar datos</td><td>50</td></tr>
<tr><td>Permitía ejecutar, pero bloqueaba el envío de datos</td><td>17</td></tr>
<tr><td>Bloqueaba la ejecución</td><td>24 (15 %)</td></tr>
</tbody>
</table>

El detalle importante: poner `cdn.optimizely.com` en la lista de dominios permitidos no protegía nada, porque el código malicioso salía justamente de ese dominio. Y en los 17 sitios que bloqueaban el envío de datos, el cambio de billeteras seguía funcionando, porque ocurre dentro de la propia página.

Esto se parece a lo que vimos con [Salesloft Drift](/salesloft-drift-tokens-oauth/): una integración de terceros con demasiado acceso. La diferencia es que aquí la víctima final no era la empresa, sino cada persona que visitaba su web.

## Qué revisar

::: leccion
- Si usas Optimizely Web, revisa el *Project JavaScript* de cada proyecto y el código personalizado de cada experimento. Busca el dominio `1688360.cc`, la cadena `atob(` y cualquier código que tu equipo no haya escrito.
- Mira el historial de cambios de Optimizely y quién tiene permiso de edición; revoca tokens e integraciones que no uses y rota credenciales.
- Si tu sitio tiene formularios de tarjeta propios, trata como expuestas las tarjetas ingresadas el 16 de noviembre de 2026 en páginas que cargaban el script.
- Rota cualquier token de sesión guardado en cookies sin `HttpOnly`.
- Haz inventario de todos los scripts de terceros que cargan tus páginas de pago y de inicio de sesión. Cada uno tiene el mismo poder que tu propio código.
- Prefiere los formularios de pago alojados por la pasarela: fueron los que se salvaron.
- Como usuario, antes de enviar criptomonedas compara la dirección completa en otro canal, no solo los primeros caracteres. Y mantén tu iPhone o iPad actualizado.
:::

::: fuentes Fuentes
- [The Record: Optimizely malicious code customer sites](https://therecord.media/optimizely-malicious-code-customer-sites)
- [IT Pro: Optimizely hack, everything we know so far](https://www.itpro.com/security/cyber-attacks/optimizely-hack-everything-we-know-so-far-as-hundreds-of-websites-found-serving-malware-to-visitors)
- [Search Engine Journal: Optimizely signup flaw and malware](https://searchenginejournal.com/optimizely-signup-flaw-malware/597839)
- [Infobae: ataque a 178 sitios para robar criptomonedas y atacar iPhones](https://www.infobae.com/tecno/2026/11/17/un-ataque-infecto-a-178-sitios-para-robar-criptomonedas-y-atacar-iphones/)
:::

---

Cada etiqueta `<script>` que apunta a otro dominio es una puerta que le prestas a alguien. Vale la pena saber, de vez en cuando, quién tiene las llaves.
