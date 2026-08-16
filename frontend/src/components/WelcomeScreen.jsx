function WelcomeScreen({ onSuggestion }) {
  const suggestions = [
    {
      icon: "💭",
      title: "I'm feeling stressed",
      text: "Help me calm down and manage my stress.",
    },
    {
      icon: "🌱",
      title: "I want to feel better",
      text: "Give me some simple ways to improve my mood.",
    },
    {
      icon: "🧘",
      title: "Help me relax",
      text: "Guide me through a quick relaxation exercise.",
    },
    {
      icon: "💬",
      title: "I just want to talk",
      text: "I have something on my mind and want to talk about it.",
    },
  ];

  return (
    <section className="welcome-screen">

      <div className="welcome-icon">
        🧠
      </div>

      <h2>
        How are you feeling today?
      </h2>

      <p className="welcome-description">
        I'm MindEase, your AI wellness companion.
        You can talk to me about what's on your mind,
        explore your feelings, or simply have a conversation.
      </p>

      <div className="suggestion-grid">

        {suggestions.map((suggestion) => (
          <button
            key={suggestion.title}
            className="suggestion-card"
            onClick={() =>
              onSuggestion(suggestion.text)
            }
          >
            <span className="suggestion-icon">
              {suggestion.icon}
            </span>

            <span className="suggestion-content">

              <strong>
                {suggestion.title}
              </strong>

              <span>
                {suggestion.text}
              </span>

            </span>

            <span className="suggestion-arrow">
              →
            </span>

          </button>
        ))}

      </div>

      <div className="welcome-disclaimer">
        <span>🔒</span>
        <span>
          Your conversations are handled privately
          by this application.
        </span>
      </div>

    </section>
  );
}

export default WelcomeScreen;