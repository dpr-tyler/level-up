import { Lesson } from '@/types/lesson';

export const lesson: Lesson = {
  slug: 'distributed-systems',
  title: 'Distributed Systems Fundamentals',
  description:
    'Understand the core challenges of building systems that span multiple machines: consensus, replication, and fault tolerance.',
  icon: 'network',
  estimatedMinutes: 14,
  content: [
    {
      type: 'heading',
      content: 'What Makes a System Distributed?',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'A distributed system is a collection of independent computers that appears to its users as a single coherent system. The machines communicate over a network, coordinate their actions, and share state to accomplish tasks that no single machine could handle alone. Examples range from large-scale web services and databases to blockchain networks and multiplayer games. The key characteristic is that components run on separate processes or machines and must deal with the inherent unreliability of network communication.',
    },
    {
      type: 'heading',
      content: 'Core Challenges',
      level: 3,
    },
    {
      type: 'list',
      items: [
        'Network partitions: Communication links between nodes can fail, causing subsets of the system to become isolated from each other. The system must handle partial failures gracefully.',
        'Clock skew: There is no single global clock. Each machine has its own clock that drifts at different rates, making it impossible to precisely order events across machines using wall-clock time alone.',
        'Consensus: Getting all nodes to agree on a value or decision is fundamentally difficult in the presence of failures. This is formalized by results like the FLP impossibility theorem.',
        'Partial failures: Unlike a single machine that is either up or down, distributed systems can be partially available. Some nodes might be healthy while others are crashed or unreachable.',
        'Byzantine faults: In some systems, nodes may behave arbitrarily (including maliciously). Tolerating these faults requires specialized protocols and is much more expensive than crash-fault tolerance.',
      ],
      ordered: false,
    },
    {
      type: 'diagram',
      caption: 'A distributed cluster with a leader node coordinating replicas across data centers',
      diagram: {
        nodes: [
          { id: 'lb', type: 'loadBalancer', label: 'Load Balancer', x: 350, y: 30 },
          { id: 'leader', type: 'server', label: 'Leader Node', x: 350, y: 200 },
          { id: 'follower1', type: 'server', label: 'Follower (DC-1)', x: 100, y: 370 },
          { id: 'follower2', type: 'server', label: 'Follower (DC-2)', x: 350, y: 370 },
          { id: 'follower3', type: 'server', label: 'Follower (DC-3)', x: 600, y: 370 },
          { id: 'db1', type: 'database', label: 'DB Replica', x: 100, y: 530 },
          { id: 'db2', type: 'database', label: 'DB Replica', x: 350, y: 530 },
          { id: 'db3', type: 'database', label: 'DB Replica', x: 600, y: 530 },
        ],
        connections: [
          { from: 'lb', to: 'leader', label: 'route writes', style: 'solid' },
          { from: 'leader', to: 'follower1', label: 'replicate', style: 'solid' },
          { from: 'leader', to: 'follower2', label: 'replicate', style: 'solid' },
          { from: 'leader', to: 'follower3', label: 'replicate', style: 'solid' },
          { from: 'follower1', to: 'db1', style: 'solid' },
          { from: 'follower2', to: 'db2', style: 'solid' },
          { from: 'follower3', to: 'db3', style: 'solid' },
          { from: 'follower1', to: 'follower3', label: 'heartbeat', style: 'dashed' },
        ],
      },
    },
    {
      type: 'heading',
      content: 'Leader Election and Consensus',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Leader election is the process by which distributed nodes agree on a single node to act as the coordinator. The leader handles writes, makes ordering decisions, and replicates state to followers. When a leader fails, the remaining nodes must detect the failure (via heartbeat timeouts) and elect a new leader without causing split-brain scenarios where two nodes believe they are the leader simultaneously.',
    },
    {
      type: 'paragraph',
      content:
        'Raft and Paxos are the two most well-known consensus algorithms. Raft, designed for understandability, divides consensus into three sub-problems: leader election, log replication, and safety. A candidate requests votes from peers; if it receives a majority, it becomes leader and begins accepting client requests. Paxos is older and more general but notoriously difficult to implement correctly. Both guarantee that the system will agree on the same sequence of operations as long as a majority of nodes are available.',
    },
    {
      type: 'code',
      language: 'python',
      content: `# Simplified Raft leader election logic

class RaftNode:
    def __init__(self, node_id: str, peers: list[str]):
        self.id = node_id
        self.peers = peers
        self.current_term = 0
        self.voted_for = None
        self.state = "follower"  # follower | candidate | leader

    def start_election(self):
        """Called when heartbeat timeout expires."""
        self.current_term += 1
        self.state = "candidate"
        self.voted_for = self.id
        votes_received = 1  # vote for self

        for peer in self.peers:
            vote = self.request_vote(peer, self.current_term)
            if vote.granted:
                votes_received += 1

        majority = (len(self.peers) + 1) // 2 + 1
        if votes_received >= majority:
            self.state = "leader"
            self.send_heartbeats()  # prevent new elections
        else:
            self.state = "follower"  # lost election, wait`,
    },
    {
      type: 'heading',
      content: 'Replication Strategies',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Synchronous replication waits for all (or a majority of) replicas to acknowledge a write before confirming it to the client. This guarantees strong consistency but increases write latency and reduces availability during partitions. Asynchronous replication confirms the write as soon as the leader persists it, replicating to followers in the background. This is faster but risks data loss if the leader fails before replication completes. Semi-synchronous (quorum-based) replication is a common middle ground: a write is acknowledged once W out of N replicas confirm it, where W is typically a majority.',
    },
    {
      type: 'callout',
      variant: 'info',
      content:
        'Vector clocks and Lamport timestamps solve the ordering problem that wall-clock time cannot. A vector clock is a list of counters, one per node, that increment on each event. By comparing vector clocks, you can determine if one event causally happened before another, or if two events are concurrent (and therefore may conflict). Systems like DynamoDB and Riak use vector clocks for conflict detection in multi-master setups.',
    },
    {
      type: 'callout',
      variant: 'tip',
      content:
        'When studying distributed systems, remember the "Eight Fallacies of Distributed Computing": the network is reliable, latency is zero, bandwidth is infinite, the network is secure, topology does not change, there is one administrator, transport cost is zero, and the network is homogeneous. Every one of these assumptions is wrong, and designing around them is what makes distributed systems engineering difficult.',
    },
    {
      type: 'quiz',
      question: {
        id: 'distributed-systems-q1',
        question:
          'In a Raft cluster with 5 nodes, what is the minimum number of nodes that must be available for the cluster to elect a new leader and continue processing writes?',
        options: [
          '2 nodes',
          '3 nodes (a majority)',
          '4 nodes',
          'All 5 nodes',
        ],
        correctIndex: 1,
        explanation:
          'Raft requires a strict majority (quorum) to elect a leader and commit writes. For a 5-node cluster, the majority is 3 (which is 5/2 + 1 rounded down, i.e., floor(5/2) + 1 = 3). With 3 healthy nodes, a candidate can receive enough votes to win election and the leader can replicate log entries to a majority. This means the cluster can tolerate up to 2 node failures while remaining operational.',
      },
    },
  ],
};
