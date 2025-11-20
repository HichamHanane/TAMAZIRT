import React, { useState } from 'react';
import { Instagram, Facebook, Linkedin, Heart, Youtube } from 'lucide-react';
import './Footer.css';
import { HashLink } from 'react-router-hash-link';
import { useNavigate } from 'react-router-dom';


const scrollWithOffset = (el, offset) => {
  const yCoordinate = el.getBoundingClientRect().top + window.scrollY;
  const yOffset = -offset;
  window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
};


const cities = ["Casablanca", "Chefchaouen", "Fès", "Marrakech"]

const Footer = () => {
  const navigate = useNavigate();


  const handleCityClicked = (city) => {
    console.log('City :', city);
    navigate(`/guides/${city}`)
  }

  
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-col footer-info">
          <h3 className="footer-logo">TAMAZIRT</h3>
          <p className="footer-tagline">
            Connecting travelers with authentic local experiences across Morocco.
          </p>
          <div className="copyright-mobile">
            &copy; 2025 Tamazirt. All rights reserved.
          </div>
        </div>

        {/* Colonne 2 : Quick Links */}
        <div className="footer-col footer-links">
          <h4 className="footer-heading">QUICK LINKS</h4>
          <ul className="footer-link-list">
            <li>

              <HashLink to='/#hero' scroll={(el) => scrollWithOffset(el, 70)}>Home</HashLink>
            </li>
            <li><HashLink to='/#why-us' scroll={(el) => scrollWithOffset(el, 70)}>About us</HashLink></li>
            <li>
              <HashLink
                to="/#navigators"
                scroll={(el) => scrollWithOffset(el, 70)}
              >
                How It Works
              </HashLink>
            </li>
            <li>
              <HashLink
                to="/#contact"
                scroll={(el) => scrollWithOffset(el, 70)}
              >
                Contact
              </HashLink>
            </li>
          </ul>
        </div>

        {/* Colonne 3 : Explore Cities */}
        <div className="footer-col footer-cities">
          <h4 className="footer-heading">EXPLORE CITIES</h4>
          <ul className="footer-link-list">
            {
              cities?.map((city, index) => {
                return (
                  <li key={index} style={{ cursor: 'pointer' }} onClick={() => handleCityClicked(city)}>
                    {city}
                  </li>
                )
              })
            }

          </ul>
        </div>

        {/* Colonne 4 : Connect with Us */}
        <div className="footer-col footer-social">
          <h4 className="footer-heading">CONNECT WITH US</h4>
          <div className="social-icons">
            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
            <a href="#" aria-label="LinkedIn"><Youtube size={20} /></a>
            {/* Icône de thème pour remplacer le dernier symbole */}
          </div>
        </div>
      </div>

      {/* Ligne de séparation et bas de page */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright-desktop">
            &copy; 2025 Tamazirt. All rights reserved.
          </div>
          <a href="#" className="privacy-link">Terms & Privacy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;