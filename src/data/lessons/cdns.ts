import { Lesson } from '@/types/lesson';

export const lesson: Lesson = {
  slug: 'cdns',
  title: 'Content Delivery Networks',
  description:
    'Learn how CDNs accelerate content delivery by caching assets at edge locations around the world.',
  icon: 'globe',
  estimatedMinutes: 10,
  content: [
    {
      type: 'heading',
      content: 'What Is a CDN?',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'A Content Delivery Network (CDN) is a geographically distributed network of servers that caches and serves content from locations close to end users. Instead of every request traveling to your origin server — which might be in a single data center — the CDN serves cached copies from the nearest edge node. This dramatically reduces latency, decreases load on your origin, and improves resilience against traffic spikes and DDoS attacks.',
    },
    {
      type: 'diagram',
      caption: 'CDN edge nodes distributing content from the origin server to global users',
      diagram: {
        nodes: [
          { id: 'origin', type: 'server', label: 'Origin Server', x: 350, y: 50 },
          { id: 'edgeUS', type: 'cdn', label: 'Edge (US West)', x: 100, y: 220 },
          { id: 'edgeEU', type: 'cdn', label: 'Edge (Europe)', x: 350, y: 220 },
          { id: 'edgeAsia', type: 'cdn', label: 'Edge (Asia)', x: 600, y: 220 },
          { id: 'userUS', type: 'client', label: 'US User', x: 100, y: 400 },
          { id: 'userEU', type: 'client', label: 'EU User', x: 350, y: 400 },
          { id: 'userAsia', type: 'client', label: 'Asia User', x: 600, y: 400 },
        ],
        connections: [
          { from: 'origin', to: 'edgeUS', label: 'pull / push', style: 'solid' },
          { from: 'origin', to: 'edgeEU', label: 'pull / push', style: 'solid' },
          { from: 'origin', to: 'edgeAsia', label: 'pull / push', style: 'solid' },
          { from: 'edgeUS', to: 'userUS', label: '~20ms', style: 'solid' },
          { from: 'edgeEU', to: 'userEU', label: '~15ms', style: 'solid' },
          { from: 'edgeAsia', to: 'userAsia', label: '~25ms', style: 'solid' },
        ],
      },
    },
    {
      type: 'heading',
      content: 'Push vs Pull CDNs',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Pull CDNs fetch content from the origin server on the first request and cache it at the edge. Subsequent requests are served from cache until the TTL expires. This is the most common model — services like CloudFront, Cloudflare, and Fastly operate this way. Pull CDNs are easy to set up and work well when traffic patterns are unpredictable.',
    },
    {
      type: 'paragraph',
      content:
        'Push CDNs require you to explicitly upload content to the CDN. You control exactly what is cached and when it is updated. This model works well for large, infrequently changing files (like video libraries) where you want precise control over storage and cache behavior. The trade-off is more operational complexity.',
    },
    {
      type: 'heading',
      content: 'Cache Headers and Invalidation',
      level: 3,
    },
    {
      type: 'code',
      language: 'http',
      content: `# Common cache control headers that instruct CDN behavior

# Cache for 1 year (immutable assets with hashed filenames)
Cache-Control: public, max-age=31536000, immutable

# Cache for 10 minutes, revalidate with origin after expiry
Cache-Control: public, max-age=600, must-revalidate

# Do not cache (dynamic/private content)
Cache-Control: no-store, no-cache, private

# ETag for conditional requests (CDN sends If-None-Match)
ETag: "a1b2c3d4"

# Last-Modified for conditional requests
Last-Modified: Wed, 18 Feb 2026 10:00:00 GMT`,
    },
    {
      type: 'callout',
      variant: 'warning',
      content:
        'Cache invalidation is one of the hardest problems in computer science. When you update content, stale copies may persist on CDN edge nodes until the TTL expires. Strategies to mitigate this include: using versioned or content-hashed URLs (e.g., app.a3f8c2.js), issuing explicit purge/invalidation requests via the CDN API, and using shorter TTLs for frequently changing content. Phil Karlton famously said there are only two hard things in computer science: cache invalidation and naming things.',
    },
    {
      type: 'heading',
      content: 'Benefits Beyond Performance',
      level: 3,
    },
    {
      type: 'list',
      items: [
        'Reduced latency: Content served from edge nodes closest to the user, cutting round-trip time from hundreds of milliseconds to single digits.',
        'Bandwidth savings: Cached content reduces the number of requests hitting your origin, lowering bandwidth costs significantly.',
        'DDoS protection: CDNs absorb and distribute attack traffic across their global network, preventing your origin from being overwhelmed.',
        'High availability: If one edge node fails, traffic is routed to the next closest node automatically.',
        'TLS termination: CDN handles SSL/TLS at the edge, offloading cryptographic work from your origin servers.',
      ],
      ordered: false,
    },
    {
      type: 'callout',
      variant: 'tip',
      content:
        'Modern CDNs like Cloudflare Workers and CloudFront Functions allow you to run code at the edge, enabling use cases beyond static caching: A/B testing, geolocation-based routing, request transformation, and authentication checks — all at the edge with sub-millisecond cold starts.',
    },
    {
      type: 'quiz',
      question: {
        id: 'cdns-q1',
        question:
          'Your application deploys new JavaScript bundles with each release. You want aggressive caching at the CDN but also need users to immediately get the latest code after a deployment. What is the best strategy?',
        options: [
          'Set Cache-Control: no-cache on all JavaScript files',
          'Use content-hashed filenames (e.g., app.a3f8c2.js) with a long max-age',
          'Manually purge the CDN cache after every deployment',
          'Set a very short TTL of 30 seconds on all assets',
        ],
        correctIndex: 1,
        explanation:
          'Content-hashed filenames are the gold standard for static asset caching. Because the filename changes whenever the content changes, you can set an aggressive max-age (e.g., 1 year) without worrying about stale content. Old versions remain cached (harmless) and new deployments generate new filenames that are fetched fresh. This avoids cache purge complexity and short-TTL performance penalties.',
      },
    },
  ],
};
