import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser'; 
import { 
  Mail, 
  Phone, 
  Instagram, 
  Facebook, 
  Send, 
  XCircle, 
  CheckCircle 
} from 'lucide-react'; 
import './Contact.css';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;


const ContactUs = () => {
  const formRef = useRef(); 

  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null); 


  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error("EmailJS IDs missing. Did you restart the server after creating the .env.local file?");
      setStatus('error');
      setTimeout(() => setStatus(null), 5000); 
      return;
    }

    setIsSending(true); 
    setStatus(null); 

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
      publicKey: PUBLIC_KEY,
    })
      .then((result) => {
        console.log('SUCCESS!', result.status, result.text);
        setStatus('success');
        formRef.current.reset(); 
      }, (error) => {
        console.error('FAILED...', error.text);
        setStatus('error');
      })
      .finally(() => {
        setIsSending(false); 
        setTimeout(() => setStatus(null), 5000); 
      });
  };


  const StatusMessage = () => {
    if (!status) return null;

    const Icon = status === 'success' ? CheckCircle : XCircle;
    const message = status === 'success' 
      ? "Message sent successfully! We'll get back to you soon."
      : "Something went wrong. Please check your connection or try again later.";
    
    return (
      <div className={`status-message ${status}`}>
        <Icon size={20} className="status-icon" />
        <span>{message}</span>
      </div>
    );
  };


  return (
    <section className="contact-us-section" id="contact">
      <div className="contact-us-container">
        
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
              <a href="#" aria-label="Instagram"><Instagram size={24} className="social-icon" /></a>
              <a href="#" aria-label="Facebook"><Facebook size={24} className="social-icon" /></a>
            </div>
          </div>
        </div>

        <div className="contact-form-column">
          <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="user_name" placeholder="Your Name" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="user_email" placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="6" placeholder="How can we help?" required></textarea>
            </div>

            <button 
              type="submit" 
              className="cta-button submit-button" 
              disabled={isSending} 
            >
              {isSending ? (
                <>
                  <Send size={18} className="spin-animation" /> 
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
            
            <StatusMessage />
            
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