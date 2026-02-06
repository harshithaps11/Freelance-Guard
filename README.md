# Freelance Guard

Production-ready Next.js (App Router) app for freelancers to track time, manage scope, and invoice clients.

## Quick start

1. Copy environment

```
cp .env.example .env
```

2. Install deps

```
npm i
```

3. Generate client and run migrations

```
npm run prisma:generate
npx prisma migrate dev --name init
```

4. Seed database

```
npm run db:seed
```

5. Start

```
npm run dev
```

## Environment

See `.env.example` for variables. In dev, you can use SQLite by setting `DATABASE_PROVIDER="sqlite"` and `DATABASE_URL="file:./dev.db"`. For production, use Postgres.

## Deploy

- Vercel recommended. Set env vars and `DATABASE_URL` for your managed DB. Run `npx prisma migrate deploy` on build or via `npm run prisma:migrate`.


