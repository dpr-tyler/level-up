import { Challenge } from '@/types/challenge';

export const challenge: Challenge = {
  slug: 'design-rate-limiter',
  title: 'Design Rate Limiter',
  description:
    'Design a distributed rate limiting system that protects APIs from abuse, enforces usage quotas, and handles 10 million requests per second with minimal latency overhead.',
  icon: '🚦',
  difficulty: 'intermediate',
  requirements: {
    scale: '10M requests/sec',
    latency: '<1ms overhead',
    availability: '99.999%',
    storage: 'Minimal - counter data',
  },
  steps: [
    {
      id: 'rl-algorithm',
      title: 'Algorithm Choice',
      description:
        'Which rate limiting algorithm should you use to balance accuracy, memory efficiency, and burst handling?',
      category: 'Core Algorithm',
      options: [
        {
          id: 'rl-algo-sliding-window-log',
          label: 'Sliding Window Counter',
          description:
            'Combine fixed window counters with a weighted overlap calculation. Use the current window count plus a proportional share of the previous window to approximate a true sliding window.',
          score: 10,
          feedback:
            'The sliding window counter provides excellent accuracy with minimal memory (just two counters per key). It smooths out the boundary spike problem of fixed windows while staying O(1) in time and space.',
          diagramEffect: {
            addNodes: [
              { id: 'rl-client', type: 'client', label: 'API Clients', x: 100, y: 300 },
              { id: 'rl-limiter', type: 'firewall', label: 'Rate Limiter', x: 350, y: 300 },
              { id: 'rl-app', type: 'server', label: 'API Servers', x: 600, y: 300 },
            ],
            addConnections: [
              { from: 'rl-client', to: 'rl-limiter', label: 'Request' },
              { from: 'rl-limiter', to: 'rl-app', label: 'Allow / Deny' },
            ],
          },
        },
        {
          id: 'rl-algo-token-bucket',
          label: 'Token Bucket',
          description:
            'Each client has a bucket that fills with tokens at a fixed rate. Each request consumes a token. Requests are rejected when the bucket is empty.',
          score: 7,
          feedback:
            'Token bucket is widely used and handles bursts well (up to the bucket size). However, it requires tracking the last refill time and token count per key, which is slightly more complex.',
          diagramEffect: {
            addNodes: [
              { id: 'rl-client', type: 'client', label: 'API Clients', x: 100, y: 300 },
              { id: 'rl-limiter', type: 'firewall', label: 'Rate Limiter\n(Token Bucket)', x: 350, y: 300 },
              { id: 'rl-app', type: 'server', label: 'API Servers', x: 600, y: 300 },
            ],
            addConnections: [
              { from: 'rl-client', to: 'rl-limiter', label: 'Request' },
              { from: 'rl-limiter', to: 'rl-app', label: 'Allow / Deny' },
            ],
          },
        },
        {
          id: 'rl-algo-fixed-window',
          label: 'Fixed Window Counter',
          description: 'Count requests in fixed time windows (e.g., per minute). Reset the counter at the start of each window.',
          score: 4,
          feedback:
            'Fixed windows are simple but have a boundary problem: a client can send 2x the rate limit across a window boundary (burst at end of one window, burst at start of the next).',
          diagramEffect: {
            addNodes: [
              { id: 'rl-client', type: 'client', label: 'API Clients', x: 100, y: 300 },
              { id: 'rl-limiter', type: 'firewall', label: 'Rate Limiter\n(Fixed Window)', x: 350, y: 300 },
              { id: 'rl-app', type: 'server', label: 'API Servers', x: 600, y: 300 },
            ],
            addConnections: [
              { from: 'rl-client', to: 'rl-limiter', label: 'Request' },
              { from: 'rl-limiter', to: 'rl-app', label: 'Allow / Deny' },
            ],
          },
        },
        {
          id: 'rl-algo-leaky-bucket',
          label: 'Leaky Bucket',
          description: 'Requests enter a queue (bucket) and are processed at a fixed rate. If the queue is full, new requests are dropped.',
          score: 4,
          feedback:
            'Leaky bucket enforces a strict output rate which is great for smoothing traffic. However, it requires a queue per client, uses more memory, and adds queuing latency that may exceed the 1ms target.',
          diagramEffect: {
            addNodes: [
              { id: 'rl-client', type: 'client', label: 'API Clients', x: 100, y: 300 },
              { id: 'rl-limiter', type: 'firewall', label: 'Rate Limiter\n(Leaky Bucket)', x: 350, y: 300 },
              { id: 'rl-app', type: 'server', label: 'API Servers', x: 600, y: 300 },
            ],
            addConnections: [
              { from: 'rl-client', to: 'rl-limiter', label: 'Enqueue' },
              { from: 'rl-limiter', to: 'rl-app', label: 'Fixed-rate drain' },
            ],
          },
        },
      ],
    },
    {
      id: 'rl-storage',
      title: 'Storage for Counters',
      description:
        'Where should you store the rate limit counters to achieve <1ms overhead across all servers?',
      category: 'Data Storage',
      options: [
        {
          id: 'rl-storage-redis-cluster',
          label: 'Redis Cluster with Lua Scripts',
          description:
            'Store counters in a Redis Cluster. Use Lua scripts for atomic check-and-increment operations to prevent race conditions. Pipeline commands for throughput.',
          score: 10,
          feedback:
            'Redis delivers sub-millisecond operations and Lua scripts ensure atomicity. The cluster auto-shards keys across nodes to handle 10M req/sec. Pipelining further reduces round trips.',
          diagramEffect: {
            addNodes: [
              { id: 'rl-redis', type: 'cache', label: 'Redis Cluster\n(Counters)', x: 350, y: 100 },
            ],
            addConnections: [
              { from: 'rl-limiter', to: 'rl-redis', label: 'Atomic INCR + TTL' },
            ],
          },
        },
        {
          id: 'rl-storage-local-memory',
          label: 'Local In-Memory Store',
          description: 'Store counters in each server\'s local memory for the fastest possible access with no network hop.',
          score: 7,
          feedback:
            'Local memory gives the lowest latency but each server counts independently. A client hitting different servers through the load balancer can exceed the global rate limit by N times (where N is server count).',
          diagramEffect: {
            addConnections: [
              { from: 'rl-limiter', to: 'rl-app', label: 'Local counters' },
            ],
          },
        },
        {
          id: 'rl-storage-database',
          label: 'Database Table',
          description: 'Store counters in a SQL database with indexed lookups by client ID and time window.',
          score: 2,
          feedback:
            'Database round trips take 1-5ms minimum, immediately exceeding the <1ms budget. At 10M req/sec the database would need to handle 10M counter updates per second, which is infeasible.',
          diagramEffect: {
            addNodes: [
              { id: 'rl-counter-db', type: 'database', label: 'Counter DB', x: 350, y: 100 },
            ],
            addConnections: [
              { from: 'rl-limiter', to: 'rl-counter-db', label: 'Query + Update' },
            ],
          },
        },
      ],
    },
    {
      id: 'rl-distributed',
      title: 'Distributed Coordination',
      description:
        'How should you coordinate rate limiting across multiple data centers and server instances?',
      category: 'Scalability',
      options: [
        {
          id: 'rl-dist-hybrid',
          label: 'Hybrid: Local + Periodic Sync',
          description:
            'Each server enforces limits locally using its share of the global quota. Periodically sync counters to Redis to detect clients spread across servers. Adjust local quotas based on sync data.',
          score: 10,
          feedback:
            'The hybrid approach gives sub-millisecond local decisions while periodic sync (every 100ms) catches distributed abuse. Slight over-allowance during sync gaps is acceptable for the latency benefit.',
          diagramEffect: {
            addNodes: [
              { id: 'rl-sync-svc', type: 'server', label: 'Sync Service', x: 600, y: 100 },
            ],
            addConnections: [
              { from: 'rl-limiter', to: 'rl-sync-svc', label: 'Periodic sync', style: 'dashed' },
              { from: 'rl-sync-svc', to: 'rl-redis', label: 'Aggregate counters' },
            ],
          },
        },
        {
          id: 'rl-dist-central-redis',
          label: 'Centralized Redis for Every Request',
          description: 'Every rate limit check goes through the central Redis cluster, ensuring perfectly accurate global counts.',
          score: 7,
          feedback:
            'Central Redis gives perfect accuracy but every request requires a network round trip. At 10M req/sec this puts enormous load on Redis and network latency may exceed 1ms from distant servers.',
          diagramEffect: {
            addConnections: [
              { from: 'rl-limiter', to: 'rl-redis', label: 'Every request' },
            ],
          },
        },
        {
          id: 'rl-dist-none',
          label: 'No Coordination (Independent Servers)',
          description: 'Each server independently enforces the full rate limit. No cross-server communication.',
          score: 2,
          feedback:
            'Without coordination, a client can multiply their effective rate limit by the number of servers. With 100 servers, a 100 req/sec limit becomes 10,000 req/sec in practice.',
          diagramEffect: {
            addConnections: [
              { from: 'rl-limiter', to: 'rl-app', label: 'Independent limits' },
            ],
          },
        },
      ],
    },
    {
      id: 'rl-rules',
      title: 'Rule Configuration',
      description:
        'How should rate limit rules (per user, per API, per IP) be defined and applied?',
      category: 'Configuration',
      options: [
        {
          id: 'rl-rules-config-svc',
          label: 'Dynamic Rules Service with Local Cache',
          description:
            'A rules service stores rate limit configurations in a database. Rate limiters cache rules locally and refresh on a short interval or via pub/sub notifications when rules change.',
          score: 10,
          feedback:
            'A dynamic rules service lets you update limits without redeployment. Local caching means rule lookups are instant, and pub/sub propagation ensures changes take effect within seconds.',
          diagramEffect: {
            addNodes: [
              { id: 'rl-rules-svc', type: 'server', label: 'Rules Service', x: 150, y: 100 },
              { id: 'rl-rules-db', type: 'database', label: 'Rules DB', x: 150, y: 500 },
            ],
            addConnections: [
              { from: 'rl-limiter', to: 'rl-rules-svc', label: 'Fetch rules (cached)', style: 'dashed' },
              { from: 'rl-rules-svc', to: 'rl-rules-db', label: 'Load rules' },
            ],
          },
        },
        {
          id: 'rl-rules-config-file',
          label: 'Static Configuration Files',
          description: 'Define rate limit rules in YAML/JSON files deployed with the application. Changes require redeployment.',
          score: 7,
          feedback:
            'Config files are simple and version-controlled but cannot respond quickly to abuse. Changing a rate limit requires a code review, build, and deploy cycle.',
          diagramEffect: {
            addConnections: [
              { from: 'rl-limiter', to: 'rl-app', label: 'Read config file' },
            ],
          },
        },
        {
          id: 'rl-rules-hardcoded',
          label: 'Hardcoded Limits',
          description: 'Embed rate limit values directly in the application code.',
          score: 2,
          feedback:
            'Hardcoded limits are inflexible and dangerous. Responding to a DDoS attack requires changing code, testing, and deploying, which takes far too long during an active incident.',
          diagramEffect: {
            addConnections: [
              { from: 'rl-limiter', to: 'rl-app', label: 'Hardcoded in code' },
            ],
          },
        },
      ],
    },
    {
      id: 'rl-response',
      title: 'Response Handling',
      description:
        'How should the rate limiter respond to clients when their requests are throttled?',
      category: 'API Design',
      options: [
        {
          id: 'rl-response-429-headers',
          label: '429 Status + Rate Limit Headers',
          description:
            'Return HTTP 429 Too Many Requests with headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, and Retry-After. Include a JSON body explaining the limit.',
          score: 10,
          feedback:
            'Standard 429 responses with rate limit headers follow industry best practices (RFC 6585). Clients can implement intelligent retry logic based on the Retry-After header, reducing retry storms.',
          diagramEffect: {
            addNodes: [
              { id: 'rl-lb', type: 'loadBalancer', label: 'Load Balancer', x: 350, y: 500 },
            ],
            addConnections: [
              { from: 'rl-client', to: 'rl-lb', label: 'Request' },
              { from: 'rl-lb', to: 'rl-limiter', label: 'Check limit' },
              { from: 'rl-limiter', to: 'rl-client', label: '429 + Retry-After', style: 'dashed' },
            ],
          },
        },
        {
          id: 'rl-response-silent-drop',
          label: 'Silent Drop',
          description: 'Silently drop excess requests without any response to the client.',
          score: 2,
          feedback:
            'Silent drops leave clients confused, cause timeouts, and make debugging nearly impossible. Clients cannot distinguish rate limiting from server failures, leading to aggressive retries.',
          diagramEffect: {
            addConnections: [
              { from: 'rl-limiter', to: 'rl-client', label: 'No response', style: 'dashed' },
            ],
          },
        },
        {
          id: 'rl-response-queue',
          label: 'Queue and Delay',
          description: 'Queue excess requests and process them when capacity is available, adding latency instead of rejecting.',
          score: 4,
          feedback:
            'Queuing avoids rejections but holds server resources for delayed requests. Under sustained overload, queues grow unbounded, memory exhausts, and all requests fail.',
          diagramEffect: {
            addNodes: [
              { id: 'rl-overflow-queue', type: 'queue', label: 'Overflow Queue', x: 350, y: 500 },
            ],
            addConnections: [
              { from: 'rl-limiter', to: 'rl-overflow-queue', label: 'Queue excess' },
              { from: 'rl-overflow-queue', to: 'rl-app', label: 'Delayed processing' },
            ],
          },
        },
      ],
    },
    {
      id: 'rl-monitoring',
      title: 'Monitoring & Alerting',
      description:
        'How should you monitor the rate limiter and detect both abuse and misconfigurations?',
      category: 'Observability',
      options: [
        {
          id: 'rl-monitor-metrics-pipeline',
          label: 'Real-Time Metrics Pipeline',
          description:
            'Emit metrics (allowed/denied counts, latency percentiles, top offenders) to a time-series database (Prometheus). Set up Grafana dashboards and PagerDuty alerts for anomalies.',
          score: 10,
          feedback:
            'A full metrics pipeline provides visibility into rate limiter health, abuse patterns, and impact on legitimate users. Top-offender tracking helps identify DDoS sources in real time.',
          diagramEffect: {
            addNodes: [
              { id: 'rl-metrics', type: 'database', label: 'Metrics DB\n(Prometheus)', x: 600, y: 500 },
              { id: 'rl-dashboard', type: 'server', label: 'Monitoring\nDashboard', x: 800, y: 500 },
            ],
            addConnections: [
              { from: 'rl-limiter', to: 'rl-metrics', label: 'Emit metrics' },
              { from: 'rl-app', to: 'rl-metrics', label: 'App metrics' },
              { from: 'rl-metrics', to: 'rl-dashboard', label: 'Visualize + Alert' },
            ],
          },
        },
        {
          id: 'rl-monitor-logging',
          label: 'Log-Based Monitoring',
          description: 'Log all rate limit decisions and use log aggregation tools (ELK stack) for analysis and alerting.',
          score: 7,
          feedback:
            'Logs provide detailed records but querying logs at 10M req/sec is expensive and slow. Real-time dashboards from logs lag behind, making them less useful during active incidents.',
          diagramEffect: {
            addNodes: [
              { id: 'rl-log-store', type: 'storage', label: 'Log Storage\n(ELK)', x: 600, y: 500 },
            ],
            addConnections: [
              { from: 'rl-limiter', to: 'rl-log-store', label: 'Ship logs' },
            ],
          },
        },
        {
          id: 'rl-monitor-none',
          label: 'No Dedicated Monitoring',
          description: 'Rely on general application monitoring to detect rate limiting issues.',
          score: 2,
          feedback:
            'Without rate limiter-specific monitoring you cannot distinguish between a misconfigured limit blocking legitimate traffic and a real attack. You would only notice problems when users complain.',
          diagramEffect: {
            addConnections: [
              { from: 'rl-app', to: 'rl-limiter', label: 'No visibility', style: 'dashed' },
            ],
          },
        },
      ],
    },
  ],
};
