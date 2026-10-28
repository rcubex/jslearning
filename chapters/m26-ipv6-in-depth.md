# Module 13: IPv6 in Depth

**Level:** 2 · **Lessons:** 6 · **Questions:** 6

_Plan, run and secure IPv6 and dual-stack networks in the cloud._

## Lesson 1: IPv6 address types

IPv6 replaces broadcast with **multicast** and gives every interface several addresses with different scopes:

- **Global unicast** (`2000::/3`): routable on the Internet, the equivalent of a public IPv4 address.
- **Link-local** (`fe80::/10`): automatically present on every IPv6 interface, valid only on that link. Routers and neighbour discovery use them.
- **Unique local addresses, ULA** (`fc00::/7`, used as `fd00::/8`): private addresses similar to RFC 1918, not routed on the Internet.
- **Multicast** (`ff00::/8`): one-to-many; for example `ff02::1` (all nodes on the link) and `ff02::2` (all routers).
- **Loopback** `::1` and the unspecified address `::`.

A typical global address is split into a **routing prefix** from the provider (for example a /48 for a site or a /56 for a VPC), a **subnet ID**, and a 64-bit **interface identifier**:

**Reading an IPv6 address**

```
2001:db8:4f2a:0010:0000:0000:0000:0025/64
└── /48 site ──┘└sub┘└─── interface ID ───┘
compressed: 2001:db8:4f2a:10::25/64
```

> **Tip:** Every IPv6 subnet should be a /64. Smaller subnets break SLAAC and other features; there is no shortage to save.

## Lesson 2: SLAAC, NDP and DHCPv6

IPv6 hosts configure themselves using **Neighbor Discovery Protocol (NDP)**, which runs over ICMPv6 and replaces ARP:

- **Router Solicitation / Router Advertisement (RS/RA)**: hosts ask for, and routers announce, the prefix, default gateway and flags.
- **Neighbor Solicitation / Neighbor Advertisement (NS/NA)**: the IPv6 version of ARP, mapping addresses to MAC addresses, plus **duplicate address detection**.

Using the information in RAs, a host can build its own address with **SLAAC** (stateless address autoconfiguration). Flags in the RA can instead point hosts to **DHCPv6** for addresses (stateful) or just for extra options such as DNS servers (stateless DHCPv6). DNS servers can also be announced directly in RAs (RDNSS).

Clients often generate **temporary privacy addresses** that change over time, so their outgoing connections can't easily be tracked.

**Look at IPv6 on Linux**

```
ip -6 addr                 # global, link-local and temporary addresses
ip -6 route                # default route via a link-local fe80:: gateway
ip -6 neigh                # the NDP neighbour table (like ARP)
ping -6 2606:4700:4700::1111
```

> **In the cloud:** Cloud networks handle RA and DHCPv6 for you, usually assigning addresses through their own DHCPv6 service. You just enable IPv6 on the network, subnet and interface.

## Lesson 3: ICMPv6 and IPv6 security

ICMPv6 is not optional in IPv6. Blocking it breaks the network:

- **NDP** (neighbour and router discovery) uses ICMPv6 types 133–137.
- **Packet Too Big** (type 2) is how path MTU discovery works; IPv6 routers never fragment, so blocking it creates black holes.
- Echo request and reply (128/129) are useful for diagnostics.

Security considerations specific to IPv6:

- **Rules for both stacks**: an IPv4 rule doesn't cover IPv6. Every "deny 0.0.0.0/0" needs a matching "::/0" policy.
- **No NAT by default**: instances with global IPv6 addresses are reachable from the Internet unless a firewall stops it. Use security groups and **egress-only gateways** for outbound-only access.
- **Rogue RAs**: on networks you control, RA Guard prevents unauthorised routers from advertising themselves.
- **Extension headers**: can be abused to evade filters; modern firewalls inspect or limit them.

> **Watch out:** Teams often enable IPv6 on a load balancer and forget their WAF or firewall rules only cover IPv4. Test both protocols.

## Lesson 4: IPv6 in the four clouds

All four providers support **dual-stack** networking, and support for **IPv6-only** keeps growing:

- **AWS**: a VPC gets an Amazon-provided /56 (or your own via BYOIP or IPAM); subnets get /64s. Instances can be dual-stack or **IPv6-only**. **Egress-only Internet gateways** allow outbound-only IPv6. **DNS64** on Route 53 Resolver plus **NAT64** on NAT gateways let IPv6-only workloads reach IPv4 services. ALB, NLB and CloudFront support dual-stack.
- **Azure**: dual-stack VNets and subnets with /64 IPv6 ranges; IPv6 on VMs, Standard Load Balancer and public IPs. Check service support, as not every PaaS service is IPv6-ready.
- **Google Cloud**: dual-stack subnets and **IPv6-only subnets**, with **internal IPv6** (ULA from the VPC's /48) or **external IPv6** (globally routable) ranges; global load balancers accept IPv6 clients.
- **OCI**: VCNs support IPv6 /56 prefixes (Oracle-allocated or your own) with /64 subnets; dual-stack instances, load balancers and gateways.

> **Tip:** A practical rollout order: make public entry points (load balancers, CDN) dual-stack first, since that's where users arrive; move internal networks later.

## Lesson 5: Transition mechanisms

The Internet will run IPv4 and IPv6 side by side for years. Common transition tools:

- **Dual-stack**: hosts and networks run both. Simple and the most common, but you still need IPv4 addresses.
- **NAT64 + DNS64**: IPv6-only clients reach IPv4-only servers. DNS64 synthesises AAAA records from A records using the prefix `64:ff9b::/96`, and NAT64 translates the traffic. Cloud NAT64 options exist on AWS (NAT gateway) and Google Cloud (Cloud NAT with DNS64).
- **464XLAT**: lets IPv4-only apps work on IPv6-only mobile networks (used by many mobile carriers).
- **Tunnels** (6in4, 6rd, and IPv6 over IPsec): carry IPv6 across IPv4-only networks.

Why go IPv6-only in parts of the cloud? Public IPv4 addresses now cost money on every major cloud, large Kubernetes clusters can exhaust private IPv4 space, and IPv6-only subnets remove that pressure.

**How DNS64 synthesises an address**

```
Query:  AAAA api.legacy.example  → none exists, A = 198.51.100.7
DNS64:  returns AAAA 64:ff9b::c633:6407  (198.51.100.7 embedded in the last 32 bits)
NAT64:  translates traffic to 64:ff9b::/96 into IPv4 toward 198.51.100.7
```

> **Tip:** Start IPv6-only with new, containerised workloads that talk mostly to modern services, and keep dual-stack for everything that faces users.

## Lesson 6: Real-world scenario: dual-stack load balancer, IPv4-only firewall

**Situation.** A company enables IPv6 on its public load balancer to support mobile carriers that are moving to IPv6. A week later, the security team notices that the WAF dashboards show less traffic than the load balancer, and a penetration test reaches an admin page that should be blocked.

**Investigation.** The WAF and access rules were written with IPv4 sources only (allow-lists of office IPs for `/admin`, deny lists of known bad IPv4 ranges). IPv6 clients matched none of the IPv4 rules. The "allow office only" rule didn't block IPv6, because the default for unmatched traffic on that path was allow.

**Fix.**

1. Rewrite rules to cover both families: office IPv6 prefixes added to the admin allow-list, and the default action for `/admin` changed to deny.
2. Review every firewall, security group and WAF rule for missing `::/0` or IPv6 equivalents.
3. Add IPv6 cases to automated security tests.

**Lessons learned.** Enabling IPv6 creates a second, parallel path into your systems. Every control (security groups, NACLs, WAF, rate limits, logging) must be checked for IPv6 before you turn it on.

## Key takeaways

- IPv6 has no broadcast; it uses link-local addresses, multicast and NDP instead of ARP.
- Hosts configure themselves with SLAAC or DHCPv6, driven by router advertisements.
- All four clouds support dual-stack; several support IPv6-only subnets with NAT64/DNS64.
- Security rules must cover IPv6 explicitly, and essential ICMPv6 must stay allowed.

## Checkpoint

**Q1. Which IPv6 range is link-local?**

A. 2000::/3
B. fd00::/8
C. fe80::/10  ✓
D. ff00::/8

_fe80::/10 addresses exist on every interface and stay on the local link._

**Q2. What replaces ARP in IPv6?**

A. DHCPv6
B. Neighbor Discovery (NS/NA messages)  ✓
C. Multicast DNS
D. SLAAC

_NDP neighbour solicitation and advertisement map IPv6 addresses to link-layer addresses._

**Q3. Why must ICMPv6 "Packet Too Big" never be blocked?**

A. It carries DNS
B. IPv6 routers don't fragment, so path MTU discovery depends on it  ✓
C. It is needed for SLAAC
D. It is required by TLS

_Without Packet Too Big messages, large packets silently disappear._

**Q4. An IPv6-only workload needs to call an IPv4-only API. Which combination helps?**

A. SLAAC and DHCPv6
B. DNS64 and NAT64  ✓
C. ULA and link-local
D. Egress-only gateway alone

_DNS64 creates synthetic AAAA records and NAT64 translates the traffic to IPv4._

**Q5. An AWS instance has a global IPv6 address. How do you allow outbound IPv6 but block inbound connections?**

A. Use a NAT gateway
B. Route ::/0 to an egress-only Internet gateway  ✓
C. Remove the IPv6 address
D. Use an IPv4 security group rule

_Egress-only Internet gateways allow outbound IPv6 and block unsolicited inbound traffic._

**Q6. After enabling IPv6 on a load balancer, an admin page that should be blocked is reachable. Why?**

A. IPv6 bypasses TLS
B. The access rules only covered IPv4 sources and the default for unmatched traffic was allow  ✓
C. The certificate didn't include IPv6
D. IPv6 is always unfiltered

_IPv6 clients didn't match IPv4-only rules; controls must cover both families with a deny default._

## Official reading

- [RFC 8200: IPv6 specification](https://www.rfc-editor.org/rfc/rfc8200)
- [AWS: IPv6 on AWS](https://docs.aws.amazon.com/whitepapers/latest/ipv6-on-aws/IPv6-on-AWS.html)
- [Azure: IPv6 for Azure Virtual Network](https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/ipv6-overview)
- [Google Cloud: IPv6 support](https://cloud.google.com/vpc/docs/subnets#ipv6-ranges)
