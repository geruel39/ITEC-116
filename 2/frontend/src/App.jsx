import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotesDashboard from "./pages/NotesDashboard";

function App() {
  const userId = localStorage.getItem("userId");

  return (
    <Router>
      <Routes>
        <Route path="/" element={userId ? <NotesDashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
