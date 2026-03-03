import { FlashcardDeck } from '@/types/flashcard';

export const deck: FlashcardDeck = {
  topic: 'load-balancing',
  title: 'Load Balancing',
  description: 'Master load balancing concepts including algorithms, L4 vs L7 balancing, health checks, sticky sessions, and high availability patterns.',
  icon: '⚖️',
  cards: [
    {
      id: 'lb-1',
      front: 'What is the difference between Layer 4 and Layer 7 load balancing?',
      back: 'Layer 4 (Transport) operates on TCP/UDP, routing based on IP and port without inspecting content. It is faster and simpler. Layer 7 (Application) inspects HTTP headers, URLs, cookies, and payload, enabling content-based routing, SSL termination, and more intelligent distribution. L7 adds latency but offers far greater flexibility.',
      topic: 'load-balancing',
    },
    {
      id: 'lb-2',
      front: 'Explain the Round Robin load balancing algorithm and its limitations.',
      back: 'Round Robin distributes requests sequentially across servers in order. It is simple and works well when servers have equal capacity and requests have similar cost. Limitations: it ignores server load and capacity differences, cannot account for long-lived connections, and may send requests to unhealthy servers without health checks. Weighted Round Robin addresses capacity differences by assigning proportional weights.',
      topic: 'load-balancing',
    },
    {
      id: 'lb-3',
      front: 'What are sticky sessions and when would you use them?',
      back: 'Sticky sessions (session affinity) route all requests from a given client to the same backend server, typically using cookies or IP hashing. Use cases: applications storing session state in server memory, shopping carts, or multi-step workflows. Downsides: uneven load distribution, reduced fault tolerance (server failure loses all its sessions), and difficulty scaling. Prefer stateless architectures with external session stores (e.g., Redis) instead.',
      topic: 'load-balancing',
    },
    {
      id: 'lb-4',
      front: 'How do health checks work in load balancing?',
      back: 'Health checks are periodic probes sent to backend servers to verify availability. Active checks: the load balancer sends requests (HTTP GET, TCP connect, or custom scripts) at intervals. Passive checks: the LB monitors live traffic for errors and timeouts. Servers failing checks are removed from the pool and re-added when healthy. Key parameters: check interval, timeout, healthy/unhealthy thresholds, and check endpoint depth (shallow ping vs. deep dependency check).',
      topic: 'load-balancing',
    },
    {
      id: 'lb-5',
      front: 'What is Consistent Hashing and why is it used in load balancing?',
      back: 'Consistent Hashing maps both servers and requests onto a hash ring. Each request is routed to the next server clockwise on the ring. When a server is added or removed, only a small fraction of requests are remapped (approximately 1/N), unlike traditional hashing where most mappings change. This is critical for caching layers and stateful services. Virtual nodes improve balance by giving each server multiple positions on the ring.',
      topic: 'load-balancing',
    },
    {
      id: 'lb-6',
      front: 'What is the Least Connections algorithm?',
      back: 'Least Connections routes each new request to the server with the fewest active connections. It adapts to varying request durations and server speeds better than Round Robin. Weighted Least Connections combines this with server capacity weights. It requires the load balancer to track connection counts in real time, adding slight overhead but producing significantly better load distribution for heterogeneous workloads.',
      topic: 'load-balancing',
    },
    {
      id: 'lb-7',
      front: 'How do you achieve high availability for the load balancer itself?',
      back: 'Deploy load balancers in an active-passive or active-active pair. Use a Virtual IP (VIP) with failover protocols like VRRP or keepalived. Active-passive: the standby takes over the VIP if the primary fails (seconds of downtime). Active-active: both handle traffic, using DNS round robin or anycast, providing higher throughput and instant failover. Cloud providers offer managed LBs with built-in HA across availability zones.',
      topic: 'load-balancing',
    },
    {
      id: 'lb-8',
      front: 'What is SSL/TLS termination at the load balancer and why is it beneficial?',
      back: 'SSL termination means the load balancer decrypts incoming HTTPS traffic and forwards plain HTTP to backend servers. Benefits: offloads CPU-intensive encryption from application servers, centralizes certificate management, enables L7 inspection of request content, and simplifies backend configuration. For end-to-end encryption, use SSL re-encryption (LB decrypts then re-encrypts) or SSL passthrough (L4 only, no inspection).',
      topic: 'load-balancing',
    },
    {
      id: 'lb-9',
      front: 'What is Global Server Load Balancing (GSLB)?',
      back: 'GSLB distributes traffic across geographically dispersed data centers using DNS-based routing. It considers factors like geographic proximity, data center health, and current load. Implementations use DNS responses with low TTLs, anycast routing, or dedicated GSLB appliances. Benefits: disaster recovery, reduced latency via geo-routing, and regulatory compliance by keeping data in specific regions. Challenges include DNS caching ignoring TTLs and increased complexity.',
      topic: 'load-balancing',
    },
    {
      id: 'lb-10',
      front: 'Compare hardware load balancers vs software load balancers.',
      back: 'Hardware LBs (e.g., F5 BIG-IP) are dedicated appliances with specialized ASICs for high throughput and low latency. They are expensive, less flexible, and harder to scale. Software LBs (e.g., NGINX, HAProxy, Envoy) run on commodity servers or containers. They are cheaper, highly configurable, easily automated, and scale horizontally. Modern trend strongly favors software LBs and cloud-managed LBs due to cost, agility, and infrastructure-as-code compatibility.',
      topic: 'load-balancing',
    },
  ],
};
