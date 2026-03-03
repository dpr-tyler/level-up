import { FlashcardDeck } from '@/types/flashcard';

export const deck: FlashcardDeck = {
  topic: 'caching',
  title: 'Caching',
  description: 'Understand caching strategies, eviction policies, cache invalidation, write patterns, and common pitfalls like thundering herd.',
  icon: '💾',
  cards: [
    {
      id: 'cache-1',
      front: 'What is the difference between cache-aside and read-through caching?',
      back: 'Cache-aside (lazy loading): the application checks the cache first; on a miss, it fetches from the database and populates the cache. The app manages both cache and DB. Read-through: the cache itself is responsible for loading data from the DB on a miss, abstracting the data source from the application. Read-through simplifies application code but couples the cache layer to the data source.',
      topic: 'caching',
    },
    {
      id: 'cache-2',
      front: 'Explain write-through vs write-behind (write-back) caching.',
      back: 'Write-through: data is written to both the cache and database synchronously before confirming to the client. Ensures consistency but adds write latency. Write-behind (write-back): data is written to the cache immediately, and asynchronously flushed to the database in batches. Offers lower write latency and higher throughput but risks data loss if the cache fails before flushing. Write-behind is suited for high-write workloads with acceptable durability tradeoffs.',
      topic: 'caching',
    },
    {
      id: 'cache-3',
      front: 'What are common cache eviction policies?',
      back: 'LRU (Least Recently Used): evicts the item not accessed for the longest time. Most popular general-purpose policy. LFU (Least Frequently Used): evicts the least-accessed item; good for skewed access patterns but can retain stale popular items. FIFO: evicts the oldest item regardless of access. TTL-based: items expire after a set time. Random: simple but unpredictable. Most production systems use LRU or approximations of it (e.g., Redis uses sampled LRU).',
      topic: 'caching',
    },
    {
      id: 'cache-4',
      front: 'Why is cache invalidation considered one of the hardest problems in computer science?',
      back: 'Cache invalidation is hard because you must ensure cached data stays consistent with the source of truth across distributed systems. Challenges: race conditions between concurrent writes and cache updates, identifying all cache entries affected by a data change, propagating invalidation across multiple cache nodes, and handling partial failures. Common strategies: TTL-based expiration (eventual consistency), event-driven invalidation (publish changes), and versioned keys. Each has tradeoffs between consistency, complexity, and performance.',
      topic: 'caching',
    },
    {
      id: 'cache-5',
      front: 'What is the thundering herd problem and how do you mitigate it?',
      back: 'Thundering herd occurs when a popular cache key expires and many concurrent requests simultaneously hit the database to rebuild it, potentially overwhelming the DB. Mitigations: (1) Lock/mutex: only one request rebuilds the cache while others wait. (2) Request coalescing: collapse duplicate in-flight requests into one. (3) Early/probabilistic expiration: refresh the cache before actual expiry. (4) Stale-while-revalidate: serve stale data while asynchronously refreshing. (5) Pre-warming: proactively populate the cache before expiration.',
      topic: 'caching',
    },
    {
      id: 'cache-6',
      front: 'What is a distributed cache and how does it differ from a local cache?',
      back: 'A local (in-process) cache lives in the application memory. It is extremely fast (no network hop) but limited by instance memory, not shared across instances, and lost on restart. A distributed cache (e.g., Redis, Memcached) is a shared, networked cache accessible by all application instances. It provides consistency across nodes, larger capacity, and persistence options, but adds network latency (typically sub-millisecond on LAN). Many systems use both: local L1 cache with distributed L2 cache.',
      topic: 'caching',
    },
    {
      id: 'cache-7',
      front: 'What is cache warming and when is it necessary?',
      back: 'Cache warming is pre-populating the cache with expected hot data before traffic arrives, rather than waiting for cache misses. It is necessary after: deploying a new cache cluster, restarting cache nodes, or before anticipated traffic spikes (e.g., product launches). Methods include replaying recent access logs, querying for known popular keys, or gradually shifting traffic to new nodes. Without warming, cold caches cause a surge of database queries that can degrade performance.',
      topic: 'caching',
    },
    {
      id: 'cache-8',
      front: 'How does Redis differ from Memcached?',
      back: 'Redis supports rich data structures (strings, hashes, lists, sets, sorted sets, streams), persistence (RDB snapshots, AOF logs), replication, Lua scripting, pub/sub, and clustering. Memcached is simpler: key-value strings only, multi-threaded (better per-node throughput for simple ops), no persistence, and uses a slab allocator for memory. Choose Redis for feature richness and data structure needs; Memcached for simple, high-throughput caching with multi-threaded performance.',
      topic: 'caching',
    },
    {
      id: 'cache-9',
      front: 'What is cache penetration and how do you prevent it?',
      back: 'Cache penetration occurs when queries for non-existent data bypass the cache and repeatedly hit the database (since there is nothing to cache). Prevention: (1) Cache null/empty results with a short TTL so repeated lookups for the same missing key hit the cache. (2) Bloom filters: check a probabilistic data structure before querying the DB; if the key definitely does not exist, skip the query. (3) Input validation: reject obviously invalid queries at the API layer before they reach the cache or DB.',
      topic: 'caching',
    },
    {
      id: 'cache-10',
      front: 'What is the difference between TTL-based and event-driven cache invalidation?',
      back: 'TTL-based: each cache entry has a time-to-live; after expiration, the next request triggers a refresh. Simple to implement but data can be stale for up to the TTL duration. Event-driven: the system publishes invalidation events (e.g., via message queue or CDC) when source data changes, and cache subscribers evict or update entries immediately. Event-driven provides near-real-time consistency but adds infrastructure complexity (message brokers, event handlers, failure handling).',
      topic: 'caching',
    },
  ],
};
