#!/bin/bash

# Update package list
apt-get update -y

# Install PHP dan semua dependencies penting untuk Laravel
apt-get install -y php php-cli php-mbstring php-xml php-bcmath php-curl php-zip php-mysql unzip curl git

# Install Composer secara global
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
export PATH="$PATH:/usr/local/bin"

# Masuk ke folder Laravel
cd ubur_ubur

# Install semua dependency Laravel (tanpa dev)
php /usr/local/bin/composer install --no-dev --optimize-autoloader --ignore-platform-reqs

# Jika file .env belum ada, buat dari .env.example
if [ ! -f ".env" ]; then
  cp .env.example .env
fi

# Generate Laravel app key
php artisan key:generate

echo "✅ Laravel setup completed successfully!"