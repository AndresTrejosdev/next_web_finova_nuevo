export const validateEnvironment = () => {
  const required = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_PANEL_URL',
    'NEXT_PUBLIC_PAYVALIDA_API',
    'NEXT_PUBLIC_RETURN_URL',
    'NEXT_PUBLIC_CANCEL_URL'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Variables faltantes: ${missing.join(', ')}`);
  }
};

export const parseFechaSafe = (fecha: string | Date): Date => {
  if (fecha instanceof Date) return fecha;
  
  let date = new Date(fecha);
  
  if (isNaN(date.getTime())) {
    const [day, month, year] = fecha.split('/');
    date = new Date(`${year}-${month}-${day}`);
  }
  
  if (isNaN(date.getTime())) {
    console.error('⚠️ Fecha inválida:', fecha);
    return new Date();
  }
  
  return date;
};

export const sanitizeAmount = (amount: number): number => {
  const sanitized = Math.abs(Number(amount) || 0);
  return Math.round(sanitized);
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};