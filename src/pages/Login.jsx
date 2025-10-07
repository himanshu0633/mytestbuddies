import { useState, useMemo, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/axios'
import { useAuthForm } from '../components/authCommon'
import logo from '../image/logofull.png'

export default function Login() {
  const { form, onChange, error, setError, saveToken } = useAuthForm({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [fieldErr, setFieldErr] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.getElementById('email').focus()
  }, [])

  const validate = (values) => {
    const fe = {}
    if (!values.email?.trim()) fe.email = 'Email is required'
    if (values.email && !/\S+@\S+\.\S+/.test(values.email.trim())) fe.email = 'Invalid email format'
    if (!values.password) fe.password = 'Password is required'
    if (values.password && values.password.length < 6) fe.password = 'Password must be at least 6 characters'
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
      // Optional: Show success message before redirect
    } catch (e) {
      setError(e?.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoClick = () => {
    navigate('/')
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div style={containerStyle}>
      {/* Background Decoration */}
      <div style={backgroundDecorationStyle}>
        <div style={floatingCircle1Style}></div>
        <div style={floatingCircle2Style}></div>
        <div style={floatingCircle3Style}></div>
      </div>

      <div style={cardStyle}>
        {/* Logo Section */}
        <div style={logoSectionStyle} onClick={handleLogoClick}>
          <img src={logo} alt="MyTestBuddies Logo" style={logoStyle} />
          <h1 style={brandNameStyle}>MyTestBuddies</h1>
        </div>

        {/* Welcome Section */}
        <div style={welcomeSectionStyle}>
          <h2 style={headerStyle}>Welcome Back! 👋</h2>
          <p style={subtitleStyle}>Sign in to your account to continue your learning journey</p>
        </div>

        {/* Form Section */}
        <form onSubmit={submit} style={formStyle} noValidate>
          {/* Email Field */}
          <div style={inputContainerStyle}>
            <label htmlFor="email" style={labelStyle}>
              <span style={labelIconStyle}>📧</span>
              Email Address
            </label>
            <div style={inputWrapperStyle}>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                style={{
                  ...inputStyle,
                  borderColor: fieldErr.email ? '#e74c3c' : form.email ? '#2ecc71' : '#e0e0e0',
                  paddingLeft: '45px'
                }}
                aria-invalid={!!fieldErr.email}
                aria-describedby="email-err"
                placeholder="Enter your email address"
                disabled={loading}
              />
              <span style={inputIconStyle}>✉️</span>
            </div>
            {fieldErr.email && (
              <small id="email-err" style={errorMessageStyle}>
                ⚠️ {fieldErr.email}
              </small>
            )}
          </div>

          {/* Password Field */}
          <div style={inputContainerStyle}>
            <label htmlFor="password" style={labelStyle}>
              <span style={labelIconStyle}>🔒</span>
              Password
            </label>
            <div style={inputWrapperStyle}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={onChange}
                required
                style={{
                  ...inputStyle,
                  borderColor: fieldErr.password ? '#e74c3c' : form.password ? '#2ecc71' : '#e0e0e0',
                  paddingLeft: '45px',
                  paddingRight: '45px'
                }}
                aria-invalid={!!fieldErr.password}
                aria-describedby="password-err"
                placeholder="Enter your password"
                disabled={loading}
              />
              <span style={inputIconStyle}>🔐</span>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={passwordToggleStyle}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {fieldErr.password && (
              <small id="password-err" style={errorMessageStyle}>
                ⚠️ {fieldErr.password}
              </small>
            )}
          </div>

        

          {/* Error Message */}
          {error && (
            <div style={errorAlertStyle}>
              <span style={errorIconStyle}>❌</span>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isDisabled}
            style={{
              ...buttonStyle,
              ...(isDisabled ? disabledButtonStyle : activeButtonStyle),
              ...(loading ? loadingButtonStyle : {})
            }}
          >
            {loading ? (
              <>
                <span style={spinnerStyle}></span>
                Signing In...
              </>
            ) : (
              <>
                <span style={buttonIconStyle}>🚀</span>
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={dividerStyle}>
          <span style={dividerTextStyle}>New to MyTestBuddies?</span>
        </div>

        {/* Register Link */}
        <Link to="/register" style={registerLinkStyle}>
          <span style={registerIconStyle}>🎯</span>
          Create an Account
        </Link>

     
      </div>
    </div>
  )
}

// Enhanced Styles
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '20px',
  position: 'relative',
  overflow: 'hidden'
}

const backgroundDecorationStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none'
}

const floatingCircle1Style = {
  position: 'absolute',
  top: '10%',
  left: '10%',
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
  animation: 'float 6s ease-in-out infinite'
}

const floatingCircle2Style = {
  position: 'absolute',
  top: '60%',
  right: '10%',
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
  animation: 'float 8s ease-in-out infinite 1s'
}

const floatingCircle3Style = {
  position: 'absolute',
  bottom: '20%',
  left: '20%',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
  animation: 'float 7s ease-in-out infinite 0.5s'
}

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: '40px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '450px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  position: 'relative',
  zIndex: 1
}

const logoSectionStyle = {
  textAlign: 'center',
  marginBottom: '30px',
  cursor: 'pointer',
  transition: 'transform 0.3s ease'
}

const logoStyle = {
  width: '80px',
  height: 'auto',
  marginBottom: '10px',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
}

const brandNameStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  margin: 0
}

const welcomeSectionStyle = {
  textAlign: 'center',
  marginBottom: '30px'
}

const headerStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 10px 0'
}

const subtitleStyle = {
  fontSize: '14px',
  color: '#7f8c8d',
  margin: 0,
  lineHeight: 1.5
}

const formStyle = {
  marginBottom: '25px'
}

const inputContainerStyle = {
  marginBottom: '20px'
}

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#2c3e50',
  marginBottom: '8px'
}

const labelIconStyle = {
  fontSize: '16px'
}

const inputWrapperStyle = {
  position: 'relative'
}

const inputStyle = {
  width: '100%',
  padding: '15px',
  fontSize: '16px',
  border: '2px solid',
  borderRadius: '12px',
  outline: 'none',
  transition: 'all 0.3s ease',
  background: 'rgba(255, 255, 255, 0.8)',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
}

const inputIconStyle = {
  position: 'absolute',
  left: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '18px'
}

const passwordToggleStyle = {
  position: 'absolute',
  right: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
  padding: 0,
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const errorMessageStyle = {
  color: '#e74c3c',
  fontSize: '12px',
  marginTop: '5px',
  display: 'block',
  fontWeight: '500'
}

const forgotPasswordStyle = {
  textAlign: 'right',
  marginBottom: '20px'
}

const forgotPasswordLinkStyle = {
  color: '#3498db',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'color 0.3s ease'
}

const errorAlertStyle = {
  background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)',
  color: '#d63031',
  padding: '12px 16px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: '500',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  border: '1px solid #ff7675'
}

const errorIconStyle = {
  fontSize: '16px'
}

const buttonStyle = {
  width: '100%',
  padding: '16px',
  fontSize: '16px',
  fontWeight: '600',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: 'inherit',
  position: 'relative'
}

const activeButtonStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
}

const disabledButtonStyle = {
  background: '#bdc3c7',
  color: '#7f8c8d',
  cursor: 'not-allowed',
  boxShadow: 'none'
}

const loadingButtonStyle = {
  opacity: 0.8
}

const buttonIconStyle = {
  fontSize: '18px'
}

const spinnerStyle = {
  width: '18px',
  height: '18px',
  border: '2px solid transparent',
  borderTop: '2px solid currentColor',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
}

const dividerStyle = {
  display: 'flex',
  alignItems: 'center',
  margin: '25px 0',
  color: '#95a5a6'
}

const dividerTextStyle = {
  padding: '0 15px',
  fontSize: '14px',
  background: 'rgba(255, 255, 255, 0.95)',
  zIndex: 1
}

const registerLinkStyle = {
  display: 'block',
  textAlign: 'center',
  padding: '14px',
  background: 'linear-gradient(135deg, #74b9ff, #0984e3)',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(116, 185, 255, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px'
}

const registerIconStyle = {
  fontSize: '18px'
}

const demoHintStyle = {
  marginTop: '25px',
  padding: '15px',
  background: 'rgba(116, 185, 255, 0.1)',
  borderRadius: '10px',
  border: '1px solid rgba(116, 185, 255, 0.2)'
}

const demoTextStyle = {
  margin: 0,
  fontSize: '12px',
  color: '#3498db',
  textAlign: 'center',
  lineHeight: 1.4
}

// Add CSS animations
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Hover effects */
  .hover-lift:hover {
    transform: translateY(-2px);
  }
  
  /* Focus styles */
  input:focus {
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  /* Responsive design */
  @media (max-width: 480px) {
    .auth-card {
      padding: 30px 20px;
      margin: 10px;
    }
    
    .auth-header {
      font-size: 24px;
    }
  }
`

// Inject styles
const styleSheet = document.createElement('style')
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

// Add hover effects
Object.assign(logoSectionStyle, {
  ':hover': {
    transform: 'scale(1.05)'
  }
})

Object.assign(forgotPasswordLinkStyle, {
  ':hover': {
    color: '#2980b9'
  }
})

Object.assign(registerLinkStyle, {
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(116, 185, 255, 0.4)'
  }
})

Object.assign(activeButtonStyle, {
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.5)'
  }
})