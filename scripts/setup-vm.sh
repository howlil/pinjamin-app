#!/bin/bash

# Setup Script untuk VM GCP - PBF Backend Deployment
# Jalankan script ini di VM GCP untuk persiapan deployment

set -e

echo "🚀 Starting VM setup for PBF Backend deployment..."

# Update sistem
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Install pnpm globally
echo "📦 Installing pnpm..."
sudo npm install -g pnpm

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Verify pnpm installation
echo "✅ pnpm version: $(pnpm --version)"

# Verify PM2 installation
echo "✅ PM2 version: $(pm2 --version)"

# Install Git
echo "📦 Installing Git..."
sudo apt install git -y

# Install other useful packages
echo "📦 Installing additional packages..."
sudo apt install -y curl wget htop nano vim

# Create application directory
echo "📁 Creating application directory..."
APP_DIR="/home/$USER/pbf-server"
mkdir -p $APP_DIR
mkdir -p $APP_DIR/server/logs

echo "✅ Application directory created at: $APP_DIR"

# Setup PM2 startup
echo "⚙️ Setting up PM2 startup..."
pm2 startup
echo "💡 Run the generated command above with sudo to complete PM2 startup setup"

# Setup firewall (optional)
read -p "🔐 Do you want to setup basic firewall rules? (y/n): " setup_firewall
if [[ $setup_firewall == "y" || $setup_firewall == "Y" ]]; then
    echo "🔐 Setting up firewall..."
    sudo ufw allow ssh
    sudo ufw allow 3000/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    echo "✅ Firewall rules applied"
fi

# Generate SSH key for GitHub (optional)
read -p "🔑 Do you want to generate SSH key for GitHub? (y/n): " generate_ssh
if [[ $generate_ssh == "y" || $generate_ssh == "Y" ]]; then
    if [ ! -f ~/.ssh/id_rsa ]; then
        echo "🔑 Generating SSH key..."
        ssh-keygen -t rsa -b 4096 -C "$USER@$(hostname)" -f ~/.ssh/id_rsa -N ""
        echo "✅ SSH key generated. Public key:"
        cat ~/.ssh/id_rsa.pub
        echo ""
        echo "💡 Add this public key to your GitHub account for repository access"
    else
        echo "⚠️ SSH key already exists"
    fi
fi

# Create .env template
echo "📝 Creating .env template..."
cat > $APP_DIR/server/.env.example << EOL
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT
JWT_SECRET="your-jwt-secret-key"

# Email Configuration
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password"

# Xendit Payment
XENDIT_SECRET_KEY="your-xendit-secret-key"

# Pusher Real-time
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-pusher-cluster"

# Server Configuration
NODE_ENV="production"
PORT=3000
EOL

echo "✅ Environment template created at: $APP_DIR/server/.env.example"

# Setup log rotation
echo "📋 Setting up log rotation..."
sudo cat > /etc/logrotate.d/pbf-server << EOL
$APP_DIR/server/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    copytruncate
}
EOL

echo "✅ Log rotation configured"

# Create systemd service for PM2 (backup)
echo "⚙️ Creating systemd service backup..."
sudo cat > /etc/systemd/system/pbf-server.service << EOL
[Unit]
Description=PBF Server
After=network.target

[Service]
Type=forking
User=$USER
WorkingDirectory=$APP_DIR/server
ExecStart=/usr/bin/pm2 start ecosystem.config.js --env production
ExecReload=/usr/bin/pm2 reload ecosystem.config.js --env production
ExecStop=/usr/bin/pm2 stop ecosystem.config.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOL

echo "✅ Systemd service created (backup method)"

echo ""
echo "🎉 VM setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Copy your .env file to: $APP_DIR/server/.env"
echo "2. Add your SSH public key to GitHub"
echo "3. Run the PM2 startup command shown above with sudo"
echo "4. Test SSH connection from GitHub Actions"
echo ""
echo "🔍 Useful commands:"
echo "- Check PM2 status: pm2 status"
echo "- View logs: pm2 logs"
echo "- Monitor: pm2 monit"
echo "- Restart: pm2 restart pbf-server"
echo ""
echo "✅ Your VM is ready for deployment!" 