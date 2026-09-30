# Task Manager API

REST API sederhana untuk manajemen tugas (task), dilengkapi autentikasi, kategori, filter, dan pagination. Dibangun sebagai latihan fondasi backend development.

## Tech Stack
- Node.js + Express.js
- PostgreSQL (raw SQL query, tanpa ORM)
- JWT untuk autentikasi
- bcrypt untuk hashing password
- Jest + Supertest untuk automated testing

## Fitur
- Autentikasi user (register & login) dengan JWT
- CRUD task (create, read, update, delete)
- CRUD kategori tugas
- Setiap task/kategori terikat ke pemiliknya (ownership-based access control)
- Filter task berdasarkan status dan kategori
- Pagination
- Validasi input
- Error handling terpusat
- Automated test coverage

## Instalasi & Menjalankan Lokal

1. Clone repo ini
```bash
git clone https://github.com/hidayatrpl/TaskManager.git
cd TaskManager
```

2. Install dependency
```bash
npm install
```

3. Buat database PostgreSQL, lalu jalankan query berikut untuk membuat tabel:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

4. Buat file `.env` di root project:
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager_db
PORT=3000
JWT_SECRET=your_secret_key


5. Jalankan server
```bash
npm run dev
```
Server berjalan di `http://localhost:3000`

## Menjalankan Test
```bash
npm test
```
(Membutuhkan database testing terpisah, lihat konfigurasi `.env.test`)

## API Endpoints

### Auth
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/auth/register` | Registrasi user baru |
| POST | `/api/auth/login` | Login, mengembalikan JWT token |

### Tasks (butuh header `Authorization: Bearer <token>`)
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/tasks` | List semua task milik user (support `?status=`, `?category_id=`, `?page=`, `?limit=`) |
| GET | `/api/tasks/:id` | Detail satu task |
| POST | `/api/tasks` | Buat task baru |
| PUT | `/api/tasks/:id` | Update task (partial update didukung) |
| DELETE | `/api/tasks/:id` | Hapus task |

### Categories (butuh header `Authorization: Bearer <token>`)
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/categories` | List semua kategori milik user |
| GET | `/api/categories/:id` | Detail satu kategori |
| POST | `/api/categories` | Buat kategori baru |
| PUT | `/api/categories/:id` | Update kategori |
| DELETE | `/api/categories/:id` | Hapus kategori |

## Author
Hidayat — [GitHub](https://github.com/hidayatrpl)