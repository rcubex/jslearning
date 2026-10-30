# Module 24: Global Traffic, Edge & DDoS

**Level:** 4 · **Lessons:** 7 · **Questions:** 5

_Design global entry points, CDNs and DDoS defences across all four clouds._

## Lesson 1: Anatomy of a global entry point

When users around the world reach your application, several layers can sit between them and your servers:

1. **DNS**: resolves your name, possibly with geo, latency or failover policies.
2. **Edge / point of presence (PoP)**: a provider location near the user that receives the connection over **anycast**, terminates TCP and TLS, applies WAF and DDoS protection, and serves cached content.
3. **Backbone**: the provider carries the request over its private network to the right region, avoiding congested Internet paths.
4. **Regional load balancer**: distributes to backends in a region.
5. **Origin**: your application servers, containers or storage.

Terminating TLS at the edge is a big latency win: the handshake's round trips happen over a short distance to the nearby PoP, and the long-distance part runs over warm, reused connections.

**Where the time goes for a user 3,000 km from the region**

```
Direct to region:    TCP + TLS 1.3 handshake = 2 RTT × 60 ms = 120 ms before the request is even sent
Via nearby edge PoP: 2 RTT × 5 ms = 10 ms, then the request travels on an existing backbone connection
```

> **Tip:** Even for dynamic, uncacheable APIs, an edge entry point usually cuts latency for distant users because of edge TLS termination and backbone routing.

## Lesson 2: AWS: CloudFront, Global Accelerator and Route 53

- **Amazon CloudFront**: CDN and edge proxy with hundreds of PoPs. Behaviours route paths to different **origins** (S3, ALB, API Gateway, any HTTP server). **Origin Access Control** keeps S3 buckets private so they can only be read through CloudFront. **CloudFront Functions** and **Lambda@Edge** run code at the edge. Integrates with **AWS WAF** and **Shield**. **VPC origins** let CloudFront reach private ALBs and instances without exposing them publicly.
- **AWS Global Accelerator**: two static **anycast IP addresses** that route TCP/UDP traffic over the AWS backbone to the nearest healthy endpoint (ALB, NLB, EC2, Elastic IP) in one or more regions, with fast failover (no DNS caching involved). Good for non-HTTP protocols, games, VoIP, or clients that need fixed IPs.
- **Amazon Route 53**: latency, geolocation, weighted and failover routing with health checks; **Application Recovery Controller** adds routing controls and readiness checks for regional failover.

> **Tip:** CloudFront for HTTP(S) and caching; Global Accelerator for static IPs and non-HTTP traffic; Route 53 policies for coarse DNS-level steering and disaster recovery.

## Lesson 3: Azure: Front Door, Traffic Manager and cross-region load balancing

- **Azure Front Door** (Standard/Premium): global L7 entry on Microsoft's edge, combining anycast, TLS termination, caching (CDN), path-based routing across regions, health probes and **WAF**. Premium adds managed WAF rule sets with bot protection and **Private Link origins**, so App Services, storage or internal load balancers can stay fully private.
- **Azure Traffic Manager**: DNS-based global routing (priority, weighted, performance, geographic, multivalue, subnet). Works for any protocol but inherits DNS caching delays.
- **Cross-region (global) Load Balancer**: a global L4 load balancer with a static anycast IP in front of regional Standard Load Balancers, for TCP/UDP failover across regions.

**A private, global web app on Azure**

```
Front Door Premium (WAF, custom domain, managed certificate)
  → Private Link origin: App Service in UAE North (primary)
  → Private Link origin: App Service in West Europe (secondary, priority 2)
App Services: public network access disabled
```

> **Tip:** Lock origins so they only accept Front Door traffic: use Private Link origins, or check the `X-Azure-FDID` header plus the `AzureFrontDoor.Backend` service tag.

## Lesson 4: Google Cloud: global load balancing, Cloud CDN and Cloud Armor

Google Cloud's **global external Application Load Balancer** is itself an edge service: one anycast IP, TLS terminated at Google's edge, and requests routed over Google's backbone to the closest healthy backend in any region. There's no separate edge product to stitch in.

- **Backend services** can span instance groups and NEGs in many regions; traffic fills the nearest region and overflows to others based on capacity settings.
- **Cloud CDN** enables caching on backend services or backend buckets (Cloud Storage); **Media CDN** targets large-scale video and file delivery.
- **Cloud Armor** attaches security policies: preconfigured WAF rules, rate limiting, geo rules, bot management and **Adaptive Protection**, which uses machine learning to detect layer 7 attacks and suggest rules.
- **Certificate Manager** handles many certificates and domains for the load balancer.

**A multi-region backend service (concept)**

```
URL map: /api/* → backend-service api-bs ; default → backend-bucket static-site (Cloud CDN on)
api-bs backends: MIG in me-central1 (max 80% utilisation) + MIG in europe-west1
Cloud Armor policy on api-bs: OWASP rules + rate limit 300 req/min per client IP
```

> **Tip:** Google's global load balancer requires the Premium network tier. Standard tier is regional only.

## Lesson 5: OCI: global traffic steering and edge security

OCI's global traffic tools build on DNS and regional services:

- **OCI DNS traffic management steering policies**: failover, load balancing (weighted), geolocation, ASN and IP prefix steering, with **health checks** on endpoints. Typically point each answer at a regional OCI Load Balancer.
- **OCI Load Balancer** and **Network Load Balancer** in each region, with backends in private subnets.
- **OCI WAF**: protects load balancers with access control, rate limiting, protection rules and bot management.
- **DDoS protection**: OCI includes protection against layer 3/4 attacks at no extra cost.
- For CDN needs, OCI customers typically use a third-party or partner CDN in front of OCI origins.

> **Tip:** Combine a DNS failover policy (with health checks and a low TTL) with regional load balancers in two OCI regions for a simple, robust active-passive setup.

## Lesson 6: DDoS fundamentals and defences

A **distributed denial-of-service (DDoS)** attack floods a target from many sources. Three broad types:

- **Volumetric** (layer 3/4): huge traffic volumes, often amplified via open DNS, NTP or memcached servers, aiming to saturate links. Measured in Gbps or Tbps.
- **Protocol / state exhaustion**: SYN floods and similar attacks fill connection tables on firewalls, load balancers or servers. Measured in packets per second.
- **Application layer** (layer 7): realistic-looking HTTP requests at high rates, often targeting expensive pages (search, login). Hardest to distinguish from real users.

Defence in layers:

1. **Provider network protection** (AWS Shield, Azure DDoS Protection, Google Cloud's built-in protection plus Cloud Armor, OCI's included DDoS protection) absorbs volumetric and protocol attacks at massive scale.
2. **Edge and WAF**: anycast edges spread attack traffic over many locations; WAF rules, **rate limiting**, bot management and geo rules filter layer 7 attacks.
3. **Hide the origin**: origins accept traffic only from the edge. An attacker who finds an origin IP can bypass everything.
4. **Resilient application**: autoscaling, caching, queueing, and graceful degradation (serve a cached page when the backend is overloaded).
5. **Runbook**: who to call, which rules to tighten, and how to reach the provider's response team.

> **Watch out:** Autoscaling under a layer 7 attack can turn a security incident into a large bill. Pair autoscaling with rate limits and budget alerts.

## Lesson 7: Real-world scenario: the flash sale that looked like an attack

**Situation.** An online store in the Gulf runs a 24-hour flash sale. At 20:00, traffic jumps 40×. Pages slow to 9 seconds, the checkout API returns 503 errors, and the security team sees thousands of requests per second to `/search` from a few hundred IP ranges. Is it a DDoS attack or real customers?

**Investigation.**

1. **Edge logs** show most traffic comes from normal browsers in expected countries with valid sessions: real customers. But 30% of `/search` requests come from about 200 IPs at hundreds of requests per minute each, with no cookies and a scripted user agent: a scraping bot, probably a competitor.
2. **Backend metrics**: the database CPU is pinned by uncached search queries.
3. **Cache metrics**: the CDN cache hit ratio is only 15%, because the cache key includes a tracking query parameter (`utm_*`) that is different for every visitor.

**Fix.**

1. Add a **rate-limiting rule** on `/search` (for example, 60 requests per minute per client IP) and a **bot management** rule challenging requests with no cookies. The scraper's traffic drops by 95%.
2. Remove marketing query parameters from the **cache key**. The cache hit ratio rises to 85% within minutes and origin load falls sharply.
3. Cache search results for popular terms for 30 seconds.
4. Raise the autoscaling maximum for the checkout service, now that it's protected from abusive traffic.

**Lessons learned.** Distinguish good from bad traffic with edge logs before reacting; blocking real customers during a sale is worse than slow pages. Cache keys and rate limits are often more effective than raw scaling. Prepare these rules before big events, in count mode, and switch them to block when needed.

## Key takeaways

- Global entry combines DNS, anycast edges, CDNs and regional load balancers.
- Terminate TLS and absorb attacks at the edge, close to users and far from your origin.
- Choose active-active or active-passive deliberately; both need data replication plans.
- DDoS defence is layered: provider network, edge WAF and rate limits, and resilient origins.

## Checkpoint

**Q1. Why does terminating TLS at a nearby edge reduce latency for distant users?**

A. Edge servers have faster CPUs
B. Handshake round trips happen over a short distance, and the long leg reuses warm backbone connections  ✓
C. TLS is disabled at the edge
D. DNS is skipped

_Edge termination moves handshake round trips close to the user._

**Q2. Which AWS service gives two static anycast IPs that route TCP/UDP traffic to the nearest healthy regional endpoint?**

A. CloudFront
B. Global Accelerator  ✓
C. Route 53
D. Transit Gateway

_Global Accelerator provides static anycast IPs and backbone routing for any TCP/UDP traffic._

**Q3. How can you keep Azure App Service origins private behind Front Door?**

A. Use Traffic Manager
B. Use Front Door Premium with Private Link origins and disable public access  ✓
C. Add a public IP
D. Use a NAT gateway

_Private Link origins let Front Door reach origins that have no public access._

**Q4. What does a SYN flood target?**

A. DNS caches
B. Connection-state tables on servers, firewalls or load balancers  ✓
C. TLS certificates
D. CDN cache keys

_SYN floods exhaust half-open connection state._

**Q5. A CDN's cache hit ratio is very low because every URL has unique marketing parameters. Best fix?**

A. Add more origin servers
B. Exclude those parameters from the cache key  ✓
C. Disable the CDN
D. Shorten the TTL

_Removing irrelevant parameters from the cache key lets requests share cached objects._

## Official reading

- [Amazon CloudFront developer guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)
- [AWS Global Accelerator](https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html)
- [Azure Front Door overview](https://learn.microsoft.com/en-us/azure/frontdoor/front-door-overview)
- [Google Cloud: external Application Load Balancer](https://cloud.google.com/load-balancing/docs/https)
- [OCI DNS traffic management](https://docs.oracle.com/en-us/iaas/Content/TrafficManagement/Concepts/overview.htm)
- [Cloudflare Learning: what is a DDoS attack](https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/)
