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
    FinovaEvents.register();
    console.log('Evento de registro enviado a Google Analytics');
    
    // Disparar conversión de Google Ads
    if (typeof window !== 'undefined' && typeof window.gtag_report_conversion === 'function') {
      window.gtag_report_conversion();
      console.log('Conversión de Google Ads enviada');
    } else {
      console.warn('gtag_report_conversion no está disponible');
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
    trackRegistroGoogleAds,  // ← NUEVA: Usa esta para el botón de registro
    trackLogin,
    trackSolicitarCredito,
    trackContact,
    trackWhatsapp,
    trackScroll75
  };
}