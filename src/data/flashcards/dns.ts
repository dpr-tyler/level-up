import { FlashcardDeck } from '@/types/flashcard';

export const deck: FlashcardDeck = {
  topic: 'dns',
  title: 'DNS',
  description: 'Understand the Domain Name System including resolution process, record types, TTL, DNS-based load balancing, and DNS security.',
  icon: '📡',
  cards: [
    {
      id: 'dns-1',
      front: 'Describe the full DNS resolution process when a user visits a website.',
      back: 'Step by step: (1) Browser checks its local DNS cache. (2) OS checks its cache (and hosts file). (3) Query goes to the configured recursive resolver (usually ISP or public like 8.8.8.8). (4) Resolver checks its cache; if miss, queries the root nameserver. (5) Root NS directs to the TLD nameserver (.com, .org). (6) TLD NS directs to the authoritative nameserver for the domain. (7) Authoritative NS returns the IP address. (8) Resolver caches the result (respecting TTL) and returns it to the client. The entire process typically takes 20-120ms uncached.',
      topic: 'dns',
    },
    {
      id: 'dns-2',
      front: 'What are the most common DNS record types?',
      back: 'A: maps a domain to an IPv4 address. AAAA: maps to an IPv6 address. CNAME: canonical name alias (points to another domain, not an IP). Cannot coexist with other records at the same name. MX: mail exchange servers with priority values. TXT: arbitrary text (used for SPF, DKIM, domain verification). NS: delegates a subdomain to specific nameservers. SOA: start of authority with zone metadata. SRV: service location with port and priority. PTR: reverse DNS (IP to domain). CAA: specifies which CAs can issue certificates for the domain.',
      topic: 'dns',
    },
    {
      id: 'dns-3',
      front: 'What is TTL in DNS and how do you choose the right value?',
      back: 'TTL (Time To Live) specifies how long (in seconds) a DNS record can be cached before re-querying the authoritative server. Low TTL (60-300s): faster propagation of changes, useful before migrations, enables DNS-based failover. Costs: higher query volume to your nameservers, slightly higher latency. High TTL (3600-86400s): fewer queries, faster resolution from cache, but changes propagate slowly. Strategy: use high TTLs normally, lower them before planned changes, then raise again after. Note: some resolvers ignore low TTLs, so DNS is never truly instant for failover.',
      topic: 'dns',
    },
    {
      id: 'dns-4',
      front: 'How is DNS used for load balancing?',
      back: 'DNS load balancing returns multiple IP addresses for a domain, distributing clients across servers. Methods: (1) Round-robin DNS: rotate through IPs in responses. Simple but no health awareness. (2) Weighted DNS: return IPs with different frequencies based on server capacity. (3) Geolocation/latency-based: return the IP of the nearest or lowest-latency server. (4) Health-checked DNS (Route 53, Cloudflare): automatically remove unhealthy IPs. Limitations: DNS caching makes changes slow, no awareness of server load, and clients may cache and stick to one IP.',
      topic: 'dns',
    },
    {
      id: 'dns-5',
      front: 'What is DNSSEC and why is it important?',
      back: 'DNSSEC (DNS Security Extensions) adds cryptographic authentication to DNS responses, preventing DNS spoofing and cache poisoning attacks. It works by digitally signing DNS records with a chain of trust from the root zone. Each zone signs its records, and the parent zone vouches for child zone keys (DS records). Resolvers verify signatures to ensure responses are authentic and unmodified. Limitations: does not encrypt queries (use DNS-over-HTTPS or DNS-over-TLS for privacy), adds complexity, larger response sizes, and key management overhead.',
      topic: 'dns',
    },
    {
      id: 'dns-6',
      front: 'What is DNS-over-HTTPS (DoH) and DNS-over-TLS (DoT)?',
      back: 'DoH and DoT encrypt DNS queries to prevent eavesdropping and manipulation by network intermediaries. DoT: sends DNS queries over TLS on port 853. Easy to identify and block at the network level. DoH: sends DNS queries as HTTPS requests on port 443, making them indistinguishable from regular web traffic. Harder to block. Both prevent ISPs from seeing or modifying DNS queries. Tradeoffs: improved privacy for users but reduces network administrators\' visibility; may bypass corporate DNS policies. Supported by major browsers and resolvers (Cloudflare 1.1.1.1, Google 8.8.8.8).',
      topic: 'dns',
    },
    {
      id: 'dns-7',
      front: 'What is a DNS cache poisoning attack?',
      back: 'DNS cache poisoning (DNS spoofing) injects false records into a resolver\'s cache, redirecting users to malicious servers. Attack: the attacker sends forged DNS responses to a recursive resolver, trying to match the query ID and port before the legitimate response arrives. If successful, the resolver caches the fake record and serves it to all clients until TTL expires. Prevention: DNSSEC (cryptographic verification), source port randomization, query ID randomization, 0x20 encoding (random case in queries), and using trusted recursive resolvers.',
      topic: 'dns',
    },
    {
      id: 'dns-8',
      front: 'What is the difference between authoritative and recursive DNS servers?',
      back: 'Authoritative DNS servers hold the actual DNS records for a domain and provide definitive answers. They do not query other servers; they are the source of truth. Managed via registrars or DNS providers (Route 53, Cloudflare). Recursive DNS servers (resolvers) handle the full lookup process on behalf of clients. They cache results and recursively query root, TLD, and authoritative servers as needed. Examples: ISP resolvers, Google (8.8.8.8), Cloudflare (1.1.1.1). A client typically talks only to its recursive resolver, never directly to authoritative servers.',
      topic: 'dns',
    },
    {
      id: 'dns-9',
      front: 'What are common DNS failover strategies?',
      back: 'DNS failover automatically redirects traffic when a server or data center goes down. Strategies: (1) Health-checked DNS (Route 53, Cloudflare): monitor endpoints and remove unhealthy IPs from responses. (2) Active-passive: primary IP in DNS, failover IP added when primary fails. (3) Active-active with health checks: multiple IPs, unhealthy ones removed. Limitations: DNS TTL caching delays failover (clients use stale IPs), some clients ignore TTL, and DNS failover typically takes 30s-5min. For faster failover, combine DNS with anycast routing or a load balancer layer.',
      topic: 'dns',
    },
    {
      id: 'dns-10',
      front: 'What is anycast and how is it used in DNS?',
      back: 'Anycast assigns the same IP address to multiple servers in different locations. Network routing (BGP) automatically directs packets to the nearest/best server. In DNS: root nameservers and major DNS providers use anycast so that queries are answered by the geographically closest server, reducing latency and distributing load. Benefits: automatic geographic load balancing, DDoS resilience (attack traffic is distributed across all anycast nodes), and instant failover (if one node goes down, traffic routes to the next nearest). Used by Cloudflare, Google Public DNS, and all 13 root nameserver identities.',
      topic: 'dns',
    },
  ],
};
