import { Lesson } from '@/types/lesson';

export const lesson: Lesson = {
  slug: 'load-balancing',
  title: 'Load Balancing',
  description:
    'Learn how load balancers distribute traffic across servers to improve reliability, scalability, and performance of distributed systems.',
  icon: 'scale',
  estimatedMinutes: 15,
  content: [
    {
      type: 'heading',
      content: 'What Is Load Balancing?',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'A load balancer sits between clients and a pool of backend servers, distributing incoming network requests so that no single server bears too much load. This improves throughput, reduces latency, and ensures the system remains available even when individual servers fail. Load balancers are one of the most fundamental building blocks in any scalable architecture.',
    },
    {
      type: 'diagram',
      caption: 'Basic load balancing architecture: clients route through a load balancer to multiple application servers',
      diagram: {
        nodes: [
          { id: 'client1', type: 'client', label: 'Client A', x: 50, y: 50 },
          { id: 'client2', type: 'client', label: 'Client B', x: 50, y: 200 },
          { id: 'client3', type: 'client', label: 'Client C', x: 50, y: 350 },
          { id: 'lb', type: 'loadBalancer', label: 'Load Balancer', x: 300, y: 200 },
          { id: 'server1', type: 'server', label: 'Server 1', x: 550, y: 50 },
          { id: 'server2', type: 'server', label: 'Server 2', x: 550, y: 200 },
          { id: 'server3', type: 'server', label: 'Server 3', x: 550, y: 350 },
          { id: 'db', type: 'database', label: 'Database', x: 750, y: 200 },
        ],
        connections: [
          { from: 'client1', to: 'lb', label: 'HTTPS' },
          { from: 'client2', to: 'lb', label: 'HTTPS' },
          { from: 'client3', to: 'lb', label: 'HTTPS' },
          { from: 'lb', to: 'server1', label: 'Forward' },
          { from: 'lb', to: 'server2', label: 'Forward' },
          { from: 'lb', to: 'server3', label: 'Forward' },
          { from: 'server1', to: 'db', style: 'dashed' },
          { from: 'server2', to: 'db', style: 'dashed' },
          { from: 'server3', to: 'db', style: 'dashed' },
        ],
      },
    },
    {
      type: 'heading',
      content: 'Load Balancing Algorithms',
      level: 2,
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Round Robin — Requests are distributed sequentially across servers. Simple and effective when servers have similar capacity.',
        'Weighted Round Robin — Like round robin, but servers with higher weights receive proportionally more requests. Useful when servers have different hardware specs.',
        'Least Connections — Sends each new request to the server with the fewest active connections. Ideal when request processing times vary widely.',
        'IP Hash — A hash of the client IP determines which server receives the request. This naturally provides session affinity without explicit sticky sessions.',
        'Least Response Time — Combines active connections and server response time to pick the fastest available server.',
      ],
    },
    {
      type: 'heading',
      content: 'Layer 4 vs Layer 7 Load Balancing',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'Layer 4 (L4) load balancers operate at the transport layer (TCP/UDP). They make routing decisions based on IP addresses and port numbers without inspecting the actual content of the packet. This makes them extremely fast and efficient but limited in routing flexibility. Layer 7 (L7) load balancers operate at the application layer (HTTP/HTTPS). They can inspect headers, cookies, URL paths, and even request bodies to make intelligent routing decisions. For example, an L7 load balancer can route /api/* requests to one server pool and /static/* requests to another.',
    },
    {
      type: 'code',
      language: 'nginx',
      content: `# Nginx L7 load balancer configuration example
upstream backend_servers {
    least_conn;                    # Use least-connections algorithm
    server 10.0.1.1:8080 weight=3; # Higher capacity server
    server 10.0.1.2:8080 weight=1;
    server 10.0.1.3:8080 weight=1;
}

server {
    listen 80;

    location /api/ {
        proxy_pass http://backend_servers;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /health {
        return 200 'OK';
    }
}`,
    },
    {
      type: 'heading',
      content: 'Health Checks & Sticky Sessions',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Health checks are periodic probes sent by the load balancer to each backend server to verify it is still responsive. If a server fails a configured number of consecutive health checks, the load balancer removes it from the active pool and stops routing traffic to it. Once the server recovers, it is automatically added back. Sticky sessions (session affinity) ensure that all requests from a particular client are sent to the same backend server. This is important when the server holds session state in memory. Sticky sessions can be implemented using cookies, IP hashing, or URL-encoded session IDs. However, they reduce the effectiveness of load balancing and make failover harder.',
    },
    {
      type: 'callout',
      variant: 'warning',
      content:
        'Sticky sessions work against the core goal of load balancing. If a server goes down, all sessions pinned to it are lost. Prefer stateless servers with externalized session storage (e.g., Redis) whenever possible.',
    },
    {
      type: 'quiz',
      question: {
        id: 'lb-q1',
        question:
          'Which load balancing algorithm is best suited for a system where some requests take milliseconds and others take several seconds to process?',
        options: [
          'Round Robin',
          'Least Connections',
          'IP Hash',
          'Random',
        ],
        correctIndex: 1,
        explanation:
          'Least Connections directs traffic to the server with the fewest active connections. When request durations vary widely, round robin can overload servers stuck processing slow requests, while least connections naturally adapts by routing new requests away from busy servers.',
      },
    },
  ],
};
