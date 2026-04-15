#!/bin/bash
# ==============================================
# Deploy script for Racheldesignscorner
# Run on server: bash deploy.sh
# ==============================================

echo "🚀 Setting up Racheldesignscorner..."

# 1. Update system
echo "📦 Updating system..."
apt update -y && apt upgrade -y

# 2. Install Nginx
echo "📦 Installing Nginx..."
apt install -y nginx

# 3. Install Certbot (SSL)
echo "📦 Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# 4. Create website directory
echo "📁 Creating website directory..."
mkdir -p /var/www/racheldesignscorner
chown -R www-data:www-data /var/www/racheldesignscorner

# 5. Configure Nginx
echo "⚙️ Configuring Nginx..."
cat > /etc/nginx/sites-available/racheldesignscorner << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name racheldesignscorner.com www.racheldesignscorner.com;
    root /var/www/racheldesignscorner;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1000;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# 6. Enable site
ln -sf /etc/nginx/sites-available/racheldesignscorner /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 7. Test & restart Nginx
nginx -t && systemctl restart nginx

echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Upload website files to /var/www/racheldesignscorner/"
echo "2. Point domain DNS to this server IP"
echo "3. Run: certbot --nginx -d racheldesignscorner.com -d www.racheldesignscorner.com"
echo ""
echo "🎉 Done!"
