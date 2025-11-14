// src/components/Header.jsx

import React, { useState } from 'react';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import './Header.css'
import { useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../feature/AuthSlice';
import { toast } from 'sonner';


const scrollWithOffset = (el, offset) => {
  const yCoordinate = el.getBoundingClientRect().top + window.scrollY;
  const yOffset = -offset;
  window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
};

const NavLinks = ({ handleLinkClick }) => (
  <>
    <HashLink
      to="/#hero"
      className="nav-link"
      scroll={(el) => scrollWithOffset(el, 70)}
      onClick={handleLinkClick}
    >
      Home
    </HashLink>
    <HashLink
      to="/#why-us"
      className="nav-link"
      scroll={(el) => scrollWithOffset(el, 70)}
      onClick={handleLinkClick}
    >
      Why Us
    </HashLink>
    <HashLink
      to="/#navigators"
      className="nav-link"
      scroll={(el) => scrollWithOffset(el, 70)}
      onClick={handleLinkClick}
    >
      How It Works
    </HashLink>
    <HashLink
      to="/#contact"
      className="nav-link"
      scroll={(el) => scrollWithOffset(el, 70)}
      onClick={handleLinkClick}
    >
      Contact
    </HashLink>
  </>
);

const AuthButtons = ({ navigate, handleLinkClick }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      let result = await dispatch(logoutUser());
      if (result.meta.requestStatus == "fulfilled") {
        navigate('/')
        toast.success('You Successfully Logged out');
        return
      }
    } catch (error) {
      console.log("Error while logging out the use : ", error);

    }
  };

  if (isAuthenticated) {
    return (
      <div className='auth-btn'>
        <button
          className='dashboard-btn'
          onClick={() => {
            navigate('/dashboard');
            handleLinkClick();
          }}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>
        <button
          className='logout-btn'
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className='auth-btn'>
      <button
        className='login-btn'
        onClick={() => {
          navigate('/login');
          handleLinkClick();
        }}
      >
        Login
      </button>
      <button
        className='register-btn'
        onClick={() => {
          navigate('/register');
          handleLinkClick();
        }}
      >
        Register
      </button>
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {

    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    console.log("clicked");

    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">

        {/* Logo */}
        <HashLink to="/#" className="header-logo" onClick={handleLinkClick}>TAMAZIRET</HashLink>

        <nav className="header-nav header-nav--desktop">
          <NavLinks handleLinkClick={handleLinkClick} />
        </nav>

        <AuthButtons navigate={navigate} handleLinkClick={handleLinkClick} />

        <button className="burger-button" onClick={toggleMenu} aria-expanded={isMenuOpen}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={`header-nav header-nav--mobile ${isMenuOpen ? 'is-open' : ''} `} style={{ 'display': isMenuOpen ? null : 'none' }}>
          <NavLinks handleLinkClick={handleLinkClick} />
        </nav>

      </div>
    </header>
  );
};

export default Header;