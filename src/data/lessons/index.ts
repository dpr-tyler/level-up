import { Lesson } from '@/types/lesson';
import { lesson as loadBalancing } from './load-balancing';
import { lesson as caching } from './caching';
import { lesson as databases } from './databases';
import { lesson as messageQueues } from './message-queues';
import { lesson as microservicesVsMonolith } from './microservices-vs-monolith';
import { lesson as apiDesign } from './api-design';
import { lesson as capTheorem } from './cap-theorem';
import { lesson as rateLimiting } from './rate-limiting';
import { lesson as cdns } from './cdns';
import { lesson as dns } from './dns';
import { lesson as distributedSystems } from './distributed-systems';
import { lesson as scalingStrategies } from './scaling-strategies';

export const lessons: Record<string, Lesson> = {
  'load-balancing': loadBalancing,
  'caching': caching,
  'databases': databases,
  'message-queues': messageQueues,
  'microservices-vs-monolith': microservicesVsMonolith,
  'api-design': apiDesign,
  'cap-theorem': capTheorem,
  'rate-limiting': rateLimiting,
  'cdns': cdns,
  'dns': dns,
  'distributed-systems': distributedSystems,
  'scaling-strategies': scalingStrategies,
};

export const lessonList = Object.values(lessons);
