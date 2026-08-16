function ChatMessage({
  message,
  onCopy,
  onRegenerate,
  isLastAssistantMessage,
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`message-row ${
        isUser ? "user-row" : "ai-row"
      }`}
    >
      {!isUser && (
        <div className="message-avatar ai-avatar">
          🧠
        </div>
      )}

      <div className="message-content">

        <div className="message-sender">
          {isUser ? "You" : "MindEase AI"}
        </div>

        <div
          className={`chat-bubble ${
            isUser
              ? "user-bubble"
              : "ai-bubble"
          }`}
        >
          {message.content}
        </div>

        {!isUser && (
          <div className="message-actions">

            <button
              className="message-action"
              onClick={() =>
                onCopy(message.content)
              }
              title="Copy response"
            >
              📋
              <span>Copy</span>
            </button>

            {isLastAssistantMessage && (
              <button
                className="message-action"
                onClick={onRegenerate}
                title="Regenerate response"
              >
                ↻
                <span>Regenerate</span>
              </button>
            )}

          </div>
        )}

      </div>

      {isUser && (
        <div className="message-avatar user-avatar">
          👤
        </div>
      )}
    </div>
  );
}

export default ChatMessage;