#!/bin/bash

echo "Iniciando despliegue de Finova (Producción)..."

# Verificar que existe docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo " Docker Compose no está instalado"
    exit 1
fi

# Detener contenedor de producción si existe
echo " Deteniendo contenedor de producción..."
docker-compose -f docker-compose.prod.yml down

# Construir nueva imagen
echo " Construyendo imagen de producción..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Levantar contenedor
echo " Levantando contenedor de producción..."
docker-compose -f docker-compose.prod.yml up -d

# Verificar estado
echo " Verificando estado..."
sleep 5
docker-compose -f docker-compose.prod.yml logs --tail=20

echo ""
echo " Despliegue completado!"
echo " Desarrollo: http://localhost:5122"
echo " Producción: http://localhost:3001"
echo ""
echo " Comandos útiles:"
echo "   Ver logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "   Detener:  docker-compose -f docker-compose.prod.yml down"
echo "   Estado:   docker-compose -f docker-compose.prod.yml ps"