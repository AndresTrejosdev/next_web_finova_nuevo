#!/bin/bash

echo " VERIFICACIÓN COMPLETA DEL ENDPOINT DE CRÉDITO"
echo "=============================================="
echo ""

# Verificar si el servidor está corriendo
if ! curl -s http://localhost:5122 > /dev/null; then
    echo "Error: El servidor no está corriendo en puerto 5122"
    echo "Ejecuta: npm run dev"
    exit 1
fi

echo "Realizando consulta al endpoint con logs detallados..."
echo "Los logs aparecerán en la consola del servidor (terminal donde ejecutaste npm run dev)"
echo ""

# Test con documento de prueba
echo "Enviando request a /api/credito..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:5122/api/credito \
  -H "Content-Type: application/json" \
  -d '{"userDocumento":"123456789"}')

# Separar respuesta y código de estado
HTTP_BODY=$(echo "$RESPONSE" | head -n -1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

echo "RESULTADO:"
echo "============"
echo "Código HTTP: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "Respuesta exitosa"
    echo ""
    echo "Análisis de respuesta:"
    
    # Verificar si la respuesta contiene amortización
    if echo "$HTTP_BODY" | grep -q "amortizacion"; then
        echo "Campo 'amortizacion' encontrado en respuesta"
        
        # Contar créditos
        CREDITOS_COUNT=$(echo "$HTTP_BODY" | jq '. | length' 2>/dev/null || echo "Error parsing JSON")
        echo "Total créditos: $CREDITOS_COUNT"
        
        # Analizar amortización del primer crédito
        if [ "$CREDITOS_COUNT" != "0" ] && [ "$CREDITOS_COUNT" != "Error parsing JSON" ]; then
            AMORT_LENGTH=$(echo "$HTTP_BODY" | jq '.[0].amortizacion | length' 2>/dev/null || echo "0")
            echo " Cuotas en primer crédito: $AMORT_LENGTH"
            
            if [ "$AMORT_LENGTH" != "0" ] && [ "$AMORT_LENGTH" != "null" ]; then
                echo "¡ÉXITO! Se encontraron datos de amortización"
                echo ""
                echo "Primera cuota:"
                echo "$HTTP_BODY" | jq '.[0].amortizacion[0]' 2>/dev/null || echo "Error mostrando primera cuota"
            else
                echo "Array de amortización vacío"
            fi
        fi
    else
        echo "Campo 'amortizacion' NO encontrado en respuesta"
    fi
    
elif [ "$HTTP_CODE" = "500" ]; then
    echo "Error interno del servidor"
    echo "Respuesta:"
    echo "$HTTP_BODY"
else
    echo "Código de respuesta inesperado: $HTTP_CODE"
    echo "Respuesta:"
    echo "$HTTP_BODY"
fi

echo ""
echo "LOGS IMPORTANTES:"
echo "===================="
echo "Los logs detallados del backend aparecen en el terminal donde ejecutaste 'npm run dev'"
echo "Busca estos símbolos:"
echo "   = Respuesta RAW del backend"
echo "  = Estructura del primer crédito"
echo "   = Mapeo de amortización"
echo "  = Primera cuota procesada"
echo "   = Respuesta final al frontend"
echo ""
echo "Si no ves logs, verifica que el endpoint esté procesando la request correctamente"