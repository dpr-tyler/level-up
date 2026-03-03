import { Lesson } from '@/types/lesson';

export const lesson: Lesson = {
  slug: 'api-design',
  title: 'API Design',
  description:
    'Master the principles of designing robust, scalable APIs including REST conventions, HTTP semantics, versioning, pagination, rate limiting, and API gateways.',
  icon: 'plug',
  estimatedMinutes: 18,
  content: [
    {
      type: 'heading',
      content: 'REST Principles',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'REST (Representational State Transfer) is an architectural style for designing networked applications. A well-designed REST API treats URLs as resources (nouns, not verbs), uses standard HTTP methods to perform operations on those resources, and returns appropriate status codes. Key constraints include statelessness (each request contains all the information needed to process it), a uniform interface (consistent URL patterns and response formats), and resource-based design (URLs identify resources, HTTP methods define actions). These constraints make REST APIs predictable, cacheable, and easy to consume.',
    },
    {
      type: 'heading',
      content: 'HTTP Methods & Status Codes',
      level: 2,
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'GET — Retrieve a resource. Must be safe (no side effects) and idempotent. Returns 200 on success.',
        'POST — Create a new resource. Not idempotent. Returns 201 with a Location header pointing to the new resource.',
        'PUT — Replace an entire resource. Idempotent. Returns 200 or 204.',
        'PATCH — Partially update a resource. Returns 200 with the updated resource.',
        'DELETE — Remove a resource. Idempotent. Returns 204 (no content) on success.',
        '400 Bad Request — Client sent invalid data. 401 Unauthorized — Authentication required. 403 Forbidden — Authenticated but not authorized. 404 Not Found — Resource does not exist. 429 Too Many Requests — Rate limit exceeded. 500 Internal Server Error — Server-side failure.',
      ],
    },
    {
      type: 'code',
      language: 'typescript',
      content: `// Well-designed REST API routes
// Resource: /api/v1/users
GET    /api/v1/users              // List users (paginated)
GET    /api/v1/users/:id          // Get a specific user
POST   /api/v1/users              // Create a new user
PATCH  /api/v1/users/:id          // Update user fields
DELETE /api/v1/users/:id          // Delete a user

// Nested resources
GET    /api/v1/users/:id/orders   // List orders for a user

// Filtering, sorting, and pagination via query params
GET    /api/v1/orders?status=shipped&sort=-created_at&page=2&limit=20

// Example response with pagination metadata
{
  "data": [ { "id": "ord_123", "status": "shipped" }, ... ],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 143,
    "hasMore": true
  }
}`,
    },
    {
      type: 'heading',
      content: 'API Versioning',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'As your API evolves, breaking changes are inevitable. Versioning allows you to introduce new behavior without disrupting existing consumers. URL path versioning (e.g., /api/v1/users, /api/v2/users) is the most explicit and widely used approach. Header-based versioning (Accept: application/vnd.myapi.v2+json) keeps URLs clean but is less discoverable. Query parameter versioning (?version=2) is simple but pollutes the query string. Whichever approach you choose, maintain backward compatibility as long as possible, communicate deprecation timelines clearly, and version at the API level rather than individual endpoints.',
    },
    {
      type: 'diagram',
      caption: 'API gateway architecture: a single entry point routes requests to internal services and enforces cross-cutting concerns',
      diagram: {
        nodes: [
          { id: 'mobile', type: 'client', label: 'Mobile App', x: 50, y: 80 },
          { id: 'web', type: 'client', label: 'Web App', x: 50, y: 250 },
          { id: 'gateway', type: 'loadBalancer', label: 'API Gateway', x: 280, y: 165 },
          { id: 'auth', type: 'server', label: 'Auth Service', x: 520, y: 50 },
          { id: 'users', type: 'server', label: 'User Service', x: 520, y: 180 },
          { id: 'orders', type: 'server', label: 'Order Service', x: 520, y: 310 },
          { id: 'cache', type: 'cache', label: 'Rate Limit Store', x: 280, y: 370 },
        ],
        connections: [
          { from: 'mobile', to: 'gateway', label: 'HTTPS' },
          { from: 'web', to: 'gateway', label: 'HTTPS' },
          { from: 'gateway', to: 'auth', label: '/auth/*' },
          { from: 'gateway', to: 'users', label: '/users/*' },
          { from: 'gateway', to: 'orders', label: '/orders/*' },
          { from: 'gateway', to: 'cache', label: 'Check rate limit', style: 'dashed' },
        ],
      },
    },
    {
      type: 'heading',
      content: 'Rate Limiting',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'Rate limiting controls how many requests a client can make in a given time window. It protects your API from abuse, prevents resource exhaustion, and ensures fair usage across consumers. Common algorithms include fixed window (e.g., 100 requests per minute, resets at the top of each minute), sliding window (smooths out burst behavior at window boundaries), token bucket (tokens are added at a fixed rate; each request consumes a token), and leaky bucket (requests are processed at a constant rate; excess requests are queued or rejected). Rate limit state is typically stored in Redis for fast lookups. Return 429 Too Many Requests with Retry-After and X-RateLimit-Remaining headers.',
    },
    {
      type: 'heading',
      content: 'GraphQL vs REST',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'GraphQL is an alternative to REST where clients specify exactly what data they need in a single query. This eliminates over-fetching (getting more data than needed) and under-fetching (requiring multiple requests to assemble complete data). GraphQL uses a strongly typed schema, supports real-time subscriptions, and allows frontend teams to iterate without backend changes. However, GraphQL introduces complexity around caching (URLs are no longer unique cache keys), authorization (field-level access control), and performance (deeply nested queries can be expensive). REST remains the better choice for simple CRUD APIs, public APIs with many consumers, and teams that prefer convention over configuration.',
    },
    {
      type: 'callout',
      variant: 'info',
      content:
        'An API Gateway sits in front of your microservices and handles cross-cutting concerns: authentication, rate limiting, request routing, protocol translation, response caching, logging, and SSL termination. Popular options include Kong, AWS API Gateway, and Nginx. The gateway provides a single entry point for all clients, simplifying the client experience while allowing internal services to evolve independently.',
    },
    {
      type: 'callout',
      variant: 'tip',
      content:
        'For pagination, prefer cursor-based pagination over offset-based for large datasets. Offset pagination (page=5&limit=20) becomes inefficient because the database must scan and skip all preceding rows. Cursor-based pagination (after=cursor_abc&limit=20) uses an indexed field to start directly at the right position, providing consistent performance regardless of how deep into the dataset you paginate.',
    },
    {
      type: 'quiz',
      question: {
        id: 'api-q1',
        question:
          'Why is cursor-based pagination preferred over offset-based pagination for large datasets?',
        options: [
          'Cursor-based pagination returns more data per request.',
          'Cursor-based pagination does not require a database query.',
          'Cursor-based pagination avoids scanning and skipping rows, providing consistent O(log n) performance via indexed lookups.',
          'Cursor-based pagination automatically caches results.',
        ],
        correctIndex: 2,
        explanation:
          'Offset-based pagination (OFFSET 10000 LIMIT 20) requires the database to scan and discard 10,000 rows before returning the 20 you want, making deep pages progressively slower. Cursor-based pagination uses a WHERE clause on an indexed column (e.g., WHERE id > last_seen_id LIMIT 20), which uses an index seek to jump directly to the correct position. This provides consistent performance regardless of how deep into the dataset you are paginating.',
      },
    },
  ],
};
