---
title: "Del portal al anuncio falso: así te infectas hoy"
description: Los portales de descargas casi desaparecieron, pero el riesgo no: hoy el malware llega por anuncios y sitios clonados. Cómo bajar programas seguro.
gancho: "Buscaste el programa en Google. El primer resultado era un anuncio. Y el anuncio era falso."
gancho_texto: "El FBI ya advirtió que los delincuentes compran anuncios en buscadores para suplantar sitios de descarga."
tags: [malware, fraude]
---

Hoy casi nadie entra a un portal de descargas como en los 2000. Buscas el programa en Google, haces clic en el primer resultado y lo bajas. Parece más seguro. El problema es que los delincuentes también lo saben, y ahora pagan para estar en ese primer resultado.

Esta es la última entrega de la serie sobre cómo las descargas han sido un foco de infección: de [las BBS y los disquetes](/shareware-bbs-disquetes-infeccion/) a [los portales con instaladores llenos de adware](/portales-descarga-adware-instaladores/), y de ahí a lo que vemos ahora.

## La advertencia del FBI

El 21 de diciembre de 2022, el FBI publicó una alerta: delincuentes estaban comprando anuncios en buscadores con dominios parecidos a los de marcas reales. Esos anuncios aparecían arriba de los resultados, casi sin diferencia visual con los resultados normales, y llevaban a una página idéntica a la oficial.

Cuando la persona buscaba un programa, el botón de descarga de la página falsa entregaba **malware**, con el mismo nombre del programa que quería. Según el FBI, ese malware podía incluir ransomware y robo de credenciales e información financiera.

## Tres casos recientes

Malwarebytes ha documentado este patrón varias veces:

<table>
<thead><tr><th>Fecha</th><th>Programa suplantado</th><th>Cómo llegaba</th><th>Qué instalaba</th></tr></thead>
<tbody>
<tr><td>Junio de 2024</td><td>Navegador Arc (Mac)</td><td>Anuncio de Google hacia un sitio falso de descarga</td><td>Poseidon, un ladrón de contraseñas, billeteras cripto y datos del navegador</td></tr>
<tr><td>Enero de 2026</td><td>RustDesk (escritorio remoto)</td><td>Dominio falso que aparecía en Google</td><td>El RustDesk real <strong>más</strong> una puerta trasera oculta en memoria</td></tr>
<tr><td>Febrero de 2026</td><td>Windows 11</td><td>Anuncios en Facebook hacia una copia de la página de descarga de Microsoft</td><td>Un ladrón de contraseñas, sesiones y billeteras, alojado en GitHub</td></tr>
</tbody>
</table>

El caso de RustDesk muestra lo sofisticado que se ha vuelto: el programa funcionaba de verdad, así que la víctima no tenía motivo para sospechar. Y el de Windows 11 tiene un detalle importante: el archivo se servía desde GitHub, con HTTPS y certificado válido, así que el navegador no lo marcaba como peligroso.

> Me parece que el gran cambio es este: antes el engaño estaba en el portal; hoy está en el camino hacia el portal. Ya no basta con "bajarlo del sitio oficial", porque primero hay que asegurarse de que llegaste al sitio oficial.

## La otra cara: descargar nunca fue tan seguro

No todo es malo. Hoy existen formas de instalar programas que la gente de las BBS habría envidiado:

<table>
<thead><tr><th>Opción</th><th>Por qué ayuda</th></tr></thead>
<tbody>
<tr><td>Tiendas de aplicaciones (Microsoft Store, App Store)</td><td>Revisan las aplicaciones antes de publicarlas. La App Store de Apple abrió el 10 de julio de 2008</td></tr>
<tr><td>Gestores de paquetes (winget en Windows)</td><td>Instalas desde la terminal sin pasar por buscadores. Según su documentación, winget usa SmartScreen, análisis estático y verificación de hash SHA-256</td></tr>
<tr><td>Firma digital de código</td><td>Windows avisa cuando un programa no está firmado o el editor no es reconocido</td></tr>
<tr><td>Sitios oficiales y repositorios del autor</td><td>Sin intermediarios que envuelvan el instalador</td></tr>
</tbody>
</table>

Ninguna es perfecta. Las tiendas han tenido aplicaciones maliciosas y los repositorios de código también se han envenenado, como vimos con [npm](/npm-chalk-shai-hulud/). Pero cada una reduce las oportunidades de que alguien se meta en medio.

## Cómo bajar programas hoy sin infectarte

::: leccion
- Escribe tú mismo la dirección del sitio oficial o guárdala en favoritos, en vez de buscarla cada vez. Es la primera recomendación del FBI.
- Ignora los resultados marcados como "Patrocinado" o "Anuncio" cuando busques descargas de programas.
- Revisa la dirección letra por letra antes de descargar: los dominios falsos cambian una letra, agregan un guion o usan otra terminación.
- Usa un bloqueador de publicidad al buscar, como recomienda el FBI.
- En Windows, prefiere `winget install` o la Microsoft Store cuando el programa esté ahí.
- Desconfía de los anuncios en redes sociales que ofrecen descargar Windows, actualizaciones o programas pagos gratis. Windows se actualiza desde Configuración, no desde un anuncio.
- Nunca bajes programas crackeados: en 1985 y en 2026 siguen siendo la forma más fácil de instalar un ladrón de contraseñas.
- Si ya instalaste algo sospechoso, desconéctate, escanea el equipo y cambia tus contraseñas desde otro dispositivo.
:::

::: fuentes Fuentes
- [FBI IC3: Cyber criminals impersonating brands using search engine advertisement services (21 de diciembre de 2022)](https://www.ic3.gov/PSA/2022/PSA221221)
- [Malwarebytes: Poseidon Mac stealer distributed via Google ads (2024)](https://www.malwarebytes.com/blog/news/2024/06/poseidon-mac-stealer-distributed-via-google-ads)
- [Malwarebytes: How real software downloads can hide remote backdoors (2026)](https://www.malwarebytes.com/blog/threat-intel/2026/01/how-real-software-downloads-can-hide-remote-backdoors)
- [Malwarebytes: Facebook ads spread fake Windows 11 downloads (2026)](https://www.malwarebytes.com/blog/scams/2026/02/facebook-ads-spread-fake-windows-11-downloads-that-steal-passwords-and-crypto-wallets)
- [Wikipedia: Windows Package Manager](https://en.wikipedia.org/wiki/Windows_Package_Manager)
- [Wikipedia: App Store (Apple)](https://en.wikipedia.org/wiki/App_Store_(Apple))
:::

---

**Serie Descargas peligrosas:** [BBS y disquetes](/shareware-bbs-disquetes-infeccion/) · [Los portales de descarga y sus instaladores](/portales-descarga-adware-instaladores/) · Anuncios y sitios falsos hoy
