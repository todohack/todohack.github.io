---
title: "Trivy envenenado: tu escáner de seguridad robaba secretos"
description: La herramienta que revisaba vulnerabilidades en miles de pipelines fue convertida en un ladrón de credenciales. Todo por una limpieza incompleta.
tags: [supply-chain, cicd, devsecops]
---

Contratas a un vigilante para cuidar la bodega y resulta que es él quien se lleva las llaves. Algo parecido pasó en marzo de 2026 con **Trivy**, uno de los escáneres de vulnerabilidades más usados del mundo: se convirtió en la herramienta que robaba los secretos de los pipelines que debía proteger.

## Qué pasó

El 19 de marzo de 2026, un actor conocido como TeamPCP publicó la versión maliciosa `v0.69.4` de Trivy, de Aqua Security. Además:

- Reescribió 75 de las 76 etiquetas de la GitHub Action `trivy-action`.
- Reescribió 7 etiquetas de `setup-trivy`.
- El 22 de marzo aparecieron imágenes maliciosas `0.69.5` y `0.69.6` en Docker Hub.

El 23 de marzo, Wiz reportó además un compromiso paralelo de otra GitHub Action de seguridad, `kics-github-action`.

## Cómo lo hicieron

Para mí, este es el dato clave: según Wiz, los atacantes conservaban acceso de un incidente anterior que no se contuvo por completo. Con una cuenta de servicio comprometida (`aqua-bot`) y *commits* que suplantaban a usuarios legítimos, publicaron el código malicioso. Una limpieza a medias fue la puerta.

Una vez dentro de un pipeline, el malware:

1. Leía secretos directamente de la memoria del *runner* de GitHub Actions (la máquina que ejecuta tus tareas automáticas).
2. Robaba claves SSH, credenciales de AWS, GCP y Azure, y tokens de Kubernetes.
3. Lo cifraba todo y lo enviaba a un dominio falso que imitaba al de Aqua.

Piensa en esto: si tu workflow dice `uses: aquasecurity/trivy-action@v1`, estás confiando en una etiqueta, y las etiquetas se pueden mover. Un hash SHA, no.

## Qué haría hoy

::: leccion
- Fija tus GitHub Actions a un hash SHA completo, nunca a etiquetas de versión.
- Si ejecutaste las versiones afectadas entre el 19 y el 20 de marzo, trata ese pipeline como comprometido y rota todos los secretos.
- Tras un incidente, rota todas las credenciales, no solo algunas. La limpieza a medias fue la puerta de este ataque.
- Usa credenciales efímeras (OIDC) en CI y limita a dónde pueden conectarse tus runners.
- Busca en tu organización repositorios llamados `tpcp-docs`, uno de los indicadores del ataque.
:::

::: fuentes Fuentes
- [Wiz: Trivy compromised in TeamPCP supply chain attack](https://www.wiz.io/blog/trivy-compromised-teampcp-supply-chain-attack)
:::

---

Abre hoy uno de tus workflows y cuenta cuántas Actions siguen fijadas por etiqueta en lugar de por hash. El número suele sorprender.
