import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title) return;
    await API.post("/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await API.put(`/tasks/${task._id}`, {
      completed: !task.completed
    });
    fetchTasks();
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
    } else {
      fetchTasks();
    }
  }, []);

  return (
    <div>
      <h2>TaskFlow Dashboard</h2>

      <button onClick={()=>{
        localStorage.removeItem("token");
        window.location.href = "/";
      }}>
        Logout
      </button>

      <br/><br/>

      <input
        placeholder="New Task"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      />
      <button onClick={addTask}>Add</button>

      <hr />

      {tasks.map(task => (
        <div key={task._id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={()=>toggleTask(task)}
          />
          {task.title}
          <button onClick={()=>deleteTask(task._id)}>❌</button>
        </div>
      ))}
    </div>
  );
}