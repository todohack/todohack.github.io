---
layout: post
title: "Virtualizadores"
date: 2024-08-26 17:47:00 -0600
img: Virtualizador_data.jpg
description: Tus opciones para virtualizar sistemas.
---

Contenido

* TOC
{:toc}

---

<link rel="stylesheet" href="{{ site.baseurl }}/dist/css/lightbox.min.css">


## Introducción

Este post es informativo para que sepas como instalar y elegir el *virtualizador* que más se acople a tu manera de trabajar, agregar sus principales ventajas y otras cosas no tan buenas en su uso.

Entre ellos veremos:

- VMware
- VirtualBox
- HyperV


## Descargar virtualizadores

Es Recomendable montar tu máquina virtual en **VMware** (Actualmente para uso personal es gratis) - Enlace: [VMware](https://support.broadcom.com/group/ecx/productdownloads?subfamily=VMware+Workstation+Pro "VMware for personal use")  

> Es algo complicado descargar VMware desde la página de Broadcom, pero les dejo un video para que puedan hacerlo correctamente. [Tutorial descarga de VMware](https://www.youtube.com/watch?v=W2PLaqcK8Yc "Tutorial para descargar VMware de Nazareno Anselmi")  

O también **Virtual Box** desde el siguiente enlace: [VirtualBox](https://www.virtualbox.org/wiki/Downloads "VirtualBox")

Estos dos programas son realmente fáciles de instalar; simplemente deben hacer clic en *Siguiente* varias veces hasta completar la instalación. Pronto agregaré una sección con detalles sobre cómo realizarlo.

- VMware (Pendiente)
- VirtualBox (Pendiente)

> La gran ventaja de utilizar máquinas virtuales es que puedes ejecutarlas en casi todos los sistemas operativos. Además, si necesitas migrar a otro equipo, solo debes copiar los archivos correspondientes a Kali, y tendrás todo listo para usar.

## Instalación de Kali

### Descompresión

El Kali que vamos a utilizar ya cuenta con las configuraciones básicas que necesitamos, por lo que puedes ejecutarlo directamente. Sin embargo, proporcionaremos algunos detalles para mejorar tu experiencia de uso.

Primero, descomprime el archivo descargado previamente y obtendrás algo similar a lo que se muestra a continuación, asumiendo que lo descargaste desde el enlace más [arriba](https://www.kali.org/get-kali/#kali-virtual-machines "Kali Linux"):

<div style="display: flex; justify-content: center; align-items: center; max-width: 50%; height: auto; margin: 0 auto;">
  <a class="Paso 1.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali1.1.png" data-lightbox="Paso 1.1">
    <img class="Paso 1.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali1.1-min.png" alt="Paso 1.1" />
  </a>
</div>

### Ejecución

Dentro de la carpeta nos aparecen múltiples archivos, con extensiones **.vmdk** que podemos ignorar, el que realmente importa es el que termina con la extensión **.vmx**, este es el archivo ejecutable para *VMware*, y en caso de *VirtualBox*, la extensión relevante será la de **.vbox**.


<div style="display: flex; justify-content: center; align-items: center; gap: 30px;">
  <a href="{{ site.baseurl }}/assets/img/PasosKali/Kali2.1.png" data-lightbox="Paso 2.1">
    <img class="lightbox-image" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali2.1-min.png" alt="Paso 2.1" />
  </a>
  <a href="{{ site.baseurl }}/assets/img/PasosKali/Kali2.2.png" data-lightbox="Paso 2.2">
    <img class="lightbox-image" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali2.2-min.png" alt="Paso 2.2" />
  </a>
</div>


---

<script src="{{ site.baseurl }}/dist/js/lightbox-plus-jquery.min.js"></script>

Muchas gracias por leer este artículo. Por favor, deja tu comentario para saber qué te ha gustado y no olvides enviarme tus sugerencias para mejorar.

Utiliza estos enlaces para volver a arriba o salir de la publicación:

- [Volver al Inicio]({{ site.baseurl }}/Virtualizadores "Regresar al inicio de este post")
- [Portada del blog]({{ site.baseurl }}/ "Ir a la pantalla principal")

