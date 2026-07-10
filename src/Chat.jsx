import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import { resizeImage } from './resizeImage';
import './Chat.css';

// ── Chulitos estilo WhatsApp ──
// 'sent'      → 1 check (mandado, esperando confirmación del server)
// 'delivered' → 2 checks (el server ya lo re-transmitió a todos)
function Ticks({ status }) {
  if (status === 'delivered') {
    return <span className="ticks ticks-delivered">✓✓</span>;
  }
  if (status === 'sent') {
    return <span className="ticks ticks-sent">✓</span>;
  }
  return null;
}

export default function Chat({ username, avatar, room }) {
  const { messages, connected, userCount, sendMessage } = useWebSocket(username, avatar, room);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePickImage = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // para poder elegir la misma imagen otra vez después
    if (!file || !file.type.startsWith('image/')) return;

    try {
      const dataUrl = await resizeImage(file);
      sendMessage(input.trim(), dataUrl);
      setInput('');
    } catch (err) {
      console.error('No se pudo procesar la imagen:', err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-scanlines" />

      {/* ── Barra superior ── */}
      <header className="chat-header">
        <div className="header-left">
          <span className={`status-dot ${connected ? 'online' : 'offline'}`} />
          <h1>CHAT_WS</h1>
        </div>
        <div className="header-right">
          <span className="user-count">◈ {userCount}</span>
          <span className="username-badge">
            <span className="username-avatar">{avatar}</span>
            {username}
          </span>
        </div>
      </header>

      {/* ── Lista de mensajes ── */}
      <main className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.type === 'system' ? 'system' :
              msg.username === username ? 'mine' : 'theirs'
            }`}
          >
            {msg.type !== 'system' && msg.username !== username && (
              <span className="msg-avatar">{msg.avatar}</span>
            )}
            <div className="msg-body">
              {msg.type !== 'system' && (
                <div className="msg-meta">
                  <span className="msg-author">{msg.username}</span>
                  <span className="msg-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              )}
              <div className="msg-bubble">
                {msg.imageData && (
                  <img src={msg.imageData} alt="imagen enviada" className="msg-image" />
                )}
                {msg.text && <span className="msg-text">{msg.text}</span>}
                {msg.type !== 'system' && msg.username === username && (
                  <Ticks status={msg.status} />
                )}
              </div>
            </div>
            {msg.type !== 'system' && msg.username === username && (
              <span className="msg-avatar">{msg.avatar}</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {/* ── Input ── */}
      <footer className="chat-footer">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
        />
        <button
          type="button"
          className="attach-btn"
          onClick={handlePickImage}
          disabled={!connected}
          title="Enviar imagen"
        >
          📎
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="> escribe un mensaje..."
          disabled={!connected}
        />
        <button
          onClick={handleSend}
          disabled={!connected || !input.trim()}
        >
          ENVIAR
        </button>
      </footer>

    </div>
  );
}
