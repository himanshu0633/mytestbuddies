import React, { useEffect } from "react";
import { useState } from "react";
import gsap from "gsap";
// import { LogoutButton } from '../components/authCommon'

import logo from '../image/logo.png';
const emailRe = /^\S+@\S+\.\S+$/;
const mobileRe = /^[0-9]{7,15}$/;

const Navbar = () => {
  const [fieldErr, setFieldErr] = useState({});
  const [loading, setLoading] = useState(false);
  const [navLinksActive, setNavLinksActive] = useState(false);

  // Logo Animation on Load
  useEffect(() => {
    const logoIcon = document.querySelector('.logo-icon');
    const letters = document.querySelectorAll('.logo-text span');
    
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power2.out" } });
    tl.from(logoIcon, { y: -8, rotation: -5, duration: 0.8, ease: "bounce.out" });
    tl.to(letters, { opacity: 1, y: 0, stagger: 0.08 }, "-=0.4");

    gsap.to(logoIcon, { y: "+=5", repeat: -1, yoyo: true, duration: 2, ease: "sine.inOut" });

    const logoContainer = document.querySelector('.logo-container');
    logoContainer.addEventListener('mouseenter', () => {
      gsap.to(logoIcon, { scale: 1.1, rotation: 5, duration: 0.3 });
      gsap.to(letters, { color: "#1E90FF", duration: 0.3 });
    });
    logoContainer.addEventListener('mouseleave', () => {
      gsap.to(logoIcon, { scale: 1, rotation: 0, duration: 0.3 });
      gsap.to(letters, { color: "#fff", duration: 0.3 });
    });
  }, []);

  // Toggle mobile menu
  const toggleNavLinks = () => {
    setNavLinksActive(!navLinksActive);
  };

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <div className="logo-container" style={styles.logoContainer}>
          <img src={logo} alt="Logo" className="logo-icon" style={styles.logoIcon} />
        <div className="logo-text" style={styles.logoText}>
          <span>m</span><span>y</span><span>t</span><span>e</span><span>s</span><span>t</span>
          <span>b</span><span>u</span><span>d</span><span>d</span><span>i</span><span>e</span><span>s</span>
        </div>
      </div>
     

      {/* Links */}
      <div className={`nav-links ${navLinksActive ? "active" : ""}`} style={styles.navLinks}>
        <a href="#" style={styles.navLink}>Home</a>
        <a href="#" style={styles.navLink}>About</a>
        <a href="#" style={styles.navLink}>Courses</a>
        <a style={styles.navLink}onClick={() => { localStorage.removeItem('token'); window.location.href='/' }}>Logout</a>
      
      </div>

      {/* Hamburger */}
      <div className="hamburger" onClick={toggleNavLinks} style={styles.hamburger}>
        <div style={styles.hamburgerLine}></div>
        <div style={styles.hamburgerLine}></div>
        <div style={styles.hamburgerLine}></div>
      </div>
    </nav>
  );
};

// Styles for the Navbar
const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 20px',
    background: '#0B3D91',
    color: '#fff',
    position: 'relative',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  logoIcon: {
    width: '50px',
    height: '70px',
    marginRight: '10px',    
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    display: 'flex',
    color: '#fff',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'color 0.3s',
    position: 'relative',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    gap: '4px',
    cursor: 'pointer',
  },
  hamburgerLine: {
    width: '25px',
    height: '3px',
    background: '#fff',
  },
  navLinksActive: {
    display: 'flex',
    position: 'absolute',
    top: '70px',
    right: '20px',
    background: '#0B3D91',
    flexDirection: 'column',
    gap: '10px',
    padding: '10px',
    borderRadius: '6px',
  }
};

export default Navbar;
