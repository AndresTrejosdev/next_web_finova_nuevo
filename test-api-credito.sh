#!/bin/bash

echo "🔍 Verificando configuración de la API de crédito..."
echo ""

# Verificar variables de entorno
echo "📋 Variables de entorno configuradas:"
grep "NEXT_PUBLIC_API_URL" .env .env.local .env.production 2>/dev/null || echo "No se encontraron archivos .env"
echo ""

# Test con cédula de ejemplo
CEDULA="1234567890"
echo "🧪 Probando endpoint: http://localhost:5122/api/credito?cedula=$CEDULA"
echo ""

curl -X GET "http://localhost:5122/api/credito?cedula=$CEDULA" \
  -H "Content-Type: application/json" \
  -v 2>&1 | grep -E "(HTTP|error|success|API URL|Consultando)"

echo ""
echo "✅ Test completado"
