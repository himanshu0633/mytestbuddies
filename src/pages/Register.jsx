import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuthForm } from '../components/authCommon';
import logo from '../image/logofull.png';
import qrCodeimage from '../image/qr.png';

const emailRe = /^\S+@\S+\.\S+$/;
const mobileRe = /^[0-9]{7,15}$/;

export default function Register() {
  const { form, onChange, error, setError, saveToken } =
    useAuthForm({ name: '', email: '', password: '', mobile: '' });
  const [fieldErr, setFieldErr] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onMobileChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    onChange({ target: { name: 'mobile', value: onlyDigits } });
  };

  const validate = (values) => {
    const fe = {};
    if (!values.name?.trim()) fe.name = 'Name is required';
    if (!values.password) fe.password = 'Password is required';
    if (values.password && values.password.length < 6) fe.password = 'Password must be at least 6 characters';
    if (!values.email && !values.mobile) {
      fe.email = 'Provide email or mobile';
      fe.mobile = 'Provide email or mobile';
    }
    if (values.email && !emailRe.test(values.email.trim())) {
      fe.email = 'Invalid email format';
    }
    if (values.mobile && !mobileRe.test(values.mobile.trim())) {
      fe.mobile = 'Mobile must be 7–15 digits';
    }
    return fe;
  };

  const isDisabled = Object.keys(validate(form)).length > 0 || loading;

  const submitStep1 = async (e) => {
    e.preventDefault();
    const fe = validate(form);
    setFieldErr(fe);
    if (Object.keys(fe).length) return;
    setStep(2);
  };

  const submitStep2 = () => {
    if (userType === "") {
      setFieldErr({ ...fieldErr, userType: "Please select user type" });
      return;
    }
    setStep(3);
  };

  const submitStep3 = async () => {
    if (!qrCode || qrCode.length < 16) {
      setFieldErr({ ...fieldErr, qrCode: "Please enter a valid transaction ID (at least 16 characters)" });
      return;
    }
    setStep(4);
  };

  const submitPayment = async () => {
    setLoading(true);
    try {
      // Mock payment processing
      setTimeout(() => {
        setPaymentStatus("paid");
        // In real app, you would call your API here
        // await api.post('/auth/register', form);
        saveToken('mock-token');
        setLoading(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const goToStep = (stepNumber) => {
    if (stepNumber < step) {
      setStep(stepNumber);
    }
  };

  const ProgressSteps = () => (
    <div style={progressContainerStyle}>
      {[1, 2, 3, 4].map((stepNumber) => (
        <div key={stepNumber} style={progressStepStyle}>
          <div
            style={{
              ...progressCircleStyle,
              ...(stepNumber === step ? progressCircleActiveStyle : {}),
              ...(stepNumber < step ? progressCircleCompletedStyle : {})
            }}
            onClick={() => goToStep(stepNumber)}
          >
            {stepNumber < step ? '✓' : stepNumber}
          </div>
          <div style={progressLabelStyle}>
            {stepNumber === 1 && 'Basic Info'}
            {stepNumber === 2 && 'User Type'}
            {stepNumber === 3 && 'Payment'}
            {stepNumber === 4 && 'Complete'}
          </div>
          {stepNumber < 4 && <div style={progressLineStyle}></div>}
        </div>
      ))}
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* Background Decoration */}
      <div style={backgroundDecorationStyle}>
        <div style={floatingCircle1Style}></div>
        <div style={floatingCircle2Style}></div>
      </div>

      <div style={cardStyle}>
        {/* Logo Section */}
        <div style={logoSectionStyle} onClick={handleLogoClick}>
          <img src={logo} alt="MyTestBuddies Logo" style={logoStyle} />
          <h1 style={brandNameStyle}>MyTestBuddies</h1>
        </div>

        {/* Progress Steps */}
        <ProgressSteps />

        {/* Welcome Section */}
        <div style={welcomeSectionStyle}>
          <h2 style={headerStyle}>Create Your Account 🚀</h2>
          <p style={subtitleStyle}>Join thousands of students preparing for competitive exams</p>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <form onSubmit={submitStep1} style={formStyle} noValidate>
            <div style={inputContainerStyle}>
              <label htmlFor="name" style={labelStyle}>
                <span style={labelIconStyle}>👤</span>
                Full Name
              </label>
              <div style={inputWrapperStyle}>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  autoComplete="name"
                  required
                  style={{
                    ...inputStyle,
                    borderColor: fieldErr.name ? '#e74c3c' : form.name ? '#2ecc71' : '#e0e0e0',
                    paddingLeft: '45px'
                  }}
                  placeholder="Enter your full name"
                  aria-invalid={!!fieldErr.name}
                  aria-describedby="name-err"
                />
                <span style={inputIconStyle}>📝</span>
              </div>
              {fieldErr.name && (
                <small id="name-err" style={errorMessageStyle}>
                  ⚠️ {fieldErr.name}
                </small>
              )}
            </div>

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
                  autoComplete="email"
                  style={{
                    ...inputStyle,
                    borderColor: fieldErr.email ? '#e74c3c' : form.email ? '#2ecc71' : '#e0e0e0',
                    paddingLeft: '45px'
                  }}
                  placeholder="Enter your email address"
                  aria-invalid={!!fieldErr.email}
                  aria-describedby="email-err"
                />
                <span style={inputIconStyle}>✉️</span>
              </div>
              {fieldErr.email && (
                <small id="email-err" style={errorMessageStyle}>
                  ⚠️ {fieldErr.email}
                </small>
              )}
            </div>

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
                  autoComplete="new-password"
                  required
                  style={{
                    ...inputStyle,
                    borderColor: fieldErr.password ? '#e74c3c' : form.password ? '#2ecc71' : '#e0e0e0',
                    paddingLeft: '45px',
                    paddingRight: '45px'
                  }}
                  placeholder="Create a strong password"
                  aria-invalid={!!fieldErr.password}
                  aria-describedby="pass-err"
                />
                <span style={inputIconStyle}>🔐</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={passwordToggleStyle}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {fieldErr.password && (
                <small id="pass-err" style={errorMessageStyle}>
                  ⚠️ {fieldErr.password}
                </small>
              )}
            </div>

            <div style={inputContainerStyle}>
              <label htmlFor="mobile" style={labelStyle}>
                <span style={labelIconStyle}>📱</span>
                Mobile Number
              </label>
              <div style={inputWrapperStyle}>
                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={onMobileChange}
                  inputMode="numeric"
                  pattern="[0-9]{7,15}"
                  placeholder="Enter your mobile number"
                  autoComplete="tel"
                  style={{
                    ...inputStyle,
                    borderColor: fieldErr.mobile ? '#e74c3c' : form.mobile ? '#2ecc71' : '#e0e0e0',
                    paddingLeft: '45px'
                  }}
                  aria-invalid={!!fieldErr.mobile}
                  aria-describedby="mobile-err"
                />
                <span style={inputIconStyle}>📞</span>
              </div>
              {fieldErr.mobile && (
                <small id="mobile-err" style={errorMessageStyle}>
                  ⚠️ {fieldErr.mobile}
                </small>
              )}
            </div>

            <button
              type="submit"
              disabled={isDisabled}
              style={{
                ...buttonStyle,
                ...(isDisabled ? disabledButtonStyle : activeButtonStyle)
              }}
            >
              <span style={buttonIconStyle}>➡️</span>
              Continue to User Type
            </button>
          </form>
        )}

        {/* Step 2: User Type Selection */}
        {step === 2 && (
          <div style={formStyle}>
            <h3 style={stepTitleStyle}>Select Your Profile 🎯</h3>
            <p style={stepSubtitleStyle}>Choose how you'll be using MyTestBuddies</p>

            <div style={userTypeContainerStyle}>
              <div
                style={{
                  ...userTypeCardStyle,
                  ...(userType === "student" ? userTypeCardActiveStyle : {})
                }}
                onClick={() => setUserType("student")}
              >
                <div style={userTypeIconStyle}>🎓</div>
                <h4 style={userTypeTitleStyle}>Student</h4>
                <p style={userTypeDescriptionStyle}>
                  Preparing for competitive exams, school/college tests, and academic goals
                </p>
                <div style={userTypeFeaturesStyle}>
                  <span style={featureStyle}>✓ Daily Quizzes</span>
                  <span style={featureStyle}>✓ Performance Reports</span>
                  <span style={featureStyle}>✓ Exam Preparation</span>
                </div>
              </div>

              <div
                style={{
                  ...userTypeCardStyle,
                  ...(userType === "general" ? userTypeCardActiveStyle : {})
                }}
                onClick={() => setUserType("general")}
              >
                <div style={userTypeIconStyle}>👥</div>
                <h4 style={userTypeTitleStyle}>General User</h4>
                <p style={userTypeDescriptionStyle}>
                  Lifelong learner, professional, or anyone interested in testing knowledge
                </p>
                <div style={userTypeFeaturesStyle}>
                  <span style={featureStyle}>✓ Skill Development</span>
                  <span style={featureStyle}>✓ Knowledge Testing</span>
                  <span style={featureStyle}>✓ Personal Growth</span>
                </div>
              </div>
            </div>

            {fieldErr.userType && (
              <div style={errorAlertStyle}>
                ⚠️ {fieldErr.userType}
              </div>
            )}

            <div style={buttonGroupStyle}>
              <button
                onClick={() => setStep(1)}
                style={secondaryButtonStyle}
              >
                ← Back
              </button>
              <button
                onClick={submitStep2}
                disabled={!userType}
                style={{
                  ...buttonStyle,
                  ...(!userType ? disabledButtonStyle : activeButtonStyle)
                }}
              >
                Continue to Payment →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div style={formStyle}>
            <h3 style={stepTitleStyle}>Complete Payment 💰</h3>
            <p style={stepSubtitleStyle}>Special Diwali offer - Limited time discount!</p>

            <div style={paymentCardStyle}>
              <div style={pricingStyle}>
                <div style={originalPriceStyle}>
                  <span style={originalPriceTextStyle}>Original Price: </span>
                  <span style={priceStrikeStyle}>₹250</span>
                </div>
                <div style={discountedPriceStyle}>
                  <span style={discountedPriceTextStyle}>Diwali Offer: </span>
                  <span style={discountedPriceAmountStyle}>₹100</span>
                </div>
                <div style={savingsStyle}>
                  🎉 You save ₹150 (60% OFF)
                </div>
              </div>

              <div style={paymentMethodsStyle}>
                <h4 style={methodsTitleStyle}>Payment Methods</h4>
                <div style={methodOptionsStyle}>
                  <div style={methodOptionStyle}>
                    <span style={methodIconStyle}>📱</span>
                    UPI Payment
                  </div>
                  {/* <div style={methodOptionStyle}>
                    <span style={methodIconStyle}>💳</span>
                    Credit/Debit Card
                  </div>
                  <div style={methodOptionStyle}>
                    <span style={methodIconStyle}>🏦</span>
                    Net Banking
                  </div> */}
                </div>
              </div>

              <div style={qrSectionStyle}>
                <h4 style={qrTitleStyle}>Scan QR Code to Pay</h4>
                <div style={qrPlaceholderStyle}>
                  {/* <div style={qrCodeStyle}> */}
                    <img src={qrCodeimage} style={{ width: '200px', height: '200px' }} />
                  {/* </div> */}
                  <p style={qrInstructionsStyle}>
                    Scan this QR code with any UPI app to complete payment
                  </p>
                </div>
              </div>

              <div style={uploadSectionStyle}>
                <h4 style={uploadTitleStyle}>Upload Payment Proof</h4>
                <input
                  type="file"
                  onChange={(e) => setQrCode(e.target.files[0])}
                  style={fileInputStyle}
                  accept="image/*,.pdf"
                />
                <p style={uploadHintStyle}>OR</p>
                <h5 style={utrTitleStyle}>Enter Transaction ID (UTR)</h5>
                <input
                  type="text"
                  placeholder="Enter your 16-digit UTR number"
                  onChange={(e) => setQrCode(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {fieldErr.qrCode && (
                <div style={errorAlertStyle}>
                  ⚠️ {fieldErr.qrCode}
                </div>
              )}

              <div style={buttonGroupStyle}>
                <button
                  onClick={() => setStep(2)}
                  style={secondaryButtonStyle}
                >
                  ← Back
                </button>
                <button
                  onClick={submitStep3}
                  disabled={!qrCode}
                  style={{
                    ...buttonStyle,
                    ...(!qrCode ? disabledButtonStyle : activeButtonStyle)
                  }}
                >
                  Verify Payment →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment Processing */}
        {step === 4 && (
          <div style={formStyle}>
            <h3 style={stepTitleStyle}>Almost There! 🎉</h3>

            <div style={paymentStatusStyle}>
              {/* {paymentStatus === "pending" ? (
                <div style={processingStyle}>
                  <div style={spinnerStyle}></div>
                  <h4 style={statusTitleStyle}>Processing Your Payment</h4>
                  <p style={statusTextStyle}>
                    Please wait while we verify your payment details...
                  </p>
                  <button
                    onClick={submitPayment}
                    disabled={loading}
                    style={{
                      ...buttonStyle,
                      ...activeButtonStyle
                    }}
                  >
                    {loading ? (
                      <>
                        <span style={smallSpinnerStyle}></span>
                        Processing...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                </div>
              ) : ( */}
                <div style={successStyle}>
                  <div style={successIconStyle}>✅</div>
                  <h4 style={statusTitleStyle}>Payment Successful!</h4>
                  <p style={statusTextStyle}>
                    Your registration is complete. Welcome to MyTestBuddies!
                  </p>
                  <div style={successActionsStyle}>
                    <Link to="/login" style={successButtonStyle}>
                      Proceed to Login →
                    </Link>
                  </div>
                </div>
              {/* )} */}
            </div>
          </div>
        )}

        {/* Login Link */}
        <div style={loginLinkStyle}>
          <p style={loginTextStyle}>
            Already have an account? <Link to="/login" style={linkStyle}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
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
  right: '10%',
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
  animation: 'float 6s ease-in-out infinite'
}

const floatingCircle2Style = {
  position: 'absolute',
  bottom: '20%',
  left: '10%',
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
  animation: 'float 8s ease-in-out infinite 1s'
}

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: '40px',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '500px',
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

// Progress Steps Styles
const progressContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
  position: 'relative'
}

const progressStepStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  position: 'relative'
}

const progressCircleStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: '#ecf0f1',
  border: '2px solid #bdc3c7',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  color: '#7f8c8d',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  zIndex: 2
}

const progressCircleActiveStyle = {
  background: '#3498db',
  borderColor: '#3498db',
  color: 'white',
  transform: 'scale(1.1)'
}

const progressCircleCompletedStyle = {
  background: '#2ecc71',
  borderColor: '#2ecc71',
  color: 'white'
}

const progressLabelStyle = {
  fontSize: '12px',
  color: '#7f8c8d',
  marginTop: '8px',
  textAlign: 'center',
  fontWeight: '500'
}

const progressLineStyle = {
  position: 'absolute',
  top: '20px',
  left: '60%',
  right: '-40%',
  height: '2px',
  background: '#bdc3c7',
  zIndex: 1
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

const stepTitleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '8px',
  textAlign: 'center'
}

const stepSubtitleStyle = {
  fontSize: '14px',
  color: '#7f8c8d',
  textAlign: 'center',
  marginBottom: '30px'
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

const errorAlertStyle = {
  background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)',
  color: '#d63031',
  padding: '12px 16px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: '500',
  marginBottom: '20px',
  border: '1px solid #ff7675'
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
  fontFamily: 'inherit'
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

const secondaryButtonStyle = {
  ...buttonStyle,
  background: 'transparent',
  color: '#7f8c8d',
  border: '2px solid #bdc3c7'
}

const buttonIconStyle = {
  fontSize: '18px'
}

const buttonGroupStyle = {
  display: 'flex',
  gap: '15px',
  marginTop: '20px'
}

// User Type Selection Styles
const userTypeContainerStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '30px'
}

const userTypeCardStyle = {
  padding: '20px',
  border: '2px solid #ecf0f1',
  borderRadius: '15px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  background: 'white'
}

const userTypeCardActiveStyle = {
  borderColor: '#3498db',
  background: 'linear-gradient(135deg, #74b9ff20, #0984e320)',
  transform: 'translateY(-2px)',
  boxShadow: '0 8px 25px rgba(116, 185, 255, 0.2)'
}

const userTypeIconStyle = {
  fontSize: '40px',
  marginBottom: '15px'
}

const userTypeTitleStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 10px 0'
}

const userTypeDescriptionStyle = {
  fontSize: '12px',
  color: '#7f8c8d',
  margin: '0 0 15px 0',
  lineHeight: 1.4
}

const userTypeFeaturesStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
}

const featureStyle = {
  fontSize: '11px',
  color: '#27ae60',
  fontWeight: '500'
}

// Payment Styles
const paymentCardStyle = {
  background: 'white',
  padding: '25px',
  borderRadius: '15px',
  border: '1px solid #ecf0f1',
  marginBottom: '20px'
}

const pricingStyle = {
  textAlign: 'center',
  marginBottom: '25px',
  padding: '20px',
  background: 'linear-gradient(135deg, #ffeaa7, #81ecec)',
  borderRadius: '12px'
}

const originalPriceStyle = {
  marginBottom: '10px'
}

const originalPriceTextStyle = {
  fontSize: '14px',
  color: '#7f8c8d'
}

const priceStrikeStyle = {
  fontSize: '18px',
  color: '#e74c3c',
  textDecoration: 'line-through',
  fontWeight: 'bold'
}

const discountedPriceStyle = {
  marginBottom: '10px'
}

const discountedPriceTextStyle = {
  fontSize: '16px',
  color: '#2c3e50',
  fontWeight: '600'
}

const discountedPriceAmountStyle = {
  fontSize: '28px',
  color: '#27ae60',
  fontWeight: 'bold'
}

const savingsStyle = {
  fontSize: '14px',
  color: '#e67e22',
  fontWeight: '600'
}

const paymentMethodsStyle = {
  marginBottom: '25px'
}

const methodsTitleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2c3e50',
  marginBottom: '15px'
}

const methodOptionsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
  marginBottom: '20px'
}

const methodOptionStyle = {
  padding: '12px',
  border: '2px solid #ecf0f1',
  borderRadius: '8px',
  textAlign: 'center',
  fontSize: '12px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
}

const methodIconStyle = {
  display: 'block',
  fontSize: '20px',
  marginBottom: '5px'
}

const qrSectionStyle = {
  marginBottom: '25px'
}

const qrTitleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2c3e50',
  marginBottom: '15px',
  textAlign: 'center'
}

const qrPlaceholderStyle = {
  textAlign: 'center'
}

const qrCodeStyle = {
  width: '200px', // Adjust the width as needed
  height: '200px', // Adjust the height as needed
  background: '#ecf0f1',
  border: '2px dashed #bdc3c7',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 15px',
  color: '#7f8c8d',
  fontWeight: 'bold',
  overflow: 'hidden', // Ensure the QR code is contained within the box
};


const qrInstructionsStyle = {
  fontSize: '12px',
  color: '#7f8c8d',
  margin: 0
}

const uploadSectionStyle = {
  marginBottom: '20px'
}

const uploadTitleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2c3e50',
  marginBottom: '15px'
}

const fileInputStyle = {
  width: '100%',
  padding: '12px',
  border: '2px dashed #bdc3c7',
  borderRadius: '8px',
  marginBottom: '15px',
  background: '#f8f9fa'
}

const uploadHintStyle = {
  textAlign: 'center',
  color: '#7f8c8d',
  margin: '15px 0',
  fontSize: '14px'
}

const utrTitleStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#2c3e50',
  marginBottom: '10px'
}

// Payment Status Styles
const paymentStatusStyle = {
  textAlign: 'center',
  padding: '40px 20px'
}

const processingStyle = {
  // Styles for processing state
}

const successStyle = {
  // Styles for success state
}

const spinnerStyle = {
  width: '60px',
  height: '60px',
  border: '4px solid #ecf0f1',
  borderTop: '4px solid #3498db',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  margin: '0 auto 20px'
}

const smallSpinnerStyle = {
  width: '18px',
  height: '18px',
  border: '2px solid transparent',
  borderTop: '2px solid currentColor',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
}

const statusTitleStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '10px'
}

const statusTextStyle = {
  fontSize: '14px',
  color: '#7f8c8d',
  marginBottom: '25px',
  lineHeight: 1.5
}

const successIconStyle = {
  fontSize: '60px',
  marginBottom: '20px'
}

const successActionsStyle = {
  marginTop: '25px'
}

const successButtonStyle = {
  display: 'inline-block',
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  transition: 'all 0.3s ease'
}

// Login Link Styles
const loginLinkStyle = {
  textAlign: 'center',
  marginTop: '25px',
  paddingTop: '25px',
  borderTop: '1px solid #ecf0f1'
}

const loginTextStyle = {
  fontSize: '14px',
  color: '#7f8c8d',
  margin: 0
}

const linkStyle = {
  color: '#3498db',
  textDecoration: 'none',
  fontWeight: '600'
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
`

// Inject styles
const styleSheet = document.createElement('style')
styleSheet.innerText = styles
document.head.appendChild(styleSheet)