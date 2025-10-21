'use client';
import { useState } from 'react';

export default function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="container">
        <div className="section-title text-center mb-5">
          <h2 className="faq-main-title">Preguntas Frecuentes</h2>
          <p className="faq-subtitle">Resolvemos tus dudas sobre créditos de libre inversión</p>
        </div>
        
        <div className="faq-accordion-wrapper">
          {faqs && faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'active' : ''}`}
            >
              <div 
                className="faq-question"
                onClick={() => handleToggle(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleToggle(index);
                  }
                }}
              >
                <span className="faq-question-text">{faq.question}</span>
                <span className={`faq-arrow ${openIndex === index ? 'rotated' : ''}`}>
                  ➤
                </span>
              </div>
              <div className={`faq-answer-wrapper ${openIndex === index ? 'open' : ''}`}>
                <div className="faq-answer">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}