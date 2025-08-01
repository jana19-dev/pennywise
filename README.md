# Pennywise

## 💰 Description

**Pennywise** is a personal and shared budgeting application that helps users track expenses, manage shared transactions, and settle balances flexibly. It supports multi-user collaboration, monthly budgeting, and detailed financial reporting.

## 🧱 Tech Stack

- [SvelteKit](https://kit.svelte.dev/)
- [Prisma](https://www.prisma.io/)
- PostgreSQL
- Redis (for real-time updates)
- Docker / Docker Compose

---

## ⚙️ Environment Variables

Create a `.env` file and add the following:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/pennywise
REDIS_URL=redis://localhost:6379
```

---

## 🚀 Development

Use the included Docker Compose setup to run the app and all dependencies locally:

```bash
docker compose run --service-ports --rm app
npm run dev
```

- The app runs on **port 5173** by default.
- PostgreSQL and Redis services are included and auto-started.

---

## 🧪 Prisma (DB)

If you make changes to the Prisma schema, run:

```bash
npm run prisma
```

---

## 🔧 Linting and Formatting

Husky is configured to run format and lint checks on commits for staged files. You can also run it manually:

```bash
npm run lint:fix
```

---

## 🛠️ Building the Application

The app uses the [adapter-node](https://kit.svelte.dev/docs/adapter-node) and Dockerfile for server deployment:
