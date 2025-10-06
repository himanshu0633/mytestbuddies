import { useState, useMemo, useEffect } from 'react'
import api from '../utils/axios'
import { useAuthForm } from '../components/authCommon'

export default function Login() {
  const { form, onChange, error, setError, saveToken } = useAuthForm({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [fieldErr, setFieldErr] = useState({})

  useEffect(() => {
    // Automatically focus the email input field when the component mounts
    document.getElementById('email').focus()
  }, [])

  const validate = (values) => {
    const fe = {}
    if (!values.email?.trim()) fe.email = 'Email is required'
    if (values.email && !/\S+@\S+\.\S+/.test(values.email.trim())) fe.email = 'Invalid email format'
    if (!values.password) fe.password = 'Password is required'
    return fe
  }

  const isDisabled = useMemo(() => {
    const fe = validate(form)
    return loading || Object.keys(fe).length > 0
  }, [form, loading])

  const submit = async (e) => {
    e.preventDefault()
    setFieldErr({})
    setError('')
    const fe = validate(form)
    setFieldErr(fe)
    if (Object.keys(fe).length) return

    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      saveToken(data.token)
    } catch (e) {
      setError(e?.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2 style={headerStyle}>Login</h2>
      <form onSubmit={submit} className="card" style={formStyle} noValidate>
        <div style={inputWrapperStyle}>
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            style={{ ...inputStyle, borderColor: fieldErr.email ? 'red' : '#BDC3C7' }}
            aria-invalid={!!fieldErr.email}
            aria-describedby="email-err"
            placeholder="Enter your email"
          />
          {fieldErr.email && <small id="email-err" style={errorMessageStyle}>{fieldErr.email}</small>}
        </div>

        <div style={inputWrapperStyle}>
          <label htmlFor="password" style={labelStyle}>Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
            style={{ ...inputStyle, borderColor: fieldErr.password ? 'red' : '#BDC3C7' }}
            aria-invalid={!!fieldErr.password}
            aria-describedby="password-err"
            placeholder="Enter your password"
          />
          {fieldErr.password && <small id="password-err" style={errorMessageStyle}>{fieldErr.password}</small>}
        </div>

        {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}

        <button type="submit" disabled={isDisabled} style={buttonStyle}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={linkWrapperStyle}>
        <p style={{ fontSize: '14px' }}>
          Don't have an account? <a href="/register" style={linkStyle}>Register here</a>
        </p>
        <p style={{ fontSize: '14px' }}>
          <a href="/forgot-password" style={linkStyle}>Forgot Password?</a>
        </p>
      </div>
    </div>
  )
}

// Styles for various elements
const headerStyle = {
  color: '#2C3E50',
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '20px'
}

const formStyle = {
  maxWidth: '400px',
  margin: '0 auto',
  padding: '20px',
  borderRadius: '8px',
  backgroundColor: '#ECF0F1',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
}

const inputWrapperStyle = {
  marginBottom: '15px',
}

const labelStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2C3E50',
  marginBottom: '8px',
  display: 'block',
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  border: '1px solid #BDC3C7',
  borderRadius: '5px',
  outline: 'none',
}

const buttonStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  backgroundColor: '#2ECC71',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
}

const errorMessageStyle = {
  color: 'red',
  fontSize: '12px',
  marginTop: '5px',
}

const linkWrapperStyle = {
  marginTop: '20px',
  textAlign: 'center',
}

const linkStyle = {
  color: '#3498DB',
  textDecoration: 'none',
}

