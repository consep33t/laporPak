# Gunakan image Node.js versi ringan
FROM node:18-alpine

# Tentukan folder kerja di dalam container
WORKDIR /app

# Salin file konfigurasi package (package.json & package-lock.json)
COPY package*.json ./

# Install semua dependency
RUN npm install

# Salin seluruh file project Next.js Anda ke dalam container
COPY . .

# WAJIB UNTUK NEXT.JS: Lakukan proses build
RUN npm run build

# Buka port 3000
EXPOSE 3000

# Jalankan Next.js dalam mode production
CMD ["npm", "start"]