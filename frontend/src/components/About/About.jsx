
import React from 'react';
import { Map, Users, Settings } from 'lucide-react'; 
import animationData from '../../assets/animation/Traveler.json'; 
import Lottie from 'lottie-react';
import './About.css'

const About = () => {
  const advantages = [
    {
      icon: Map, 
      title: "Authentic Local Guides",
      description: "Connect directly with verified Moroccan navigators who know their city like the back of their hand.",
      // La couleur de l'icône peut être définie globalement en CSS ou ici si besoin
    },
    {
      icon: Users, 
      title: "Human Connection",
      description: "Every match is reviewed by our team — ensuring you have a safe and personalized experience.",
    },
    {
      icon: Settings, 
      title: "Flexible & Simple",
      description: "Plan your journey your way. Select the date, time, and city with ease, while our admin helps you every step of the way.",
    },
  ];

  return (
    <section className="why-us-section" id="why-us">
      <div className="why-us-container">

        {/* Contenu de gauche : Les points clés */}
        <div className="why-us-content-left">
          {advantages.map((item, index) => (
            <div key={index} className="advantage-item">
              <div className="advantage-icon-wrapper">
                {/* L'icône dynamique avec une taille et une couleur par défaut */}
                <item.icon size={24} className="advantage-icon" />
              </div>
              <div className="advantage-text">
                <h3 className="advantage-title">{item.title}</h3>
                <p className="advantage-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contenu de droite : Image ou LottieFiles */}
        <div className="why-us-media-right">
          <Lottie
            animationData={animationData} 
            loop={true} 
            className="lottie-animation" 
            style={{ width: 400, height: 400 }} 
          />

          {/* Option 2: Image de remplacement si pas de LottieFiles pour l'instant */}
          {/* <img
            src={placeholderImage}
            alt="Illustration animée"
            className="why-us-image"
          /> */}
        </div>
      </div>
    </section>
  );
};

export default About;