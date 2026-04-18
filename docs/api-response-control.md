# API Response and Performance Strategy

The API uses a consistent JSON envelope for every endpoint:

```json
{
  "success": true,
  "message": "...",
  "data": {},
  "meta": {},
  "error": null
}
```

This keeps success and error responses predictable for frontend clients and API consumers. Validation errors, authorization failures, and not-found cases are returned with proper HTTP status codes and the same envelope shape.

Performance strategy:

- Pagination is applied to listings for produce, orders, community posts, rental spaces, and plants.
- Rate limiting is enabled for registration, login, and certification submission.
- Prisma indexes are added on common filter columns such as category, status, location, and date fields.
- Compression and Helmet are enabled at the app layer.
- Real-time plant updates are pushed through Socket.IO so clients do not need to poll continuously.
- A benchmark script is included to capture p50, p95, p99, and throughput once PostgreSQL is running.
