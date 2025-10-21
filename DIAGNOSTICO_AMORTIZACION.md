#  DIAGNÓSTICO IMPLEMENTADO: Datos No Disponibles en Tabla de Amortización

##  ESTADO: DIAGNÓSTICO COMPLETO ACTIVADO

**Fecha**: 20 de octubre de 2025  
**Problema**: Tabla de amortización muestra "N/A" y "$0" en todos los valores  
**Causa probable**: Estructura de datos diferente a la esperada o campos con nombres alternativos

---

##  HERRAMIENTAS DE DIAGNÓSTICO IMPLEMENTADAS

### 1. **Logs de Depuración en Frontend** 
**Ubicación**: `src/app/consulta-deuda/page.tsx`

**Logs agregados**:
```typescript
// Al recibir respuesta del API
console.log(' Respuesta completa del API:', response.data);
console.log(' Primer crédito:', response.data[0]);
if (response.data[0]?.amortizacion) {
  console.log(' Primera cuota de amortización:', response.data[0].amortizacion[0]);
  console.log(' Total cuotas encontradas:', response.data[0].amortizacion.length);
} else {
  console.log(' NO HAY DATOS DE AMORTIZACIÓN en primer crédito');
}
```

**Para respuestas con metadata**:
```typescript
console.log(' Respuesta con metadata - creditos:', creditos);
if (creditos && creditos.length > 0) {
  console.log(' Primer crédito (metadata):', creditos[0]);
  if (creditos[0]?.amortizacion) {
    console.log(' Primera cuota (metadata):', creditos[0].amortizacion[0]);
  }
}
```

**Para respuestas directas**:
```typescript
console.log('📦 Respuesta directa - creditosEnCurso:', creditosEnCurso);
if (creditosEnCurso.length > 0) {
  console.log('📋 Primer crédito activo:', creditosEnCurso[0]);
  if (creditosEnCurso[0]?.amortizacion) {
    console.log('💰 Primera cuota activa:', creditosEnCurso[0].amortizacion[0]);
    console.log('🔢 Campos disponibles en cuota:', Object.keys(creditosEnCurso[0].amortizacion[0]));
  }
}
```

### 2. **Script de Diagnóstico Terminal** 
**Archivo**: `diagnostico-amortizacion.sh`

**Funcionalidades**:
-  Verifica servidor corriendo
-  Hace consulta de prueba al API
-  Analiza estructura de respuesta
-  Inspecciona campos de amortización
-  Muestra datos de primera cuota
-  Identifica campos disponibles vs esperados

**Uso**:
```bash
./diagnostico-amortizacion.sh
```

### 3. **Logs en Tabla de Cuotas** 
**Ubicación**: Dentro del renderizado de tabla

**Log implementado**:
```typescript
{credito.amortizacion.length > 0 && console.log(
  `🔍 Cuotas del crédito ${credito.prestamo_ID}:`,
  credito.amortizacion.map((c: any, i: number) => ({
    index: i,
    campos: Object.keys(c),
    fecha: c.fecha,
    valorCuota: c.valorCuota,
    mora: c.mora,
    sancion: c.sancion,
    estado: c.estado
  }))
)}
```

### 4. **Componente de Diagnóstico Visual** 
**Archivo**: `componente-diagnostico.tsx`

**Características**:
-  Muestra estructura completa del crédito
-  Lista campos disponibles en primera cuota
-  Muestra primeras 3 cuotas en detalle
-  Diferencia entre "sin datos" vs "datos disponibles"
-  Interfaz visual clara para debugging

---

##  CÓMO USAR EL DIAGNÓSTICO

### **Paso 1: Ejecutar Script Terminal**
```bash
cd /mnt/storage/SOLUCREDITO/next_web_finova_nuevo
./diagnostico-amortizacion.sh
```

### **Paso 2: Consultar en Navegador**
1. Abrir aplicación web (http://localhost:5122/consulta-deuda)
2. Abrir DevTools (F12 > Console)
3. Consultar un crédito con cédula
4. Revisar logs detallados en consola

### **Paso 3: Analizar Resultados**
Los logs mostrarán:
-  **Estructura de respuesta**: Array vs objeto con metadata
-  **Campos disponibles**: Nombres exactos de campos en cuotas
-  **Valores reales**: Qué datos contiene cada campo
-  **Mapeo necesario**: Si los nombres de campos son diferentes

---

##  POSIBLES ESCENARIOS ENCONTRADOS

### **Escenario A: No hay campo amortizacion**
```
 NO HAY DATOS DE AMORTIZACIÓN en primer crédito
```
**Solución**: Campo se llama diferente (cuotas, pagos, cronograma)

### **Escenario B: Array vacío**
```
 Array de amortización está vacío
```
**Solución**: Backend no está enviando datos de cuotas

### **Escenario C: Campos con nombres diferentes**
```
 Campos disponibles en cuota: fecha_vencimiento, valor, interes_mora
```
**Solución**: Ajustar mapeo en frontend

### **Escenario D: Formato de fecha diferente**
```
 Fecha: "2024-10-20T00:00:00.000Z" (ISO) vs "20/10/2024" (DD/MM/YYYY)
```
**Solución**: Parseo correcto ya implementado

---

##  RESULTADOS ESPERADOS DEL DIAGNÓSTICO

### **Si el diagnóstico muestra**:

1. **" Amortización encontrada con X cuotas"**
   - Problema: Mapeo de campos incorrecto
   - Acción: Ajustar nombres de campos en tabla

2. **" Array de amortización está vacío"**
   - Problema: Backend no envía datos de cuotas
   - Acción: Verificar API de créditos

3. **" No existe campo amortizacion"**
   - Problema: Campo tiene nombre diferente
   - Acción: Buscar campo alternativo (cuotas, pagos, cronograma)

4. **" Campos: fecha_pago, monto_cuota, etc."**
   - Problema: Frontend espera nombres diferentes
   - Acción: Actualizar mapeo en tabla

---

##  PRÓXIMOS PASOS DESPUÉS DEL DIAGNÓSTICO

1. **Ejecutar diagnóstico** y obtener estructura real
2. **Identificar discrepancias** entre esperado vs real
3. **Ajustar mapeo de campos** según hallazgos
4. **Actualizar tabla de amortización** con campos correctos
5. **Eliminar logs de debug** después de la corrección

---

##  HERRAMIENTAS LISTAS PARA USO

**Frontend**: Logs automáticos activados  
**Terminal**: Script de diagnóstico ejecutable  
**Visual**: Componente de debugging disponible  
**Documentación**: Guía completa de uso

**El diagnóstico está completamente implementado y listo para identificar la causa exacta del problema de datos faltantes en la tabla de amortización.**