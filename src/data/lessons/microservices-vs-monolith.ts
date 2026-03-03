import { Lesson } from '@/types/lesson';

export const lesson: Lesson = {
  slug: 'microservices-vs-monolith',
  title: 'Microservices vs Monolith',
  description:
    'Compare monolithic and microservices architectures, understand the trade-offs of each approach, and learn when to choose one over the other.',
  icon: 'boxes',
  estimatedMinutes: 17,
  content: [
    {
      type: 'heading',
      content: 'Monolithic Architecture',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'A monolithic application is built as a single, unified unit. All the business logic, data access, and UI components are packaged and deployed together as one artifact. Monoliths are straightforward to develop, test, and deploy — especially for small teams and early-stage products. A single codebase means simpler debugging, no inter-service communication overhead, and easy local development. However, as the application grows, monoliths become harder to maintain. A change in one module requires rebuilding and redeploying the entire application. Scaling is coarse-grained: you must scale the whole application even if only one feature is under heavy load.',
    },
    {
      type: 'heading',
      content: 'Microservices Architecture',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'A microservices architecture decomposes the application into small, independently deployable services, each responsible for a specific business capability. Each service has its own codebase, database, and deployment pipeline. Services communicate over the network using REST APIs, gRPC, or asynchronous messaging. Microservices enable independent scaling (scale only the services that need it), technology diversity (each service can use the best language or database for its task), and organizational alignment (small teams own individual services end-to-end). The trade-offs include increased operational complexity, distributed system challenges (network latency, partial failures, data consistency), and the need for sophisticated infrastructure (service discovery, observability, container orchestration).',
    },
    {
      type: 'diagram',
      caption: 'Comparing a monolithic architecture (left) with a microservices architecture (right)',
      diagram: {
        nodes: [
          { id: 'client', type: 'client', label: 'Client', x: 350, y: 30 },
          // Monolith side
          { id: 'monolith', type: 'server', label: 'Monolith App', x: 100, y: 200 },
          { id: 'monodb', type: 'database', label: 'Single DB', x: 100, y: 380 },
          // Microservices side
          { id: 'gateway', type: 'loadBalancer', label: 'API Gateway', x: 500, y: 180 },
          { id: 'usersvc', type: 'server', label: 'User Service', x: 400, y: 330 },
          { id: 'ordersvc', type: 'server', label: 'Order Service', x: 600, y: 330 },
          { id: 'userdb', type: 'database', label: 'User DB', x: 400, y: 480 },
          { id: 'orderdb', type: 'database', label: 'Order DB', x: 600, y: 480 },
        ],
        connections: [
          { from: 'client', to: 'monolith', label: 'All traffic' },
          { from: 'monolith', to: 'monodb' },
          { from: 'client', to: 'gateway', label: 'All traffic' },
          { from: 'gateway', to: 'usersvc', label: '/users' },
          { from: 'gateway', to: 'ordersvc', label: '/orders' },
          { from: 'usersvc', to: 'userdb' },
          { from: 'ordersvc', to: 'orderdb' },
          { from: 'usersvc', to: 'ordersvc', label: 'gRPC', style: 'dashed' },
        ],
      },
    },
    {
      type: 'heading',
      content: 'When to Choose Each',
      level: 2,
    },
    {
      type: 'list',
      ordered: false,
      items: [
        'Start with a monolith when your team is small, the domain is not well understood, and you need to iterate quickly. You can always extract services later.',
        'Move to microservices when the monolith becomes a bottleneck for deployment velocity, when different parts of the system have very different scaling needs, or when multiple teams need to work independently.',
        'Consider a modular monolith as a middle ground: a single deployable unit with well-defined internal module boundaries that can be split into services later with minimal refactoring.',
      ],
    },
    {
      type: 'heading',
      content: 'Service Communication',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'Services in a microservices architecture communicate over the network. Synchronous communication (REST over HTTP, gRPC) is simple and familiar but creates tight runtime coupling — if the downstream service is slow or unavailable, the caller is directly affected. Asynchronous communication (message queues, event streaming) decouples services in time: the producer publishes an event and moves on without waiting for a response. This is more resilient but harder to reason about and debug. gRPC uses Protocol Buffers for serialization, providing strong typing, code generation, and significantly better performance than JSON over HTTP.',
    },
    {
      type: 'code',
      language: 'protobuf',
      content: `// gRPC service definition for inter-service communication
syntax = "proto3";

package orders;

service OrderService {
  rpc CreateOrder (CreateOrderRequest) returns (OrderResponse);
  rpc GetOrder (GetOrderRequest) returns (OrderResponse);
  rpc ListUserOrders (ListUserOrdersRequest) returns (OrderListResponse);
}

message CreateOrderRequest {
  string user_id = 1;
  repeated OrderItem items = 2;
}

message OrderItem {
  string product_id = 1;
  int32 quantity = 2;
}

message OrderResponse {
  string order_id = 1;
  string status = 2;
  string created_at = 3;
}`,
    },
    {
      type: 'heading',
      content: 'Service Discovery & Deployment',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'In a microservices environment, services need to find each other dynamically. Service discovery can be client-side (the client queries a service registry like Consul or Eureka and load-balances itself) or server-side (a load balancer or DNS entry routes requests and the client does not need to know about individual instances). For deployment, container orchestration platforms like Kubernetes have become the standard. Kubernetes handles service discovery via internal DNS, provides health checks and automatic restarts, manages rolling deployments, and scales services horizontally based on resource utilization.',
    },
    {
      type: 'callout',
      variant: 'tip',
      content:
        'Martin Fowler\'s "Monolith First" advice is widely respected: do not start with microservices. Build a monolith, learn your domain, and extract services only when you have a clear need. Premature decomposition into microservices often leads to distributed monolith — all the complexity of microservices with none of the benefits, because service boundaries were drawn incorrectly.',
    },
    {
      type: 'quiz',
      question: {
        id: 'micro-q1',
        question:
          'What is a major disadvantage of microservices compared to a monolith?',
        options: [
          'Microservices cannot be scaled independently.',
          'Microservices require all services to use the same programming language.',
          'Microservices introduce significant operational complexity, including distributed tracing, network latency, and data consistency challenges.',
          'Microservices must always share a single database.',
        ],
        correctIndex: 2,
        explanation:
          'While microservices provide many benefits (independent deployment, scaling, and technology choice), they introduce substantial operational complexity. You need to manage inter-service communication, handle partial failures, maintain data consistency across services without distributed transactions, implement distributed tracing for debugging, and run sophisticated deployment infrastructure. This overhead is not justified for smaller systems.',
      },
    },
  ],
};
