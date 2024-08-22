# Sales Management API Express

**sales-management-api-express** adalah API yang dibangun menggunakan Express.js untuk mengelola penjualan, produk, pelanggan, dan laporan penjualan dalam sebuah sistem manajemen penjualan.

## Fitur Utama

- **Manajemen Produk**: API untuk menambah, mengedit, menghapus, dan melihat data produk.
- **Manajemen Supplier**: API untuk mengelola data Supplier dan riwayat pembelian.
- **Manajemen Pesanan**: API untuk membuat, memperbarui, dan mengelola pesanan penjualan dari markerplace.
- **Laporan Akuntansi**: API untuk mengelola Akun, Jurnal, Buku Besar, Neraca, Laba Rugi serta menghasilkan laporan setiap Akun berdasarkan berbagai kriteria.

## Teknologi yang Digunakan

- **Express.js**: Kerangka kerja web untuk Node.js.
- **MySQL**: Database SQL untuk penyimpanan data.
- **JWT**: Untuk otentikasi dan otorisasi pengguna.
- **dotenv**: Untuk mengelola variabel lingkungan.

## Instalasi

1. **Clone repository**:
    ```bash
    git clone https://github.com/Ridwanstbd/sales-management-api-express.git
    cd sales-management-api-express
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Konfigurasi lingkungan**:
    Buat file `.env` di root proyek dan tambahkan variabel lingkungan yang diperlukan.

    Konfigurasi Database Mysql
    Anda dapat import dari `.sales_management.sql`

    Contoh konfigurasi `.env`:
    ```
    PORT=3000
    DB_HOSTNAME = localhost
    DB_USERNAME = root
    DB_PASSWORD = 
    DB_NAME = sales_management
    JWT_SECRET=your_jwt_secret
    ```

4. **Jalankan aplikasi**:
    ```bash
    npm run dev
    ```
## Dokumentasi API

API ini didokumentasikan menggunakan Swagger. Anda dapat mengakses dokumentasi lengkap di endpoint berikut setelah aplikasi berjalan:
  - `GET /api-docs`: Mendapatkan daftar semua API.


## Struktur Proyek

- `app.js`: File utama aplikasi yang menginisialisasi Express.js dan middleware.
- `routes/`: Berisi definisi rute untuk API.
- `controllers/`: Berisi logika bisnis yang menghubungkan model dan rute.
- `middlewares/`: Berisi middleware untuk otentikasi dan validasi.
- `config/`: Berisi konfigurasi aplikasi dan database.

## Kontribusi

Jika Anda ingin berkontribusi, silakan fork repository ini, buat branch baru untuk fitur atau perbaikan Anda, dan kirimkan pull request. Kami menerima berbagai kontribusi seperti perbaikan bug, penambahan fitur, dan dokumentasi.

## Lisensi

Proyek ini dilisensikan di bawah lisensi [MIT](LICENSE).

## Kontak

Jika Anda memiliki pertanyaan atau saran, silakan hubungi kami di [ridwansetiobudi77@gmail.com](mailto:ridwansetiobudi77@gmail.com).
