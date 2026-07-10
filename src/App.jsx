import { useState, useEffect } from 'react';
import Chat from './Chat';
import Sidebar from './Sidebar';
import { ROOMS } from './rooms';
import './Chat.css';

export const AVATARS = ['🤖', '👾', '💀', '🧿', '⚡', '🔥', '🐍', '🎭'];

export default function App() {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [entered, setEntered] = useState(false);
  const [activeRoom, setActiveRoom] = useState(ROOMS[0].id);
  const [theme, setTheme] = useState(
    () => localStorage.getItem('chatws-theme') || 'dark'
  );

  // Aplica el tema al <html> (así las variables CSS cambian en toda la app)
  // y lo recuerda entre sesiones.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('chatws-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const handleEnter = () => {
    if (username.trim().length >= 2) setEntered(true);
  };

  if (entered) {
    return (
      <div className="app-shell">
        <Sidebar
          activeRoom={activeRoom}
          onSelectRoom={setActiveRoom}
          theme={theme}
          onToggleTheme={toggleTheme}
          username={username.trim()}
          avatar={avatar}
        />
        <Chat username={username.trim()} avatar={avatar} room={activeRoom} />
      </div>
    );
  }

  return (
    <div className="entry-screen">
      <div className="entry-scanlines" />
      <button
        type="button"
        className="theme-toggle entry-theme-toggle"
        onClick={toggleTheme}
        title="Cambiar tema"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="entry-card">
        <div className="entry-badge">// ACCESO_TERMINAL</div>
        <h2 className="entry-title" data-text="CHAT_WS">CHAT_WS</h2>
        <p className="entry-sub">Identifícate para conectarte a la red</p>

        <input
          type="text"
          placeholder="nombre_de_usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
          autoFocus
          className="entry-input"
        />

        <div className="avatar-picker">
          <span className="avatar-picker-label">Elige tu avatar</span>
          <div className="avatar-grid">
            {AVATARS.map((a) => (
              <button
                type="button"
                key={a}
                className={`avatar-option ${avatar === a ? 'selected' : ''}`}
                onClick={() => setAvatar(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <button
          className="entry-btn"
          onClick={handleEnter}
          disabled={username.trim().length < 2}
        >
          CONECTAR →
        </button>
      </div>
    </div>
  );
}
