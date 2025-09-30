"use client"
import Link from 'next/link';
import { finovaData } from '../../Data/finovaData';
import FinovaButton from '../Common/FinovaButton';

export default function Nav({ setMobileToggle }) {
  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (setMobileToggle) setMobileToggle(false);
  };

  return (
    <ul className="cs_nav_list fw-medium m-0 p-0">
      {finovaData.navigation
        .filter(item => !item.isButton)
        .map((item, index) => (
          <li key={index}>
            {item.href.startsWith('#') ? (
              <a
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                style={{ color: '#12274B', cursor: 'pointer' }}
              >
                {item.name}
              </a>
            ) : (
              <Link
                href={item.href}
                onClick={() => setMobileToggle && setMobileToggle(false)}
                style={{ color: '#12274B' }}
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      
      {/* Botones en móvil */}
      <li className="mobile-auth-buttons">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          padding: '20px 0',
          borderTop: '1px solid rgba(18, 39, 75, 0.1)',
          marginTop: '20px'
        }}>
          <FinovaButton
            variant="navbar"
            location="navbar_mobile"
            customText="Registrarse"
          />
          <FinovaButton
            variant="outline"
            location="navbar_mobile"
            customText="Iniciar sesión"
          />
        </div>
      </li>
    </ul>
  );
}

export function NavButtons({ setMobileToggle }) {
  return (
    <div className="d-flex gap-2 desktop-auth-buttons">
      <FinovaButton
        variant="navbar"
        location="navbar"
        customText="Registrarse"
      />
      <FinovaButton
        variant="outline"
        location="navbar"
        customText="Iniciar sesión"
      />
    </div>
  );
}