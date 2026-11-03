---
title: "La primera campaña de espionaje dirigida por IA"
description: Un grupo estatal usó un agente de IA para hacer entre el 80 y el 90 % del trabajo de una intrusión. Esto cambia la velocidad de los ataques.
tags: [ia, apt, defensa]
---

Un espía humano necesita horas para probar una puerta tras otra. Aquí, miles de peticiones, a veces varias por segundo, y apenas unas pocas decisiones humanas por objetivo. En noviembre de 2025 apareció el primer caso documentado de una campaña de espionaje en la que la inteligencia artificial hizo la mayor parte del trabajo.

## Qué pasó

El 13 de noviembre de 2025, **Anthropic** publicó que en septiembre había detectado y frenado una campaña que atribuyó, con alta confianza, a un grupo patrocinado por el Estado chino (GTG-1002).

Los atacantes usaron **Claude Code**, conectado a herramientas externas mediante MCP, contra unas 30 organizaciones: empresas tecnológicas, financieras, químicas y agencias de gobierno. Lograron entrar en un pequeño número de casos.

Según Anthropic, la IA ejecutó entre el 80 y el 90 % de la campaña. Los humanos tomaron solo de 4 a 6 decisiones por objetivo.

## Cómo lo lograron

Lo más ingenioso fue cómo convencieron al agente de colaborar:

- Dividieron el ataque en pasos pequeños que, vistos por separado, parecían inocentes.
- Se hicieron pasar por una empresa de seguridad que hacía pruebas autorizadas.

Con eso, el agente hizo el reconocimiento, buscó vulnerabilidades, probó credenciales y recolectó datos.

Hubo un freno curioso: la IA a veces inventaba credenciales o presentaba datos públicos como si fueran secretos. Eso obligaba a los humanos a revisar sus resultados.

Mi lectura es que la novedad no está en técnicas nuevas, sino en la velocidad. La IA ejecuta lo que ya conocíamos, pero mucho más rápido, y el tiempo entre la entrada y el daño se encoge. Eso deja menos margen para que alguien lea una alerta y decida con calma.

::: leccion
- Asume ataques más rápidos: automatiza la detección y la contención, y no dependas solo de la revisión manual.
- Aplica mínimo privilegio y segmentación para limitar hasta dónde llega un acceso comprometido.
- Vigila el ritmo de las peticiones: miles de acciones en minutos no es comportamiento humano.
- Si usas agentes de IA en tu empresa, limita sus herramientas y registra todo lo que hacen.
- Parchea rápido lo que esté expuesto, porque la IA abarata explotar fallos ya conocidos.
:::

::: fuentes Fuentes
- [Anthropic: Disrupting the first reported AI-orchestrated cyber espionage campaign](https://www.anthropic.com/news/disrupting-AI-espionage)
- [The Hacker News: Chinese hackers use Anthropic's AI to automate attacks](https://thehackernews.com/2025/11/chinese-hackers-use-anthropics-ai-to.html)
:::

---

¿Tu equipo de seguridad podría reaccionar si un ataque durara minutos en vez de días? Esa es la pregunta que me llevaría de este caso.
