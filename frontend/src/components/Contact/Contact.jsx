import React from 'react';
import { Mail, Phone, Instagram, Facebook } from 'lucide-react'; 
import './Contact.css'



const ContactUs = () => {
  return (
    <section className="contact-us-section" id="contact">
      <div className="contact-us-container">
        
        {/* Colonne 1 : Informations de Contact */}
        <div className="contact-info-column">
          <div className="contact-header">
            <h2 className="contact-title">Let's Stay Connected</h2>
            <p className="contact-subtitle">
              Have a question or idea? We'd love to hear from you.
            </p>
          </div>

          <p className="contact-description">
            We're here to help you navigate your Moroccan adventure. Whether 
            you're a traveler with questions, a potential partner with an exciting idea, 
            or just want to share your feedback, we're all ears. Reach out and let's 
            make your journey unforgettable.
          </p>

          <div className="contact-details">
            <div className="detail-item">
              <Mail size={20} className="detail-icon" />
              <span>contact@tamazirt.com</span>
            </div>
            <div className="detail-item">
              <Phone size={20} className="detail-icon" />
              <span>+212 6 00 00 00 00</span>
            </div>
          </div>

          <div className="follow-us">
            <h4 className="follow-us-title">Follow us</h4>
            <div className="social-links">
              {/* Utilisation des couleurs primaires pour les icônes sociales */}
              <a href="#" aria-label="Instagram"><Instagram size={24} className="social-icon" /></a>
              <a href="#" aria-label="Facebook"><Facebook size={24} className="social-icon" /></a>
              {/* Ajouter d'autres icônes ici si nécessaire */}
            </div>
          </div>
        </div>

        {/* Colonne 2 : Formulaire de Contact */}
        <div className="contact-form-column">
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Your Name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="6" placeholder="How can we help?" required></textarea>
            </div>

            <button type="submit" className="cta-button submit-button">
              Send Message
            </button>
            <p className="response-time-note">
              Our team will get back to you within 24 hours.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;