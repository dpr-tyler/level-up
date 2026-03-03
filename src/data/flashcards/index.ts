import { FlashcardDeck } from '@/types/flashcard';
import { deck as loadBalancing } from './load-balancing';
import { deck as caching } from './caching';
import { deck as databases } from './databases';
import { deck as messageQueues } from './message-queues';
import { deck as microservicesVsMonolith } from './microservices-vs-monolith';
import { deck as apiDesign } from './api-design';
import { deck as capTheorem } from './cap-theorem';
import { deck as rateLimiting } from './rate-limiting';
import { deck as cdns } from './cdns';
import { deck as dns } from './dns';
import { deck as distributedSystems } from './distributed-systems';
import { deck as scalingStrategies } from './scaling-strategies';

export const decks: Record<string, FlashcardDeck> = {
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

export const deckList = Object.values(decks);
