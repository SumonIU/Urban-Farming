# Submission Checklist

## Deliverables

- Source code repository
- Database schema and migrations in [prisma/schema.prisma](../prisma/schema.prisma) and [prisma/migrations/20260418120000_init/migration.sql](../prisma/migrations/20260418120000_init/migration.sql)
- Seeder script with 3 roles, 10 vendors, and 100 products in [prisma/seed.ts](../prisma/seed.ts)
- Swagger/OpenAPI docs at `/docs`
- Postman collection in [docs/postman-collection.json](postman-collection.json)
- API response and performance note in [docs/api-response-control.md](api-response-control.md)
- Benchmark note in [docs/benchmark-report.md](benchmark-report.md)

## Demo Accounts

- Admin: `admin@urbanfarm.local` / `Password123!`
- Customer: `customer@urbanfarm.local` / `Password123!`
- Vendor accounts: `vendor1@urbanfarm.local` through `vendor10@urbanfarm.local` / `Password123!`

## Quick Demo Flow

1. Start PostgreSQL and configure `.env`.
2. Run Prisma migrations and seed the database.
3. Start the API server.
4. Open `/docs` or import the Postman collection.
5. Demonstrate auth, vendor approval, produce listing, rental booking, order creation, community posting, and plant tracking.
