import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/todos"; // adjust port if needed

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch todos:", err.message);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    try {
      await axios.post(API_URL, { title, description });
      setTitle("");
      setDescription("");
      fetchTodos();
    } catch (err) {
      console.error("❌ Failed to add todo:", err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("❌ Failed to delete todo:", err.message);
    }
  };

  const startEdit = (todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const saveEdit = async () => {
    if (!editingTodo) return;
    try {
      await axios.put(`${API_URL}/${editingTodo.id}`, {
        title,
        description,
      });
      setEditingTodo(null);
      setTitle("");
      setDescription("");
      fetchTodos();
    } catch (err) {
      console.error("❌ Failed to save edit:", err.message);
    }
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setTitle("");
    setDescription("");
  };

  const toggleCompleted = async (todo) => {
    try {
      await axios.put(`${API_URL}/${todo.id}`, {
        completed: !todo.completed,
      });
      fetchTodos();
    } catch (err) {
      console.error("❌ Failed to toggle completed:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">📝 To-Do List</h1>

        {/* Input Fields */}
        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded-md focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded-md focus:ring focus:ring-blue-300"
          />
          {editingTodo ? (
            <div className="flex gap-2">
              <button
                onClick={saveEdit}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={addTodo}
              className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
            >
              Add Task
            </button>
          )}
        </div>

        {/* To-Do List */}
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`p-4 rounded-xl shadow-sm flex flex-col space-y-2 transition-colors duration-300 ${
                todo.completed ? "bg-green-200" : "bg-white"
              }`}
            >
              {editingTodo && editingTodo.id === todo.id ? null : (
                <div className="flex justify-between items-center">
                  <div>
                    <h2
                      className={`text-lg font-semibold ${
                        todo.completed ? "line-through text-gray-700" : ""
                      }`}
                    >
                      {todo.title}
                    </h2>
                    {todo.description && (
                      <p className="text-gray-700">{todo.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleCompleted(todo)}
                      className={`px-3 py-1 rounded text-white ${
                        todo.completed
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {todo.completed ? "Undo" : "Done"}
                    </button>
                    <button
                      onClick={() => startEdit(todo)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
