import { Challenge } from '@/types/challenge';

export const challenge: Challenge = {
  slug: 'design-chat-app',
  title: 'Design Chat App',
  description:
    'Design a real-time messaging application like WhatsApp or Slack that supports one-on-one and group conversations with media sharing and presence indicators.',
  icon: '💬',
  difficulty: 'advanced',
  requirements: {
    scale: '50M daily active users',
    latency: '<100ms message delivery',
    availability: '99.99%',
    storage: '1PB messages/year',
  },
  steps: [
    {
      id: 'chat-connection',
      title: 'Connection Protocol',
      description:
        'What protocol should clients use to maintain real-time communication with the server?',
      category: 'Networking',
      options: [
        {
          id: 'chat-conn-websocket',
          label: 'WebSocket Connections',
          description:
            'Establish persistent WebSocket connections between clients and servers for full-duplex, low-latency message delivery.',
          score: 10,
          feedback:
            'WebSockets provide true bidirectional communication with minimal overhead per message. They are the industry standard for chat applications and easily meet the <100ms delivery target.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-client-a', type: 'client', label: 'Client A', x: 100, y: 200 },
              { id: 'chat-client-b', type: 'client', label: 'Client B', x: 100, y: 500 },
              { id: 'chat-lb', type: 'loadBalancer', label: 'Load Balancer', x: 300, y: 350 },
              { id: 'chat-ws-1', type: 'server', label: 'WebSocket\nServer 1', x: 500, y: 200 },
              { id: 'chat-ws-2', type: 'server', label: 'WebSocket\nServer 2', x: 500, y: 500 },
            ],
            addConnections: [
              { from: 'chat-client-a', to: 'chat-lb', label: 'WS Connect' },
              { from: 'chat-client-b', to: 'chat-lb', label: 'WS Connect' },
              { from: 'chat-lb', to: 'chat-ws-1', label: 'Sticky session' },
              { from: 'chat-lb', to: 'chat-ws-2', label: 'Sticky session' },
            ],
          },
        },
        {
          id: 'chat-conn-sse',
          label: 'Server-Sent Events + HTTP',
          description:
            'Use SSE for server-to-client messages and regular HTTP POST for client-to-server messages.',
          score: 7,
          feedback:
            'SSE works for receiving messages but sending requires separate HTTP requests. This adds latency and overhead compared to WebSockets, though it is simpler to implement.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-client-a', type: 'client', label: 'Client A', x: 100, y: 200 },
              { id: 'chat-client-b', type: 'client', label: 'Client B', x: 100, y: 500 },
              { id: 'chat-lb', type: 'loadBalancer', label: 'Load Balancer', x: 300, y: 350 },
              { id: 'chat-ws-1', type: 'server', label: 'SSE Server', x: 500, y: 350 },
            ],
            addConnections: [
              { from: 'chat-client-a', to: 'chat-lb', label: 'SSE + HTTP' },
              { from: 'chat-client-b', to: 'chat-lb', label: 'SSE + HTTP' },
              { from: 'chat-lb', to: 'chat-ws-1', label: 'Route' },
            ],
          },
        },
        {
          id: 'chat-conn-polling',
          label: 'Long Polling',
          description:
            'Clients make HTTP requests that the server holds open until a new message is available, then immediately reconnect.',
          score: 4,
          feedback:
            'Long polling works but wastes server resources holding open connections and adds reconnection overhead. At 50M users this creates enormous connection churn.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-client-a', type: 'client', label: 'Client A', x: 100, y: 200 },
              { id: 'chat-client-b', type: 'client', label: 'Client B', x: 100, y: 500 },
              { id: 'chat-lb', type: 'loadBalancer', label: 'Load Balancer', x: 300, y: 350 },
              { id: 'chat-ws-1', type: 'server', label: 'HTTP Server', x: 500, y: 350 },
            ],
            addConnections: [
              { from: 'chat-client-a', to: 'chat-lb', label: 'Long poll' },
              { from: 'chat-client-b', to: 'chat-lb', label: 'Long poll' },
              { from: 'chat-lb', to: 'chat-ws-1', label: 'Route' },
            ],
          },
        },
      ],
    },
    {
      id: 'chat-delivery',
      title: 'Message Delivery',
      description:
        'How should messages be routed between users who may be connected to different servers?',
      category: 'Core Feature',
      options: [
        {
          id: 'chat-delivery-pubsub-queue',
          label: 'Message Queue with Pub/Sub',
          description:
            'Publish messages to a distributed queue (Kafka). Each WebSocket server subscribes to relevant channels and pushes messages to connected clients.',
          score: 10,
          feedback:
            'Kafka pub/sub decouples senders from receivers. Messages are delivered regardless of which server each user is connected to, and Kafka guarantees ordering within partitions.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-msg-queue', type: 'queue', label: 'Message Queue\n(Kafka)', x: 700, y: 350 },
            ],
            addConnections: [
              { from: 'chat-ws-1', to: 'chat-msg-queue', label: 'Publish msg' },
              { from: 'chat-msg-queue', to: 'chat-ws-2', label: 'Deliver to recipient' },
              { from: 'chat-msg-queue', to: 'chat-ws-1', label: 'Deliver to sender', style: 'dashed' },
            ],
          },
        },
        {
          id: 'chat-delivery-direct',
          label: 'Direct Server-to-Server',
          description:
            'Maintain a routing table of which user is on which server and forward messages directly between WebSocket servers.',
          score: 7,
          feedback:
            'Direct routing is fast but creates tight coupling between servers. If a server crashes, messages in transit are lost. You also need a reliable session registry.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-session-store', type: 'cache', label: 'Session Registry', x: 700, y: 350 },
            ],
            addConnections: [
              { from: 'chat-ws-1', to: 'chat-session-store', label: 'Lookup server' },
              { from: 'chat-ws-1', to: 'chat-ws-2', label: 'Forward msg', style: 'dashed' },
            ],
          },
        },
        {
          id: 'chat-delivery-db-poll',
          label: 'Database Write + Client Polling',
          description:
            'Write all messages to a database and have clients poll for new messages periodically.',
          score: 2,
          feedback:
            'Polling defeats the purpose of real-time chat. Even at 1-second intervals, 50M users create 50M queries/sec on the database. Delivery latency would far exceed 100ms.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-msg-db-temp', type: 'database', label: 'Message DB', x: 700, y: 350 },
            ],
            addConnections: [
              { from: 'chat-ws-1', to: 'chat-msg-db-temp', label: 'Write msg' },
            ],
          },
        },
      ],
    },
    {
      id: 'chat-presence',
      title: 'Presence System',
      description:
        'How should you track and broadcast whether users are online, offline, or typing?',
      category: 'Features',
      options: [
        {
          id: 'chat-presence-redis-heartbeat',
          label: 'Redis with Heartbeat TTL',
          description:
            'Store presence status in Redis with a TTL key per user. Clients send heartbeats every 30 seconds; expired keys indicate offline status.',
          score: 10,
          feedback:
            'Redis TTL-based presence is elegant and self-healing. If a client disconnects unexpectedly, the key expires automatically. Redis pub/sub can broadcast status changes to interested clients.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-presence-cache', type: 'cache', label: 'Presence Store\n(Redis)', x: 700, y: 150 },
            ],
            addConnections: [
              { from: 'chat-ws-1', to: 'chat-presence-cache', label: 'Heartbeat + TTL' },
              { from: 'chat-ws-2', to: 'chat-presence-cache', label: 'Check presence' },
            ],
          },
        },
        {
          id: 'chat-presence-connection-track',
          label: 'WebSocket Connection Tracking',
          description:
            'Track presence based on active WebSocket connections. When a connection drops, mark the user offline.',
          score: 7,
          feedback:
            'Connection-based tracking is responsive but fragile. Temporary network issues cause false offline/online flickers. You also need cross-server coordination to query presence.',
          diagramEffect: {
            addConnections: [
              { from: 'chat-ws-1', to: 'chat-ws-2', label: 'Presence sync', style: 'dashed' },
            ],
          },
        },
        {
          id: 'chat-presence-db',
          label: 'Database Status Table',
          description: 'Store user presence in a database table updated on connect/disconnect events.',
          score: 4,
          feedback:
            'A database is too slow for presence queries which happen on every conversation load. At 50M DAU the presence table receives millions of updates per minute.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-presence-db', type: 'database', label: 'Presence DB', x: 700, y: 150 },
            ],
            addConnections: [
              { from: 'chat-ws-1', to: 'chat-presence-db', label: 'Update status' },
            ],
          },
        },
      ],
    },
    {
      id: 'chat-group',
      title: 'Group Chat Architecture',
      description:
        'How should you handle message delivery to group conversations with potentially thousands of members?',
      category: 'Core Feature',
      options: [
        {
          id: 'chat-group-fanout-queue',
          label: 'Queue-Based Fan-out with Partitioning',
          description:
            'Partition group members across Kafka topic partitions. Each WebSocket server consumes partitions for its connected members. Large groups use dedicated topics.',
          score: 10,
          feedback:
            'Kafka partitioning distributes the fan-out load evenly. Each server only delivers messages to its own connected members, making even 10K-member groups efficient.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-group-svc', type: 'server', label: 'Group Service', x: 500, y: 700 },
            ],
            addConnections: [
              { from: 'chat-ws-1', to: 'chat-group-svc', label: 'Group message' },
              { from: 'chat-group-svc', to: 'chat-msg-queue', label: 'Fan-out to partitions' },
            ],
          },
        },
        {
          id: 'chat-group-broadcast',
          label: 'Server-Side Broadcast',
          description:
            'The originating server queries group membership, looks up each member\'s server, and sends the message to every online member directly.',
          score: 4,
          feedback:
            'Direct broadcast works for small groups but does not scale. A 10K-member group means 10K lookups and sends from a single server, creating a hotspot.',
          diagramEffect: {
            addConnections: [
              { from: 'chat-ws-1', to: 'chat-ws-2', label: 'Broadcast to members' },
            ],
          },
        },
        {
          id: 'chat-group-shared-channel',
          label: 'Shared Redis Channel',
          description:
            'Each group has a Redis pub/sub channel. All servers with group members subscribe to the channel.',
          score: 7,
          feedback:
            'Redis pub/sub works for moderate-scale groups but messages are fire-and-forget with no persistence. If a server misses a message, it is gone. Redis also has cluster pub/sub limitations.',
          diagramEffect: {
            addConnections: [
              { from: 'chat-ws-1', to: 'chat-presence-cache', label: 'Pub group msg' },
              { from: 'chat-presence-cache', to: 'chat-ws-2', label: 'Sub group msg' },
            ],
          },
        },
      ],
    },
    {
      id: 'chat-storage',
      title: 'Message Storage',
      description:
        'How should you persist 1PB/year of messages with fast retrieval for conversation history?',
      category: 'Data Storage',
      options: [
        {
          id: 'chat-storage-cassandra',
          label: 'Cassandra with Time-Bucketed Partitions',
          description:
            'Store messages in Cassandra partitioned by (conversation_id, time_bucket). This enables efficient range queries for loading recent chat history.',
          score: 10,
          feedback:
            'Cassandra handles the 1PB scale with linear scalability. Time-bucketed partitions prevent individual partitions from growing unbounded and optimize the most common query: "last N messages in a conversation."',
          diagramEffect: {
            addNodes: [
              { id: 'chat-msg-db', type: 'database', label: 'Message DB\n(Cassandra)', x: 900, y: 350 },
            ],
            addConnections: [
              { from: 'chat-msg-queue', to: 'chat-msg-db', label: 'Persist messages' },
            ],
          },
        },
        {
          id: 'chat-storage-mongo',
          label: 'MongoDB Sharded Cluster',
          description:
            'Store messages as documents in MongoDB, sharded by conversation_id for distribution.',
          score: 7,
          feedback:
            'MongoDB handles semi-structured messages well and shards effectively. However, at petabyte scale, Cassandra\'s leaderless replication and tunable consistency offer better write throughput.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-msg-db', type: 'database', label: 'Message DB\n(MongoDB)', x: 900, y: 350 },
            ],
            addConnections: [
              { from: 'chat-msg-queue', to: 'chat-msg-db', label: 'Persist messages' },
            ],
          },
        },
        {
          id: 'chat-storage-postgres',
          label: 'PostgreSQL with Partitioning',
          description: 'Use PostgreSQL with table partitioning by date range to manage the data volume.',
          score: 4,
          feedback:
            'PostgreSQL partitioning helps but 1PB/year exceeds practical PostgreSQL limits. Managing thousands of partitions becomes operationally complex and cross-partition queries are slow.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-msg-db', type: 'database', label: 'Message DB\n(PostgreSQL)', x: 900, y: 350 },
            ],
            addConnections: [
              { from: 'chat-msg-queue', to: 'chat-msg-db', label: 'Persist messages' },
            ],
          },
        },
      ],
    },
    {
      id: 'chat-media',
      title: 'Media Handling',
      description:
        'How should you handle image, video, and file sharing within chats?',
      category: 'Storage',
      options: [
        {
          id: 'chat-media-presigned-s3',
          label: 'Pre-signed Upload to Object Storage',
          description:
            'Client requests a pre-signed URL, uploads directly to S3/object storage, then sends a message with the media URL. Thumbnails are generated asynchronously.',
          score: 10,
          feedback:
            'Pre-signed uploads offload bandwidth from your servers entirely. Async thumbnail generation via a queue keeps the message flow fast while media processing happens in the background.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-media-store', type: 'storage', label: 'Media Storage\n(S3)', x: 900, y: 550 },
              { id: 'chat-thumb-queue', type: 'queue', label: 'Thumbnail\nQueue', x: 700, y: 550 },
            ],
            addConnections: [
              { from: 'chat-client-a', to: 'chat-media-store', label: 'Pre-signed upload', style: 'dashed' },
              { from: 'chat-ws-1', to: 'chat-thumb-queue', label: 'Generate thumbnail' },
              { from: 'chat-thumb-queue', to: 'chat-media-store', label: 'Store thumbnail' },
            ],
          },
        },
        {
          id: 'chat-media-server-proxy',
          label: 'Server-Proxied Upload',
          description: 'Upload media through the application servers which then store it in object storage.',
          score: 7,
          feedback:
            'Server-proxied uploads are simpler but every media file flows through your servers, consuming bandwidth and CPU. At 50M DAU this becomes a significant bottleneck.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-media-store', type: 'storage', label: 'Media Storage', x: 900, y: 550 },
            ],
            addConnections: [
              { from: 'chat-ws-1', to: 'chat-media-store', label: 'Proxy upload' },
            ],
          },
        },
        {
          id: 'chat-media-inline-db',
          label: 'Store in Message Database',
          description: 'Encode media as base64 and store it inline with the message in the database.',
          score: 2,
          feedback:
            'Storing binary media in the message database would explode storage costs and degrade query performance. A 5MB image becomes 6.7MB in base64, and you cannot use CDN caching.',
          diagramEffect: {
            addConnections: [
              { from: 'chat-ws-1', to: 'chat-msg-db', label: 'Store base64 media' },
            ],
          },
        },
      ],
    },
    {
      id: 'chat-push',
      title: 'Push Notifications',
      description:
        'How should you deliver notifications to users who are offline or have the app in the background?',
      category: 'Infrastructure',
      options: [
        {
          id: 'chat-push-dedicated-svc',
          label: 'Dedicated Push Notification Service',
          description:
            'A separate notification service consumes undelivered message events from Kafka, batches them, and sends via APNs/FCM. It tracks device tokens and delivery status.',
          score: 10,
          feedback:
            'A dedicated service handles the complexity of push providers (APNs, FCM), token management, rate limiting, and delivery tracking without coupling to the chat flow.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-push-svc', type: 'server', label: 'Push Notification\nService', x: 900, y: 150 },
            ],
            addConnections: [
              { from: 'chat-msg-queue', to: 'chat-push-svc', label: 'Undelivered msgs' },
              { from: 'chat-push-svc', to: 'chat-client-a', label: 'APNs/FCM', style: 'dashed' },
              { from: 'chat-push-svc', to: 'chat-client-b', label: 'APNs/FCM', style: 'dashed' },
            ],
          },
        },
        {
          id: 'chat-push-inline',
          label: 'Inline Push from WebSocket Server',
          description: 'When the WebSocket server detects a user is offline, it directly calls APNs/FCM to send a push notification.',
          score: 4,
          feedback:
            'Mixing push logic into WebSocket servers violates separation of concerns. Push calls add latency to message processing and handling APNs/FCM rate limits becomes complex.',
          diagramEffect: {
            addConnections: [
              { from: 'chat-ws-1', to: 'chat-client-b', label: 'Direct push', style: 'dashed' },
            ],
          },
        },
        {
          id: 'chat-push-third-party',
          label: 'Third-Party Push Service (OneSignal)',
          description: 'Delegate all push notification logic to a managed service like OneSignal or Firebase Cloud Messaging directly.',
          score: 7,
          feedback:
            'Third-party services reduce development effort but add a dependency and per-notification cost. At 50M DAU, costs can be significant and you lose fine-grained control over delivery.',
          diagramEffect: {
            addNodes: [
              { id: 'chat-push-svc', type: 'server', label: 'Push Service\n(3rd Party)', x: 900, y: 150 },
            ],
            addConnections: [
              { from: 'chat-ws-1', to: 'chat-push-svc', label: 'Send push' },
            ],
          },
        },
      ],
    },
  ],
};
