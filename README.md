# &lt;Caffeine/&gt; - E-Commerce & Sistem Reservasi Kafe Full-Stack

Selamat datang di repositori proyek `<Caffeine/>`. Proyek ini adalah aplikasi web *full-stack* yang dirancang untuk sebuah kafe fiksi, menyediakan platform e-commerce untuk pemesanan produk dan sistem reservasi meja. Dibangun dengan tumpukan teknologi modern, proyek ini memisahkan antara frontend dan backend untuk skalabilitas dan pemeliharaan yang lebih baik.

## 👥 Informasi Tim

Proyek ini dikembangkan oleh **Kelompok 5** sebagai bagian dari tugas mata kuliah Praktikum Sistem Basis Data.

-   **Anggota Kelompok:**
    1.  Muhammad Alvin Faris   (202343500943)
    2.  Muhammad Nafis         (202343500945)
    4.  Amalia Salsabila       (202343500940)
    5.  Muhammad Moreno Rajata (202343500965)


## 🏗️ Arsitektur Proyek

Aplikasi ini menggunakan arsitektur *client-server* yang terpisah, di mana frontend dan backend dikembangkan dan di-deploy secara independen.
## 🏗️ Arsitektur Proyek

Aplikasi ini menggunakan arsitektur *client-server* yang terpisah, di mana frontend dan backend dikembangkan dan di-deploy secara independen.

`
                               +----------------------+
                               |   Browser / Client   |
                               +-----------+----------+
                                           |
                  (HTTPS Request / Rendered Pages)
                                           |
                               +-----------v----------+
                               |  Frontend (Next.js)  |
                               |  (User Interface)    |
                               +-----------+----------+
                                           |
                              (REST API Calls over HTTPS)
                                           |
                               +-----------v----------+
                               |  Backend (Express)   |
                               |   (Business Logic)   |
                               +----+----------+------+
                                    |          |
             +----------------------+          +--------------------------+
             |                                                            |
+------------v-----------+    +---------------------------+    +----------v-------------+
|   Database (MySQL)     | <--+      Session Store        +--> | Midtrans Payment Gateway |
|  (Data Persistence)    |    |  (Stored in MySQL/Redis)  |    |   (External Service)   |
+------------------------+    +---------------------------+    +--------------------------+


* **Frontend (Next.js)**: Bertanggung jawab untuk menyajikan antarmuka pengguna (UI). Komponen-komponennya berinteraksi dengan backend melalui panggilan API untuk mendapatkan atau mengirim data.
* **Backend (Express.js)**: Menyediakan RESTful API yang digunakan oleh frontend. Ini adalah lapisan yang menangani semua logika bisnis, interaksi database, dan komunikasi dengan layanan pihak ketiga seperti Midtrans.
* **Database (MySQL)**: Menyimpan semua data persisten aplikasi, termasuk data pengguna, produk, pesanan, reservasi, dan sesi.

## ✨ Fitur dan Fungsionalitas

Aplikasi ini memiliki serangkaian fitur yang komprehensif untuk melayani baik pelanggan maupun admin kafe.

### Untuk Pelanggan:

* **Autentikasi Pengguna**:
    * Sistem registrasi untuk pengguna baru.
    * Login aman menggunakan email dan password.
    * Mekanisme logout untuk mengakhiri sesi pengguna.
* **E-Commerce**:
    * **Katalog Produk**: Menampilkan semua produk dengan gambar, deskripsi, dan harga.
    * **Filter Kategori**: Pengguna dapat memfilter produk berdasarkan kategori seperti 'Kopi', 'Non-Kopi', 'Snack', dll.
    * **Keranjang Belanja Dinamis**: Menambah, menghapus, dan memperbarui kuantitas produk dalam keranjang secara *real-time*.
    * **Sistem Voucher**: Pengguna bisa memasukkan kode voucher saat checkout untuk mendapatkan potongan harga.
* **Pembayaran**:
    * **Integrasi Midtrans**: Proses pembayaran yang aman melalui Midtrans Snap, mendukung berbagai metode pembayaran.
    * **Notifikasi Webhook**: Backend menerima notifikasi status pembayaran dari Midtrans untuk memperbarui status pesanan secara otomatis.
* **Sistem Reservasi**:
    * **Pengecekan Ketersediaan**: Pengguna dapat memeriksa ketersediaan meja berdasarkan tanggal, waktu, dan durasi.
    * **Manajemen Reservasi**: Pengguna dapat melihat riwayat, mengubah jadwal (reschedule), atau membatalkan reservasi.
* **Akun Pengguna**:
    * Halaman profil untuk melihat dan mengelola informasi pribadi.
    * Akses mudah ke riwayat pesanan dan reservasi.

## 🚀 Teknologi yang Digunakan

Proyek ini dibangun menggunakan teknologi modern yang populer dan andal di industri pengembangan web.

### Frontend (Direktori `/Frontend`)

| Teknologi | Alasan Pemilihan |
| :--- | :--- |
| **Next.js** | Framework React yang kuat untuk membangun aplikasi *server-side rendering* (SSR) dan *static site generation* (SSG). Dipilih karena optimasi SEO yang lebih baik, performa rendering yang cepat, dan sistem routing berbasis file yang intuitif. |
| **TypeScript** | *Superset* dari JavaScript yang menambahkan *static typing*. Ini membantu mengurangi bug selama pengembangan, meningkatkan keterbacaan kode, dan mempermudah pemeliharaan proyek skala besar. |
| **Tailwind CSS** | Framework CSS *utility-first* yang memungkinkan pembuatan desain kustom dengan cepat tanpa meninggalkan HTML. Sangat fleksibel dan efisien. |
| **Shadcn/ui** | Kumpulan komponen UI yang *reusable*, dibangun di atas Radix UI dan Tailwind CSS. Dipilih karena menyediakan komponen yang indah, aksesibel, dan mudah dikustomisasi tanpa menambahkan *dependency* yang tidak perlu. |
| **Context API** | Digunakan untuk manajemen state global seperti status autentikasi, keranjang belanja, dan data produk, memungkinkan komunikasi antar komponen yang efisien. |

### Backend (Direktori `/Backend`)

| Teknologi | Alasan Pemilihan |
| :--- | :--- |
| **Node.js** | Lingkungan eksekusi JavaScript di sisi server yang populer dan memiliki ekosistem yang besar. |
| **Express.js** | Framework web minimalis dan fleksibel untuk Node.js. Dipilih karena kesederhanaannya, kecepatan, dan kemudahan dalam membangun RESTful API yang andal. |
| **MySQL** | Sistem manajemen basis data relasional (RDBMS) yang teruji, andal, dan banyak digunakan untuk aplikasi web. Cocok untuk data terstruktur seperti pengguna, produk, dan pesanan. |
| **Midtrans** | *Payment gateway* populer di Indonesia yang menyediakan berbagai metode pembayaran. Integrasinya mudah dan dokumentasinya lengkap, seperti yang terlihat pada `orderController.js`. |
| **Express Session** | Middleware untuk mengelola sesi pengguna, penting untuk sistem autentikasi. Disimpan di database MySQL untuk persistensi. |

---

## ⚙️ Pengaturan Lingkungan (Environment)

Sebelum menjalankan proyek, Anda perlu membuat file `.env` di direktori **Backend** dan `.env.local` di direktori **Frontend**.

### 1. Backend (`/Backend/.env`)

Salin konten di bawah ini dan sesuaikan dengan konfigurasi lokal Anda.

```env
# ==============================
# Mode Aplikasi (development/production)
# ==============================
# Variabel ini akan menentukan beberapa perilaku, seperti pengaturan cookie sesi.
# Gunakan 'development' untuk lokal dan 'production' saat deploy.
NODE_ENV=development

# ==============================
# Konfigurasi Database MySQL
# ==============================
# Host server database Anda (biasanya 'localhost' atau alamat IP)
DB_HOST=localhost
# User untuk koneksi ke database
DB_USER=root
# Password untuk user database
DB_PASSWORD=password_database_anda
# Nama database yang telah Anda buat dari file database-setup.sql
DB_NAME=kopi_kenangan_senja
# Port server database Anda (default untuk MySQL adalah 3306)
DB_PORT=3306

# ==============================
# Konfigurasi Sesi Pengguna
# ==============================
# Kunci rahasia untuk mengenkripsi cookie sesi. Ganti dengan string acak yang panjang dan aman.
# Anda bisa generate di: [https://www.lastpass.com/features/password-generator](https://www.lastpass.com/features/password-generator)
SESSION_SECRET=ganti_dengan_kunci_rahasia_yang_sangat_aman_dan_panjang

# ==============================
# Konfigurasi Midtrans Payment Gateway
# ==============================
# Dapatkan dari dashboard Midtrans Anda ([https://midtrans.com/](https://midtrans.com/))
# Atur `MIDTRANS_IS_PRODUCTION` ke "true" jika menggunakan akun produksi
MIDTRANS_IS_PRODUCTION=false
# Server Key untuk otentikasi API di sisi backend
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxxxxxxxx
# Client Key untuk digunakan di frontend (melalui API)
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxxxxxxxx
2. Frontend (/Frontend/.env.local)
File ini hanya dibutuhkan untuk menyimpan client key Midtrans agar bisa diakses oleh script di sisi klien.

Cuplikan kode

# ==============================
# Konfigurasi Midtrans Client Key
# ==============================
# Pastikan nilainya SAMA PERSIS dengan MIDTRANS_CLIENT_KEY di backend.
# Ini digunakan oleh hook useSnapPayment untuk memuat script Snap dari Midtrans.
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxxxxxxxx
Catatan Penting Konfigurasi Sesi
File Backend/config/session.js telah dikonfigurasi untuk production.

JavaScript

// Backend/config/session.js
cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 hari
    secure: true, // TRUE karena kamu pakai HTTPS (sudah kamu bilang)
    httpOnly: true,
    sameSite: "none", // Penting agar cookie dikirim ke frontend beda origin
},
secure: true: Mengharuskan cookie dikirim hanya melalui HTTPS. Ini wajib untuk production, tetapi akan menyebabkan login gagal di localhost (karena http://).

sameSite: "none": Diperlukan agar browser mengirim cookie pada permintaan lintas domain (dari frontend ke backend).

Untuk mengatasi ini saat development lokal, Anda bisa memodifikasi Backend/config/session.js agar dinamis berdasarkan NODE_ENV:

JavaScript

// Modifikasi yang disarankan untuk Backend/config/session.js
const isProduction = process.env.NODE_ENV === 'production';

const sessionConfig = session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 hari
    secure: isProduction, // Dinamis: true di production, false di development
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax", // 'lax' untuk development lokal
  },
});
🛠️ Instalasi dan Cara Menjalankan Proyek
Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan lokal Anda.

Prasyarat
Node.js (v18 atau lebih baru)

pnpm sebagai package manager (disarankan, namun bisa juga menggunakan npm atau yarn)

Server Database MySQL yang sedang berjalan (contoh: XAMPP, Laragon, atau instalasi MySQL langsung).

1. Clone Repository
Bash

git clone [https://github.com/ALVINfrs/caffeine-fullstack-fix.git](https://github.com/ALVINfrs/caffeine-fullstack-fix.git)
cd caffeine-fullstack-fix
2. Pengaturan Database
Pastikan server MySQL Anda sudah berjalan.

Buka tool database Anda (misal: phpMyAdmin, DBeaver, atau command line).

Buat database baru dengan nama yang sama seperti yang Anda definisikan di DB_NAME pada file .env (contoh: kopi_kenangan_senja).

Impor file Backend/database-setup.sql ke dalam database yang baru Anda buat. Ini akan membuat semua tabel yang dibutuhkan beserta data sampel.

3. Menjalankan Backend
Buka terminal baru dan masuk ke direktori Backend.

Bash

cd Backend
Instal semua dependency yang dibutuhkan.

Bash

npm install
Buat file .env dan isi sesuai dengan konfigurasi Anda seperti pada contoh di atas.

Jalankan server backend.

Bash

npm start
Server akan berjalan di http://localhost:3000. Anda akan melihat pesan "Database connection successful" jika koneksi berhasil.

4. Menjalankan Frontend
Buka terminal baru (terpisah dari terminal backend) dan masuk ke direktori Frontend.

Bash

cd Frontend
Instal semua dependency yang dibutuhkan.

Bash

pnpm install
Buat file .env.local dan isi NEXT_PUBLIC_MIDTRANS_CLIENT_KEY sesuai dengan konfigurasi Anda.

Jalankan server pengembangan frontend.

Bash

pnpm dev
Aplikasi frontend akan berjalan di http://localhost:3001 (atau port lain jika 3001 sudah digunakan).

Sekarang Anda dapat membuka http://localhost:3001 di browser Anda untuk melihat aplikasinya. Selamat mencoba dan selamat ngopi sambil ngoding! 🎉
