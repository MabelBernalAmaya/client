# chat-ws — Proyecto de chat en tiempo real

Este proyecto es un chat en tiempo real hecho con **React** en el frontend y **Spring Boot** en el backend, usando **WebSockets** (por eso el mensaje llega al instante, sin recargar la página). Después se le agregó un stack de **observabilidad** para poder ver métricas, trazas y logs de la app con Grafana, Zipkin y Kibana.

Este repo es el **frontend** (`client`). El backend está en el repo [`ws-server`](../ws-server).

## Qué se hizo

Primero se armó el chat básico (mandar y recibir mensajes en tiempo real) y después se le fueron agregando features:

- Varias salas de chat, tipo WhatsApp, en una barra lateral (`RED_GENERAL`, `OFF_TOPIC`, `CODE_TALK`).
- Avatares con emoji para no tener que subir foto real.
- Se pueden mandar imágenes en el chat (se comprimen antes de enviarse para que no pesen tanto).
- Doble check (✓✓) cuando el mensaje ya llegó, como en WhatsApp.
- Modo claro y oscuro, con la preferencia guardada para la próxima vez que se entra.
- Se le dio una estética cyberpunk a toda la interfaz (título con efecto glitch, tipografías `Orbitron` y `Share Tech Mono`).

Como parte extra de observabilidad, se conectó el backend con:

- **Grafana** para ver métricas (cuántos mensajes se mandan, cuántas sesiones activas hay).
- **Zipkin** para ver las trazas de cada mensaje (cuánto tarda en procesarse).
- **Kibana** para ver los logs del backend de forma estructurada y buscable.

## Stack usado

**Frontend (este repo)**
- React
- Vite

**Backend ([`ws-server`](../ws-server))**
- Java 21 + Spring Boot 4.1.0
- WebSockets nativos de Spring (no se usó STOMP)

**Observabilidad (corre en Docker)**
- Prometheus + Grafana
- Zipkin
- Elasticsearch + Logstash + Kibana

## Estructura del frontend

```
client/
├── package.json
├── index.html
└── src/
    ├── main.jsx           # Punto de entrada, monta <App />
    ├── App.jsx            # Pantalla de entrada (nombre + avatar) -> renderiza <Sidebar /> + <Chat />
    ├── Sidebar.jsx        # Barra lateral: salas, usuario actual, botón de tema
    ├── Chat.jsx           # UI del chat: mensajes, envío de texto/imágenes, checks
    ├── Chat.css           # Estilos (tema claro/oscuro, efectos cyberpunk)
    ├── rooms.js           # Lista de salas disponibles
    ├── resizeImage.js     # Comprime las imágenes antes de mandarlas
    ├── useWebSocket.js    # Hook que maneja la conexión WebSocket
    └── index.css          # Reset mínimo de estilos
```

## Cómo se implementó cada parte

- **`useWebSocket.js`**: se conecta a `ws://localhost:8080/chat/{sala}`. Cuando se cambia de sala, se desconecta y se vuelve a conectar a la nueva. También reconoce cuándo un mensaje propio ya fue confirmado por el servidor, para cambiar el check de ✓ a ✓✓.
- **`App.jsx`**: acá está la pantalla de entrada donde se elige nombre y avatar, y el tema (claro/oscuro), que se guarda en el navegador.
- **`Sidebar.jsx`**: muestra las salas y el usuario actual, con el botón para cambiar de tema.
- **`Chat.jsx`**: dibuja los mensajes en burbujas (distintas si son propios o de otro usuario), muestra las imágenes enviadas y los checks de entrega.
- **`resizeImage.js`**: antes de mandar una imagen, se redimensiona con un canvas de HTML, así no se envía el archivo original pesado.

## Cómo correrlo

**1. Backend** (repo `ws-server`):
```
mvn spring-boot:run
```

**2. Observabilidad** (opcional, repo `ws-server`):
```
cd observability
docker compose up -d
```

**3. Frontend** (este repo):
```
npm install
npm run dev
```
Se abre en `http://localhost:5173`.

## Capturas

Las imágenes van en una carpeta `screenshots/` en la raíz de este repo, con estos nombres (se pueden cambiar, ajustando el link de abajo de cada una).

### Capturas del chat

**Pantalla de entrada** (nombre y avatar):

![Entrada](screenshots/entrada.png)

**Chat en modo oscuro:**

![Chat oscuro](screenshots/chat-oscuro.png)

**Chat en modo claro:**

![Chat claro](screenshots/chat-claro.png)

**Envío de una imagen:**

![Subida de imagen](screenshots/subir-imagen.png)

### Capturas de la observabilidad

**Docker Desktop** con los contenedores corriendo:

![Docker Desktop](screenshots/docker-desktop.png)

**Grafana** — mensajes enviados en total:

![Grafana mensajes totales](screenshots/grafana-mensajes-total.png)

**Grafana** — mensajes por segundo:

![Grafana mensajes por segundo](screenshots/grafana-mensajes-segundo.png)

**Grafana** — sesiones activas:

![Grafana sesiones activas](screenshots/grafana-sesiones.png)

**Zipkin** — lista de trazas:

![Zipkin lista](screenshots/zipkin-lista.png)

**Zipkin** — detalle de una traza:

![Zipkin detalle](screenshots/zipkin-detalle.png)

**Kibana** — logs del backend:

![Kibana](screenshots/kibana-discover.png)
