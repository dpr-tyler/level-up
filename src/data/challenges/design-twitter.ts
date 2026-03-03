import { Challenge } from '@/types/challenge';

export const challenge: Challenge = {
  slug: 'design-twitter',
  title: 'Design Twitter',
  description:
    'Design a social media platform like Twitter that supports posting tweets, following users, and generating personalized timelines at massive scale.',
  icon: '🐦',
  difficulty: 'advanced',
  requirements: {
    scale: '500M users, 600K tweets/sec read',
    latency: '<200ms feed load',
    availability: '99.99%',
    storage: '15TB/day media',
  },
  steps: [
    {
      id: 'twitter-arch-style',
      title: 'Architecture Style',
      description:
        'How should you structure the overall system architecture to handle Twitter-scale traffic?',
      category: 'Architecture',
      options: [
        {
          id: 'twitter-arch-microservices',
          label: 'Microservices Architecture',
          description:
            'Decompose into independent services: Tweet Service, User Service, Timeline Service, Notification Service, etc.',
          score: 10,
          feedback:
            'Excellent! Microservices let each domain scale independently. The Timeline Service can scale differently from the Tweet Service, which is critical at 600K reads/sec.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-client', type: 'client', label: 'Client Apps', x: 100, y: 300 },
              { id: 'tw-lb', type: 'loadBalancer', label: 'Load Balancer', x: 300, y: 300 },
              { id: 'tw-tweet-svc', type: 'server', label: 'Tweet Service', x: 500, y: 200 },
              { id: 'tw-user-svc', type: 'server', label: 'User Service', x: 500, y: 400 },
              { id: 'tw-timeline-svc', type: 'server', label: 'Timeline Service', x: 500, y: 600 },
            ],
            addConnections: [
              { from: 'tw-client', to: 'tw-lb', label: 'HTTPS' },
              { from: 'tw-lb', to: 'tw-tweet-svc', label: 'Route' },
              { from: 'tw-lb', to: 'tw-user-svc', label: 'Route' },
              { from: 'tw-lb', to: 'tw-timeline-svc', label: 'Route' },
            ],
          },
        },
        {
          id: 'twitter-arch-monolith',
          label: 'Modular Monolith',
          description:
            'A single deployable application with well-defined internal modules for tweets, users, and timelines.',
          score: 4,
          feedback:
            'A monolith simplifies development but creates a scaling bottleneck. At 600K reads/sec you cannot scale the timeline independently from tweet writes.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-client', type: 'client', label: 'Client Apps', x: 100, y: 300 },
              { id: 'tw-lb', type: 'loadBalancer', label: 'Load Balancer', x: 300, y: 300 },
              { id: 'tw-monolith', type: 'server', label: 'Monolith Server', x: 500, y: 300 },
            ],
            addConnections: [
              { from: 'tw-client', to: 'tw-lb', label: 'HTTPS' },
              { from: 'tw-lb', to: 'tw-monolith', label: 'Route' },
            ],
          },
        },
        {
          id: 'twitter-arch-soa',
          label: 'Service-Oriented Architecture',
          description:
            'Larger service boundaries with shared database layers and an enterprise service bus for communication.',
          score: 7,
          feedback:
            'SOA is a reasonable middle ground. You get service separation, but a shared ESB can become a bottleneck under extreme load. Microservices give finer control.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-client', type: 'client', label: 'Client Apps', x: 100, y: 300 },
              { id: 'tw-lb', type: 'loadBalancer', label: 'Load Balancer', x: 300, y: 300 },
              { id: 'tw-tweet-svc', type: 'server', label: 'Tweet Service', x: 500, y: 200 },
              { id: 'tw-core-svc', type: 'server', label: 'Core Platform', x: 500, y: 450 },
            ],
            addConnections: [
              { from: 'tw-client', to: 'tw-lb', label: 'HTTPS' },
              { from: 'tw-lb', to: 'tw-tweet-svc', label: 'Route' },
              { from: 'tw-lb', to: 'tw-core-svc', label: 'Route' },
            ],
          },
        },
      ],
    },
    {
      id: 'twitter-api-layer',
      title: 'API Layer',
      description:
        'What API paradigm should you use for clients to interact with the backend services?',
      category: 'API Design',
      options: [
        {
          id: 'twitter-api-graphql',
          label: 'GraphQL Gateway',
          description:
            'A GraphQL API gateway that aggregates data from microservices, letting clients request exactly the fields they need.',
          score: 10,
          feedback:
            'GraphQL is ideal for Twitter. Clients can fetch tweet text, author info, and engagement counts in a single query without over-fetching, reducing latency and bandwidth.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-api-gw', type: 'server', label: 'GraphQL Gateway', x: 400, y: 50 },
            ],
            addConnections: [
              { from: 'tw-lb', to: 'tw-api-gw', label: 'GraphQL' },
              { from: 'tw-api-gw', to: 'tw-tweet-svc', label: 'gRPC', style: 'dashed' },
              { from: 'tw-api-gw', to: 'tw-user-svc', label: 'gRPC', style: 'dashed' },
            ],
          },
        },
        {
          id: 'twitter-api-rest',
          label: 'REST APIs',
          description:
            'Standard RESTful endpoints for each resource: /tweets, /users, /timeline, etc.',
          score: 7,
          feedback:
            'REST is well-understood and cacheable, but loading a timeline requires multiple round trips (tweet data, user data, media) which adds latency.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-api-gw', type: 'server', label: 'REST API Gateway', x: 400, y: 50 },
            ],
            addConnections: [
              { from: 'tw-lb', to: 'tw-api-gw', label: 'REST' },
              { from: 'tw-api-gw', to: 'tw-tweet-svc', label: 'HTTP', style: 'dashed' },
            ],
          },
        },
        {
          id: 'twitter-api-grpc',
          label: 'gRPC Direct',
          description:
            'Expose gRPC endpoints directly to mobile and web clients via gRPC-Web.',
          score: 4,
          feedback:
            'gRPC is efficient for service-to-service calls but has limited browser support. gRPC-Web adds complexity and loses the flexibility clients need for varied feed queries.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-api-gw', type: 'server', label: 'gRPC Gateway', x: 400, y: 50 },
            ],
            addConnections: [
              { from: 'tw-lb', to: 'tw-api-gw', label: 'gRPC-Web' },
            ],
          },
        },
      ],
    },
    {
      id: 'twitter-tweet-db',
      title: 'Tweet Storage Database',
      description:
        'Which database should you use to store hundreds of billions of tweets with high write throughput?',
      category: 'Data Storage',
      options: [
        {
          id: 'twitter-db-distributed-nosql',
          label: 'Distributed NoSQL (Cassandra)',
          description:
            'Use Apache Cassandra for its linear write scalability, tunable consistency, and ability to handle massive time-series data.',
          score: 10,
          feedback:
            'Cassandra excels at write-heavy workloads with time-series data. Its distributed architecture handles 600K+ writes/sec across the cluster with no single point of failure.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-tweet-db', type: 'database', label: 'Tweet DB\n(Cassandra)', x: 700, y: 200 },
              { id: 'tw-user-db', type: 'database', label: 'User DB\n(PostgreSQL)', x: 700, y: 400 },
            ],
            addConnections: [
              { from: 'tw-tweet-svc', to: 'tw-tweet-db', label: 'Write/Read' },
              { from: 'tw-user-svc', to: 'tw-user-db', label: 'Query' },
            ],
          },
        },
        {
          id: 'twitter-db-sharded-mysql',
          label: 'Sharded MySQL',
          description:
            'Horizontally shard MySQL by user ID or tweet ID to distribute the load across many database instances.',
          score: 7,
          feedback:
            'Sharded MySQL can work (Twitter originally used it) but shard management is complex. Cross-shard queries for timelines are expensive and resharding is painful at scale.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-tweet-db', type: 'database', label: 'Tweet DB\n(Sharded MySQL)', x: 700, y: 200 },
              { id: 'tw-user-db', type: 'database', label: 'User DB', x: 700, y: 400 },
            ],
            addConnections: [
              { from: 'tw-tweet-svc', to: 'tw-tweet-db', label: 'Write/Read' },
              { from: 'tw-user-svc', to: 'tw-user-db', label: 'Query' },
            ],
          },
        },
        {
          id: 'twitter-db-single-pg',
          label: 'Single PostgreSQL Instance',
          description: 'Use a powerful PostgreSQL server with read replicas for scaling reads.',
          score: 2,
          feedback:
            'A single database cannot handle this write volume. Even with read replicas, the primary becomes a bottleneck well before 600K tweets/sec.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-tweet-db', type: 'database', label: 'Tweet DB\n(PostgreSQL)', x: 700, y: 300 },
            ],
            addConnections: [
              { from: 'tw-tweet-svc', to: 'tw-tweet-db', label: 'Write/Read' },
            ],
          },
        },
      ],
    },
    {
      id: 'twitter-timeline',
      title: 'Timeline / Feed Generation',
      description:
        'How should you generate each user\'s home timeline from the accounts they follow?',
      category: 'Core Feature',
      options: [
        {
          id: 'twitter-timeline-hybrid',
          label: 'Hybrid Fan-out',
          description:
            'Pre-compute timelines for most users (fan-out on write), but fetch on demand for celebrity accounts with millions of followers.',
          score: 10,
          feedback:
            'The hybrid approach is what Twitter actually uses. Fan-out on write keeps reads fast for most users, while fan-out on read for celebrities avoids writing to millions of timelines per tweet.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-fanout-svc', type: 'server', label: 'Fan-out Service', x: 700, y: 600 },
              { id: 'tw-timeline-cache', type: 'cache', label: 'Timeline Cache\n(Redis)', x: 900, y: 600 },
            ],
            addConnections: [
              { from: 'tw-timeline-svc', to: 'tw-fanout-svc', label: 'New Tweet' },
              { from: 'tw-fanout-svc', to: 'tw-timeline-cache', label: 'Write to follower timelines' },
              { from: 'tw-timeline-svc', to: 'tw-timeline-cache', label: 'Read feed' },
            ],
          },
        },
        {
          id: 'twitter-timeline-fanout-write',
          label: 'Fan-out on Write',
          description:
            'When a user posts a tweet, immediately push it to every follower\'s pre-computed timeline.',
          score: 7,
          feedback:
            'Fan-out on write gives fast reads but is extremely expensive for users with millions of followers. A single celebrity tweet would trigger millions of writes.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-fanout-svc', type: 'server', label: 'Fan-out Service', x: 700, y: 600 },
              { id: 'tw-timeline-cache', type: 'cache', label: 'Timeline Cache', x: 900, y: 600 },
            ],
            addConnections: [
              { from: 'tw-timeline-svc', to: 'tw-fanout-svc', label: 'New Tweet' },
              { from: 'tw-fanout-svc', to: 'tw-timeline-cache', label: 'Push to all followers' },
            ],
          },
        },
        {
          id: 'twitter-timeline-fanout-read',
          label: 'Fan-out on Read',
          description:
            'When a user opens their timeline, query all followed accounts and merge their recent tweets in real time.',
          score: 4,
          feedback:
            'Fan-out on read avoids write amplification but is too slow for reads. Merging tweets from hundreds of followed accounts at request time exceeds the 200ms latency target.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-timeline-cache', type: 'cache', label: 'Tweet Cache', x: 900, y: 600 },
            ],
            addConnections: [
              { from: 'tw-timeline-svc', to: 'tw-tweet-db', label: 'Query all follows', style: 'dashed' },
              { from: 'tw-timeline-svc', to: 'tw-timeline-cache', label: 'Cache results' },
            ],
          },
        },
      ],
    },
    {
      id: 'twitter-caching',
      title: 'Caching Strategy',
      description:
        'How should you implement caching to meet the <200ms feed load requirement?',
      category: 'Performance',
      options: [
        {
          id: 'twitter-cache-multi-tier',
          label: 'Multi-tier Caching',
          description:
            'Use a local in-memory cache on each server for hot data, backed by a distributed Redis cluster for timelines, user profiles, and tweet data.',
          score: 10,
          feedback:
            'Multi-tier caching maximizes cache hit rates. Local caches avoid network round trips for the hottest data while Redis handles the bulk of timeline and tweet caching.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-redis-cluster', type: 'cache', label: 'Redis Cluster\n(Tweets/Profiles)', x: 900, y: 200 },
            ],
            addConnections: [
              { from: 'tw-tweet-svc', to: 'tw-redis-cluster', label: 'Cache-aside' },
              { from: 'tw-user-svc', to: 'tw-redis-cluster', label: 'Cache profiles' },
            ],
          },
        },
        {
          id: 'twitter-cache-redis-only',
          label: 'Distributed Redis Only',
          description: 'Use a Redis cluster as the sole caching layer for all services.',
          score: 7,
          feedback:
            'A Redis cluster works well but every cache read requires a network hop. Adding a local L1 cache for extremely hot data (trending tweets) would reduce latency further.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-redis-cluster', type: 'cache', label: 'Redis Cluster', x: 900, y: 200 },
            ],
            addConnections: [
              { from: 'tw-tweet-svc', to: 'tw-redis-cluster', label: 'Cache' },
            ],
          },
        },
        {
          id: 'twitter-cache-cdn-only',
          label: 'CDN Caching Only',
          description: 'Cache API responses at the CDN edge to serve repeat requests faster.',
          score: 2,
          feedback:
            'CDN caching works for static content but personalized timelines are unique per user and cannot be effectively cached at the CDN level.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-cdn-cache', type: 'cdn', label: 'CDN Cache', x: 200, y: 100 },
            ],
            addConnections: [
              { from: 'tw-client', to: 'tw-cdn-cache', label: 'Cached responses' },
            ],
          },
        },
      ],
    },
    {
      id: 'twitter-media',
      title: 'Media Storage',
      description:
        'How should you store and serve 15TB/day of images and videos attached to tweets?',
      category: 'Storage',
      options: [
        {
          id: 'twitter-media-s3-cdn',
          label: 'Object Storage + CDN',
          description:
            'Store media in object storage (S3), serve through a global CDN with on-the-fly image resizing at the edge.',
          score: 10,
          feedback:
            'Object storage provides virtually unlimited capacity at low cost, while CDN distribution ensures fast media loading globally. Edge resizing reduces storage for multiple image sizes.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-media-store', type: 'storage', label: 'Object Storage\n(S3)', x: 900, y: 0 },
              { id: 'tw-cdn', type: 'cdn', label: 'Media CDN', x: 200, y: 100 },
            ],
            addConnections: [
              { from: 'tw-tweet-svc', to: 'tw-media-store', label: 'Upload media' },
              { from: 'tw-cdn', to: 'tw-media-store', label: 'Origin pull' },
              { from: 'tw-client', to: 'tw-cdn', label: 'Fetch media' },
            ],
          },
        },
        {
          id: 'twitter-media-distributed-fs',
          label: 'Distributed File System (HDFS)',
          description:
            'Store all media files on a Hadoop Distributed File System cluster with replication.',
          score: 4,
          feedback:
            'HDFS handles large files well but is optimized for batch processing, not serving low-latency media requests to hundreds of millions of users.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-media-store', type: 'storage', label: 'HDFS Cluster', x: 900, y: 0 },
            ],
            addConnections: [
              { from: 'tw-tweet-svc', to: 'tw-media-store', label: 'Store media' },
            ],
          },
        },
        {
          id: 'twitter-media-db-blobs',
          label: 'Database BLOBs',
          description: 'Store media as binary large objects directly in the tweet database.',
          score: 2,
          feedback:
            'Storing 15TB/day of binary data in the database would crush performance. Databases are not designed for serving large binary objects at scale.',
          diagramEffect: {
            addConnections: [
              { from: 'tw-tweet-svc', to: 'tw-tweet-db', label: 'Store BLOBs' },
            ],
          },
        },
      ],
    },
    {
      id: 'twitter-notifications',
      title: 'Notification System',
      description:
        'How should you handle notifications for mentions, likes, retweets, and new followers?',
      category: 'Infrastructure',
      options: [
        {
          id: 'twitter-notify-event-queue',
          label: 'Event-Driven with Message Queue',
          description:
            'Publish notification events to a message queue (Kafka). Dedicated notification consumers process and route to push, email, or in-app channels.',
          score: 10,
          feedback:
            'Event-driven architecture decouples notification logic from the core tweet path. Kafka handles burst traffic during viral events and ensures no notifications are lost.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-event-queue', type: 'queue', label: 'Event Queue\n(Kafka)', x: 700, y: 800 },
              { id: 'tw-notify-svc', type: 'server', label: 'Notification\nService', x: 900, y: 800 },
            ],
            addConnections: [
              { from: 'tw-tweet-svc', to: 'tw-event-queue', label: 'Publish events' },
              { from: 'tw-fanout-svc', to: 'tw-event-queue', label: 'Notify events' },
              { from: 'tw-event-queue', to: 'tw-notify-svc', label: 'Consume' },
            ],
          },
        },
        {
          id: 'twitter-notify-sync',
          label: 'Synchronous Notifications',
          description:
            'Send notifications inline during the tweet/like/follow API call before returning a response.',
          score: 2,
          feedback:
            'Synchronous notifications would make every tweet/like/follow call slow and fragile. If the notification service is down, core functionality breaks.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-notify-svc', type: 'server', label: 'Notification\nService', x: 900, y: 800 },
            ],
            addConnections: [
              { from: 'tw-tweet-svc', to: 'tw-notify-svc', label: 'Sync call' },
            ],
          },
        },
        {
          id: 'twitter-notify-polling',
          label: 'Client Polling',
          description: 'Clients poll a notifications endpoint every few seconds to check for new notifications.',
          score: 4,
          feedback:
            'Polling works but generates enormous unnecessary traffic at 500M users. Even at 30-second intervals that is 16M requests/sec just for notification checks.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-notify-svc', type: 'server', label: 'Notification\nService', x: 900, y: 800 },
            ],
            addConnections: [
              { from: 'tw-client', to: 'tw-notify-svc', label: 'Poll every 30s', style: 'dashed' },
            ],
          },
        },
      ],
    },
    {
      id: 'twitter-search',
      title: 'Search & Trending',
      description:
        'How should you implement tweet search and trending topics detection?',
      category: 'Features',
      options: [
        {
          id: 'twitter-search-es-stream',
          label: 'Elasticsearch + Stream Processing',
          description:
            'Index tweets into Elasticsearch for full-text search. Use a stream processor (Flink/Spark) on the event stream to compute trending topics in real time.',
          score: 10,
          feedback:
            'Elasticsearch provides fast full-text search with relevance ranking. Stream processing on Kafka events detects trending topics within seconds of them emerging.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-search-idx', type: 'database', label: 'Search Index\n(Elasticsearch)', x: 500, y: 800 },
              { id: 'tw-stream-proc', type: 'server', label: 'Stream Processor\n(Flink)', x: 300, y: 800 },
            ],
            addConnections: [
              { from: 'tw-event-queue', to: 'tw-search-idx', label: 'Index tweets' },
              { from: 'tw-event-queue', to: 'tw-stream-proc', label: 'Trending analysis' },
              { from: 'tw-stream-proc', to: 'tw-redis-cluster', label: 'Update trending' },
            ],
          },
        },
        {
          id: 'twitter-search-db-query',
          label: 'Database Full-Text Search',
          description: 'Use the database\'s built-in full-text search capabilities with indexed columns.',
          score: 4,
          feedback:
            'Database full-text search cannot match the performance of a dedicated search engine at this scale. Trending detection would require expensive aggregation queries.',
          diagramEffect: {
            addConnections: [
              { from: 'tw-timeline-svc', to: 'tw-tweet-db', label: 'Full-text query' },
            ],
          },
        },
        {
          id: 'twitter-search-solr',
          label: 'Apache Solr',
          description: 'Use Solr for search indexing with batch reindexing jobs for trending topics.',
          score: 7,
          feedback:
            'Solr is a solid search engine but batch reindexing means trending topics lag behind real time. Elasticsearch with stream processing provides more timely results.',
          diagramEffect: {
            addNodes: [
              { id: 'tw-search-idx', type: 'database', label: 'Search Index\n(Solr)', x: 500, y: 800 },
            ],
            addConnections: [
              { from: 'tw-tweet-svc', to: 'tw-search-idx', label: 'Batch index' },
            ],
          },
        },
      ],
    },
  ],
};
