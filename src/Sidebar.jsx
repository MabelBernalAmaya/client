import { ROOMS } from './rooms';

export default function Sidebar({
  activeRoom,
  onSelectRoom,
  theme,
  onToggleTheme,
  username,
  avatar,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">CHAT_WS</span>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title="Cambiar tema"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="sidebar-me">
        <span className="sidebar-me-avatar">{avatar}</span>
        <span className="sidebar-me-name">{username}</span>
      </div>

      <div className="sidebar-rooms">
        <span className="sidebar-rooms-label">// salas</span>
        {ROOMS.map((r) => (
          <button
            key={r.id}
            className={`room-item ${activeRoom === r.id ? 'active' : ''}`}
            onClick={() => onSelectRoom(r.id)}
          >
            <span className="room-icon">{r.icon}</span>
            <span className="room-name">{r.name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
