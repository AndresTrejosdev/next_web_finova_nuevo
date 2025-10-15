"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PagoResultado() {
  const searchParams = useSearchParams();
  const [estado, setEstado] = useState<'cargando' | 'exitoso' | 'fallido' | 'pendiente'>('cargando');
  const [ordenId, setOrdenId] = useState<string>('');

  useEffect(() => {
    const orden = searchParams.get('orden');
    const status = searchParams.get('status');
    
    if (orden) {
      setOrdenId(orden);
      
      // Simular consulta del estado
      setTimeout(() => {
        if (status === 'success') {
          setEstado('exitoso');
        } else if (status === 'failed') {
          setEstado('fallido');
        } else {
          setEstado('pendiente');
        }
      }, 2000);
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (estado) {
      case 'cargando':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Procesando pago...</h2>
            <p className="text-gray-600">Verificando el estado de tu transacción</p>
          </div>
        );

      case 'exitoso':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">¡Pago Exitoso!</h2>
            <p className="text-gray-600 mb-4">Tu pago ha sido procesado correctamente</p>
            <p className="text-sm text-gray-500">Orden: {ordenId}</p>
          </div>
        );

      case 'fallido':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Pago Fallido</h2>
            <p className="text-gray-600 mb-4">Hubo un problema procesando tu pago</p>
            <p className="text-sm text-gray-500 mb-4">Orden: {ordenId}</p>
          </div>
        );

      case 'pendiente':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">Pago Pendiente</h2>
            <p className="text-gray-600 mb-4">Tu pago está siendo procesado</p>
            <p className="text-sm text-gray-500">Orden: {ordenId}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderContent()}
          
          <div className="mt-8 space-y-3">
            <Link
              href="/consulta-deuda"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors block text-center"
            >
              Consultar mis créditos
            </Link>
            
            <Link
              href="/"
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors block text-center"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}