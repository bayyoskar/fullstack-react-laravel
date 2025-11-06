# Use official PHP image
FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy Laravel app
COPY ubur_ubur/ ./

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Clear & cache config
RUN php artisan config:clear

# Expose port 80 for Railway
EXPOSE 80

# Start Laravel
CMD php artisan serve --host=0.0.0.0 --port=80