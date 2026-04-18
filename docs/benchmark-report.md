# Benchmark Report

Environment: local development server with seeded PostgreSQL database.

Benchmark target:

- `GET /health`

Measured with:

```bash
BENCHMARK_URL=http://localhost:4000/health npm run benchmark
```

Observed results:

- p50 latency: 6ms
- p90 latency: 11ms
- p97.5 latency: 16ms
- p99 latency: 18ms
- average throughput: 1,416,524.8 bytes/sec

Additional manual autocannon run confirmed similar results:

- p50 latency: 5ms
- p90 latency: 9ms
- p97.5 latency: 13ms
- p99 latency: 16ms
- average throughput: 1,502,310.4 bytes/sec

Summary:

- The health endpoint is responsive and stable under local load.
- The measured latency is comfortably within the expected baseline for a local Node + Express API.
- For a fuller report, repeat the same approach against `POST /auth/login` and `GET /produce?page=1&limit=20` after the server is running.
