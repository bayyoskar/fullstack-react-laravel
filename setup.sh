#!/bin/bash

apt-get update -y
apt-get install -y php php-cli php-mbstring php-xml php-bcmath php-curl php-zip php-mysql unzip curl git

# Install Composer
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
export PATH="$PATH:/usr/local/bin"

# Install Laravel dependencies
composer install --no-dev --optimize-autoloader --ignore-platform-reqs

# Copy .env kalau belum ada
if [ ! -f ".env" ]; then
  cp .env.example .env
fi

# Generate app key
php artisan key:generate

echo "✅ Laravel setup completed successfully!"