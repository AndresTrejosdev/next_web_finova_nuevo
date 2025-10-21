# ESCENARIO 2 IMPLEMENTADO: NORMALIZACIÓN DE CAMPOS DENTRO DE CADA CUOTA

## DESCRIPCIÓN DEL PROBLEMA

En muchas APIs, aunque se pueda encontrar el array de amortización, **los nombres de los campos dentro de cada cuota individual varían** entre diferentes endpoints o versiones de la API.

### Ejemplos de Inconsistencias:

```json
// Backend A - Nombres estándar
{
  "fecha": "2024-01-15",
  "valorCuota": 50000,
  "mora": 5000,
  "sancion": 1000,
  "estado": "PENDIENTE"
}

// Backend B - Nombres diferentes
{
  "fecha_vencimiento": "2024-01-15",
  "monto": 50000,
  "interes": 5000,
  "multa": 1000,
  "state": "PENDIENTE"
}

// Backend C - Otros nombres
{
  "fechaVencimiento": "2024-01-15",
  "montoCuota": 50000,
  "interesMoratorio": 5000,
  "penalizacion": 1000,
  "status": "PENDING"
}
```

## SOLUCIÓN IMPLEMENTADA

### 1. Normalización de Campos por Cuota

Cada cuota se procesa individualmente para normalizar todos sus campos:

```typescript
// ======== NORMALIZACIÓN DE CAMPOS DE CUOTA ========
const cuotaNormalizada = { ...cuota };

// 1. NORMALIZAR FECHA
const camposFecha = ['fecha', 'fecha_vencimiento', 'fechaVencimiento', 'vencimiento', 'fechaVto'];
let fechaEncontrada = null;
for (const campo of camposFecha) {
  if (cuota[campo] && cuota[campo] !== '' && cuota[campo] !== null) {
    fechaEncontrada = cuota[campo];
    break;
  }
}
cuotaNormalizada.fecha = fechaEncontrada;
```

### 2. Campos Normalizados

| Campo Estándar | Posibles Nombres en API |
|---|---|
| `fecha` | fecha, fecha_vencimiento, fechaVencimiento, vencimiento, fechaVto |
| `valorCuota` | valorCuota, monto, montoCuota, capital, valor, montoCapital |
| `mora` | mora, interes, interesMoratorio, interesMora, interesVencido |
| `sancion` | sancion, multa, penalizacion, sanciones |
| `estado` | estado, state, status, estadoCuota, situacion |

### 3. Validaciones Robustas

- **Valores Numéricos**: Conversión segura con `Number()` y validación `!isNaN()`
- **Valores de Texto**: Verificación de strings válidos y no vacíos
- **Prioridad de Campos**: Los campos se evalúan en orden de prioridad

### 4. Logging Detallado

```typescript
console.log(`[ESCENARIO 2] Cuota ${cuotaIndex} normalizada:`, {
  fechaOriginal: cuota.fecha || cuota.fecha_vencimiento || 'N/A',
  fechaNormalizada: cuotaNormalizada.fecha,
  montoOriginal: cuota.valorCuota || cuota.monto || 'N/A',
  montoNormalizado: cuotaNormalizada.valorCuota,
  // ... otros campos
});
```

## 🔧 IMPLEMENTACIÓN TÉCNICA

### Ubicación del Código

**Archivo**: `/src/app/api/credito/route.ts`
**Líneas**: 215-330 (aproximadamente)

### Flujo de Procesamiento

1. **Iteración por Cuota**: Cada cuota se procesa individualmente
2. **Normalización de Campos**: Se buscan múltiples nombres posibles para cada campo
3. **Validación de Datos**: Se verifican tipos y valores válidos
4. **Cálculo de Mora**: Se usa los campos normalizados para cálculos
5. **Logging Detallado**: Se registra el proceso de normalización
6. **Retorno de Cuota**: Se devuelve la cuota con campos normalizados

### Algoritmo de Búsqueda de Campos

```typescript
// Ejemplo para el campo mora
const camposMora = ['mora', 'interes', 'interesMoratorio', 'interesMora', 'interesVencido'];
let moraEncontrada = 0;
for (const campo of camposMora) {
  const valor = Number(cuota[campo]);
  if (!isNaN(valor) && valor >= 0) {
    moraEncontrada = valor;
    break; // Toma el primer valor válido encontrado
  }
}
cuotaNormalizada.mora = moraEncontrada;
```

## PRUEBAS Y VALIDACIÓN

### Script de Prueba

**Archivo**: `test-escenario2.sh`

```bash
# Ejecutar prueba
./test-escenario2.sh
```

### Qué Verifica el Script

1. **Campos Normalizados**: Verifica que cada cuota tenga los campos estándar
2. **Valores Válidos**: Confirma que los valores no sean N/A o null
3. **Cálculo de Mora**: Verifica que el cálculo se haga con campos normalizados
4. **Logging**: Busca logs del proceso de normalización

### Logs Esperados

```
[ESCENARIO 2] Procesando 12 cuotas para crédito PREST123456
[ESCENARIO 2] Cuota 0 normalizada: {
  fechaOriginal: "2024-01-15",
  fechaNormalizada: "2024-01-15",
  montoOriginal: 50000,
  montoNormalizado: 50000,
  moraOriginal: 5000,
  moraNormalizada: 5000
}
[ESCENARIO 2] Cuota 0 EN MORA: 6000 (mora: 5000, sanción: 1000)
```

## CASOS DE USO RESUELTOS

### Caso 1: API con fecha_vencimiento en lugar de fecha
```json
// Antes (falla)
{ "fecha_vencimiento": "2024-01-15", "monto": 50000 }

// Después (normalizado)
{ "fecha": "2024-01-15", "valorCuota": 50000 }
```

### Caso 2: API con interesMoratorio en lugar de mora
```json
// Antes (falla)
{ "interesMoratorio": 5000, "multa": 1000 }

// Después (normalizado)
{ "mora": 5000, "sancion": 1000 }
```

### Caso 3: API con state en lugar de estado
```json
// Antes (falla)
{ "state": "PENDING" }

// Después (normalizado)
{ "estado": "PENDING" }
```

## BENEFICIOS DE LA IMPLEMENTACIÓN

1. **Compatibilidad Universal**: Funciona con diferentes APIs sin modificaciones
2. **Mantenimiento Reducido**: Un solo código maneja múltiples formatos
3. **Robustez**: Validaciones defensivas contra datos corruptos
4. **Debugging**: Logs detallados facilitan el diagnóstico
5. **Performance**: Procesamiento eficiente con prioridades de campos

## COMBINACIÓN CON ESCENARIO 1

El Escenario 2 se ejecuta **después** del Escenario 1:

1. **Escenario 1**: Encuentra el array de amortización (múltiples nombres posibles)
2. **Escenario 2**: Normaliza los campos dentro de cada cuota del array encontrado

Esto garantiza máxima compatibilidad con cualquier estructura de API.

## PRÓXIMOS PASOS

1. **Ejecutar Pruebas**: Usar `test-escenario2.sh`
2. **Monitorear Logs**: Verificar normalización en tiempo real
3. **Ajustar Campos**: Añadir más nombres de campos si es necesario
4. **Validar Cálculos**: Confirmar que mora se calcule correctamente

---

**Estado**: IMPLEMENTADO Y LISTO PARA PRUEBAS
**Fecha**: $(date)
**Escenario**: 2 de 6 posibles escenarios identificados