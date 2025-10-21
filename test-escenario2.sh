#!/bin/bash

# ===================================================================
# SCRIPT DE PRUEBA: ESCENARIO 2 - NORMALIZACIÓN DE CAMPOS EN CUOTAS
# ===================================================================
# Verifica que la normalización de campos dentro de cada cuota funcione correctamente

echo "INICIANDO PRUEBA DEL ESCENARIO 2..."
echo "Objetivo: Verificar normalización de campos inconsistentes en cuotas"
echo ""

# Configurar variables
API_URL="http://localhost:3000/api/credito"
TEST_CEDULA="1234567890"

echo " URL del endpoint: $API_URL"
echo "Cédula de prueba: $TEST_CEDULA"
echo ""

# Función para hacer la petición y analizar logs
test_scenario_2() {
    echo " Realizando petición de prueba..."
    
    # Hacer la petición y capturar la respuesta
    response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "{\"cedula\":\"$TEST_CEDULA\"}")
    
    echo "ANÁLISIS DE LA RESPUESTA:"
    echo "================================"
    
    # Verificar si hay datos en la respuesta
    if echo "$response" | jq -e '.data' > /dev/null 2>&1; then
        echo "Respuesta tiene estructura de datos válida"
        
        # Contar créditos
        creditos_count=$(echo "$response" | jq '.data | length')
        echo "Número de créditos encontrados: $creditos_count"
        
        # Analizar cada crédito
        for i in $(seq 0 $((creditos_count - 1))); do
            echo ""
            echo "ANÁLISIS DEL CRÉDITO $((i + 1)):"
            echo "--------------------------------"
            
            prestamo_id=$(echo "$response" | jq -r ".data[$i].prestamo_ID // \"N/A\"")
            echo "ID del préstamo: $prestamo_id"
            
            # Verificar amortización
            if echo "$response" | jq -e ".data[$i].amortizacion" > /dev/null 2>&1; then
                cuotas_count=$(echo "$response" | jq ".data[$i].amortizacion | length")
                echo "Número de cuotas: $cuotas_count"
                
                if [ "$cuotas_count" -gt 0 ]; then
                    echo ""
                    echo "🔍 ANÁLISIS DE CUOTAS (Primeras 3):"
                    
                    # Analizar las primeras 3 cuotas
                    for j in $(seq 0 $((cuotas_count > 3 ? 2 : cuotas_count - 1))); do
                        echo ""
                        echo "CUOTA $((j + 1)):"
                        
                        # Verificar campos normalizados
                        fecha=$(echo "$response" | jq -r ".data[$i].amortizacion[$j].fecha // \"N/A\"")
                        valorCuota=$(echo "$response" | jq -r ".data[$i].amortizacion[$j].valorCuota // \"N/A\"")
                        mora=$(echo "$response" | jq -r ".data[$i].amortizacion[$j].mora // \"N/A\"")
                        sancion=$(echo "$response" | jq -r ".data[$i].amortizacion[$j].sancion // \"N/A\"")
                        estado=$(echo "$response" | jq -r ".data[$i].amortizacion[$j].estado // \"N/A\"")
                        
                        echo "    Fecha: $fecha"
                        echo "     Valor Cuota: $valorCuota"
                        echo "     Mora: $mora"
                        echo "     Sanción: $sancion"
                        echo "     Estado: $estado"
                        
                        # Verificar si los campos están correctamente normalizados
                        if [ "$fecha" != "N/A" ] && [ "$fecha" != "null" ]; then
                            echo "      Campo fecha normalizado correctamente"
                        else
                            echo "      Campo fecha no normalizado"
                        fi
                        
                        if [ "$valorCuota" != "N/A" ] && [ "$valorCuota" != "null" ] && [ "$valorCuota" != "0" ]; then
                            echo "      Campo valorCuota normalizado correctamente"
                        else
                            echo "      Campo valorCuota no normalizado"
                        fi
                    done
                else
                    echo " No hay cuotas en la amortización"
                fi
            else
                echo "No se encontró amortización en el crédito"
            fi
            
            # Verificar cálculo de mora
            pagoEnMora=$(echo "$response" | jq -r ".data[$i].pagoEnMora // \"N/A\"")
            echo ""
            echo " Pago en Mora Calculado: $pagoEnMora"
            
            if [ "$pagoEnMora" != "N/A" ] && [ "$pagoEnMora" != "null" ]; then
                echo " Cálculo de mora completado"
            else
                echo " Error en cálculo de mora"
            fi
        done
    else
        echo " Error en la respuesta del API"
        echo " Respuesta recibida: $response"
    fi
}

echo " EJECUTANDO PRUEBA DEL ESCENARIO 2..."
echo "======================================="
test_scenario_2

echo ""
echo " REVISIÓN DE LOGS DEL SERVIDOR:"
echo "================================="
echo " Buscar en los logs del servidor las líneas que contengan '[ESCENARIO 2]'"
echo " Comando sugerido para ver los logs:"
echo "   tail -f .next/logs/* | grep 'ESCENARIO 2'"
echo ""
echo " Prueba del Escenario 2 completada"
echo " Verificar que los campos de cada cuota estén correctamente normalizados"