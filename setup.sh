#!/bin/bash

# Update package list
apt-get update -y

# Install PHP dan dependency Laravel
apt-get install -y php php-cli php-mbstring php-xml php-bcmath php-curl php-zip php-mysql unzip curl git

# Install Composer
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# Masuk ke folder Laravel
cd ubur_ubur

# Install dependency Laravel
composer install --no-dev --optimize-autoloader --ignore-platform-reqs

# Generate .env kalau belum ada
if [ ! -f ".env" ]; then
  cp .env.example .env
fi

# Generate app key
php artisan key:generate

echo "✅ Laravel setup completed successfully!"