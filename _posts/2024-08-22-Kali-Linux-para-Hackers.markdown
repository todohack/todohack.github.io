---
layout: post
title: "Kali Linux para Hackers"
date: 2024-08-22 17:47:00 -0600
img: Kali_Linux.jpg
description: Prepara tu sistema para hacer hacking.
---

Contenido

* TOC
{:toc}

---

<link rel="stylesheet" href="{{ site.baseurl }}/dist/css/lightbox.min.css">


## Introducción

Hola de nuevo *hacker*, hay múltiples versiones del kernel de Linux para *pentesting* y *hacking*, por ejemplo ***Parrot OS***, ***Blackbox*** o hasta ***Tails*** que quizás cubriremos en algún otro momento. Sin embargo, todo buen **hacker ético** tiene que tener afilada su herramienta más importante: nuestro *SO* de trabajo. Eso es lo que veremos en esta nota. Con uno de los Sistemas más populares en el medio, **Kali Linux** de *OffSec*.  

## Descargar Kali Linux

Para descargar la versión oficial, dirígete a la siguiente página: [Kali Linux](https://www.kali.org/get-kali/#kali-virtual-machines "Kali Linux")

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

Al ejecutar las imágenes que ya tenemos en nuestro sistema, el software nos permite ajustar algunas opciones, esto dependiendo de las capacidades de nuestro equipo y memoria instalada.

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 3.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali3.1.png" data-lightbox="Paso 3.1">
    <img class="Paso 3.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali3.1-min.png" alt="Paso 3.1" />
  </a>
</div>

Para *VirtualBox*, hay unas opciones similares:

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 3.2" href="{{ site.baseurl }}/assets/img/PasosKali/Kali3.2.png" data-lightbox="Paso 3.2">
    <img class="Paso 3.2" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali3.2-min.png" alt="Paso 3.2" />
  </a>
</div>

### Configuración

Los detalles que recomiendo editar son los siguientes:

- **Cantidad de nucleos del procesador**: Darán un mejor rendimiento a nuestra máquina virtual.
- **Cantidad de memoría disponible**: Permite ejecutar más tareas y con mayor rapidez.
- **Red**, en este caso podemos elegir 2 opciones:

	- **NAT**: (El entorno crea una red interna aislada de la red de tu equipo, y asigna direcciones IP a otras máquinas virtuales dentro de esa red)
	- ***Bridged* o Adaptador Puente**: (Con este se simula que los equipos son máquinas físicas dentro de tu red de casa u oficina)
	
Para realizar estos ajustes, en *VMware* debes seleccionar **Edit virtual machine settings** y en *VirtualBox* utilizarás el ícono con forma de tuerca del lado superior derecho, que dice **Configuración**. Tal como lo mostraré en las siguientes imagenes:	

Ya en *VMware* lo más relevante es aumentar la memoria RAM a 8 gigas, la configuración por defecto asignará 4 de nuestros nucleos de procesador, que en este caso es perfecto.

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 4.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali4.1.png" data-lightbox="Paso 4.1">
    <img class="Paso 4.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali4.1-min.png" alt="Paso 4.1" />
  </a>
</div>

En *VirtualBox*, las opciones son ligeramente diferentes. Debemos ajustar la cantidad de procesadores asignados, ya que solo con 2 núcleos es posible que la máquina virtual no tenga un rendimiento óptimo. Ten en cuenta las capacidades de tu computadora, pero un equipo decente suele tener al menos 6 u 8 núcleos, por lo que puedes asignar la mitad a la máquina virtual.

Para la memoria RAM, te recomiendo asignar al menos 4 GB, aunque es preferible aumentar a 8 GB para experimentar una mejora significativa en el rendimiento.

<div style="display: flex; justify-content: center; align-items: center; gap: 30px;">
  <a href="{{ site.baseurl }}/assets/img/PasosKali/Kali4.2.png" data-lightbox="Paso 4.2">
    <img class="lightbox-image" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali4.2-min.png" alt="Paso 4.2" />
  </a>
  <a href="{{ site.baseurl }}/assets/img/PasosKali/Kali4.2.1.png" data-lightbox="Paso 4.2.1">
    <img class="lightbox-image" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali4.2.1-min.png" alt="Paso 4.2.1" />
  </a>
</div>

> Aceptando estas configuraciones, considera que en algunos sistemas se van a presentar limitaciones, debido a nuestro *hardware*, pero puedes jugar un poco con los ajustes para intentar sacar el mejor rendimiento de tú equipo, sin incendiarlo en el proceso.  


Para la configuración de red, la opción **NAT** funcionará perfectamente para la mayoría de nosotros. Esta opción proporciona mayor *limpieza* al escanear equipos en nuestra red local, como en el caso de los *CTF* (Capture the Flag), ya que evita que aparezcan dispositivos no deseados como teléfonos móviles, televisores o bombillas inteligentes.

Por otro lado, si utilizamos **Bridged** o **Adaptador puente**, estos dispositivos sí aparecerán en el escaneo. Esta última opción es más adecuada en entornos empresariales, donde se están *hackeando* vulnerabilidades y se requiere una integración completa con la red.

> La elección depende de tus necesidades y preferencias, pero es importante aclararlo, ya que no muchas personas explican por qué existen estas opciones.

En *VMware*, aparece esta selección:

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 5.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali5.1.png" data-lightbox="Paso 5.1">
    <img class="Paso 5.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali5.1-min.png" alt="Paso 5.1" />
  </a>
</div>

Para *VirtualBox* tenemos este menú:

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 5.2" href="{{ site.baseurl }}/assets/img/PasosKali/Kali5.2.png" data-lightbox="Paso 5.2">
    <img class="Paso 5.2" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali5.2-min.png" alt="Paso 5.2" />
  </a>
</div>

> Puedes observar que hay casillas adicionales, en las imagenes anteriores. Sin embargo, es importante que, si decides utilizarlas, investigues su función o aprendas para qué sirven antes de modificarlas. Pueden causar que tu Kali se quede sin acceso a Internet o no pueda detectar otros equipos en la red.

### Primer arranque

Ejecutaremos nuestra máquina, usando cualquiera de las siguientes opciones:

**Power on this virtual machine** en *VMware*

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 6.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali6.1.png" data-lightbox="Paso 6.1">
    <img class="Paso 6.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali6.1-min.png" alt="Paso 6.1" />
  </a>
</div>

**Iniciar** en *VirtualBox

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 6.2" href="{{ site.baseurl }}/assets/img/PasosKali/Kali6.2.png" data-lightbox="Paso 6.2">
    <img class="Paso 6.2" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali6.2-min.png" alt="Paso 6.2" />
  </a>
</div>

A continuación, iniciará Kali:


<div style="display: flex; justify-content: center; align-items: center; gap: 30px;">
  <a href="{{ site.baseurl }}/assets/img/PasosKali/Kali7.1.png" data-lightbox="Paso 7.1">
    <img class="lightbox-image" style="max-width: 90%;" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali7.1-min.png" alt="Paso 7.1" />
  </a>
  <a href="{{ site.baseurl }}/assets/img/PasosKali/Kali8.1.png" data-lightbox="Paso 8.1">
    <img class="lightbox-image" style="max-width: 60%;" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali8.1-min.png" alt="Paso 8.1" />
  </a>
</div>

Hasta llegar a la pantalla de inicio de sesión:

- Usuario: **kali**
- Contraseña: **kali**

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 9.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali9.1.png" data-lightbox="Paso 9.1">
    <img class="Paso 9.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali9.1-min.png" alt="Paso 9.1" />
  </a>
</div>

Y listo, si todo ha salido bien, estaremos dentro de nuestro Kali "cero kilómetros" listos para comenzar a *hackear*. Pero un momento, aún no hemos terminado.

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 10.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali10.1.png" data-lightbox="Paso 10.1">
    <img class="Paso 10.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali10.1-min.png" alt="Paso 10.1" />
  </a>
</div>

Tenemos las siguientes herramientas preinstaladas:

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 11.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali11.1.png" data-lightbox="Paso 11.1">
    <img class="Paso 11.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali11.1-min.png" alt="Paso 11.1" />
  </a>
</div>


## Mejorar mi Kali

Ya tenemos Kali Linux listo y funcional, pero para optimizarlo con más funcionalidades, no olvides los siguientes detalles:

### Cambiar contraseña

Si quieres actuar como un *hacker* profesional, lo primero que debemos hacer es cambiar la contraseña predeterminada, que es fácil y vulnerable. Puedes hacerlo con el siguiente comando:

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 12.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali12.1.png" data-lightbox="Paso 12.1">
    <img class="Paso 12.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali12.1-min.png" alt="Paso 12.1" />
  </a>
</div>

> Aunque puede tomarnos algo de tiempo, nos ayudará a cultivar el hábito de establecer contraseñas para acciones importantes y protegernos adecuadamente.  


Además de cambiar la contraseña de tu usuario, también es recomendable modificar la del usuario *root* para mejorar la seguridad general de tu equipo.


{% highlight bash %}
┌──(kali㉿kali)-[~]
└─$ sudo su root # Cambiamos a root
[sudo] password for kali: #Tu contraseña actual de Kali

┌──(root㉿kali)-[~]
└─# passwd        
New password: # Una contraseña compleja para root
Retype new password: # La repetimos
passwd: password updated successfully
{% endhighlight %}

Ya que tenemos estos 2 detalles importantes, vamos a *chulear* el sistema con herramientas superiores para futuros ataques y explotaciones.

### Pimpmykali

No nos olvidemos de esta gran suite de soluciones para nuestro Kali, que fue recopilada y mejorada por [Dewalt-arch](https://github.com/Dewalt-arch "Dewalt-arch"). En realidad podríamos decir que simplifica nuestra vida para tener un sistema más completo y ahorrarnos dolores de cabeza a futuro.

Entre las mejoras que aporta:

- Agrega herramientas y *scripts* de ataque, entre ellos:
	- **ghidra** (Emsambla y decompila código / ingeniería inversa)
	- **bettercap** (Para sniffear y atacar redes)
	- **pymetasploit** (Agrega una interfaz python para Metasploit)
	- **volatility** (Herramienta para analisis forense de memoria RAM)
	- **repara impacket**, agrega una versión estable (Se utiliza para ataques de directorio activo de Windows)
	- Agrega funcionalidades adicionales a programas ya instalados
	- Incluye nuevos diccionarios de directorios y contraseñas
- Instala, actualiza y configura todo con una tecla.
- Agrega mejoras de personalización para el sistema.

#### Descarga

Primero, creamos una carpeta en el escritorio de nuestra máquina para mantener el orden. Podemos hacerlo mediante la línea de comandos:

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 13.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali13.1.png" data-lightbox="Paso 13.1">
    <img class="Paso 13.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali13.1-min.png" alt="Paso 13.1" />
  </a>
</div>

{% highlight bash %}

┌──(kali㉿kali)-[~]
└─$ cd /home/kali/Desktop #Con esto vamos a nuestro escritorio

┌──(kali㉿kali)-[~/Desktop]
└─$ mkdir pmk #Creamos una carpeta con el nombre que queramos

┌──(kali㉿kali)-[~/Desktop]
└─$ cd pmk #Nos posicionamos dentro de la carpeta

{% endhighlight %}

Ahora realizaremos la descarga del **Pimpmykali** dentro de la carpeta de la siguiente forma:

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 14.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali14.1.png" data-lightbox="Paso 14.1">
    <img class="Paso 14.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali14.1-min.png" alt="Paso 14.1" />
  </a>
</div>

Enlace del Repositorio: [https://github.com/Dewalt-arch/pimpmykali](https://github.com/Dewalt-arch/pimpmykali "De Dewalt-arch")

{% highlight bash %}

┌──(kali㉿kali)-[~/Desktop/pmk]
└─$ git clone https://github.com/Dewalt-arch/pimpmykali #El comando git clone permite descargar repositorios desde Github

{% endhighlight %}

#### Instalación

Ya con la descarga del **Pimpmykali** en nuestra máquina, debemos movernos dentro de la carpeta que acabamos de descargar para instalarlo:

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 15.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali15.1.png" data-lightbox="Paso 15.1">
    <img class="Paso 15.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali15.1-min.png" alt="Paso 15.1" />
  </a>
</div>

{% highlight bash %}

┌──(kali㉿kali)-[~/Desktop/pmk]
└─$ dir #Veremos el nombre de la carpeta que acabamos de descargar
pimpmykali

┌──(kali㉿kali)-[~/Desktop/pmk]
└─$ cd pimpmykali #Ingresamos a la carpeta

┌──(kali㉿kali)-[~/Desktop/pmk/pimpmykali]
└─$ ls #Nos permite ver los contenidos de la carpeta
changelog.txt fixed-http-shellshock.nse pimpmykali.sh README.md # Contenido

{% endhighlight %}

> Consideren que pueden realizar estos pasos de la manera que se quiera. Solo les ofrezco una alternativa ordenada para que mantengan su área de trabajo limpia y puedan ubicar su información más fácilmente.


Ejecutamos el archivo **pimpmykali.sh** de esta forma:

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 16.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali16.1.png" data-lightbox="Paso 16.1">
    <img class="Paso 16.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali16.1-min.png" alt="Paso 16.1" />
  </a>
</div>

{% highlight bash %}

┌──(kali㉿kali)-[~/Desktop/pmk/pimpmykali]
└─$ sudo ./pimpmykali #Con sudo corremos todo lo que instale el script con permisos de "root", utilizamos ./ para no agregar la palabra bash y aprovechamos que el archivo cuenta con permisos de ejecución.

{% endhighlight %}


Realizar esto nos abre el menú de **Pimp my Kali**:

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 17.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali17.1.png" data-lightbox="Paso 17.1">
    <img class="Paso 17.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali17.1-min.png" alt="Paso 17.1" />
  </a>
</div>

En el menú principal del *script* se muestran varias opciones que puedes utilizar en diferentes momentos. Es importante entender cada una para evitar realizar cambios innecesarios. Las opciones más utilizadas que ofrece este código son:

- **El 9** (Permite actualizar Kali mediante este script, basándose en el virtualizador que estés usando y añadiendo repositorios adicionales.)
- **El 0** (Va a aplicar las mejoras de los puntos 1 al 8 pero sin actualizar)

Para el efecto de este manual, vamos a utilizar la opción ***N*** que nos aplicará todas las mejoras descritas anteriormente y agrega repositorios para herramientas que ya estan instaladas.

> Todo el proceso puede tardar entre 15 minutos y 1 hora, dependiendo de la velocidad de tu internet.

Al terminar la instalación de todos los paquetes se nos muestra una imagen como la siguiente:

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 18.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali18.1.png" data-lightbox="Paso 18.1">
    <img class="Paso 18.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali18.1-min.png" alt="Paso 18.1" />
  </a>
</div>

#### Actualización

Para terminar el proceso no olvidemos actualizar todas las herramientas de las siguiente forma.

Podemos volver a ejecutar el *script* y dar en la opción 9:

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 18.2" href="{{ site.baseurl }}/assets/img/PasosKali/Kali18.2.png" data-lightbox="Paso 18.2">
    <img class="Paso 18.2" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali18.2-min.png" alt="Paso 18.2" />
  </a>
</div>

Pero también podemos recurrir a la forma convencional:

<div style="display: flex; justify-content: center; align-items: center; max-width: 80%; height: auto; margin: 0 auto;">
  <a class="Paso 19.1" href="{{ site.baseurl }}/assets/img/PasosKali/Kali19.1.png" data-lightbox="Paso 19.1">
    <img class="Paso 19.1" src="{{ site.baseurl }}/assets/img/PasosKali/miniaturas/Kali19.1-min.png" alt="Paso 19.1" />
  </a>
</div>

{% highlight bash %}

┌──(kali㉿kali)-[~/Desktop/pmk/pimpmykali]
└─$ sudo apt update #Verifica todos los repositorios y que estos contengan versiones actualizadas de nuestros programas

┌──(kali㉿kali)-[~/Desktop/pmk/pimpmykali]
└─$ sudo apt upgrade -y #Realiza la actualización de los programas que pueden actualizarse

┌──(kali㉿kali)-[~/Desktop/pmk/pimpmykali]
└─$ sudo apt autoremove #Esto eliminará todos los paquetes descargados para que no ocupen espacio en disco

{% endhighlight %}

> Es posible que el script de **pimpmykali** ya haya realizado este proceso, pero al hacerlo manualmente te aseguras de que todo esté actualizado correctamente y adicionalmente limpiar el disco.

> Nota adicional: Es probable que necesites desactivar el antivirus en el sistema principal, ya que algunos enlaces a repositorios pueden ser detectados como sospechosos. Esto ocurre porque no están incluidos en las listas de confianza para Kali Linux, lo que puede bloquear las descargas de los scripts o programas desde estos enlaces.

Así que con esto completaríamos nuestra instalación de **Kali Linux para Hackers**, espero que te haya ayudado mucho.

---

<script src="{{ site.baseurl }}/dist/js/lightbox-plus-jquery.min.js"></script>

Muchas gracias por leer este artículo. Por favor, deja tu comentario para saber qué te ha gustado y no olvides enviarme tus sugerencias para mejorar.

Utiliza estos enlaces para volver a arriba o salir de la publicación:

- [Volver al Inicio]({{ site.baseurl }}/Kali-Linux-para-Hackers/ "Regresar al inicio de este post")
- [Portada del blog]({{ site.baseurl }}/ "Ir a la pantalla principal")

