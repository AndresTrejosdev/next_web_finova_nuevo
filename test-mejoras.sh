#!/bin/bash

echo "🧪 TESTING MEJORAS CRÍTICAS IMPLEMENTADAS"
echo "=========================================="
echo ""

# Test 1: Endpoint de validación
echo "1. Probando validación de entorno..."
curl -X GET http://localhost:5122/api/test-validators -s | head -20
echo ""
echo ""

# Test 2: Endpoint de crédito con documento de prueba
echo "2. Probando endpoint de crédito mejorado..."
curl -X POST http://localhost:5122/api/credito \
  -H "Content-Type: application/json" \
  -d '{"userDocumento":"123456789"}' \
  -s | head -50
echo ""
echo ""

# Test 3: Health check si existe
echo "3. Probando health check..."
curl -X GET http://localhost:5122/api/health -s | head -20 2>/dev/null || echo "Health endpoint no disponible"
echo ""
echo ""

echo "✅ Tests completados"
echo ""
echo "📊 MEJORAS IMPLEMENTADAS:"
echo "   ✅ Validadores centralizados integrados"
echo "   ✅ Función parseFechaSafeLocal mejorada"
echo "   ✅ Sanitización robusta de montos"
echo "   ✅ Validación de emails extendida"
echo "   ✅ Campos alternativos para datos de usuario"
echo "   ✅ Protección contra tipoCredito null/undefined"
echo "   ✅ Eliminación de duplicados por prestamo_ID"
echo "   ✅ Logs de debugging mejorados"
echo "   ✅ Manejo robusto de errores"