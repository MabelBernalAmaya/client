# client

Frontend del chat en tiempo real. React + Vite, conectado al backend por WebSocket.

## Stack

- React
- Vite

## Estructura

```
client/
├── package.json
├── index.html
└── src/
    ├── main.jsx           # Punto de entrada, monta <App />
    ├── App.jsx             # Pantalla de "Entrar al chat" (pide username) -> renderiza <Chat />
    ├── Chat.jsx            # UI del chat: header, mensajes, input
    ├── Chat.css            # Estilos del chat
    ├── useWebSocket.js     # Hook que maneja la conexión WS, mensajes y estado de conexión
    └── index.css           # Reset mínimo de estilos
```

## Qué se configuró

- `useWebSocket.js`: se conecta a `ws://localhost:8080/chat`, escucha mensajes (`message` y `system`), expone `sendMessage(username, text)`
- `App.jsx`: pide un nombre de usuario (mínimo 2 caracteres) antes de entrar al chat
- `Chat.jsx`: muestra estado de conexión (punto verde/rojo), contador de usuarios conectados, y los mensajes en burbujas (propios vs. de otros)
- `index.css`: se reemplazó el CSS default de Vite por un reset simple para no chocar con los estilos del chat

## Cómo correrlo

```
npm install
npm run dev
```

Levanta en `http://localhost:5173`. Necesita el `ws-server` corriendo aparte (puerto 8080) para que el chat funcione.
