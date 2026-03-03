import { FlashcardDeck } from '@/types/flashcard';

export const deck: FlashcardDeck = {
  topic: 'cdns',
  title: 'CDNs',
  description: 'Explore Content Delivery Networks including push vs pull strategies, edge caching, cache invalidation, and CDN architecture patterns.',
  icon: '🌐',
  cards: [
    {
      id: 'cdn-1',
      front: 'What is a CDN and what problems does it solve?',
      back: 'A Content Delivery Network is a globally distributed network of edge servers that cache and serve content from locations geographically close to users. Problems solved: (1) High latency from distant origin servers. (2) Origin server overload from traffic spikes. (3) Poor performance for global user bases. (4) DDoS vulnerability (CDN absorbs attack traffic). (5) Bandwidth costs (offload origin traffic). CDNs serve static assets (images, CSS, JS), video streams, and increasingly dynamic content. Major providers: Cloudflare, AWS CloudFront, Akamai, Fastly.',
      topic: 'cdns',
    },
    {
      id: 'cdn-2',
      front: 'What is the difference between push and pull CDN strategies?',
      back: 'Pull CDN: the edge server fetches content from the origin on the first request (cache miss), then caches it for subsequent requests. Simple to set up; content is cached on demand. Best for sites with many assets and unpredictable access patterns. Push CDN: you proactively upload content to CDN edge servers before users request it. Gives more control over what is cached. Better for large, infrequently changing files (videos, software releases). More complex to manage. Most CDNs use pull with the option to pre-warm (push) specific content.',
      topic: 'cdns',
    },
    {
      id: 'cdn-3',
      front: 'How does CDN cache invalidation work?',
      back: 'Methods: (1) TTL-based expiration: content expires after a set time (Cache-Control headers). Simple but stale until expiry. (2) Purge/invalidation API: explicitly remove content from all edge servers. Used for urgent updates but can take seconds to propagate globally. (3) Versioned URLs (cache busting): include a hash or version in the URL (app.abc123.js). Old URLs stay cached, new URLs are fetched fresh. Most reliable method. (4) Stale-while-revalidate: serve stale content while asynchronously fetching fresh content. Best practice: use versioned URLs for assets and short TTLs + purge for dynamic content.',
      topic: 'cdns',
    },
    {
      id: 'cdn-4',
      front: 'What is an edge server and how does CDN routing work?',
      back: 'Edge servers are CDN nodes deployed in points of presence (PoPs) worldwide, located close to end users. Routing methods: (1) DNS-based: CDN DNS resolves to the nearest edge server IP based on the user\'s DNS resolver location. (2) Anycast: multiple edge servers share the same IP address; BGP routing directs packets to the nearest one. (3) HTTP redirect: origin redirects the client to the optimal edge. Anycast is increasingly preferred for its simplicity and instant failover. PoPs are typically placed in major ISP data centers and internet exchange points.',
      topic: 'cdns',
    },
    {
      id: 'cdn-5',
      front: 'How do CDNs handle dynamic content?',
      back: 'Traditionally CDNs cached only static content, but modern CDNs increasingly accelerate dynamic content: (1) Route optimization: CDNs maintain optimized network paths between edge and origin (faster than public internet). (2) Connection reuse: persistent connections between edge and origin reduce TCP/TLS setup overhead. (3) Edge computing: run custom logic at the edge (Cloudflare Workers, Lambda@Edge) to generate dynamic responses. (4) Short TTL caching: cache dynamic content briefly (seconds). (5) ESI (Edge Side Includes): assemble pages at the edge from cached and dynamic fragments.',
      topic: 'cdns',
    },
    {
      id: 'cdn-6',
      front: 'What is a multi-CDN strategy and when should you use one?',
      back: 'Multi-CDN uses multiple CDN providers simultaneously, routing traffic to the best-performing one based on real-time performance data, geography, or cost. Benefits: no vendor lock-in, higher resilience (CDN outages happen), better global coverage (different CDNs have different PoP strengths), and cost optimization through traffic steering. Use cases: mission-critical applications, global services, and live streaming. Implementation: DNS-level switching, or a meta-CDN layer that routes based on performance tests. Adds operational complexity and requires sophisticated monitoring.',
      topic: 'cdns',
    },
    {
      id: 'cdn-7',
      front: 'How do CDNs handle SSL/TLS?',
      back: 'CDNs terminate TLS at the edge so users connect securely to a nearby PoP rather than the distant origin. Options: (1) Full SSL: TLS between client and edge, and between edge and origin. Most secure. (2) Flexible SSL: TLS between client and edge only; edge to origin is plain HTTP. Easy but insecure for the backend hop. (3) Custom certificates: upload your own certificates to the CDN. (4) Managed certificates: CDN automatically provisions and renews certificates (e.g., via Let\'s Encrypt). CDN TLS termination also enables HTTP/2 and HTTP/3 at the edge.',
      topic: 'cdns',
    },
    {
      id: 'cdn-8',
      front: 'What is the origin shield pattern?',
      back: 'An origin shield is an intermediate CDN caching layer between edge servers and the origin. Instead of every edge PoP independently requesting from the origin on cache misses, they first check the origin shield (a designated CDN PoP). Benefits: dramatically reduces load on the origin server (one cache miss fills the shield, subsequent edge misses hit the shield instead of origin), better cache hit ratios, and lower origin bandwidth costs. Tradeoff: adds one extra hop for initial requests. Highly recommended for origins with limited capacity.',
      topic: 'cdns',
    },
    {
      id: 'cdn-9',
      front: 'How do CDNs protect against DDoS attacks?',
      back: 'CDNs provide several DDoS protection layers: (1) Massive distributed capacity absorbs volumetric attacks across thousands of PoPs. (2) Anycast routing disperses attack traffic geographically. (3) Rate limiting and WAF (Web Application Firewall) rules filter malicious requests at the edge. (4) Bot detection and CAPTCHA challenges. (5) Always-on vs. on-demand mitigation. (6) Traffic scrubbing centers for large attacks. The CDN acts as a reverse proxy, hiding the origin server\'s IP. Major CDN providers can absorb attacks exceeding 1 Tbps.',
      topic: 'cdns',
    },
    {
      id: 'cdn-10',
      front: 'What Cache-Control headers are most important for CDN configuration?',
      back: 'Key headers: max-age=N (cache for N seconds), s-maxage=N (CDN-specific max age, overrides max-age for shared caches), no-cache (must revalidate with origin before serving), no-store (never cache), private (only browser cache, not CDN), public (CDN can cache), stale-while-revalidate=N (serve stale for N seconds while fetching fresh), stale-if-error=N (serve stale if origin errors). Best practice: long max-age with versioned URLs for static assets, short s-maxage with stale-while-revalidate for dynamic content.',
      topic: 'cdns',
    },
  ],
};
