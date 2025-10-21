# ESCENARIOS ADICIONALES Y SOLUCIONES - DATOS DE AMORTIZACIÓN

## ESCENARIO 2: Campos de Cuota con Nombres Diferentes

### **Problema**: 
La estructura de cada cuota tiene nombres de campos diferentes a los esperados por el frontend.

### **Solución**: Normalizar campos de cuotas

```typescript
// Después del procesamiento del array de amortización, normalizar cada cuota
if (Array.isArray(amortizacion) && amortizacion.length > 0) {
  amortizacion = amortizacion.map((cuota: any, cuotaIndex: number) => {
    if (!cuota || typeof cuota !== 'object') {
      console.warn(`Cuota ${cuotaIndex} inválida en crédito ${credito.prestamo_ID}`);
      return null;
    }

    return {
      // Normalizar fecha (múltiples nombres posibles)
      fecha: cuota.fecha 
        || cuota.fecha_vencimiento 
        || cuota.fechaVencimiento 
        || cuota.fecha_pago 
        || cuota.fechaPago
        || cuota.due_date
        || new Date().toISOString(),

      // Normalizar valor de cuota (múltiples nombres posibles)  
      valorCuota: parseFloat(cuota.valorCuota 
        || cuota.valor_cuota 
        || cuota.monto 
        || cuota.amount 
        || cuota.valor 
        || cuota.cuota 
        || 0),

      // Normalizar mora (múltiples nombres posibles)
      mora: parseFloat(cuota.mora 
        || cuota.interes_mora 
        || cuota.interesMora 
        || cuota.penalty 
        || cuota.multa 
        || 0),

      // Normalizar sanción (múltiples nombres posibles)
      sancion: parseFloat(cuota.sancion 
        || cuota.sancion_mora 
        || cuota.sancionMora 
        || cuota.penalty_fee 
        || cuota.recargo 
        || 0),

      // Normalizar estado (múltiples nombres posibles)
      estado: (cuota.estado 
        || cuota.status 
        || cuota.estado_pago 
        || cuota.estadoPago 
        || cuota.payment_status 
        || 'PENDIENTE').toUpperCase()
    };
  }).filter(Boolean); // Eliminar cuotas nulas

  console.log(`Cuotas normalizadas para crédito ${credito.prestamo_ID}: ${amortizacion.length} cuotas válidas`);
  if (amortizacion.length > 0) {
    console.log(`Primera cuota normalizada:`, amortizacion[0]);
  }
}
```

---

## ESCENARIO 3: Amortización Anidada en Otro Objeto

### **Problema**: 
Los datos de amortización están dentro de un objeto anidado.

### **Solución**: Búsqueda profunda

```typescript
// Función auxiliar para buscar amortización en objetos anidados
function buscarAmortizacionAnidada(credito: any): any[] {
  const posiblesCampos = [
    // Primer nivel
    'amortizacion', 'cuotas', 'pagos', 'plan_pagos', 'planPagos', 'detalleCuotas',
    // Segundo nivel (anidado)
    'detalle.cuotas', 'plan.pagos', 'cronograma.cuotas', 'data.amortizacion',
    'payment_plan.installments', 'loan_details.payments'
  ];

  for (const campo of posiblesCampos) {
    const partes = campo.split('.');
    let valor = credito;
    
    // Navegar por el objeto anidado
    for (const parte of partes) {
      if (valor && typeof valor === 'object' && valor[parte] !== undefined) {
        valor = valor[parte];
      } else {
        valor = null;
        break;
      }
    }

    // Si encontramos un array válido, devolverlo
    if (Array.isArray(valor) && valor.length > 0) {
      console.log(`Amortización encontrada en: ${campo}, ${valor.length} cuotas`);
      return valor;
    }
  }

  return [];
}

// Usar en el procesamiento principal
let amortizacion = buscarAmortizacionAnidada(credito);
```

---

## ESCENARIO 4: Datos Encriptados o Codificados

### **Problema**: 
Los datos vienen encriptados, base64, o en algún formato especial.

### **Solución**: Decodificación

```typescript
// Función para intentar decodificar datos
function decodificarAmortizacion(data: any): any[] {
  if (!data) return [];

  // Si es string, intentar diferentes decodificaciones
  if (typeof data === 'string') {
    try {
      // Intentar JSON directo
      return JSON.parse(data);
    } catch (e1) {
      try {
        // Intentar Base64
        const decoded = atob(data);
        return JSON.parse(decoded);
      } catch (e2) {
        try {
          // Intentar URL decode
          const urlDecoded = decodeURIComponent(data);
          return JSON.parse(urlDecoded);
        } catch (e3) {
          console.error('No se pudo decodificar datos de amortización');
          return [];
        }
      }
    }
  }

  return Array.isArray(data) ? data : [];
}

// Usar después de encontrar el campo
amortizacion = decodificarAmortizacion(amortizacion);
```

---

## ESCENARIO 5: Datos Vienen de API Separada

### **Problema**: 
La amortización viene de un endpoint diferente que se debe llamar por separado.

### **Solución**: Consulta adicional

```typescript
// Función para obtener amortización por separado
async function obtenerAmortizacionSeparada(prestamoId: string, userDocumento: string): Promise<any[]> {
  try {
    const responseAmortizacion = await axiosWithRetry({
      method: 'post',
      url: `${urls.apiUrl}/api/credit/amortizacion`, // Endpoint específico
      data: { prestamoId, userDocumento },
      ...axiosConfig
    });

    console.log(`Amortización separada para préstamo ${prestamoId}:`, responseAmortizacion.data);
    return Array.isArray(responseAmortizacion.data) ? responseAmortizacion.data : [];
  } catch (error) {
    console.error(`Error obteniendo amortización para préstamo ${prestamoId}:`, error);
    return [];
  }
}

// Usar en el procesamiento principal
if (amortizacion.length === 0 && credito.prestamo_ID) {
  console.log(`Intentando obtener amortización separada para préstamo ${credito.prestamo_ID}`);
  amortizacion = await obtenerAmortizacionSeparada(credito.prestamo_ID, userDocumento);
}
```

---

## ESCENARIO 6: Frontend Renderiza Campos Incorrectos

### **Problema**: 
Los datos llegan correctos pero el frontend está leyendo campos que no existen.

### **Solución**: Actualizar tabla en frontend

```typescript
// En src/app/consulta-deuda/page.tsx, actualizar el renderizado de la tabla
{credito.amortizacion.map((cuota: any, index: number) => {
  // DEBUG: Log de campos disponibles en cada cuota
  console.log(`Cuota ${index} del crédito ${credito.prestamo_ID}:`, {
    camposDisponibles: Object.keys(cuota),
    fecha: cuota.fecha,
    valorCuota: cuota.valorCuota,
    mora: cuota.mora,
    sancion: cuota.sancion,
    estado: cuota.estado
  });

  return (
    <tr key={`${credito.prestamo_ID}-${index}`}>
      <td>{index + 1}</td>
      <td>
        {/* Intentar múltiples formatos de fecha */}
        {cuota.fecha ? new Date(cuota.fecha).toLocaleDateString('es-CO') : 
         cuota.fecha_vencimiento ? new Date(cuota.fecha_vencimiento).toLocaleDateString('es-CO') :
         cuota.fechaVencimiento ? new Date(cuota.fechaVencimiento).toLocaleDateString('es-CO') : 'N/A'}
      </td>
      <td>
        {/* Intentar múltiples nombres de valor de cuota */}
        ${(cuota.valorCuota || cuota.valor_cuota || cuota.monto || cuota.valor || 0).toLocaleString()}
      </td>
      <td>
        {/* Intentar múltiples nombres de mora */}
        ${(cuota.mora || cuota.interes_mora || cuota.interesMora || 0).toLocaleString()}
      </td>
      <td>
        {/* Intentar múltiples nombres de sanción */}
        ${(cuota.sancion || cuota.sancion_mora || cuota.recargo || 0).toLocaleString()}
      </td>
      <td>
        {/* Normalizar estado */}
        {cuota.estado || cuota.status || cuota.estado_pago || 'PENDIENTE'}
      </td>
    </tr>
  );
})}
```

---

## IMPLEMENTACIÓN COMPLETA

### **Archivo actualizado**: `/api/credito/route.ts`

```typescript
// Combinar todos los escenarios en una solución robusta
const creditosValidados = (creditos || []).map((credito: any, index: number) => {
  if (!credito.prestamo_ID) {
    console.warn(`Crédito ${index} sin prestamo_ID, omitiendo`);
    return null;
  }

  // ESCENARIO 1: Múltiples nombres de campo
  let amortizacion = credito.amortizacion 
    || credito.cuotas 
    || credito.pagos 
    || credito.plan_pagos
    || credito.planPagos
    || credito.detalleCuotas
    || [];

  // ESCENARIO 3: Búsqueda anidada
  if (!Array.isArray(amortizacion) || amortizacion.length === 0) {
    amortizacion = buscarAmortizacionAnidada(credito);
  }

  // ESCENARIO 4: Decodificación
  amortizacion = decodificarAmortizacion(amortizacion);

  // ESCENARIO 2: Normalizar campos de cuotas
  if (Array.isArray(amortizacion) && amortizacion.length > 0) {
    amortizacion = amortizacion.map((cuota: any, cuotaIndex: number) => {
      if (!cuota || typeof cuota !== 'object') return null;

      return {
        fecha: cuota.fecha || cuota.fecha_vencimiento || cuota.fechaVencimiento || new Date().toISOString(),
        valorCuota: parseFloat(cuota.valorCuota || cuota.valor_cuota || cuota.monto || cuota.valor || 0),
        mora: parseFloat(cuota.mora || cuota.interes_mora || cuota.interesMora || 0),
        sancion: parseFloat(cuota.sancion || cuota.sancion_mora || cuota.recargo || 0),
        estado: (cuota.estado || cuota.status || cuota.estado_pago || 'PENDIENTE').toUpperCase()
      };
    }).filter(Boolean);
  }

  console.log(`Crédito ${credito.prestamo_ID} procesado: ${amortizacion.length} cuotas válidas`);

  return {
    prestamo_ID: credito.prestamo_ID,
    tipoCredito: credito.tipoCredito || credito.tipo_credito || 'CRÉDITO',
    estado: credito.estado || 'DESCONOCIDO',
    pagoMinimo: Math.abs(credito.pagoMinimo || credito.pago_minimo || credito.cuotaMinima || 0),
    pagoTotal: Math.abs(credito.pagoTotal || credito.pago_total || credito.saldoTotal || 0),
    amortizacion: amortizacion,
    documento: userDocumento,
    nombreCompleto: datosUsuario.nombre || datosUsuario.nombreCompleto || 'Cliente Finova',
    email: datosUsuario.email || datosUsuario.correo || 'cliente@finova.com.co',
    telefono: datosUsuario.telefono || datosUsuario.celular || '',
    ciudad: datosUsuario.ciudad || ''
  };
}).filter(Boolean);
```

**Estos escenarios cubren la mayoría de casos problemáticos comunes en APIs financieras y deberían resolver el problema de datos faltantes en la tabla de amortización.**