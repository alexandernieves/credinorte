#!/bin/bash
# =============================================================
# CreditNorte - Script de Instalación Inicial del Servidor
# =============================================================
# Ejecutar UNA SOLA VEZ en el servidor Ubuntu como root o sudo.
# Uso: chmod +x scripts/server-setup.sh && sudo ./scripts/server-setup.sh
# =============================================================

set -e  # Salir en caso de error

echo "======================================================"
echo "  CreditNorte - Configuración inicial del servidor"
echo "======================================================"

# 1. Actualizar paquetes del sistema
echo "[1/7] Actualizando paquetes del sistema..."
apt-get update -y
apt-get upgrade -y

# 2. Instalar dependencias básicas
echo "[2/7] Instalando dependencias..."
apt-get install -y \
    curl \
    git \
    wget \
    unzip \
    ufw \
    ca-certificates \
    gnupg \
    lsb-release

# 3. Instalar Docker
echo "[3/7] Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    usermod -aG docker odoo
    systemctl enable docker
    systemctl start docker
    echo "Docker instalado exitosamente."
else
    echo "Docker ya está instalado. Saltando..."
fi

# 4. Instalar Docker Compose v2
echo "[4/7] Instalando Docker Compose..."
if ! command -v docker compose &> /dev/null; then
    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
        -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
    echo "Docker Compose instalado exitosamente."
else
    echo "Docker Compose ya está instalado. Saltando..."
fi

# 5. Configurar Firewall (UFW)
echo "[5/7] Configurando firewall..."
ufw --force enable
ufw allow 9055/tcp  # SSH del servidor (mantener acceso!)
ufw allow 80/tcp    # HTTP (CreditNorte via Nginx)
ufw allow 443/tcp   # HTTPS (futuro SSL)
ufw status verbose

# 6. Crear directorio del proyecto
echo "[6/7] Configurando directorio del proyecto..."
mkdir -p /opt/creditnorte
chown odoo:odoo /opt/creditnorte

# 7. Clonar o actualizar el repositorio
echo "[7/7] ¿Deseas clonar el repositorio ahora? (s/n)"
read -r CLONE_REPO
if [ "$CLONE_REPO" = "s" ]; then
    echo "Ingresa la URL del repositorio GitHub (ej: https://github.com/tuuser/creditnorte):"
    read -r REPO_URL
    git clone "$REPO_URL" /opt/creditnorte
    echo "Repositorio clonado en /opt/creditnorte"
fi

echo ""
echo "======================================================"
echo "  ✅ Configuración inicial completada!"
echo ""
echo "  Próximos pasos:"
echo "  1. cd /opt/creditnorte"
echo "  2. cp .env.production .env"
echo "  3. nano .env  (ajustar contraseñas y URL)"
echo "  4. docker compose up -d --build"
echo "  5. Visitar: http://201.221.112.97"
echo "======================================================"
