import { useEffect, useState } from 'react'
import api from '../utils/axios'
import { Link } from 'react-router-dom'
import { LogoutButton } from '../components/authCommon'
import Navbar from '../components/navbar'
import qrimg from "../image/qr.png"
// Simple icon components using emojis
const QuizIcon = () => <span style={{ fontSize: '20px' }}>📝</span>
const TrophyIcon = () => <span style={{ fontSize: '20px' }}>🏆</span>
const ScheduleIcon = () => <span style={{ fontSize: '20px' }}>⏰</span>
const TrendingIcon = () => <span style={{ fontSize: '20px' }}>📈</span>
const NotificationsIcon = () => <span style={{ fontSize: '20px' }}>🔔</span>
const PeopleIcon = () => <span style={{ fontSize: '20px' }}>👥</span>
const StarIcon = () => <span style={{ fontSize: '20px' }}>⭐</span>
const AssignmentIcon = () => <span style={{ fontSize: '20px' }}>📋</span>
const CalendarIcon = () => <span style={{ fontSize: '20px' }}>📅</span>
const WhatsAppIcon = () => <span style={{ fontSize: '20px' }}>💬</span>
const EmailIcon = () => <span style={{ fontSize: '20px' }}>📧</span>


export default function Dashboard() {
  const [me, setMe] = useState(null)
  const [fields, setFields] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    rank: 0
  })
  const [upcomingTests, setUpcomingTests] = useState([])
  const [notifications, setNotifications] = useState([])
  const [hoveredButton, setHoveredButton] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isBlinking, setIsBlinking] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);
const [image, setImage] = useState(null); // Image to upload
  const [number, setNumber] = useState(''); // 16-digit number
  
useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data: userData } = await api.get('/auth/me');
        setMe(userData?.user);

        const { data: fieldsData } = await api.get('/admin/fields');
        setFields(fieldsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
    const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  

  // Mock participant data with masked numbers
  const participants = [
    { name: "Aarav Sharma", number: "78*****23" },
    { name: "Priya Patel", number: "91*****47" },
    { name: "Rohan Kumar", number: "83*****39" },
    { name: "Sneha Singh", number: "76*****81" },
    { name: "Vikram Joshi", number: "89*****15" },
    { name: "Ananya Gupta", number: "94*****62" },
    { name: "Karan Malhotra", number: "85*****74" },
    { name: "Neha Reddy", number: "79*****28" },
    { name: "Amit Verma", number: "82*****53" },
    { name: "Pooja Mehta", number: "88*****91" }
  ]

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const { data: userData } = await api.get('/auth/me')
        setMe(userData?.user)
        
        try {
          const { data: fieldsData } = await api.get('/admin/fields')
          setFields(fieldsData || [])
        } catch (fieldsError) {
          console.error('Error fetching fields:', fieldsError)
          setFields([])
        }
        
        setStats({
          totalQuizzes: 12,
          completedQuizzes: 8,
          averageScore: 78,
          rank: 45
        })
        
        setUpcomingTests([
          { id: 1, title: 'Mathematics Mega Test', date: '2024-10-25', time: '10:00 AM', duration: '180 mins', priority: 'high' },
          { id: 2, title: 'Physics Weekly Quiz', date: '2024-10-26', time: '02:00 PM', duration: '60 mins', priority: 'medium' },
          { id: 3, title: 'Chemistry Practice Test', date: '2024-10-27', time: '11:00 AM', duration: '90 mins', priority: 'low' }
        ])
        
        setNotifications([
          { id: 1, message: 'Your Mathematics test result is available', time: '2 hours ago', type: 'result' },
          { id: 2, message: 'New quiz added: Advanced Physics Concepts', time: '1 day ago', type: 'new_quiz' },
          { id: 3, message: 'You moved up 5 positions in leaderboard', time: '2 days ago', type: 'achievement' }
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Blinking effect for the mega quiz banner
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(prev => !prev)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const progressValue = stats.totalQuizzes > 0 ? (stats.completedQuizzes / stats.totalQuizzes) * 100 : 0

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c'
      case 'medium': return '#f39c12'
      case 'low': return '#27ae60'
      default: return '#95a5a6'
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'result': return '📊'
      case 'new_quiz': return '🆕'
      case 'achievement': return '🎯'
      default: return '💡'
    }
  }

  const handleMouseEnter = (button) => {
    setHoveredButton(button)
  }

  const handleMouseLeave = () => {
    setHoveredButton(null)
  }
const handleSubmit = async () => {
  if (number.length === 16) {  // Ensure the number is exactly 16 digits long
    // Validate the number format (only digits)
    const isValidNumber = /^[0-9]{16}$/.test(number);
    if (!isValidNumber) {
      alert('Please enter a valid 16-digit number (only digits allowed).');
      return;
    }

    // Prepare the JSON object
    const data = {
      utr: number,  // 16-digit number
    };

    // Add user ID if available
    if (me?._id) {
      data.user_id = me._id;
    }

    try {
      // Make the POST request to the API endpoint with JSON data
      const response = await api.post('/payment/create', data, {
        headers: {
          'Content-Type': 'application/json',  // Ensure the server knows you're sending JSON
        },
      });

      console.log('Form submitted successfully:', response.data);
      setIsModalOpen(false); // Close modal after submission
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  } else {
    alert('Please enter a valid 16-digit number.');
  }
};

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        {/* Welcome Section */}
        <div style={welcomeSectionStyle}>
          <div style={userInfoStyle}>
            <div style={avatarStyle}>
              {me?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div style={userTextStyle}>
              <h1 style={welcomeTitleStyle}>
                Welcome back, {me?.name || 'Student'}! 👋
              </h1>
              <p style={welcomeSubtitleStyle}>
                Ready to ace your next test? Your preparation journey continues here.
              </p>
            </div>
          </div>
          
        
        </div>
         {/* Mega Quiz Live Banner */}
        <div style={{
          ...megaQuizBannerStyle,
          border: isBlinking ? '3px solid #ff6b6b' : '3px solid #4ecdc4',
          boxShadow: isBlinking ? '0 0 20px rgba(255, 107, 107, 0.6)' : '0 0 20px rgba(78, 205, 196, 0.6)'
        }}>
          <div style={megaQuizContentStyle}>
            <div style={megaQuizHeaderStyle}>
              <div style={liveBadgeStyle}>
                <span style={livePulseStyle}></span>
                🔴 LIVE NOW
              </div>
              <h1 style={megaQuizTitleStyle}>🎯 MEGA QUIZ COMPETITION 🎯</h1>
              <p style={megaQuizSubtitleStyle}>
                Answer questions & win <strong>Big Prizes!</strong> 🏆💰
              </p>
            </div>
            
            <div style={prizesSectionStyle}>
              <div style={prizeCardStyle}>
                <div style={prizeIconStyle}>🥇</div>
                <div style={prizeInfoStyle}>
                  <h3 style={prizeTitleStyle}>First Prize</h3>
                  <p style={prizeAmountStyle}>Apple MacBook Air m4</p>
                </div>
              </div>
              <div style={prizeCardStyle}>
                <div style={prizeIconStyle}>🥈</div>
                <div style={prizeInfoStyle}>
                  <h3 style={prizeTitleStyle}>Second Prize</h3>
                  <p style={prizeAmountStyle}>Apple MacBook Air m3</p>
                </div>
              </div>
              <div style={prizeCardStyle}>
                <div style={prizeIconStyle}>🥉</div>
                <div style={prizeInfoStyle}>
                  <h3 style={prizeTitleStyle}>Third Prize</h3>
                  <p style={prizeAmountStyle}>Apple MacBook Air m2</p>
                </div>
              </div>
              
            </div>

             <Link onClick={handleOpenModal} style={participateButtonStyle}>
              🚀 Participate Now 🚀
            </Link>
{isModalOpen && (
          <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
              <button style={closeModalButtonStyle} onClick={handleCloseModal}>
                X
              </button>
              <h2>Participate in the Mega Quiz</h2>
              <div style={formContainerStyle}>
                <h3>Scan the QR code And Pay 100 RS</h3>
              <img
                src= {qrimg}
                alt="Static Image"
                style={{ width: '150px', marginTop: '10px' }}
              />
                <p>Enter 16-digit UTR Number</p>
                <input
                  type="text"
                  maxLength="16"
                  placeholder="Enter 16-digit number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  style={inputStyle}
                />
                <button onClick={handleSubmit} style={submitButtonStyle}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
            {/* Participants Scrolling Section */}
            <div style={participantsSectionStyle}>
              <div style={participantsHeaderStyle}>
                <PeopleIcon /> Recent Participants
              </div>
              <div style={scrollingContainerStyle}>
                <div style={scrollingContentStyle}>
                  {[...participants, ...participants].map((participant, index) => (
                    <div key={index} style={participantCardStyle}>
                      <div style={participantAvatarStyle}>
                        {participant.name.charAt(0)}
                      </div>
                      <div style={participantInfoStyle}>
                        <div style={participantNameStyle}>{participant.name}</div>
                        <div style={participantNumberStyle}>{participant.number}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
  {/* Important Announcement */}
          <div style={announcementStyle}>
            <div style={announcementContentStyle}>
              <div style={announcementIconStyle}>📢</div>
              <div>
                <h3 style={announcementTitleStyle}>Important Announcement</h3>
                <p style={announcementTextStyle}>
                  Your <strong>Mega Test</strong> will be conducted within the next 12 to 24 hours.
                </p>
                <p style={announcementDetailStyle}>
                  We will notify you via email and WhatsApp message provided by you.
                </p>
                <div style={notificationBadgesStyle}>
                  <span style={{...badgeStyle, borderColor: '#e74c3c', color: '#e74c3c'}}>
                    <EmailIcon /> Email Notification
                  </span>
                  <span style={{...badgeStyle, borderColor: '#00b894', color: '#00b894'}}>
                    <WhatsAppIcon /> WhatsApp Alert
                  </span>
                </div>
              </div>
            </div>
          </div>
        {/* Practice Fields Section */}
        {!loading && (
          <div style={fieldsSectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>Practice Fields</h2>
              <p style={sectionSubtitleStyle}>
                Choose from various fields to practice and improve your skills
              </p>
            </div>

            <div style={fieldsGridStyle}>
              {fields.map(field => (
                <div key={field._id} style={previewCardStyle}>
                  <div style={previewCardHeaderStyle}>
                    <span style={previewIconStyle}>
                      {field.for === 'Student' ? '🎓' : '🌐'}
                    </span>
                    <h3 style={previewFieldNameStyle}>{field.name}</h3>
                  </div>
                  <p style={previewDescriptionStyle}>
                    {field.description || 'Start practicing questions in this field'}
                  </p>
                  <Link 
                    to={`/field/que/${field._id}`} 
                    style={previewButtonStyle}
                  >
                    View Quiz
                  </Link>
                </div>
              ))}
            </div>

            {fields.length === 0 && (
              <div style={emptyFieldsStyle}>
                <p>No fields available at the moment.</p>
                <p>Please check back later or contact support.</p>
              </div>
            )}
          </div>
        )}

        {/* Admin Section */}
        {me?.role === 'admin' && (
          <div style={adminSectionStyle}>
            <h2 style={adminTitleStyle}>Admin Panel</h2>
            <div style={adminGridStyle}>
              <Link to="/admin/fields" style={adminCardStyle}>
                <div style={adminCardContentStyle}>
                  <span style={adminIconStyle}>📚</span>
                  <h3 style={adminCardTitleStyle}>Manage Fields</h3>
                  <p style={adminCardTextStyle}>Create, edit and manage quiz fields</p>
                </div>
              </Link>
              
              <Link to="/admin/add-question" style={adminCardStyle}>
                <div style={adminCardContentStyle}>
                  <span style={adminIconStyle}>❓</span>
                  <h3 style={adminCardTitleStyle}>Manage Questions</h3>
                  <p style={adminCardTextStyle}>Add and manage quiz questions</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Contact Support Section */}
        <div style={contactSupportStyle}>
          <h3 style={contactSupportTitleStyle}>Contact Support</h3>
          <p style={contactSupportTextStyle}>If you have any questions or need assistance, feel free to reach out to us through any of the following channels:</p>
          
          <div style={contactButtonContainerStyle}>
            <a 
              href="https://www.instagram.com/mytestbuddies.shop?igsh=bGs0aWtpNXg1N3dt" 
              target="_blank"
              rel="noopener noreferrer"
              style={hoveredButton === 'instagram' ? {...contactButtonStyle, background: '#6a42a8'} : contactButtonStyle}
              onMouseEnter={() => handleMouseEnter('instagram')} 
              onMouseLeave={handleMouseLeave}
            >
              Instagram
            </a>
            <a 
              href="https://t.me/mytestbuddies" 
              target="_blank"
              rel="noopener noreferrer"
              style={hoveredButton === 'telegram' ? {...contactButtonStyle, background: '#6a42a8'} : contactButtonStyle}
              onMouseEnter={() => handleMouseEnter('telegram')} 
              onMouseLeave={handleMouseLeave}
            >
              Telegram
            </a>
            <a 
              href="https://whatsapp.com/channel/0029VbBqVVSInlqPiW153j23" 
              target="_blank"
              rel="noopener noreferrer"
              style={hoveredButton === 'whatsapp' ? {...contactButtonStyle, background: '#6a42a8'} : contactButtonStyle}
              onMouseEnter={() => handleMouseEnter('whatsapp')} 
              onMouseLeave={handleMouseLeave}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
// Modal Styles
const modalOverlayStyle = { position: 'fixed',
   top: '0', left: '0', width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
     justifyContent: 'center', alignItems: 'center' ,zIndex: 1000};
const modalContentStyle = { background: 'white', padding: '20px', borderRadius: '10px', width: '400px', textAlign: 'center', position: 'relative' };
const closeModalButtonStyle = { position: 'absolute', top: '10px', right: '10px', fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' };
const formContainerStyle = { marginTop: '20px' };
const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' };
const submitButtonStyle = { background: '#4ecdc4', color: 'white', padding: '12px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '1rem' };


// Enhanced Styles with Mega Quiz Section
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
}

// Mega Quiz Banner Styles
const megaQuizBannerStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  borderRadius: '20px',
  padding: '25px',
  marginBottom: '30px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.5s ease',
  animation: 'gradientShift 3s ease infinite'
}

const megaQuizContentStyle = {
  position: 'relative',
  zIndex: 2
}

const megaQuizHeaderStyle = {
  textAlign: 'center',
  marginBottom: '25px'
}

const liveBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  background: '#e74c3c',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '20px',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  marginBottom: '15px',
  position: 'relative'
}

const livePulseStyle = {
  width: '12px',
  height: '12px',
  backgroundColor: '#fff',
  borderRadius: '50%',
  animation: 'pulse 1.5s infinite'
}

const megaQuizTitleStyle = {
  fontSize: '2.2rem',
  fontWeight: 'bold',
  color: 'white',
  margin: '10px 0',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
}

const megaQuizSubtitleStyle = {
  fontSize: '1.3rem',
  color: 'white',
  margin: '0',
  opacity: 0.9
}

const prizesSectionStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  margin: '30px 0',
  flexWrap: 'wrap'
}

const prizeCardStyle = {
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  padding: '20px',
  borderRadius: '15px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  minWidth: '200px',
  transition: 'transform 0.3s ease'
}

const prizeIconStyle = {
  fontSize: '2.5rem'
}

const prizeInfoStyle = {
  color: 'white'
}

const prizeTitleStyle = {
  margin: '0 0 5px 0',
  fontSize: '1.1rem',
  fontWeight: '600'
}

const prizeAmountStyle = {
  margin: '0',
  fontSize: '1rem',
  opacity: 0.9
}

const participateButtonStyle = {
  display: 'block',
  width: 'max-content',
  margin: '0 auto',
  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
  color: 'white',
  padding: '15px 30px',
  borderRadius: '50px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  textAlign: 'center',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
}

const participantsSectionStyle = {
  marginTop: '30px',
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '15px',
  padding: '20px',
  backdropFilter: 'blur(5px)'
}

const participantsHeaderStyle = {
  color: 'white',
  fontSize: '1.2rem',
  fontWeight: '600',
  marginBottom: '15px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
}

const scrollingContainerStyle = {
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '10px'
}

const scrollingContentStyle = {
  display: 'flex',
  animation: 'scrollHorizontal 30s linear infinite',
  gap: '15px'
}

const participantCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  background: 'rgba(255, 255, 255, 0.2)',
  padding: '10px 15px',
  borderRadius: '25px',
  minWidth: '180px',
  backdropFilter: 'blur(5px)'
}

const participantAvatarStyle = {
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '0.9rem'
}

const participantInfoStyle = {
  color: 'white'
}

const participantNameStyle = {
  fontSize: '0.9rem',
  fontWeight: '600',
  margin: '0'
}

const participantNumberStyle = {
  fontSize: '0.8rem',
  opacity: 0.8,
  margin: '0'
}

// Existing Styles (keep all your existing styles below)
const welcomeSectionStyle = {
  marginBottom: '40px'
}

const userInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '30px'
}

const avatarStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '2rem',
  fontWeight: 'bold',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
}

const userTextStyle = {
  flex: 1
}

const welcomeTitleStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  margin: '0 0 10px 0'
}

const welcomeSubtitleStyle = {
  fontSize: '1.2rem',
  color: '#666',
  margin: 0
}

const announcementStyle = {
  background: 'linear-gradient(135deg, #ffeaa7 0%, #a29bfe 100%)',
  padding: '25px',
  borderRadius: '15px',
  borderLeft: '4px solid #e74c3c',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
}

const announcementContentStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '20px'
}

const announcementIconStyle = {
  fontSize: '2rem'
}

const announcementTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#2d3436',
  margin: '0 0 10px 0'
}

const announcementTextStyle = {
  fontSize: '1.1rem',
  color: '#2d3436',
  margin: '0 0 8px 0'
}

const announcementDetailStyle = {
  fontSize: '1rem',
  color: '#636e72',
  margin: '0 0 15px 0'
}

const notificationBadgesStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap'
}

const badgeStyle = {
  padding: '8px 12px',
  border: '2px solid',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '5px'
}

const fieldsSectionStyle = {
  marginTop: '40px',
  background: 'white',
  padding: '30px',
  borderRadius: '15px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
}

const sectionHeaderStyle = {
  textAlign: 'center',
  marginBottom: '30px'
}

const sectionTitleStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  margin: '0 0 10px 0'
}

const sectionSubtitleStyle = {
  fontSize: '1.1rem',
  color: '#666',
  margin: '0 0 20px 0'
}

const fieldsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px'
}

const previewCardStyle = {
  background: '#f8f9fa',
  padding: '20px',
  borderRadius: '10px',
  borderLeft: '4px solid #667eea',
  transition: 'transform 0.2s ease'
}

const previewCardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  marginBottom: '10px'
}

const previewIconStyle = {
  fontSize: '1.5rem'
}

const previewFieldNameStyle = {
  margin: 0,
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#2d3436'
}

const previewDescriptionStyle = {
  margin: '0 0 15px 0',
  color: '#636e72',
  lineHeight: '1.5'
}

const previewButtonStyle = {
  background: 'transparent',
  border: '2px solid #667eea',
  color: '#667eea',
  padding: '8px 16px',
  borderRadius: '20px',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: '600',
  display: 'inline-block',
  transition: 'all 0.3s ease'
}

const emptyFieldsStyle = {
  textAlign: 'center',
  padding: '40px',
  color: '#636e72',
  fontSize: '1.1rem'
}

const adminSectionStyle = {
  marginTop: '40px',
  padding: '25px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '15px',
  color: 'white'
}

const adminTitleStyle = {
  fontSize: '1.8rem',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  textAlign: 'center'
}

const adminGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px'
}

const adminCardStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  padding: '20px',
  borderRadius: '12px',
  textDecoration: 'none',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)'
}

const adminCardContentStyle = {
  textAlign: 'center'
}

const adminIconStyle = {
  fontSize: '2.5rem',
  marginBottom: '15px',
  display: 'block'
}

const adminCardTitleStyle = {
  fontSize: '1.3rem',
  fontWeight: 'bold',
  margin: '0 0 10px 0'
}

const adminCardTextStyle = {
  fontSize: '0.9rem',
  opacity: 0.9,
  margin: 0
}

const contactSupportStyle = {
  marginTop: '40px',
  background: '#f7f7f7',
  padding: '25px',
  borderRadius: '15px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
}

const contactSupportTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#2d3436',
  margin: '0 0 15px 0'
}

const contactSupportTextStyle = {
  fontSize: '1.1rem',
  color: '#2d3436',
  margin: '0 0 15px 0'
}

const contactButtonContainerStyle = {
  display: 'flex',
  gap: '15px',
  flexWrap: 'wrap'
}

const contactButtonStyle = {
  background: '#667eea',
  color: 'white',
  padding: '12px 20px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  width: '200px',
  display: 'block'
}

// Add CSS animations
const styles = `
@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
}

@keyframes scrollHorizontal {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style")
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}