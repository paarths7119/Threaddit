
import React, { useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const res = await API.post('/auth/login', { email, password })
    localStorage.setItem('threaddit_token', res.data.token)
    localStorage.setItem('threaddit_user', JSON.stringify(res.data.user))
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow">
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded mb-2" placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full border p-2 rounded mb-2" placeholder="Password" />
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Login</button>
      </form>
    </div>
  )
}
