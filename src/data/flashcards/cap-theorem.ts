import { FlashcardDeck } from '@/types/flashcard';

export const deck: FlashcardDeck = {
  topic: 'cap-theorem',
  title: 'CAP Theorem',
  description: 'Understand the CAP theorem, consistency models, partition tolerance, and how real-world distributed systems make tradeoffs between CP and AP.',
  icon: '🔺',
  cards: [
    {
      id: 'cap-1',
      front: 'What is the CAP theorem?',
      back: 'The CAP theorem (Brewer\'s theorem) states that a distributed data store can provide at most two of three guarantees simultaneously: Consistency (every read returns the most recent write), Availability (every request receives a non-error response), and Partition tolerance (the system operates despite network partitions). Since network partitions are unavoidable in distributed systems, the real choice is between CP (sacrifice availability during partitions) and AP (sacrifice consistency during partitions).',
      topic: 'cap-theorem',
    },
    {
      id: 'cap-2',
      front: 'Give examples of CP and AP systems.',
      back: 'CP systems (consistency over availability): HBase, MongoDB (with majority write concern), Zookeeper, etcd, Redis (single node). During a partition, these systems may reject requests rather than return stale data. AP systems (availability over consistency): Cassandra, DynamoDB, CouchDB, Riak. During a partition, these systems continue serving requests but may return stale data. Note: these are defaults; many systems are tunable. Cassandra can be configured for stronger consistency per query, and MongoDB can trade consistency for availability.',
      topic: 'cap-theorem',
    },
    {
      id: 'cap-3',
      front: 'What is eventual consistency?',
      back: 'Eventual consistency guarantees that if no new updates are made, all replicas will eventually converge to the same value. There is no bound on how long convergence takes (though in practice it is typically milliseconds to seconds). It is the weakest consistency model but offers the highest availability and performance. Used by DNS, Cassandra, DynamoDB, and most caching systems. Suitable when temporary staleness is acceptable (social media feeds, product catalogs). Clients may see stale reads, out-of-order updates, or different values from different replicas.',
      topic: 'cap-theorem',
    },
    {
      id: 'cap-4',
      front: 'What is strong consistency and when is it necessary?',
      back: 'Strong consistency (linearizability) guarantees that every read returns the result of the most recent completed write, as if there is a single copy of the data. Necessary for: financial transactions (account balances), inventory management (preventing overselling), distributed locks and coordination, and any scenario where stale reads cause correctness issues. Achieved via consensus protocols (Paxos, Raft) or synchronous replication. Cost: higher latency (must wait for quorum), lower availability during partitions, and reduced throughput.',
      topic: 'cap-theorem',
    },
    {
      id: 'cap-5',
      front: 'What is the PACELC theorem and how does it extend CAP?',
      back: 'PACELC extends CAP: "If there is a Partition, choose Availability or Consistency; Else (normal operation), choose Latency or Consistency." It addresses the fact that even without partitions, there is a tradeoff between consistency and latency. A system can be PA/EL (Cassandra: available during partitions, low latency normally), PC/EC (HBase: consistent always, higher latency), or PA/EC (hybrid). PACELC better captures the design tradeoffs in real distributed systems because partitions are rare; the latency-consistency tradeoff affects every request.',
      topic: 'cap-theorem',
    },
    {
      id: 'cap-6',
      front: 'What are quorum reads and writes?',
      back: 'In a system with N replicas, a quorum requires W nodes to acknowledge a write and R nodes to respond to a read, where W + R > N. This guarantees at least one node in a read quorum has the latest write. Common configurations: N=3, W=2, R=2 (balanced); N=3, W=3, R=1 (fast reads, slower writes); N=3, W=1, R=3 (fast writes, slower reads). Quorums provide tunable consistency without requiring all nodes. Used by Cassandra, DynamoDB, and Riak. Sloppy quorums relax the requirement during failures for higher availability.',
      topic: 'cap-theorem',
    },
    {
      id: 'cap-7',
      front: 'What is a split-brain scenario and how is it resolved?',
      back: 'Split-brain occurs when a network partition divides a cluster into two or more groups, each believing it is the active primary and accepting writes independently. This causes data divergence and conflicts. Resolution strategies: (1) Quorum/majority: only the partition with a majority of nodes can operate. (2) Fencing tokens: use monotonically increasing tokens; stale leaders are rejected. (3) STONITH (Shoot The Other Node In The Head): forcefully shut down the other partition. (4) Merge/conflict resolution: accept divergence and reconcile later (CRDTs, last-write-wins).',
      topic: 'cap-theorem',
    },
    {
      id: 'cap-8',
      front: 'What are CRDTs and how do they relate to eventual consistency?',
      back: 'CRDTs (Conflict-free Replicated Data Types) are data structures that can be replicated across nodes and updated independently without coordination, with a mathematically guaranteed merge function that produces a consistent result. Types: counters (G-Counter, PN-Counter), sets (G-Set, OR-Set), registers (LWW-Register), and maps. They enable strong eventual consistency: replicas that have received the same updates (in any order) are guaranteed to converge. Used in Redis CRDTs, Riak, collaborative editors, and offline-first apps.',
      topic: 'cap-theorem',
    },
    {
      id: 'cap-9',
      front: 'What is causal consistency?',
      back: 'Causal consistency guarantees that causally related operations are seen in the same order by all nodes, while concurrent (unrelated) operations may be seen in different orders. It is stronger than eventual consistency but weaker than strong consistency. Example: if user A posts a message and user B replies, all nodes must see the post before the reply. Implementation: vector clocks, Lamport timestamps, or causal dependency tracking. Offers a practical middle ground with better performance than strong consistency while preserving meaningful ordering guarantees.',
      topic: 'cap-theorem',
    },
    {
      id: 'cap-10',
      front: 'How does Google Spanner seemingly violate the CAP theorem?',
      back: 'Google Spanner provides strong consistency (linearizability) and high availability across globally distributed data. It appears to violate CAP but does not: it chooses CP and achieves very high availability (five 9s) by using Google\'s private network to minimize partition probability. Key innovations: TrueTime API (GPS and atomic clocks for globally synchronized timestamps) enables lock-free read-only transactions, and it uses Paxos for consensus across replicas. Spanner bets that partitions on Google\'s network are extremely rare, making the CP tradeoff nearly invisible.',
      topic: 'cap-theorem',
    },
  ],
};
