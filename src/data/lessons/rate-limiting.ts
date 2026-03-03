import { Lesson } from '@/types/lesson';

export const lesson: Lesson = {
  slug: 'rate-limiting',
  title: 'Rate Limiting',
  description:
    'Learn how to protect your services from abuse and ensure fair usage with rate limiting algorithms and strategies.',
  icon: 'gauge',
  estimatedMinutes: 10,
  content: [
    {
      type: 'heading',
      content: 'Why Rate Limiting Matters',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'Rate limiting controls the number of requests a client can make to a service within a given time window. Without it, a single misbehaving client — whether malicious or buggy — can overwhelm your servers, degrade performance for other users, and drive up infrastructure costs. Rate limiting is a critical component of API design, DDoS mitigation, and service reliability.',
    },
    {
      type: 'diagram',
      caption: 'Rate limiter sitting between clients and backend servers',
      diagram: {
        nodes: [
          { id: 'client1', type: 'client', label: 'Mobile App', x: 50, y: 50 },
          { id: 'client2', type: 'client', label: 'Web App', x: 50, y: 200 },
          { id: 'client3', type: 'client', label: 'Third-Party API', x: 50, y: 350 },
          { id: 'rateLimiter', type: 'firewall', label: 'Rate Limiter', x: 280, y: 200 },
          { id: 'server1', type: 'server', label: 'API Server 1', x: 500, y: 100 },
          { id: 'server2', type: 'server', label: 'API Server 2', x: 500, y: 300 },
        ],
        connections: [
          { from: 'client1', to: 'rateLimiter', label: '100 req/s', style: 'solid' },
          { from: 'client2', to: 'rateLimiter', label: '50 req/s', style: 'solid' },
          { from: 'client3', to: 'rateLimiter', label: '200 req/s', style: 'solid' },
          { from: 'rateLimiter', to: 'server1', label: 'allowed', style: 'solid' },
          { from: 'rateLimiter', to: 'server2', label: 'allowed', style: 'solid' },
        ],
      },
    },
    {
      type: 'heading',
      content: 'Rate Limiting Algorithms',
      level: 3,
    },
    {
      type: 'list',
      items: [
        'Token Bucket: A bucket holds tokens that are refilled at a fixed rate. Each request consumes a token. If the bucket is empty, the request is rejected. Allows short bursts up to bucket capacity.',
        'Leaky Bucket: Requests enter a FIFO queue (the bucket) and are processed at a constant rate. If the queue is full, new requests are dropped. Produces a perfectly smooth output rate.',
        'Fixed Window Counter: Divides time into fixed windows (e.g., 1-minute intervals) and counts requests per window. Simple but susceptible to burst traffic at window boundaries.',
        'Sliding Window Log: Tracks timestamps of all requests. Counts requests within a rolling time window. Precise but memory-intensive for high-traffic systems.',
        'Sliding Window Counter: Combines fixed window and sliding window approaches by weighting the previous window count. A good balance of accuracy and efficiency.',
      ],
      ordered: false,
    },
    {
      type: 'code',
      language: 'python',
      content: `import time
from collections import defaultdict

class TokenBucketRateLimiter:
    """Token bucket algorithm: allows bursts up to bucket capacity."""

    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity          # max tokens in the bucket
        self.refill_rate = refill_rate    # tokens added per second
        self.buckets: dict[str, dict] = defaultdict(
            lambda: {"tokens": capacity, "last_refill": time.time()}
        )

    def allow_request(self, client_id: str) -> bool:
        bucket = self.buckets[client_id]
        now = time.time()

        # Refill tokens based on elapsed time
        elapsed = now - bucket["last_refill"]
        bucket["tokens"] = min(
            self.capacity,
            bucket["tokens"] + elapsed * self.refill_rate
        )
        bucket["last_refill"] = now

        if bucket["tokens"] >= 1:
            bucket["tokens"] -= 1
            return True   # Request allowed
        return False      # Rate limited — return HTTP 429

# Allow 10 requests per second, burst up to 20
limiter = TokenBucketRateLimiter(capacity=20, refill_rate=10)`,
    },
    {
      type: 'heading',
      content: 'HTTP 429 and Response Headers',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'When a client exceeds their rate limit, the server should respond with HTTP status 429 (Too Many Requests). Well-designed APIs include response headers to help clients understand and respect rate limits: X-RateLimit-Limit (total allowed), X-RateLimit-Remaining (requests left in the current window), X-RateLimit-Reset (when the window resets, as a Unix timestamp), and Retry-After (seconds to wait before retrying).',
    },
    {
      type: 'callout',
      variant: 'info',
      content:
        'In a distributed system with multiple API server instances, you need a centralized rate limiter. Redis is the most popular choice — its atomic INCR and EXPIRE commands make it ideal for implementing distributed counters. Tools like Redis-based rate limiters, Envoy proxy, and API gateway services (AWS API Gateway, Kong) provide built-in distributed rate limiting.',
    },
    {
      type: 'heading',
      content: 'Distributed Rate Limiting Strategies',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'When rate limiting across multiple servers, you have several options. A centralized approach using Redis provides accuracy but adds latency for each request. A local-only approach divides the quota across servers (e.g., 100 req/s across 5 servers = 20 req/s each) but is imprecise when traffic is uneven. A hybrid approach performs local checks first and syncs with the central store periodically, providing a good balance of performance and accuracy.',
    },
    {
      type: 'callout',
      variant: 'tip',
      content:
        'Consider implementing different rate limits for different tiers of users or API endpoints. Authentication endpoints might have stricter limits (5 requests/minute) to prevent brute-force attacks, while read-heavy endpoints can be more generous (1000 requests/minute). This is sometimes called tiered or adaptive rate limiting.',
    },
    {
      type: 'quiz',
      question: {
        id: 'rate-limiting-q1',
        question:
          'You are designing a rate limiter for a payment processing API. It should allow occasional burst traffic (e.g., flash sales) while maintaining a steady average rate. Which algorithm is the best fit?',
        options: [
          'Fixed Window Counter — simple and easy to implement',
          'Leaky Bucket — guarantees a smooth, constant output rate',
          'Token Bucket — allows controlled bursts up to bucket capacity',
          'Sliding Window Log — provides the most precise tracking',
        ],
        correctIndex: 2,
        explanation:
          'The token bucket algorithm is ideal here because it naturally supports burst traffic (requests can consume accumulated tokens quickly) while enforcing an average rate over time via the refill rate. The leaky bucket would not allow bursts since it processes at a constant rate. Fixed window has boundary issues, and sliding window log is memory-intensive and does not inherently support bursts.',
      },
    },
  ],
};
