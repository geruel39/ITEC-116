import React, { useEffect, useState } from 'react'

// Prefer an env-configured API URL (VITE_API_URL). When not set, use the Vite dev proxy at /api
const API = import.meta.env.VITE_API_URL ?? '/api'

function App() {
  const [books, setBooks] = useState([])
  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])

  const [form, setForm] = useState({ title: '', description: '', authorId: '', categoryId: '' })
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', authorId: '', categoryId: '' })
  const [editingAuthorId, setEditingAuthorId] = useState(null)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [toasts, setToasts] = useState([])

  function addToast(message, type = 'info', ttl = 4000) {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl)
  }

  const IconPlus = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const IconEdit = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 21v-3.6L14.6 5.8a2 2 0 012.8 0l1.8 1.8a2 2 0 010 2.8L7.6 21H3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const IconDelete = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 6V4a2 2 0 012-2h0a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const IconBook = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const IconAuthor = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 11a4 4 0 100-8 4 4 0 000 8zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const IconCategory = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  useEffect(() => {
    fetchBooks()
    fetchAuthors()
    fetchCategories()
  }, [])

  function fetchBooks() {
    fetch(API + '/books')
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText || 'Failed to fetch books')
        return r.json()
      })
      .then(setBooks)
      .catch((err) => {
        console.error('fetchBooks error', err)
        addToast('Could not load books: ' + err.message, 'error')
      })
  }

  function fetchAuthors() {
    fetch(API + '/authors')
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText || 'Failed to fetch authors')
        return r.json()
      })
      .then(setAuthors)
      .catch((err) => {
        console.error('fetchAuthors error', err)
        addToast('Could not load authors: ' + err.message, 'error')
      })
  }

  function fetchCategories() {
    fetch(API + '/categories')
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText || 'Failed to fetch categories')
        return r.json()
      })
      .then(setCategories)
      .catch((err) => {
        console.error('fetchCategories error', err)
        addToast('Could not load categories: ' + err.message, 'error')
      })
  }

  async function createAuthor() {
    const name = prompt('Author name')
    if (!name) return
    try {
      const res = await fetch(API + '/authors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || res.statusText || 'Create author failed')
      }
      fetchAuthors()
      addToast('Author created', 'success')
    } catch (err) {
      console.error('createAuthor error', err)
      addToast('Failed to create author: ' + err.message, 'error')
    }
  }

  async function editAuthor(id) {
    const author = authors.find(a => a.id === id)
    const name = prompt('Edit author name', author.name)
    if (!name || name === author.name) return
    try {
      const res = await fetch(API + '/authors/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || res.statusText || 'Update author failed')
      }
      fetchAuthors()
      addToast('Author updated', 'success')
    } catch (err) {
      console.error('editAuthor error', err)
      addToast('Failed to update author: ' + err.message, 'error')
    }
  }

  async function removeAuthor(id) {
    if (!confirm('Delete this author? This will also delete all their books.')) return
    try {
      const res = await fetch(API + '/authors/' + id, { method: 'DELETE' })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || res.statusText || 'Delete author failed')
      }
      fetchAuthors()
      fetchBooks()
      addToast('Author deleted', 'success')
    } catch (err) {
      console.error('removeAuthor error', err)
      addToast('Failed to delete author: ' + err.message, 'error')
    }
  }

  async function createCategory() {
    const name = prompt('Category name')
    if (!name) return
    try {
      const res = await fetch(API + '/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || res.statusText || 'Create category failed')
      }
      fetchCategories()
      addToast('Category created', 'success')
    } catch (err) {
      console.error('createCategory error', err)
      addToast('Failed to create category: ' + err.message, 'error')
    }
  }

  async function editCategory(id) {
    const category = categories.find(c => c.id === id)
    const name = prompt('Edit category name', category.name)
    if (!name || name === category.name) return
    try {
      const res = await fetch(API + '/categories/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || res.statusText || 'Update category failed')
      }
      fetchCategories()
      addToast('Category updated', 'success')
    } catch (err) {
      console.error('editCategory error', err)
      addToast('Failed to update category: ' + err.message, 'error')
    }
  }

  async function removeCategory(id) {
    if (!confirm('Delete this category? This will also delete all books in this category.')) return
    try {
      const res = await fetch(API + '/categories/' + id, { method: 'DELETE' })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || res.statusText || 'Delete category failed')
      }
      fetchCategories()
      fetchBooks()
      addToast('Category deleted', 'success')
    } catch (err) {
      console.error('removeCategory error', err)
      addToast('Failed to delete category: ' + err.message, 'error')
    }
  }

  async function submitBook(e) {
    e.preventDefault()
    const payload = { ...form, authorId: Number(form.authorId), categoryId: Number(form.categoryId) }
    try {
      if (!payload.title) return alert('Title is required')
      if (!payload.authorId) return alert('Select an author')
      if (!payload.categoryId) return alert('Select a category')

      const res = await fetch(API + '/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || res.statusText || 'Create book failed')
      }
      setForm({ title: '', description: '', authorId: '', categoryId: '' })
      fetchBooks()
    } catch (err) {
      console.error('submitBook error', err)
      addToast('Failed to create book: ' + err.message, 'error')
      return
    }
    addToast('Book created', 'success')
  }

  function startEdit(book) {
    setEditingId(book.id)
    setEditForm({
      title: book.title || '',
      description: book.description || '',
      authorId: String(book.author?.id || ''),
      categoryId: String(book.category?.id || ''),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm({ title: '', description: '', authorId: '', categoryId: '' })
  }

  async function submitEdit(e) {
    e.preventDefault()
    try {
      const payload = { ...editForm, authorId: Number(editForm.authorId), categoryId: Number(editForm.categoryId) }
      if (!payload.title) return alert('Title is required')
      if (!payload.authorId) return alert('Select an author')
      if (!payload.categoryId) return alert('Select a category')

      const res = await fetch(API + '/books/' + editingId, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || res.statusText || 'Update book failed')
      }
      cancelEdit()
      fetchBooks()
    } catch (err) {
      console.error('submitEdit error', err)
      addToast('Failed to update book: ' + err.message, 'error')
      return
    }
    addToast('Book updated', 'success')
  }

  async function removeBook(id) {
    if (!confirm('Delete this book?')) return
    try {
      const res = await fetch(API + '/books/' + id, { method: 'DELETE' })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || res.statusText || 'Delete failed')
      }
      // If currently editing this book, cancel edit
      if (editingId === id) cancelEdit()
      fetchBooks()
    } catch (err) {
      console.error('removeBook error', err)
      addToast('Failed to delete book: ' + err.message, 'error')
      return
    }
    addToast('Book deleted', 'success')
  }

  return (
    <div className="app">
      {/* Toasts */}
      <div className="toasts" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <div className="toast-body">{t.message}</div>
          </div>
        ))}
      </div>
      <header className="app-header dramatic-header">
        <h1 className="dramatic-title">꧁༺ Activity 3: Bookshelf API + UI ༻꧂</h1>
      </header>

      <section className="card card-row">
        <div className="card-header">
          <h2>Manage Authors &amp; Categories</h2>
          <div className="card-actions">
            <button className="btn" onClick={createAuthor}>
              <IconAuthor size={16} />
              Add Author
            </button>
            <button className="btn" onClick={createCategory}>
              <IconCategory size={16} />
              Add Category
            </button>
          </div>
        </div>
        <div className="flex-list">
          <div className="mini-card">
            <h3><IconAuthor size={16} /> Authors</h3>
            <ul>
              {authors.map(a => (
                <li key={a.id} className="list-item-with-actions">
                  <span>{a.name} <span className="muted">({a.books?.length || 0})</span></span>
                  <span className="item-actions">
                    <button className="btn btn-icon" onClick={() => editAuthor(a.id)} title="Edit author">
                      <IconEdit />
                    </button>
                    <button className="btn btn-icon" onClick={() => removeAuthor(a.id)} title="Delete author">
                      <IconDelete />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mini-card">
            <h3><IconCategory size={16} /> Categories</h3>
            <ul>
              {categories.map(c => (
                <li key={c.id} className="list-item-with-actions">
                  <span>{c.name} <span className="muted">({c.books?.length || 0})</span></span>
                  <span className="item-actions">
                    <button className="btn btn-icon" onClick={() => editCategory(c.id)} title="Edit category">
                      <IconEdit />
                    </button>
                    <button className="btn btn-icon" onClick={() => removeCategory(c.id)} title="Delete category">
                      <IconDelete />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

  <section className={`card ${editingId ? 'editing' : ''}`}>
        {editingId ? (
          <>
            <h2>Edit Book</h2>
            <form className="form" onSubmit={submitEdit}>
              <label>
                Title
                <input className="input" placeholder="Title" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
              </label>
              <label>
                Description
                <input className="input" placeholder="Description" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
              </label>
              <div className="form-row">
                <label>
                  <span className="select-label">
                    <IconAuthor size={14} /> Author
                  </span>
                  <select className="select" value={editForm.authorId} onChange={e => setEditForm({ ...editForm, authorId: e.target.value })}>
                    <option value="">Choose an author...</option>
                    {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </label>
                <label>
                  <span className="select-label">
                    <IconCategory size={14} /> Category
                  </span>
                  <select className="select" value={editForm.categoryId} onChange={e => setEditForm({ ...editForm, categoryId: e.target.value })}>
                    <option value="">Choose a category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">Save</button>
                <button className="btn" type="button" onClick={cancelEdit}>Cancel</button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2>Add Book</h2>
            <form className="form" onSubmit={submitBook}>
              <label>
                Title
                <input className="input" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </label>
              <label>
                Description
                <input className="input" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </label>
              <div className="form-row">
                <label>
                  <span className="select-label">
                    <IconAuthor size={14} /> Author
                  </span>
                  <select className="select" value={form.authorId} onChange={e => setForm({ ...form, authorId: e.target.value })}>
                    <option value="">Choose an author...</option>
                    {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </label>
                <label>
                  <span className="select-label">
                    <IconCategory size={14} /> Category
                  </span>
                  <select className="select" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">Choose a category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary" type="submit">
          <IconBook size={16} />
          Create Book
        </button>
              </div>
            </form>
          </>
        )}
      </section>

      <section className="card">
        <h2>Books</h2>
        <div className="table-wrap">
          <table className="books-table" cellPadding="6">
            <thead>
              <tr>
                <th>ID</th>
                <th><IconBook size={14} /> Title</th>
                <th>Description</th>
                <th><IconAuthor size={14} /> Author</th>
                <th><IconCategory size={14} /> Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.title}</td>
                  <td>{b.description}</td>
                  <td>{b.author?.name}</td>
                  <td>{b.category?.name}</td>
                  <td>
                    <button className="btn btn-edit" onClick={() => startEdit(b)}>
                      <IconEdit size={16} />
                      Edit
                    </button>
                    <button className="btn btn-delete" onClick={() => removeBook(b.id)}>
                      <IconDelete size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default App
