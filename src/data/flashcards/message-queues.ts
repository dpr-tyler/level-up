import { FlashcardDeck } from '@/types/flashcard';

export const deck: FlashcardDeck = {
  topic: 'message-queues',
  title: 'Message Queues',
  description: 'Learn about message queue patterns including pub/sub, dead letter queues, message ordering, backpressure, and exactly-once delivery.',
  icon: '📨',
  cards: [
    {
      id: 'mq-1',
      front: 'What is the difference between a message queue and a pub/sub system?',
      back: 'A message queue (point-to-point): each message is consumed by exactly one consumer. Consumers compete for messages, enabling load distribution. Examples: SQS, RabbitMQ queues. Pub/sub (publish-subscribe): each message is broadcast to all subscribers of a topic. Enables fan-out to multiple independent consumers. Examples: SNS, Kafka topics (with consumer groups for both patterns). Kafka uniquely supports both: within a consumer group it acts as a queue; across groups it acts as pub/sub.',
      topic: 'message-queues',
    },
    {
      id: 'mq-2',
      front: 'What is a dead letter queue (DLQ) and why is it important?',
      back: 'A DLQ is a special queue where messages that cannot be processed after a configured number of retry attempts are moved. Purpose: prevents poison messages (malformed or unprocessable) from blocking the main queue indefinitely, preserves failed messages for debugging and manual reprocessing, and provides visibility into processing failures. Best practices: set appropriate max retry counts, monitor DLQ depth with alerts, and build tooling to inspect and replay DLQ messages.',
      topic: 'message-queues',
    },
    {
      id: 'mq-3',
      front: 'Explain the differences between at-most-once, at-least-once, and exactly-once delivery.',
      back: 'At-most-once: messages may be lost but never duplicated. Fire-and-forget; no retries. At-least-once: messages are retried until acknowledged, so duplicates are possible. Most common; requires idempotent consumers. Exactly-once: each message is processed exactly once. Extremely hard in distributed systems; typically achieved via idempotent processing + at-least-once delivery, or transactional outbox patterns. Kafka supports exactly-once semantics within its ecosystem using transactions and idempotent producers.',
      topic: 'message-queues',
    },
    {
      id: 'mq-4',
      front: 'How do you guarantee message ordering in a distributed queue?',
      back: 'Full ordering across all messages is expensive and limits throughput. Strategies: (1) Single partition/queue: total ordering but no parallelism. (2) Partition-level ordering (Kafka): messages with the same partition key go to the same partition and are ordered within it. (3) Sequence numbers: embed sequence IDs so consumers can reorder. (4) FIFO queues (SQS FIFO): guarantee ordering within a message group ID. Tradeoff: stronger ordering guarantees reduce parallelism and throughput.',
      topic: 'message-queues',
    },
    {
      id: 'mq-5',
      front: 'What is backpressure and how should it be handled?',
      back: 'Backpressure occurs when producers generate messages faster than consumers can process them, causing queue growth, increased latency, and potential OOM. Handling strategies: (1) Consumer-side: autoscale consumers based on queue depth. (2) Producer-side: slow down or reject new messages when the queue exceeds a threshold. (3) Rate limiting: cap ingestion rate. (4) Buffering: use durable queues (Kafka) to absorb bursts. (5) Load shedding: drop low-priority messages. Monitor queue depth and consumer lag as key operational metrics.',
      topic: 'message-queues',
    },
    {
      id: 'mq-6',
      front: 'What is the transactional outbox pattern?',
      back: 'The transactional outbox pattern ensures reliable message publishing alongside database changes. Instead of directly publishing to a queue (which could fail after the DB commit), the application writes both the data change and an outbox message in a single database transaction. A separate process (poller or CDC/change data capture) reads the outbox table and publishes messages to the queue. This guarantees that messages are published if and only if the DB transaction committed, solving the dual-write problem.',
      topic: 'message-queues',
    },
    {
      id: 'mq-7',
      front: 'Compare Apache Kafka with RabbitMQ.',
      back: 'Kafka: distributed log, high throughput (millions of msgs/sec), durable retention (replay capability), partition-based ordering, consumer groups, ideal for event streaming and large-scale data pipelines. RabbitMQ: traditional message broker, supports complex routing (exchanges, bindings, topics), push-based delivery, lower latency for individual messages, supports multiple protocols (AMQP, MQTT, STOMP), better for task queues and request-reply patterns. Kafka excels at event streaming; RabbitMQ excels at flexible message routing.',
      topic: 'message-queues',
    },
    {
      id: 'mq-8',
      front: 'What is consumer group rebalancing in Kafka?',
      back: 'A consumer group is a set of consumers that cooperatively read from a topic, with each partition assigned to exactly one consumer in the group. Rebalancing occurs when consumers join or leave the group (scaling, crashes, deployments). During rebalancing, consumption pauses briefly while partitions are reassigned. Challenges: stop-the-world pauses, duplicate processing during handoff. Mitigations: sticky assignor (minimizes partition movement), cooperative rebalancing (incremental), static group membership (reduces unnecessary rebalances), and idempotent processing.',
      topic: 'message-queues',
    },
    {
      id: 'mq-9',
      front: 'What is event sourcing and how does it relate to message queues?',
      back: 'Event sourcing stores all state changes as an immutable sequence of events rather than just current state. The event log is the source of truth, and current state is derived by replaying events. Message queues/event streams (especially Kafka) are natural infrastructure for event sourcing: events are published to topics, consumers build read models (projections), and the log enables replay and temporal queries. Benefits: full audit trail, temporal queries, easy debugging. Challenges: event schema evolution, eventual consistency, and storage growth.',
      topic: 'message-queues',
    },
    {
      id: 'mq-10',
      front: 'What is the difference between message brokers and event streams?',
      back: 'Message brokers (RabbitMQ, SQS): messages are deleted after consumption, routing is broker-managed, designed for task distribution and decoupling. Best for transient commands/tasks. Event streams (Kafka, Kinesis): events are appended to a durable log and retained for a configurable period (or forever), consumers track their own offsets, enabling replay and multiple independent consumers. Best for event-driven architectures, data pipelines, and audit logs. The key distinction is retention and replayability.',
      topic: 'message-queues',
    },
  ],
};
