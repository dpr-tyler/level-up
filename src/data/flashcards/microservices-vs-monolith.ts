import { FlashcardDeck } from '@/types/flashcard';

export const deck: FlashcardDeck = {
  topic: 'microservices-vs-monolith',
  title: 'Microservices vs Monolith',
  description: 'Understand the tradeoffs between microservices and monolithic architectures, including service mesh, saga pattern, and decomposition strategies.',
  icon: '🏗️',
  cards: [
    {
      id: 'msm-1',
      front: 'What are the key tradeoffs between microservices and monolithic architectures?',
      back: 'Monolith: simpler development, testing, and deployment; easier data consistency (single DB); lower operational overhead; harder to scale individual components. Microservices: independent deployment and scaling; technology diversity; team autonomy; fault isolation. But they add complexity in networking, distributed data management, debugging, observability, and operational tooling. Start monolithic and extract microservices when clear bounded contexts and scaling needs emerge.',
      topic: 'microservices-vs-monolith',
    },
    {
      id: 'msm-2',
      front: 'What is a service mesh and when do you need one?',
      back: 'A service mesh (e.g., Istio, Linkerd) is an infrastructure layer that manages service-to-service communication via sidecar proxies deployed alongside each service. It provides: mutual TLS, traffic management (routing, retries, circuit breaking), observability (metrics, distributed tracing), and access policies without changing application code. You need one when managing many microservices where cross-cutting networking concerns become too complex to handle in each service individually. Adds latency and operational complexity.',
      topic: 'microservices-vs-monolith',
    },
    {
      id: 'msm-3',
      front: 'What is the Saga pattern for distributed transactions?',
      back: 'The Saga pattern manages transactions spanning multiple services by breaking them into a sequence of local transactions, each with a compensating action for rollback. Two coordination styles: (1) Choreography: each service listens for events and triggers the next step or compensation. Simple but hard to track. (2) Orchestration: a central orchestrator directs the workflow and handles compensation. Easier to understand but creates a single point of coordination. Sagas provide eventual consistency since there is no distributed ACID guarantee.',
      topic: 'microservices-vs-monolith',
    },
    {
      id: 'msm-4',
      front: 'What is the Strangler Fig pattern?',
      back: 'The Strangler Fig pattern is an incremental migration strategy from monolith to microservices. Instead of a risky rewrite, you gradually replace specific functionality by routing requests to new microservices while the monolith continues handling everything else. Over time, more functionality moves to services until the monolith is fully replaced. Implementation: use an API gateway or reverse proxy to route traffic. Benefits: low risk, continuous delivery, rollback capability, and the ability to stop migration at any point with a working system.',
      topic: 'microservices-vs-monolith',
    },
    {
      id: 'msm-5',
      front: 'What is the circuit breaker pattern?',
      back: 'The circuit breaker prevents cascading failures by wrapping service calls with failure detection logic. Three states: Closed (normal, requests flow through), Open (failures exceed threshold, requests fail fast without calling the downstream service), Half-Open (after a timeout, a limited number of test requests are allowed through to check if the service has recovered). Benefits: fail fast, protect downstream services, graceful degradation. Libraries: Hystrix (deprecated), Resilience4j, Polly. Often combined with retries, timeouts, and bulkheads.',
      topic: 'microservices-vs-monolith',
    },
    {
      id: 'msm-6',
      front: 'How should data be managed across microservices?',
      back: 'Each microservice should own its data (database-per-service pattern) to ensure loose coupling and independent deployability. Challenges: no cross-service joins, distributed transactions, and data duplication. Patterns: (1) API composition: aggregate data via API calls. (2) CQRS: separate read/write models with event-driven sync. (3) Event sourcing: share state changes as events. (4) Sagas for distributed transactions. (5) Data duplication with eventual consistency. Avoid shared databases as they create tight coupling and deployment dependencies.',
      topic: 'microservices-vs-monolith',
    },
    {
      id: 'msm-7',
      front: 'What is the API Gateway pattern in microservices?',
      back: 'An API Gateway is a single entry point for all client requests that routes them to the appropriate microservices. Responsibilities: request routing, authentication/authorization, rate limiting, response aggregation, protocol translation, SSL termination, and API versioning. Benefits: simplifies client code (one endpoint), enables backend-for-frontend (BFF) patterns, and centralizes cross-cutting concerns. Risks: can become a bottleneck or single point of failure; avoid putting business logic in the gateway. Examples: Kong, AWS API Gateway, Envoy.',
      topic: 'microservices-vs-monolith',
    },
    {
      id: 'msm-8',
      front: 'What is Domain-Driven Design (DDD) and how does it relate to microservices?',
      back: 'DDD is a software design approach that models software around business domains. Key concepts: Bounded Contexts define clear boundaries where a domain model applies; Aggregates are consistency boundaries within a context; Ubiquitous Language ensures team alignment. DDD is essential for microservices decomposition: each microservice should align with a bounded context, ensuring high cohesion within services and loose coupling between them. Without DDD, service boundaries are often drawn incorrectly, leading to excessive inter-service communication.',
      topic: 'microservices-vs-monolith',
    },
    {
      id: 'msm-9',
      front: 'What are the key observability challenges in microservices?',
      back: 'Microservices distribute work across many processes, making debugging hard. Three pillars of observability: (1) Logging: centralized, structured logs with correlation IDs to trace requests across services (ELK, Datadog). (2) Metrics: service-level indicators like latency, error rate, throughput per service (Prometheus, Grafana). (3) Distributed tracing: tracks request paths across services showing latency at each hop (Jaeger, Zipkin, OpenTelemetry). Also essential: health checks, alerting, service dependency maps, and runbooks.',
      topic: 'microservices-vs-monolith',
    },
    {
      id: 'msm-10',
      front: 'What is the Bulkhead pattern?',
      back: 'The Bulkhead pattern isolates resources so that a failure in one component does not exhaust resources for others, named after ship compartments that prevent total flooding. Implementation: separate thread pools, connection pools, or process instances per downstream dependency or feature. Example: a service allocates 50 threads for Service A calls and 50 for Service B; if Service A is slow, only its pool is exhausted while Service B calls continue normally. Complements circuit breakers for resilient microservices architectures.',
      topic: 'microservices-vs-monolith',
    },
  ],
};
