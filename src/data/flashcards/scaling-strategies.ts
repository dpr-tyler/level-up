import { FlashcardDeck } from '@/types/flashcard';

export const deck: FlashcardDeck = {
  topic: 'scaling-strategies',
  title: 'Scaling Strategies',
  description: 'Learn scaling approaches including vertical vs horizontal scaling, auto-scaling, database sharding, read replicas, and capacity planning.',
  icon: '📈',
  cards: [
    {
      id: 'ss-1',
      front: 'What is the difference between vertical and horizontal scaling?',
      back: 'Vertical scaling (scaling up): adding more resources (CPU, RAM, disk) to a single machine. Simple, no code changes needed, but has hardware limits, involves downtime for upgrades, and creates a single point of failure. Horizontal scaling (scaling out): adding more machines to distribute the workload. Theoretically unlimited, provides redundancy, but requires the application to handle distributed state, load balancing, and data partitioning. Most systems start vertical and move to horizontal as they grow. Horizontal scaling is essential for web-scale systems.',
      topic: 'scaling-strategies',
    },
    {
      id: 'ss-2',
      front: 'How does auto-scaling work and what metrics should trigger scaling?',
      back: 'Auto-scaling automatically adjusts the number of instances based on demand. Types: reactive (scales based on current metrics) and predictive (scales based on forecasted traffic patterns). Key trigger metrics: CPU utilization (most common, e.g., scale at 70%), request count/rate, response latency (p95/p99), queue depth, memory usage, and custom business metrics. Configuration: minimum/maximum instance counts, cooldown periods (prevent thrashing), and scaling step size. Scale out aggressively and scale in conservatively to avoid oscillation. Pre-warming may be needed for instances with long startup times.',
      topic: 'scaling-strategies',
    },
    {
      id: 'ss-3',
      front: 'What is database read replica scaling and when should you use it?',
      back: 'Read replicas are copies of the primary database that serve read queries, distributing read load across multiple nodes while the primary handles writes. Use when: read-to-write ratio is high (common in most web apps: 80-95% reads), read latency needs improvement, or analytics queries should not impact production. Implementation: route reads to replicas via application logic, connection pooling, or proxy (e.g., ProxySQL). Tradeoffs: replication lag means replicas may serve slightly stale data, eventual consistency must be acceptable, and write capacity is not improved.',
      topic: 'scaling-strategies',
    },
    {
      id: 'ss-4',
      front: 'What is the difference between stateless and stateful services for scaling?',
      back: 'Stateless services store no client state between requests; any instance can handle any request. They scale horizontally by simply adding instances behind a load balancer. Stateful services maintain state (sessions, connections, in-memory data) tied to specific instances. Scaling is harder: requires sticky sessions, distributed state, or state externalization. Best practice: make services stateless by externalizing state to shared stores (Redis for sessions, S3 for files, databases for data). Stateless services are easier to scale, deploy, and recover from failures.',
      topic: 'scaling-strategies',
    },
    {
      id: 'ss-5',
      front: 'What is capacity planning and how do you approach it?',
      back: 'Capacity planning estimates the resources needed to handle expected load. Process: (1) Define load characteristics: requests/second, data volume, user growth rate. (2) Benchmark: measure single-instance capacity (requests/sec at acceptable latency). (3) Calculate: instances needed = peak load / per-instance capacity, with headroom (typically 2-3x for safety). (4) Account for data growth: storage, backup, and replication needs. (5) Plan for failure: N+1 or N+2 redundancy. Consider: seasonal patterns (Black Friday), growth projections, and burst capacity. Revisit regularly and load test to validate assumptions.',
      topic: 'scaling-strategies',
    },
    {
      id: 'ss-6',
      front: 'What is data partitioning (sharding) and what are the main strategies?',
      back: 'Sharding distributes data across multiple database instances. Strategies: (1) Range-based: partition by key ranges (users A-M, N-Z). Simple but prone to hotspots if distribution is uneven. (2) Hash-based: hash the shard key to determine the shard. Even distribution but range queries span all shards. (3) Directory-based: a lookup service maps keys to shards. Flexible but the directory is a bottleneck. (4) Geographic: shard by region for data locality and compliance. Key choice is critical: it should distribute evenly, align with query patterns, and minimize cross-shard queries.',
      topic: 'scaling-strategies',
    },
    {
      id: 'ss-7',
      front: 'What is the CQRS pattern and how does it help with scaling?',
      back: 'CQRS (Command Query Responsibility Segregation) uses separate models for reads and writes. The write model handles commands (optimized for data integrity), and the read model handles queries (optimized for read patterns, often denormalized). Benefits for scaling: read and write sides scale independently, read models can use different storage optimized for queries (e.g., Elasticsearch for search, materialized views for dashboards), and each side can be optimized without compromising the other. Tradeoff: increased complexity, eventual consistency between models, and need for event-driven synchronization.',
      topic: 'scaling-strategies',
    },
    {
      id: 'ss-8',
      front: 'What are the strategies for scaling WebSocket connections?',
      back: 'WebSockets are stateful (persistent connections), making horizontal scaling challenging. Strategies: (1) Sticky sessions: route each user to the same server. (2) Pub/sub backbone (Redis Pub/Sub, Kafka): when a message needs to reach a user on another server, publish it to a shared channel that all servers subscribe to. (3) Dedicated connection servers: separate WebSocket handling from business logic. (4) Connection limits: each server handles a limited number of connections (tune OS file descriptors). (5) Graceful migration: drain connections during deployments. Services like Pusher and Ably handle this complexity as managed services.',
      topic: 'scaling-strategies',
    },
    {
      id: 'ss-9',
      front: 'What is the difference between scaling compute vs scaling data?',
      back: 'Scaling compute (application servers): relatively straightforward with stateless services. Add instances behind a load balancer. Auto-scaling handles dynamic load. Main challenges: deployment coordination and warm-up time. Scaling data (databases, storage): much harder. Involves replication (read scaling), sharding (write scaling), migration of data between shards, maintaining consistency, handling cross-shard queries, and backup at scale. Data scaling often becomes the primary bottleneck. Strategy: defer data scaling as long as possible through caching, read replicas, and query optimization before sharding.',
      topic: 'scaling-strategies',
    },
    {
      id: 'ss-10',
      front: 'What is a cell-based architecture for scaling?',
      back: 'Cell-based architecture divides the system into multiple independent, self-contained cells, each serving a subset of users/tenants. Each cell has its own complete infrastructure stack (compute, database, cache, queue). Benefits: blast radius containment (a failure in one cell does not affect others), independent scaling per cell, simplified testing (test one cell), and progressive rollouts (deploy to one cell first). Used by AWS (availability zones as cells), Slack (per-workspace cells), and many SaaS platforms. Tradeoff: increased infrastructure cost and complexity in routing and cell management.',
      topic: 'scaling-strategies',
    },
  ],
};
