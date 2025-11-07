import axios from "axios";

const API_URL = "http://localhost:3000";

export const registerUser = (username, password) =>
  axios.post(`${API_URL}/users/register`, { username, password });

export const loginUser = (username, password) =>
  axios.post(`${API_URL}/users/login`, { username, password });

export const getNotes = (userId) =>
  axios.get(`${API_URL}/notes`, { params: { userId } });

export const createNote = (title, content, userId) =>
  axios.post(`${API_URL}/notes`, { title, content, userId });

export const updateNote = (id, data) =>
  axios.put(`${API_URL}/notes/${id}`, data);

export const deleteNote = (id) =>
  axios.delete(`${API_URL}/notes/${id}`);
