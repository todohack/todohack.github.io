---
title: "Wireshark: tu primera captura de tráfico"
description: Captura, filtra y entiende lo que viaja por tu red de laboratorio, y descubre con tus propios ojos por qué HTTP sin cifrar es un riesgo.
tags: [laboratorio, redes, wireshark]
---

## Ver una contraseña viajar por la red

Hay una experiencia que cambia cómo piensas en seguridad: ver tu propia contraseña cruzar la red, escrita tal cual, en una pantalla. Eso vamos a hacer hoy.

Con [Nmap](/nmap-desde-cero/) aprendimos a ver qué servicios hay en la red. Ahora toca ver qué dicen esos servicios, y para eso se usa **Wireshark**, el analizador de tráfico más usado del mundo. Al terminar habrás capturado tráfico real y lo habrás filtrado.

> Captura solo **tu propio tráfico** o el de tu laboratorio. Interceptar comunicaciones ajenas sin autorización es delito en la mayoría de países.

## 1. Abre Wireshark y elige la interfaz

En tu [Kali](/Kali-Linux-para-Hackers/) ya viene instalado. Ábrelo desde el menú o con:

```bash
sudo wireshark
```

Verás la lista de interfaces de red con una pequeña gráfica de actividad. Elige la que conecta con tu laboratorio (normalmente `eth0` o `eth1`) y haz doble clic. La captura empieza al instante.

## 2. Entiende la pantalla

Wireshark muestra tres paneles:

1. Lista de paquetes: un paquete por fila, con origen, destino, protocolo e información.
2. Detalle: al seleccionar un paquete, sus capas desglosadas (Ethernet, IP, TCP, HTTP…).
3. Bytes: el contenido en crudo, en hexadecimal y en texto.

> Al principio verás cientos de paquetes por segundo. No te asustes: el secreto de Wireshark son los filtros.

## 3. Filtra lo que te interesa

Escribe estos filtros en la barra verde de arriba y pulsa *Enter*:

<div class="table-wrap">
<table>
<thead><tr><th>Filtro</th><th>Qué muestra</th></tr></thead>
<tbody>
<tr><td><code>ip.addr == 192.168.56.101</code></td><td>Todo el tráfico de o hacia esa IP</td></tr>
<tr><td><code>dns</code></td><td>Las consultas de nombres de dominio</td></tr>
<tr><td><code>http</code></td><td>Tráfico web sin cifrar</td></tr>
<tr><td><code>tcp.port == 22</code></td><td>Conexiones SSH</td></tr>
<tr><td><code>http.request.method == "POST"</code></td><td>Formularios enviados, como los de inicio de sesión</td></tr>
<tr><td><code>tls.handshake.extensions_server_name</code></td><td>El nombre del sitio en conexiones HTTPS</td></tr>
</tbody>
</table>
</div>

## 4. El experimento: una contraseña en texto plano

Si tienes Metasploitable 2 en tu laboratorio, abre en el navegador de Kali su aplicación web (por ejemplo, `http://192.168.56.101/dvwa/`) e inicia sesión con cualquier usuario y contraseña de prueba.

Después, en Wireshark:

1. Aplica el filtro `http.request.method == "POST"`.
2. Selecciona el paquete y despliega *HTML Form URL Encoded* en el panel de detalle.
3. Ahí está el usuario y la contraseña, tal cual los escribiste.

También puedes hacer clic derecho sobre el paquete y elegir *Seguir > Flujo TCP* (*Follow > TCP Stream*) para leer toda la conversación como si fuera un chat.

> Esto es justo lo que vería cualquiera en tu misma red Wi-Fi si un sitio usa **HTTP sin cifrar**. Con HTTPS, en ese mismo punto solo verías datos cifrados.

Para mí, este es el mejor argumento a favor del candado del navegador: se entiende en diez segundos y no se olvida.

## 5. Guarda tu captura

Ve a *Archivo > Guardar como* y guárdala en formato `.pcapng`. Así podrás volver a analizarla o compartirla como evidencia en un informe.

::: leccion
- Filtra antes de leer: `ip.addr`, `dns`, `http` y `tcp.port` resuelven el 90 % de los análisis.
- *Seguir flujo TCP* convierte cientos de paquetes en una conversación legible.
- HTTP sin cifrar expone contraseñas a cualquiera en la misma red, así que exige siempre HTTPS.
- Guarda tus capturas en `.pcapng`; son evidencia.
- Captura solo tráfico propio o autorizado.
:::

---

La próxima vez que te pida una contraseña un sitio sin candado, acuérdate de este experimento. Y si lo pruebas, cuéntame qué fue lo primero que te sorprendió de tu propio tráfico.
