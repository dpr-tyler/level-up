import { FlashcardDeck } from '@/types/flashcard';

export const deck: FlashcardDeck = {
  topic: 'api-design',
  title: 'API Design',
  description: 'Master API design principles including REST, GraphQL, gRPC, versioning, idempotency, pagination, and authentication patterns.',
  icon: '🔌',
  cards: [
    {
      id: 'api-1',
      front: 'What are the key principles of RESTful API design?',
      back: 'REST (Representational State Transfer) principles: (1) Resource-based URLs (/users/123, not /getUser). (2) HTTP verbs for actions: GET (read), POST (create), PUT (full update), PATCH (partial update), DELETE (remove). (3) Statelessness: each request contains all information needed. (4) Standard HTTP status codes (200, 201, 404, 500). (5) HATEOAS: responses include links to related resources. (6) Consistent naming: plural nouns, kebab-case, hierarchical nesting for relationships (/users/123/orders).',
      topic: 'api-design',
    },
    {
      id: 'api-2',
      front: 'Compare REST, GraphQL, and gRPC. When would you use each?',
      back: 'REST: simple, widely understood, good for CRUD operations, can over-fetch/under-fetch data. Best for public APIs and simple services. GraphQL: client specifies exactly what data it needs in a single request, eliminating over/under-fetching. Best for complex UIs with varied data needs, mobile clients minimizing bandwidth. Adds query complexity and caching challenges. gRPC: binary protocol (Protocol Buffers), strongly typed, bidirectional streaming, high performance. Best for internal service-to-service communication. Less browser-friendly without a proxy.',
      topic: 'api-design',
    },
    {
      id: 'api-3',
      front: 'What is idempotency and why is it critical in API design?',
      back: 'An idempotent operation produces the same result regardless of how many times it is called. GET, PUT, DELETE are naturally idempotent. POST is not. Why it matters: network failures and retries can cause duplicate requests. Without idempotency, retrying a payment POST could charge twice. Implementation: clients send a unique idempotency key (e.g., UUID in a header); the server stores the key and returns the cached response for duplicates. Critical for payment processing, order creation, and any state-changing operation.',
      topic: 'api-design',
    },
    {
      id: 'api-4',
      front: 'What are common API versioning strategies?',
      back: 'URI versioning (/v1/users): most visible, easy to understand, but pollutes URLs. Header versioning (Accept: application/vnd.api+json;version=1): cleaner URLs but harder to test and discover. Query parameter (?version=1): easy to implement but inconsistent. Content negotiation: uses Accept headers to specify format and version. Best practices: version from day one, support at least N-1 versions, deprecate with clear timelines, use semantic versioning for breaking changes. URI versioning is most common in practice.',
      topic: 'api-design',
    },
    {
      id: 'api-5',
      front: 'How should you implement pagination in APIs?',
      back: 'Offset-based (page=2&limit=20): simple but slow for large offsets (DB must skip rows), inconsistent when data is inserted/deleted between pages. Cursor-based (after=abc123&limit=20): uses an opaque cursor (often encoded last-seen ID) for efficient, consistent pagination. Best for real-time feeds and large datasets. Keyset pagination: similar to cursor but uses explicit column values (e.g., created_at > X). Include metadata: total count (if affordable), next/previous links, and whether more pages exist.',
      topic: 'api-design',
    },
    {
      id: 'api-6',
      front: 'What is the difference between authentication and authorization in APIs?',
      back: 'Authentication (AuthN): verifying identity ("who are you?"). Methods: API keys, OAuth 2.0 tokens, JWT, Basic Auth, mTLS. Authorization (AuthZ): verifying permissions ("what can you do?"). Methods: RBAC (role-based), ABAC (attribute-based), ACLs, policy engines (OPA). Common pattern: authenticate via JWT/OAuth token, then authorize using claims/roles in the token or by querying a permission service. Always use HTTPS. API keys authenticate applications; OAuth tokens authenticate users.',
      topic: 'api-design',
    },
    {
      id: 'api-7',
      front: 'How should APIs handle errors?',
      back: 'Use appropriate HTTP status codes: 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 409 (conflict), 422 (validation error), 429 (rate limited), 500 (server error). Return a consistent error response body with: error code (machine-readable), message (human-readable), details (field-level validation errors), and a request/trace ID for debugging. Never expose internal implementation details or stack traces. Document all error codes. Use Problem Details (RFC 7807) for a standardized format.',
      topic: 'api-design',
    },
    {
      id: 'api-8',
      front: 'What is rate limiting in the context of API design?',
      back: 'Rate limiting controls how many requests a client can make in a time window to protect the API from abuse and overload. Communicate limits via headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, and Retry-After (on 429 responses). Strategies: per-user, per-API-key, per-endpoint, or tiered by plan. Implement with token bucket or sliding window algorithms. For public APIs, also consider throttling (slowing responses) and quotas (daily/monthly limits) in addition to per-second rate limits.',
      topic: 'api-design',
    },
    {
      id: 'api-9',
      front: 'What are webhooks and how do they differ from polling?',
      back: 'Webhooks are HTTP callbacks: the server sends a POST request to a client-registered URL when an event occurs (push model). Polling: the client repeatedly requests the server for updates at intervals (pull model). Webhooks are more efficient (no wasted requests) and near-real-time but require the client to expose an endpoint, handle retries, and manage security (signature verification). Best practices: sign payloads (HMAC), implement retry with exponential backoff, provide a way to replay missed events, and keep payloads small with links to full data.',
      topic: 'api-design',
    },
    {
      id: 'api-10',
      front: 'What is HATEOAS and is it worth implementing?',
      back: 'HATEOAS (Hypermedia as the Engine of Application State) is a REST constraint where API responses include links to related actions and resources, allowing clients to navigate the API dynamically without hardcoding URLs. Example: a GET /orders/123 response includes links for "cancel", "pay", "items". Benefits: self-documenting, decouples clients from URL structure, enables API evolution. In practice: rarely fully implemented because it adds response size and complexity, and most API clients are not built to follow hypermedia links dynamically. Consider it for public APIs with diverse clients.',
      topic: 'api-design',
    },
  ],
};
