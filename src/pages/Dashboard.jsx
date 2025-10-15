import { useEffect, useState } from 'react'
import api from '../utils/axios'
import { Link } from 'react-router-dom'
import { LogoutButton } from '../components/authCommon'
import Navbar from '../components/navbar'

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
  const [fields, setFields] = useState([]) // ✅ Fields state add kiya
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

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const { data: userData } = await api.get('/auth/me')
        setMe(userData?.user)
        
        // ✅ Fields fetch karo
        try {
          const { data: fieldsData } = await api.get('/admin/fields')
          setFields(fieldsData || [])
        } catch (fieldsError) {
          console.error('Error fetching fields:', fieldsError)
          setFields([]) // Default empty array
        }
        
        // Mock stats data
        setStats({
          totalQuizzes: 12,
          completedQuizzes: 8,
          averageScore: 78,
          rank: 45
        })
        
        // Mock upcoming tests
        setUpcomingTests([
          { id: 1, title: 'Mathematics Mega Test', date: '2024-10-25', time: '10:00 AM', duration: '180 mins', priority: 'high' },
          { id: 2, title: 'Physics Weekly Quiz', date: '2024-10-26', time: '02:00 PM', duration: '60 mins', priority: 'medium' },
          { id: 3, title: 'Chemistry Practice Test', date: '2024-10-27', time: '11:00 AM', duration: '90 mins', priority: 'low' }
        ])
        
        // Mock notifications
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

  const progressValue = stats.totalQuizzes > 0 ? (stats.completedQuizzes / stats.totalQuizzes) * 100 : 0

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c'
      case 'medium': return '#f39c12'
      case 'low': return '#27ae60'
      default: return '#95a5a6'
    }
  }

  // Notification icons
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'result': return '📊'
      case 'new_quiz': return '🆕'
      case 'achievement': return '🎯'
      default: return '💡'
    }
  }

  // Handlers for hover effect
  const handleMouseEnter = (button) => {
    setHoveredButton(button)
  }

  const handleMouseLeave = () => {
    setHoveredButton(null)
  }

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
        </div>

        {/* Practice Fields Section - ✅ YEH SECTION ADD KIYA */}
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

        {/* Admin Section - Agar user admin hai to */}
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
              
              {/* Future admin features yahan add kar sakte hain */}
              
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

// Enhanced Styles
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
}

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

// ✅ New Fields Section Styles
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

const viewAllButtonStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '25px',
  textDecoration: 'none',
  fontWeight: '600',
  display: 'inline-block'
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

// ✅ Admin Section Styles
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

// Contact Support Styles
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