# Explorer App

Monorepo aplikasi Explorer (backend + frontend) untuk menampilkan struktur folder/file dengan dukungan lazy loading dan arsitektur Service–Repository di backend.

## Tech Stack
- Backend: Bun, Elysia, Prisma, PostgreSQL
- Frontend: Vue 3, Vite, Pinia
- Infrastruktur Dev: Docker, docker-compose

## Struktur Monorepo
```
apps/
  backend/
    prisma/
    src/
    package.json
  frontend/
    src/
    vite.config.ts
    package.json
docker-compose.yml
```

## Quick Start
### Prasyarat
- Terinstall Bun
- Docker & docker-compose (opsional, untuk Postgres lokal cepat)

### 1) Menjalankan Database (Docker)
External volume dan network diperlukan karena didefinisikan sebagai `external: true` pada compose.

```bash
# Buat volume & network eksternal (sekali saja)
docker volume create explorer-postgres-data
docker network create explorer-net || true

# Jalankan Postgres
docker compose up -d
```

Credensial default (sesuai docker-compose):
- user: `explorer_user`
- password: `explorer_pass`
- db: `explorer_db`
- port: `5432`

### 2) Backend Setup
Di folder `apps/backend`:
```bash
# .env (contoh)
# DATABASE_URL format: postgres://USER:PASSWORD@HOST:PORT/DB
DATABASE_URL="postgres://explorer_user:explorer_pass@localhost:5432/explorer_db"
```

Generate Prisma Client dan migrasi skema:
```bash
bunx prisma generate
bunx prisma migrate dev
```

Jalankan server dev:
```bash
bun run dev
# Backend akan listen di http://localhost:3000
```

### 3) Frontend Setup
Di folder `apps/frontend`:
```bash
# .env (sudah tersedia contoh)
VITE_API_URL=http://localhost:3000
```
Jalankan dev server:
```bash
bun run dev
# Frontend dev server biasanya di http://localhost:5173
```

Catatan: Vite telah mengonfigurasi proxy untuk path `/api` → `http://localhost:3000`, sehingga pemanggilan `fetch('/api/v1/...')` saat dev akan diteruskan ke backend.

## Konfigurasi
- Backend
  - `.env` → `DATABASE_URL` wajib diisi
- Frontend
  - `.env` → `VITE_API_URL` digunakan oleh sebagian helper API
  - Proxy dev Vite untuk `/api` diatur pada `vite.config.ts`

## API Reference (Ringkas)
- GET `/v1/nodes` (opsional query: `parentId`)
  - Response: `{ data: Node[] }` (anak root jika `parentId = null`)
- GET `/v1/nodes/:id/children`
  - Response: `{ data: Node[] }` (anak langsung dari node `:id`)
- POST `/v1/nodes`
  - Body: `{ name: string, type?: 'FOLDER' | 'FILE', parentId?: number }`
  - Response: `{ data: Node }`
- GET `/v1/nodes/tree`
  - Response: `{ data: Node[] }` (array tree lengkap)

Struktur Node (inti):
```
{
  id: number,
  name: string,
  type: 'FOLDER' | 'FILE',
  parentId: number | null,
  createdAt: string,
  updatedAt: string
}
```
Frontend menambahkan properti UI seperti `_open` saat render, bukan bagian dari response backend.

## Arsitektur
- Backend
  - Routes: mendefinisikan endpoint (`/v1/nodes`, `/v1/nodes/:id/children`, `/v1/nodes/tree`, dll.)
  - Service: orkestrasi logic, membangun tree (rekursif) dari seluruh node saat perlu
  - Repository: akses data ke Prisma (findAll, findChildren, create, dsb.)
  - Utils: `getNodeTree` untuk membentuk struktur tree dari list node flat
- Frontend
  - Components: `FolderTree`, `FolderNode` (render tree, toggle expand)
  - Store (Pinia): state tree + `loadTree()` untuk initial load dari `/v1/nodes/tree`
  - Composables: `useExplorer` menyediakan `loadChildren()` untuk lazy-load anak saat node di-expand (fetch `/v1/nodes/:id/children` bila belum dimuat)

## Flow
1. Initial load: store memanggil `/v1/nodes/tree` dan menampilkan struktur awal.
2. Expand node: komponen memanggil `loadChildren(node)`; jika `node` baru di-expand dan `children` belum ada, frontend fetch ke `/v1/nodes/:id/children` (atau `/api/v1/nodes/:id/children` saat dev) lalu set `node.children` dan `_open` state.