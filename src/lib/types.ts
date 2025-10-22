// Tipos compartidos para el sistema de créditos y pagos

export interface Amortizacion {
  id: number;
  prestamoID: number;
  documento: string;
  Numero_cuota: string;
  capital: number;
  interes: number;
  aval: number;
  sancion: number;
  total_cuota: number;
  saldo: string;
  fecha_pago: string;
}

export interface Credito {
  prestamo_ID: number;
  documento: string;
  tipoCredito: string;
  valor_prestamo: string;
  plazo: string;
  numero_cuotas: string;
  valor_cuota: string;
  periocidad: string;
  tasa: string;
  fecha_Pago: string;
  estado: 'EN CURSO' | 'JURIDICO' | 'VENCIDO' | 'CANCELADO';
  origen: string;
  proveedor: string;
  fecha_registro: string;
  cuotasConSaldo: number;
  cuotasSinSaldo: number;
  FechaPago?: string;
  diasMora: number;
  sanciones: number;
  avales: number;
  intereses: number;
  capital: number;
  PagoMinimoSoloCapital: number;
  pagoEnMora: number;
  cuotaAlDia: number;
  capitalEnMora: number;
  pagoMinimo: number;
  saldo_ultimaFecha: number;
  saldoUltimaCuota: number;
  pagoTotal: number;
  
  // ✅ Campos adicionales para mora corregida
  tieneMora?: boolean;
  cuotasEnMora?: number;
  
  // Campos adicionales que necesitamos para pagos
  nombreCompleto?: string;
  email?: string;
  amortizacion: Amortizacion[];
}

export interface PayValidaRequest {
  nombreCliente: string;
  email: string;
  amount: number;
  identification: string;
  identificationType: string;
  metodoPago: string;
  ordenId: string;
  prestamoId: number;
}

export interface PayValidaResponse {
  success: boolean;
  url?: string;
  orderID?: string;
  message: string;
  error?: string;
}