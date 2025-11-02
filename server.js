const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todoapp")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Simple Todo model (inline for simplicity)
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Todo App API 🚀");
});

// Get all todos
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add a new todo
app.post("/api/todos", async (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: "Task is required" });
  const todo = new Todo({ task });
  await todo.save();
  res.status(201).json(todo);
});

// Update todo (mark completed)
app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
  res.json(todo);
});

// Delete todo
app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.json({ message: "Todo deleted" });
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

