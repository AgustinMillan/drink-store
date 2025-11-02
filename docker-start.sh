#!/bin/bash

# Script de inicio rápido para Docker
# Uso: ./docker-start.sh

echo "🐳 Iniciando DirnkStore con Docker..."
echo ""

# Verificar si existe archivo .env
if [ ! -f .env ]; then
    echo "⚠️  No se encontró archivo .env"
    echo "📝 Creando archivo .env desde template..."
    cat > .env << EOF
# === BASE DE DATOS ===
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=dirnkstore

# === SERVIDOR ===
PORT=3000
NODE_ENV=development
EOF
    echo "✅ Archivo .env creado. Por favor, revisa y ajusta las credenciales si es necesario."
    echo ""
fi

# Construir e iniciar contenedores
echo "🔨 Construyendo imágenes..."
docker-compose build

echo ""
echo "🚀 Iniciando contenedores..."
docker-compose up -d

echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 5

# Mostrar estado
echo ""
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "✅ Servicios iniciados!"
echo "🌐 API disponible en: http://localhost:3000"
echo ""
echo "📝 Comandos útiles:"
echo "   Ver logs: docker-compose logs -f app"
echo "   Detener: docker-compose down"
echo "   Reiniciar: docker-compose restart"
