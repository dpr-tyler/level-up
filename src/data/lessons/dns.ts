import { Lesson } from '@/types/lesson';

export const lesson: Lesson = {
  slug: 'dns',
  title: 'Domain Name System (DNS)',
  description:
    'Explore how DNS translates human-readable domain names into IP addresses and powers the internet\'s routing infrastructure.',
  icon: 'signpost',
  estimatedMinutes: 11,
  content: [
    {
      type: 'heading',
      content: 'How DNS Works',
      level: 2,
    },
    {
      type: 'paragraph',
      content:
        'The Domain Name System (DNS) is often called the phone book of the internet. When you type "example.com" into your browser, DNS translates that human-readable name into an IP address like 93.184.216.34 that computers use to route traffic. This resolution process happens in milliseconds and involves a hierarchy of specialized servers working together.',
    },
    {
      type: 'diagram',
      caption: 'DNS resolution chain: from the user\'s browser to the authoritative nameserver',
      diagram: {
        nodes: [
          { id: 'browser', type: 'client', label: 'User Browser', x: 50, y: 200 },
          { id: 'resolver', type: 'dns', label: 'Recursive Resolver', x: 230, y: 200 },
          { id: 'root', type: 'dns', label: 'Root Nameserver', x: 420, y: 50 },
          { id: 'tld', type: 'dns', label: 'TLD Nameserver (.com)', x: 420, y: 200 },
          { id: 'auth', type: 'dns', label: 'Authoritative NS', x: 420, y: 370 },
          { id: 'server', type: 'server', label: 'Web Server 93.184.216.34', x: 630, y: 370 },
        ],
        connections: [
          { from: 'browser', to: 'resolver', label: 'example.com?', style: 'solid' },
          { from: 'resolver', to: 'root', label: '1. where is .com?', style: 'solid' },
          { from: 'resolver', to: 'tld', label: '2. where is example.com?', style: 'solid' },
          { from: 'resolver', to: 'auth', label: '3. IP for example.com?', style: 'solid' },
          { from: 'auth', to: 'resolver', label: '93.184.216.34', style: 'dashed' },
          { from: 'browser', to: 'server', label: 'HTTP request', style: 'dashed' },
        ],
      },
    },
    {
      type: 'heading',
      content: 'The DNS Hierarchy',
      level: 3,
    },
    {
      type: 'list',
      items: [
        'Root Nameservers: The top of the DNS hierarchy. There are 13 logical root server addresses (A through M), operated by organizations like ICANN, Verisign, and NASA. They direct queries to the appropriate TLD nameserver.',
        'TLD Nameservers: Manage top-level domains like .com, .org, .net, and country codes like .uk and .jp. They know which authoritative nameservers are responsible for each domain under their TLD.',
        'Authoritative Nameservers: The final authority for a domain. They hold the actual DNS records (A, AAAA, CNAME, MX, etc.) and return definitive answers for queries about that domain.',
        'Recursive Resolvers: Usually operated by your ISP or services like Google (8.8.8.8) or Cloudflare (1.1.1.1). They walk the hierarchy on your behalf and cache results to speed up subsequent lookups.',
      ],
      ordered: true,
    },
    {
      type: 'heading',
      content: 'DNS Record Types',
      level: 3,
    },
    {
      type: 'code',
      language: 'text',
      content: `# Common DNS record types

# A Record — maps domain to IPv4 address
example.com.        300   IN  A      93.184.216.34

# AAAA Record — maps domain to IPv6 address
example.com.        300   IN  AAAA   2606:2800:220:1:248:1893:25c8:1946

# CNAME Record — alias pointing to another domain
www.example.com.    3600  IN  CNAME  example.com.

# MX Record — mail server for the domain (priority + server)
example.com.        3600  IN  MX     10 mail.example.com.

# NS Record — nameservers authoritative for this domain
example.com.        86400 IN  NS     ns1.example.com.

# TXT Record — arbitrary text, used for SPF, DKIM, verification
example.com.        300   IN  TXT    "v=spf1 include:_spf.google.com ~all"`,
    },
    {
      type: 'heading',
      content: 'TTL and DNS Caching',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'Every DNS record has a Time-To-Live (TTL) value, specified in seconds, that tells resolvers how long they can cache the response before querying again. A TTL of 300 means the record is cached for 5 minutes. High TTLs (e.g., 86400 = 24 hours) reduce DNS traffic but make changes slower to propagate. Low TTLs allow faster updates but increase query volume. Before a planned migration or failover, it is common practice to lower TTLs in advance so that the switch happens quickly.',
    },
    {
      type: 'callout',
      variant: 'info',
      content:
        'DNS caching happens at multiple layers: the browser cache, the operating system cache, the recursive resolver cache, and sometimes even at the router level. When you change a DNS record, it may take up to the previous TTL duration for all caches to expire and reflect the new value. This is why DNS changes are often described as taking "up to 24-48 hours" to propagate — though in practice with low TTLs, it is much faster.',
    },
    {
      type: 'heading',
      content: 'DNS-Based Load Balancing',
      level: 3,
    },
    {
      type: 'paragraph',
      content:
        'DNS can be used for basic load balancing by returning multiple A records for the same domain (round-robin DNS) or by using weighted or geolocation-based routing. Services like AWS Route 53, Cloudflare DNS, and Google Cloud DNS support advanced policies: latency-based routing sends users to the closest healthy server, failover routing switches to a backup when health checks fail, and weighted routing distributes traffic by percentage across server pools.',
    },
    {
      type: 'callout',
      variant: 'tip',
      content:
        'For critical services, use DNS health checks to automatically remove unhealthy endpoints from DNS responses. Combine DNS-based routing with application-level load balancers for a multi-layered approach: DNS handles geographic routing while load balancers handle per-request distribution across server instances.',
    },
    {
      type: 'quiz',
      question: {
        id: 'dns-q1',
        question:
          'You need to point "blog.example.com" to the same server as "example.com" without hardcoding an IP address, so that if the IP changes, both names automatically resolve correctly. Which DNS record type should you use?',
        options: [
          'A record with the same IP address',
          'MX record pointing to example.com',
          'CNAME record pointing to example.com',
          'NS record delegating to example.com',
        ],
        correctIndex: 2,
        explanation:
          'A CNAME (Canonical Name) record creates an alias from one domain name to another. By setting blog.example.com as a CNAME pointing to example.com, any IP address changes to the A record of example.com will automatically apply to blog.example.com as well. An A record would require manual updates if the IP changes, MX is for mail routing, and NS is for nameserver delegation.',
      },
    },
  ],
};
