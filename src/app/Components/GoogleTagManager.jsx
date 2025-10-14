
'use client';
import Script from 'next/script';

const GTM_ID = 'GTM-T7VPCJ6J';

export function GoogleTagManager() {
  return (
    <Script id="gtm-js" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}
    </Script>
  );
}

// FUNCIÓN PARA TRACKING
const trackEvent = (eventName, eventData = {}) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      timestamp: new Date().toISOString(),
      ...eventData,
    });
  }
};

// EVENTOS DE FINOVA
export const FinovaEvents = {
  register: () => trackEvent('generate_lead', {
    event_category: 'conversion',
    event_label: 'registro_usuario'
  }),
  
  login: () => trackEvent('login', {
    event_category: 'engagement',
    event_label: 'iniciar_sesion'
  }),
  
  solicitarCredito: () => trackEvent('begin_checkout', {
    event_category: 'conversion',
    event_label: 'solicitar_credito'
  }),
  
  contact: () => trackEvent('contact', {
    event_category: 'lead',
    event_label: 'formulario_contacto'
  }),
  
  whatsapp: () => trackEvent('contact', {
    event_category: 'lead',
    event_label: 'whatsapp_click'
  }),
  
  scroll75: () => trackEvent('scroll', {
    event_category: 'engagement',
    percent_scrolled: 75
  })
};