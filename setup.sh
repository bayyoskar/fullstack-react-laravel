#!/bin/bash

# install dependencies
apt-get update -y
apt-get install -y php php-cli php-mbstring unzip curl git

# install composer
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
export PATH="$PATH:/usr/local/bin"

# pindah ke folder laravel
cd ubur_ubur

# install dependency laravel
php /usr/local/bin/composer install --no-dev --optimize-autoloader

# generate app key
php artisan key:generate