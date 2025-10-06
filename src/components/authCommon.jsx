import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/axios'

export function useAuthForm(initial = {}) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const nav = useNavigate()
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const saveToken = (token) => { localStorage.setItem('token', token); nav('/dashboard') }
  return { form, setForm, error, setError, onChange, saveToken }
}

export function LogoutButton() {
  return <button onClick={() => { localStorage.removeItem('token'); window.location.href='/' }}>Logout</button>
}
