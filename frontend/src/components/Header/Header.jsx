// src/components/Header.jsx

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css'
import { useNavigate } from 'react-router-dom';

const NavLinks = () => (
  <>
    <a href="#hero" className="nav-link">Home</a>
    <a href="#why-us" className="nav-link">Why Us</a>
    <a href="#navigators" className="nav-link">Navigators</a>
    <a href="#contact" className="nav-link">Contact</a>
  </>
);

const Header = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">

        {/* Logo */}
        <div className="header-logo">TAMAZIRET</div>

        <nav className="header-nav header-nav--desktop">
          <NavLinks />
        </nav>

        <div className='auth-btn'>
          <button
            className='login-btn'
            onClick={() => navigate('/login')}

          >
            Login
          </button>


          <button
            className='register-btn'
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
        <button className="burger-button" onClick={toggleMenu} aria-expanded={isMenuOpen}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={`header-nav header-nav--mobile ${isMenuOpen ? 'is-open' : ''}`}>
          <NavLinks />
        </nav>

      </div>
    </header>
  );
};

export default Header;