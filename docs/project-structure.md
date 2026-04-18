# Project Structure

This project follows a module-based backend architecture.

## Root Structure

```text
Urban Farming/
├── src/
├── prisma/
├── docs/
├── scripts/
├── dist/
├── package.json
├── tsconfig.json
└── README.md
```

## Source Structure

```text
src/
├── app.ts
├── server.ts
├── config/
├── constants/
├── middleware/
├── modules/
├── types/
└── utils/
```

## Modules Structure

```text
src/modules/
├── routes.ts
├── auth/
├── vendor/
├── produce/
├── rental/
├── order/
├── community/
├── tracking/
└── admin/
```

Each module contains the same internal layout:

```text
<module>/
├── controller.ts
├── service.ts
├── query.ts
├── validator.ts
├── routes.ts
└── index.ts
```

## Module Responsibilities

- auth: registration, login, current user profile
- vendor: vendor approvals and sustainability certifications
- produce: marketplace produce CRUD and listing filters
- rental: rental space listing, creation, and booking
- order: order creation and order listing by role
- community: community posts listing and creation
- tracking: plant tracking, health updates, socket event binding
- admin: user management and activity summary

## Routing Flow

```text
app.ts -> modules/routes.ts -> modules/<module>/routes.ts -> controller.ts -> service.ts -> query.ts
```

