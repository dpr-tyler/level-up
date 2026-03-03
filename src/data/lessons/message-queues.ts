import { Lesson } from '@/types/lesson';

export const lesson: Lesson = {
  slug: 'message-queues',
  title: 'Message Queues',
  description:
    'Learn how message queues enable asynchronous communication between services, providing decoupling, buffering, and fault tolerance in distributed systems.',
  icon: 'mail',
  estimatedMinutes: 16,
  content: [
    {
      type: 'heading',
      content: 'What Are Message Queues?',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'A message queue is a form of asynchronous service-to-service communication. Messages are stored in the queue until they are processed and deleted by the consuming service. This decouples the producer (sender) from the consumer (receiver) — the producer does not need to know who will process the message, and the consumer does not need to be available at the time the message is sent. Message queues are essential for building resilient, scalable distributed systems because they absorb traffic spikes, enable retry logic, and allow services to evolve independently.',
    },
    {
      type: 'diagram',
      caption: 'Message queue architecture: producers publish messages that are consumed by worker services',
      diagram: {
        nodes: [
          { id: 'api1', type: 'server', label: 'API Server 1', x: 50, y: 80 },
          { id: 'api2', type: 'server', label: 'API Server 2', x: 50, y: 250 },
          { id: 'queue', type: 'queue', label: 'Message Queue', x: 300, y: 165 },
          { id: 'worker1', type: 'server', label: 'Worker 1', x: 550, y: 50 },
          { id: 'worker2', type: 'server', label: 'Worker 2', x: 550, y: 180 },
          { id: 'worker3', type: 'server', label: 'Worker 3', x: 550, y: 310 },
          { id: 'dlq', type: 'queue', label: 'Dead Letter Queue', x: 300, y: 380 },
        ],
        connections: [
          { from: 'api1', to: 'queue', label: 'Publish' },
          { from: 'api2', to: 'queue', label: 'Publish' },
          { from: 'queue', to: 'worker1', label: 'Consume' },
          { from: 'queue', to: 'worker2', label: 'Consume' },
          { from: 'queue', to: 'worker3', label: 'Consume' },
          { from: 'queue', to: 'dlq', label: 'Failed msgs', style: 'dashed' },
        ],
      },
    },
    {
      type: 'heading',
      content: 'Messaging Patterns',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'There are two primary messaging patterns. In point-to-point queuing, each message is consumed by exactly one consumer. Multiple consumers can listen on the same queue, but only one receives and processes each message. This is ideal for task distribution (e.g., processing uploaded images). In publish-subscribe (pub/sub), a message is broadcast to all subscribers of a topic. Each subscriber receives its own copy of the message. This is useful for event notifications where multiple services need to react to the same event (e.g., a new user signup triggering a welcome email, analytics tracking, and account provisioning).',
    },
    {
      type: 'heading',
      content: 'Benefits of Message Queues',
      level: 3,
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Decoupling — Producers and consumers can be developed, deployed, and scaled independently.',
        'Buffering — Queues absorb bursts of traffic, smoothing out load spikes that would otherwise overwhelm downstream services.',
        'Async Processing — Long-running tasks (video encoding, report generation) can be offloaded from the request-response cycle.',
        'Fault Tolerance — If a consumer crashes, unprocessed messages remain in the queue and can be retried.',
        'Load Leveling — Work is distributed evenly across consumers, preventing any single service from being overloaded.',
      ],
    },
    {
      type: 'heading',
      content: 'Popular Systems Compared',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'Apache Kafka is a distributed event streaming platform designed for high-throughput, durability, and replay. It stores messages in an ordered, immutable log and supports consumer groups for parallel processing. Kafka is ideal for event sourcing, log aggregation, and stream processing. RabbitMQ is a traditional message broker that supports multiple protocols (AMQP, MQTT, STOMP) and rich routing via exchanges and bindings. It excels at complex routing, priority queues, and low-latency messaging. Amazon SQS is a fully managed queue service with virtually unlimited throughput, no operational overhead, and built-in dead letter queue support. It offers Standard queues (at-least-once delivery, best-effort ordering) and FIFO queues (exactly-once processing, strict ordering).',
    },
    {
      type: 'code',
      language: 'typescript',
      content: `// Publishing and consuming messages with a queue (pseudocode)
import { Queue } from './queue-client';

// Producer: enqueue a job after an API request
app.post('/orders', async (req, res) => {
  const order = await db.createOrder(req.body);

  // Offload heavy processing to a background worker
  await Queue.publish('order-processing', {
    orderId: order.id,
    userId: order.userId,
    items: order.items,
    retryCount: 0,
  });

  res.status(202).json({ orderId: order.id, status: 'processing' });
});

// Consumer: process jobs from the queue
Queue.subscribe('order-processing', async (message) => {
  try {
    await chargePayment(message.orderId);
    await reserveInventory(message.items);
    await sendConfirmationEmail(message.userId);
    message.ack(); // Remove from queue
  } catch (error) {
    if (message.retryCount < 3) {
      message.retry(); // Re-queue with incremented retry count
    } else {
      message.sendToDeadLetter(); // Give up, send to DLQ
    }
  }
});`,
    },
    {
      type: 'heading',
      content: 'Dead Letter Queues & Ordering',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'A dead letter queue (DLQ) is a special queue that stores messages that could not be successfully processed after a configured number of retries. DLQs prevent poison messages (messages that consistently cause consumer failures) from blocking the main queue. Engineers can inspect DLQ messages, fix the underlying issue, and replay them. Ordering guarantees vary by system. Kafka guarantees ordering within a partition but not across partitions. SQS FIFO queues guarantee strict ordering within a message group. RabbitMQ preserves per-queue ordering. If strict global ordering is required, you typically need a single partition or queue, which limits throughput.',
    },
    {
      type: 'callout',
      variant: 'info',
      content:
        'Design consumers to be idempotent — processing the same message twice should produce the same result. In distributed systems, at-least-once delivery is the most common guarantee, meaning your consumer may occasionally receive a duplicate message. Using unique message IDs and checking for already-processed work prevents side effects from duplicate processing.',
    },
    {
      type: 'quiz',
      question: {
        id: 'mq-q1',
        question:
          'What is the primary purpose of a dead letter queue?',
        options: [
          'To store messages that have been successfully processed for auditing.',
          'To prioritize certain messages over others in the main queue.',
          'To capture messages that repeatedly fail processing so they do not block the main queue.',
          'To encrypt sensitive messages before they are consumed.',
        ],
        correctIndex: 2,
        explanation:
          'A dead letter queue (DLQ) receives messages that have failed processing after a maximum number of retry attempts. Without a DLQ, a "poison" message that always causes a consumer error would be retried indefinitely, blocking other messages. The DLQ isolates these failures so the main queue continues flowing while engineers investigate and resolve the root cause.',
      },
    },
  ],
};
