#!/bin/bash

set -e

echo "🚀 Running Laravel setup in $(pwd)"

# Install dependencies
apt-get update -y && apt-get install -y curl unzip git php php-cli php-mbstring php-curl php-xml php-bcmath php-zip php-mysql

# Install Composer
curl -sS https://getcomposer.org/installer | php
php composer.phar install --no-interaction --prefer-dist --optimize-autoloader

# Copy env if needed
if [ ! -f ".env" ]; then
  cp .env.example .env
fi

# Generate key
php artisan key:generate || true

echo "✅ Laravel setup completed successfully!"