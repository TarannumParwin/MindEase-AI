import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import WelcomeScreen from "../components/WelcomeScreen";

const API_URL = "https://mindease-ai-backend-hiwg.onrender.com";

function ChatPage({ onLogout }) {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [theme, setTheme] = useState(
    localStorage.getItem("mindease_theme") || "light"
  );

  // --------------------------------------------------
  // LOAD SAVED CHATS
  // --------------------------------------------------

  useEffect(() => {
    const savedChats = localStorage.getItem(
      "mindease_chats"
    );

    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);

        setChats(parsedChats);

        if (parsedChats.length > 0) {
          setActiveChatId(parsedChats[0].id);
        }
      } catch (error) {
        console.error(
          "Could not load saved chats:",
          error
        );
      }
    }
  }, []);

  // --------------------------------------------------
  // SAVE CHATS
  // --------------------------------------------------

  useEffect(() => {
    localStorage.setItem(
      "mindease_chats",
      JSON.stringify(chats)
    );
  }, [chats]);

  // --------------------------------------------------
  // THEME
  // --------------------------------------------------

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "mindease_theme",
      theme
    );
  }, [theme]);

  // --------------------------------------------------
  // CURRENT CHAT
  // --------------------------------------------------

  const activeChat = chats.find(
    (chat) => chat.id === activeChatId
  );

  const messages = activeChat?.messages || [];

  // --------------------------------------------------
  // CREATE NEW CHAT
  // --------------------------------------------------

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New conversation",
      messages: [],
    };

    setChats((previous) => [
      newChat,
      ...previous,
    ]);

    setActiveChatId(newChat.id);
    setChatInput("");
  };

  // --------------------------------------------------
  // SELECT CHAT
  // --------------------------------------------------

  const selectChat = (chatId) => {
    setActiveChatId(chatId);
    setChatInput("");
  };

  // --------------------------------------------------
  // DELETE CHAT
  // --------------------------------------------------

  const deleteChat = (chatId) => {
    const remainingChats = chats.filter(
      (chat) => chat.id !== chatId
    );

    setChats(remainingChats);

    if (activeChatId === chatId) {
      if (remainingChats.length > 0) {
        setActiveChatId(remainingChats[0].id);
      } else {
        setActiveChatId(null);
      }
    }
  };

  // --------------------------------------------------
  // CLEAR CURRENT CHAT
  // --------------------------------------------------

  const clearChat = () => {
    if (!activeChatId) {
      return;
    }

    setChats((previous) =>
      previous.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              title: "New conversation",
              messages: [],
            }
          : chat
      )
    );

    setChatInput("");
  };

  // --------------------------------------------------
  // ADD MESSAGE
  // --------------------------------------------------

  const addMessage = (message) => {
    setChats((previous) =>
      previous.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                message,
              ],
            }
          : chat
      )
    );
  };

  // --------------------------------------------------
  // UPDATE CHAT
  // --------------------------------------------------

  const updateChat = (updates) => {
    setChats((previous) =>
      previous.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              ...updates,
            }
          : chat
      )
    );
  };

  // --------------------------------------------------
  // SEND MESSAGE
  // --------------------------------------------------

  const sendMessage = async (
    event,
    messageOverride = null
  ) => {
    event?.preventDefault();

    const text = (
      messageOverride ?? chatInput
    ).trim();

    if (!text || isSending) {
      return;
    }

    // If there is no chat yet, create one.
    let currentChatId = activeChatId;

    if (!currentChatId) {
      const newChat = {
        id: Date.now().toString(),
        title: text.slice(0, 35),
        messages: [],
      };

      setChats((previous) => [
        newChat,
        ...previous,
      ]);

      setActiveChatId(newChat.id);

      currentChatId = newChat.id;

      setChats((previous) =>
        previous.map((chat) =>
          chat.id === newChat.id
            ? {
                ...chat,
                messages: [
                  {
                    role: "user",
                    content: text,
                  },
                ],
              }
            : chat
        )
      );
    } else {
      addMessage({
        role: "user",
        content: text,
      });

      if (
        !activeChat?.messages?.length
      ) {
        updateChat({
          title: text.slice(0, 35),
        });
      }
    }

    setChatInput("");
    setIsSending(true);

    try {
      const token =
        localStorage.getItem(
          "access_token"
        );

      const response = await axios.post(
        `${API_URL}/chat/`,
        {
          message: text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const reply =
        response.data?.reply ||
        response.data?.response ||
        response.data?.message ||
        "I'm here with you.";

      setChats((previous) =>
        previous.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "assistant",
                    content: reply,
                  },
                ],
              }
            : chat
        )
      );
    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        onLogout();
        return;
      }

      setChats((previous) =>
        previous.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "assistant",
                    content:
                      "I'm having trouble responding right now. Please try again.",
                  },
                ],
              }
            : chat
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  // --------------------------------------------------
  // SUGGESTION
  // --------------------------------------------------

  const handleSuggestion = (text) => {
    sendMessage(null, text);
  };

  // --------------------------------------------------
  // COPY RESPONSE
  // --------------------------------------------------

  const copyMessage = async (content) => {
    try {
      await navigator.clipboard.writeText(
        content
      );
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  };

  // --------------------------------------------------
  // REGENERATE
  // --------------------------------------------------

  const regenerateResponse = async () => {
    if (
      !activeChat ||
      isSending ||
      activeChat.messages.length === 0
    ) {
      return;
    }

    const assistantMessages =
      activeChat.messages.filter(
        (message) =>
          message.role === "assistant"
      );

    if (assistantMessages.length === 0) {
      return;
    }

    const lastAssistant =
      assistantMessages[
        assistantMessages.length - 1
      ];

    const lastAssistantIndex =
      activeChat.messages.lastIndexOf(
        lastAssistant
      );

    const previousUserMessage =
      activeChat.messages
        .slice(0, lastAssistantIndex)
        .reverse()
        .find(
          (message) =>
            message.role === "user"
        );

    if (!previousUserMessage) {
      return;
    }

    // Remove previous AI response
    setChats((previous) =>
      previous.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages:
                chat.messages.filter(
                  (_, index) =>
                    index !==
                    lastAssistantIndex
                ),
            }
          : chat
      )
    );

    setIsSending(true);

    try {
      const token =
        localStorage.getItem(
          "access_token"
        );

      const response = await axios.post(
        `${API_URL}/chat/`,
        {
          message:
            previousUserMessage.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const reply =
        response.data?.reply ||
        response.data?.response ||
        response.data?.message ||
        "I'm here with you.";

      setChats((previous) =>
        previous.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    role: "assistant",
                    content: reply,
                  },
                ],
              }
            : chat
        )
      );
    } catch (error) {
      console.error(
        "Regenerate error:",
        error
      );
    } finally {
      setIsSending(false);
    }
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "mindease_chats"
    );

    onLogout();
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div
      className={`chat-app ${
        isSidebarOpen
          ? "sidebar-visible"
          : "sidebar-hidden"
      }`}
    >

      {/* SIDEBAR */}

    <Sidebar
  chats={chats}
  activeChatId={activeChatId}
  onNewChat={createNewChat}
  onSelectChat={selectChat}
  onDeleteChat={deleteChat}
  onLogout={handleLogout}
  theme={theme}
  onToggleTheme={() =>
    setTheme((previous) =>
      previous === "dark"
        ? "light"
        : "dark"
    )
  }
  onOpenSettings={() => setIsSettingsOpen(true)}
/>
{isSettingsOpen && (
  <div
    className="settings-overlay"
    onClick={() => setIsSettingsOpen(false)}
  >
    <div
      className="settings-modal"
      onClick={(event) =>
        event.stopPropagation()
      }
    >
      <div className="settings-header">
        <div>
          <h2>Settings</h2>
          <p>Customize your MindEase experience.</p>
        </div>

        <button
          className="settings-close"
          onClick={() =>
            setIsSettingsOpen(false)
          }
          aria-label="Close settings"
        >
          ×
        </button>
      </div>

      <div className="settings-section">

        <div className="settings-item">
          <div className="settings-item-icon">
            🌓
          </div>

          <div className="settings-item-content">
            <strong>Appearance</strong>

            <span>
              Switch between light and dark mode.
            </span>
          </div>

          <button
            className="settings-toggle"
            onClick={() =>
              setTheme((previous) =>
                previous === "dark"
                  ? "light"
                  : "dark"
              )
            }
          >
            {theme === "dark"
              ? "Dark"
              : "Light"}
          </button>
        </div>

        <div className="settings-item">
          <div className="settings-item-icon">
            💬
          </div>

          <div className="settings-item-content">
            <strong>Conversations</strong>

            <span>
              {chats.length} saved conversation
              {chats.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="settings-item">
          <div className="settings-item-icon">
            🔒
          </div>

          <div className="settings-item-content">
            <strong>Privacy</strong>

            <span>
              Your conversations are stored locally
              in this browser.
            </span>
          </div>
        </div>

      </div>

      <div className="settings-footer">
        <span>MindEase AI</span>
        <span>v1.0.0</span>
      </div>
    </div>
  </div>
)}

      {/* MAIN */}

      <div className="chat-main">

        <ChatHeader
          title={
            activeChat?.title ||
            "MindEase AI"
          }
          onToggleSidebar={() =>
            setIsSidebarOpen(
              (previous) => !previous
            )
          }
          onClearChat={clearChat}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="chat-content">

          {messages.length === 0 ? (
            <WelcomeScreen
              onSuggestion={
                handleSuggestion
              }
            />
          ) : (
            <div className="messages-container">

              {messages.map(
                (message, index) => (
                  <ChatMessage
                    key={`${message.role}-${index}`}
                    message={message}
                    onCopy={copyMessage}
                    onRegenerate={
                      regenerateResponse
                    }
                    isLastAssistantMessage={
                      message.role ===
                        "assistant" &&
                      index ===
                        messages.length - 1
                    }
                  />
                )
              )}

              {isSending && (
                <div className="message-row ai-row">

                  <div className="message-avatar ai-avatar">
                    🧠
                  </div>

                  <div className="message-content">

                    <div className="message-sender">
                      MindEase AI
                    </div>

                    <div className="chat-bubble ai-bubble typing-bubble">

                      <span></span>
                      <span></span>
                      <span></span>

                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

        </main>

        <ChatInput
          value={chatInput}
          onChange={setChatInput}
          onSubmit={sendMessage}
          disabled={isSending}
        />

      </div>

    </div>
  );
}

export default ChatPage;
