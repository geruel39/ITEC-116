import React, { useState, useEffect } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "../api";
import { useNavigate } from "react-router-dom";

export default function NotesDashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null); // ✅ track what we’re editing
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const loadNotes = async () => {
    const res = await getNotes(userId);
    setNotes(res.data);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // ✅ Handle add or update depending on state
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingNoteId) {
      await updateNote(editingNoteId, { title, content });
      setEditingNoteId(null);
    } else {
      await createNote(title, content, userId);
    }
    setTitle("");
    setContent("");
    loadNotes();
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    loadNotes();
  };

  // ✅ When clicking "Edit"
  const handleEdit = (note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setTitle("");
    setContent("");
  };

  const logout = () => {
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Notes</h1>
          <button
            onClick={logout}
            className="text-red-500 font-semibold hover:underline"
          >
            Logout
          </button>
        </div>

        {/* Add or Edit form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            className="border p-2 w-full mb-2 rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border p-2 w-full mb-2 rounded"
            placeholder="Content"
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className={`${
                editingNoteId
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white px-4 py-2 rounded`}
            >
              {editingNoteId ? "Update Note" : "Add Note"}
            </button>
            {editingNoteId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Notes list */}
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold text-lg">{note.title}</h2>
              <p className="text-gray-700">{note.content}</p>
              <div className="mt-2 space-x-3">
                <button
                  onClick={() => handleEdit(note)}
                  className="text-yellow-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
