import { Challenge } from '@/types/challenge';
import { challenge as designTwitter } from './design-twitter';
import { challenge as designUrlShortener } from './design-url-shortener';
import { challenge as designChatApp } from './design-chat-app';
import { challenge as designVideoStreaming } from './design-video-streaming';
import { challenge as designRateLimiter } from './design-rate-limiter';

export const challenges: Record<string, Challenge> = {
  'design-twitter': designTwitter,
  'design-url-shortener': designUrlShortener,
  'design-chat-app': designChatApp,
  'design-video-streaming': designVideoStreaming,
  'design-rate-limiter': designRateLimiter,
};

export const challengeList = Object.values(challenges);
