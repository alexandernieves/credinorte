#!/bin/bash
# =============================================================
# CreditNorte - Script de Despliegue
# =============================================================
# Uso manual:  ./scripts/deploy.sh
# Uso en CI:   Se llama desde GitHub Actions via SSH
# =============================================================

set -e

APP_DIR="/opt/creditnorte"
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"
LOG_FILE="/var/log/creditnorte-deploy.log"

echo "======================================================"
echo "  CreditNorte Deploy - $(date '+%Y-%m-%d %H:%M:%S')"
echo "======================================================"

cd "$APP_DIR" || { echo "ERROR: No se encontró $APP_DIR"; exit 1; }

# Verificar que existe el archivo .env
if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: No se encontró el archivo .env en $APP_DIR"
    echo "Copia .env.production a .env y configura las variables."
    exit 1
fi

# 1. Obtener últimos cambios del repo
echo "[1/4] Actualizando código desde GitHub..."
git fetch origin
git reset --hard origin/main
echo "✅ Código actualizado."

# 2. Construir las imágenes Docker
echo "[2/4] Construyendo imágenes Docker..."
docker compose -f "$COMPOSE_FILE" build --no-cache
echo "✅ Imágenes construidas."

# 3. Levantar los servicios
echo "[3/4] Iniciando servicios..."
docker compose -f "$COMPOSE_FILE" up -d
echo "✅ Servicios iniciados."

# 4. Limpiar imágenes antiguas
echo "[4/4] Limpiando imágenes obsoletas..."
docker image prune -f
echo "✅ Limpieza completada."

# Estado final
echo ""
docker compose -f "$COMPOSE_FILE" ps
echo ""
echo "======================================================"
echo "  ✅ Deploy completado exitosamente!"
echo "  🌐 App disponible en: http://$(hostname -I | awk '{print $1}')"
echo "======================================================"

# Log del deploy
echo "$(date '+%Y-%m-%d %H:%M:%S') - Deploy exitoso" >> "$LOG_FILE" 2>/dev/null || true
