# LaporPak V5 - Dokumentasi Pembaruan Akhir 🚀

LaporPak V5 adalah iterasi terbesar dari aplikasi pelaporan infrastruktur desa, membawa perubahan revolusioner pada segi **Performa**, **Keamanan**, **User Interface (UI)**, dan **User Experience (UX)**.

## 🌟 Fitur Utama (Highlight)

### 1. Sistem 3D Claymorphism & Animasi Parallax (Engine Baru)
- **Claymorphism Murni**: Seluruh UI (Card, Button, Navbar, Input) kini mengadopsi gaya *Claymorphism* (gelembung 3D membulat, bayangan empuk ganda) menggunakan Tailwind CSS Custom Shadows (`shadow-clay`, `shadow-clay-btn`, dll).
- **Parallax Lanjutan**: Aset 3D murni CSS (Pohon, Awan, Mobil, Trofi, Megafon) melayang di latar belakang. Dilengkapi *Nested Framer Motion Layers* sehingga sistem pergerakan rotasi/skala (*keyframe*) tidak bentrok dengan pergerakan gulir (*scroll physics*).
- **Anti-Flicker & Hardware Acceleration**: Animasi menggunakan `will-change: transform` dan perhitungan pegas (`useSpring`) untuk menjamin 60FPS tanpa berkedip atau patah-patah.

### 2. Keamanan Tingkat Lanjut (Security Audit)
- **IDOR Protection**: Celah *Insecure Direct Object Reference* telah ditutup. Laporan kini tidak bisa dihapus atau diubah sembarangan menggunakan metode penyuntikan ID (dikunci berdasarkan sesi pengguna *Supabase Auth*).
- **Penanganan Error Terpusat**: Seluruh logika server (*Server Actions*) kini dibungkus dengan mekanisme Try-Catch yang aman dan mengembalikan standar objek `success: boolean` dan `error: string` tanpa membocorkan log *server*.

### 3. Ekosistem Peringatan (Custom Alert Provider)
- Native `window.alert` dan `window.confirm` resmi dihapus dan diganti dengan `<AlertProvider>`.
- Sebuah UI *Popup* 3D cantik akan turun melayang lengkap dengan efek latar belakang buram (*backdrop-blur*) jika terjadi kesalahan atau butuh konfirmasi pengguna.

### 4. Tekstur Kertas & Transparansi Kaca (Glass-Clay)
- Latar belakang kini dilapisi tekstur kanvas/kertas (*SVG fractal noise filter*) alih-alih warna putih/abu pekat, memberikan kesan lebih alami.
- Setiap *Card* menggunakan material semi-transparan dipadukan dengan efek kaca (*backdrop-filter: blur*).

### 5. Laporan Peta & Input Geografis
- Input Lintang (*Latitude*) dan Bujur (*Longitude*) pada Leaflet Map didesain dinamis dengan CSS Grid.
- Tidak akan tumpah (*overflow*) meskipun pengguna membuka di layar yang sangat sempit.

### 6. Ruang Hampa 404 (Not Found 3D)
- Rute yang tidak ada akan diarahkan ke halaman *404 Not Found* interaktif.
- Menampilkan tulisan "404" besar bergaya 3D dan dikelilingi 3 mobil yang mengorbit tiada henti secara sinematik.

## 🛠️ Stack Teknologi Terbaru
- **Next.js 14** (App Router)
- **Framer Motion** (Physics-based animation)
- **Tailwind CSS** (Custom Claymorphism UI)
- **Supabase** (PostgreSQL Database & Auth)
- **Prisma ORM** (Schema-driven queries)

---
*Dikembangkan oleh tim Antigravity.*
