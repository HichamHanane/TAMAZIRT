// src/components/Services.jsx

import React from 'react';

// Importe tes images pour chaque service
// Assure-toi d'avoir ces images dans ton dossier src/assets/
import serviceImage1 from '../../assets/service4.jpg';
import serviceImage2 from '../../assets/service2.jpg';
import serviceImage3 from '../../assets/service3.jpg';
import serviceImage4 from '../../assets/service4.jpg';

import './Services.css'

const Services = () => {
  const servicesList = [
    {
      image: serviceImage1,
      title: "LOCAL EXPERTISE",
      description: "Travel with insiders who know the hidden gems and authentic spots of every Moroccan city."
    },
    {
      image: serviceImage2,
      title: "LOCAL EXPERTISE",
      description: "Craft your journey your way – flexible schedules, and unique experiences."
    },
    {
      image: serviceImage3,
      title: "SEAMLESS GUIDANCE",
      description: "Our team ensures smooth coordination between you and your navigator for a stress-free journey."
    },
    {
      image: serviceImage4,
      title: "MEMORABLE STORIES",
      description: "Share your adventure and discover others' journeys – build memories that last a lifetime."
    },
  ];

  return (
    <section className="services-section">
      <div className="services-container">
        {/* Titre et Sous-titre de la section */}
        <div className="services-header">
          <h2 className="services-title">EXPLORE WHAT WE OFFER</h2>
          <p className="services-subtitle">
            UNLOCK UNIQUE EXPERIENCES, CURATED BY LOCAL EXPERTS, FOR EVERY TRAVELER IN MOROCCO.
          </p>
        </div>

        {/* Grille des services */}
        <div className="services-grid">
          {servicesList.map((service, index) => (
            <div key={index} className={`service-card service-card-${index + 1}`}>
              <img src={service.image} alt={service.title} className="service-card-image" loading='lazy'/>
              <div className="service-card-overlay">
                <h3 className="service-card-title">{service.title}</h3> 
                <p className="service-card-description">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;