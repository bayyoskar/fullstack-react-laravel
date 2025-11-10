#!/bin/bash

# Update package list
apt-get update -y

# Install PHP + dependencies yang lengkap (wajib buat Laravel)
apt-get install -y php php-cli php-mbstring php-xml php-bcmath php-curl php-zip php-mysql unzip curl git

# Install Composer (global)
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
export PATH="$PATH:/usr/local/bin"

# Masuk ke folder Laravel
cd ubur_ubur

# Install semua dependency Laravel
php /usr/local/bin/composer install --no-dev --optimize-autoloader --ignore-platform-reqs

# Copy .env.example ke .env kalau belum ada
if [ ! -f ".env" ]; then
  cp .env.example .env
fi

# Generate Laravel app key
php artisan key:generate

echo "✅ Laravel setup completed successfully!"