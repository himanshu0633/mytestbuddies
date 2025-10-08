import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import logoFull from "../image/logoFull.png";
import { Link } from "react-router-dom";
import DiwaliQuizPoster from "../components/DiwaliQuizPoster";

// Set countdown target date/time once outside component to avoid re-parsing.
const countdownDate = new Date("October 15, 2025 23:59:59").getTime();

// Enhanced button component with gradient and modern styling
const ActionButton = ({ text, color, hoverColor, onClick, icon, disabled, size = "normal", gradient = false }) => (
  <button
    style={{
      background: gradient 
        ? `linear-gradient(135deg, ${color}, ${hoverColor})`
        : color,
      color: color === "#ffc107" ? "#212529" : "white",
      padding: size === "small" ? "12px 20px" : "16px 32px",
      border: "none",
      borderRadius: "50px",
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: size === "small" ? "0.9rem" : "1.1rem",
      margin: "8px",
      transition: "all 0.3s ease",
      fontWeight: "700",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
      opacity: disabled ? 0.6 : 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      minWidth: size === "small" ? "120px" : "160px",
      position: "relative",
      overflow: "hidden"
    }}
    onClick={disabled ? undefined : onClick}
    onMouseOver={(e) => {
      if (disabled) return;
      if (!gradient) {
        e.target.style.backgroundColor = hoverColor;
      }
      e.target.style.transform = "translateY(-3px)";
      e.target.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.3)";
    }}
    onMouseOut={(e) => {
      if (disabled) return;
      if (!gradient) {
        e.target.style.backgroundColor = color;
      }
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.2)";
    }}
    aria-label={text}
    disabled={disabled}
    tabIndex={disabled ? -1 : 0}
  >
    {icon && <span style={{ fontSize: size === "small" ? "1.1rem" : "1.3rem" }}>{icon}</span>}
    {text}
  </button>
);

ActionButton.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  hoverColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(["small", "normal"]),
  gradient: PropTypes.bool
};

// Enhanced countdown timer with animated cards
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({});
  const [hasEnded, setHasEnded] = useState(false);

  const updateTimer = useCallback(() => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance < 0) {
      setHasEnded(true);
      return null;
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };
  }, []);

  useEffect(() => {
    const timer = updateTimer();
    if (timer) setTimeLeft(timer);
    
    const interval = setInterval(() => {
      const newTime = updateTimer();
      if (newTime) {
        setTimeLeft(newTime);
      } else {
        setHasEnded(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [updateTimer]);

  if (hasEnded) {
    return (
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.5rem",
          color: "#fff",
          textAlign: "center",
          padding: "30px",
          background: "linear-gradient(135deg, #dc3545, #c82333)",
          borderRadius: "16px",
          boxShadow: "0 8px 25px rgba(220, 53, 69, 0.3)",
          margin: "20px 0"
        }}
        aria-live="assertive"
        role="alert"
      >
        🎉 Offer has ended! Stay tuned for future opportunities.
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: "center",
        padding: "30px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "16px",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
        margin: "20px 0",
        color: "white"
      }}
      aria-live="polite"
      role="timer"
      aria-label="Countdown timer for special offer"
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.3rem",
          marginBottom: "20px",
          textShadow: "0 2px 4px rgba(0,0,0,0.3)"
        }}
      >
        ⏰ Hurry! Special offer ends in:
      </div>
      
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap"
        }}
      >
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div
            key={unit}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              padding: "20px 15px",
              borderRadius: "12px",
              minWidth: "90px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              transition: "transform 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                fontSize: "2.2rem",
                fontWeight: "bold",
                color: "#fff",
                lineHeight: 1,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)"
              }}
            >
              {value.toString().padStart(2, '0')}
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: "rgba(255, 255, 255, 0.9)",
                textTransform: "uppercase",
                marginTop: "8px",
                fontWeight: "600"
              }}
            >
              {unit}
            </div>
          </div>
        ))}
      </div>
      
      <div
        style={{
          marginTop: "20px",
          fontSize: "1rem",
          color: "rgba(255, 255, 255, 0.9)",
          fontWeight: "500"
        }}
      >
        Offer ends: October 15, 2025
      </div>
    </div>
  );
}

// Enhanced Feature Card with gradient backgrounds
const FeatureCard = ({ icon, title, description, index }) => (
  <div
    style={{
      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      padding: "30px 25px",
      borderRadius: "16px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
      marginBottom: "20px",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      transition: "all 0.4s ease",
      position: "relative",
      overflow: "hidden"
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-8px)";
      e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
    }}
  >
    <div 
      style={{ 
        fontSize: "3rem", 
        marginBottom: "15px",
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))"
      }}
    >
      {icon}
    </div>
    <h3 style={{ 
      color: "#2c3e50", 
      marginBottom: "15px",
      fontSize: "1.4rem",
      fontWeight: "700"
    }}>
      {title}
    </h3>
    <p style={{ 
      margin: 0, 
      color: "#5a6c7d",
      lineHeight: "1.6",
      fontSize: "1rem"
    }}>
      {description}
    </p>
    <div 
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: `linear-gradient(90deg, #007bff, #0056b3)`,
        opacity: 0.8
      }}
    />
  </div>
);

FeatureCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  index: PropTypes.number
};

// Enhanced Circular Floating Button
const CircularFloatingButton = ({ icon, text, color, hoverColor, onClick }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "25px",
      cursor: "pointer",
      transition: "transform 0.3s ease"
    }}
    onClick={onClick}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.querySelector('.circle-button').style.background = `linear-gradient(135deg, ${color}, ${hoverColor})`;
      e.currentTarget.querySelector('.circle-button').style.transform = "scale(1.1) rotate(5deg)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.querySelector('.circle-button').style.background = color;
      e.currentTarget.querySelector('.circle-button').style.transform = "scale(1) rotate(0)";
    }}
  >
    <div
      className="circle-button"
      style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
        transition: "all 0.4s ease",
        marginBottom: "12px",
        border: "4px solid white"
      }}
    >
      <span style={{ fontSize: "2rem" }}>{icon}</span>
    </div>
    <span
      style={{
        fontSize: "0.9rem",
        fontWeight: "700",
        color: "#2c3e50",
        textAlign: "center",
        maxWidth: "90px",
        lineHeight: "1.3"
      }}
    >
      {text}
    </span>
  </div>
);

CircularFloatingButton.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  hoverColor: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: "📝",
      title: "Daily Quizzes",
      description: "Fresh, exam-style questions daily to sharpen your skills and track readiness with detailed analytics."
    },
    {
      icon: "⚖️",
      title: "Fair Opportunity",
      description: "Level playing field with the same question set for every student across all regions and backgrounds."
    },
    {
      icon: "🏆",
      title: "Top 10 Winners",
      description: "Win amazing prizes like Laptops, Tablets, and Mobiles by ranking in top 10 with exclusive rewards."
    },
    {
      icon: "📊",
      title: "Exclusive Reports",
      description: "Personalized performance insights with AI-powered analysis to know exactly how prepared you are."
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "auto",
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "20px",
        lineHeight: 1.6,
        color: "#2c3e50",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        position: "relative"
      }}
    >
      {/* Enhanced Scroll to top button */}
      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          background: "linear-gradient(135deg, #007bff, #0056b3)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(0,123,255,0.4)",
          opacity: isScrolled ? 1 : 0,
          visibility: isScrolled ? "visible" : "hidden",
          transition: "all 0.4s ease",
          fontSize: "1.5rem",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "translateY(-3px)";
          e.target.style.boxShadow = "0 8px 25px rgba(0,123,255,0.5)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 6px 20px rgba(0,123,255,0.4)";
        }}
        aria-label="Scroll to top"
      >
        ↑
      </button>

      {/* Enhanced Header with glass morphism effect */}
      <header 
        style={{ 
          textAlign: "center", 
          marginBottom: "40px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          position: "sticky",
          top: "20px",
          zIndex: 100,
          padding: "20px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          transition: "all 0.3s ease"
        }}
      >
        <img
          src={logoFull}
          alt="MyTestBuddies Logo"
          style={{ 
            maxWidth: "220px", 
            borderRadius: "12px",
            transition: "transform 0.3s ease",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))"
          }}
          loading="eager"
          onMouseOver={(e) => e.target.style.transform = "scale(1.05) rotate(1deg)"}
          onMouseOut={(e) => e.target.style.transform = "scale(1) rotate(0)"}
        />
      </header>

      <main>
        {/* Enhanced Hero Section */}
        <section 
          style={{ 
            textAlign: "center", 
            marginBottom: "50px",
            padding: "60px 40px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            borderRadius: "24px",
            boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-50%",
              right: "-50%",
              width: "100%",
              height: "200%",
              background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              transform: "rotate(30deg)"
            }}
          />
          <h1
            style={{
              fontSize: "3rem",
              marginBottom: "1.5rem",
              fontWeight: "800",
              textShadow: "0 4px 8px rgba(0,0,0,0.3)",
              lineHeight: "1.2"
            }}
          >
            🚀 Unlock Your Potential and Win Big!
          </h1>
          <p
            style={{
              fontSize: "1.3rem",
              opacity: 0.95,
              maxWidth: "700px",
              margin: "0 auto 2rem",
              fontWeight: "500",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}
          >
            Join thousands of students preparing for competitive exams with daily quizzes, 
            personalized reports, and amazing prizes!
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "15px" }}>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <ActionButton
                text="Get Started Free"
                color="#007bff"
                hoverColor="#0056b3"
                icon="🎯"
                gradient={true}
              />
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <ActionButton
                text="Login to Dashboard"
                color="#28a745"
                hoverColor="#218838"
                icon="🚀"
                gradient={true}
              />
            </Link>
          </div>
        </section>

        {/* Diwali Quiz Poster Section */}
        <section style={{ marginBottom: "50px" }}>
          <DiwaliQuizPoster />
        </section>

        {/* Enhanced Features Grid */}
        <section style={{ marginBottom: "50px" }}>
          <h2 style={{ 
            textAlign: "center", 
            color: "#2c3e50", 
            marginBottom: "40px",
            fontSize: "2.5rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 4px 8px rgba(0,0,0,0.1)"
          }}>
            🌟 Why Choose MyTestBuddies?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px"
            }}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Enhanced Countdown Timer */}
        <section
          style={{
            marginBottom: "50px"
          }}
        >
          <CountdownTimer />
        </section>

        {/* Enhanced CTA Section */}
        <section style={{ 
          marginBottom: "50px", 
          textAlign: "center",
          padding: "50px 40px",
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          borderRadius: "24px",
          boxShadow: "0 15px 35px rgba(240, 147, 251, 0.3)",
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 50%)"
            }}
          />
          <h3 style={{ 
            marginBottom: "25px", 
            fontSize: "2rem",
            fontWeight: "700",
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            position: "relative",
            zIndex: 1
          }}>
            Ready to Transform Your Preparation?
          </h3>
          <p style={{
            marginBottom: "30px",
            fontSize: "1.2rem",
            opacity: 0.95,
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
            position: "relative",
            zIndex: 1
          }}>
            Join now and get access to exclusive features that will boost your exam preparation journey!
          </p>
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            flexWrap: "wrap",
            position: "relative",
            zIndex: 1
          }}>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <ActionButton
                text="Pay & Win Prizes"
                color="#ff6b6b"
                hoverColor="#ee5a52"
                icon="⭐"
                gradient={true}
              />
            </Link>
            <Link to="/features" style={{ textDecoration: "none" }}>
              <ActionButton
                text="View Features"
                color="#4ecdc4"
                hoverColor="#45b7af"
                icon="🔍"
                gradient={true}
              />
            </Link>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer
        style={{
          textAlign: "center",
          color: "#5a6c7d",
          fontSize: "0.95rem",
          padding: "40px 20px",
          marginTop: "60px",
          borderTop: "1px solid #e9ecef",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          borderRadius: "20px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.05)"
        }}
      >
        <p style={{ 
          margin: "0 0 15px 0",
          fontWeight: "600",
          fontSize: "1.1rem",
          color: "#2c3e50"
        }}>
          © 2025 MyTestBuddies. All rights reserved.
        </p>
        <p style={{ 
          margin: 0, 
          fontSize: "0.9rem", 
          color: "#7b8a8b",
          maxWidth: "500px",
          marginLeft: "auto",
          marginRight: "auto"
        }}>
          Empowering students to achieve their dreams through innovative learning solutions and cutting-edge technology.
        </p>
      </footer>
    </div>
  );
}