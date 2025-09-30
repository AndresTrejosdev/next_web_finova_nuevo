"use client"
import React from 'react';

const FinovaButton = ({
  variant = 'primary',
  location = 'unknown',
  customText = null,
  className = 'theme-btn'
}) => {
  
  const buttonConfigs = {
    primary: {
      text: 'Solicitar Crédito',
      href: 'https://app.finova.com.co/auth/register',
      showArrow: true,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '16px 40px',
        fontSize: '1.1rem',
        fontWeight: '700',
        fontFamily: "'Open Sans', sans-serif",
        borderRadius: '50px',
        backgroundColor: '#1468B1',
        color: '#ffffff',
        border: '2px solid #1468B1',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        textDecoration: 'none',
        textAlign: 'center',
        minHeight: '56px',
        boxShadow: '0 4px 12px rgba(20, 104, 177, 0.15)'
      }
    },
    secondary: {
      text: 'Solicita tu crédito ahora',
      href: 'https://app.finova.com.co/auth/register',
      showArrow: true,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '16px 40px',
        fontSize: '1.1rem',
        fontWeight: '700',
        fontFamily: "'Open Sans', sans-serif",
        borderRadius: '50px',
        backgroundColor: '#1468B1',
        color: '#ffffff',
        border: '2px solid #1468B1',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        textDecoration: 'none',
        textAlign: 'center',
        minHeight: '56px',
        boxShadow: '0 4px 12px rgba(20, 104, 177, 0.2)'
      }
    },
    navbar: {
      text: 'Solicitar Crédito',
      href: 'https://app.finova.com.co/auth/register',
      showArrow: true,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 32px',
        fontSize: '1rem',
        fontWeight: '700',
        fontFamily: "'Open Sans', sans-serif",
        borderRadius: '50px',
        backgroundColor: '#1468B1',
        color: '#ffffff',
        border: '2px solid #1468B1',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        textDecoration: 'none',
        textAlign: 'center',
        minHeight: '48px'
      }
    },
    outline: {
      text: 'Iniciar sesión',
      href: 'https://app.finova.com.co/auth/boxed-signin',
      showArrow: false,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 32px',
        fontSize: '1rem',
        fontWeight: '700',
        fontFamily: "'Open Sans', sans-serif",
        borderRadius: '50px',
        backgroundColor: 'transparent',
        color: '#1468B1',
        border: '2px solid #1468B1',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        textDecoration: 'none',
        textAlign: 'center',
        minHeight: '48px'
      }
    }
  };

  const config = buttonConfigs[variant] || buttonConfigs.primary;
  const buttonText = customText || config.text;

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'solicitar_credito_click',
        button_location: location,
        button_text: buttonText,
        button_variant: variant,
        destination_url: config.href
      });
    }
  };

  const handleMouseEnter = (e) => {
    if (variant === 'primary') {
      e.target.style.backgroundColor = 'transparent';
      e.target.style.color = '#ffffff';
      e.target.style.borderColor = '#ffffff';
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 8px 20px rgba(255, 255, 255, 0.3)';
    } else if (variant === 'secondary') {
      e.target.style.backgroundColor = '#12274B';
      e.target.style.borderColor = '#12274B';
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 8px 24px rgba(18, 39, 75, 0.3)';
    } else if (variant === 'navbar') {
      e.target.style.backgroundColor = '#12274B';
      e.target.style.borderColor = '#12274B';
      e.target.style.transform = 'translateY(-1px)';
    } else if (variant === 'outline') {
      e.target.style.backgroundColor = '#1468B1';
      e.target.style.color = '#ffffff';
    }
  };

  const handleMouseLeave = (e) => {
    if (variant === 'primary') {
      e.target.style.backgroundColor = '#ffffff';
      e.target.style.color = '#1468B1';
      e.target.style.borderColor = '#ffffff';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 12px rgba(20, 104, 177, 0.15)';
    } else if (variant === 'secondary') {
      e.target.style.backgroundColor = '#1468B1';
      e.target.style.borderColor = '#1468B1';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 4px 12px rgba(20, 104, 177, 0.2)';
    } else if (variant === 'navbar') {
      e.target.style.backgroundColor = '#1468B1';
      e.target.style.borderColor = '#1468B1';
      e.target.style.transform = 'translateY(0)';
    } else if (variant === 'outline') {
      e.target.style.backgroundColor = 'transparent';
      e.target.style.color = '#1468B1';
    }
  };

  return (
    <a 
      href={config.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={config.style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {buttonText} {config.showArrow && <i className="bi bi-arrow-right"></i>}
    </a>
  );
};

export default FinovaButton;