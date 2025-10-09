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
    console.log('Step 1 data:', form); // Log the data at step 1
    setStep(2);
  };

  const submitStep2 = () => {
    onChange({ target: { name: 'userType', value: userType } });
    console.log('Step 2 data - User Type:', userType); // Log the selected user type
    setStep(3);
  };

  const submitStep3 = () => {
    onChange({ target: { name: 'utr', value: utr } });
    console.log('Step 3 data - UTR:', utr); // Log the entered UTR
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

    console.log('Submitting payment with data:', formData); // Log form data before sending request

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

        {/* Step 1 */}
        {step === 1 && (
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
                />
              </div>
            </div>

            <button type="submit" style={buttonStyle}>
              Continue to User Type → 
            </button>
          </form>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={formStyle}>
            <h3>Select Your Profile 🎯</h3>
            <button onClick={() => setUserType('student')}>Student</button>
            <button onClick={() => setUserType('general')}>General User</button>
            <button onClick={submitStep2}>Continue to Payment →</button>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div style={formStyle}>
            <h3>Complete Payment 💰</h3>
            <div>
              <img src={qrCodeimage} alt="QR" />
              <input type="file" onChange={(e) => setQrCode(e.target.files[0])} />
              <input type="text" placeholder="Enter UTR" onChange={(e) => setUtr(e.target.value)} />
              <button onClick={submitPayment}>Verify Payment →</button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div style={formStyle}>
            <h3>Registration Complete 🎉</h3>
            <Link to="/login">Proceed to Login →</Link>
          </div>
        )}
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
  // const progressContainerStyle = {
  //   display: 'flex',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginBottom: '30px',
  //   position: 'relative'
  // }

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