import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import mark from "../assets/taskflow-mark.svg";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });
    try {
      if (!username.trim() || !password) {
        setStatus({ type: "error", message: "Enter a username and a password." });
        return;
      }

      setStatus({ type: "loading", message: "" });
      await API.post("/auth/signup", {
        username,
        email: showEmail && email.trim() ? email : undefined,
        password,
      });
      setStatus({ type: "success", message: "Account created. You can log in now." });
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.error || "Signup failed. Try a different username (or email).";
      setStatus({ type: "error", message: msg });
    }
  };

  return (
    <div className="tf-shell">
      <div className="tf-frame" role="main">
        <section className="tf-brand" aria-label="TaskFlow introduction">
          <div className="tf-kicker">TaskFlow</div>
          <img className="tf-mark" src={mark} alt="" aria-hidden="true" />
          <h1 className="tf-title">Make tasks feel finite.</h1>
          <p className="tf-subtitle">
            Create an account to save your tasks. Keep your list clean, your priorities obvious, and your week under
            control.
          </p>
        </section>

        <section className="tf-card" aria-label="Sign up">
          <h2 className="tf-h1">Create account</h2>
          <p className="tf-help" style={{ marginTop: "8px" }}>
            Sign up with a username and password. Email is optional.
          </p>

          <form className="tf-form" onSubmit={handleSignup} style={{ marginTop: "16px" }}>
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
                <span className="tf-label">Email</span>
                <button
                  className="tf-labelAction"
                  type="button"
                  aria-pressed={showEmail}
                  onClick={() => setShowEmail((v) => !v)}
                >
                  {showEmail ? "Remove" : "Add (optional)"}
                </button>
              </div>

              {showEmail ? (
                <>
                  <input
                    id="email"
                    className="tf-input"
                    type="email"
                    name="tf_email"
                    inputMode="email"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="Enter email (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="tf-help">Optional: helpful if you want a recovery contact later.</p>
                </>
              ) : (
                <p className="tf-help">Not required. You can always add it later.</p>
              )}
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
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={
                  status.type === "error" && !password ? "true" : "false"
                }
              />
            </div>

            {status.type === "error" ? (
              <p className="tf-error" role="alert">
                {status.message}
              </p>
            ) : null}

            <div className="tf-actions">
              <button className="tf-button" type="submit" disabled={status.type === "loading"}>
                {status.type === "loading" ? "Creating…" : "Create account"}
              </button>
              <Link className="tf-button tf-buttonSecondary" to="/" style={{ textAlign: "center" }}>
                Back to login
              </Link>
            </div>

            <p className="tf-footnote">
              Already have an account? <Link to="/">Log in</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}