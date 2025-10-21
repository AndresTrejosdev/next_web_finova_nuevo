#  LOGS DETALLADOS IMPLEMENTADOS EN ENDPOINT DE CRÉDITO

## ESTADO: DIAGNÓSTICO COMPLETO DEL BACKEND ACTIVADO

**Fecha**: 20 de octubre de 2025  
**Archivo modificado**: `/src/app/api/credito/route.ts`  
**Objetivo**: Identificar estructura exacta de datos del backend externo

---

## LOGS IMPLEMENTADOS EN EL ENDPOINT

### 1. **Log de Consulta Inicial** 
```typescript
console.log('Consultando créditos para documento:', userDocumento);
```
**Ubicación**: Al inicio de la consulta  
**Propósito**: Confirmar que la consulta se ejecuta

### 2. **Log de Respuesta RAW del Backend** 
```typescript
console.log('Respuesta RAW del backend de créditos:', JSON.stringify(responseCreditos.data, null, 2));
```
**Ubicación**: Inmediatamente después de recibir datos del backend  
**Propósito**: Ver estructura exacta sin procesamiento

### 3. **Log de Datos de Usuario** 
```typescript
console.log('Datos del usuario:', JSON.stringify(datosUsuario, null, 2));
```
**Ubicación**: Después de consultar datos de usuario  
**Propósito**: Verificar información complementaria

### 4. **Log de Estructura del Primer Crédito** 
```typescript
console.log('Estructura del primer crédito RAW:', JSON.stringify(creditos[0], null, 2));
console.log('Campos disponibles en primer crédito:', Object.keys(creditos[0]));
```
**Ubicación**: Al inspeccionar primer crédito  
**Propósito**: Identificar campos disponibles

### 5. **Log de Búsqueda de Campos de Amortización** 
```typescript
const camposAmortizacion = ['amortizacion', 'cuotas', 'pagos', 'cronograma', 'cuotasPendientes', 'schedule'];
camposAmortizacion.forEach(campo => {
  if (creditos[0][campo]) {
    console.log(`Campo ${campo} encontrado:`, Array.isArray(creditos[0][campo]) ? `Array con ${creditos[0][campo].length} elementos` : typeof creditos[0][campo]);
    if (Array.isArray(creditos[0][campo]) && creditos[0][campo].length > 0) {
      console.log(`Primera ${campo}:`, JSON.stringify(creditos[0][campo][0], null, 2));
      console.log(`Campos en primera ${campo}:`, Object.keys(creditos[0][campo][0]));
    }
  }
});
```
**Ubicación**: Después de analizar estructura  
**Propósito**: Encontrar campo correcto de amortización

### 6. **Log de Mapeo de Amortización** 
```typescript
console.log(`Crédito ${index} - Mapeo de amortización:`, {
  prestamo_ID: creditoNormalizado.prestamo_ID,
  amortizacion_original: {
    amortizacion: credito.amortizacion ? `Array[${credito.amortizacion.length}]` : 'undefined',
    cuotas: credito.cuotas ? `Array[${credito.cuotas.length}]` : 'undefined',
    pagos: credito.pagos ? `Array[${credito.pagos.length}]` : 'undefined',
    cronograma: credito.cronograma ? `Array[${credito.cronograma.length}]` : 'undefined',
    cuotasPendientes: credito.cuotasPendientes ? `Array[${credito.cuotasPendientes.length}]` : 'undefined'
  },
  amortizacion_final: Array.isArray(creditoNormalizado.amortizacion) ? 
    `Array[${creditoNormalizado.amortizacion.length}]` : 
    `${typeof creditoNormalizado.amortizacion}: ${creditoNormalizado.amortizacion}`
});
```
**Ubicación**: Durante procesamiento de cada crédito  
**Propósito**: Ver cómo se mapean los campos

### 7. **Log de Primera Cuota Procesada** 
```typescript
if (Array.isArray(creditoNormalizado.amortizacion) && creditoNormalizado.amortizacion.length > 0) {
  console.log(`Primera cuota procesada del crédito ${creditoNormalizado.prestamo_ID}:`, 
    JSON.stringify(creditoNormalizado.amortizacion[0], null, 2));
}
```
**Ubicación**: Después del mapeo de campos  
**Propósito**: Verificar datos de cuota procesada

### 8. **Log de Respuesta Final**
```typescript
console.log('RESPUESTA FINAL que se enviará al frontend:');
creditosUnicos.forEach((credito, index) => {
  console.log(`Crédito ${index + 1}:`, {
    prestamo_ID: credito.prestamo_ID,
    tipoCredito: credito.tipoCredito,
    estado: credito.estado,
    pagoMinimo: credito.pagoMinimo,
    pagoTotal: credito.pagoTotal,
    pagoEnMora: credito.pagoEnMora,
    amortizacion: Array.isArray(credito.amortizacion) ? 
      `Array[${credito.amortizacion.length}] cuotas` : 
      `${typeof credito.amortizacion}: ${credito.amortizacion}`,
    primerasCuotas: Array.isArray(credito.amortizacion) && credito.amortizacion.length > 0 ? 
      credito.amortizacion.slice(0, 2) : 'No hay cuotas'
  });
});
```
**Ubicación**: Antes de enviar respuesta  
**Propósito**: Ver estado final de datos enviados al frontend

---

## CAMPOS DE AMORTIZACIÓN EXPANDIDOS

### **Campos Buscados Automáticamente**:
- `amortizacion` (campo esperado original)
- `cuotas` (alternativa común)
- `pagos` (otra alternativa)
- `cronograma` (término técnico)
- `cuotasPendientes` (específico para pendientes)
- `schedule` (término en inglés)

### **Mapeo Actualizado**:
```typescript
amortizacion: credito.amortizacion || credito.cuotas || credito.pagos || 
              credito.cronograma || credito.cuotasPendientes || []
```

---

## HERRAMIENTAS DE TESTING

### **Script de Prueba**: `test-endpoint-logs.sh`
```bash
./test-endpoint-logs.sh
```

**Funcionalidades**:
- Verifica servidor activo
- Hace consulta de prueba
- Analiza respuesta JSON
- Cuenta créditos y cuotas
- Guía para interpretar logs

### **Interpretación de Logs**:
- 🔍 = Consulta inicial
- 📦 = Datos RAW del backend
- 👤 = Datos de usuario
- 💳 = Estructura de crédito
- ✅ = Campo encontrado
- 📋 = Detalles de campo
- 🔄 = Mapeo de campos
- 💰 = Cuota procesada
- 📤 = Respuesta final

---

## POSIBLES RESULTADOS DEL DIAGNÓSTICO

### **Caso 1: Campo con nombre diferente**
```
Campo cuotas encontrado: Array con 12 elementos
Primera cuotas: { "fecha_vencimiento": "2024-01-15", ... }
```
**Solución**: Campo existe pero tiene nombre `cuotas` en lugar de `amortizacion`

### **Caso 2: Estructura de cuota diferente**
```
Primera cuota procesada: { "fecha_pago": "...", "monto": 150000 }
```
**Solución**: Campos de cuota tienen nombres diferentes (fecha_pago vs fecha, monto vs valorCuota)

### **Caso 3: Array vacío del backend**
```
Respuesta RAW: [{ "prestamo_ID": 123, "amortizacion": [] }]
```
**Solución**: Backend no está enviando datos de cuotas

### **Caso 4: Campo no existe**
```
Campos disponibles: ["prestamo_ID", "tipo", "saldo"]
No se encontraron créditos con campo de amortización
```
**Solución**: Backend no incluye información de cuotas en esta respuesta

---

## PRÓXIMOS PASOS

1. **Ejecutar consulta** y revisar logs en consola del servidor
2. **Identificar estructura real** vs estructura esperada
3. **Ajustar mapeo de campos** según hallazgos
4. **Actualizar componente frontend** con nombres correctos
5. **Eliminar logs de debug** después de la corrección

---

## DIAGNÓSTICO LISTO PARA EJECUCIÓN

**Logs detallados**: Activados en endpoint  
**Script de prueba**: Ejecutable con `./test-endpoint-logs.sh`  
**Campos expandidos**: 6 nombres posibles de amortización  
**Mapeo mejorado**: Incluye todas las alternativas  
**Documentación**: Guía completa de interpretación

**El endpoint ahora proporcionará información completa sobre la estructura real de datos del backend, permitiendo identificar exactamente por qué la tabla de amortización no muestra datos.**