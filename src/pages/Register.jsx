import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuthForm } from '../components/authCommon';
import logo from '../image/logofull.png';

export default function Register() {
  const { form, onChange, saveToken } = useAuthForm({
    name: '',
    email: '',
    password: '',
    mobile: '',
    userType: '',
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');

  // validation + OTP
  const [errors, setErrors] = useState({});
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // resend countdown (seconds)
  const RESEND_WINDOW = 30; // change if needed
  const [resendTimer, setResendTimer] = useState(0);

  // Toast/Snackbar
  const [toasts, setToasts] = useState([]);
  const showToast = (type, message) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000); // auto-hide in 3s
  };
  const removeToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const navigate = useNavigate();

  // only digits, clamp to 10
  const onMobileChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
    onChange({ target: { name: 'mobile', value: onlyDigits } });
  };

  const validateStep1 = () => {
    const newErr = {};
    if (!form.name?.trim()) newErr.name = 'Full name is required';
    if (!form.email?.trim()) {
      newErr.email = 'Email is required';
    } else {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
      if (!emailOk) newErr.email = 'Enter a valid email';
    }
    if (!form.password) {
      newErr.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErr.password = 'Password must be at least 6 characters';
    }
    if (!form.mobile) {
      newErr.mobile = 'WhatsApp number is required';
    } else if (form.mobile.length !== 10) {
      newErr.mobile = 'Enter exactly 10 digits';
    }
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  // Step 1 submit: validate + send OTP → open modal
    const submitStep1 = async (e) => {

      
      e.preventDefault();
      setInfoMsg('');
      setOtpError('');
      if (!validateStep1()) {
        showToast('error', 'Please fix the highlighted fields.');
        return;
      }

      try {
        setOtpSending(true);
        await api.post('/auth/send-otp', { email: form.email }); // adjust if needed
        setOtpModalOpen(true);
        setInfoMsg('OTP sent to your email. Please check inbox/spam.');
        setResendTimer(RESEND_WINDOW);
        showToast('success', 'OTP sent successfully.');
      } catch (err) {
        console.error('OTP send error:', err);
        setInfoMsg('');
        setErrors((prev) => ({ ...prev, email: 'Failed to send OTP. Please try again.' }));
        showToast('error', 'Failed to send OTP.');
      } finally {
        setOtpSending(false);
      }
    };

  const verifyOtpAndContinue = async () => {
    setOtpError('');
    if (!otp.trim()) {
      setOtpError('Please enter the OTP');
      return;
    }
    try {
      setOtpVerifying(true);
      await api.post('/auth/verify-otp', { email: form.email, otp }); // adjust if needed
      setOtpModalOpen(false);
      setStep(2);
      showToast('success', 'Email verified!');
    } catch (err) {
      console.error('OTP verify error:', err);
      setOtpError('Invalid or expired OTP. Please try again.');
      showToast('error', 'Invalid or expired OTP.');
    } finally {
      setOtpVerifying(false);
    }
  };

  const resendOtp = async () => {
    if (resendTimer > 0) return;
    setOtpError('');
    setInfoMsg('');
    try {
      setOtpSending(true);
      await api.post('/auth/send-otp', { email: form.email });
      setInfoMsg('OTP re-sent to your email.');
      setResendTimer(RESEND_WINDOW);
      showToast('info', 'OTP re-sent.');
    } catch (err) {
      console.error('Resend OTP error:', err);
      setOtpError('Failed to resend OTP.');
      showToast('error', 'Failed to resend OTP.');
    } finally {
      setOtpSending(false);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  // Final submit after user type
  const submitStep2 = async () => {
    if (!userType) {
      showToast('error', 'Please select a user type.');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        userType: userType,
      };
      await api.post('/auth/register', payload);
      showToast('success', 'Account created! Redirecting to login…');
      saveToken('mock-token'); // remove if not needed
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      showToast('error', 'Registration failed. Try again.');
      navigate('/login'); // or stay on page and show errors
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => navigate('/');

  // Progress steps
  const steps = useMemo(
    () => [
      { number: 1, label: 'Basic Info', active: step === 1, completed: step > 1 },
      { number: 2, label: 'User Type', active: step === 2, completed: false },
    ],
    [step]
  );

  const hasStep1AllFilled =
    form.name?.trim() &&
    form.email?.trim() &&
    form.password &&
    form.mobile &&
    form.mobile.length === 10;

  // Helpers for mm:ss
  const fmt = (s) => `0:${String(s).padStart(2, '0')}`;

  return (
    <div style={containerStyle}>
      <div style={backgroundDecorationStyle}>
        <div style={floatingCircle1Style}></div>
        <div style={floatingCircle2Style}></div>
      </div>

      <div style={cardStyle}>
        <div style={logoSectionStyle} onClick={handleLogoClick}>
          <img src={logo} alt="MyTestBuddies Logo" style={logoStyle} />
          <h1 style={brandNameStyle}>MyTestBuddies</h1>
        </div>

        {/* Progress */}
        <div style={progressContainerStyle}>
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} style={progressStepStyle}>
              <div
                style={{
                  ...progressCircleStyle,
                  ...(stepItem.active ? progressCircleActiveStyle : {}),
                  ...(stepItem.completed ? progressCircleCompletedStyle : {}),
                }}
              >
                {stepItem.completed ? '✓' : stepItem.number}
              </div>
              <div style={progressLabelStyle}>{stepItem.label}</div>
              {index < steps.length - 1 && <div style={progressLineStyle}></div>}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div style={formContainerStyle}>
            <div style={welcomeSectionStyle}>
              <h2 style={headerStyle}>Create Your Account</h2>
              <p style={subtitleStyle}>Join thousands of learners and test takers</p>
            </div>

            <form onSubmit={submitStep1} style={formStyle} noValidate>
              <div style={inputContainerStyle}>
                <label htmlFor="name" style={labelStyle}>👤 Full Name</label>
                <div style={inputWrapperStyle}>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) => {
                      setErrors((p) => ({ ...p, name: '' }));
                      onChange(e);
                    }}
                    style={inputStyle}
                    placeholder="Enter your full name"
                    required
                    aria-invalid={!!errors.name}
                  />
                </div>
                {errors.name && <div style={errorTextStyle}>{errors.name}</div>}
              </div>

              <div style={inputContainerStyle}>
                <label htmlFor="email" style={labelStyle}>📧 Email Address</label>
                <div style={inputWrapperStyle}>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => {
                      setErrors((p) => ({ ...p, email: '' }));
                      onChange(e);
                    }}
                    style={inputStyle}
                    placeholder="Enter your email address"
                    required
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && <div style={errorTextStyle}>{errors.email}</div>}
              </div>

              <div style={inputContainerStyle}>
                <label htmlFor="password" style={labelStyle}>🔒 Password</label>
                <div style={inputWrapperStyle}>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={(e) => {
                      setErrors((p) => ({ ...p, password: '' }));
                      onChange(e);
                    }}
                    style={inputStyle}
                    placeholder="Create a password (min 6 chars)"
                    required
                    aria-invalid={!!errors.password}
                    minLength={6}
                  />
                </div>
                {errors.password && <div style={errorTextStyle}>{errors.password}</div>}
              </div>

              <div style={inputContainerStyle}>
                <label htmlFor="mobile" style={labelStyle}>📱 WhatsApp Number</label>
                <div style={inputWrapperStyle}>
                  <input
                    id="mobile"
                    type="tel"
                    name="mobile"
                    inputMode="numeric"
                    pattern="\d{10}"
                    maxLength={10}
                    value={form.mobile}
                    onChange={(e) => {
                      setErrors((p) => ({ ...p, mobile: '' }));
                      onMobileChange(e);
                    }}
                    style={inputStyle}
                    placeholder="Enter 10-digit mobile number"
                    required
                    aria-invalid={!!errors.mobile}
                  />
                </div>
                {errors.mobile && <div style={errorTextStyle}>{errors.mobile}</div>}
              </div>

              <button
                type="submit"
                style={{ ...buttonStyle, ...activeButtonStyle }}
                disabled={!hasStep1AllFilled || otpSending}
              >
                {otpSending ? 'Sending OTP...' : 'Continue to User Type →'}
              </button>
              {infoMsg && <div style={infoMsgStyle}>{infoMsg}</div>}
            </form>
          </div>
        )}

        {/* Step 2 - User Type */}
        {step === 2 && (
          <div style={formContainerStyle}>
            <div style={welcomeSectionStyle}>
              <h2 style={headerStyle}>Select Your Profile</h2>
              <p style={subtitleStyle}>Choose how you'll use MyTestBuddies</p>
            </div>

            <div style={userTypeContainerStyle}>
              <div
                style={{
                  ...userTypeCardStyle,
                  ...(userType === 'student' ? userTypeCardActiveStyle : {}),
                }}
                onClick={() => setUserType('student')}
              >
                <div style={userTypeIconStyle}>🎓</div>
                <h3 style={userTypeTitleStyle}>Student</h3>
                <p style={userTypeDescriptionStyle}>
                  Perfect for learners preparing for exams and tests
                </p>
                <div style={userTypeFeaturesStyle}>
                  <div style={featureStyle}>✓ Access to practice tests</div>
                  <div style={featureStyle}>✓ Progress tracking</div>
                  <div style={featureStyle}>✓ Study materials</div>
                </div>
              </div>

              <div
                style={{
                  ...userTypeCardStyle,
                  ...(userType === 'general' ? userTypeCardActiveStyle : {}),
                }}
                onClick={() => setUserType('general')}
              >
                <div style={userTypeIconStyle}>👤</div>
                <h3 style={userTypeTitleStyle}>General User</h3>
                <p style={userTypeDescriptionStyle}>
                  For professionals and casual learners
                </p>
                <div style={userTypeFeaturesStyle}>
                  <div style={featureStyle}>✓ Basic test access</div>
                  <div style={featureStyle}>✓ Skill assessments</div>
                  <div style={featureStyle}>✓ Learning resources</div>
                </div>
              </div>
            </div>

            <button
              onClick={submitStep2}
              style={{ ...buttonStyle, ...activeButtonStyle }}
              disabled={!userType || loading}
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </div>
        )}

        {/* Login Link */}
        <div style={loginLinkStyle}>
          <p style={loginTextStyle}>
            Already have an account?{' '}
            <Link to="/login" style={linkStyle}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      {otpModalOpen && (
        <div style={modalBackdropStyle} role="dialog" aria-modal="true" aria-labelledby="otpTitle">
          <div style={modalCardStyle}>
            <h3 id="otpTitle" style={modalTitleStyle}>Verify Email</h3>
            <p style={modalTextStyle}>
              Enter the 6-digit OTP sent to <strong>{form.email}</strong>
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter OTP"
              style={otpInputStyle}
              autoFocus
            />
            {otpError && <div style={errorTextStyle}>{otpError}</div>}

            <div style={modalActionsRowStyle}>
              <button
                onClick={resendOtp}
                style={{
                  ...secondaryBtnStyle,
                  ...(resendTimer > 0 ? secondaryBtnDisabledStyle : {}),
                }}
                disabled={otpSending || resendTimer > 0}
              >
                {otpSending
                  ? 'Resending...'
                  : resendTimer > 0
                  ? `Resend in ${fmt(resendTimer)}`
                  : 'Resend OTP'}
              </button>

              <button
                onClick={verifyOtpAndContinue}
                style={{ ...buttonStyle, ...activeButtonStyle, minWidth: 160 }}
                disabled={otpVerifying || otp.length !== 6}
              >
                {otpVerifying ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </div>

            <button onClick={() => setOtpModalOpen(false)} style={modalCloseStyle} aria-label="Close">×</button>
          </div>
        </div>
      )}

      {/* Toasts / Snackbar */}
      <div style={toastContainerStyle} aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} style={{ ...toastStyle, ...toastTypeStyle[t.type] }}>
            <span style={{ fontWeight: 600, marginRight: 6, textTransform: 'capitalize' }}>
              {t.type}
            </span>
            <span>{t.message}</span>
            <button onClick={() => removeToast(t.id)} style={toastCloseStyle} aria-label="Close">×</button>
          </div>
        ))}
      </div>

      {/* CSS animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

/* ------------ Styles (incl. error, modal, toast) ------------ */

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '20px',
  position: 'relative',
  overflow: 'hidden',
};

const backgroundDecorationStyle = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' };
const floatingCircle1Style = { position: 'absolute', top: '10%', right: '10%', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', animation: 'float 6s ease-in-out infinite' };
const floatingCircle2Style = { position: 'absolute', bottom: '20%', left: '10%', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite 1s' };

const cardStyle = { background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '40px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '500px', border: '1px solid rgba(255, 255, 255, 0.2)', position: 'relative', zIndex: 1 };

const logoSectionStyle = { textAlign: 'center', marginBottom: '30px', cursor: 'pointer', transition: 'transform 0.3s ease' };
const logoStyle = { width: '80px', height: 'auto', marginBottom: '10px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' };
const brandNameStyle = { fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 };

const progressContainerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', position: 'relative' };
const progressStepStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' };
const progressCircleStyle = { width: '40px', height: '40px', borderRadius: '50%', background: '#ecf0f1', border: '2px solid #bdc3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#7f8c8d', cursor: 'pointer', transition: 'all 0.3s ease', zIndex: 2 };
const progressCircleActiveStyle = { background: '#3498db', borderColor: '#3498db', color: 'white', transform: 'scale(1.1)' };
const progressCircleCompletedStyle = { background: '#2ecc71', borderColor: '#2ecc71', color: 'white' };
const progressLabelStyle = { fontSize: '12px', color: '#7f8c8d', marginTop: '8px', textAlign: 'center', fontWeight: '500' };
const progressLineStyle = { position: 'absolute', top: '20px', left: '60%', right: '-40%', height: '2px', background: '#bdc3c7', zIndex: 1 };

const formContainerStyle = { marginBottom: '25px' };
const welcomeSectionStyle = { textAlign: 'center', marginBottom: '30px' };
const headerStyle = { fontSize: '28px', fontWeight: 'bold', color: '#2c3e50', margin: '0 0 10px 0' };
const subtitleStyle = { fontSize: '14px', color: '#7f8c8d', margin: 0, lineHeight: 1.5 };
const formStyle = { marginBottom: '25px' };

const inputContainerStyle = { marginBottom: '12px' };
const labelStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' };
const inputWrapperStyle = { position: 'relative' };
const inputStyle = { width: '100%', padding: '15px', fontSize: '16px', border: '2px solid #ecf0f1', borderRadius: '12px', outline: 'none', transition: 'all 0.3s ease', background: 'rgba(255, 255, 255, 0.8)', boxSizing: 'border-box', fontFamily: 'inherit' };

const buttonStyle = { width: '100%', padding: '16px', fontSize: '16px', fontWeight: '600', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' };
const activeButtonStyle = { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)' };

const errorTextStyle = { color: '#e74c3c', fontSize: '12px', marginTop: '6px' };
const infoMsgStyle = { color: '#2c3e50', fontSize: '12px', marginTop: '10px' };

const userTypeContainerStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' };
const userTypeCardStyle = { padding: '20px', border: '2px solid #ecf0f1', borderRadius: '15px', cursor: 'pointer', transition: 'all 0.3s ease', textAlign: 'center', background: 'white' };
const userTypeCardActiveStyle = { borderColor: '#3498db', background: 'linear-gradient(135deg, #74b9ff20, #0984e320)', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(116, 185, 255, 0.2)' };
const userTypeIconStyle = { fontSize: '40px', marginBottom: '15px' };
const userTypeTitleStyle = { fontSize: '18px', fontWeight: 'bold', color: '#2c3e50', margin: '0 0 10px 0' };
const userTypeDescriptionStyle = { fontSize: '12px', color: '#7f8c8d', margin: '0 0 15px 0', lineHeight: 1.4 };
const userTypeFeaturesStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
const featureStyle = { fontSize: '11px', color: '#27ae60', fontWeight: '500' };

const loginLinkStyle = { textAlign: 'center', marginTop: '25px', paddingTop: '25px', borderTop: '1px solid #ecf0f1' };
const loginTextStyle = { fontSize: '14px', color: '#7f8c8d', margin: 0 };
const linkStyle = { color: '#3498db', textDecoration: 'none', fontWeight: '600' };

/* Modal */
const modalBackdropStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};
const modalCardStyle = {
  background: '#fff',
  borderRadius: '12px',
  padding: '24px',
  width: '100%',
  maxWidth: '380px',
  position: 'relative',
  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
};
const modalTitleStyle = { margin: 0, marginBottom: '8px', color: '#2c3e50' };
const modalTextStyle = { margin: 0, marginBottom: '16px', color: '#7f8c8d', fontSize: '14px' };
const otpInputStyle = {
  width: '100%',
  padding: '14px',
  border: '2px solid #ecf0f1',
  borderRadius: '10px',
  fontSize: '18px',
  textAlign: 'center',
  letterSpacing: '6px',
  marginBottom: '12px',
};
const modalActionsRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: '8px' };
const secondaryBtnStyle = {
  padding: '12px 16px',
  borderRadius: '10px',
  border: '2px solid #ecf0f1',
  background: '#fff',
  cursor: 'pointer',
  minWidth: 140,
};
const secondaryBtnDisabledStyle = { opacity: 0.6, cursor: 'not-allowed' };
const modalCloseStyle = {
  position: 'absolute',
  top: 8,
  right: 12,
  background: 'transparent',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
};

/* Toast/Snackbar */
const toastContainerStyle = {
  position: 'fixed',
  bottom: 20,
  right: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  zIndex: 10000,
};
const toastStyle = {
  minWidth: 260,
  maxWidth: 360,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 14px',
  borderRadius: 10,
  boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
  color: '#2c3e50',
  background: '#fff',
  borderLeft: '6px solid #bdc3c7',
};
const toastTypeStyle = {
  success: { borderLeftColor: '#2ecc71' },
  error: { borderLeftColor: '#e74c3c' },
  info: { borderLeftColor: '#3498db' },
};
const toastCloseStyle = {
  marginLeft: 'auto',
  background: 'transparent',
  border: 'none',
  fontSize: 18,
  cursor: 'pointer',
  color: '#7f8c8d',
};
