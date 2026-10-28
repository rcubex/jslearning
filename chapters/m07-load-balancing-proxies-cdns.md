# Module 08: Load Balancing, Proxies & CDNs

**Level:** 2 · **Lessons:** 6 · **Questions:** 6

_Choose the right traffic distribution layer for an application._

## Lesson 1: L4 vs L7 load balancing

A **load balancer** spreads traffic across several servers so that no single server is overloaded and failed servers are taken out of rotation.

A **Layer 4** load balancer works with IP addresses, protocols and ports. It forwards whole TCP or UDP connections to a backend without looking inside them. It is extremely fast, works with any protocol (databases, game servers, MQTT) and can preserve the client's source IP.

A **Layer 7** load balancer understands HTTP. It terminates the client's connection, reads the request and makes decisions based on content: host name (`api.example.com` vs `www.example.com`), path (`/api` vs `/images`), headers, cookies or query strings. It can also redirect HTTP to HTTPS, rewrite headers, and attach a WAF.

Common distribution algorithms: **round robin** (each server in turn), **least connections** (the least busy server), **weighted** (bigger servers get more) and **hash-based** (the same client always reaches the same server).

- Choose L4 for non-HTTP protocols, extreme performance or static IPs
- Choose L7 for websites and APIs, path/host routing, and WAF integration

> **In the cloud:** AWS Network Load Balancer vs Application Load Balancer, Azure Load Balancer vs Application Gateway, Google Cloud passthrough Network Load Balancer vs Application Load Balancer, OCI Network Load Balancer vs Load Balancer.

## Lesson 2: Health checks

A load balancer regularly sends **health checks** to each backend: a TCP connection attempt, or an HTTP request to a path such as `/healthz`. A backend that fails a set number of checks in a row (the **unhealthy threshold**) stops receiving traffic; after enough successful checks (the **healthy threshold**) it is added back.

Health checks are simple but cause many outages:

- A check that is too shallow (just "is the port open") keeps sending traffic to an app that is running but broken
- A check that is too deep (also tests the database) can mark *every* server unhealthy at once when the database blips, taking the whole site down
- A check blocked by a firewall makes all backends look dead, so the load balancer returns 502/503

**A good health endpoint**

```
GET /healthz  →  200 OK in under 100 ms
- Confirms the process is running and can serve requests
- Does NOT fail just because an optional dependency is slow
```

> **Watch out:** In every cloud, the backend's security rules must allow traffic from the load balancer's health-check source (for example, Google Cloud's health checks come from 35.191.0.0/16 and 130.211.0.0/22).

## Lesson 3: Sessions, TLS termination and reverse proxies

Some applications store user state on one server. **Sticky sessions** (session affinity) send a user's requests to the same backend, usually with a cookie. They help legacy apps but spread load unevenly; storing sessions in a shared cache (Redis) is better.

**TLS termination** means the load balancer or proxy decrypts HTTPS, so it can read and route the request. Traffic to the backend can then be plain HTTP (simple but unencrypted inside your network) or re-encrypted (**TLS re-encryption / end-to-end TLS**, recommended for sensitive data). **TLS passthrough** forwards encrypted traffic untouched, which requires an L4 balancer.

A **reverse proxy** sits in front of servers and handles TLS, compression, caching, rate limiting and request routing, while hiding the internal layout. Nginx, HAProxy and Envoy are the common open-source choices; cloud L7 load balancers are managed reverse proxies.

**Nginx: a minimal reverse proxy with two backends**

```
upstream app {
    least_conn;
    server 10.0.10.11:8080;
    server 10.0.10.12:8080;
}
server {
    listen 443 ssl;
    server_name app.example.com;
    ssl_certificate     /etc/ssl/app.crt;
    ssl_certificate_key /etc/ssl/app.key;
    location / { proxy_pass http://app; proxy_set_header X-Forwarded-For $remote_addr; }
}
```

> **Tip:** Behind an L7 proxy, the app sees the proxy's IP. The real client IP is in the `X-Forwarded-For` header.

## Lesson 4: CDNs and anycast

A **CDN** (content delivery network) caches content in hundreds of **edge locations** close to users. A user in Dubai downloading an image from a server in Ireland gets it from a nearby edge instead, cutting latency and taking load off the origin. Modern CDNs also accelerate dynamic content, terminate TLS near the user, and provide DDoS protection and WAF at the edge.

How long content is cached is controlled by HTTP headers such as `Cache-Control: max-age=86400`. Changing content requires a new file name (versioned assets like `app.3f9a.js`) or an **invalidation**.

**Anycast** announces the same IP address from many locations. BGP routes each user to the nearest one. DNS resolvers like 1.1.1.1 and 8.8.8.8, CDNs and global cloud load balancers all use anycast. If one site fails, its route is withdrawn and users flow to the next nearest.

> **In the cloud:** Amazon CloudFront, Azure Front Door, Google Cloud CDN with the global Application Load Balancer, and OCI's CDN partners. Google's global load balancer gives you one anycast IP for the whole world.

## Lesson 5: Choosing the right front door

Decision guide for a new application:

1. **Static website or global audience** → CDN in front, origin in object storage or behind a load balancer.
2. **HTTP API or website in one region** → regional L7 load balancer with a WAF.
3. **Global HTTP app needing failover between regions** → global L7 service (Azure Front Door, Google Cloud global Application Load Balancer, AWS CloudFront or Global Accelerator) or DNS-based failover.
4. **Non-HTTP TCP/UDP service, or needs static IPs or extreme throughput** → L4 load balancer.
5. **Inserting third-party firewalls inline** → AWS Gateway Load Balancer or Azure Gateway Load Balancer.

> **Tip:** Start simple. One regional L7 load balancer with a WAF covers most applications; add a CDN when users are far away or traffic is heavy.

## Lesson 6: Real-world scenario: the health check that took down the site

**Situation.** An e-commerce site with 12 web servers behind an L7 load balancer goes completely down for 4 minutes every time the database team performs a routine failover. The servers themselves never crash.

**Investigation.** The load balancer's health check calls `/health`, which the developers implemented to run a database query. During a 30-second database failover, every server's health check fails at the same time. After 3 failures, the load balancer marks all 12 servers unhealthy and returns 503 to every user. When the database returns, health checks need several successful checks before servers are marked healthy again.

**Fix.**

1. Split health endpoints: `/livez` (is the process up and able to serve?) for the load balancer, and `/readyz` with dependency checks for monitoring dashboards.
2. Make the application handle a brief database outage gracefully (retry with backoff, serve cached data where possible).
3. Tune thresholds so a short blip doesn't remove servers.

**Lessons learned.** Health checks decide where traffic goes; a check that depends on a shared component can remove every server at once. Keep load-balancer health checks focused on the instance itself.

## Key takeaways

- L4 balances connections by IP and port; L7 understands HTTP and routes by content.
- Health checks decide where traffic goes; tune them carefully.
- Reverse proxies terminate TLS, cache and hide backends.
- CDNs and anycast bring content and entry points close to users.

## Checkpoint

**Q1. You need /api to go to one service and /static to another. Which balancer type?**

A. L4
B. L7  ✓
C. DNS round-robin
D. Anycast

_Path-based routing needs HTTP awareness, which is L7._

**Q2. What makes one IP address reachable at the nearest of many locations?**

A. NAT
B. Anycast  ✓
C. Multicast
D. VLAN

_Anycast announces the same prefix from many sites; BGP delivers users to the closest._

**Q3. Your health check queries the database. The database restarts for 30 seconds. What can happen?**

A. Nothing
B. Every backend is marked unhealthy and the whole site goes down  ✓
C. Only one server is affected
D. The CDN takes over automatically

_Deep health checks can fail on all servers at once. Keep health checks focused on the app itself._

**Q4. Behind an L7 load balancer, where does the app find the real client IP?**

A. In the TCP source address
B. In the X-Forwarded-For header  ✓
C. In the TLS certificate
D. In the DNS record

_The proxy opens a new connection, so the original client IP is passed in X-Forwarded-For._

**Q5. Which header controls how long a CDN caches a file?**

A. Content-Type
B. Host
C. Cache-Control  ✓
D. Authorization

_Cache-Control (for example max-age) tells caches how long the content stays fresh._

**Q6. Why did every web server fail its health check at once during a database failover?**

A. The servers crashed
B. The health endpoint depended on the shared database  ✓
C. The load balancer was overloaded
D. DNS changed

_Shared dependencies in health checks cause correlated failures._

## Official reading

- [Cloudflare Learning: what is a CDN](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/)
- [Nginx load balancing guide](https://nginx.org/en/docs/http/load_balancing.html)
- [Cloudflare Learning: what is load balancing](https://www.cloudflare.com/learning/performance/what-is-load-balancing/)
