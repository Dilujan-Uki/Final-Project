// src/components/work/common/PricingCard.jsx
import React from 'react';
import './PricingCard.css';

const PricingCard = ({ plan, featured = false }) => {
  return (
    <div className={`pricing-card ${featured ? 'featured' : ''}`}>
      {featured && <div className="popular-badge">Most Popular</div>}
      
      <div className="pricing-header">
        <h3 className="plan-name">{plan.name}</h3>
        <div className="price-container">
          <span className="currency">$</span>
          <span className="price">{plan.price}</span>
          <span className="period">/{plan.period}</span>
        </div>
        <p className="plan-description">{plan.description}</p>
      </div>
      
      <div className="pricing-features">
        <ul>
          {plan.features.map((feature, index) => (
            <li key={index} className={feature.included ? '' : 'not-included'}>
              <span className="feature-icon">
                {feature.included ? '✓' : '✗'}
              </span>
              <span className="feature-text">{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <button className={`select-btn ${featured ? 'btn-featured' : ''}`}>
        Select {plan.name}
      </button>
      
      {plan.valueNote && (
        <div className="value-note">
          <span>🔥</span> {plan.valueNote}
        </div>
      )}
    </div>
  );
};

export default PricingCard;