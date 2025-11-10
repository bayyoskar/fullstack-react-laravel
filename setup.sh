#!/bin/bash

set -e

# Update package list
apt-get update -y

# Install PHP dan semua dependencies Laravel
apt-get install -y php php-cli php-mbstring php-xml php-bcmath php-curl php-zip php-mysql unzip curl git

# Install Composer (global)
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# Pastikan folder ubur_ubur ada
if [ ! -d "ubur_ubur" ]; then
  echo "❌ Folder ubur_ubur tidak ditemukan!"
  ls -la
  exit 1
fi

# Masuk ke folder Laravel
cd ubur_ubur

# Install dependency Laravel
composer install --no-dev --optimize-autoloader --ignore-platform-reqs

# Copy .env kalau belum ada
if [ ! -f ".env" ]; then
  cp .env.example .env
fi

# Generate app key
php artisan key:generate

echo "✅ Laravel setup completed successfully!"