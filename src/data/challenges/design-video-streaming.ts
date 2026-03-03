import { Challenge } from '@/types/challenge';

export const challenge: Challenge = {
  slug: 'design-video-streaming',
  title: 'Design Video Streaming',
  description:
    'Design a video streaming platform like YouTube or Netflix that supports video upload, transcoding, content delivery, and personalized recommendations at global scale.',
  icon: '🎬',
  difficulty: 'advanced',
  requirements: {
    scale: '1B video views/day',
    latency: '<2s start time',
    availability: '99.99%',
    storage: '500PB video content',
  },
  steps: [
    {
      id: 'video-upload',
      title: 'Video Upload Pipeline',
      description:
        'How should you handle video uploads from creators, including large files that can be several gigabytes?',
      category: 'Ingestion',
      options: [
        {
          id: 'video-upload-chunked',
          label: 'Chunked Upload to Object Storage',
          description:
            'Split uploads into chunks on the client side. Upload each chunk directly to object storage via pre-signed URLs with resume capability. A metadata service tracks chunk completion.',
          score: 10,
          feedback:
            'Chunked uploads are essential for large video files. Resume capability means a failed upload does not restart from zero. Direct-to-storage uploads bypass your servers entirely.',
          diagramEffect: {
            addNodes: [
              { id: 'vid-client', type: 'client', label: 'Creator Client', x: 100, y: 300 },
              { id: 'vid-lb', type: 'loadBalancer', label: 'Load Balancer', x: 300, y: 300 },
              { id: 'vid-upload-svc', type: 'server', label: 'Upload Service', x: 500, y: 150 },
              { id: 'vid-raw-store', type: 'storage', label: 'Raw Video\nStorage (S3)', x: 700, y: 150 },
            ],
            addConnections: [
              { from: 'vid-client', to: 'vid-lb', label: 'HTTPS' },
              { from: 'vid-lb', to: 'vid-upload-svc', label: 'Get pre-signed URL' },
              { from: 'vid-client', to: 'vid-raw-store', label: 'Chunked upload', style: 'dashed' },
              { from: 'vid-upload-svc', to: 'vid-raw-store', label: 'Track chunks' },
            ],
          },
        },
        {
          id: 'video-upload-server-proxy',
          label: 'Server-Proxied Upload',
          description: 'Upload the entire video file through your API servers which then write it to storage.',
          score: 4,
          feedback:
            'Proxying multi-gigabyte files through your servers is extremely resource-intensive. Server memory and bandwidth become bottlenecks and there is no resume on failure.',
          diagramEffect: {
            addNodes: [
              { id: 'vid-client', type: 'client', label: 'Creator Client', x: 100, y: 300 },
              { id: 'vid-lb', type: 'loadBalancer', label: 'Load Balancer', x: 300, y: 300 },
              { id: 'vid-upload-svc', type: 'server', label: 'Upload Server', x: 500, y: 150 },
              { id: 'vid-raw-store', type: 'storage', label: 'Raw Storage', x: 700, y: 150 },
            ],
            addConnections: [
              { from: 'vid-client', to: 'vid-lb', label: 'Upload' },
              { from: 'vid-lb', to: 'vid-upload-svc', label: 'Proxy' },
              { from: 'vid-upload-svc', to: 'vid-raw-store', label: 'Write file' },
            ],
          },
        },
        {
          id: 'video-upload-p2p',
          label: 'Peer-to-Peer Upload',
          description: 'Use a P2P protocol to distribute upload load across multiple nodes.',
          score: 2,
          feedback:
            'P2P uploads are unreliable for ingestion and add enormous client-side complexity. You need reliable, durable storage for original video files, not a distributed mesh.',
          diagramEffect: {
            addNodes: [
              { id: 'vid-client', type: 'client', label: 'Creator Client', x: 100, y: 300 },
              { id: 'vid-upload-svc', type: 'server', label: 'P2P Coordinator', x: 500, y: 300 },
            ],
            addConnections: [
              { from: 'vid-client', to: 'vid-upload-svc', label: 'P2P Upload' },
            ],
          },
        },
      ],
    },
    {
      id: 'video-transcode',
      title: 'Transcoding Approach',
      description:
        'How should you transcode uploaded videos into multiple resolutions and formats for adaptive streaming?',
      category: 'Processing',
      options: [
        {
          id: 'video-transcode-distributed-queue',
          label: 'Distributed Worker Queue',
          description:
            'Submit transcode jobs to a message queue. A pool of GPU-equipped workers picks jobs, splits videos into segments, transcodes each segment in parallel across multiple resolutions.',
          score: 10,
          feedback:
            'Segment-parallel transcoding dramatically reduces time-to-available. The queue ensures no jobs are lost and workers auto-scale based on backlog depth. GPU workers handle the compute-heavy encoding.',
          diagramEffect: {
            addNodes: [
              { id: 'vid-transcode-queue', type: 'queue', label: 'Transcode Queue', x: 700, y: 300 },
              { id: 'vid-transcode-workers', type: 'server', label: 'Transcode Workers\n(GPU Pool)', x: 900, y: 300 },
              { id: 'vid-processed-store', type: 'storage', label: 'Processed Video\nStorage', x: 900, y: 150 },
            ],
            addConnections: [
              { from: 'vid-upload-svc', to: 'vid-transcode-queue', label: 'Submit job' },
              { from: 'vid-transcode-queue', to: 'vid-transcode-workers', label: 'Dequeue' },
              { from: 'vid-transcode-workers', to: 'vid-processed-store', label: 'Write outputs' },
            ],
          },
        },
        {
          id: 'video-transcode-single-server',
          label: 'Single Transcode Server',
          description: 'A dedicated powerful server sequentially transcodes each video into all required formats.',
          score: 2,
          feedback:
            'A single server creates a massive bottleneck. Transcoding a 1-hour 4K video takes hours on one machine. At YouTube scale you would need millions of hours of compute daily.',
          diagramEffect: {
            addNodes: [
              { id: 'vid-transcode-workers', type: 'server', label: 'Transcode Server', x: 900, y: 300 },
            ],
            addConnections: [
              { from: 'vid-raw-store', to: 'vid-transcode-workers', label: 'Sequential transcode' },
            ],
          },
        },
        {
          id: 'video-transcode-on-demand',
          label: 'Just-in-Time Transcoding',
          description: 'Store only the original video and transcode on demand when a viewer requests a specific resolution.',
          score: 4,
          feedback:
            'JIT transcoding saves storage but adds seconds of delay to first-view latency and requires massive compute capacity for popular videos viewed thousands of times simultaneously.',
          diagramEffect: {
            addNodes: [
              { id: 'vid-transcode-workers', type: 'server', label: 'JIT Transcoder', x: 900, y: 300 },
            ],
            addConnections: [
              { from: 'vid-raw-store', to: 'vid-transcode-workers', label: 'On-demand transcode' },
            ],
          },
        },
      ],
    },
    {
      id: 'video-cdn',
      title: 'Content Delivery',
      description:
        'How should you deliver video content globally with <2 second start times?',
      category: 'Delivery',
      options: [
        {
          id: 'video-cdn-multi-tier',
          label: 'Multi-Tier CDN with Edge Caching',
          description:
            'Deploy a multi-tier CDN: edge servers in 100+ cities cache popular content, mid-tier regional caches reduce origin load, and origin servers serve from object storage.',
          score: 10,
          feedback:
            'Multi-tier CDN ensures most video segments are served from nearby edge servers. Popular videos are cached at the edge while long-tail content flows through regional caches, optimizing both latency and cost.',
          diagramEffect: {
            addNodes: [
              { id: 'vid-viewer', type: 'client', label: 'Viewer Client', x: 100, y: 550 },
              { id: 'vid-cdn-edge', type: 'cdn', label: 'CDN Edge\n(100+ Cities)', x: 300, y: 550 },
              { id: 'vid-cdn-mid', type: 'cdn', label: 'Regional CDN\nCache', x: 500, y: 550 },
            ],
            addConnections: [
              { from: 'vid-viewer', to: 'vid-cdn-edge', label: 'Fetch segment' },
              { from: 'vid-cdn-edge', to: 'vid-cdn-mid', label: 'Cache miss', style: 'dashed' },
              { from: 'vid-cdn-mid', to: 'vid-processed-store', label: 'Origin pull', style: 'dashed' },
            ],
          },
        },
        {
          id: 'video-cdn-single-tier',
          label: 'Single-Tier CDN',
          description: 'Use a standard CDN service (CloudFront/Akamai) with a single cache layer in front of origin storage.',
          score: 7,
          feedback:
            'A single CDN tier works but cache miss rates are higher for long-tail content. Each cache miss goes all the way to origin, increasing latency for less popular videos.',
          diagramEffect: {
            addNodes: [
              { id: 'vid-viewer', type: 'client', label: 'Viewer Client', x: 100, y: 550 },
              { id: 'vid-cdn-edge', type: 'cdn', label: 'CDN Edge', x: 300, y: 550 },
            ],
            addConnections: [
              { from: 'vid-viewer', to: 'vid-cdn-edge', label: 'Fetch segment' },
              { from: 'vid-cdn-edge', to: 'vid-processed-store', label: 'Origin pull', style: 'dashed' },
            ],
          },
        },
        {
          id: 'video-cdn-direct',
          label: 'Direct from Origin',
          description: 'Serve video directly from origin storage servers with geo-distributed replicas.',
          score: 2,
          feedback:
            'Direct serving from origin cannot handle 1B views/day. Even with replicas, storage systems are not optimized for the concurrent streaming throughput required.',
          diagramEffect: {
            addNodes: [
              { id: 'vid-viewer', type: 'client', label: 'Viewer Client', x: 100, y: 550 },
            ],
            addConnections: [
              { from: 'vid-viewer', to: 'vid-processed-store', label: 'Direct fetch' },
            ],
          },
        },
      ],
    },
    {
      id: 'video-streaming-protocol',
      title: 'Video Player / Streaming Protocol',
      description:
        'What streaming protocol should the video player use for adaptive bitrate playback?',
      category: 'Delivery',
      options: [
        {
          id: 'video-protocol-hls-dash',
          label: 'HLS + DASH Adaptive Streaming',
          description:
            'Support both HLS (Apple) and DASH (standard) for maximum device compatibility. The player requests small video segments and dynamically switches quality based on bandwidth.',
          score: 10,
          feedback:
            'HLS and DASH cover virtually all devices. Segment-based delivery works perfectly with CDN caching, and adaptive bitrate ensures smooth playback even on unstable connections.',
          diagramEffect: {
            addNodes: [
              { id: 'vid-api-svc', type: 'server', label: 'Video API\nService', x: 500, y: 450 },
              { id: 'vid-metadata-db', type: 'database', label: 'Video Metadata\nDB', x: 700, y: 450 },
            ],
            addConnections: [
              { from: 'vid-lb', to: 'vid-api-svc', label: 'API requests' },
              { from: 'vid-api-svc', to: 'vid-metadata-db', label: 'Query metadata' },
              { from: 'vid-viewer', to: 'vid-cdn-edge', label: 'HLS/DASH segments' },
            ],
          },
        },
        {
          id: 'video-protocol-rtmp',
          label: 'RTMP Streaming',
          description: 'Stream video using RTMP (Real-Time Messaging Protocol) for low-latency delivery.',
          score: 4,
          feedback:
            'RTMP provides low latency but requires persistent connections and does not work natively in browsers (Flash is dead). It also does not leverage CDN caching well.',
          diagramEffect: {
            addNodes: [
              { id: 'vid-api-svc', type: 'server', label: 'RTMP Streaming\nServer', x: 500, y: 450 },
            ],
            addConnections: [
              { from: 'vid-viewer', to: 'vid-api-svc', label: 'RTMP stream' },
            ],
          },
        },
        {
          id: 'video-protocol-progressive',
          label: 'Progressive Download',
          description: 'Serve the entire video file as a progressive HTTP download that plays as it downloads.',
          score: 2,
          feedback:
            'Progressive download cannot adapt to bandwidth changes, wastes bandwidth if users stop watching, and a single file cannot serve multiple quality levels.',
          diagramEffect: {
            addConnections: [
              { from: 'vid-viewer', to: 'vid-cdn-edge', label: 'Full file download' },
            ],
          },
        },
      ],
    },
    {
      id: 'video-recommendations',
      title: 'Recommendation Engine',
      description:
        'How should you build the recommendation system that drives the majority of video views?',
      category: 'Features',
      options: [
        {
          id: 'video-rec-ml-pipeline',
          label: 'ML Pipeline with Real-Time Features',
          description:
            'Use a two-stage ML system: a candidate generation model retrieves hundreds of candidates from an embedding index, then a ranking model scores them using real-time user features from a feature store.',
          score: 10,
          feedback:
            'The two-stage approach (retrieval + ranking) is used by YouTube and Netflix. It balances coverage (millions of videos) with personalization quality (real-time features like watch history).',
          diagramEffect: {
            addNodes: [
              { id: 'vid-rec-svc', type: 'server', label: 'Recommendation\nService', x: 300, y: 700 },
              { id: 'vid-feature-store', type: 'cache', label: 'Feature Store\n(Redis)', x: 500, y: 700 },
              { id: 'vid-rec-db', type: 'database', label: 'Embedding\nIndex', x: 700, y: 700 },
            ],
            addConnections: [
              { from: 'vid-api-svc', to: 'vid-rec-svc', label: 'Get recommendations' },
              { from: 'vid-rec-svc', to: 'vid-feature-store', label: 'User features' },
              { from: 'vid-rec-svc', to: 'vid-rec-db', label: 'Candidate retrieval' },
            ],
          },
        },
        {
          id: 'video-rec-collaborative',
          label: 'Collaborative Filtering',
          description: 'Use pre-computed collaborative filtering (users who watched X also watched Y) updated in daily batch jobs.',
          score: 7,
          feedback:
            'Collaborative filtering is a solid baseline but daily batch updates mean recommendations do not reflect a user\'s current session. Real-time features significantly improve engagement.',
          diagramEffect: {
            addNodes: [
              { id: 'vid-rec-svc', type: 'server', label: 'Recommendation\nService', x: 300, y: 700 },
              { id: 'vid-rec-db', type: 'database', label: 'Recommendation\nDB', x: 500, y: 700 },
            ],
            addConnections: [
              { from: 'vid-api-svc', to: 'vid-rec-svc', label: 'Get recs' },
              { from: 'vid-rec-svc', to: 'vid-rec-db', label: 'Query pre-computed' },
            ],
          },
        },
        {
          id: 'video-rec-popularity',
          label: 'Popularity-Based',
          description: 'Recommend trending and popular videos based on view counts and recency.',
          score: 4,
          feedback:
            'Popularity-based recommendations ignore individual preferences entirely. Every user sees the same suggestions, which reduces engagement and discovery of niche content.',
          diagramEffect: {
            addNodes: [
              { id: 'vid-rec-svc', type: 'server', label: 'Trending\nService', x: 300, y: 700 },
            ],
            addConnections: [
              { from: 'vid-api-svc', to: 'vid-rec-svc', label: 'Get trending' },
            ],
          },
        },
      ],
    },
    {
      id: 'video-search',
      title: 'Search System',
      description:
        'How should you implement video search across titles, descriptions, tags, and transcripts?',
      category: 'Features',
      options: [
        {
          id: 'video-search-es-vector',
          label: 'Elasticsearch + Vector Search',
          description:
            'Use Elasticsearch for keyword search across video metadata and captions. Augment with vector embeddings for semantic search that understands query intent beyond exact keywords.',
          score: 10,
          feedback:
            'Combining keyword and semantic search provides the best results. Users searching for "funny cat compilation" find relevant videos even if those exact words are not in the title or description.',
          diagramEffect: {
            addNodes: [
              { id: 'vid-search-svc', type: 'server', label: 'Search Service', x: 100, y: 700 },
              { id: 'vid-search-idx', type: 'database', label: 'Search Index\n(Elasticsearch)', x: 100, y: 550 },
            ],
            addConnections: [
              { from: 'vid-api-svc', to: 'vid-search-svc', label: 'Search query' },
              { from: 'vid-search-svc', to: 'vid-search-idx', label: 'Keyword + vector' },
              { from: 'vid-transcode-queue', to: 'vid-search-idx', label: 'Index metadata', style: 'dashed' },
            ],
          },
        },
        {
          id: 'video-search-es-only',
          label: 'Elasticsearch Only',
          description: 'Use Elasticsearch for full-text search across all video metadata fields.',
          score: 7,
          feedback:
            'Elasticsearch handles keyword search well but misses semantic matches. A search for "how to fix a flat tire" would miss a video titled "bicycle tube repair tutorial."',
          diagramEffect: {
            addNodes: [
              { id: 'vid-search-idx', type: 'database', label: 'Search Index\n(Elasticsearch)', x: 100, y: 700 },
            ],
            addConnections: [
              { from: 'vid-api-svc', to: 'vid-search-idx', label: 'Search query' },
            ],
          },
        },
        {
          id: 'video-search-db-like',
          label: 'Database LIKE Queries',
          description: 'Use SQL LIKE queries on the video metadata database to find matching videos.',
          score: 2,
          feedback:
            'LIKE queries do full table scans and cannot rank results by relevance. At 500PB of content metadata, search would take seconds or minutes instead of milliseconds.',
          diagramEffect: {
            addConnections: [
              { from: 'vid-api-svc', to: 'vid-metadata-db', label: 'LIKE query' },
            ],
          },
        },
      ],
    },
  ],
};
