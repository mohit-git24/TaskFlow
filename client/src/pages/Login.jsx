import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import mark from "../assets/taskflow-mark.svg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });
    try {
      if (!username.trim() || !password) {
        setStatus({ type: "error", message: "Enter your username and password." });
        return;
      }
      setStatus({ type: "loading", message: "" });
      const res = await API.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed. Check your details and try again.";
      setStatus({ type: "error", message: msg });
    }
  };

  return (
    <div className="tf-shell">
      <div className="tf-frame" role="main">
        <section className="tf-brand" aria-label="TaskFlow introduction">
          <div className="tf-kicker">TaskFlow</div>
          <img className="tf-mark" src={mark} alt="" aria-hidden="true" />
          <h1 className="tf-title">Plan your week like a syllabus.</h1>
          <p className="tf-subtitle">
            A focused task list for students: capture fast, prioritize clearly, and keep momentum—on desktop or
            mobile.
          </p>
        </section>

        <section className="tf-card" aria-label="Log in">
          <h2 className="tf-h1">Log in</h2>
          <p className="tf-help" style={{ marginTop: "8px" }}>
            Use the account you created for this assignment.
          </p>

          <form className="tf-form" onSubmit={handleLogin} style={{ marginTop: "16px" }}>
            <div className="tf-field">
              <div className="tf-labelRow">
                <label className="tf-label" htmlFor="username">
                  Username
                </label>
              </div>
              <input
                id="username"
                className="tf-input"
                type="text"
                name="tf_username"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                aria-invalid={status.type === "error" && !username.trim() ? "true" : "false"}
              />
            </div>

            <div className="tf-field">
              <div className="tf-labelRow">
                <label className="tf-label" htmlFor="password">
                  Password
                </label>
                <button
                  className="tf-labelAction"
                  type="button"
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="password"
                className="tf-input"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={status.type === "error" && !password ? "true" : "false"}
              />
            </div>

            {status.type === "error" ? (
              <p className="tf-error" role="alert">
                {status.message}
              </p>
            ) : null}

            <div className="tf-actions">
              <button className="tf-button" type="submit" disabled={status.type === "loading"}>
                {status.type === "loading" ? "Logging in…" : "Log in"}
              </button>
              <Link className="tf-button tf-buttonSecondary" to="/signup" style={{ textAlign: "center" }}>
                Create an account
              </Link>
            </div>

            <p className="tf-footnote">
              By continuing, you agree to keep your login token stored on this device.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}