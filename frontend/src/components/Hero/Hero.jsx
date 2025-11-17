import './Hero.css'
import mainImage from '../../assets/berber-morocco.avif'
import secondImage from '../../assets/664_moroccoprivatetours (54).jpg'
import thirdImage from '../../assets/kleuren-van-marokko-2.jpg'
import { Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Hero = () => {

  const navigate = useNavigate();
  return (
    <section className="hero-section" id="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          DISCOVER MOROCCO <br />
          WITH LOCAL <br />
          NAVIGATORS
        </h1>

        <p className="hero-subtitle">
          CONNECT WITH AUTHENTIC LOCAL GUIDES FOR UNFORGETTABLE JOURNEYS.
        </p>

        <div className="hero-ctas">
          <button className="cta-button primary" onClick={() => navigate('/guides')}>EXPLORE NAVIGATORS</button>
          <button className="cta-button secondary" onClick={() => navigate('/application-form')}>BECOME A NAVIGATOR</button>
        </div>
      </div>

      <div className="hero-images">

        <img
          src={mainImage}
          alt="Village marocain avec montagnes au coucher du soleil"
          className="image-item image-main"
        />

        <img
          src={thirdImage}
          alt="Détail des toits et des montagnes"
          className="image-item image-side top-right"
        />

        <img
          src={secondImage}
          alt="Gros plan sur l'architecture locale"
          className="image-item image-side bottom-left"
        />

      </div>

      <div className="hero-footer-box">

        <div className="footer-stat-item verified-clients">
          <div className="stat-value">12k+</div>
          <div className="stat-label">
            <Users size={14} className="stat-icon" />
            Clients vérifiés
          </div>
        </div>

        <div className="footer-stat-item verified-navigators">
          <div className="stat-value">450+</div>
          <div className="stat-label">
            <MapPin size={14} className="stat-icon" />
            Navigateurs vérifiés
          </div>
        </div>

        <div className="footer-stat-item additional-content">
          <div className="stat-value">5★</div>
          <div className="stat-label">
            Expériences notées
          </div>
        </div>

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