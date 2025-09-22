"use client"
import Link from 'next/link';
import { finovaData } from '../../Data/finovaData';

export default function Nav({ setMobileToggle }) {
  
  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    if (setMobileToggle) {
      setMobileToggle(false);
    }
  };

  return (
    <ul className="cs_nav_list fw-medium m-0 p-0">
      {finovaData.navigation
        .filter(item => !item.isButton)
        .map((item, index) => (
          <li key={index}>
            {item.href.startsWith('#') ? (
              <a 
              className='mobile-bg-white tablet-bg-white laptop-bg-white small-desktop-bg-white '
                href={item.href} 
                onClick={(e) => handleSmoothScroll(e, item.href)}
                style={{ 
                  color: 'var(--finova-dark, #12274B)',
                  cursor: 'pointer',
                  textDecoration: 'none',
                //  background: 'white',
                  margin: '',

                }}
              >
                {item.name}
              </a>
            ) : (
              <Link
                href={item.href}
                onClick={() => setMobileToggle && setMobileToggle(false)}
                style={{ color: 'var(--finova-dark, #12274B)' }}
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
    </ul>
  );
}

export function NavButtons({ setMobileToggle }) {
  return (
    <div className="d-flex gap-2">
      {finovaData.navigation
        .filter(item => item.isButton)
        .map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`btn btn-sm px-3 ${
              item.name === 'Registrarse'
                ? 'theme-btn'
                : 'theme-btn style2'
            }`}
            onClick={() => setMobileToggle && setMobileToggle(false)}
          >
            {item.name}
          </Link>
        ))}
    </div>
  );
}
