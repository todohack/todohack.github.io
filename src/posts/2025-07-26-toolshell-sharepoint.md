---
title: "ToolShell: el cero-día de SharePoint que acabó en ransomware"
description: Una cadena de vulnerabilidades en SharePoint local permitió robar las llaves criptográficas del servidor. Parchear no bastaba.
tags: [vulnerabilidades, ransomware, apt]
---

Instalas el parche, el servidor queda actualizado y aun así el atacante sigue dentro. Eso fue lo que hizo tan incómodo el caso **ToolShell** en julio de 2025: una cadena de fallos en **SharePoint Server local** que se explotó de forma masiva antes de que existiera un parche completo.

## Qué pasó

Microsoft confirmó que desde al menos el 7 de julio de 2025 se estaban explotando servidores SharePoint *on-premise*, es decir, instalados en la propia empresa (SharePoint Online no estaba afectado). Las vulnerabilidades eran `CVE-2025-49704` y `CVE-2025-49706`, y sus variantes `CVE-2025-53770` y `CVE-2025-53771`.

Microsoft atribuyó la actividad a dos grupos chinos, Linen Typhoon y Violet Typhoon, y a un tercero, Storm-2603, que desde el 18 de julio usó el acceso para desplegar el ransomware Warlock. CISA añadió `CVE-2025-53770` a su catálogo de vulnerabilidades explotadas (KEV).

## Cómo lo hicieron

1. Una petición `POST` al endpoint *ToolPane* permitía ejecutar código sin autenticación.
2. Subían una *web shell*, un pequeño archivo que da control remoto del servidor, llamada `spinstall0.aspx`.
3. Con ella robaban las MachineKeys de ASP.NET, las llaves que firman las sesiones del servidor.
4. Después desactivaban Defender, volcaban credenciales de LSASS (la zona de memoria de Windows donde viven las contraseñas en uso) con Mimikatz y se movían por la red con PsExec e Impacket.

> Aquí está la clave: con las MachineKeys robadas, el atacante puede seguir entrando aunque instales el parche. Por eso la recomendación fue parchear y además rotar las llaves.

Esto me preocupa porque cambia lo que significa "estar al día". Parchear es cerrar la puerta, pero si el ladrón ya copió la llave, cerrar con más fuerza no sirve de nada. Para saber si te tocó, hay que asumir que pudo haber pasado y cambiar los secretos.

::: leccion
- No expongas servidores locales a internet si no es necesario; ponlos detrás de VPN o de un proxy autenticado.
- Tras una explotación, parchea y rota los secretos: el parche cierra la puerta, pero no expulsa a quien ya copió las llaves.
- Activa AMSI y un EDR, y busca indicadores como `spinstall0.aspx` o procesos hijos raros de `w3wp.exe`.
- Habilita LSA Protection y Credential Guard para frenar el robo de credenciales.
- Sigue el catálogo KEV de CISA: es la lista de lo que se está explotando ahora mismo.
:::

::: fuentes Fuentes
- [Microsoft Security: Disrupting active exploitation of on-premises SharePoint vulnerabilities](https://www.microsoft.com/en-us/security/blog/2025/07/22/disrupting-active-exploitation-of-on-premises-sharepoint-vulnerabilities/)
- [Wiz: SharePoint CVE-2025-53770 and CVE-2025-53771](https://www.wiz.io/blog/sharepoint-vulnerabilities-cve-2025-53770-cve-2025-53771-everything-you-need-to-know)
:::

---

Si en tu empresa hay un SharePoint local, revisa hoy si es accesible desde internet. Si lo es, pregúntate por qué.
