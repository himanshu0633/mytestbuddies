import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import logoFull from "../image/logoFull.png";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import DiwaliQuizPoster from "../components/DiwaliQuizPoster";
// Set countdown target date/time once outside component to avoid re-parsing.
const countdownDate = new Date("October 10, 2025 23:59:59").getTime();

// Reusable button component with improved styling and accessibility
const ActionButton = ({ text, color, hoverColor, onClick, icon, disabled, size = "normal" }) => (
  <button
    style={{
      backgroundColor: color,
      color: color === "#ffc107" ? "#212529" : "white",
      padding: size === "small" ? "10px 15px" : "15px 25px",
      border: "none",
      borderRadius: "8px",
      cursor: disabled ? "not-allowed" : "pointer",
      fontSize: size === "small" ? "0.9rem" : "1.1rem",
      margin: "5px",
      transition: "all 0.3s ease",
      fontWeight: "600",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      opacity: disabled ? 0.6 : 1,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      minWidth: size === "small" ? "100px" : "140px"
    }}
    onClick={disabled ? undefined : onClick}
    onMouseOver={(e) => !disabled && (e.target.style.backgroundColor = hoverColor)}
    onMouseOut={(e) => !disabled && (e.target.style.backgroundColor = color)}
    onFocus={(e) => !disabled && (e.target.style.backgroundColor = hoverColor)}
    onBlur={(e) => !disabled && (e.target.style.backgroundColor = color)}
    aria-label={text}
    disabled={disabled}
    tabIndex={disabled ? -1 : 0}
  >
    {icon && <span style={{ fontSize: size === "small" ? "1rem" : "1.2rem" }}>{icon}</span>}
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
  size: PropTypes.oneOf(["small", "normal"])
};

// Enhanced countdown timer with better visual representation
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
          color: "#dc3545",
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#f8d7da",
          borderRadius: "8px",
          border: "1px solid #f5c6cb"
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
        padding: "20px"
      }}
      aria-live="polite"
      role="timer"
      aria-label="Countdown timer for special offer"
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.1rem",
          color: "#495057",
          marginBottom: "15px"
        }}
      >
        ⏰ Hurry! Special offer ends in:
      </div>
      
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap"
        }}
      >
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div
            key={unit}
            style={{
              backgroundColor: "#fff",
              padding: "15px 10px",
              borderRadius: "8px",
              minWidth: "80px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              border: "1px solid #e9ecef"
            }}
          >
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "#dc3545",
                lineHeight: 1
              }}
            >
              {value.toString().padStart(2, '0')}
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#6c757d",
                textTransform: "uppercase",
                marginTop: "5px"
              }}
            >
              {unit}
            </div>
          </div>
        ))}
      </div>
      
      <div
        style={{
          marginTop: "15px",
          fontSize: "0.9rem",
          color: "#6c757d"
        }}
      >
        Offer ends: October 10, 2025
      </div>
    </div>
  );
}

// Feature card component for better content organization
const FeatureCard = ({ icon, title, description }) => (
  <div
    style={{
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      marginBottom: "15px",
      border: "1px solid #e9ecef",
      transition: "transform 0.2s ease, box-shadow 0.2s ease"
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
    }}
  >
    <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{icon}</div>
    <h3 style={{ color: "#007bff", marginBottom: "10px" }}>{title}</h3>
    <p style={{ margin: 0, color: "#495057" }}>{description}</p>
  </div>
);

FeatureCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

// Circular Floating Action Button Component
const CircularFloatingButton = ({ icon, text, color, hoverColor, onClick }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "20px",
      cursor: "pointer"
    }}
    onClick={onClick}
    onMouseOver={(e) => {
      e.currentTarget.querySelector('.circle-button').style.backgroundColor = hoverColor;
      e.currentTarget.querySelector('.circle-button').style.transform = "scale(1.1)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.querySelector('.circle-button').style.backgroundColor = color;
      e.currentTarget.querySelector('.circle-button').style.transform = "scale(1)";
    }}
  >
    <div
      className="circle-button"
      style={{
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease",
        marginBottom: "8px",
        border: "3px solid white"
      }}
    >
      <span style={{ fontSize: "1.8rem" }}>{icon}</span>
    </div>
    <span
      style={{
        fontSize: "0.8rem",
        fontWeight: "600",
        color: "#495057",
        textAlign: "center",
        maxWidth: "80px",
        lineHeight: "1.2"
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
      title: "Quizzes",
      description: "Fresh, exam-style questions daily to sharpen your skills and track readiness."
    },
    {
      icon: "⚖️",
      title: "Fair Opportunity",
      description: "Level playing field with the same question set for every student."
    },
    {
      icon: "🏆",
      title: "Top 10 Winners",
      description: "Win amazing prizes like Laptops, Tablets, and Mobiles by ranking in top 10."
    },
    {
      icon: "📊",
      title: "Exclusive Reports",
      description: "Personalized performance insights to know exactly how prepared you are."
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "20px",
        lineHeight: 1.6,
        color: "#333",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        position: "relative"
      }}
    >
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          opacity: isScrolled ? 1 : 0,
          visibility: isScrolled ? "visible" : "hidden",
          transition: "all 0.3s ease",
          fontSize: "1.2rem",
          zIndex: 1000
        }}
        aria-label="Scroll to top"
      >
        ↑
      </button>

      {/* Header with sticky behavior */}
      <header 
        style={{ 
          textAlign: "center", 
          marginBottom: "30px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "sticky",
          top: "0",
          zIndex: 100
        }}
      >
        <img
          src={logoFull}
          alt="MyTestBuddies Logo"
          style={{ 
            maxWidth: "200px", 
            borderRadius: "8px",
            transition: "transform 0.3s ease"
          }}
          loading="eager"
          onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
          onMouseOut={(e) => e.target.style.transform = "scale(1)"}
        />
      </header>

      <main>
        {/* Hero Section */}
        <section 
          style={{ 
            textAlign: "center", 
            marginBottom: "40px",
            padding: "40px 20px",
            backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
            color: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 25px rgba(0,123,255,0.3)"
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "1rem",
              fontWeight: "700",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)"
            }}
          >
            🚀 Unlock Your Potential and Win Big!
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              opacity: 0.9,
              maxWidth: "600px",
              margin: "0 auto"
            }}
          >
            Join thousands of students preparing for competitive exams with daily quizzes, 
            personalized reports, and amazing prizes!
          </p>
        </section>
        <DiwaliQuizPoster />

        {/* Features Grid */}
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ 
            textAlign: "center", 
            color: "#007bff", 
            marginBottom: "30px",
            fontSize: "2rem"
          }} >
            🌟 What We Offer
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px"
            }}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>


        {/* Countdown Timer */}
        <section
          style={{
            marginBottom: "40px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            overflow: "hidden",
            border: "2px solid #e9ecef"
          }}
        >
          <CountdownTimer />
        </section>

        {/* CTA Buttons */}
        <section style={{ 
          marginBottom: "40px", 
          textAlign: "center",
          padding: "30px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginBottom: "20px", color: "#495057" }}>
            Ready to Start Your Journey?
          </h3>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register">
              <ActionButton
                text="Register Now"
                color="#007bff"
                hoverColor="#0056b3"
                icon="📝"
              />
            </Link>
            <Link to="/login">
              <ActionButton
                text="Login"
                color="#28a745"
                hoverColor="#218838"
                icon="🔑"
              />
            </Link>
          </div>
        </section>



        {/* How to Participate */}
      {/* <section style={{ marginBottom: "40px" }}>
          <h2 style={{ color: "#007bff", marginBottom: "20px", textAlign: "center" }}>🎯 How to Participate</h2>
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            {[
              "Register on MyTestBuddies.com today.",
              "Start taking daily quizzes.",
              "Check your personalized performance report.",
              "Aim for the top 10 to win fantastic rewards."
            ].map((step, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: "15px",
                  padding: "10px"
                }}
              >
                <div
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    marginRight: "15px",
                    flexShrink: 0
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ color: "#495057", lineHeight: "30px" }}>
                  {step}
                </div>
              </div>
            ))}
          </div>
        </section> */}
      </main>

      <footer
        style={{
          textAlign: "center",
          color: "#666",
          fontSize: "0.9rem",
          padding: "30px 20px",
          marginTop: "40px",
          borderTop: "1px solid #e9ecef",
          backgroundColor: "white",
          borderRadius: "8px"
        }}
      >
        <p style={{ margin: "0 0 10px 0" }}>
          © 2025 MyTestBuddies. All rights reserved.
        </p>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "#999" }}>
          Empowering students to achieve their dreams through innovative learning solutions.
        </p>
      </footer>
    </div>
  );
}
