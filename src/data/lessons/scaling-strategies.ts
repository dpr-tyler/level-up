import { Lesson } from '@/types/lesson';

export const lesson: Lesson = {
  slug: 'scaling-strategies',
  title: 'Scaling Strategies',
  description:
    'Master the art of scaling systems from a single server to a global architecture using horizontal scaling, sharding, and auto-scaling.',
  icon: 'arrowUpRight',
  estimatedMinutes: 13,
  content: [
    {
      type: 'heading',
      content: 'Vertical vs Horizontal Scaling',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'Vertical scaling (scaling up) means adding more resources — CPU, RAM, disk — to a single machine. It is the simplest approach: no code changes are needed, and it works until you hit the physical limits of the hardware. Horizontal scaling (scaling out) means adding more machines to your pool and distributing the workload across them. It is more complex but offers virtually unlimited growth potential and better fault tolerance since no single machine is a point of failure.',
    },
    {
      type: 'list',
      items: [
        'Vertical scaling: Simpler, no distributed coordination needed, limited by hardware ceiling (you cannot buy an infinitely powerful server), creates a single point of failure.',
        'Horizontal scaling: More complex (requires load balancing, stateless design, data partitioning), but offers linear cost scaling and high availability through redundancy.',
      ],
      ordered: false,
    },
    {
      type: 'heading',
      content: 'Designing Stateless Services',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Horizontal scaling requires services to be stateless: any request can be handled by any server instance. This means session data, user state, and caches must be externalized — stored in shared systems like Redis, a database, or object storage rather than in-memory on a single server. When a server instance can be added, removed, or replaced without affecting correctness, you have achieved true horizontal scalability.',
    },
    {
      type: 'diagram',
      caption: 'A horizontally scaled architecture with stateless app servers, shared database, and auto-scaling',
      diagram: {
        nodes: [
          { id: 'users', type: 'client', label: 'Users', x: 50, y: 200 },
          { id: 'lb', type: 'loadBalancer', label: 'Load Balancer', x: 220, y: 200 },
          { id: 'app1', type: 'server', label: 'App Server 1', x: 420, y: 50 },
          { id: 'app2', type: 'server', label: 'App Server 2', x: 420, y: 200 },
          { id: 'app3', type: 'server', label: 'App Server 3', x: 420, y: 350 },
          { id: 'cache', type: 'cache', label: 'Redis (Sessions)', x: 630, y: 50 },
          { id: 'dbPrimary', type: 'database', label: 'DB Primary', x: 630, y: 200 },
          { id: 'dbReplica', type: 'database', label: 'DB Read Replica', x: 630, y: 350 },
        ],
        connections: [
          { from: 'users', to: 'lb', label: 'HTTPS', style: 'solid' },
          { from: 'lb', to: 'app1', label: 'round robin', style: 'solid' },
          { from: 'lb', to: 'app2', style: 'solid' },
          { from: 'lb', to: 'app3', style: 'solid' },
          { from: 'app1', to: 'cache', style: 'dashed' },
          { from: 'app2', to: 'cache', style: 'dashed' },
          { from: 'app2', to: 'dbPrimary', label: 'writes', style: 'solid' },
          { from: 'app3', to: 'dbReplica', label: 'reads', style: 'solid' },
          { from: 'dbPrimary', to: 'dbReplica', label: 'replication', style: 'dashed' },
        ],
      },
    },
    {
      type: 'heading',
      content: 'Database Scaling and Read Replicas',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Databases are typically the hardest component to scale horizontally. Read replicas are the first step: a primary database handles all writes, and one or more replicas asynchronously receive a copy of the data to serve read queries. Since most applications are read-heavy (often 80-90% reads), this simple pattern can multiply your database throughput dramatically. Services like Amazon RDS, Cloud SQL, and Aurora make read replica setup straightforward.',
    },
    {
      type: 'heading',
      content: 'Sharding Strategies',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'When read replicas are not enough — typically when write volume exceeds what a single primary can handle — you need sharding (also called horizontal partitioning). Sharding splits your data across multiple database instances, each holding a subset of the total data. The challenge lies in choosing a good shard key and handling cross-shard queries.',
    },
    {
      type: 'code',
      language: 'python',
      content: `# Sharding strategies illustrated

def hash_based_shard(user_id: str, num_shards: int) -> int:
    """Hash-based sharding: deterministic, evenly distributed.
    Downside: adding shards requires rehashing (mitigated by consistent hashing).
    """
    return hash(user_id) % num_shards

def range_based_shard(user_id: int) -> str:
    """Range-based sharding: users 1-1M on shard A, 1M-2M on shard B, etc.
    Good for sequential access. Risk: hot spots if ranges are uneven.
    """
    if user_id < 1_000_000:
        return "shard_a"
    elif user_id < 2_000_000:
        return "shard_b"
    else:
        return "shard_c"

def directory_based_shard(user_id: str, lookup_service) -> str:
    """Directory-based sharding: a lookup service maps keys to shards.
    Most flexible but the directory is a potential bottleneck and SPOF.
    """
    return lookup_service.get_shard_for(user_id)`,
    },
    {
      type: 'callout',
      variant: 'warning',
      content:
        'Choose your shard key carefully. A poor shard key leads to hot spots where one shard receives disproportionate traffic. For example, sharding by country would put the majority of traffic on a few shards. A good shard key distributes data and queries evenly. User ID is often a good choice for user-centric applications. Once data is sharded, changing the shard key is extremely difficult and may require a full data migration.',
    },
    {
      type: 'heading',
      content: 'Auto-Scaling and Capacity Planning',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Auto-scaling automatically adjusts the number of running instances based on metrics like CPU utilization, request count, or queue depth. Cloud providers offer auto-scaling groups (AWS), instance groups (GCP), and scale sets (Azure) that can add or remove instances within minutes. The key metrics to configure are: the scaling trigger (e.g., CPU > 70%), the cooldown period (to prevent flapping), and minimum/maximum instance counts (to control costs and prevent runaway scaling).',
    },
    {
      type: 'callout',
      variant: 'tip',
      content:
        'Capacity planning is not just about handling peak load — it is about understanding your growth trajectory. Track key metrics over time: requests per second, p99 latency, database connections, memory usage, and disk I/O. Use these trends to predict when you will need to scale. A common rule of thumb is to provision for 2-3x your current peak to handle organic growth and unexpected spikes without emergency scaling.',
    },
    {
      type: 'quiz',
      question: {
        id: 'scaling-strategies-q1',
        question:
          'Your application has a 90/10 read-to-write ratio and the database is the bottleneck. The primary database CPU is at 85% during peak hours. What is the most effective first step to scale the database layer?',
        options: [
          'Shard the database by user ID to distribute writes',
          'Add read replicas to offload read traffic from the primary',
          'Vertically scale the primary database to a larger instance',
          'Implement a write-behind cache to buffer all database writes',
        ],
        correctIndex: 1,
        explanation:
          'With a 90/10 read-to-write ratio, most of the CPU load on the primary database comes from read queries. Adding read replicas allows you to offload those reads, potentially reducing the primary load by up to 90%. This is simpler and less risky than sharding, which is typically reserved for when write volume alone overwhelms the primary. Vertical scaling provides only temporary relief and does not address the underlying distribution problem.',
      },
    },
  ],
};
