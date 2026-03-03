import { Challenge } from '@/types/challenge';

export const challenge: Challenge = {
  slug: 'design-url-shortener',
  title: 'Design URL Shortener',
  description:
    'Design a URL shortening service like bit.ly that can generate short links, redirect users efficiently, and track analytics at scale.',
  icon: '🔗',
  difficulty: 'intermediate',
  requirements: {
    scale: '100M URLs/month',
    latency: '<50ms redirect',
    availability: '99.9%',
    storage: '10TB over 5 years',
  },
  steps: [
    {
      id: 'url-generation',
      title: 'URL Generation Approach',
      description:
        'How should you generate unique short URL codes from long URLs?',
      category: 'Core Algorithm',
      options: [
        {
          id: 'url-gen-base62-counter',
          label: 'Base62 Encoding with Distributed Counter',
          description:
            'Use a distributed ID generator (Snowflake-like) to produce unique IDs and encode them in base62 (a-z, A-Z, 0-9) to create 7-character short codes.',
          score: 10,
          feedback:
            'Base62 with distributed ID generation guarantees uniqueness without collision checks. 7 characters give 62^7 = 3.5 trillion possible URLs, far exceeding requirements.',
          diagramEffect: {
            addNodes: [
              { id: 'url-client', type: 'client', label: 'Client', x: 100, y: 300 },
              { id: 'url-lb', type: 'loadBalancer', label: 'Load Balancer', x: 300, y: 300 },
              { id: 'url-app', type: 'server', label: 'URL Service', x: 500, y: 300 },
              { id: 'url-id-gen', type: 'server', label: 'ID Generator\n(Snowflake)', x: 500, y: 100 },
            ],
            addConnections: [
              { from: 'url-client', to: 'url-lb', label: 'HTTPS' },
              { from: 'url-lb', to: 'url-app', label: 'Route' },
              { from: 'url-app', to: 'url-id-gen', label: 'Get unique ID' },
            ],
          },
        },
        {
          id: 'url-gen-md5-hash',
          label: 'MD5 Hash Truncation',
          description:
            'Hash the long URL with MD5 and take the first 7 characters of the base62-encoded hash.',
          score: 7,
          feedback:
            'Hashing is simple but truncation creates collision risk. You need collision detection and retry logic, which adds latency and complexity at 100M URLs/month.',
          diagramEffect: {
            addNodes: [
              { id: 'url-client', type: 'client', label: 'Client', x: 100, y: 300 },
              { id: 'url-lb', type: 'loadBalancer', label: 'Load Balancer', x: 300, y: 300 },
              { id: 'url-app', type: 'server', label: 'URL Service', x: 500, y: 300 },
            ],
            addConnections: [
              { from: 'url-client', to: 'url-lb', label: 'HTTPS' },
              { from: 'url-lb', to: 'url-app', label: 'Route' },
            ],
          },
        },
        {
          id: 'url-gen-random',
          label: 'Random String Generation',
          description: 'Generate random 7-character strings and check the database for collisions before saving.',
          score: 4,
          feedback:
            'Random generation requires a database lookup on every creation to check for collisions. As the URL space fills, collision probability and retry overhead increase.',
          diagramEffect: {
            addNodes: [
              { id: 'url-client', type: 'client', label: 'Client', x: 100, y: 300 },
              { id: 'url-lb', type: 'loadBalancer', label: 'Load Balancer', x: 300, y: 300 },
              { id: 'url-app', type: 'server', label: 'URL Service', x: 500, y: 300 },
            ],
            addConnections: [
              { from: 'url-client', to: 'url-lb', label: 'HTTPS' },
              { from: 'url-lb', to: 'url-app', label: 'Route' },
            ],
          },
        },
        {
          id: 'url-gen-sequential',
          label: 'Auto-increment Counter',
          description: 'Use a single auto-incrementing database counter and base62-encode the value.',
          score: 2,
          feedback:
            'A single counter creates a bottleneck and single point of failure. Sequential IDs are also predictable, making it easy to enumerate all stored URLs.',
          diagramEffect: {
            addNodes: [
              { id: 'url-client', type: 'client', label: 'Client', x: 100, y: 300 },
              { id: 'url-app', type: 'server', label: 'URL Service', x: 500, y: 300 },
            ],
            addConnections: [
              { from: 'url-client', to: 'url-app', label: 'HTTPS' },
            ],
          },
        },
      ],
    },
    {
      id: 'url-database',
      title: 'Database Choice',
      description:
        'Which database should you use to store URL mappings with high read throughput for redirects?',
      category: 'Data Storage',
      options: [
        {
          id: 'url-db-nosql',
          label: 'NoSQL Key-Value Store (DynamoDB)',
          description:
            'Use a key-value store with the short code as the key and the long URL as the value. Simple, fast lookups with auto-scaling.',
          score: 10,
          feedback:
            'URL shortening is a textbook key-value use case. DynamoDB provides single-digit millisecond reads at any scale with automatic partitioning across the 10TB dataset.',
          diagramEffect: {
            addNodes: [
              { id: 'url-db', type: 'database', label: 'URL Database\n(DynamoDB)', x: 700, y: 300 },
            ],
            addConnections: [
              { from: 'url-app', to: 'url-db', label: 'Read/Write' },
            ],
          },
        },
        {
          id: 'url-db-postgres',
          label: 'PostgreSQL with Read Replicas',
          description:
            'Use PostgreSQL with an indexed short_code column and read replicas to handle redirect traffic.',
          score: 7,
          feedback:
            'PostgreSQL works well and offers flexibility for analytics queries. Read replicas help with redirect throughput, but scaling writes to 100M/month requires careful partitioning.',
          diagramEffect: {
            addNodes: [
              { id: 'url-db', type: 'database', label: 'URL Database\n(PostgreSQL)', x: 700, y: 300 },
            ],
            addConnections: [
              { from: 'url-app', to: 'url-db', label: 'Read/Write' },
            ],
          },
        },
        {
          id: 'url-db-redis-only',
          label: 'Redis as Primary Store',
          description: 'Store all URL mappings in Redis for the fastest possible lookups.',
          score: 4,
          feedback:
            'Redis gives sub-millisecond reads but storing 10TB of URLs in memory is extremely expensive. Redis is better suited as a caching layer in front of a persistent store.',
          diagramEffect: {
            addNodes: [
              { id: 'url-db', type: 'cache', label: 'Redis\n(Primary Store)', x: 700, y: 300 },
            ],
            addConnections: [
              { from: 'url-app', to: 'url-db', label: 'Read/Write' },
            ],
          },
        },
      ],
    },
    {
      id: 'url-caching',
      title: 'Caching Layer',
      description:
        'How should you cache URL mappings to achieve <50ms redirect latency?',
      category: 'Performance',
      options: [
        {
          id: 'url-cache-redis-lru',
          label: 'Redis Cache with LRU Eviction',
          description:
            'Cache frequently accessed URL mappings in Redis with an LRU eviction policy. Most redirects hit the cache; only cache misses go to the database.',
          score: 10,
          feedback:
            'An LRU Redis cache exploits the Pareto principle: a small percentage of URLs receive the vast majority of traffic. Cache hit rates above 90% easily meet the 50ms target.',
          diagramEffect: {
            addNodes: [
              { id: 'url-cache', type: 'cache', label: 'URL Cache\n(Redis)', x: 600, y: 150 },
            ],
            addConnections: [
              { from: 'url-app', to: 'url-cache', label: 'Check cache first' },
              { from: 'url-cache', to: 'url-db', label: 'Miss → DB lookup', style: 'dashed' },
            ],
          },
        },
        {
          id: 'url-cache-local',
          label: 'Local In-Memory Cache Only',
          description:
            'Cache URL mappings in each application server\'s local memory using an LRU map.',
          score: 7,
          feedback:
            'Local caching avoids network hops but each server maintains its own cache, leading to lower overall hit rates and wasted memory with duplicate entries across servers.',
          diagramEffect: {
            addConnections: [
              { from: 'url-app', to: 'url-db', label: 'Read with local cache' },
            ],
          },
        },
        {
          id: 'url-cache-none',
          label: 'No Cache (Direct DB Reads)',
          description: 'Read directly from the database for every redirect, relying on database performance.',
          score: 2,
          feedback:
            'Without caching, every redirect requires a database round trip. At peak traffic this overloads the database and latency easily exceeds 50ms.',
          diagramEffect: {
            addConnections: [
              { from: 'url-app', to: 'url-db', label: 'Direct read every time' },
            ],
          },
        },
      ],
    },
    {
      id: 'url-api-design',
      title: 'API Design',
      description:
        'How should the URL shortener API be designed for creating and resolving short URLs?',
      category: 'API Design',
      options: [
        {
          id: 'url-api-rest-301',
          label: 'REST API with 301/302 Redirects',
          description:
            'POST /api/urls to create short URLs. GET /{shortCode} returns a 302 redirect to the original URL. Use 301 for permanent links and 302 for trackable links.',
          score: 10,
          feedback:
            'Using 302 (temporary redirect) for the default allows tracking every click. Offering optional 301 (permanent redirect) for users who prioritize speed over analytics is ideal.',
          diagramEffect: {
            addNodes: [
              { id: 'url-dns', type: 'dns', label: 'DNS\n(short.url)', x: 100, y: 100 },
            ],
            addConnections: [
              { from: 'url-client', to: 'url-dns', label: 'Resolve' },
              { from: 'url-dns', to: 'url-lb', label: 'Route to LB' },
            ],
          },
        },
        {
          id: 'url-api-rest-only-301',
          label: 'REST API with 301 Only',
          description:
            'Always return 301 (permanent redirect) so browsers cache the redirect and never hit the server again.',
          score: 4,
          feedback:
            'Permanent redirects reduce server load but prevent click tracking. Once a browser caches the redirect, you lose visibility into that user\'s clicks entirely.',
          diagramEffect: {
            addNodes: [
              { id: 'url-dns', type: 'dns', label: 'DNS', x: 100, y: 100 },
            ],
            addConnections: [
              { from: 'url-client', to: 'url-dns', label: 'Resolve' },
            ],
          },
        },
        {
          id: 'url-api-graphql',
          label: 'GraphQL API',
          description: 'Use GraphQL for both URL creation and resolution.',
          score: 2,
          feedback:
            'GraphQL adds unnecessary overhead for such a simple API. URL shortening is a basic key-value operation that does not benefit from GraphQL\'s query flexibility.',
          diagramEffect: {
            addConnections: [
              { from: 'url-client', to: 'url-lb', label: 'GraphQL' },
            ],
          },
        },
      ],
    },
    {
      id: 'url-analytics',
      title: 'Analytics Tracking',
      description:
        'How should you track click analytics (who, when, where) for each short URL?',
      category: 'Features',
      options: [
        {
          id: 'url-analytics-async-queue',
          label: 'Async Event Queue + Analytics DB',
          description:
            'On each redirect, publish a click event to a message queue (Kafka). A consumer aggregates events and writes to an analytics database (ClickHouse) for dashboards.',
          score: 10,
          feedback:
            'Async analytics ensures click tracking never slows down the redirect path. Kafka buffers events during traffic spikes and ClickHouse is optimized for time-series analytics queries.',
          diagramEffect: {
            addNodes: [
              { id: 'url-event-queue', type: 'queue', label: 'Click Events\n(Kafka)', x: 500, y: 500 },
              { id: 'url-analytics-db', type: 'database', label: 'Analytics DB\n(ClickHouse)', x: 700, y: 500 },
            ],
            addConnections: [
              { from: 'url-app', to: 'url-event-queue', label: 'Publish click event' },
              { from: 'url-event-queue', to: 'url-analytics-db', label: 'Aggregate & store' },
            ],
          },
        },
        {
          id: 'url-analytics-sync-db',
          label: 'Synchronous Database Write',
          description: 'Write a click record to the database synchronously on every redirect.',
          score: 4,
          feedback:
            'Synchronous writes add latency to every redirect. At 100M redirects/month, the analytics table becomes a write bottleneck and slows down the user-facing redirect.',
          diagramEffect: {
            addNodes: [
              { id: 'url-analytics-db', type: 'database', label: 'Analytics DB', x: 700, y: 500 },
            ],
            addConnections: [
              { from: 'url-app', to: 'url-analytics-db', label: 'Sync write' },
            ],
          },
        },
        {
          id: 'url-analytics-log-file',
          label: 'Log File Processing',
          description: 'Write click data to log files and process them in batch jobs every hour.',
          score: 7,
          feedback:
            'Log-based analytics are simple and do not affect redirect latency, but analytics dashboards lag by up to an hour. For real-time insights, event streaming is better.',
          diagramEffect: {
            addNodes: [
              { id: 'url-analytics-db', type: 'database', label: 'Analytics DB', x: 700, y: 500 },
            ],
            addConnections: [
              { from: 'url-app', to: 'url-analytics-db', label: 'Batch process logs', style: 'dashed' },
            ],
          },
        },
      ],
    },
    {
      id: 'url-scaling',
      title: 'Scaling Strategy',
      description:
        'How should you scale the system to handle traffic growth and maintain availability?',
      category: 'Scalability',
      options: [
        {
          id: 'url-scale-multi-region',
          label: 'Multi-Region Active-Active',
          description:
            'Deploy the service in multiple geographic regions. Use geo-DNS to route users to the nearest region. Replicate the database across regions asynchronously.',
          score: 10,
          feedback:
            'Multi-region deployment reduces redirect latency globally and provides disaster recovery. Async replication handles the eventual consistency acceptable for URL lookups.',
          diagramEffect: {
            addNodes: [
              { id: 'url-region-2', type: 'server', label: 'Region 2\nServers', x: 300, y: 500 },
              { id: 'url-cdn', type: 'cdn', label: 'CDN Edge', x: 100, y: 500 },
            ],
            addConnections: [
              { from: 'url-dns', to: 'url-region-2', label: 'Geo-route', style: 'dashed' },
              { from: 'url-client', to: 'url-cdn', label: 'Static assets' },
            ],
          },
        },
        {
          id: 'url-scale-horizontal',
          label: 'Horizontal Auto-Scaling',
          description:
            'Auto-scale application servers behind the load balancer based on CPU and request rate. Add database read replicas as needed.',
          score: 7,
          feedback:
            'Horizontal scaling handles traffic growth well in a single region. However, without multi-region deployment, users far from your data center see higher latency.',
          diagramEffect: {
            addNodes: [
              { id: 'url-app-2', type: 'server', label: 'URL Service\n(Replica)', x: 500, y: 450 },
            ],
            addConnections: [
              { from: 'url-lb', to: 'url-app-2', label: 'Auto-scale' },
            ],
          },
        },
        {
          id: 'url-scale-vertical',
          label: 'Vertical Scaling',
          description: 'Use larger, more powerful servers to handle increased traffic.',
          score: 2,
          feedback:
            'Vertical scaling has hard limits and does not provide redundancy. A single powerful server is a single point of failure and cannot meet 99.9% availability.',
          diagramEffect: {
            addConnections: [
              { from: 'url-lb', to: 'url-app', label: 'Bigger server' },
            ],
          },
        },
      ],
    },
  ],
};
