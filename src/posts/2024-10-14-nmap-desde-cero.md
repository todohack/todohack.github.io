---
title: "Nmap desde cero: reconoce tu laboratorio"
description: Los comandos de Nmap que de verdad vas a usar, explicados uno a uno y practicados sobre tu propia red de laboratorio.
tags: [laboratorio, reconocimiento, kali]
---

## Antes de tocar nada, mira

Un ladrón no entra a una casa sin antes pasear por la calle. Mira qué ventanas hay, cuáles tienen luz y cuáles están abiertas. En seguridad informática ese paseo se llama **reconocimiento**, y la herramienta reina para hacerlo es **Nmap**.

Ya tienes tu [Kali Linux](/Kali-Linux-para-Hackers/) funcionando dentro de un [virtualizador](/Virtualizadores/), así que toca practicar. Veremos los comandos que de verdad usarás, qué hace cada opción y cómo leer lo que devuelven.

> Escanea solo equipos **tuyos o con permiso por escrito**. Escanear redes ajenas puede ser ilegal en tu país, aunque "solo mires".

## Prepara el objetivo

Lo ideal es tener una segunda máquina vulnerable a propósito, como Metasploitable 2, en la misma red que tu Kali. Si usas *VirtualBox* con un adaptador Solo anfitrión (*Host-only*), la red por defecto suele ser `192.168.56.0/24`.

Primero averigua tu propia IP:

```bash
ip -brief address
```

## 1. Descubre qué equipos están vivos

Antes de buscar puertos (las "puertas" por donde un equipo ofrece sus servicios), conviene saber qué equipos responden:

```bash
sudo nmap -sn 192.168.56.0/24
```

- `-sn` hace solo descubrimiento de equipos, sin escanear puertos.
- Con `sudo`, en una red local Nmap usa peticiones ARP, que son rápidas y muy fiables.

## 2. Escanea los puertos

Con la IP de tu objetivo, por ejemplo `192.168.56.101`:

```bash
sudo nmap -sS 192.168.56.101
```

- `-sS` es el escaneo SYN o *semiabierto*: envía el primer paquete de la conexión TCP y no la completa. Es rápido y el más usado.
- Por defecto revisa los 1.000 puertos más comunes.

Si quieres revisar todos los puertos TCP (del 1 al 65535):

```bash
sudo nmap -sS -p- --min-rate 1000 192.168.56.101
```

> Fíjate en el estado de cada puerto. *Open* significa que un servicio responde. *Closed*, que el equipo responde pero no hay servicio. *Filtered*, que algo, normalmente un firewall, bloquea la respuesta.

## 3. Identifica servicios y versiones

Saber que el puerto 21 está abierto no basta. Necesitas saber qué software hay detrás y en qué versión.

```bash
sudo nmap -sV -sC -p 21,22,80 192.168.56.101
```

- `-sV` detecta el servicio y su versión.
- `-sC` ejecuta los scripts por defecto del motor NSE (*Nmap Scripting Engine*), que revisan cosas como accesos anónimos o cabeceras HTTP.

Con la versión en la mano ya puedes buscar si tiene vulnerabilidades conocidas. Ese es el puente entre el reconocimiento y la explotación.

## 4. Sistema operativo y guardado de resultados

```bash
sudo nmap -O -sV -oA escaneo-lab 192.168.56.101
```

- `-O` intenta adivinar el sistema operativo.
- `-oA escaneo-lab` guarda el resultado en tres formatos a la vez (normal, XML y *grepeable*). Acostúmbrate a guardar siempre: un buen informe se construye con evidencias.

## Chuleta rápida

<div class="table-wrap">
<table>
<thead><tr><th>Opción</th><th>Para qué sirve</th></tr></thead>
<tbody>
<tr><td><code>-sn</code></td><td>Descubrir hosts vivos sin escanear puertos</td></tr>
<tr><td><code>-sS</code></td><td>Escaneo SYN, rápido y el más común</td></tr>
<tr><td><code>-p-</code></td><td>Revisar los 65535 puertos TCP</td></tr>
<tr><td><code>-sV</code></td><td>Detectar servicio y versión</td></tr>
<tr><td><code>-sC</code></td><td>Ejecutar los scripts NSE por defecto</td></tr>
<tr><td><code>-O</code></td><td>Detectar el sistema operativo</td></tr>
<tr><td><code>-oA</code></td><td>Guardar resultados en tres formatos</td></tr>
</tbody>
</table>
</div>

::: leccion
- Primero descubre, después escanea: `-sn` te dice qué hay en la red antes de gastar tiempo en puertos.
- Un puerto abierto no es una vulnerabilidad. Lo que te lleva a los fallos reales es la versión del servicio (`-sV`).
- Guarda siempre tus resultados con `-oA`; son la base de tu informe.
- Desde la defensa, lo que Nmap ve, un atacante también lo ve. Cierra los servicios que no uses.
- Practica solo en tu laboratorio o con permiso por escrito.
:::

---

Haz tu primer escaneo y mira la lista de puertos abiertos. En el próximo laboratorio usaremos estos resultados para buscar vulnerabilidades. Si quieres, cuéntame en los comentarios qué servicios encontraste.
