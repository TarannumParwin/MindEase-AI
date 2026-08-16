function ChatHeader({
  title,
  onToggleSidebar,
  onClearChat,
  isSidebarOpen,
}) {
  return (
    <header className="chat-header">

      <div className="chat-header-left">

        <button
          className="menu-button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? "☰" : "☰"}
        </button>

        <div className="chat-title-area">

          <div className="chat-title-icon">
            🧠
          </div>

          <div>
            <h1>
              {title || "MindEase AI"}
            </h1>

            <span>
              AI Wellness Companion
            </span>
          </div>

        </div>

      </div>

      <div className="chat-header-actions">

        <button
          className="header-action"
          onClick={onClearChat}
          title="Clear conversation"
        >
          🗑️
          <span>Clear</span>
        </button>

        <div className="online-status">
          <span className="status-dot"></span>
          Online
        </div>

      </div>

    </header>
  );
}

export default ChatHeader;