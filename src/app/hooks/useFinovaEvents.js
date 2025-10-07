'use client';
import { useCallback } from 'react';
import { FinovaEvents } from '../components/GoogleTagManager';

export function useFinovaEvents() {
  
  // Función para trackear registro de usuarios
  const trackRegister = useCallback(() => {
    FinovaEvents.register();
    console.log('Evento de registro enviado a Google Analytics');
  }, []);

  // Función para trackear registro con conversión de Google Ads
  const trackRegistroGoogleAds = useCallback(() => {
    if (typeof window === 'undefined') return;

    // GTM/GA4
    FinovaEvents.register();
    console.log('✅ Evento de registro enviado a GA4');

    // Google Ads Conversion
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17534959511/Y24WCJLwyZUbEJf_qKlB',
        'value': 1.0,
        'currency': 'COP'
      });
      console.log('✅ Conversión de Google Ads enviada');
    } else {
      console.warn('⚠️ gtag no está disponible aún');
    }

    // Meta Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'CompleteRegistration');
      console.log('✅ Evento de registro enviado a Meta Pixel');
    } else {
      console.warn('⚠️ fbq no está disponible aún');
    }
  }, []);

  // Función para trackear login
  const trackLogin = useCallback(() => {
    FinovaEvents.login();
    console.log('Evento de login enviado a Google Analytics');
  }, []);

  // Función para trackear solicitud de crédito (EVENTO MÁS IMPORTANTE)
  const trackSolicitarCredito = useCallback(() => {
    FinovaEvents.solicitarCredito();
    console.log('Evento de solicitar crédito enviado a Google Analytics');
  }, []);

  // Función para trackear formulario de contacto
  const trackContact = useCallback(() => {
    FinovaEvents.contact();
    console.log('Evento de contacto enviado a Google Analytics');
  }, []);

  // Función para trackear clicks en WhatsApp
  const trackWhatsapp = useCallback(() => {
    FinovaEvents.whatsapp();
    console.log('Evento de WhatsApp enviado a Google Analytics');
  }, []);

  // Función para trackear scroll al 75%
  const trackScroll75 = useCallback(() => {
    FinovaEvents.scroll75();
    console.log('Evento de scroll 75% enviado a Google Analytics');
  }, []);

  return {
    trackRegister,
    trackRegistroGoogleAds,
    trackLogin,
    trackSolicitarCredito,
    trackContact,
    trackWhatsapp,
    trackScroll75
  };
}