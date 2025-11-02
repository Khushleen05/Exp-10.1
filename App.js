import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5000/api/todos";

  // Fetch todos
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
    setLoading(false);
  };

  // Add new todo
  const addTodo = async () => {
    if (!task.trim()) return alert("Please enter a task");
    try {
      const res = await axios.post(API_URL, { task });
      setTodos([...todos, res.data]);
      setTask("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // Toggle complete
  const toggleComplete = async (id, completed) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={styles.container}>
      <h2>📝 Todo App</h2>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          style={styles.input}
        />
        <button onClick={addTodo} style={styles.addBtn}>Add</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : todos.length === 0 ? (
        <p>No todos yet. Add one!</p>
      ) : (
        <ul style={styles.list}>
          {todos.map((todo) => (
            <li key={todo._id} style={styles.item}>
              <span
                onClick={() => toggleComplete(todo._id, todo.completed)}
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  cursor: "pointer",
                }}
              >
                {todo.task}
              </span>
              <button
                onClick={() => deleteTodo(todo._id)}
                style={styles.deleteBtn}
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Basic styles
const styles = {
  container: { maxWidth: 400, margin: "50px auto", textAlign: "center" },
  form: { display: "flex", gap: "10px", justifyContent: "center" },
  input: { padding: "8px", width: "70%" },
  addBtn: { padding: "8px 12px", cursor: "pointer" },
  list: { listStyle: "none", padding: 0, marginTop: "20px" },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f4f4f4",
    padding: "8px 10px",
    marginBottom: "8px",
    borderRadius: "4px",
  },
  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    padding: "4px 6px",
  },
};

export default App;
