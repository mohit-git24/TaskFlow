import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const fetchTasks = async () => {
    try {
      setStatus({ type: "loading", message: "" });
      const res = await API.get("/tasks");
      setTasks(res.data);
      setStatus({ type: "idle", message: "" });
    } catch {
      setStatus({ type: "error", message: "Couldn’t load tasks. Try refreshing." });
    }
  };

  const addTask = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    try {
      setStatus({ type: "saving", message: "" });
      await API.post("/tasks", { title: trimmed });
      setTitle("");
      await fetchTasks();
      setStatus({ type: "idle", message: "" });
    } catch {
      setStatus({ type: "error", message: "Couldn’t add that task. Try again." });
    }
  };

  const deleteTask = async (id) => {
    try {
      setStatus({ type: "saving", message: "" });
      await API.delete(`/tasks/${id}`);
      await fetchTasks();
      setStatus({ type: "idle", message: "" });
    } catch {
      setStatus({ type: "error", message: "Couldn’t delete that task. Try again." });
    }
  };

  const toggleTask = async (task) => {
    try {
      setStatus({ type: "saving", message: "" });
      await API.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });
      await fetchTasks();
      setStatus({ type: "idle", message: "" });
    } catch {
      setStatus({ type: "error", message: "Couldn’t update that task. Try again." });
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
    } else {
      fetchTasks();
    }
  }, []);

  return (
    <div className="tf-shell">
      <div className="tf-app" role="main">
        <div className="tf-topbar">
          <div>
            <div className="tf-kicker">Dashboard</div>
            <h1 className="tf-h1">Your tasks</h1>
          </div>

          <div className="tf-toolbar">
            <button
              className="tf-button tf-buttonSecondary"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              Log out
            </button>
          </div>
        </div>

        <section className="tf-card" aria-label="Add a task">
          <div className="tf-row">
            <div className="tf-field">
              <div className="tf-labelRow">
                <label className="tf-label" htmlFor="newTask">
                  New task
                </label>
              </div>
              <input
                id="newTask"
                className="tf-input"
                placeholder="e.g., Finish lab report draft"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTask();
                }}
              />
              <p className="tf-help">Tip: press Enter to add quickly.</p>
            </div>

            <button className="tf-button" onClick={addTask} disabled={status.type === "saving"}>
              {status.type === "saving" ? "Saving…" : "Add"}
            </button>
          </div>

          {status.type === "error" ? (
            <p className="tf-error" role="alert" style={{ marginTop: "12px" }}>
              {status.message}
            </p>
          ) : null}
        </section>

        <section className="tf-card" aria-label="Task list">
          {status.type === "loading" ? (
            <p className="tf-help">Loading…</p>
          ) : tasks.length === 0 ? (
            <div className="tf-empty">
              <div className="tf-kicker">Empty list</div>
              <p style={{ margin: "8px 0 0" }}>
                Start with one small task you can finish today. Momentum beats perfection.
              </p>
            </div>
          ) : (
            <div className="tf-list">
              {tasks.map((task) => {
                const done = Boolean(task.completed);
                return (
                  <div className="tf-item" key={task._id}>
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleTask(task)}
                      aria-label={done ? `Mark "${task.title}" as not completed` : `Mark "${task.title}" as completed`}
                    />
                    <div className={`tf-itemTitle ${done ? "tf-itemTitleDone" : ""}`}>{task.title}</div>
                    <button className="tf-iconBtn" onClick={() => deleteTask(task._id)} aria-label={`Delete "${task.title}"`}>
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}