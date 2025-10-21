#!/bin/bash

echo "DIAGNÓSTICO DE ESTRUCTURA DE DATOS - AMORTIZACIÓN"
echo "=================================================="
echo ""

# Verificar si el servidor está corriendo
if ! curl -s http://localhost:5122 > /dev/null; then
    echo " Error: El servidor no está corriendo en puerto 5122"
    echo " Ejecuta: npm run dev"
    exit 1
fi

echo "Probando endpoint de crédito con documento de prueba..."
echo ""

# Test con documento de prueba
RESPONSE=$(curl -s -X POST http://localhost:5122/api/credito \
  -H "Content-Type: application/json" \
  -d '{"userDocumento":"123456789"}')

echo "ANÁLISIS DE RESPUESTA:"
echo "========================"

# Verificar si la respuesta contiene datos
if echo "$RESPONSE" | grep -q "prestamo_ID"; then
    echo " Respuesta contiene datos de créditos"
    
    # Analizar estructura básica
    echo ""
    echo " ESTRUCTURA BÁSICA:"
    echo "$RESPONSE" | jq -r 'if type == "array" then 
        "Tipo: Array con " + (length | tostring) + " crédito(s)"
    else
        "Tipo: " + (type | tostring)
    end' 2>/dev/null || echo "Respuesta no es JSON válido"
    
    # Analizar primer crédito
    echo ""
    echo " PRIMER CRÉDITO:"
    echo "$RESPONSE" | jq -r '
    if type == "array" and length > 0 then
        "prestamo_ID: " + (.[0].prestamo_ID | tostring) +
        "\n tipoCredito: " + (.[0].tipoCredito // "N/A") +
        "\n estado: " + (.[0].estado // "N/A") +
        "\n pagoMinimo: " + (.[0].pagoMinimo | tostring) +
        "\n pagoTotal: " + (.[0].pagoTotal | tostring) +
        "\n pagoEnMora: " + (.[0].pagoEnMora | tostring)
    else
        " No se encontró estructura de array válida"
    end' 2>/dev/null || echo "Error procesando datos del primer crédito"
    
    # Analizar amortización
    echo ""
    echo " ANÁLISIS DE AMORTIZACIÓN:"
    echo "$RESPONSE" | jq -r '
    if type == "array" and length > 0 then
        if .[0].amortizacion then
            if (.[0].amortizacion | length) > 0 then
                " Amortización encontrada con " + (.[0].amortizacion | length | tostring) + " cuota(s)" +
                "\n Campos en primera cuota: " + (.[0].amortizacion[0] | keys | join(", ")) +
                "\n  Fecha: " + (.[0].amortizacion[0].fecha // "N/A") +
                "\n  Valor cuota: " + (.[0].amortizacion[0].valorCuota // "N/A" | tostring) +
                "\n Mora: " + (.[0].amortizacion[0].mora // "0" | tostring) +
                "\n  Sanción: " + (.[0].amortizacion[0].sancion // "0" | tostring) +
                "\n Estado: " + (.[0].amortizacion[0].estado // "N/A")
            else
                " Array de amortización está vacío"
            fi
        else
            " No existe campo amortizacion"
        fi
    else
        " Estructura de respuesta no válida para análisis"
    end' 2>/dev/null || echo " Error analizando amortización"

else
    echo " Respuesta no contiene datos válidos de créditos"
    echo ""
    echo " RESPUESTA RECIBIDA:"
    echo "$RESPONSE" | head -10
fi

echo ""
echo " PRÓXIMOS PASOS:"
echo "=================="
echo "1. Revisar logs del navegador (F12 > Console) al consultar un crédito"
echo "2. Verificar estructura real vs esperada"
echo "3. Ajustar mapeo de campos si es necesario"
echo ""
echo " Si ves este script funcionando, los logs de debug ya están activos"
echo "   Usa la aplicación web para ver logs detallados en consola"