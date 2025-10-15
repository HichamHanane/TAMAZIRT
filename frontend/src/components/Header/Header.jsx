// src/components/Header.jsx

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Assure-toi d'avoir installé lucide-react
import './Header.css'

// Composant pour les liens de navigation (simulés)
const NavLinks = () => (
  <>
    <a href="#hero" className="nav-link">Home</a>
    <a href="#why-us" className="nav-link">Why Us</a>
    <a href="#navigators" className="nav-link">Navigators</a>
    <a href="#contact" className="nav-link">Contact</a>
  </>
);

const Header = () => {
  // État pour gérer l'ouverture/fermeture du menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fonction pour basculer l'état du menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    // Le header reste sticky et prend 100% de la largeur du viewport
    <header className="header">
      {/* Ce conteneur a la largeur limitée au départ (le design initial) */}
      <div className="header-content">

        {/* Logo */}
        <div className="header-logo">TAMAZIRET</div>

        {/* Menu Desktop (Visible sur grand écran) */}
        <nav className="header-nav header-nav--desktop">
          <NavLinks />
        </nav>

        {/* Bouton Burger (Visible sur mobile) */}
        <button className="burger-button" onClick={toggleMenu} aria-expanded={isMenuOpen}>
          {/* Afficher l'icône X si le menu est ouvert, sinon l'icône Menu */}
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menu Mobile coulissant */}
        <nav className={`header-nav header-nav--mobile ${isMenuOpen ? 'is-open' : ''}`}>
          <NavLinks />
        </nav>

      </div>
    </header>
  );
};

export default Header;