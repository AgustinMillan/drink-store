@echo off
REM Script de inicio rápido para Docker en Windows
REM Uso: docker-start.bat

echo 🐳 Iniciando DirnkStore con Docker...
echo.

REM Verificar si existe archivo .env
if not exist .env (
    echo ⚠️  No se encontró archivo .env
    echo 📝 Creando archivo .env desde template...
    (
        echo # === BASE DE DATOS ===
        echo DB_USER=postgres
        echo DB_PASSWORD=postgres
        echo DB_NAME=dirnkstore
        echo.
        echo # === SERVIDOR ===
        echo PORT=3000
        echo NODE_ENV=development
    ) > .env
    echo ✅ Archivo .env creado. Por favor, revisa y ajusta las credenciales si es necesario.
    echo.
)

REM Construir e iniciar contenedores
echo 🔨 Construyendo imágenes...
docker-compose build

echo.
echo 🚀 Iniciando contenedores...
docker-compose up -d

echo.
echo ⏳ Esperando a que los servicios estén listos...
timeout /t 5 /nobreak > nul

REM Mostrar estado
echo.
echo 📊 Estado de los contenedores:
docker-compose ps

echo.
echo ✅ Servicios iniciados!
echo 📝 Comandos útiles:
echo    Ver logs: docker-compose logs -f app
echo    Detener: docker-compose down
echo    Reiniciar: docker-compose restart

pause
