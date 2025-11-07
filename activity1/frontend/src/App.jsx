import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

const API_URL = "http://localhost:3000/todos"; 

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([...tasks, { text: input.trim(), done: false }]);
    setInput("");
  };

  const handleEditSave = (e, idx) => {
    e.preventDefault();
    if (!editValue.trim()) return;
    const newTasks = [...tasks];
    newTasks[idx].text = editValue.trim();
    setTasks(newTasks);
    setEditIndex(null);
  };

  const handleDelete = (idx) => {
    setTasks(tasks.filter((_, i) => i !== idx));
    if (editIndex === idx) setEditIndex(null);
  };

  const handleDoneToggle = (idx) => {
    const newTasks = [...tasks];
    newTasks[idx].done = !newTasks[idx].done;
    setTasks(newTasks);
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
            placeholder="What do you need to do?"
            required
            className="todo-input"
          />
          <button type="submit" className="todo-button">Add</button>
        </form>
        <ul className="task-list">
          {tasks.length === 0 && (
            <li className="task-empty">No tasks yet...</li>
          )}
          {tasks.map((task, idx) => (
            <li key={idx} className="task-item">
              {editIndex === idx ? (
                <form className="edit-form" onSubmit={(e) => handleEditSave(e, idx)}>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="edit-input"
                    autoFocus
                  />
                  <button type="submit" className="edit-save">Save</button>
                  <button type="button" className="edit-cancel" onClick={() => setEditIndex(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <div className="task-left">
                    <span
                      className={`task-check ${task.done ? "checked" : ""}`}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span className={`task-text ${task.done ? "done" : ""}`}>{task.text}</span>
                  </div>
                  <div className="task-buttons">
                    <button
                      type="button"
                      className={`button-done ${task.done ? "done" : "not-done"}`}
                      onClick={() => handleDoneToggle(idx)}
                    >
                      {task.done ? "Undo" : "Done"}
                    </button>
                    <button
                      type="button"
                      className="button-edit"
                      onClick={() => { setEditIndex(idx); setEditValue(task.text); }}
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

