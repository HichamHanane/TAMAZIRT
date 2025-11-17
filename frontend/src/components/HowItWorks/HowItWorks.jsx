import React from 'react';
import { Search, Send, CheckCircle, Map } from 'lucide-react';
import './HowItWorks.css'
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    number: 1,
    icon: Search,
    title: "Find a Local Navigator",
    description: "Browse verified locals by city, language, or expertise."
  },
  {
    number: 2,
    icon: Send,
    title: "Send a Request",
    description: "Select your preferred navigator and send a request form with your date and details."
  },
  {
    number: 3,
    icon: CheckCircle,
    title: "Admin Confirms the Match",
    description: "Our team reviews and approves every connection to ensure quality and trust."
  },
  {
    number: 4,
    icon: Map,
    title: "Meet & Explore",
    description: "Receive contact details once confirmed and enjoy your personalized local experience."
  },
];
const HowItWorks = () => {
  const navigate = useNavigate()

  return (
    <section className="how-it-works-section" id="navigators">
      <div className="how-it-works-container">

        <div className="hiw-header">
          <h2 className="hiw-title">Your Journey, Step by Step</h2>
          <p className="hiw-subtitle">
            From discovery to connection — experience Morocco the right way.
          </p>
        </div>

        <div className="hiw-steps-grid">
          {steps.map((step) => (
            <div key={step.number} className="hiw-step-item">

              <div className="hiw-icon-wrapper">
                <span className="step-number">{step.number}</span>
                <step.icon size={24} className="step-icon" />
              </div>

              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="hiw-cta-wrapper">
          <button className="cta-button primary hiw-cta-button" onClick={() => navigate('/guides')}>
            Find Your Navigator
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;