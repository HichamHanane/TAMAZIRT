// src/components/Hero.jsx

import './Hero.css'
import mainImage from '../../assets/hero-morocco.jpg'
import { Users, MapPin } from 'lucide-react';
const Hero = ({ images }) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        {/* Titre principal */}
        <h1 className="hero-title">
          DISCOVER MOROCCO <br />
          WITH LOCAL <br />
          NAVIGATORS
        </h1>

        {/* Sous-texte */}
        <p className="hero-subtitle">
          CONNECT WITH AUTHENTIC LOCAL GUIDES FOR UNFORGETTABLE JOURNEYS.
        </p>

        {/* Boutons d'appel à l'action (CTA) */}
        <div className="hero-ctas">
          <button className="cta-button primary">EXPLORE NAVIGATORS</button>
          <button className="cta-button secondary">BECOME A NAVIGATOR</button>
        </div>
      </div>

      {/* Section des images (à droite) */}
      <div className="hero-images">

        {/* Image principale (Grande) */}
        <img
          src={mainImage}
          alt="Village marocain avec montagnes au coucher du soleil"
          className="image-item image-main"
        />

        {/* Petite image en haut à droite */}
        <img
          src={mainImage}
          alt="Détail des toits et des montagnes"
          className="image-item image-side top-right"
        />

        {/* Petite image en bas à gauche */}
        <img
          src={mainImage}
          alt="Gros plan sur l'architecture locale"
          className="image-item image-side bottom-left"
        />

        {/* Note: Il y a un espace vide dans la grille 2x2, il n'y a donc pas de 4ème élément ici */}
      </div>

      {/* La grande boîte rectangulaire en bas */}
      <div className="hero-footer-box">

        {/* Conteneur 1 : Clients vérifiés */}
        <div className="footer-stat-item verified-clients">
          <div className="stat-value">12k+</div>
          <div className="stat-label">
            <Users size={14} className="stat-icon" />
            Clients vérifiés
          </div>
        </div>

        {/* Conteneur 2 : Navigateurs vérifiés */}
        <div className="footer-stat-item verified-navigators">
          <div className="stat-value">450+</div>
          <div className="stat-label">
            <MapPin size={14} className="stat-icon" />
            Navigateurs vérifiés
          </div>
        </div>

        {/* Conteneur 3 : Contenu additionnel 1 */}
        <div className="footer-stat-item additional-content">
          <div className="stat-value">5★</div>
          <div className="stat-label">
            Expériences notées
          </div>
        </div>

        {/* Conteneur 4 : Contenu additionnel 2 (par exemple, destination) */}
        <div className="footer-stat-item additional-content">
          <div className="stat-value">Maroc</div>
          <div className="stat-label">
            Destination principale
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;