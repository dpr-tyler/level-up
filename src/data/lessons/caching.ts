import { Lesson } from '@/types/lesson';

export const lesson: Lesson = {
  slug: 'caching',
  title: 'Caching Strategies',
  description:
    'Understand how caching works at every layer of a system, from browser caches to distributed in-memory stores, and learn the trade-offs of different caching strategies.',
  icon: 'zap',
  estimatedMinutes: 18,
  content: [
    {
      type: 'heading',
      content: 'Why Caching Matters',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'Caching stores copies of frequently accessed data in a faster storage layer so that future requests can be served more quickly. A well-designed caching layer can reduce database load by orders of magnitude, cut response times from hundreds of milliseconds to single-digit milliseconds, and dramatically lower infrastructure costs. However, caching introduces complexity around data consistency, invalidation, and memory management that must be carefully managed.',
    },
    {
      type: 'heading',
      content: 'Types of Caches',
      level: 2,
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Browser Cache — The browser stores static assets (images, CSS, JS) locally based on HTTP cache headers like Cache-Control and ETag.',
        'CDN Cache — Content Delivery Networks cache content at edge locations geographically close to users, reducing latency for static and sometimes dynamic content.',
        'Application Cache — In-memory stores like Redis or Memcached sit between your application and database, caching query results, session data, and computed values.',
        'Database Cache — Most databases maintain internal caches (e.g., MySQL buffer pool, PostgreSQL shared buffers) for frequently accessed pages and query plans.',
      ],
    },
    {
      type: 'diagram',
      caption: 'Multi-layer caching architecture showing how a request flows through CDN, application cache, and database',
      diagram: {
        nodes: [
          { id: 'client', type: 'client', label: 'Client', x: 50, y: 200 },
          { id: 'cdn', type: 'cdn', label: 'CDN', x: 230, y: 200 },
          { id: 'server', type: 'server', label: 'App Server', x: 420, y: 200 },
          { id: 'cache', type: 'cache', label: 'Redis Cache', x: 620, y: 80 },
          { id: 'db', type: 'database', label: 'PostgreSQL', x: 620, y: 330 },
        ],
        connections: [
          { from: 'client', to: 'cdn', label: 'Request' },
          { from: 'cdn', to: 'server', label: 'Cache miss', style: 'dashed' },
          { from: 'server', to: 'cache', label: 'Check cache' },
          { from: 'cache', to: 'server', label: 'Cache hit', style: 'dashed' },
          { from: 'server', to: 'db', label: 'Cache miss', style: 'dashed' },
          { from: 'db', to: 'server', label: 'Result' },
        ],
      },
    },
    {
      type: 'heading',
      content: 'Caching Strategies',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'Cache-Aside (Lazy Loading): The application checks the cache first. On a miss, it queries the database, writes the result to the cache, and returns it. This is the most common pattern and gives the application full control over what gets cached. Write-Through: Every write goes to both the cache and the database simultaneously. This keeps the cache consistent but adds write latency. Read-Through: Similar to cache-aside, but the cache itself is responsible for loading data from the database on a miss. The application only talks to the cache. Write-Behind (Write-Back): Writes go to the cache immediately and are asynchronously flushed to the database. This provides excellent write performance but risks data loss if the cache fails before persisting.',
    },
    {
      type: 'code',
      language: 'typescript',
      content: `// Cache-aside pattern implementation
async function getUserProfile(userId: string): Promise<UserProfile> {
  const cacheKey = \`user:\${userId}\`;

  // 1. Check cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Cache miss — query the database
  const profile = await db.query(
    'SELECT * FROM users WHERE id = $1', [userId]
  );

  // 3. Populate cache with a TTL of 5 minutes
  await redis.set(cacheKey, JSON.stringify(profile), 'EX', 300);

  return profile;
}`,
    },
    {
      type: 'heading',
      content: 'Eviction Policies',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'When a cache reaches its memory limit, it must decide which entries to remove. LRU (Least Recently Used) evicts the entry that has not been accessed for the longest time and is the most widely used policy. LFU (Least Frequently Used) evicts the entry with the fewest total accesses, which works well when some items are consistently popular. FIFO (First In, First Out) evicts the oldest entry regardless of access patterns. TTL-based expiration removes entries after a fixed time period, which is useful for data that becomes stale predictably.',
    },
    {
      type: 'callout',
      variant: 'tip',
      content:
        'The Thundering Herd problem occurs when a popular cache entry expires and many concurrent requests all miss the cache simultaneously, overwhelming the database. Mitigate this with lock-based cache repopulation (only one request rebuilds the cache while others wait), staggered TTLs (add random jitter to expiration times), or background refresh (proactively rebuild cache entries before they expire).',
    },
    {
      type: 'callout',
      variant: 'info',
      content:
        'Cache invalidation is famously one of the two hardest problems in computer science. When the underlying data changes, you need a strategy to update or remove stale cache entries. Common approaches include TTL-based expiration, event-driven invalidation (publish a message when data changes), and versioned keys.',
    },
    {
      type: 'quiz',
      question: {
        id: 'cache-q1',
        question:
          'In a cache-aside strategy, what happens when the application receives a read request?',
        options: [
          'The application always reads from the database and then updates the cache.',
          'The cache automatically fetches from the database on a miss.',
          'The application checks the cache first; on a miss it queries the database and populates the cache.',
          'The application writes to the cache and the database simultaneously.',
        ],
        correctIndex: 2,
        explanation:
          'In cache-aside (lazy loading), the application is responsible for checking the cache first. If the data is not found (cache miss), the application queries the database, stores the result in the cache for future requests, and returns the data. This differs from read-through where the cache itself handles database fetching.',
      },
    },
  ],
};
