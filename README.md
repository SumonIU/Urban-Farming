# Urban Farming Backend

Express.js + Prisma + PostgreSQL backend for an interactive urban farming platform.

## Priority Delivery Plan

1. Core foundation: Prisma schema, migrations, environment config, API response format, error handling.
2. Security: authentication, RBAC, rate limiting, vendor/customer/admin guards.
3. Business modules: farm rentals, marketplace, sustainability verification, orders, community forum, plant tracking.
4. Platform features: pagination, Swagger docs, Socket.IO real-time updates, seeding, benchmark note.

## Documentation

- API docs: `/docs`
- Project structure: [docs/project-structure.md](docs/project-structure.md)
- Postman collection: [docs/postman-collection.json](docs/postman-collection.json)
- Submission checklist: [docs/submission-checklist.md](docs/submission-checklist.md)
- Response and performance note: [docs/api-response-control.md](docs/api-response-control.md)
- Benchmark note: [docs/benchmark-report.md](docs/benchmark-report.md)

## Scripts

- `npm run dev`
- `npm run build`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run db:seed`
- `npm run benchmark`

## Setup

Copy `.env.example` to `.env`, configure PostgreSQL, then run Prisma migrations and seed data.
