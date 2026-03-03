export const TOPICS = [
  { slug: 'load-balancing', title: 'Load Balancing', icon: '⚖️' },
  { slug: 'caching', title: 'Caching', icon: '💾' },
  { slug: 'databases', title: 'Databases', icon: '🗄️' },
  { slug: 'message-queues', title: 'Message Queues', icon: '📨' },
  { slug: 'microservices-vs-monolith', title: 'Microservices vs Monolith', icon: '🏗️' },
  { slug: 'api-design', title: 'API Design', icon: '🔌' },
  { slug: 'cap-theorem', title: 'CAP Theorem', icon: '🔺' },
  { slug: 'rate-limiting', title: 'Rate Limiting', icon: '🚦' },
  { slug: 'cdns', title: 'CDNs', icon: '🌐' },
  { slug: 'dns', title: 'DNS', icon: '📡' },
  { slug: 'distributed-systems', title: 'Distributed Systems', icon: '🔗' },
  { slug: 'scaling-strategies', title: 'Scaling Strategies', icon: '📈' },
] as const;

export const CHALLENGE_SLUGS = [
  'design-twitter',
  'design-url-shortener',
  'design-chat-app',
  'design-video-streaming',
  'design-rate-limiter',
] as const;

export type TopicSlug = typeof TOPICS[number]['slug'];
