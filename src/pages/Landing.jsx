import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#2C3E50' }}>Quiz Platform</h1>
      <p style={{ fontSize: '18px', color: '#34495E', maxWidth: '600px', margin: 'auto' }}>
        JEE Main / RMS practice tests, secure UPI payment (UTR) and unlock access after admin verification.
      </p>

      <div className="features" style={{ marginTop: '30px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '24px', color: '#2C3E50' }}>Features</h3>
        <div className="feature-list" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '300px' }}>
            <h4 style={{ color: '#16A085' }}>Practice Tests</h4>
            <p>Access to a variety of practice tests for JEE Main & RMS exams.</p>
          </div>
          <div style={{ maxWidth: '300px' }}>
            <h4 style={{ color: '#16A085' }}>Secure Payment</h4>
            <p>Complete your payment securely via UPI (UTR).</p>
          </div>
          <div style={{ maxWidth: '300px' }}>
            <h4 style={{ color: '#16A085' }}>Admin Verification</h4>
            <p>Access unlocked once verified by the admin.</p>
          </div>
        </div>
      </div>

      <div className="cta" style={{ marginTop: '40px' }}>
        <h3 style={{ color: '#34495E' }}>Get Started with Your Practice!</h3>
        <div className="card" style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <Link to="/register">
            <button style={buttonStyle}>Register</button>
          </Link>
          <Link to="/login">
            <button style={{ ...buttonStyle, backgroundColor: '#3498DB' }}>Login</button>
          </Link>
        </div>
      </div>

      <div className="footer" style={{ marginTop: '40px', fontSize: '14px', color: '#7F8C8D' }}>
        <p>Powered by Quiz Platform Team</p>
        <p>© 2025 All Rights Reserved</p>
      </div>
    </div>
  )
}

// Styles for the buttons
const buttonStyle = {
  padding: '12px 24px',
  fontSize: '16px',
  backgroundColor: '#2ECC71',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
}

