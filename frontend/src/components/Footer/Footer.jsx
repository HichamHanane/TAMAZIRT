import React from 'react';
import { Instagram, Facebook, Linkedin, Heart, Youtube } from 'lucide-react';
import './Footer.css';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Colonne 1 : Logo et Description */}
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
            <li><a href="#home">Home</a></li>
            <li><a href="#about-us">About Us</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#blog">Blog</a></li>
          </ul>
        </div>

        {/* Colonne 3 : Explore Cities */}
        <div className="footer-col footer-cities">
          <h4 className="footer-heading">EXPLORE CITIES</h4>
          <ul className="footer-link-list">
            <li><a href="#">Marrakech</a></li>
            <li><a href="#">Casablanca</a></li>
            <li><a href="#">Fès</a></li>
            <li><a href="#">Chefchaouen</a></li>
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