#!/bin/bash

# install dependencies
apt-get update -y
apt-get install -y php php-cli php-mbstring unzip curl git

# install composer
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# masuk ke folder Laravel
cd ubur_ubur

# install dependensi Laravel
composer install --no-dev --optimize-autoloader

# generate app key
php artisan key:generate