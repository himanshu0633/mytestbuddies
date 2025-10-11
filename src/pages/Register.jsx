import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuthForm } from '../components/authCommon';
import logo from '../image/logofull.png';
import qrCodeimage from '../image/qr.png';

export default function Register() {
  const { form, onChange, saveToken } = useAuthForm({
    name: '',
    email: '',
    password: '',
    mobile: '',
    userType: '',
    qrCode: '',
    utr: '',
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [utr, setUtr] = useState('');
  const navigate = useNavigate();

  const onMobileChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    onChange({ target: { name: 'mobile', value: onlyDigits } });
  };

  const submitStep1 = (e) => {
    e.preventDefault();
    console.log('Step 1 data:', form);
    setStep(2);
  };

  const submitStep2 = () => {
    onChange({ target: { name: 'userType', value: userType } });
    console.log('Step 2 data - User Type:', userType);
    setStep(3);
  };

  const submitStep3 = () => {
    onChange({ target: { name: 'utr', value: utr } });
    console.log('Step 3 data - UTR:', utr);
    setStep(4);
  };

  const submitPayment = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('mobile', form.mobile);
    formData.append('password', form.password);
    formData.append('userType', form.userType);
    formData.append('utr', utr);

    if (qrCode && qrCode instanceof File) {
      formData.append('proofOfPayment', qrCode);
    }

    console.log('Submitting payment with data:', formData);

    try {
      await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      saveToken('mock-token');
      setLoading(false);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      navigate('/login');
    }
  };

  const handleLogoClick = () => navigate('/');

  // Progress steps configuration
  const steps = [
    { number: 1, label: 'Basic Info', active: step === 1, completed: step > 1 },
    { number: 2, label: 'User Type', active: step === 2, completed: step > 2 },
    { number: 3, label: 'Payment', active: step === 3, completed: step > 3 },
    { number: 4, label: 'Complete', active: step === 4, completed: step > 4 },
  ];

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

        {/* Progress Steps */}
        <div style={progressContainerStyle}>
          {steps.map((stepItem, index) => (
            <div key={stepItem.number} style={progressStepStyle}>
              <div
                style={{
                  ...progressCircleStyle,
                  ...(stepItem.active ? progressCircleActiveStyle : {}),
                  ...(stepItem.completed ? progressCircleCompletedStyle : {})
                }}
              >
                {stepItem.completed ? '✓' : stepItem.number}
              </div>
              <div style={progressLabelStyle}>{stepItem.label}</div>
              {index < steps.length - 1 && (
                <div style={progressLineStyle}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1 - Basic Information */}
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
                    onChange={onChange}
                    style={inputStyle}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div style={inputContainerStyle}>
                <label htmlFor="email" style={labelStyle}>📧 Email Address</label>
                <div style={inputWrapperStyle}>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    style={inputStyle}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div style={inputContainerStyle}>
                <label htmlFor="password" style={labelStyle}>🔒 Password</label>
                <div style={inputWrapperStyle}>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    style={inputStyle}
                    placeholder="Create a password"
                    required
                  />
                </div>
              </div>

              <div style={inputContainerStyle}>
                <label htmlFor="mobile" style={labelStyle}>📱 WhatsApp Number</label>
                <div style={inputWrapperStyle}>
                  <input
                    id="mobile"
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={onMobileChange}
                    style={inputStyle}
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                style={{ ...buttonStyle, ...activeButtonStyle }}
                disabled={!form.name || !form.email || !form.password || !form.mobile}
              >
                Continue to User Type →
              </button>
            </form>
          </div>
        )}

        {/* Step 2 - User Type Selection */}
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
                  ...(userType === 'student' ? userTypeCardActiveStyle : {})
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
                  ...(userType === 'general' ? userTypeCardActiveStyle : {})
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
              disabled={!userType}
            >
              Continue to Payment →
            </button>
          </div>
        )}

        {/* Step 3 - Payment */}
        {step === 3 && (
          <div style={formContainerStyle}>
            <div style={welcomeSectionStyle}>
              <h2 style={headerStyle}>Complete Payment</h2>
              <p style={subtitleStyle}>Unlock full access to all features</p>
            </div>

            <div style={paymentCardStyle}>
              <div style={pricingStyle}>
                <div style={discountedPriceStyle}>
                  <div style={discountedPriceTextStyle}>
                    One-time payment: <span style={discountedPriceAmountStyle}>₹100</span>
                  </div>
                </div>
                <div style={savingsStyle}>Save ₹150 with this limited offer!</div>
              </div>

              <div style={qrSectionStyle}>
                <h3 style={qrTitleStyle}>Scan QR Code to Pay</h3>
                <div style={qrPlaceholderStyle}>
                  <img 
                    src={qrCodeimage} 
                    alt="Payment QR Code" 
                    style={qrCodeStyle}
                  />
                  <p style={qrInstructionsStyle}>
                    Scan the QR code with your UPI app to complete payment
                  </p>
                </div>
              </div>

              <div style={uploadSectionStyle}>
                <h3 style={uploadTitleStyle}>Upload Payment Proof</h3>
                <input 
                  type="file" 
                  onChange={(e) => setQrCode(e.target.files[0])}
                  style={fileInputStyle}
                  accept="image/*"
                />
                <p style={uploadHintStyle}>
                  Upload screenshot of successful payment
                </p>
              </div>

              <div style={inputContainerStyle}>
                <label style={utrTitleStyle}>UTR Number</label>
                <input 
                  type="text" 
                  placeholder="Enter UTR number from payment receipt"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <button 
              onClick={submitPayment}
              style={{ ...buttonStyle, ...activeButtonStyle }}
              disabled={loading || !utr || !qrCode}
            >
              {loading ? (
                <>
                  <div style={smallSpinnerStyle}></div>
                  Verifying Payment...
                </>
              ) : (
                'Verify Payment →'
              )}
            </button>
          </div>
        )}

        {/* Step 4 - Completion */}
        {step === 4 && (
          <div style={paymentStatusStyle}>
            <div style={successStyle}>
              <div style={successIconStyle}>🎉</div>
              <h2 style={statusTitleStyle}>Registration Complete!</h2>
              <p style={statusTextStyle}>
                Welcome to MyTestBuddies! Your account has been successfully created 
                and is now ready to use.
              </p>
              <div style={successActionsStyle}>
                <Link to="/login" style={successButtonStyle}>
                  Proceed to Login →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Login Link */}
        {step !== 4 && (
          <div style={loginLinkStyle}>
            <p style={loginTextStyle}>
              Already have an account?{' '}
              <Link to="/login" style={linkStyle}>
                Sign in here
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Inject CSS animations */}
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
};

const backgroundDecorationStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none'
};

const floatingCircle1Style = {
  position: 'absolute',
  top: '10%',
  right: '10%',
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
  animation: 'float 6s ease-in-out infinite'
};

const floatingCircle2Style = {
  position: 'absolute',
  bottom: '20%',
  left: '10%',
  width: '150px',
  height: '150px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
  animation: 'float 8s ease-in-out infinite 1s'
};

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
};

const logoSectionStyle = {
  textAlign: 'center',
  marginBottom: '30px',
  cursor: 'pointer',
  transition: 'transform 0.3s ease'
};

const logoStyle = {
  width: '80px',
  height: 'auto',
  marginBottom: '10px',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
};

const brandNameStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  margin: 0
};

// Progress Steps Styles
const progressContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
  position: 'relative'
};

const progressStepStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  position: 'relative'
};

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
};

const progressCircleActiveStyle = {
  background: '#3498db',
  borderColor: '#3498db',
  color: 'white',
  transform: 'scale(1.1)'
};

const progressCircleCompletedStyle = {
  background: '#2ecc71',
  borderColor: '#2ecc71',
  color: 'white'
};

const progressLabelStyle = {
  fontSize: '12px',
  color: '#7f8c8d',
  marginTop: '8px',
  textAlign: 'center',
  fontWeight: '500'
};

const progressLineStyle = {
  position: 'absolute',
  top: '20px',
  left: '60%',
  right: '-40%',
  height: '2px',
  background: '#bdc3c7',
  zIndex: 1
};

const formContainerStyle = {
  marginBottom: '25px'
};

const welcomeSectionStyle = {
  textAlign: 'center',
  marginBottom: '30px'
};

const headerStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 10px 0'
};

const subtitleStyle = {
  fontSize: '14px',
  color: '#7f8c8d',
  margin: 0,
  lineHeight: 1.5
};

const formStyle = {
  marginBottom: '25px'
};

const inputContainerStyle = {
  marginBottom: '20px'
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#2c3e50',
  marginBottom: '8px'
};

const inputWrapperStyle = {
  position: 'relative'
};

const inputStyle = {
  width: '100%',
  padding: '15px',
  fontSize: '16px',
  border: '2px solid #ecf0f1',
  borderRadius: '12px',
  outline: 'none',
  transition: 'all 0.3s ease',
  background: 'rgba(255, 255, 255, 0.8)',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
};

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
};

const activeButtonStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
};

// User Type Selection Styles
const userTypeContainerStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '30px'
};

const userTypeCardStyle = {
  padding: '20px',
  border: '2px solid #ecf0f1',
  borderRadius: '15px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  background: 'white'
};

const userTypeCardActiveStyle = {
  borderColor: '#3498db',
  background: 'linear-gradient(135deg, #74b9ff20, #0984e320)',
  transform: 'translateY(-2px)',
  boxShadow: '0 8px 25px rgba(116, 185, 255, 0.2)'
};

const userTypeIconStyle = {
  fontSize: '40px',
  marginBottom: '15px'
};

const userTypeTitleStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 10px 0'
};

const userTypeDescriptionStyle = {
  fontSize: '12px',
  color: '#7f8c8d',
  margin: '0 0 15px 0',
  lineHeight: 1.4
};

const userTypeFeaturesStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px'
};

const featureStyle = {
  fontSize: '11px',
  color: '#27ae60',
  fontWeight: '500'
};

// Payment Styles
const paymentCardStyle = {
  background: 'white',
  padding: '25px',
  borderRadius: '15px',
  border: '1px solid #ecf0f1',
  marginBottom: '20px'
};

const pricingStyle = {
  textAlign: 'center',
  marginBottom: '25px',
  padding: '20px',
  background: 'linear-gradient(135deg, #ffeaa7, #81ecec)',
  borderRadius: '12px'
};

const discountedPriceStyle = {
  marginBottom: '10px'
};

const discountedPriceTextStyle = {
  fontSize: '16px',
  color: '#2c3e50',
  fontWeight: '600'
};

const discountedPriceAmountStyle = {
  fontSize: '28px',
  color: '#27ae60',
  fontWeight: 'bold'
};

const savingsStyle = {
  fontSize: '14px',
  color: '#e67e22',
  fontWeight: '600'
};

const qrSectionStyle = {
  marginBottom: '25px'
};

const qrTitleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2c3e50',
  marginBottom: '15px',
  textAlign: 'center'
};

const qrPlaceholderStyle = {
  textAlign: 'center'
};

const qrCodeStyle = {
  width: '200px',
  height: '200px',
  border: '2px solid #ecf0f1',
  borderRadius: '10px',
  margin: '0 auto 15px',
  display: 'block'
};

const qrInstructionsStyle = {
  fontSize: '12px',
  color: '#7f8c8d',
  margin: 0
};

const uploadSectionStyle = {
  marginBottom: '20px'
};

const uploadTitleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2c3e50',
  marginBottom: '15px'
};

const fileInputStyle = {
  width: '100%',
  padding: '12px',
  border: '2px dashed #bdc3c7',
  borderRadius: '8px',
  marginBottom: '15px',
  background: '#f8f9fa'
};

const uploadHintStyle = {
  textAlign: 'center',
  color: '#7f8c8d',
  margin: '15px 0',
  fontSize: '14px'
};

const utrTitleStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#2c3e50',
  marginBottom: '10px'
};

// Payment Status Styles
const paymentStatusStyle = {
  textAlign: 'center',
  padding: '40px 20px'
};

const successStyle = {
  // Styles for success state
};

const smallSpinnerStyle = {
  width: '18px',
  height: '18px',
  border: '2px solid transparent',
  borderTop: '2px solid currentColor',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const statusTitleStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#2c3e50',
  marginBottom: '10px'
};

const statusTextStyle = {
  fontSize: '14px',
  color: '#7f8c8d',
  marginBottom: '25px',
  lineHeight: 1.5
};

const successIconStyle = {
  fontSize: '60px',
  marginBottom: '20px'
};

const successActionsStyle = {
  marginTop: '25px'
};

const successButtonStyle = {
  display: 'inline-block',
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  transition: 'all 0.3s ease'
};

// Login Link Styles
const loginLinkStyle = {
  textAlign: 'center',
  marginTop: '25px',
  paddingTop: '25px',
  borderTop: '1px solid #ecf0f1'
};

const loginTextStyle = {
  fontSize: '14px',
  color: '#7f8c8d',
  margin: 0
};

const linkStyle = {
  color: '#3498db',
  textDecoration: 'none',
  fontWeight: '600'
};