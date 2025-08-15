import React, { useEffect, useMemo, useState } from 'react'
import { createTodo, deleteTodo, listTodos, login, register, setToken, updateTodo } from './api'

function Auth({ onAuthed }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const fn = mode === 'login' ? login : register
      const { token } = await fn(email, password)
      localStorage.setItem('token', token)
      setToken(token)
      onAuthed()
    } catch (err) {
        console.log(err)
      setError('Auth failed')
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="card">
        <div className="card-body">
          <h2 className="title" style={{ marginTop: 0 }}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
            <div>
              <label>Email</label>
              <input className="input" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
            </div>
            <div>
              <label>Password</label>
              <input className="input" value={password} onChange={e => setPassword(e.target.value)} type="password" required minLength={6} />
            </div>
            {error && <div className="badge badge-warn">{error}</div>}
            <button type="submit" className="btn btn-primary">{mode === 'login' ? 'Login' : 'Create account'}</button>
          </form>
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TodoForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const [completed, setCompleted] = useState(false)
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')

  async function submit(e) {
    e.preventDefault()
    const payload = { title, priority, completed, description }
    if (dueDate) payload.dueDate = new Date(dueDate).toISOString()
    await onCreate(payload)
    setTitle('')
    setPriority('medium')
    setCompleted(false)
    setDueDate('')
    setDescription('')
  }

  return (
    <form onSubmit={submit} className="grid-form">
      <div>
        <label>Title</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Priority</label>
        <select className="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label>Completed</label>
        <div className="chips">
          <input id="completed" type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} />
          <label htmlFor="completed" className="muted">Mark complete</label>
        </div>
      </div>
      <div>
        <label>Due date</label>
        <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>
      <div>
        <button className="btn btn-primary" type="submit">Add</button>
      </div>
      <div className="full">
        <label>Description</label>
        <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      </div>
    </form>
  )
}

function TodoList() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [totalPages, setTotalPages] = useState(1)
  const [completedFilter, setCompletedFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  const completedParam = useMemo(() => {
    if (completedFilter === 'all') return undefined
    return completedFilter === 'completed'
  }, [completedFilter])

  async function refresh(p = page) {
    setLoading(true)
    try {
      const data = await listTodos({ page: p, limit, completed: completedParam })
      setItems(data.items)
      setTotalPages(data.totalPages)
      setPage(data.page)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh(1)
  }, [completedParam])

  async function onCreate(payload) {
    await createTodo(payload)
    refresh(1)
  }

  async function toggleComplete(item) {
    await updateTodo(item._id, { completed: !item.completed })
    refresh(page)
  }

  async function remove(id) {
    await deleteTodo(id)
    // If page becomes empty, go back a page
    if (items.length === 1 && page > 1) {
      refresh(page - 1)
    } else {
      refresh(page)
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="card-body">
          <div className="toolbar">
            <h2 className="title" style={{ margin: 0 }}>Todos</h2>
            <div className="spacer" />
            <label>Filter</label>
            <select className="select" value={completedFilter} onChange={(e) => setCompletedFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="not_completed">Not Completed</option>
            </select>
          </div>
          <div style={{ marginTop: 12 }}>
            <TodoForm onCreate={onCreate} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="muted">Loading...</div>
          ) : items.length === 0 ? (
            <div className="muted">No todos</div>
          ) : (
            <ul className="list">
              {items.map(item => (
                <li key={item._id} className="item">
                  <div className="item-row">
                    <div>
                      <div className="item-title">{item.title}</div>
                      <div className="item-meta">
                        <span className={`badge ${item.priority}`}>{item.priority}</span>
                        <span className="chip">{item.completed ? 'Completed' : 'Pending'}</span>
                        <span className={`badge ${item.isOverdue ? 'badge-warn' : 'badge-ok'}`}>{item.isOverdue ? 'Overdue' : 'On time'}</span>
                        {item.dueDate && <span className="chip">Due {new Date(item.dueDate).toLocaleDateString()}</span>}
                      </div>
                      {item.description && <div style={{ marginTop: 6 }}>{item.description}</div>}
                    </div>
                    <div className="toolbar">
                      <button className="btn" onClick={() => toggleComplete(item)}>{item.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
                      <button className="btn btn-danger" onClick={() => remove(item._id)}>Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="pagination">
        <button className="btn" disabled={page <= 1} onClick={() => refresh(page - 1)}>Prev</button>
        <span className="muted">Page {page} / {totalPages}</span>
        <button className="btn" disabled={page >= totalPages} onClick={() => refresh(page + 1)}>Next</button>
      </div>
    </div>
  )
}

export default function App() {
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setToken(token)
      setAuthed(true)
    }
  }, [])

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setAuthed(false)
  }

  if (!authed) {
    return <Auth onAuthed={() => setAuthed(true)} />
  }

  return (
    <div>
      <div className="header">
        <div className="header-inner">
          <div className="brand">Shipsy Todo</div>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </div>
      <TodoList />
    </div>
  )
}


