import { useEffect, useRef } from "react";

function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
}) {
  const textareaRef = useRef(null);

  // Automatically grow the textarea
  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      180
    )}px`;
  }, [value]);

  const handleKeyDown = (event) => {
    // Enter sends the message
    // Shift + Enter creates a new line
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (!disabled && value.trim()) {
        onSubmit(event);
      }
    }
  };

  return (
    <div className="chat-input-wrapper">

      <form
        className="chat-input-area"
        onSubmit={onSubmit}
      >

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Message MindEase AI..."
          rows={1}
          disabled={disabled}
        />

        <button
          type="submit"
          className="send-button"
          disabled={
            disabled || !value.trim()
          }
          aria-label="Send message"
        >
          {disabled ? (
            <span className="send-loading">
              ...
            </span>
          ) : (
            "↑"
          )}
        </button>

      </form>

      <div className="input-footer">

        <span>
          MindEase AI can make mistakes.
          Take care of yourself.
        </span>

        <span>
          Enter to send · Shift + Enter for new line
        </span>

      </div>

    </div>
  );
}

export default ChatInput;