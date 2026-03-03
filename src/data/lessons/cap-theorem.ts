import { Lesson } from '@/types/lesson';

export const lesson: Lesson = {
  slug: 'cap-theorem',
  title: 'CAP Theorem',
  description:
    'Understand the fundamental trade-offs in distributed data stores: consistency, availability, and partition tolerance.',
  icon: 'triangle',
  estimatedMinutes: 12,
  content: [
    {
      type: 'heading',
      content: 'The CAP Theorem Explained',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'The CAP theorem, proposed by Eric Brewer in 2000 and later proved by Seth Gilbert and Nancy Lynch, states that a distributed data store can provide at most two out of three guarantees simultaneously: Consistency, Availability, and Partition Tolerance. This is not a matter of engineering effort — it is a mathematical impossibility to achieve all three at once when network partitions occur.',
    },
    {
      type: 'list',
      items: [
        'Consistency (C): Every read receives the most recent write or an error. All nodes see the same data at the same time.',
        'Availability (A): Every request receives a non-error response, without the guarantee that it contains the most recent write.',
        'Partition Tolerance (P): The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network between nodes.',
      ],
      ordered: false,
    },
    {
      type: 'callout',
      variant: 'warning',
      content:
        'In any real-world distributed system, network partitions are inevitable. This means you are always choosing between CP and AP — you cannot avoid partition tolerance. The "pick two" framing is slightly misleading; the real question is: when a partition happens, do you sacrifice consistency or availability?',
    },
    {
      type: 'heading',
      content: 'Visualizing a Network Partition',
      level: 3,
    },
    {
      type: 'diagram',
      caption: 'Three database nodes experiencing a network partition between Node A and Node C',
      diagram: {
        nodes: [
          { id: 'client1', type: 'client', label: 'Client (West)', x: 50, y: 50 },
          { id: 'nodeA', type: 'database', label: 'Node A (Primary)', x: 250, y: 50 },
          { id: 'nodeB', type: 'database', label: 'Node B (Replica)', x: 250, y: 250 },
          { id: 'nodeC', type: 'database', label: 'Node C (Replica)', x: 450, y: 150 },
          { id: 'client2', type: 'client', label: 'Client (East)', x: 650, y: 150 },
        ],
        connections: [
          { from: 'client1', to: 'nodeA', label: 'writes', style: 'solid' },
          { from: 'nodeA', to: 'nodeB', label: 'replicates', style: 'solid' },
          { from: 'nodeA', to: 'nodeC', label: 'partition!', style: 'dashed' },
          { from: 'nodeB', to: 'nodeC', label: 'partition!', style: 'dashed' },
          { from: 'client2', to: 'nodeC', label: 'reads stale?', style: 'solid' },
        ],
      },
    },
    {
      type: 'heading',
      content: 'CP vs AP Systems',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'CP systems prioritize consistency over availability. When a partition occurs, a CP system will refuse to respond to requests rather than return potentially stale data. Examples include HBase, MongoDB (with majority write concern), and ZooKeeper. These are ideal for systems where correctness is critical, such as financial transactions or inventory management.',
    },
    {
      type: 'paragraph',
      content:
        'AP systems prioritize availability over consistency. When a partition occurs, an AP system will continue serving requests but may return stale data. Examples include Cassandra, CouchDB, and DynamoDB (in its default configuration). These work well for use cases like social media feeds, analytics, and shopping carts where slight staleness is acceptable.',
    },
    {
      type: 'code',
      language: 'python',
      content: `# Simulating a CP vs AP decision in a distributed key-value store

class CPStore:
    """CP system: rejects writes during partition"""
    def write(self, key, value):
        if not self.can_reach_majority():
            raise UnavailableError("Cannot reach quorum — refusing write")
        self.replicate_to_majority(key, value)
        return "Write acknowledged"

class APStore:
    """AP system: accepts writes during partition, resolves later"""
    def write(self, key, value):
        self.write_local(key, value, timestamp=now())
        self.queue_replication(key, value)  # will sync when partition heals
        return "Write acknowledged (may be eventually consistent)"`,
    },
    {
      type: 'heading',
      content: 'Eventual Consistency',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Eventual consistency is the model used by most AP systems. It guarantees that, if no new updates are made to a given piece of data, eventually all reads will return the last updated value. The "eventually" part depends on replication lag, conflict resolution strategies, and network conditions. Techniques like vector clocks, last-writer-wins (LWW), and conflict-free replicated data types (CRDTs) help manage conflicts when partitions heal.',
    },
    {
      type: 'callout',
      variant: 'tip',
      content:
        'Many modern databases let you tune consistency on a per-query basis. For example, Cassandra allows you to set consistency levels like ONE, QUORUM, or ALL for each read and write operation, effectively sliding between AP and CP behavior depending on the use case.',
    },
    {
      type: 'quiz',
      question: {
        id: 'cap-theorem-q1',
        question:
          'A social media platform needs to display user posts. During a network partition, it is acceptable to show slightly outdated posts rather than displaying an error. Which CAP trade-off is this system making?',
        options: [
          'CP — it prioritizes consistency over availability',
          'AP — it prioritizes availability over consistency',
          'CA — it prioritizes consistency and availability over partition tolerance',
          'CAP — it achieves all three guarantees',
        ],
        correctIndex: 1,
        explanation:
          'This is an AP system. By choosing to show potentially stale posts rather than an error during a partition, the system sacrifices consistency (users might see outdated data) in favor of availability (the system always responds). CA is not realistic in distributed systems because partitions are unavoidable.',
      },
    },
  ],
};
