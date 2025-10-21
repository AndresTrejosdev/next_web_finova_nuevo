// Componente temporal de diagnóstico para inspeccionar datos
// Añadir justo antes del return en ConsultaDeuda

import { Credito } from "@/lib/types";

const DiagnosticoAmortizacion = ({ credito }: { credito: Credito }) => {
  if (!credito.amortizacion || credito.amortizacion.length === 0) {
    return (
      <div style={{ 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7', 
        padding: '15px', 
        margin: '10px 0',
        borderRadius: '5px'
      }}>
        <h4>DIAGNÓSTICO: No hay datos de amortización</h4>
        <p><strong>Crédito ID:</strong> {credito.prestamo_ID}</p>
        <p><strong>Tipo:</strong> {credito.tipoCredito}</p>
        <p><strong>Estado:</strong> {credito.estado}</p>
        <details>
          <summary>Ver estructura completa del crédito</summary>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(credito, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  const primerasCuotas = credito.amortizacion.slice(0, 3);
  
  return (
    <div style={{ 
      backgroundColor: '#d1ecf1', 
      border: '1px solid #bee5eb', 
      padding: '15px', 
      margin: '10px 0',
      borderRadius: '5px'
    }}>
      <h4>DIAGNÓSTICO: Datos de amortización encontrados</h4>
      <p><strong>Total cuotas:</strong> {credito.amortizacion.length}</p>
      <p><strong>Campos disponibles en primera cuota:</strong></p>
      <ul>
        {Object.keys(credito.amortizacion[0] || {}).map(campo => (
          <li key={campo}>
            <code>{campo}</code>: {typeof credito.amortizacion[0][campo]} 
            = {JSON.stringify(credito.amortizacion[0][campo])}
          </li>
        ))}
      </ul>
      
      <details>
        <summary>Ver primeras 3 cuotas</summary>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify(primerasCuotas, null, 2)}
        </pre>
      </details>
    </div>
  );
};

// INSTRUCCIONES DE USO:
// 1. Copia este componente al archivo page.tsx justo antes del return
// 2. Agrega <DiagnosticoAmortizacion credito={credito} /> dentro del map de créditos
// 3. Consulta un crédito para ver el diagnóstico visual
// 4. Después del diagnóstico, elimina este componente temporal