# Diagnóstico: Problema API de Crédito

## 🔍 Problema Identificado

### 1. Variable de entorno NO utilizada
**Ubicación**: `src/app/api/credito/route.ts` línea 17

**Antes** ❌:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Se define pero NO se usa
// ...
const response = await fetch(`https://server.finova.com.co/api/credit/cuotasPendiente`, {
```

**Después** ✅:
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// ...
const response = await fetch(`${apiUrl}/api/credit/cuotasPendiente`, {
```

### 2. Falta de logs para debugging
**Agregado**:
- Console.log antes de hacer fetch (muestra URL completa y documento)
- Error detallado con status, statusText y body
- Log de respuesta exitosa

## 📋 Cambios Realizados

### Archivo: `src/app/api/credito/route.ts`

1. **Uso correcto de variable de entorno**:
   - Ahora usa `${apiUrl}/api/credit/cuotasPendiente` en lugar de URL hardcodeada

2. **Logging mejorado**:
   ```typescript
   console.log('🔍 Consultando API externa:', `${apiUrl}/api/credit/cuotasPendiente`);
   console.log('📄 Documento:', cedula);
   ```

3. **Manejo de errores mejorado**:
   ```typescript
   if (!response.ok) {
     const errorText = await response.text();
     console.error('❌ Error del API externo:', {
       status: response.status,
       statusText: response.statusText,
       body: errorText
     });
     throw new Error(`Error del API: ${response.status} - ${errorText}`);
   }
   ```

## 🧪 Cómo Probar

### Opción 1: Usar el script de prueba
```bash
./test-api-credito.sh
```

### Opción 2: Probar manualmente
```bash
# Verificar que el servidor esté corriendo en puerto 5122
curl -X GET "http://localhost:5122/api/credito?cedula=TU_CEDULA" -v
```

### Opción 3: Desde el navegador
1. Abre la consola de desarrollador (F12)
2. Ve a `http://localhost:5122/consulta-deuda`
3. Ingresa una cédula y consulta
4. Revisa los logs en la consola del navegador
5. Revisa los logs del servidor en la terminal

## 🔧 Variables de Entorno Verificadas

Archivos revisados:
- `.env`
- `.env.local`
- `.env.production`

Todas tienen configurado:
```bash
NEXT_PUBLIC_API_URL=https://server.finova.com.co
```

## ⚠️ Puntos a Verificar

1. **¿El servidor externo está respondiendo?**
   ```bash
   curl -X POST https://server.finova.com.co/api/credit/cuotasPendiente \
     -H "Content-Type: application/json" \
     -d '{"userDocumento":"1234567890"}' \
     -v
   ```

2. **¿El servidor Next.js está corriendo?**
   ```bash
   ps aux | grep node
   # O verifica el puerto
   lsof -i :5122
   ```

3. **¿Los logs muestran la URL correcta?**
   Deberías ver en la terminal del servidor:
   ```
   🔍 Consultando API externa: https://server.finova.com.co/api/credit/cuotasPendiente
   📄 Documento: 1234567890
   ```

## 📊 Flujo de la Consulta

```
Frontend (page.tsx)
    ↓ axios.get('/api/credito?cedula=XXX')
    ↓
API Route (route.ts)
    ↓ Valida NEXT_PUBLIC_API_URL
    ↓ Valida cedula
    ↓ fetch(${apiUrl}/api/credit/cuotasPendiente)
    ↓
API Externa (server.finova.com.co)
    ↓ POST /api/credit/cuotasPendiente
    ↓ body: { userDocumento: cedula }
    ↓
Respuesta
    ↓ Transformación de datos
    ↓ Return creditos[]
    ↓
Frontend recibe y muestra
```

## 🎯 Próximos Pasos

1. Reiniciar el servidor Next.js para que tome los cambios
2. Probar con una cédula real
3. Verificar logs en la consola del servidor
4. Si falla, revisar:
   - Conectividad a `server.finova.com.co`
   - Formato de la respuesta del API externo
   - Permisos CORS si aplica
