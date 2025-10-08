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
  const [quizzes, setQuizzes] = useState([])
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    rank: 0
  })
  const [upcomingTests, setUpcomingTests] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const { data: userData } = await api.get('/auth/me')
        setMe(userData)
        
        const { data: quizzesData } = await api.get('/quizzes')
        setQuizzes(quizzesData || [])
        
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

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  marginBottom: '40px'
}

const statCardStyle = {
  padding: '30px 20px',
  borderRadius: '15px',
  color: 'white',
  textAlign: 'center',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s ease',
  cursor: 'pointer'
}

const statNumberStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  margin: '10px 0'
}

const statLabelStyle = {
  fontSize: '1rem',
  opacity: 0.9
}

const mainContentStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '30px',
  marginBottom: '40px'
}

const leftColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '30px'
}

const rightColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '30px'
}

const cardStyle = {
  background: 'white',
  padding: '30px',
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: '1px solid #f0f0f0'
}

const cardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '20px'
}

const cardTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: 0
}

const progressContainerStyle = {
  marginBottom: '20px'
}

const progressInfoStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px'
}

const progressLabelStyle = {
  color: '#666',
  fontSize: '0.9rem'
}

const progressPercentageStyle = {
  color: '#666',
  fontSize: '0.9rem',
  fontWeight: '600'
}

const progressBarBackgroundStyle = {
  height: '12px',
  background: '#f0f0f0',
  borderRadius: '10px',
  overflow: 'hidden',
  marginBottom: '20px'
}

const progressBarFillStyle = {
  height: '100%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '10px',
  transition: 'width 0.5s ease'
}

const progressStatsStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '15px'
}

const progressStatStyle = {
  textAlign: 'center',
  padding: '15px',
  background: '#f8f9fa',
  borderRadius: '10px'
}

const progressNumberStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '5px'
}

const progressStatLabelStyle = {
  color: '#666',
  fontSize: '0.9rem'
}

const testListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
}

const testItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  padding: '20px',
  border: '1px solid #e0e0e0',
  borderRadius: '10px',
  transition: 'all 0.3s ease'
}

const testIconStyle = {
  fontSize: '1.5rem'
}

const testContentStyle = {
  flex: 1
}

const testHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '8px'
}

const testTitleStyle = {
  margin: 0,
  fontSize: '1.1rem',
  fontWeight: '600',
  color: '#2c3e50',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
}

const priorityBadgeStyle = {
  background: '#e74c3c',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '0.7rem',
  fontWeight: 'bold'
}

const testDetailsStyle = {
  display: 'flex',
  gap: '15px',
  flexWrap: 'wrap'
}

const testDetailsStyleSpan = {
  color: '#666',
  fontSize: '0.9rem'
}

const testButtonStyle = {
  padding: '8px 16px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  textDecoration: 'none',
  display: 'inline-block'
}

const testButtonPrimaryStyle = {
  background: '#e74c3c',
  color: 'white'
}

const testButtonSecondaryStyle = {
  background: 'transparent',
  color: '#667eea',
  border: '2px solid #667eea'
}

const actionsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
}

const actionButtonStyle = {
  padding: '15px 20px',
  background: 'transparent',
  border: '2px solid #e0e0e0',
  borderRadius: '10px',
  color: '#2c3e50',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  textAlign: 'left'
}

const actionButtonPrimaryStyle = {
  ...actionButtonStyle,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none'
}

const notificationsListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '20px'
}

const notificationItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '15px',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  background: '#f8f9fa'
}

const notificationIconStyle = {
  fontSize: '1.2rem'
}

const notificationContentStyle = {
  flex: 1
}

const notificationMessageStyle = {
  fontWeight: '500',
  color: '#2c3e50',
  marginBottom: '4px'
}

const notificationTimeStyle = {
  fontSize: '0.8rem',
  color: '#666'
}

const viewAllButtonStyle = {
  display: 'block',
  textAlign: 'center',
  padding: '12px',
  color: '#667eea',
  textDecoration: 'none',
  fontWeight: '600',
  border: '2px solid #667eea',
  borderRadius: '8px',
  transition: 'all 0.3s ease'
}

const studyTipStyle = {
  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  padding: '25px',
  borderRadius: '15px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
}

const studyTipTitleStyle = {
  fontSize: '1.3rem',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 12px 0'
}

const studyTipTextStyle = {
  color: '#2c3e50',
  margin: '0 0 15px 0',
  lineHeight: '1.5'
}

const tipBadgeStyle = {
  background: '#667eea',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '15px',
  fontSize: '0.8rem',
  fontWeight: 'bold'
}

const quizzesGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px',
  marginBottom: '20px'
}

const quizCardStyle = {
  padding: '25px',
  border: '1px solid #e0e0e0',
  borderRadius: '12px',
  background: 'white',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease'
}

const quizTitleStyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#2c3e50',
  margin: '0 0 12px 0'
}

const quizDescriptionStyle = {
  color: '#666',
  fontSize: '0.9rem',
  margin: '0 0 20px 0',
  lineHeight: '1.4'
}

const quizFooterStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const questionCountStyle = {
  padding: '6px 12px',
  background: '#667eea',
  color: 'white',
  borderRadius: '15px',
  fontSize: '0.8rem',
  fontWeight: '600'
}

const startQuizButtonStyle = {
  padding: '8px 16px',
  background: '#27ae60',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  transition: 'all 0.3s ease'
}

const viewAllQuizzesStyle = {
  textAlign: 'center',
  marginTop: '20px'
}

// Add hover effects
Object.assign(statCardStyle, {
  ':hover': {
    transform: 'translateY(-5px)'
  }
})

Object.assign(actionButtonStyle, {
  ':hover': {
    background: '#f8f9fa',
    transform: 'translateX(5px)'
  }
})

Object.assign(actionButtonPrimaryStyle, {
  ':hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a42a8 100%)',
    transform: 'translateX(5px)'
  }
})

Object.assign(testButtonSecondaryStyle, {
  ':hover': {
    background: '#667eea',
    color: 'white'
  }
})

Object.assign(viewAllButtonStyle, {
  ':hover': {
    background: '#667eea',
    color: 'white'
  }
})

Object.assign(quizCardStyle, {
  ':hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
  }
})

Object.assign(startQuizButtonStyle, {
  ':hover': {
    background: '#219653',
    transform: 'scale(1.05)'
  }
})