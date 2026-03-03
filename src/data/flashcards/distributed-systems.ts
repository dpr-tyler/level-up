import { FlashcardDeck } from '@/types/flashcard';

export const deck: FlashcardDeck = {
  topic: 'distributed-systems',
  title: 'Distributed Systems',
  description: 'Explore distributed systems fundamentals including consensus algorithms, leader election, vector clocks, distributed locking, and failure modes.',
  icon: '🔗',
  cards: [
    {
      id: 'ds-1',
      front: 'What is the consensus problem in distributed systems?',
      back: 'Consensus is the problem of getting multiple nodes to agree on a single value, even in the presence of failures. Requirements: Agreement (all correct nodes choose the same value), Validity (the chosen value was proposed by some node), Termination (all correct nodes eventually decide), and Integrity (each node decides at most once). The FLP impossibility theorem proves that deterministic consensus is impossible in an asynchronous system with even one crash failure. Practical algorithms (Paxos, Raft) work by making timing assumptions or using failure detectors.',
      topic: 'distributed-systems',
    },
    {
      id: 'ds-2',
      front: 'How does the Raft consensus algorithm work?',
      back: 'Raft achieves consensus through leader election and log replication. Nodes are in one of three states: Leader, Follower, or Candidate. (1) Leader election: if a follower receives no heartbeat within a timeout, it becomes a Candidate and requests votes. A candidate receiving majority votes becomes Leader. (2) Log replication: the leader accepts client requests, appends them to its log, and replicates to followers. Once a majority acknowledges, the entry is committed. (3) Safety: Raft guarantees logs are consistent through term numbers and log matching. Designed to be more understandable than Paxos.',
      topic: 'distributed-systems',
    },
    {
      id: 'ds-3',
      front: 'What are vector clocks and what problem do they solve?',
      back: 'Vector clocks track causality in distributed systems where physical clocks are unreliable. Each node maintains a vector of logical counters, one per node. Rules: increment your own counter on each event; when sending a message, include your vector; when receiving, merge (take max of each element) and increment yours. Comparison: V1 < V2 if all elements of V1 are less than or equal to V2 (and at least one is strictly less). If neither V1 < V2 nor V2 < V1, the events are concurrent. Used by DynamoDB and Riak to detect conflicting writes that need resolution.',
      topic: 'distributed-systems',
    },
    {
      id: 'ds-4',
      front: 'What is a distributed lock and what are the challenges?',
      back: 'A distributed lock provides mutual exclusion across multiple processes/nodes. Challenges: (1) Network delays: a node may hold a lock but be partitioned; others think it failed and acquire the lock, causing two holders. (2) Clock skew: TTL-based locks may expire at different real times on different nodes. (3) GC pauses: a lock holder may pause, miss renewal, and the lock is granted to another. Solutions: Redlock (Redis-based, controversial), Zookeeper ephemeral nodes, etcd lease-based locks. Fencing tokens (monotonically increasing IDs) protect against stale lock holders executing operations.',
      topic: 'distributed-systems',
    },
    {
      id: 'ds-5',
      front: 'What is the Two-Phase Commit (2PC) protocol and its limitations?',
      back: 'Two-Phase Commit coordinates distributed transactions. Phase 1 (Prepare): the coordinator asks all participants to prepare (vote yes/no). Phase 2 (Commit/Abort): if all vote yes, the coordinator sends commit; if any votes no, it sends abort. Limitations: blocking protocol (participants hold locks while waiting for the coordinator\'s decision), single point of failure (coordinator crash blocks all participants), high latency (two round trips), and does not tolerate network partitions well. Three-Phase Commit (3PC) reduces blocking but is more complex and still has edge cases.',
      topic: 'distributed-systems',
    },
    {
      id: 'ds-6',
      front: 'What is the Byzantine Generals Problem?',
      back: 'The Byzantine Generals Problem describes achieving consensus when some nodes may be actively malicious (Byzantine faults), sending different information to different nodes. A system with N nodes can tolerate up to f Byzantine faults if N >= 3f + 1. Solutions: PBFT (Practical Byzantine Fault Tolerance) for permissioned systems, and blockchain protocols (Proof of Work, Proof of Stake) for permissionless systems. Most internal distributed systems assume crash-stop failures (not Byzantine) because nodes are trusted, simplifying consensus to protocols like Raft and Paxos.',
      topic: 'distributed-systems',
    },
    {
      id: 'ds-7',
      front: 'What is a gossip protocol?',
      back: 'Gossip protocols (epidemic protocols) spread information through a cluster by having each node periodically share state with a random subset of peers, similar to how rumors spread. Properties: highly fault-tolerant, eventually consistent, scalable (O(log N) rounds to propagate), and decentralized (no leader or coordinator). Use cases: failure detection (heartbeat gossip), membership lists, metric aggregation, and data dissemination. Used by Cassandra (cluster membership), Consul (health checking), and SWIM (failure detection). Tradeoff: eventual convergence means temporary inconsistency.',
      topic: 'distributed-systems',
    },
    {
      id: 'ds-8',
      front: 'What is the difference between fail-stop and fail-recover failure models?',
      back: 'Fail-stop: a node crashes and permanently stops. Other nodes can eventually detect this (timeout-based). Simplest failure model; algorithms can assume failed nodes never return. Fail-recover (crash-recovery): a node crashes but may restart later with durable state intact (from disk/WAL). Algorithms must handle nodes rejoining with potentially stale state. More realistic than fail-stop. Additionally: omission failures (messages are lost), timing failures (responses are late), and Byzantine failures (arbitrary/malicious behavior). System design must specify which failure model is assumed.',
      topic: 'distributed-systems',
    },
    {
      id: 'ds-9',
      front: 'What is a consistent hash ring and how does it handle node failures?',
      back: 'A consistent hash ring maps both keys and nodes onto a circular hash space. Keys are assigned to the first node encountered clockwise. When a node fails, only the keys mapped to that node are redistributed to the next node on the ring, minimizing disruption (approximately 1/N keys move). Virtual nodes: each physical node gets multiple positions on the ring, improving balance and reducing hotspots. Replication: keys are copied to the next K nodes on the ring for fault tolerance. Used by Cassandra, DynamoDB, and Memcached for data partitioning and replica placement.',
      topic: 'distributed-systems',
    },
    {
      id: 'ds-10',
      front: 'What are idempotency and exactly-once semantics in distributed systems?',
      back: 'In distributed systems, messages can be duplicated due to retries after timeouts. Idempotency ensures that processing the same operation multiple times produces the same result as processing it once. Achieving exactly-once semantics requires: (1) At-least-once delivery (retry until acknowledged). (2) Idempotent processing (deduplication using unique request IDs, or naturally idempotent operations). Implementation: store processed request IDs in a dedup table with TTL. Truly achieving exactly-once across system boundaries is practically impossible; the goal is effectively-once through idempotent design.',
      topic: 'distributed-systems',
    },
  ],
};
