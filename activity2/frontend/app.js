const API = window.location.origin;

function el(id) { return document.getElementById(id); }

function saveToken(token) { localStorage.setItem('token', token); }
function loadToken() { return localStorage.getItem('token'); }
function clearToken() { localStorage.removeItem('token'); }

async function post(path, body) {
  const res = await fetch(API + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function authPost(path, body) {
  const res = await fetch(API + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + loadToken() },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function authGet(path) {
  const res = await fetch(API + path, {
    headers: { 'Authorization': 'Bearer ' + loadToken() },
  });
  return res.json();
}

async function authDelete(path) {
  const res = await fetch(API + path, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + loadToken() },
  });
  return res.json();
}

async function authPut(path, body) {
  const res = await fetch(API + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + loadToken() },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function register() {
  const email = el('regEmail').value;
  const password = el('regPassword').value;
  const res = await post('/auth/register', { email, password });
  if (res && res.id) {
    el('registerMsg').textContent = 'Registered — please login';
  } else {
    el('registerMsg').textContent = (res && res.message) || JSON.stringify(res);
  }
}

async function login() {
  const email = el('loginEmail').value;
  const password = el('loginPassword').value;
  const res = await post('/auth/login', { email, password });
  if (res && res.access_token) {
    saveToken(res.access_token);
    el('loginMsg').textContent = '';
    showApp();
  } else {
    el('loginMsg').textContent = (res && res.error) || JSON.stringify(res);
  }
}

function logout() {
  clearToken();
  el('app').classList.add('hidden');
  el('auth').classList.remove('hidden');
}

async function createNote() {
  const title = el('noteTitle').value;
  const content = el('noteContent').value;
  await authPost('/notes', { title, content });
  el('noteTitle').value = '';
  el('noteContent').value = '';
  loadNotes();
}

function renderNote(n) {
  const div = document.createElement('div');
  div.className = 'note card';
  div.innerHTML = `
    <div class="meta">#${n.id}</div>
    <h4>${escapeHtml(n.title)}</h4>
    <div>${escapeHtml(n.content)}</div>
    <div class="actions">
      <button data-id="${n.id}" class="del">Delete</button>
      <button data-id="${n.id}" class="edit">Edit</button>
    </div>
  `;
  return div;
}

function escapeHtml(s){ return (s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

async function loadNotes() {
  const notes = await authGet('/notes');
  const container = el('notes');
  container.innerHTML = '';
  if (!Array.isArray(notes)) {
    container.textContent = JSON.stringify(notes);
    return;
  }
  notes.forEach(n => {
    const node = renderNote(n);
    container.appendChild(node);
  });

  container.querySelectorAll('.del').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      await authDelete('/notes/' + id);
      loadNotes();
    });
  });

  container.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const newTitle = prompt('New title');
      if (newTitle === null) return;
      const newContent = prompt('New content');
      if (newContent === null) return;
      await authPut('/notes/' + id, { title: newTitle, content: newContent });
      loadNotes();
    });
  });
}

async function showApp(){
  el('auth').classList.add('hidden');
  el('app').classList.remove('hidden');
  // decode email from JWT naively
  try{
    const token = loadToken();
    const payload = JSON.parse(atob(token.split('.')[1]));
    el('userEmail').textContent = payload.email || '';
  }catch(e){ el('userEmail').textContent = '' }
  loadNotes();
}

document.addEventListener('DOMContentLoaded', () => {
  el('registerBtn').addEventListener('click', register);
  el('loginBtn').addEventListener('click', login);
  el('logoutBtn').addEventListener('click', logout);
  el('createNoteBtn').addEventListener('click', createNote);

  if (loadToken()) showApp();
});
