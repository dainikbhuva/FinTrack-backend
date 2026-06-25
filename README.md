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
