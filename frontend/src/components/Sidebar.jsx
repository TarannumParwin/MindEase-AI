function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onLogout,
  theme,
  onToggleTheme,
  onOpenSettings,
})  {
  return (
    <aside className="sidebar">

      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">🧠</div>

        <div>
          <h2>MindEase</h2>
          <span>AI Wellness</span>
        </div>
      </div>

      {/* New Chat */}
      <button
        className="new-chat-button"
        onClick={onNewChat}
      >
        <span>＋</span>
        New chat
      </button>

      {/* Chat History */}
      <div className="history-section">

        <div className="history-title">
          <span>Recent conversations</span>
        </div>

        <div className="chat-history">

          {chats.length === 0 ? (
            <div className="empty-history">
              <span>💬</span>
              <p>No conversations yet</p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`history-item ${
                  activeChatId === chat.id
                    ? "active"
                    : ""
                }`}
              >

                <button
                  className="history-chat-button"
                  onClick={() =>
                    onSelectChat(chat.id)
                  }
                >
                  <span className="history-icon">
                    💬
                  </span>

                  <span className="history-name">
                    {chat.title || "New conversation"}
                  </span>
                </button>

                <button
                  className="delete-chat-button"
                  onClick={() =>
                    onDeleteChat(chat.id)
                  }
                  title="Delete conversation"
                >
                  ⋯
                </button>

              </div>
            ))
          )}

        </div>
      </div>

      {/* Bottom */}
      <div className="sidebar-bottom">

        <button
          className="sidebar-option"
          onClick={onToggleTheme}
        >
          <span>
            {theme === "dark" ? "☀️" : "🌙"}
          </span>

          <span>
            {theme === "dark"
              ? "Light mode"
              : "Dark mode"}
          </span>
        </button>

      <button
  className="sidebar-option"
  onClick={onOpenSettings}
>
  <span>⚙️</span>
  <span>Settings</span>
</button>

        <button
          className="sidebar-option logout-option"
          onClick={onLogout}
        >
          <span>↪</span>
          <span>Log out</span>
        </button>

        {/* User */}
        <div className="sidebar-user">

          <div className="user-avatar">
            👤
          </div>

          <div className="user-info">
            <strong>You</strong>
            <span>MindEase user</span>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;