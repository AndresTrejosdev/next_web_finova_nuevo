# Configuración de PayValida

## Variables de Entorno Requeridas

Configura estas variables en tu archivo `.env.local`:

```bash
# URL de la API de PayValida
NEXT_PUBLIC_PAYVALIDA_API=https://tu-api-payvalida.com

# API Key de PayValida (opcional, depende de su implementación)
PAYVALIDA_API_KEY=tu-api-key-aqui

# URL base de tu aplicación
NEXT_PUBLIC_BASE_URL=http://localhost:5122
```

## Endpoints Implementados

### 1. `/api/payvalida` (POST)
Genera un enlace de pago con PayValida.

**Request:**
```json
{
  "nombreCliente": "Juan Pérez",
  "email": "juan@email.com",
  "amount": 50000,
  "identification": "12345678",
  "identificationType": "CC",
  "metodoPago": "PSE",
  "ordenId": "FIN-123-1234567890-abc",
  "prestamoId": 123
}
```

**Response exitoso:**
```json
{
  "success": true,
  "url": "https://checkout.payvalida.com/xyz123",
  "orderID": "FIN-123-1234567890-abc",
  "message": "Redirigiendo a PayValida..."
}
```

### 2. `/api/payvalida/webhook` (POST)
Recibe notificaciones de estado de PayValida.

### 3. `/api/payvalida/webhook` (GET)
Consulta el estado de un pago.

## Páginas Implementadas

### `/pago-resultado`
Página de resultado del pago que muestra el estado final.

## Flujo Completo

1. **Usuario inicia pago** desde `/consulta-deuda`
2. **Modal de pago** recolecta datos y opciones
3. **API `/api/payvalida`** genera enlace con PayValida
4. **Redirección** a PayValida para completar pago
5. **Return URLs** configuradas:
   - Éxito: `/pago-resultado?orden=xyz&status=success`
   - Cancelación: `/consulta-deuda?cancelado=xyz`
6. **Webhook** recibe actualizaciones de estado

## Configuración de PayValida

### URLs de retorno esperadas:
- **Return URL**: `https://tudominio.com/pago-resultado?orden={ORDER_ID}`
- **Cancel URL**: `https://tudominio.com/consulta-deuda?cancelado={ORDER_ID}`
- **Webhook URL**: `https://tudominio.com/api/payvalida/webhook`

### Campos enviados a PayValida:
- `nombreCliente`: Nombre completo del cliente
- `email`: Email del cliente
- `amount`: Monto en pesos colombianos
- `identification`: Número de documento
- `identificationType`: Tipo de documento (CC, CE, etc.)
- `metodoPago`: PSE, NEQUI, BANCOLOMBIA
- `ordenId`: ID único de la transacción
- `descripcion`: Descripción del pago
- `moneda`: COP
- `returnUrl`: URL de retorno exitoso
- `cancelUrl`: URL de cancelación
- `webhookUrl`: URL para notificaciones

## Modo Fallback

Si la API de PayValida no responde, el sistema automáticamente usa un modo demo que redirige a una URL de prueba, permitiendo que la funcionalidad continue funcionando durante el desarrollo.

## Seguridad

- Validación de email con regex
- Validación de monto mínimo
- Timeout de 10 segundos en requests
- Manejo de errores robusto
- Headers de autorización configurables
- Logs de debugging (remover en producción)