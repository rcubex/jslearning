# Module 14: Advanced Routing & Overlays

**Level:** 2 · **Lessons:** 7 · **Questions:** 6

_Master the routing and tunnelling techniques used inside enterprise and cloud backbones._

## Lesson 1: OSPF in depth

**OSPF** (Open Shortest Path First) is the most widely used interior routing protocol. Each router floods **link-state advertisements (LSAs)** describing its links, so every router builds the same map (the link-state database) and runs Dijkstra's shortest-path algorithm on it.

Key ideas:

- **Cost**: each link has a cost, normally based on bandwidth. The path with the lowest total cost wins.
- **Areas**: large networks are split into areas connected to a backbone **area 0**. Routers at area borders (**ABRs**) summarise routes, limiting how far changes spread.
- **Neighbours**: routers form adjacencies with hello packets; on shared segments a **designated router (DR)** reduces flooding.
- **Fast convergence**: when a link fails, LSAs flood and routers recalculate within seconds (faster with tuned timers and BFD).

**Minimal OSPF configuration (Cisco-style)**

```
router ospf 1
 router-id 10.255.0.1
 network 10.10.0.0 0.0.255.255 area 0
 passive-interface default
 no passive-interface Gi0/1
```

> **In the cloud:** Clouds don't run OSPF with you; their edges speak BGP. A common on-premises design runs OSPF (or IS-IS) inside the campus and data centre, and BGP at the edge toward ISPs and clouds.

## Lesson 2: Route selection and administrative distance

A router can learn the same prefix from several sources. It chooses in this order:

1. **Longest prefix match**: the most specific route always wins, whatever its source.
2. For identical prefixes, **administrative distance (AD)**: how trustworthy the source is. Typical Cisco values: connected 0, static 1, eBGP 20, OSPF 110, IS-IS 115, RIP 120, iBGP 200. Lower wins.
3. Within one protocol, its own **metric** (OSPF cost, BGP attributes).

This explains many surprises. A static route to `10.20.0.0/16` beats the same prefix learned via OSPF; a more specific `/24` learned from BGP beats a static `/16`.

**Floating static routes** use a deliberately high AD (for example 250) as a backup: they are only installed if the dynamic route disappears.

**A floating static backup route**

```
ip route 10.20.0.0 255.255.0.0 192.0.2.1          ! primary via link A
ip route 10.20.0.0 255.255.0.0 198.51.100.1 250   ! used only if the primary disappears
```

> **In the cloud:** Cloud route tables have their own priority rules when prefixes tie, for example static routes over propagated ones, or Direct Connect over VPN. Read each provider's route-priority documentation when mixing static and BGP routes.

## Lesson 3: ECMP and load sharing

**Equal-cost multipath (ECMP)** installs several next hops for the same prefix when they have equal cost, and spreads traffic across them. Routers hash fields of each packet (usually the 5-tuple), so all packets of one flow follow the same path and stay in order, while different flows use different paths.

Consequences:

- One large flow (a single big file copy) still uses only one path; ECMP helps with many flows.
- Adding or removing a path can rehash flows onto different paths; stateful devices in the path may drop them unless they share state.
- In the cloud, ECMP over several VPN tunnels (for example, Transit Gateway with ECMP, or multiple HA VPN tunnels) increases total bandwidth beyond a single tunnel's limit.

> **Watch out:** Placing stateful firewalls on ECMP paths without symmetric hashing or state sharing causes "random" connection drops, because replies return through a different firewall than the request.

## Lesson 4: VRFs and network segmentation

A **VRF** (virtual routing and forwarding instance) gives a router several completely separate routing tables. Interfaces belong to one VRF, and traffic in one VRF can't reach another unless you explicitly **leak** routes between them. The same address range can even exist in two VRFs.

Uses:

- Separating tenants, environments (prod/dev) or security zones on shared hardware
- Carrier networks: **MPLS L3VPN** gives each customer its own VRF across the provider's backbone, with labels (rather than IP lookups) forwarding traffic through the core
- Management networks isolated from data traffic

The same idea appears throughout the cloud, under different names:

**VRF-style segmentation in the cloud**

```
AWS:   Transit Gateway route tables; Cloud WAN segments
Azure: Virtual WAN route tables and labels; separate hub VNets
GCP:   separate VPC networks connected through NCC with spoke filtering
OCI:   DRG route tables with import route distributions
```

> **Tip:** Design segmentation once ("prod, non-prod, shared, on-prem") and implement it as VRFs on-premises and as route-table segmentation in each cloud.

## Lesson 5: Overlays and tunnels

An **overlay** carries one network's packets inside another's, by adding an outer header. The underlying network (the **underlay**) only sees the outer addresses.

- **GRE** (IP protocol 47): a simple generic tunnel, often combined with IPsec for encryption, and used by some cloud services to carry BGP to virtual appliances.
- **IPsec**: encrypted tunnels for site-to-site VPNs (tunnel mode).
- **VXLAN** (UDP 4789): wraps Ethernet frames in UDP, with a 24-bit **VNI** allowing about 16 million segments instead of 4,094 VLANs. The standard data-centre overlay, typically with **EVPN** (BGP-based) as the control plane to share MAC and IP locations.
- **Geneve** (UDP 6081): a flexible successor with extensible metadata. **AWS Gateway Load Balancer** uses Geneve to send traffic to firewall appliances, and many cloud virtual networks use similar encapsulation internally.

Every overlay adds header bytes: GRE about 24, VXLAN about 50, IPsec around 50–70 depending on options. Without jumbo frames in the underlay or a reduced inner MTU, large packets fragment or drop.

> **Tip:** When you design any tunnel, write down the MTU budget: underlay MTU minus all added headers equals the maximum inner packet. Then set MSS clamping accordingly.

## Lesson 6: Policy-based routing and redistribution

Normal routing looks only at the destination. **Policy-based routing (PBR)** can choose a next hop based on source address, port or application; for example, sending guest Wi-Fi traffic out a cheaper Internet link. It's powerful but easy to forget, so document it carefully.

**Redistribution** copies routes from one protocol into another, such as static routes into OSPF, or OSPF into BGP at the edge. Done carelessly it causes routing loops, suboptimal paths and leaks of internal prefixes. Good practice:

- Filter with **route maps** or prefix lists: redistribute only what's needed
- **Tag** redistributed routes to stop them being redistributed back
- **Summarise** at boundaries
- Prefer one direction of redistribution where possible

**Redistribute only approved prefixes into BGP**

```
ip prefix-list ONPREM-SUMMARY seq 10 permit 10.100.0.0/14
route-map OSPF-TO-BGP permit 10
 match ip address prefix-list ONPREM-SUMMARY
router bgp 65010
 redistribute ospf 1 route-map OSPF-TO-BGP
```

> **Watch out:** Redistributing a full on-premises routing table into a cloud BGP session can exceed the provider's prefix limit and drop the session. Advertise filtered summaries only.

## Lesson 7: Real-world scenario: ECMP and the stateful firewalls

**Situation.** A data centre connects to a cloud hub through two firewall clusters for capacity, using ECMP on the routers on both sides. Some users report that SSH sessions and database connections drop randomly, while web browsing mostly works.

**Investigation.**

1. Flow logs and firewall logs show many connections where the SYN passed firewall A but the SYN-ACK arrived at firewall B, which had no state for the connection and dropped it.
2. The on-premises routers hashed traffic using the 5-tuple, but the cloud-side routers hashed on source and destination IP only, so the two directions of a connection could take different paths.
3. Web browsing "mostly worked" because browsers retry and open many short connections.

**Fix.** Options considered: synchronise state between the firewall clusters, make hashing symmetric on both sides, or steer each direction deterministically. The team configured symmetric hashing and, for the cloud side, used the provider's appliance-mode or flow-stickiness setting (for example, appliance mode on AWS Transit Gateway VPC attachments keeps both directions of a flow on the same appliance).

**Lessons learned.** ECMP and stateful devices need symmetric paths. Whenever you add a firewall to a multipath design, ask: will both directions of every flow reach the same firewall?

## Key takeaways

- OSPF builds a shared map inside an organisation; BGP connects organisations.
- Administrative distance and longest-prefix match decide which route wins.
- VRFs give separate routing tables on shared hardware, like cloud route-table segmentation.
- Overlays (GRE, VXLAN, Geneve) carry virtual networks across physical ones; mind the MTU.

## Checkpoint

**Q1. Which route wins: a static route to 10.20.0.0/16 or an OSPF route to 10.20.5.0/24, for traffic to 10.20.5.9?**

A. The static route, because its administrative distance is lower
B. The OSPF /24, because longest-prefix match comes first  ✓
C. Both are used equally
D. Neither; the packet is dropped

_Longest-prefix match is evaluated before administrative distance._

**Q2. Why does one large file transfer not get faster with four ECMP paths?**

A. ECMP only works for UDP
B. Each flow is hashed onto a single path to keep packets in order  ✓
C. ECMP requires jumbo frames
D. The paths must have different costs

_ECMP spreads flows, not individual packets, across paths._

**Q3. How many segments can a 24-bit VXLAN network identifier address?**

A. 4,094
B. 65,536
C. About 16 million  ✓
D. Unlimited

_2^24 ≈ 16.7 million segments, versus 4,094 VLANs._

**Q4. What do VRFs provide on a single router?**

A. Faster forwarding
B. Separate, isolated routing tables  ✓
C. Encryption
D. Wireless roaming

_Each VRF has its own routing table; traffic doesn't cross without route leaking._

**Q5. Which encapsulation does AWS Gateway Load Balancer use to send traffic to appliances?**

A. GRE
B. VXLAN
C. Geneve  ✓
D. MPLS

_Gateway Load Balancer uses Geneve on UDP 6081._

**Q6. Connections through two ECMP-balanced stateful firewalls drop randomly. What is the likely cause?**

A. MTU
B. DNS
C. Asymmetric paths: the reply reaches a firewall that never saw the request  ✓
D. An expired certificate

_Stateful firewalls need both directions of a flow; symmetric hashing or state sync fixes it._

## Official reading

- [Cloudflare Learning: what is MPLS](https://www.cloudflare.com/learning/network-layer/what-is-mpls/)
- [RFC 7348: VXLAN](https://www.rfc-editor.org/rfc/rfc7348)
- [RFC 8926: Geneve](https://www.rfc-editor.org/rfc/rfc8926)
- [AWS Gateway Load Balancer (Geneve)](https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html)
