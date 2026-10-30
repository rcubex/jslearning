# Module 11: DNS in Depth

**Level:** 2 · **Lessons:** 7 · **Questions:** 6

_Design, secure and troubleshoot DNS for hybrid and cloud networks._

## Lesson 1: Zones and delegation

DNS is a distributed tree. The root (`.`) delegates `com.`, which delegates `example.com.`, which can delegate `eu.example.com.` to someone else. Each delegated piece is a **zone**, served by its own **authoritative name servers**.

Delegation is done with **NS records** in the parent zone: the `.com` servers hold NS records saying which servers are authoritative for `example.com`. When those name servers live inside the zone they serve (such as `ns1.example.com`), the parent also stores their IP addresses as **glue records** to avoid a chicken-and-egg problem.

Every zone starts with an **SOA** (start of authority) record holding the primary server, the admin contact, a **serial number** (increment it on every change when using zone transfers), refresh timers, and the **negative-caching TTL**.

**A small zone file**

```
$TTL 3600
@     IN SOA  ns1.example.com. hostmaster.example.com. ( 2026102701 7200 900 1209600 300 )
@     IN NS   ns1.example.com.
@     IN NS   ns2.example.com.
@     IN A    203.0.113.10
www   IN CNAME example.com.
api   IN A    203.0.113.20
@     IN MX 10 mail.example.com.
@     IN TXT  "v=spf1 include:_spf.example.net -all"
```

> **In the cloud:** When you create a public hosted zone in Route 53, Azure DNS, Cloud DNS or OCI DNS, the provider gives you a set of name servers. You must update the NS records at your domain registrar (the delegation) before the zone is live on the Internet.

## Lesson 2: Resolution and caching in detail

A **stub resolver** (your laptop) sends one **recursive** query to a **recursive resolver**. The resolver does the work, making **iterative** queries to root, TLD and authoritative servers, then caches every answer for its **TTL**.

Things that catch people out:

- **Negative caching**: an NXDOMAIN ("name does not exist") is also cached, for the time set in the SOA. Look up a record *before* you create it and some resolvers will keep saying it doesn't exist for a while.
- **TTL strategy**: long TTLs (hours) reduce load and latency; short TTLs (60–300 s) make changes and failovers fast. Lower TTLs a day before a planned change.
- **Clients and applications cache too**: browsers, operating systems and some runtimes (for example the JVM) keep their own caches, sometimes ignoring TTLs.
- **UDP and TCP**: most queries use UDP 53; large responses (DNSSEC, many records) need **EDNS** larger UDP sizes or fall back to TCP 53. Firewalls must allow both.

Queries can be encrypted between client and resolver with **DNS over TLS (DoT, TCP 853)** or **DNS over HTTPS (DoH, 443)**. This protects privacy but can bypass company DNS controls, so many organisations manage which resolvers devices use.

> **Tip:** "DNS propagation" is really just caches expiring. Nothing is pushed; resolvers fetch new data when their cached copy's TTL runs out.

## Lesson 3: DNSSEC

Plain DNS answers can be forged, for example by cache poisoning. **DNSSEC** adds digital signatures so resolvers can prove an answer is genuine and unmodified.

How the chain of trust works:

1. Each signed zone publishes its public keys in **DNSKEY** records and signs every record set, producing **RRSIG** records.
2. The parent zone holds a **DS** (delegation signer) record, a hash of the child's key-signing key. The parent signs the DS, linking parent to child.
3. Validating resolvers start from the root's trusted key and follow DS → DNSKEY → RRSIG down to the answer. Any mismatch returns **SERVFAIL**.
4. **NSEC/NSEC3** records prove that a name does not exist.

DNSSEC protects integrity, not privacy (that's DoH/DoT). Its main operational risk is key management: a broken DS at the parent or an expired signature makes the whole domain fail to resolve for validating resolvers.

The major cloud DNS services support DNSSEC signing for public zones; you then add the DS record at your registrar. Check your provider's documentation for the exact steps and supported algorithms.

> **Watch out:** When moving a DNSSEC-signed domain between providers, follow a careful key rollover or temporarily disable DNSSEC by removing the DS record first, and wait for the TTL. Otherwise validating resolvers will reject the domain.

## Lesson 4: Split-horizon and private DNS design

**Split-horizon DNS** returns different answers depending on who asks. For example, `app.example.com` resolves to a public load balancer for Internet users and to a private IP for internal users.

In the cloud you build this with **private zones** linked to your networks:

- **AWS**: Route 53 private hosted zones associated with VPCs (including VPCs in other accounts).
- **Azure**: Private DNS zones with virtual network links (optionally with autoregistration of VM names).
- **Google Cloud**: Cloud DNS private zones visible to chosen VPC networks; peering zones to share resolution between VPCs.
- **OCI**: private zones attached to private views used by each VCN's resolver.

For hybrid environments, design DNS like routing:

**A hybrid DNS design**

```
On-prem DNS  --forward cloud.example.com, privatelink zones-->  cloud inbound resolver endpoint
Cloud outbound resolver endpoint  --forward corp.example.com-->  on-prem DNS servers
Each environment authoritative only for its own zones
```

> **Tip:** Avoid using the same zone name both publicly and privately unless you really need split-horizon. It is a common source of "works inside, broken outside" confusion.

## Lesson 5: DNS for traffic management and failover

DNS is often used to steer users: weighted answers for canary releases, latency-based answers for nearest region, geolocation answers for compliance, and failover answers driven by health checks. **Route 53**, **Azure Traffic Manager**, **Cloud DNS routing policies** and **OCI DNS traffic management steering policies** all do this.

DNS-based failover has limits you must design around:

- Failover speed depends on health check interval plus TTL plus client caching; expect tens of seconds to minutes.
- Some clients cache answers far longer than the TTL.
- DNS answers the resolver, not the user; with public resolvers, "nearest" is approximated (EDNS Client Subnet helps when supported).

For faster, connection-level failover, anycast global load balancers (Google Cloud global load balancing, Azure Front Door, AWS Global Accelerator) are usually better.

> **Tip:** Use DNS failover for disaster recovery between regions, and load balancers for high availability within a region.

## Lesson 6: Troubleshooting DNS

Learn to read DNS responses precisely:

- **NOERROR with answers**: success.
- **NOERROR with no answers (NODATA)**: the name exists but not with that record type.
- **NXDOMAIN**: the name does not exist (check typos and which zone you're querying).
- **SERVFAIL**: the resolver couldn't get a valid answer: broken delegation, unreachable authoritative servers, or DNSSEC validation failure.
- **REFUSED**: the server won't answer you (not authoritative, or recursion not allowed for your IP).

**dig patterns for troubleshooting**

```
dig api.example.com                    # normal lookup via your resolver
dig @ns1.example.com api.example.com   # ask the authoritative server directly
dig +trace api.example.com             # follow the delegation chain
dig +dnssec api.example.com            # show RRSIG records
dig +cd api.example.com                # disable DNSSEC checking: if this works but normal fails, DNSSEC is broken
dig api.example.com +short @10.0.0.2   # ask the cloud VPC resolver
```

> **Tip:** Always compare three answers: the authoritative server, your resolver, and the client. If the authoritative answer is right and the client is wrong, it's caching or forwarding, not the zone.

## Lesson 7: Real-world scenario: Private Endpoint names resolving to public IPs

**Situation.** A company enables Private Endpoints for its Azure storage accounts and disables public access. Apps in Azure work, but on-premises servers start failing with "403 / public access is disabled" errors.

**Investigation.**

1. From an on-premises server, `nslookup mystorage.blob.core.windows.net` returns a **public** IP.
2. From an Azure VM, the same lookup returns `10.20.5.10`, because the VNet is linked to the `privatelink.blob.core.windows.net` Private DNS zone.
3. On-premises DNS forwards everything to the Internet, so it follows the public CNAME chain and never sees the private zone.

**Fix.**

1. Deploy **Azure DNS Private Resolver** with an inbound endpoint in the hub VNet (reachable over ExpressRoute).
2. On on-premises DNS servers, add **conditional forwarders** for `blob.core.windows.net` (and the other service zones in use) to the inbound endpoint IP.
3. Verify from on-premises: the name now returns `10.20.5.10`, and traffic flows over ExpressRoute.

The same pattern applies to AWS interface endpoints (Route 53 Resolver inbound endpoints), Google Private Service Connect (Cloud DNS inbound server policies) and OCI private endpoints (resolver listening endpoints).

**Lessons learned.** Private endpoints are half networking and half DNS. Every network that must use them needs its DNS to resolve the private address.

## Key takeaways

- DNS is a tree of delegated zones; NS and DS records link parent to child.
- Caching (including negative caching) decides how fast changes take effect.
- DNSSEC proves answers are genuine; DoH/DoT protect queries in transit.
- Hybrid and cloud DNS is built from private zones, inbound/outbound resolvers and forwarding rules.

## Checkpoint

**Q1. What links a parent zone to a child zone's DNSSEC keys?**

A. An MX record
B. A CNAME record
C. A DS record  ✓
D. A TXT record

_The DS record in the parent holds a hash of the child's key-signing key._

**Q2. You queried a name before creating it, and now it still returns NXDOMAIN for some users. Why?**

A. DNSSEC is broken
B. Negative caching: resolvers cached the "does not exist" answer  ✓
C. The TTL is too short
D. The zone has no SOA

_NXDOMAIN answers are cached for the SOA's negative-caching TTL._

**Q3. A lookup fails with SERVFAIL, but succeeds with dig +cd. What is the likely cause?**

A. The record doesn't exist
B. The firewall blocks UDP 53
C. DNSSEC validation is failing  ✓
D. The client cache is stale

_+cd disables validation; success then points to a DNSSEC problem._

**Q4. Which ports must firewalls allow for DNS to work reliably?**

A. UDP 53 only
B. UDP 53 and TCP 53  ✓
C. TCP 443 only
D. UDP 123

_Large responses fall back to TCP 53, so both are needed._

**Q5. Why is DNS failover slower than load-balancer failover?**

A. DNS servers are slow
B. It depends on health-check intervals, TTLs and client caching  ✓
C. DNS uses TCP
D. Load balancers don't use health checks

_Clients keep using cached answers until they expire, and some cache longer._

**Q6. On-premises servers resolve an Azure storage account to its public IP after Private Endpoints were enabled. What fixes it?**

A. A bigger ExpressRoute circuit
B. Conditional forwarding of the service zone to an Azure DNS Private Resolver inbound endpoint  ✓
C. Re-enabling public access
D. A NAT gateway

_On-premises DNS must reach the Private DNS zone through a resolver inbound endpoint._

## Official reading

- [Cloudflare Learning: DNS records](https://www.cloudflare.com/learning/dns/dns-records/)
- [Cloudflare Learning: how DNSSEC works](https://www.cloudflare.com/learning/dns/dnssec/how-dnssec-works/)
- [Amazon Route 53 Resolver](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver.html)
- [Azure DNS Private Resolver](https://learn.microsoft.com/en-us/azure/dns/dns-private-resolver-overview)
