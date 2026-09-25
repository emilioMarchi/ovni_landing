# Plan Maestro y Documentación de Desarrollo Frontend: Landing Page OVNISTUDIO

Este documento sirve como la guía técnica, arquitectura frontend y plan de ejecución por fases para el desarrollo exclusivo del **FRONTEND** de la landing page interactiva de **OVNISTUDIO**. Está diseñado modularmente para que diferentes agentes o desarrolladores puedan ejecutar cada etapa de manera independiente y coordinada.

> **Nota:** El desarrollo del servidor/backend del orquestador de agentes (STT-LLM-TTS) se realiza en un repositorio/proyecto aparte. Este plan abarca 100% la interfaz de usuario, captura de audio, animaciones, lógica de interacción y la capa cliente de comunicación WebSocket/API.

---

## 1. Visión del Proyecto y Concepto

**OVNISTUDIO** es un estudio de desarrollo de software especializado en sistemas cognitivos artificiales, automatización de flujos de trabajo, bases de conocimiento semánticas y sitios web interactivos con agentes autónomos integrados e IA local.

### Concepto UX/UI de la Landing Page
La landing page es una **interfaz de usuario fluida e interactiva** a pantalla completa con navegación por saltos (*snap scroll*) y una **barra de navegación flotante viva (Voz / Chat)** que permite al usuario interactuar en tiempo real con un agente conversacional mediante un cliente de audio y chat integrado.

---

## 2. Especificaciones de Diseño y Sistema de Estilos

### Paleta de Colores (Opacos / Muted)
- **Celeste Opaco (Accent Primary):** `#7BB4CA` / `hsl(197, 43%, 63%)`
- **Amarillo Opaco (Highlight / Action):** `#E5C158` / `hsl(44, 73%, 62%)`
- **Gris Oscuro Base (Background & Surface):** `#16191D` (Fondo principal), `#1E2229` (Tarjetas/Barra flotante), `#282C34` (Bordes)
- **Texto / Contraste:** `#E1E4E8` (Texto principal), `#9DA5B4` (Texto secundario)

### Tipografía
- **Titulares Principales (Primary Headings):** `Unica One` (Google Font)
- **Acentos / Títulos Especiales (Secondary Accent):** `Megrim` (Google Font)
- **Cuerpo y Lectura (Body Text):** `Inter` o `Space Grotesk` (Google Font complementaria ultra legible)

### Identidad Visual
- **Logo e Ícono del Sitio:** Se utilizará la imagen `logo.png` ubicada en la raíz del proyecto (`file:///D:/Emi/OVNI/landing/logo.png`).

---

## 3. Arquitectura del Frontend y Flujo Cliente

```
  +-----------------------------------------------------------------------------------+
  |                                 FRONTEND (CLIENTE)                                |
  |                                                                                   |
  |  +---------------------+   +--------------------------+   +--------------------+  |
  |  |   Secciones Snap    |   |  Barra Nav Flotante      |   |  Web Audio + VAD   |  |
  |  |  (Hero/Video/Form)  |   |  (Voz / Chat Toggle)     |   |  (Recorder Queue)  |  |
  |  +---------------------+   +--------------------------+   +--------------------+  |
  |                                         |                                         |
  |                                         v                                         |
  |                    +------------------------------------------+                   |
  |                    | Servicio Cliente WebSocket / REST API    |                   |
  |                    | (Audio Chunk Streamer & Text Handler)    |                   |
  |                    +------------------------------------------+                   |
  +-----------------------------------------|-----------------------------------------+
                                            | (Endpoint Configurable en .env)
                                            v
                               [ Servidor Backend Externo ]
                                (STT -> LLM Agente -> TTS)
```

---

## 4. Plan de Desarrollo Frontend por Fases (Guía para Agentes)

Cada fase contiene un **Prompt de Inicialización para el Agente**, la lista de tareas específicas y los criterios de aceptación.

---

### Fase 1: Configuración del Proyecto y Sistema de Diseño Base
> **Estado:** `[x] Completado`

#### Prompt para Agente en Fase 1:
```text
Actúa como Frontend Setup Engineer. Inicializa la aplicación Next.js (App Router) con TypeScript y Tailwind CSS en este directorio. Configura las fuentes Google Fonts (Unica One, Megrim, Inter), el tema de colores opacos (celeste #7BB4CA, amarillo #E5C158, gris oscuro #16191D) y prepara la estructura de archivos modular para la landing page de OVNISTUDIO.
```

#### Tareas:
- [x] Inicializar proyecto Next.js (App Router) + TypeScript + Tailwind CSS.
- [x] Importar tipografías Google Fonts (`Unica One`, `Megrim`, `Inter`) usando `next/font/google`.
- [x] Configurar variables de Tailwind con los colores del sistema (`celeste-muted`, `amarillo-muted`, `gris-oscuro`).
- [x] Incorporar `logo.png` en `public/logo.png` y usarlo como logo e ícono principal del sitio.
- [x] Configurar componentes base de UI (Botones, Contenedores, Badges).

#### Criterios de Aceptación:
- El servidor de desarrollo Next.js (`npm run dev`) compila sin errores.
- Los estilos, colores y tipografías se aplican correctamente.

---

### Fase 2: Estructura de Secciones y Navegación Snap-Scroll
> **Estado:** `[x] Completado`

#### Prompt para Agente en Fase 2:
```text
Actúa como UI/UX Engineer. Implementa el layout principal de 3 secciones a pantalla completa con navegación por saltos (Snap Scroll) y la barra de navegación flotante básica (adaptativa: bottom en mobile, top en desktop) según las especificaciones de BLUPRINT-LANDING.MD.
```

#### Tareas:
- [ ] Crear contenedor principal con CSS Scroll Snap (`scroll-snap-type: y mandatory`).
- [ ] **Sección 1 (Hero):** 
  - Título principal: *"Te convenzo en 3 pasos de que la IA local y los sistemas privados pueden ser los aliados de tu proyecto."*
  - Título secundario: *"Apretá conversar y entendé lo que te digo."*
- [ ] **Sección 2 (Explicativa):** Reproductor de video + resumen de concepto de OVNISTUDIO.
- [ ] **Sección 3 (Contacto):** Invitación a contactar, área para desplegar formulario o interactuar por agente.
- [ ] **Barra de Navegación Flotante:**
  - En móviles: Fija en la parte inferior de la pantalla.
  - En desktop: Fija en la parte superior de la pantalla.
  - Enlaces de salto directo a cada sección.

#### Criterios de Aceptación:
- El scroll cambia suavemente de sección en sección con comportamiento de salto exacto (snap).
- La barra de navegación cambia de posición según el breakpoint responsive.

---

### Fase 3: Módulo Frontend de Captura de Audio, VAD y Cola de Envíos
> **Estado:** `[x] Completado`

#### Prompt para Agente en Fase 3:
```text
Actúa como Web Audio Systems Engineer. Desarrolla el módulo de captura de micrófono en el navegador usando Web Audio API y VAD (Voice Activity Detection). Implementa la lógica de grabación en loop, detección de pausas de voz (silencio de X segundos) y encolado de bloques de audio (audioQueue).
```

#### Tareas:
- [x] Crear hook `useAudioRecorder` con Web Audio API / MediaRecorder.
- [x] Algoritmo VAD (Voice Activity Detection):
  - Detectar inicio del habla para iniciar captura.
  - Detectar silencio/pausa (threshold configurable, ej: 1.2s).
  - Al detectar la pausa, empaquetar el Blob de audio en formato WebM/WAV.
- [x] Crear cola de almacenamiento temporal `audioQueue` lista para ser consumida por el cliente WebSocket/API.
- [x] Manejo de permisos de micrófono con mensajes de estado y manejo de errores.

#### Criterios de Aceptación:
- El micrófono graba automáticamente al detectar voz y se detiene en pausas.
- Los bloques de audio se agregan ordenadamente a la cola `audioQueue`.

---

### Fase 4: Cliente WebSocket / API para Comunicación con Servidor de Agentes
> **Estado:** `[x] Completado`

#### Prompt para Agente en Fase 4:
```text
Actúa como Frontend Integration Engineer. Implementa el servicio cliente (useAgentSocket / AgentApiClient) que gestiona la conexión bidireccional con el servidor backend del orquestador de agentes. Incluye soporte para variables de entorno (VITE_AGENT_SERVER_URL / NEXT_PUBLIC_AGENT_SERVER_URL) y un Mock Server integrado para desarrollo local independiente.
```

#### Tareas:
- [x] Implementar cliente WebSocket para envío en streaming de chunks de audio y mensajes de chat.
- [x] Recepción de eventos desde el servidor: streaming de texto del agente, eventos de audio de respuesta y estados.
- [x] Crear un controlador de reproducción de audio para reproducir las respuestas en voz del agente.
- [x] Crear un servidor Mock local (en memoria) para simular respuestas del backend sin necesidad de tener el servidor real corriendo durante el desarrollo frontend.

#### Criterios de Aceptación:
- La capa cliente maneja correctamente eventos de envío/recepción por WebSocket.
- El modo Mock permite probar el flujo completo de conversación voz/chat en desarrollo.

---

### Fase 5: Componente UI de la Barra Flotante (Voz / Chat & Animaciones UI)
> **Estado:** `[x] Completado`

#### Prompt para Agente en Fase 5:
```text
Actúa como Creative Frontend Developer. Integra el controlador de audio y chat dentro de la Barra de Navegación Flotante. Diseña e implementa las transiciones visuales del botón conversacional: Idle -> Escuchando (Círculo animado en movimiento) -> Agente Respondiendo (Onda de audio moderna y minimalista) -> Modo Chat.
```

#### Tareas:
- [x] Botón de inicio de conversación en la barra flotante.
- [x] Transición a **Estado Escuchando**: El botón muta a un ícono circular con animación suave que indica escucha activa del micrófono.
- [x] Transición a **Estado Hablando (Agente)**: La barra se expande ligeramente y muestra una **onda de audio estético y minimalista** que reacciona a la reproducción de voz del agente.
- [x] Botón de alternancia **Voz <-> Chat**: Permite desplegar el panel o ventana flotante de chat escrito.
- [x] Integración directa con los estados del `useAudioRecorder` y `useAgentSocket`.

#### Criterios de Aceptación:
- Transiciones visuales fluidas y modernas.
- La onda de audio encaja armónicamente en el diseño minimalista de la barra.
- Conmutación perfecta entre modo audio y modo chat escrito.

---

### Fase 6: Sección 3 - Interfaz de Captura de Leads (Formulario y Chat Dual)
> **Estado:** `[x] Completado`

#### Prompt para Agente en Fase 6:
```text
Actúa como Frontend UX Engineer. Implementa la lógica de la Sección 3 para la captura de datos del usuario. Diseña el formulario de contacto desplegable y la interfaz de invitación a conversar con el agente. Asegura que ambos medios envíen la información a la capa cliente del agente.
```

#### Tareas:
- [x] Diseñar la Sección 3 con los botones de acción: *"Hablar con el Agente"* o *"Completar Formulario"*.
- [x] Componente de formulario desplegable (Nombre, Email, Empresa/Proyecto, Consulta).
- [x] Conexión dual de captura:
  - Al enviar el formulario, los datos se emiten como evento al cliente del agente para procesar la consulta y mostrar/reproducir la confirmación.
  - Al conversar vía voz/chat, la interfaz refleja el estado de la captura.

#### Criterios de Aceptación:
- El formulario se despliega y valida los campos correctamente.
- La información se envía hacia el servicio del agente y se muestra retroalimentación en pantalla.

---

### Fase 7: Testing Frontend, Rendimiento y Despliegue Estático
> **Estado:** `[x] Completado`

#### Prompt para Agente en Fase 7:
```text
Actúa como Frontend QA & Performance Specialist. Realiza pruebas de usabilidad responsive en dispositivos móviles, auditoría de rendimiento (Lighthouse), verificación de permisos de micrófono bajo HTTPS y prepara los scripts de build y despliegue estático (Vercel / Netlify / Nginx).
```

#### Tareas:
- [x] Pruebas de usabilidad y alcance táctil en móviles (barra flotante inferior).
- [x] Auditoría de rendimiento UI y optimización de bundle (Vite/Next build).
- [x] Manejo de excepciones de cliente (micrófono bloqueado, socket desconectado, reintentos).
- [x] Configuración para despliegue estático y definición del archivo de variables de entorno `.env.example`.

#### Criterios de Aceptación:
- Puntuación excelente en Lighthouse y 100% funcional en dispositivos móviles.
- Build estático generado sin advertencias ni errores.

---

## 5. Bitácora de Registro y Control de Cambios (Agent Handover Log)

Los agentes o desarrolladores deben actualizar esta tabla al iniciar y finalizar cada turno de trabajo.

| Fecha | Agente / Dev | Fase Trabajada | Estado Final | Notas / Cambios Realizados |
| :--- | :--- | :--- | :--- | :--- |
| 24/09/2026 | Antigravity | Fase 0 (Planificación) | `Completado` | Creación del plan de desarrollo frontend y arquitectura. |
| 24/09/2026 | Antigravity | Fase 1 (Setup & Diseño) | `Completado` | Setup Next.js App Router, Tailwind 4, Google Fonts, logo e íconos lucide. |
| 24/09/2026 | Antigravity | Fase 2 (Snap Scroll & Nav) | `Completado` | Snap scroll con h-dvh, NavBar flotante adaptativa, HeroSection, ExplicacionSection, ContactoSection. |
| 24/09/2026 | Antigravity | Fase 3 (Audio VAD & Queue) | `Completado` | Módulo VAD con AnalyserNode, AudioQueueManager y hook useAudioRecorder. |
| 24/09/2026 | Antigravity | Fase 4 (Cliente Socket & Mock) | `Completado` | AgentClient WebSocket, MockAgentServer con STT/TTS sintético y hook useAgentSocket. |
| 24/09/2026 | Antigravity | Fase 5 (UI Voz/Chat & Onda) | `Completado` | AudioWaveform, ChatModal, integración total en NavBar flotante y CTA Hero. |
| 24/09/2026 | Antigravity | Fase 6 (Captura Dual Leads) | `Completado` | Integración de formulario y modal de chat con el cliente del agente en Sección 3. |
| 24/09/2026 | Antigravity | Fase 7 (QA & Build) | `Completado` | Verificación de build de producción (npm run build limpia) y .env.example. |

---

> **Nota para los siguientes agentes:** 
> Para trabajar en cualquier fase, lee este plan, ubica la fase correspondiente con estado `[ ] Pendiente`, copia el **Prompt para Agente** de la fase y ejecuta las tareas secuencialmente. Al finalizar, actualiza el estado a `[x] Completado` en este documento y añade una entrada en la Bitácora de Registro.
