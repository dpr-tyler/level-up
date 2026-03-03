import { FlashcardDeck } from '@/types/flashcard';

export const deck: FlashcardDeck = {
  topic: 'rate-limiting',
  title: 'Rate Limiting',
  description: 'Learn rate limiting algorithms and strategies including token bucket, sliding window, distributed rate limiting, and API throttling patterns.',
  icon: '🚦',
  cards: [
    {
      id: 'rl-1',
      front: 'What is the token bucket algorithm?',
      back: 'Token bucket maintains a bucket that fills with tokens at a fixed rate (e.g., 10 tokens/second) up to a maximum capacity. Each request consumes one token. If the bucket is empty, the request is rejected or queued. Benefits: allows bursts up to the bucket capacity while enforcing an average rate, simple to implement, and memory efficient (just a counter and timestamp). Used by AWS API Gateway, NGINX, and many rate limiters. Variant: requests can cost multiple tokens based on weight/cost.',
      topic: 'rate-limiting',
    },
    {
      id: 'rl-2',
      front: 'How does the sliding window log algorithm work?',
      back: 'The sliding window log stores timestamps of all requests in the current window. When a new request arrives, it removes entries older than the window duration, counts remaining entries, and allows the request if the count is below the limit. Pros: very accurate, no boundary issues like fixed windows. Cons: high memory usage (stores every timestamp), expensive cleanup for high-traffic APIs. A sorted set in Redis is a common implementation. Best for low-to-medium traffic endpoints where precision matters.',
      topic: 'rate-limiting',
    },
    {
      id: 'rl-3',
      front: 'What is the sliding window counter algorithm and how does it improve on fixed windows?',
      back: 'Fixed window counters reset at boundaries (e.g., every minute), causing the "boundary burst" problem: a client could make 2x the limit by timing requests across two windows. Sliding window counter combines the current window count with a weighted portion of the previous window. Example: at 70% through the current window, effective count = current_count + previous_count * 0.30. This smooths the boundary transition with minimal memory (just two counters per window). Widely used for its balance of accuracy and efficiency.',
      topic: 'rate-limiting',
    },
    {
      id: 'rl-4',
      front: 'How do you implement distributed rate limiting across multiple servers?',
      back: 'Centralized store: use Redis or Memcached as a shared counter (most common). Each server checks/increments the counter atomically (MULTI/EXEC or Lua scripts in Redis). Challenges: adds latency per request, Redis becomes a dependency. Alternatives: (1) Local rate limiting per instance (approximate, no coordination). (2) Sticky sessions to route a user to the same server. (3) Token bucket with periodic sync (each node has a local bucket, periodically syncs with central store). (4) Gossip protocol for eventually consistent rate state across nodes.',
      topic: 'rate-limiting',
    },
    {
      id: 'rl-5',
      front: 'What is the leaky bucket algorithm?',
      back: 'The leaky bucket processes requests at a fixed rate, like water leaking from a bucket at a constant rate. Incoming requests are added to a FIFO queue (the bucket). If the queue is full, new requests are dropped. A processor removes requests from the queue at a fixed rate. Difference from token bucket: leaky bucket enforces a strict constant output rate (smooths bursts), while token bucket allows bursts up to capacity. Leaky bucket is useful when the downstream system requires a constant processing rate.',
      topic: 'rate-limiting',
    },
    {
      id: 'rl-6',
      front: 'How should rate limit information be communicated to API clients?',
      back: 'Use standard HTTP headers: X-RateLimit-Limit (max requests per window), X-RateLimit-Remaining (requests left in current window), X-RateLimit-Reset (Unix timestamp or seconds until window resets). When the limit is exceeded, return HTTP 429 Too Many Requests with a Retry-After header indicating when to retry. Include a clear error message in the response body. Some APIs also use RateLimit-Policy header (IETF draft) to describe the rate limit policy. Good documentation and client SDKs should handle 429 with exponential backoff.',
      topic: 'rate-limiting',
    },
    {
      id: 'rl-7',
      front: 'What are common rate limiting strategies by key?',
      back: 'By IP address: simplest but unreliable with shared IPs (NAT, proxies) and spoofable IPs. By API key/token: most common for authenticated APIs; ties limits to the customer/plan. By user ID: for authenticated endpoints; prevents a single user from consuming disproportionate resources. By endpoint: different limits per operation (stricter for writes, looser for reads). Compound keys: combine multiple dimensions (user + endpoint). Tiered limits: different plans get different quotas (free: 100/hr, pro: 10,000/hr). Apply the most specific applicable limit.',
      topic: 'rate-limiting',
    },
    {
      id: 'rl-8',
      front: 'What is the difference between rate limiting, throttling, and load shedding?',
      back: 'Rate limiting: hard cap on request count per time window per client/key. Protects the API from individual abuse. Throttling: intentionally slowing down processing (e.g., adding delays) rather than rejecting outright. Used to degrade gracefully. Load shedding: dropping requests when the system is overloaded to protect core functionality, typically based on system load rather than per-client limits. Priority-based shedding drops low-priority requests first. These are complementary strategies often used together in a defense-in-depth approach.',
      topic: 'rate-limiting',
    },
    {
      id: 'rl-9',
      front: 'How do you rate limit in a microservices architecture?',
      back: 'Options: (1) API Gateway: centralized rate limiting at the entry point; simple but only applies to external traffic. (2) Service mesh (Envoy/Istio): rate limiting at the sidecar proxy level for both external and inter-service traffic. (3) Dedicated rate limiting service: a shared service (e.g., Envoy ratelimit service) that other services query; flexible but adds a network hop. (4) Per-service local limits: each service enforces its own limits. Best practice: combine gateway-level limits for external clients with service-level limits for internal protection.',
      topic: 'rate-limiting',
    },
    {
      id: 'rl-10',
      front: 'What is adaptive rate limiting?',
      back: 'Adaptive rate limiting dynamically adjusts limits based on current system health rather than using fixed thresholds. When the system detects high latency, increased error rates, or resource saturation, it automatically tightens limits. When load decreases, limits are relaxed. Implementation: monitor key metrics (CPU, latency p99, error rate, queue depth), and use a feedback loop to adjust the allowed request rate. Benefits: better resource utilization during low traffic, and automatic protection during unexpected load. More complex but significantly more resilient than static limits.',
      topic: 'rate-limiting',
    },
  ],
};
