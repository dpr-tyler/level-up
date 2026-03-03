import { FlashcardDeck } from '@/types/flashcard';

export const deck: FlashcardDeck = {
  topic: 'databases',
  title: 'Databases',
  description: 'Explore database fundamentals including SQL vs NoSQL, ACID properties, indexing, sharding, replication, and query optimization.',
  icon: '🗄️',
  cards: [
    {
      id: 'db-1',
      front: 'What are the ACID properties in databases?',
      back: 'Atomicity: transactions are all-or-nothing; partial failures are rolled back. Consistency: transactions move the database from one valid state to another, enforcing constraints and invariants. Isolation: concurrent transactions do not interfere with each other (levels: read uncommitted, read committed, repeatable read, serializable). Durability: once committed, data survives crashes (via write-ahead logs and flushing to disk). ACID is fundamental to relational databases and critical for financial and transactional workloads.',
      topic: 'databases',
    },
    {
      id: 'db-2',
      front: 'When would you choose a NoSQL database over a relational database?',
      back: 'Choose NoSQL when you need: flexible/evolving schemas (document stores like MongoDB), massive horizontal scalability (Cassandra, DynamoDB), high write throughput, low-latency key-value access (Redis), graph relationships (Neo4j), or time-series data (InfluxDB). Choose SQL when you need strong consistency, complex joins, ACID transactions, well-defined schemas, and mature tooling. Many systems use both (polyglot persistence) to leverage each for its strengths.',
      topic: 'databases',
    },
    {
      id: 'db-3',
      front: 'What is database sharding and what are its challenges?',
      back: 'Sharding horizontally partitions data across multiple database instances, each holding a subset. Strategies: range-based (e.g., users A-M, N-Z), hash-based (hash of shard key), or directory-based (lookup table). Challenges: cross-shard queries and joins are expensive, rebalancing shards when data grows unevenly (hotspots), maintaining referential integrity, distributed transactions, increased operational complexity, and choosing the right shard key. Consider sharding only after exhausting vertical scaling and read replicas.',
      topic: 'databases',
    },
    {
      id: 'db-4',
      front: 'Explain database indexing and its tradeoffs.',
      back: 'An index is a data structure (commonly B-tree or B+ tree) that enables fast lookups by maintaining sorted references to rows. Benefits: dramatically speeds up reads and WHERE/JOIN/ORDER BY queries. Tradeoffs: indexes consume storage, slow down writes (inserts/updates/deletes must also update indexes), and require maintenance. Types: primary (unique, clustered), secondary, composite (multi-column), partial, and full-text. Over-indexing wastes resources; under-indexing causes full table scans.',
      topic: 'databases',
    },
    {
      id: 'db-5',
      front: 'What is database replication and what are the common patterns?',
      back: 'Replication copies data across multiple nodes for availability, fault tolerance, and read scalability. Patterns: (1) Single-leader (master-slave): one node accepts writes, replicas serve reads. Simple but the leader is a bottleneck and single point of failure. (2) Multi-leader: multiple nodes accept writes; conflicts must be resolved. Good for multi-region. (3) Leaderless (e.g., Cassandra, DynamoDB): any node accepts reads/writes; uses quorum (W + R > N) for consistency. Replication can be synchronous (consistent but slower) or asynchronous (faster but can lag).',
      topic: 'databases',
    },
    {
      id: 'db-6',
      front: 'What is the N+1 query problem and how do you solve it?',
      back: 'The N+1 problem occurs when code fetches a list of N records and then makes one additional query per record to load related data, resulting in N+1 total queries instead of a constant number. Example: fetching 100 users then querying each user\'s orders individually. Solutions: eager loading/JOIN queries to fetch related data in one query, batch loading (WHERE id IN (...)), using ORM features like includes/preload, or DataLoader pattern for batching and deduplication in GraphQL.',
      topic: 'databases',
    },
    {
      id: 'db-7',
      front: 'What are the different isolation levels in SQL databases?',
      back: 'Read Uncommitted: allows dirty reads (seeing uncommitted changes). Read Committed: only sees committed data; prevents dirty reads but allows non-repeatable reads. Repeatable Read: guarantees the same read returns the same result within a transaction; prevents non-repeatable reads but allows phantom reads (new rows appearing). Serializable: full isolation as if transactions ran sequentially; prevents all anomalies but has the lowest concurrency. Higher isolation means more correctness but lower throughput due to increased locking.',
      topic: 'databases',
    },
    {
      id: 'db-8',
      front: 'What is a write-ahead log (WAL) and why is it important?',
      back: 'A WAL records all changes to a log file on disk before applying them to the actual data pages. Purpose: ensures durability and crash recovery. If the database crashes mid-write, the WAL can replay committed transactions and discard incomplete ones on restart. WAL also enables replication (replicas replay the log) and point-in-time recovery. It converts random writes to sequential writes, improving write performance. Used by PostgreSQL, MySQL (InnoDB redo log), SQLite, and most modern databases.',
      topic: 'databases',
    },
    {
      id: 'db-9',
      front: 'What is the difference between vertical and horizontal partitioning?',
      back: 'Vertical partitioning splits a table by columns: frequently accessed columns in one partition, rarely used or large columns (e.g., BLOBs) in another. Reduces I/O for common queries. Horizontal partitioning (sharding) splits by rows: subsets of rows go to different partitions based on a key. Scales write and storage capacity. Vertical is simpler but limited in scalability; horizontal scales further but complicates queries spanning partitions. Both can be combined.',
      topic: 'databases',
    },
    {
      id: 'db-10',
      front: 'What is a materialized view and when should you use one?',
      back: 'A materialized view is a precomputed query result stored as a physical table, unlike a regular view which re-executes the query each time. Use cases: expensive aggregations, complex joins, reporting dashboards, and denormalized read models in CQRS. Benefits: dramatically faster reads for complex queries. Tradeoffs: storage overhead, staleness (must be refreshed on schedule or via triggers), and write amplification. Refresh strategies: full refresh, incremental refresh, or on-demand. Ideal for read-heavy workloads with acceptable staleness.',
      topic: 'databases',
    },
  ],
};
