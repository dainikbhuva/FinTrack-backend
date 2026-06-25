# FinTrack Backend

## Local setup (Windows Postgres on port 5432)

### `.env`

```env
PORT=3001
DATABASE_URL="postgresql://fintrack:admin@localhost:5432/fintrack?schema=public"
JWT_SECRET="development_secret"
```

### pgAdmin

| Field | Value |
|-------|--------|
| Host | `localhost` |
| Port | `5432` |
| Database | `fintrack` |
| Username | `fintrack` |
| Password | `admin` |

### Commands

```bash
npm run db:push
npm run db:seed
npm run dev
```

Login: `admin@gmail.com` / `Admin@123`

---

## Docker (optional)

If you use Docker instead, **stop Windows PostgreSQL first** (port 5432 conflict), then:

```bash
docker compose up -d
npm run db:push
npm run db:seed
```

Docker credentials: `fintrack` / `admin`

---

## Latest updates

- **Transaction model** added in Prisma with indexes on `date`, `merchant`, `category`, `type`, `date+type`, `date+category`
- **Seed script** generates **15,000 transactions** + admin user (`admin@gmail.com` / `Admin@123`)
- **APIs added** (JWT protected):
  - `GET /api/transactions` — pagination, filters (`q`, `category`, `type`, `dateFrom`, `dateTo`), sorting (`sortBy`, `sortOrder`), `pageSize` max 500
  - `GET /api/transactions/summary` — `totalIncome`, `totalExpense`, `net`, `byCategory` (calculated in DB)
- **Auth APIs**: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/profile`
- **MVC structure**: `routes` → `controllers` → `services` → `validators`
- **Validation fix**: empty `category=` / `type=` query params no longer return 400
- **Error format**: `{ error, details: [{ field, message }] }` for invalid input
- **Frontend wired** to real APIs via axios (debounced merchant search, loading/error states)

