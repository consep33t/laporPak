<div align="center">
  <img src="https://raw.githubusercontent.com/consep33t/laporPak/main/public/laporpak-logo.png" alt="LaporPak Logo" width="150" height="150" />
  <h1>🚀 LaporPak V5</h1>
  <p><b>Sistem Pelaporan Infrastruktur Desa Masa Depan</b></p>
  <p><em>Berbasis Next.js 14, Supabase, Prisma & Animasi Claymorphism 3D</em></p>
</div>

---

## ✨ Ikhtisar
**LaporPak** adalah *platform* pelaporan infrastruktur desa tingkat lanjut yang dirancang khusus untuk memfasilitasi komunikasi antara warga dan pemerintah daerah secara cepat, transparan, dan interaktif. 

Di **Versi 5 (V5)** ini, kami membawa perombakan total pada arsitektur UI/UX dengan mengusung gaya **3D Claymorphism** dipadukan dengan **Animasi Parallax Fisik (Spring Physics)**, menjadikannya salah satu portal pelaporan publik paling modern dan responsif.

## 🌟 Fitur Unggulan

### 🎨 1. Desain UI/UX Eksklusif (Claymorphism & Glassmorphism)
- Semua elemen (tombol, form, dan kartu) didesain dengan konsep **Claymorphism** 3D (gelembung empuk membulat).
- Latar belakang dilapisi dengan **Tekstur Kertas (Noise)** serta dipadukan dengan **Kaca Transparan (Backdrop Blur)**.

### 🎥 2. Animasi Parallax & Ornamen 3D Dinamis
- Dilengkapi dengan *Framer Motion* yang menghadirkan **efek parallax 60FPS** tanpa lag.
- Ornamen 3D interaktif (Pohon goyang, Awan berjalan, Mobil melayang) bereaksi terhadap pergerakan kursor dan *scroll* secara cerdas berkat pemisahan lapisan (Nested Framer Motion Layers).

### 🛡️ 3. Keamanan Tingkat Korporat
- **IDOR Protection & Role-Based Access Control (RBAC):** Tidak sembarang orang dapat mengakses panel admin atau mengubah/menghapus laporan orang lain.
- Validasi Input Server-Side & Autentikasi ketat berbasis sesi **Supabase**.

### 📸 4. Pengunggahan Multi-Gambar Cerdas (Camera & Gallery)
- **Kamera Langsung & Pilihan Galeri:** Pengguna bebas memfoto kerusakan jalan secara langsung via web.
- **Mendukung Hingga 5 Gambar:** Laporan lebih akurat dengan multiple-angle.
- **Kompresi Otomatis & Lightbox Interaktif:** Semua gambar dikompresi agar ukuran kecil. Saat gambar diklik, akan masuk ke mode **Fullscreen Lightbox** di mana Anda dapat melakukan *Zoom-in/out* dan *Free Panning*.

### 📍 5. Peta Geografis Presisi (Leaflet & OpenStreetMap)
- Mengambil titik koordinat (Latitude & Longitude) otomatis.
- **Reverse Geocoding:** Secara otomatis mengubah pin koordinat menjadi teks alamat nama jalan yang bisa dibaca.

### 💬 6. Interaksi Publik (Bubble Chat & Reaksi)
- Setiap warga dapat ikut **Mendukung (Upvote)** atau **Menolak (Downvote)** laporan untuk menaikkan skala prioritas (SLA).
- Fitur komentar berbentuk gelembung (Bubble Chat) layaknya WhatsApp, lengkap dengan stempel waktu dan fitur laporkan (*Flag/Report*).

---

## 🛠️ Stack Teknologi

Dapur pacu LaporPak V5 ditenagai oleh teknologi *Modern Web Stack* paling populer:

- **Framework Utama:** [Next.js 14](https://nextjs.org/) (App Router & Server Actions)
- **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/) + Custom Claymorphism
- **Animasi:** [Framer Motion](https://www.framer.com/motion/) (Fisika Pegas / Spring)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL & Row Level Security)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Peta & GIS:** [Leaflet.js](https://leafletjs.com/) & React-Leaflet
- **Manajemen Gambar:** Supabase Storage (Bucket)

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

Pastikan Anda memiliki **Node.js 18+** terinstal.

1. **Clone Repositori ini**
   ```bash
   git clone https://github.com/consep33t/laporPak.git
   cd laporPak
   ```

2. **Instal Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable**
   Buat file `.env` dan `.env.local` di direktori utama, lalu masukkan kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_DBSUPABASE_URL="https://[PROJECT_ID].supabase.co"
   NEXT_PUBLIC_DBSUPABASE_ANON_KEY="your-anon-key"
   POSTGRES_PRISMA_URL="postgres://[USER]:[PASSWORD]@[HOST]:5432/postgres"
   POSTGRES_URL_NON_POOLING="postgres://[USER]:[PASSWORD]@[HOST]:5432/postgres"
   ```

4. **Sinkronisasi Database (Prisma)**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Jalankan Server Development**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di peramban (browser) Anda untuk melihat hasilnya.

---

## 👥 Peran Pengguna

Sistem ini memiliki dua tingkatan (Role):

1. **Warga (Pelapor):** Dapat membuat profil, melapor dengan bukti multi-gambar & lokasi akurat, ikut berdiskusi, dan memantau SLA laporan mereka. Diberi lencana ("Warga Aktif", "Pahlawan Desa") berdasarkan jumlah dukungan yang diraih.
2. **Admin Tunggal:** Dikhususkan untuk **Ageng Prayoga** sebagai verifikator mutlak. Mampu menolak, menyetujui, memberi masa estimasi, serta melampirkan *Foto Bukti Perbaikan* jika infrastruktur sudah diselesaikan oleh tim teknis.

---

<div align="center">
  <p>Diciptakan dengan penuh dedikasi menggunakan <b>Antigravity</b>. 🚀</p>
</div>
