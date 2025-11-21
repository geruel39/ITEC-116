import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:3000/todos";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Fetch tasks from backend on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch tasks error:", err);
    }
  };

  // Add a new task
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTask = {
      title: input.trim(),
      description: descInput.trim(),
      completed: false,
    };

    try {
      const response = await axios.post(API_URL, newTask);
      setTasks([...tasks, response.data]);
      setInput("");
      setDescInput("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Edit/save a task
  const handleEditSave = async (e, idx) => {
    e.preventDefault();
    if (!editValue.trim()) return;
    const taskToUpdate = tasks[idx];

    try {
      const response = await axios.patch(`${API_URL}/${taskToUpdate.id}`, {
        title: editValue.trim(),
        description: editDesc.trim(),
        completed: taskToUpdate.completed,
      });
      const updatedTask = response.data;
      const newTasks = [...tasks];
      newTasks[idx] = updatedTask;
      setTasks(newTasks);
      setEditIndex(null);
      setEditValue("");
      setEditDesc("");
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  };

  // Delete a task
  const handleDelete = async (idx) => {
    const taskToDelete = tasks[idx];
    try {
      await axios.delete(`${API_URL}/${taskToDelete.id}`);
      setTasks(tasks.filter((_, i) => i !== idx));
      if (editIndex === idx) setEditIndex(null);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Mark a task as done/undone
  const handleDoneToggle = async (idx) => {
    const taskToToggle = tasks[idx];
    try {
      const response = await axios.patch(`${API_URL}/${taskToToggle.id}`, {
        title: taskToToggle.title,
        description: taskToToggle.description,
        completed: !taskToToggle.completed,
      });
      const updatedTask = response.data;
      const newTasks = [...tasks];
      newTasks[idx] = updatedTask;
      setTasks(newTasks);
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="todo-card">
        <h1 className="todo-title">Act 1: To-Do List</h1>
        <form className="todo-form" onSubmit={handleAdd}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Task title"
            required
            className="todo-input"
          />
          <input
            type="text"
            value={descInput}
            onChange={(e) => setDescInput(e.target.value)}
            placeholder="Description"
            className="desc-input"
          />
          <button type="submit" className="todo-button">Add</button>
        </form>
        <ul className="task-list">
          {tasks.length === 0 && (
            <li className="task-empty">No tasks yet...</li>
          )}
          {tasks.map((task, idx) => (
            <li key={task.id || idx} className="task-item">
              {editIndex === idx ? (
                <form className="edit-form" onSubmit={(e) => handleEditSave(e, idx)}>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="edit-input"
                    placeholder="Edit title"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="edit-desc"
                    placeholder="Edit description "
                  />
                  <button type="submit" className="edit-save">Save</button>
                  <button type="button" className="edit-cancel" onClick={() => setEditIndex(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <div className="task-left">
                    <span
                      className={`task-check ${task.completed ? "checked" : ""}`}
                      aria-hidden="true"
                      onClick={() => handleDoneToggle(idx)}
                      style={{ cursor: "pointer", marginRight: 8 }}
                    >
                      ✓
                    </span>
                    <span className={`task-text ${task.completed ? "done" : ""}`}>{task.title}</span>
                    {task.description && (
                      <span className="task-desc"> — {task.description}</span>
                    )}
                  </div>
                  <div className="task-buttons">
                    <button
                      type="button"
                      className={`button-done ${task.completed ? "done" : "not-done"}`}
                      onClick={() => handleDoneToggle(idx)}
                    >
                      {task.completed ? "Undo" : "Done"}
                    </button>
                    <button
                      type="button"
                      className="button-edit"
                      onClick={() => {
                        setEditIndex(idx);
                        setEditValue(task.title);
                        setEditDesc(task.description || "");
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button-delete"
                      onClick={() => handleDelete(idx)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
