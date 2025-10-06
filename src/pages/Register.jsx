import { useMemo, useState } from 'react'
import api from '../utils/axios'
import { useAuthForm } from '../components/authCommon'

const emailRe = /^\S+@\S+\.\S+$/
const mobileRe = /^[0-9]{7,15}$/

export default function Register() {
  const { form, onChange, error, setError, saveToken } =
    useAuthForm({ name: '', email: '', password: '', mobile: '' })
  const [fieldErr, setFieldErr] = useState({})
  const [loading, setLoading] = useState(false)

  // Keep only digits in mobile as the user types
  const onMobileChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '')
    onChange({ target: { name: 'mobile', value: onlyDigits } })
  }

  const validate = (values) => {
    const fe = {}
    if (!values.name?.trim()) fe.name = 'Name is required'
    if (!values.password) fe.password = 'Password is required'
    if (!values.email && !values.mobile) {
      fe.email = 'Provide email or mobile'
      fe.mobile = 'Provide email or mobile'
    }
    if (values.email && !emailRe.test(values.email.trim())) {
      fe.email = 'Invalid email format'
    }
    if (values.mobile && !mobileRe.test(values.mobile.trim())) {
      fe.mobile = 'Mobile must be 7–15 digits'
    }
    return fe
  }

  const isDisabled = useMemo(() => {
    const fe = validate(form)
    return loading || Object.keys(fe).length > 0
  }, [form, loading])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const fe = validate(form)
    setFieldErr(fe)
    if (Object.keys(fe).length) return

    setLoading(true)
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email?.trim() || undefined,
        mobile: form.mobile?.trim() || undefined,
        password: form.password
      }
      const { data } = await api.post('/auth/register', payload)
      saveToken(data.token)
    } catch (e) {
      setError(e?.response?.data?.error || 'Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={containerStyle}>
      <h2 style={headerStyle}>Register</h2>
      <form onSubmit={submit} className="card" style={formStyle} noValidate>
        <div style={inputWrapperStyle}>
          <label htmlFor="name" style={labelStyle}>Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            autoComplete="name"
            required
            style={inputStyle}
            aria-invalid={!!fieldErr.name}
            aria-describedby="name-err"
          />
          {fieldErr.name && <small id="name-err" style={errorMessageStyle}>{fieldErr.name}</small>}
        </div>

        <div style={inputWrapperStyle}>
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            autoComplete="email"
            style={inputStyle}
            aria-invalid={!!fieldErr.email}
            aria-describedby="email-err"
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
            autoComplete="new-password"
            required
            style={inputStyle}
            aria-invalid={!!fieldErr.password}
            aria-describedby="pass-err"
          />
          {fieldErr.password && <small id="pass-err" style={errorMessageStyle}>{fieldErr.password}</small>}
        </div>

        <div style={inputWrapperStyle}>
          <label htmlFor="mobile" style={labelStyle}>Mobile</label>
          <input
            id="mobile"
            type="tel"
            name="mobile"
            value={form.mobile}
            onChange={onMobileChange}
            inputMode="numeric"
            pattern="[0-9]{7,15}"
            placeholder="digits only"
            autoComplete="tel"
            style={inputStyle}
            aria-invalid={!!fieldErr.mobile}
            aria-describedby="mobile-err"
          />
          {fieldErr.mobile && <small id="mobile-err" style={errorMessageStyle}>{fieldErr.mobile}</small>}
        </div>

       
        {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}

        <button type="submit" disabled={isDisabled} style={buttonStyle}>
          {loading ? <span style={{ marginRight: 8 }}>⏳</span> : null} Create account
        </button>
      </form>

      <div style={footerStyle}>
        <p>Already have an account? <a href="/login" style={linkStyle}>Login here</a></p>
      </div>
    </div>
  )
}

// Styles for various elements
const containerStyle = {
  padding: '20px',
  maxWidth: '500px',
  margin: '0 auto',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
}

const headerStyle = {
  textAlign: 'center',
  fontSize: '32px',
  color: '#2C3E50',
  marginBottom: '20px',
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  padding: '20px',
  borderRadius: '8px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
}

const inputWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
}

const labelStyle = {
  fontSize: '16px',
  color: '#2C3E50',
}

const inputStyle = {
  padding: '12px',
  fontSize: '16px',
  border: '1px solid #BDC3C7',
  borderRadius: '5px',
  marginTop: '8px',
  outline: 'none',
}

const buttonStyle = {
  padding: '14px',
  backgroundColor: '#2ECC71',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
}

const errorMessageStyle = {
  color: 'red',
  fontSize: '12px',
  marginTop: '5px',
}

const footerStyle = {
  textAlign: 'center',
  marginTop: '20px',
  fontSize: '14px',
}

const linkStyle = {
  color: '#3498DB',
  textDecoration: 'none',
}

