'use client';
import { FinovaEvents } from '../components/GoogleTagManager';

export function useFinovaEvents() {
  return {
    // Función para trackear registro de usuarios
    trackRegister: () => {
      FinovaEvents.register();
      console.log('Evento de registro enviado a Google Analytics');
    },
    
    // Función para trackear login
    trackLogin: () => {
      FinovaEvents.login();
      console.log('Evento de login enviado a Google Analytics');
    },
    
    // Función para trackear solicitud de crédito (EVENTO MÁS IMPORTANTE)
    trackSolicitarCredito: () => {
      FinovaEvents.solicitarCredito();
      console.log('Evento de solicitar crédito enviado a Google Analytics');
    },
    
    // Función para trackear formulario de contacto
    trackContact: () => {
      FinovaEvents.contact();
      console.log('Evento de contacto enviado a Google Analytics');
    },
    
    // Función para trackear clicks en WhatsApp
    trackWhatsapp: () => {
      FinovaEvents.whatsapp();
      console.log('Evento de WhatsApp enviado a Google Analytics');
    },
    
    // Función para trackear scroll al 75%
    trackScroll75: () => {
      FinovaEvents.scroll75();
      console.log('Evento de scroll 75% enviado a Google Analytics');
    }
  };
}