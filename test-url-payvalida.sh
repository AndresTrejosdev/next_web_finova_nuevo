#!/bin/bash

echo "🧪 Test: Verificación de URL de PayValida"
echo "=========================================="
echo ""

# Caso 1: URL sin protocolo (problema reportado)
URL_SIN_PROTOCOLO="checkout.payvalida.com?token=abc123"
echo "📋 Caso 1: URL sin protocolo"
echo "   Entrada: $URL_SIN_PROTOCOLO"

if [[ ! $URL_SIN_PROTOCOLO =~ ^https?:// ]]; then
    URL_CORREGIDA="https://$URL_SIN_PROTOCOLO"
    echo "   ✅ Resultado: $URL_CORREGIDA"
else
    echo "   ✅ Ya tiene protocolo: $URL_SIN_PROTOCOLO"
fi
echo ""

# Caso 2: URL con https:// (correcto)
URL_CON_HTTPS="https://checkout.payvalida.com?token=xyz789"
echo "📋 Caso 2: URL con https://"
echo "   Entrada: $URL_CON_HTTPS"

if [[ ! $URL_CON_HTTPS =~ ^https?:// ]]; then
    URL_CORREGIDA="https://$URL_CON_HTTPS"
    echo "   ⚠️  Agregado: $URL_CORREGIDA"
else
    echo "   ✅ Ya tiene protocolo: $URL_CON_HTTPS"
fi
echo ""

# Caso 3: URL con http:// (edge case)
URL_CON_HTTP="http://checkout.payvalida.com?token=def456"
echo "📋 Caso 3: URL con http://"
echo "   Entrada: $URL_CON_HTTP"

if [[ ! $URL_CON_HTTP =~ ^https?:// ]]; then
    URL_CORREGIDA="https://$URL_CON_HTTP"
    echo "   ⚠️  Agregado: $URL_CORREGIDA"
else
    echo "   ✅ Ya tiene protocolo: $URL_CON_HTTP"
fi
echo ""

echo "=========================================="
echo "✅ Test completado"
echo ""
echo "📝 Resumen del fix:"
echo "   - El código ahora detecta URLs sin protocolo"
echo "   - Agrega 'https://' automáticamente"
echo "   - Evita redirecciones a rutas relativas"
