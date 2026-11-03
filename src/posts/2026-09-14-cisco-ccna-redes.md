---
title: "Cisco CCNA 1, 2 y 3: las redes que todo hacker necesita entender"
description: Los tres cursos de Cisco Networking Academy que preparan para el CCNA, qué enseña cada uno y por qué son la base de la ciberseguridad.
tags: [certificaciones, redes]
---

No puedes atacar ni defender lo que no entiendes, y casi todo lo que se ataca viaja por una red. Por eso, antes de lanzarme de lleno a la seguridad, completé la ruta **CCNA de Cisco Networking Academy**, que se divide en tres cursos.

## Los tres cursos

<div class="table-wrap">
<table>
<thead><tr><th>Curso</th><th>Qué aprendes</th></tr></thead>
<tbody>
<tr><td><strong>CCNA 1</strong>: Introduction to Networks</td><td>Cómo funciona una red: modelo OSI y TCP/IP, direccionamiento IPv4 e IPv6, subredes, Ethernet y la configuración básica de equipos Cisco</td></tr>
<tr><td><strong>CCNA 2</strong>: Switching, Routing, and Wireless Essentials</td><td>Cómo operan switches y routers en redes pequeñas: VLAN, enrutamiento entre VLAN, redundancia, redes inalámbricas y seguridad básica de capa 2</td></tr>
<tr><td><strong>CCNA 3</strong>: Enterprise Networking, Security, and Automation</td><td>Redes empresariales: enrutamiento dinámico, listas de control de acceso (ACL), NAT, VPN, WAN, virtualización y una introducción a la automatización</td></tr>
</tbody>
</table>
</div>

Cada curso son unas 70 horas y se cursan en orden. Con los tres completos ya puedes prepararte para el examen de certificación CCNA 200-301, que dura 120 minutos.

## Por qué importa para la seguridad

Casi todo lo que hacemos en este blog se apoya en estos conceptos:

- Un escaneo con [Nmap](/nmap-desde-cero/) trabaja con direcciones IP, puertos y protocolos TCP y UDP. Eso es capa 3 y 4.
- Una captura en [Wireshark](/wireshark-tu-primera-captura/) solo se entiende si conoces el modelo de capas.
- Las VLAN (redes virtuales separadas) y las ACL (reglas de quién puede hablar con quién) son controles de segmentación. Es la defensa que más se repite en las lecciones de casos como [Collins Aerospace](/collins-aerospace-aeropuertos/) o [Jaguar Land Rover](/jaguar-land-rover-ciberataque/).

> Un atacante que entra en una red plana llega a todo. En una red bien segmentada, cada salto le cuesta. Esa diferencia la diseñan quienes saben de redes.

## Cómo sacarle provecho

Los laboratorios valen más que la teoría. Practica con Packet Tracer, el simulador gratuito de Cisco Networking Academy.

El subnetting (dividir una red en partes) conviene dominarlo hasta hacerlo de cabeza, porque aparece en todas partes. Y a cada tema ponle enfrente un ataque y su defensa: VLAN hopping, ARP spoofing, ACL mal configuradas.

## Dónde obtenerla

Los tres cursos están en Cisco Networking Academy, muchas veces a través de una universidad o academia asociada:

- [CCNA 1: Introduction to Networks](https://www.netacad.com/courses/ccna-introduction-networks "CCNA: Introduction to Networks")
- [CCNA 2: Switching, Routing, and Wireless Essentials](https://www.netacad.com/courses/ccna-switching-routing-wireless-essentials "CCNA: Switching, Routing, and Wireless Essentials")
- [CCNA 3: Enterprise Networking, Security, and Automation](https://www.netacad.com/courses/ccna-enterprise-networking-security-automation "CCNA: Enterprise Networking, Security, and Automation")

Para certificarte, el examen CCNA 200-301 se agenda desde la [página oficial de Cisco](https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html "Examen CCNA 200-301").

::: leccion
- Las redes son la base de la ciberseguridad: sin ellas, las herramientas no se entienden.
- La ruta CCNA son tres cursos de unas 70 horas, en orden, que preparan para el examen 200-301.
- VLAN, ACL y segmentación son controles de seguridad, no solo de red.
- Practica en Packet Tracer y mira cada tema desde el ataque y la defensa.
:::

::: fuentes Fuentes
- [Cisco Networking Academy](https://www.netacad.com/)
- [Cisco: CCNA 200-301](https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccna.html)
:::

---

¿Cuál es tu punto débil, el subnetting o las VLAN? Escoge uno, descarga Packet Tracer y dedícale hoy media hora.
