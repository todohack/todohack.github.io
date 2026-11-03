---
title: "php2shell: dos fallos en el núcleo de PHP permiten tomar el servidor"
description: Ejecución remota de código sin autenticación en casi cualquier servidor web con PHP. Ya se está explotando, y solo actualizar lo corrige.
tags: [vulnerabilidades, web, parcheo]
---

Puedes tener tu WordPress al día, todos los plugins actualizados y un código impecable, y aun así estar expuesto. Eso es lo inquietante de php2shell: el fallo no está en tu aplicación, sino en el motor que la hace funcionar.

PHP mueve una parte enorme de la web: WordPress, paneles de hosting, tiendas en línea y miles de aplicaciones internas. Cuando el problema está en el propio PHP, el problema es de todos.

## Qué pasó

Son dos vulnerabilidades críticas, `CVE-2026-109618` y `CVE-2026-109619`, con una puntuación de gravedad de 9,2 sobre 10. Permiten que alguien ejecute código en tu servidor sin usuario ni contraseña, y sin que nadie tenga que hacer clic en nada.

- **20 de octubre**: los detalles se filtraron en redes sociales, dos días antes de la fecha prevista para anunciarlos.
- **21 de octubre**: PHP publicó un parche de emergencia. Ese mismo día, la firma watchTowr vio ataques reales contra sus servidores trampa (*honeypots*).
- **26 de octubre**: la agencia de ciberseguridad de Estados Unidos (CISA) los añadió a su lista de fallos que ya se están explotando.

Esa filtración anticipada es lo que más me preocupa del caso: los defensores no tuvieron ni un día de ventaja.

## Cómo funciona, sin tecnicismos

Cada vez que alguien visita una página, PHP reserva un poco de memoria para atender esa visita y, al terminar, la limpia para la siguiente. Los dos fallos están justo en esa limpieza:

1. **Se queda a medias** (`-109618`): si PHP se queda sin memoria mientras prepara una visita, deja piezas a medio construir, y el código de limpieza confía en ellas como si estuvieran bien.
2. **Algo sobrevive** (`-109619`): parte de lo que debía borrarse sigue vivo, y la siguiente visita trabaja sobre datos que ya no deberían existir.

Un atacante que provoque esas situaciones a propósito puede terminar ejecutando sus propios comandos con los permisos de PHP.

> Afecta a cualquier instalación que sirva páginas web, sea cual sea la forma en que PHP está montado (PHP-FPM, Apache con `mod_php`, php-cgi, LiteSpeed o FrankenPHP). Con `mod_php` el riesgo es mayor, porque el ataque puede completarse antes de que llegue a ejecutarse el código de tu aplicación.

La parte buena: explotarlo es complicado, y los exploits públicos solo funcionan en combinaciones concretas de sistema y versión. Pero ya hay gente intentándolo, y "es difícil" nunca ha sido una buena razón para esperar.

## ¿Estoy afectado?

<div class="table-wrap">
<table>
<thead><tr><th>Rama de PHP</th><th>Versión corregida</th></tr></thead>
<tbody>
<tr><td>8.5</td><td>8.5.12</td></tr>
<tr><td>8.4</td><td>8.4.27</td></tr>
<tr><td>8.3</td><td>8.3.36</td></tr>
<tr><td>8.2</td><td>8.2.35</td></tr>
<tr><td>7.4, 8.0 y 8.1</td><td>Sin versión oficial: usa el paquete de tu distribución o los <em>backports</em> de PHP</td></tr>
<tr><td>7.3 o anterior</td><td>Sin corrección: hay que migrar</td></tr>
</tbody>
</table>
</div>

Revisa la versión del servicio que atiende la web, no solo la que ves en la consola, porque pueden ser distintas:

```bash
php -v
php-fpm -v
```

Si usas los paquetes de tu distribución (`dpkg -l | grep php` o `rpm -qa | grep php`), mira su registro de cambios: a veces corrigen el fallo sin cambiar el número de versión.

::: leccion
- Actualiza y reinicia todos los procesos de PHP: según el propio proyecto, ninguna configuración lo frena por completo.
- Haz inventario. PHP suele esconderse dentro de otros productos: paneles de hosting, equipos de red, contenedores.
- Si hoy no puedes parchear, saca esos servidores de internet o ponlos detrás de un firewall de aplicaciones web mientras tanto.
- Vigila señales de ataque, como procesos de PHP que abren una consola o descargan herramientas.
- Una versión sin soporte (8.1 o anterior) ya no es deuda técnica: es una puerta abierta.
:::

::: fuentes Fuentes
- [CISA: Critical vulnerabilities in PHP require immediate patching](https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching)
- [watchTowr: PHP CVE-2026-109618 FAQ](https://watchtowr.com/intelligence/php-cve-2026-109618-faq/)
- [Rapid7: CVE-2026-109618 and CVE-2026-109619](https://www.rapid7.com/blog/post/etr-cve-2026-109618-and-cve-2026-109619-critical-unauthenticated-remote-code-execution-in-php/)
:::

---

Si administras servidores con PHP, haz una sola cosa antes de cerrar esta pestaña: entra y ejecuta `php -v`. Ese número te dice si tienes trabajo pendiente.
