import { Lesson } from '@/types/lesson';

export const lesson: Lesson = {
  slug: 'databases',
  title: 'Database Fundamentals',
  description:
    'Explore the core concepts behind relational and non-relational databases, including ACID guarantees, indexing, replication, and sharding strategies.',
  icon: 'database',
  estimatedMinutes: 20,
  content: [
    {
      type: 'heading',
      content: 'SQL vs NoSQL',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'Relational databases (SQL) store data in tables with predefined schemas and enforce relationships through foreign keys. They excel at complex queries, joins, and transactions. Examples include PostgreSQL, MySQL, and SQL Server. Non-relational databases (NoSQL) use flexible data models such as documents (MongoDB), key-value pairs (Redis, DynamoDB), wide-column stores (Cassandra), or graphs (Neo4j). They trade some query flexibility for horizontal scalability and schema flexibility. The choice between SQL and NoSQL depends on your data model, consistency requirements, scale needs, and query patterns.',
    },
    {
      type: 'heading',
      content: 'ACID Properties',
      level: 2,
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Atomicity — A transaction is all-or-nothing. If any part of a transaction fails, the entire transaction is rolled back and the database remains unchanged.',
        'Consistency — A transaction brings the database from one valid state to another, enforcing all defined rules, constraints, and triggers.',
        'Isolation — Concurrent transactions execute as if they were run sequentially. Different isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) trade consistency for performance.',
        'Durability — Once a transaction is committed, it will survive system crashes. Data is persisted to non-volatile storage before the commit is acknowledged.',
      ],
    },
    {
      type: 'heading',
      content: 'Indexing',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'An index is a data structure that allows the database to find rows without scanning the entire table. The most common type is a B-tree index, which keeps data sorted and allows searches, insertions, and deletions in O(log n) time. Hash indexes provide O(1) lookups for equality queries but do not support range scans. Composite indexes cover multiple columns and can satisfy queries that filter on any prefix of the indexed columns. While indexes dramatically speed up reads, they slow down writes because the index must be updated on every insert, update, or delete.',
    },
    {
      type: 'code',
      language: 'sql',
      content: `-- Create a composite index for common query patterns
CREATE INDEX idx_orders_user_date
  ON orders (user_id, created_at DESC);

-- This index efficiently serves queries like:
SELECT * FROM orders
  WHERE user_id = 42
  ORDER BY created_at DESC
  LIMIT 20;

-- Explain plan shows index scan instead of sequential scan
EXPLAIN ANALYZE
  SELECT * FROM orders
  WHERE user_id = 42 AND created_at > '2025-01-01';`,
    },
    {
      type: 'heading',
      content: 'Replication',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'Database replication creates copies of your data on multiple servers. In leader-follower (primary-replica) replication, all writes go to a single leader node, which then replicates changes to one or more follower nodes. Followers serve read traffic, distributing the read load. This architecture improves read scalability and provides fault tolerance — if the leader fails, a follower can be promoted. Replication can be synchronous (the leader waits for followers to confirm the write) or asynchronous (the leader does not wait, trading consistency for lower write latency).',
    },
    {
      type: 'diagram',
      caption: 'Leader-follower replication: writes go to the primary, reads are distributed across replicas',
      diagram: {
        nodes: [
          { id: 'app', type: 'server', label: 'App Server', x: 50, y: 200 },
          { id: 'primary', type: 'database', label: 'Primary DB', x: 300, y: 200 },
          { id: 'replica1', type: 'database', label: 'Replica 1', x: 550, y: 60 },
          { id: 'replica2', type: 'database', label: 'Replica 2', x: 550, y: 200 },
          { id: 'replica3', type: 'database', label: 'Replica 3', x: 550, y: 340 },
        ],
        connections: [
          { from: 'app', to: 'primary', label: 'Writes' },
          { from: 'primary', to: 'replica1', label: 'Replication', style: 'dashed' },
          { from: 'primary', to: 'replica2', label: 'Replication', style: 'dashed' },
          { from: 'primary', to: 'replica3', label: 'Replication', style: 'dashed' },
          { from: 'app', to: 'replica1', label: 'Reads', style: 'dashed' },
          { from: 'app', to: 'replica2', label: 'Reads', style: 'dashed' },
        ],
      },
    },
    {
      type: 'heading',
      content: 'Partitioning & Sharding',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'When a single database server can no longer handle the data volume or write throughput, you can partition (shard) the data across multiple servers. Each shard holds a subset of the data. Common sharding strategies include range-based partitioning (e.g., users A-M on shard 1, N-Z on shard 2), hash-based partitioning (a hash of the shard key determines which shard stores the row), and directory-based partitioning (a lookup table maps keys to shards). Sharding adds significant operational complexity: cross-shard queries require scatter-gather, rebalancing data when adding shards is difficult, and maintaining referential integrity across shards is impractical.',
    },
    {
      type: 'callout',
      variant: 'warning',
      content:
        'The CAP theorem states that a distributed data store can provide at most two of three guarantees: Consistency (every read receives the most recent write), Availability (every request receives a response), and Partition tolerance (the system continues operating despite network partitions). Since network partitions are unavoidable in distributed systems, the practical choice is between CP (consistent but may be unavailable during partitions) and AP (available but may return stale data during partitions).',
    },
    {
      type: 'quiz',
      question: {
        id: 'db-q1',
        question:
          'In leader-follower replication with asynchronous replication, what is a potential drawback?',
        options: [
          'Write operations become significantly slower.',
          'The system cannot handle any read traffic.',
          'A follower may serve stale data because it has not yet received the latest writes from the leader.',
          'The leader cannot accept writes while followers are replicating.',
        ],
        correctIndex: 2,
        explanation:
          'With asynchronous replication, the leader does not wait for followers to acknowledge writes before responding to the client. This means there is a replication lag — followers may be slightly behind the leader. If a client reads from a follower immediately after writing to the leader, it may not see its own write. This is the classic read-after-write consistency problem.',
      },
    },
  ],
};
