#!/bin/bash

# ===================================================================
# SCRIPT DE DIAGNÓSTICO INMEDIATO - ESTRUCTURA BACKEND COMPLETA
# ===================================================================
# Ejecuta consulta y captura logs completos de frontend y backend

echo "DIAGNÓSTICO INMEDIATO - PASO 1: ANÁLISIS COMPLETO DE ESTRUCTURA"
echo "================================================================="
echo ""

# Configurar variables
API_URL="http://localhost:5122/api/credito"
TEST_CEDULA="1234567890"

echo "Objetivo: Identificar estructura exacta del backend"
echo "URL del endpoint: $API_URL"
echo "Cédula de prueba: $TEST_CEDULA"
echo ""

# Función para realizar la consulta diagnóstica
execute_diagnostic_query() {
    echo "EJECUTANDO CONSULTA DIAGNÓSTICA..."
    echo "====================================="
    
    # Hacer la petición y capturar TODA la respuesta
    echo "Realizando petición POST al API..."
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "{\"userDocumento\":\"$TEST_CEDULA\"}")
    
    # Separar código de estado y cuerpo de respuesta
    http_status=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    response_body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')
    
    echo "Código de estado HTTP: $http_status"
    echo ""
    
    if [ "$http_status" = "200" ]; then
        echo "RESPUESTA EXITOSA - ANÁLISIS DETALLADO:"
        echo "=========================================="
        
        # Mostrar respuesta completa formateada
        echo "RESPUESTA COMPLETA DEL API:"
        echo "$response_body" | jq '.' 2>/dev/null || echo "$response_body"
        
        echo ""
        echo "ANÁLISIS ESTRUCTURAL:"
        echo "========================"
        
        # Verificar si es array directo
        if echo "$response_body" | jq -e 'type == "array"' > /dev/null 2>&1; then
            echo " La respuesta es un array directo"
            
            array_length=$(echo "$response_body" | jq 'length')
            echo " Número de elementos: $array_length"
            
            if [ "$array_length" -gt 0 ]; then
                echo ""
                echo " ANÁLISIS DEL PRIMER ELEMENTO:"
                echo "==============================="
                
                # Mostrar primer elemento completo
                echo "Primer elemento completo:"
                echo "$response_body" | jq '.[0]'
                
                # Analizar campos disponibles
                echo ""
                echo "Campos disponibles en el primer elemento:"
                echo "$response_body" | jq '.[0] | keys[]'
                
                # Buscar específicamente campos de amortización
                echo ""
                echo "BÚSQUEDA DE CAMPOS DE AMORTIZACIÓN:"
                echo "====================================="
                
                campos_amortizacion=("amortizacion" "amortisation" "cuotas" "installments" "planPagos" "detalleAmortizacion" "cronograma" "cuotasPendientes" "schedule")
                
                for campo in "${campos_amortizacion[@]}"; do
                    if echo "$response_body" | jq -e ".[0].$campo" > /dev/null 2>&1; then
                        echo "Campo '$campo' ENCONTRADO:"
                        campo_tipo=$(echo "$response_body" | jq -r ".[0].$campo | type")
                        echo "   - Tipo: $campo_tipo"
                        
                        if [ "$campo_tipo" = "array" ]; then
                            campo_length=$(echo "$response_body" | jq ".[0].$campo | length")
                            echo "   - Longitud: $campo_length"
                            
                            if [ "$campo_length" -gt 0 ]; then
                                echo "   - Primer elemento del array:"
                                echo "$response_body" | jq ".[0].$campo[0]"
                                echo "   - Campos del primer elemento:"
                                echo "$response_body" | jq ".[0].$campo[0] | keys[]"
                            fi
                        else
                            echo "   - Contenido:"
                            echo "$response_body" | jq ".[0].$campo"
                        fi
                        echo ""
                    else
                        echo "Campo '$campo' NO encontrado"
                    fi
                done
            else
                echo "El array está vacío"
            fi
            
        # Verificar si tiene estructura con metadata
        elif echo "$response_body" | jq -e '.creditos' > /dev/null 2>&1; then
            echo "La respuesta tiene estructura con metadata (campo 'creditos')"
            
            echo ""
            echo "Estructura completa de metadata:"
            echo "$response_body" | jq 'keys[]'
            
            echo ""
            echo "ANÁLISIS DE CREDITOS:"
            echo "======================="
            
            creditos_length=$(echo "$response_body" | jq '.creditos | length')
            echo "Número de créditos: $creditos_length"
            
            if [ "$creditos_length" -gt 0 ]; then
                echo ""
                echo "Primer crédito en metadata:"
                echo "$response_body" | jq '.creditos[0]'
            fi
            
        else
            echo "Estructura desconocida - no es array directo ni tiene campo 'creditos'"
            echo ""
            echo " Campos de nivel raíz:"
            echo "$response_body" | jq 'keys[]' 2>/dev/null || echo "No se pudo analizar como JSON"
        fi
        
    else
        echo "ERROR EN LA PETICIÓN"
        echo "Código de estado: $http_status"
        echo "Respuesta: $response_body"
    fi
}

echo "INICIANDO DIAGNÓSTICO..."
execute_diagnostic_query

echo ""
echo " INSTRUCCIONES PARA REVISAR LOGS:"
echo "===================================="
echo "1. Abrir la consola del navegador (F12)"
echo "2. Ir a la pestaña Console"
echo "3. Realizar una consulta desde la página web"
echo "4. Buscar logs que contengan '[DIAGNÓSTICO]' o '[BACKEND DIAGNÓSTICO]'"
echo ""
echo "También revisar logs del servidor con:"
echo "   tail -f .next/logs/* | grep -E '(DIAGNÓSTICO|BACKEND)'"
echo ""
echo " Diagnóstico completado. Revisar resultados arriba para identificar estructura real."