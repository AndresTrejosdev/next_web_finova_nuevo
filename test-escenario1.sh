#!/bin/bash

echo " DIAGNÓSTICO COMPLETO: ESCENARIO 1 IMPLEMENTADO"
echo "============================================="
echo ""
echo " Verificando implementación del Escenario 1: Múltiples nombres de campo"
echo ""

# Verificar servidor
if ! curl -s http://localhost:5122 > /dev/null; then
    echo " Servidor no disponible en puerto 5122"
    echo " Ejecuta: npm run dev"
    exit 1
fi

echo " Ejecutando consulta con logs del Escenario 1..."
echo ""

# Hacer consulta
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:5122/api/credito \
  -H "Content-Type: application/json" \
  -d '{"userDocumento":"123456789"}')

HTTP_BODY=$(echo "$RESPONSE" | head -n -1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

echo " RESULTADO DE LA CONSULTA:"
echo "============================"
echo " HTTP Status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo " Consulta exitosa"
    
    # Verificar si hay créditos
    if echo "$HTTP_BODY" | jq -e '. | length' > /dev/null 2>&1; then
        CREDITOS_COUNT=$(echo "$HTTP_BODY" | jq '. | length')
        echo " Créditos encontrados: $CREDITOS_COUNT"
        
        if [ "$CREDITOS_COUNT" -gt 0 ]; then
            # Verificar amortización
            AMORT_COUNT=$(echo "$HTTP_BODY" | jq '.[0].amortizacion | length' 2>/dev/null || echo "0")
            echo " Cuotas en primer crédito: $AMORT_COUNT"
            
            if [ "$AMORT_COUNT" -gt 0 ]; then
                echo ""
                echo " ¡ÉXITO! Datos de amortización encontrados"
                echo "============================================"
                echo ""
                echo " DETALLES DE LA PRIMERA CUOTA:"
                echo "$HTTP_BODY" | jq '.[0].amortizacion[0]' 2>/dev/null || echo "Error mostrando cuota"
                echo ""
                echo " ESCENARIO 1 RESUELTO: Se encontraron cuotas con múltiples nombres de campo"
            else
                echo ""
                echo " Array de amortización vacío - Verificar logs del servidor"
                echo ""
                echo " CAMPOS DISPONIBLES EN PRIMER CRÉDITO:"
                echo "$HTTP_BODY" | jq '.[0] | keys' 2>/dev/null || echo "Error analizando campos"
            fi
        else
            echo " No se encontraron créditos en la respuesta"
        fi
    else
        echo " Respuesta no tiene formato de array de créditos"
        echo " Respuesta recibida:"
        echo "$HTTP_BODY" | head -5
    fi
else
    echo " Error en la consulta"
    echo " Respuesta de error:"
    echo "$HTTP_BODY"
fi

echo ""
echo " LOGS IMPORTANTES A REVISAR EN EL SERVIDOR:"
echo "=============================================="
echo "Busca estos símbolos en la consola del servidor:"
echo ""
echo " Búsqueda de amortización en crédito X: {...}"
echo "   → Muestra todos los campos analizados"
echo ""
echo " Amortización viene como string en crédito X, parseando..."
echo "   → Indica que se encontró como string y se está parseando"
echo ""
echo " JSON parseado exitosamente: Array[N]"
echo "   → Confirmación de parsing exitoso"
echo ""
echo " Amortización no es array en crédito X, tipo: ..."
echo "   → Indica problema con el tipo de dato"
echo ""
echo " Crédito X tiene N cuotas después del procesamiento"
echo "   → Resultado final del procesamiento"
echo ""
echo " PRÓXIMOS PASOS:"
echo "=================="
echo "1. Si ves 'Array[0]' → Implementar Escenario 2 (campos de cuota diferentes)"
echo "2. Si no ves logs de búsqueda → Verificar que el backend esté enviando datos"
echo "3. Si ves errores de parsing → Implementar Escenario 4 (decodificación)"
echo "4. Si los campos no coinciden → Implementar Escenario 6 (frontend actualizado)"
echo ""
echo " Consultar archivos de ayuda:"
echo "- ESCENARIOS_ADICIONALES_AMORTIZACION.md"
echo "- LOGS_ENDPOINT_IMPLEMENTADOS.md"
echo "- DIAGNOSTICO_AMORTIZACION.md"