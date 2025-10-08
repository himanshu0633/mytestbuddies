import React from 'react';
import { Link } from 'react-router-dom';
// import DiwaliQuizCard from '../components/DiwaliQuizCard';

export default function Home() {
  const features = [
    {
      icon: '📝',
      title: 'Daily Quizzes',
      description: 'Fresh, exam-style questions daily to sharpen your skills'
    },
    {
      icon: '📊',
      title: 'Performance Analytics',
      description: 'Detailed insights and progress tracking'
    },
    {
      icon: '🏆',
      title: 'Leaderboard',
      description: 'Compete with peers and track your ranking'
    },
    {
      icon: '🎯',
      title: 'Personalized Learning',
      description: 'Adaptive quizzes based on your performance'
    }
  ];

  const testimonials = [
    {
      name: 'Aarav Sharma',
      score: '98%',
      text: 'MyTestBuddies helped me secure AIR 24 in JEE Advanced!'
    },
    {
      name: 'Priya Patel',
      score: '95%',
      text: 'The daily quizzes improved my problem-solving speed significantly.'
    },
    {
      name: 'Rohan Kumar',
      score: '92%',
      text: 'Best platform for competitive exam preparation!'
    }
  ];

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <div style={heroContentStyle}>
          <h1 style={heroTitleStyle}>
            Ace Your Exams with 
            <span style={gradientTextStyle}> MyTestBuddies</span> 🚀
          </h1>
          <p style={heroSubtitleStyle}>
            Join thousands of students preparing for competitive exams with 
            daily quizzes, personalized reports, and amazing prizes!
          </p>
          <div style={heroButtonsStyle}>
            <Link to="/register" style={primaryButtonStyle}>
              Start Free Trial
            </Link>
            <Link to="/login" style={secondaryButtonStyle}>
              Already a Member?
            </Link>
          </div>
          <div style={statsStyle}>
            <div style={statItemStyle}>
              <div style={statNumberStyle}>10K+</div>
              <div style={statLabelStyle}>Active Students</div>
            </div>
            <div style={statItemStyle}>
              <div style={statNumberStyle}>500+</div>
              <div style={statLabelStyle}>Daily Quizzes</div>
            </div>
            <div style={statItemStyle}>
              <div style={statNumberStyle}>50+</div>
              <div style={statLabelStyle}>Toppers</div>
            </div>
          </div>
        </div>
        <div style={heroImageStyle}>
          <div style={floatingElementStyle}>🎯</div>
          <div style={floatingElement2Style}>📚</div>
          <div style={floatingElement3Style}>🏆</div>
        </div>
      </section>

      {/* Diwali Quiz Section */}
      <section style={sectionStyle}>
        {/* <DiwaliQuizCard /> */}
      </section>

      {/* Features Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Why Choose MyTestBuddies?</h2>
        <div style={featuresGridStyle}>
          {features.map((feature, index) => (
            <div key={index} style={featureCardStyle}>
              <div style={featureIconStyle}>{feature.icon}</div>
              <h3 style={featureTitleStyle}>{feature.title}</h3>
              <p style={featureDescriptionStyle}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Success Stories 🎉</h2>
        <div style={testimonialsGridStyle}>
          {testimonials.map((testimonial, index) => (
            <div key={index} style={testimonialCardStyle}>
              <div style={testimonialHeaderStyle}>
                <div style={avatarStyle}>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 style={testimonialNameStyle}>{testimonial.name}</h4>
                  <div style={scoreStyle}>Score: {testimonial.score}</div>
                </div>
              </div>
              <p style={testimonialTextStyle}>"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={ctaSectionStyle}>
        <div style={ctaContentStyle}>
          <h2 style={ctaTitleStyle}>Ready to Start Your Success Journey?</h2>
          <p style={ctaSubtitleStyle}>
            Join now and get access to all features with our special Diwali offer!
          </p>
          <Link to="/register" style={ctaButtonStyle}>
            Get Started Today 🎯
          </Link>
        </div>
      </section>
    </div>
  );
}

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px'
};

const heroSectionStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '50px',
  alignItems: 'center',
  padding: '60px 0',
  minHeight: '80vh'
};

const heroContentStyle = {
  padding: '20px'
};

const heroTitleStyle = {
  fontSize: '3.5rem',
  fontWeight: 'bold',
  lineHeight: '1.2',
  marginBottom: '20px',
  color: '#2c3e50'
};

const gradientTextStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const heroSubtitleStyle = {
  fontSize: '1.3rem',
  color: '#666',
  marginBottom: '40px',
  lineHeight: '1.6'
};

const heroButtonsStyle = {
  display: 'flex',
  gap: '20px',
  marginBottom: '50px',
  flexWrap: 'wrap'
};

const primaryButtonStyle = {
  padding: '15px 30px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '50px',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease'
};

const secondaryButtonStyle = {
  padding: '15px 30px',
  border: '2px solid #667eea',
  color: '#667eea',
  textDecoration: 'none',
  borderRadius: '50px',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  transition: 'all 0.3s ease'
};

const statsStyle = {
  display: 'flex',
  gap: '40px'
};

const statItemStyle = {
  textAlign: 'center'
};

const statNumberStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#667eea',
  marginBottom: '5px'
};

const statLabelStyle = {
  color: '#666',
  fontSize: '0.9rem',
  fontWeight: '600'
};

const heroImageStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const floatingElementStyle = {
  fontSize: '5rem',
  animation: 'float 3s ease-in-out infinite'
};

const floatingElement2Style = {
  fontSize: '4rem',
  position: 'absolute',
  top: '20%',
  left: '10%',
  animation: 'float 4s ease-in-out infinite 1s'
};

const floatingElement3Style = {
  fontSize: '3.5rem',
  position: 'absolute',
  bottom: '20%',
  right: '10%',
  animation: 'float 3.5s ease-in-out infinite 0.5s'
};

const sectionStyle = {
  padding: '80px 0'
};

const sectionTitleStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '50px',
  color: '#2c3e50'
};

const featuresGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '30px'
};

const featureCardStyle = {
  padding: '40px 30px',
  background: 'white',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  transition: 'transform 0.3s ease',
  border: '1px solid #f0f0f0'
};

const featureIconStyle = {
  fontSize: '4rem',
  marginBottom: '20px'
};

const featureTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '15px',
  color: '#2c3e50'
};

const featureDescriptionStyle = {
  color: '#666',
  lineHeight: '1.6'
};

const testimonialsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '30px'
};

const testimonialCardStyle = {
  padding: '30px',
  background: 'white',
  borderRadius: '15px',
  boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)',
  border: '1px solid #f0f0f0'
};

const testimonialHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  marginBottom: '20px'
};

const avatarStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.2rem'
};

const testimonialNameStyle = {
  margin: '0 0 5px 0',
  color: '#2c3e50',
  fontSize: '1.2rem'
};

const scoreStyle = {
  color: '#27ae60',
  fontWeight: 'bold',
  fontSize: '0.9rem'
};

const testimonialTextStyle = {
  color: '#666',
  lineHeight: '1.6',
  fontStyle: 'italic',
  margin: 0
};

const ctaSectionStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '80px 40px',
  borderRadius: '20px',
  textAlign: 'center',
  color: 'white',
  margin: '80px 0'
};

const ctaContentStyle = {
  maxWidth: '600px',
  margin: '0 auto'
};

const ctaTitleStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '20px'
};

const ctaSubtitleStyle = {
  fontSize: '1.2rem',
  marginBottom: '30px',
  opacity: 0.9
};

const ctaButtonStyle = {
  display: 'inline-block',
  padding: '18px 40px',
  background: 'white',
  color: '#667eea',
  textDecoration: 'none',
  borderRadius: '50px',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
};

// Add hover effects
Object.assign(primaryButtonStyle, {
  ':hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
  }
});

Object.assign(secondaryButtonStyle, {
  ':hover': {
    background: '#667eea',
    color: 'white',
    transform: 'translateY(-3px)'
  }
});

Object.assign(featureCardStyle, {
  ':hover': {
    transform: 'translateY(-10px)'
  }
});

Object.assign(ctaButtonStyle, {
  ':hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)'
  }
});

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
`;
document.head.appendChild(styleSheet);