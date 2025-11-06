
import React, { useState } from 'react'
import API from '../api'

export default function PostForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!title) return
    await API.post('/posts', { title, body })
    setTitle('')
    setBody('')
    onCreate()
  }

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-4">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" className="w-full border p-2 rounded mb-2" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Details (optional)" className="w-full border p-2 rounded mb-2" />
      <button className="px-4 py-2 bg-green-600 text-white rounded">Create Post</button>
    </form>
  )
}
