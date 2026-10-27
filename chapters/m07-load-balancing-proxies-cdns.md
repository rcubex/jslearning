# Module 07: Load Balancing, Proxies & CDNs

**Level:** 2 · **Lessons:** 5

## A real-world thread: Traffic spike after product launch

A product announcement causes a sudden increase in visits. Health-aware load balancing distributes requests, a CDN serves cacheable objects and reverse proxies enforce application-facing controls.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: L4 vs L7 load balancing

A **load balancer** spreads traffic across several servers so that no single server is overloaded and failed servers are taken out of rotation.

A **Layer 4** load balancer works with IP addresses, protocols and ports. It forwards whole TCP or UDP connections to a backend without looking inside them. It is extremely fast, works with any protocol (databases, game servers, MQTT) and can preserve the client's source IP.

A **Layer 7** load balancer understands HTTP. It terminates the client's connection, reads the request and makes decisions based on content: host name (`api.example.com` vs `www.example.com`), path (`/api` vs `/images`), headers, cookies or query strings. It can also redirect HTTP to HTTPS, rewrite headers, and attach a WAF.

Common distribution algorithms: **round robin** (each server in turn), **least connections** (the least busy server), **weighted** (bigger servers get more) and **hash-based** (the same client always reaches the same server).

- Choose L4 for non-HTTP protocols, extreme performance or static IPs
- Choose L7 for websites and APIs, path/host routing, and WAF integration

> **In the cloud:** AWS Network Load Balancer vs Application Load Balancer, Azure Load Balancer vs Application Gateway, Google Cloud passthrough Network Load Balancer vs Application Load Balancer, OCI Network Load Balancer vs Load Balancer.

**Build the mental model:** Choose L4 for non-HTTP protocols, extreme performance or static IPs. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Traffic spike after product launch:** Consider how “l4 vs l7 load balancing” affects the situation: A product announcement causes a sudden increase in visits. Health-aware load balancing distributes requests, a CDN serves cacheable objects and reverse proxies enforce application-facing controls. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For l4 vs l7 load balancing, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain l4 vs l7 load balancing to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: Health checks

A load balancer regularly sends **health checks** to each backend: a TCP connection attempt, or an HTTP request to a path such as `/healthz`. A backend that fails a set number of checks in a row (the **unhealthy threshold**) stops receiving traffic; after enough successful checks (the **healthy threshold**) it is added back.

Health checks are simple but cause many outages:

- A check that is too shallow (just "is the port open") keeps sending traffic to an app that is running but broken
- A check that is too deep (also tests the database) can mark *every* server unhealthy at once when the database blips, taking the whole site down
- A check blocked by a firewall makes all backends look dead, so the load balancer returns 502/503

```text
GET /healthz  →  200 OK in under 100 ms
- Confirms the process is running and can serve requests
- Does NOT fail just because an optional dependency is slow
```

> **Watch out:** In every cloud, the backend's security rules must allow traffic from the load balancer's health-check source (for example, Google Cloud's health checks come from 35.191.0.0/16 and 130.211.0.0/22).

**Build the mental model:** A check that is too shallow (just "is the port open") keeps sending traffic to an app that is running but broken. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Traffic spike after product launch:** Consider how “health checks” affects the situation: A product announcement causes a sudden increase in visits. Health-aware load balancing distributes requests, a CDN serves cacheable objects and reverse proxies enforce application-facing controls. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For health checks, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain health checks to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Sessions, TLS termination and reverse proxies

Some applications store user state on one server. **Sticky sessions** (session affinity) send a user's requests to the same backend, usually with a cookie. They help legacy apps but spread load unevenly; storing sessions in a shared cache (Redis) is better.

**TLS termination** means the load balancer or proxy decrypts HTTPS, so it can read and route the request. Traffic to the backend can then be plain HTTP (simple but unencrypted inside your network) or re-encrypted (**TLS re-encryption / end-to-end TLS**, recommended for sensitive data). **TLS passthrough** forwards encrypted traffic untouched, which requires an L4 balancer.

A **reverse proxy** sits in front of servers and handles TLS, compression, caching, rate limiting and request routing, while hiding the internal layout. Nginx, HAProxy and Envoy are the common open-source choices; cloud L7 load balancers are managed reverse proxies.

```text
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

**Build the mental model:** Some applications store user state on one server. **Sticky sessions** (session affinity) send a user's requests to the same backend, usually with a cookie. They help legacy apps but spread load unevenly; storing sessions. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Traffic spike after product launch:** Consider how “sessions, tls termination and reverse proxies” affects the situation: A product announcement causes a sudden increase in visits. Health-aware load balancing distributes requests, a CDN serves cacheable objects and reverse proxies enforce application-facing controls. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For sessions, tls termination and reverse proxies, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain sessions, tls termination and reverse proxies to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: CDNs and anycast

A **CDN** (content delivery network) caches content in hundreds of **edge locations** close to users. A user in Dubai downloading an image from a server in Ireland gets it from a nearby edge instead, cutting latency and taking load off the origin. Modern CDNs also accelerate dynamic content, terminate TLS near the user, and provide DDoS protection and WAF at the edge.

How long content is cached is controlled by HTTP headers such as `Cache-Control: max-age=86400`. Changing content requires a new file name (versioned assets like `app.3f9a.js`) or an **invalidation**.

**Anycast** announces the same IP address from many locations. BGP routes each user to the nearest one. DNS resolvers like 1.1.1.1 and 8.8.8.8, CDNs and global cloud load balancers all use anycast. If one site fails, its route is withdrawn and users flow to the next nearest.

> **In the cloud:** Amazon CloudFront, Azure Front Door, Google Cloud CDN with the global Application Load Balancer, and OCI's CDN partners. Google's global load balancer gives you one anycast IP for the whole world.

**Build the mental model:** A **CDN** (content delivery network) caches content in hundreds of **edge locations** close to users. A user in Dubai downloading an image from a server in Ireland gets it from a nearby edge instead, cutting latency and. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Traffic spike after product launch:** Consider how “cdns and anycast” affects the situation: A product announcement causes a sudden increase in visits. Health-aware load balancing distributes requests, a CDN serves cacheable objects and reverse proxies enforce application-facing controls. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For cdns and anycast, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain cdns and anycast to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: Choosing the right front door

Decision guide for a new application:

1. **Static website or global audience** → CDN in front, origin in object storage or behind a load balancer.
2. **HTTP API or website in one region** → regional L7 load balancer with a WAF.
3. **Global HTTP app needing failover between regions** → global L7 service (Azure Front Door, Google Cloud global Application Load Balancer, AWS CloudFront or Global Accelerator) or DNS-based failover.
4. **Non-HTTP TCP/UDP service, or needs static IPs or extreme throughput** → L4 load balancer.
5. **Inserting third-party firewalls inline** → AWS Gateway Load Balancer or Azure Gateway Load Balancer.

> **Tip:** Start simple. One regional L7 load balancer with a WAF covers most applications; add a CDN when users are far away or traffic is heavy.

**Build the mental model:** Static website or global audience → CDN in front, origin in object storage or behind a load balancer. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Traffic spike after product launch:** Consider how “choosing the right front door” affects the situation: A product announcement causes a sudden increase in visits. Health-aware load balancing distributes requests, a CDN serves cacheable objects and reverse proxies enforce application-facing controls. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For choosing the right front door, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain choosing the right front door to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
