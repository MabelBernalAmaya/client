import { useState, useEffect, useRef, useCallback } from 'react';

const WS_BASE = 'ws://localhost:8080/chat';

export function useWebSocket(username, avatar, room) {
  // Estado principal
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);

  // useRef para acceder al socket sin re-renders
  const wsRef = useRef(null);

  useEffect(() => {
    // Cada sala es una conexión nueva — no hay historial entre salas
    setMessages([]);
    setConnected(false);

    // Crear la conexión WebSocket a la sala actual
    const ws = new WebSocket(`${WS_BASE}/${room}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`✅ Conectado a la sala "${room}"`);
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === 'system') {
        // Actualizar contador de usuarios de ESTA sala
        setUserCount(msg.count);
        // Agregar como mensaje de sistema en el chat
        setMessages((prev) => [...prev, { ...msg, id: crypto.randomUUID() }]);
        return;
      }

      if (msg.type === 'message') {
        setMessages((prev) => {
          // ¿Es el eco de un mensaje que YO mandé? (mismo clientId)
          // Si sí, lo actualizamos a "delivered" (2 chulitos) en vez de duplicarlo.
          const idx = prev.findIndex(
            (m) => m.clientId && m.clientId === msg.clientId
          );
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], ...msg, status: 'delivered' };
            return updated;
          }
          // Mensaje de otro usuario: se agrega directo, ya "entregado"
          return [...prev, { ...msg, id: crypto.randomUUID(), status: 'delivered' }];
        });
      }
    };

    ws.onclose = () => {
      console.log('❌ Desconectado del servidor WS');
      setConnected(false);
    };

    ws.onerror = (e) => console.error('WS Error:', e);

    // Cleanup: cerrar socket al desmontar o al cambiar de sala
    return () => ws.close();
  }, [room]); // se reconecta cada vez que cambia la sala

  // Función para enviar mensajes al servidor (texto y/o imagen)
  const sendMessage = useCallback((text, imageData = null) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;
    if (!text && !imageData) return;

    const clientId = crypto.randomUUID();

    // Optimistic UI: mostramos el mensaje de inmediato, con 1 solo chulito ("enviado")
    setMessages((prev) => [
      ...prev,
      {
        id: clientId,
        clientId,
        type: 'message',
        username,
        avatar,
        text,
        imageData,
        timestamp: new Date().toISOString(),
        status: 'sent',
      },
    ]);

    wsRef.current.send(JSON.stringify({ clientId, username, avatar, text, imageData }));
  }, [username, avatar]);

  return { messages, connected, userCount, sendMessage };
}
