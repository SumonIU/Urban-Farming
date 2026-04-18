import autocannon from "autocannon";

const target = process.env.BENCHMARK_URL ?? "http://localhost:4000/health";

const result = await autocannon({
  url: target,
  connections: 10,
  duration: 10,
});

console.log(
  JSON.stringify(
    {
      url: target,
      requests: {
        average: result.requests.average,
        p50: result.latency.p50,
        p95: result.latency.p95,
        p99: result.latency.p99,
      },
      throughput: {
        average: result.throughput.average,
      },
    },
    null,
    2,
  ),
);
