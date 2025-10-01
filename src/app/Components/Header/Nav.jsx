"use client"
import { useRouter, usePathname } from 'next/navigation';
import { finovaData } from '../../Data/finovaData';
import FinovaButton from '../Common/FinovaButton';

export default function Nav({ setMobileToggle }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    
    // Si es un ancla (#)
    if (href.startsWith('#')) {
      // Si NO estamos en home, ir a home primero con el ancla
      if (pathname !== '/') {
        router.push(`/${href}`);
      } else {
        // Estamos en home, hacer scroll suave
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);
        
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.warn(`⚠️ No se encontró el elemento con id: "${targetId}"`);
        }
      }
    } else {
      // Es una ruta completa (como /contact)
      router.push(href);
    }
    
    // Cerrar menú móvil
    if (setMobileToggle) setMobileToggle(false);
  };

  return (
    <ul className="cs_nav_list fw-medium m-0 p-0">
      {finovaData.navigation
        .filter(item => !item.isButton)
        .map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              style={{ 
                color: '#12274B', 
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#1468B1'}
              onMouseLeave={(e) => e.target.style.color = '#12274B'}
            >
              {item.name}
            </a>
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
            variant="navbarSolid"
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
        variant="navbarSolid"
        location="navbar"
        customText="Iniciar sesión"
      />
    </div>
  );
}