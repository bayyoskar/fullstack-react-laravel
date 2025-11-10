# Gunakan base image Ubuntu
FROM ubuntu:24.04

# Set working directory ke /app
WORKDIR /app

# Copy semua file dari repo ke dalam container
COPY . /app

# Masuk ke folder Laravel kamu (ubah ubur_ubur kalau beda)
WORKDIR /app/ubur_ubur

# Jalankan script setup (buat install dependency dan generate key)
RUN bash ../setup.sh

# Expose port 8000 (port default Laravel)
EXPOSE 8000

# Jalankan server Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]