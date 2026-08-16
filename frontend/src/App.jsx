import { useState } from "react";
import axios from "axios";
import "./App.css";

import ChatPage from "./pages/ChatPage";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [isAuthenticated, setIsAuthenticated] =
    useState(
      Boolean(localStorage.getItem("access_token"))
    );

  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  };

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  const login = async () => {
    const loginData = new URLSearchParams();

    loginData.append("username", form.email);
    loginData.append("password", form.password);

    const response = await axios.post(
      `${API_URL}/auth/login`,
      loginData,
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
      }
    );

    localStorage.setItem(
      "access_token",
      response.data.access_token
    );

    setIsAuthenticated(true);

    setForm({
      name: "",
      email: "",
      password: "",
    });
  };

  // --------------------------------------------------
  // REGISTER
  // --------------------------------------------------

  const register = async () => {
    const response = await axios.post(
      `${API_URL}/auth/register`,
      {
        name: form.name,
        email: form.email,
        password: form.password,
      }
    );

    setMessage(
      response.data.message ||
        "Account created successfully!"
    );

    setIsLogin(true);

    setForm({
      name: "",
      email: "",
      password: "",
    });
  };

  // --------------------------------------------------
  // AUTH SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setMessage("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await login();
      } else {
        await register();
      }
    } catch (error) {
      console.error(
        "Authentication error:",
        error
      );

      if (!error.response) {
        setMessage(
          "Cannot connect to MindEase AI. Make sure the backend is running."
        );
        return;
      }

      const detail =
        error.response.data?.detail;

      if (Array.isArray(detail)) {
        setMessage(
          detail
            .map((item) => item.msg)
            .join(", ")
        );
      } else if (
        typeof detail === "string"
      ) {
        setMessage(detail);
      } else {
        setMessage(
          error.response.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const logout = () => {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "mindease_chats"
    );

    setIsAuthenticated(false);

    setIsLogin(true);

    setForm({
      name: "",
      email: "",
      password: "",
    });

    setMessage("");
  };

  // --------------------------------------------------
  // CHAT APPLICATION
  // --------------------------------------------------

  if (isAuthenticated) {
    return (
      <ChatPage onLogout={logout} />
    );
  }

  // --------------------------------------------------
  // AUTHENTICATION PAGE
  // --------------------------------------------------

  return (
    <div className="auth-page">

      {/* Decorative background */}

      <div className="auth-orb auth-orb-one"></div>
      <div className="auth-orb auth-orb-two"></div>
      <div className="auth-orb auth-orb-three"></div>

      <main className="auth-layout">

        {/* LEFT SIDE */}

        <section className="auth-introduction">

          <div className="auth-brand">

            <div className="auth-brand-icon">
              🧠
            </div>

            <div>
              <strong>
                MindEase
              </strong>

              <span>
                AI Wellness
              </span>
            </div>

          </div>

          <div className="intro-content">

            <span className="intro-badge">
              ✨ Your private AI companion
            </span>

            <h1>
              A calmer place
              <br />
              to clear your mind.
            </h1>

            <p>
              Talk through your thoughts,
              reflect on your feelings, and
              discover healthier ways to
              navigate your day.
            </p>

          </div>

          <div className="intro-features">

            <div className="intro-feature">
              <div className="feature-icon">
                💬
              </div>

              <div>
                <strong>
                  Meaningful conversations
                </strong>

                <span>
                  Talk whenever you need someone
                  to listen.
                </span>
              </div>
            </div>

            <div className="intro-feature">
              <div className="feature-icon">
                🌱
              </div>

              <div>
                <strong>
                  Build healthier habits
                </strong>

                <span>
                  Small reflections can make a
                  meaningful difference.
                </span>
              </div>
            </div>

            <div className="intro-feature">
              <div className="feature-icon">
                🔒
              </div>

              <div>
                <strong>
                  Your space
                </strong>

                <span>
                  A calm environment designed
                  around your experience.
                </span>
              </div>
            </div>

          </div>

        </section>

        {/* RIGHT SIDE */}

        <section className="auth-panel">

          <div className="auth-card">

            <div className="auth-card-header">

              <div className="mobile-logo">
                🧠
              </div>

              <h2>
                {isLogin
                  ? "Welcome back"
                  : "Create your account"}
              </h2>

              <p>
                {isLogin
                  ? "Continue your wellness journey."
                  : "Start your MindEase journey today."}
              </p>

            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >

              {!isLogin && (
                <div className="form-field">

                  <label htmlFor="name">
                    Name
                  </label>

                  <div className="input-wrapper">

                    <span className="input-icon">
                      👤
                    </span>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>

                </div>
              )}

              <div className="form-field">

                <label htmlFor="email">
                  Email
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    ✉️
                  </span>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

              </div>

              <div className="form-field">

                <label htmlFor="password">
                  Password
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    🔐
                  </span>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={isLoading}
              >

                {isLoading ? (
                  <>
                    <span className="button-spinner"></span>
                    {isLogin
                      ? "Signing in..."
                      : "Creating account..."}
                  </>
                ) : (
                  <>
                    {isLogin
                      ? "Sign in"
                      : "Create account"}

                    <span>→</span>
                  </>
                )}

              </button>

            </form>

            {message && (
              <div className="auth-message">
                <span>ℹ️</span>
                <span>{message}</span>
              </div>
            )}

            <div className="auth-switch">

              <span>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>

              <button
                type="button"
                onClick={() => {
                  setIsLogin(
                    (previous) => !previous
                  );

                  setMessage("");

                  setForm({
                    name: "",
                    email: "",
                    password: "",
                  });
                }}
              >
                {isLogin
                  ? "Create one"
                  : "Sign in"}
              </button>

            </div>

            <div className="auth-note">
              <span>🛡️</span>
              <span>
                MindEase AI is a wellness companion,
                not a replacement for professional
                medical care.
              </span>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;