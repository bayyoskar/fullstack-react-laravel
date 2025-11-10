#!/bin/bash
set -e

echo "🚀 Running Laravel setup in $(pwd)"

apt-get update -y && apt-get install -y curl unzip git php php-cli php-mbstring php-curl php-xml php-bcmath php-zip php-mysql

# install composer
curl -sS https://getcomposer.org/installer | php

echo "📦 Installing dependencies with Composer..."
php composer.phar install --no-interaction --prefer-dist --optimize-autoloader

echo "🧩 Checking if .env exists..."
if [ ! -f ".env" ]; then
  cp .env.example .env
fi

echo "🔑 Generating app key..."
php artisan key:generate || true

echo "📂 Files in current directory:"
ls -lah

echo "✅ Setup done!"