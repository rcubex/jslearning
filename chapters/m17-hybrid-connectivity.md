# Module 17: Hybrid Connectivity

**Level:** 5 · **Lessons:** 6

## A real-world thread: Bank connecting a data centre to cloud

A banking service must access on-premises systems from the cloud. The design combines private circuits or VPN, encrypted traffic, BGP routing and failover assumptions.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: Private links in all four clouds

Each provider sells a dedicated private connection from your network to theirs:

- **AWS Direct Connect**: dedicated 1/10/100/400 Gbps ports or hosted connections via partners; virtual interfaces (private, transit, public); Direct Connect gateway for multi-region reach.
- **Azure ExpressRoute**: circuits through a connectivity provider or ExpressRoute Direct (10/100 Gbps); private peering and Microsoft peering; Global Reach between your sites.
- **Google Cloud Interconnect**: Dedicated (10/100 Gbps), Partner (50 Mbps–50 Gbps) and Cross-Cloud Interconnect; VLAN attachments to Cloud Router.
- **OCI FastConnect**: partner, colocation (1/10/100/400 Gbps cross-connects) or third-party; private and public peering via the DRG.

They all follow the same pattern: a **physical connection** at a colocation facility or through a carrier, a **logical circuit** (VLAN, virtual interface, VLAN attachment, virtual circuit) on top, and an **eBGP session** over that circuit to exchange routes.

Why use them instead of VPN over the Internet? Predictable latency and throughput, higher bandwidth, lower data-transfer prices on some providers, and traffic that never touches the public Internet.

> **Tip:** Many enterprises meet all their clouds in one or two carrier-neutral colocation facilities (Equinix, Digital Realty and similar), with short cross-connects to each provider. That colocation becomes the network's centre.

**Build the mental model:** AWS Direct Connect: dedicated 1/10/100/400 Gbps ports or hosted connections via partners; virtual interfaces (private, transit, public); Direct Connect gateway for multi-region reach. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Bank connecting a data centre to cloud:** Consider how “private links in all four clouds” affects the situation: A banking service must access on-premises systems from the cloud. The design combines private circuits or VPN, encrypted traffic, BGP routing and failover assumptions. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For private links in all four clouds, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain private links in all four clouds to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: VPN as primary or backup

**Site-to-site IPsec VPN** over the Internet is quick to set up (minutes, not weeks), cheap, and available everywhere. Its limits are variable latency, lower throughput per tunnel (for example, about 1.25 Gbps per AWS tunnel), and dependence on Internet quality.

Common patterns:

- **VPN only**: small sites, labs, or while waiting for a private link.
- **Private link primary, VPN backup**: the most common enterprise design. BGP prefers the private link; if it fails, routes fail over to the VPN automatically.
- **VPN over the private link**: encrypts traffic across Direct Connect, ExpressRoute, Interconnect or FastConnect when compliance requires encryption.
- **SD-WAN**: branch routers build overlay tunnels to cloud hubs (AWS Cloud WAN, Azure Virtual WAN, Google NCC router appliances and OCI all integrate with SD-WAN vendors).

> **Watch out:** When VPN backs up a private link, make sure the VPN can actually carry the load. A 10 Gbps link failing over to a 1 Gbps VPN still causes an outage for heavy workloads.

**Build the mental model:** VPN only: small sites, labs, or while waiting for a private link. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Bank connecting a data centre to cloud:** Consider how “vpn as primary or backup” affects the situation: A banking service must access on-premises systems from the cloud. The design combines private circuits or VPN, encrypted traffic, BGP routing and failover assumptions. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For vpn as primary or backup, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain vpn as primary or backup to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Designing for resilience

A single connection will fail eventually: fibre cuts, device failures, provider maintenance. Design so that any one component can fail without an outage.

The resilience ladder, from weakest to strongest:

1. One connection, one device, one location: **no redundancy**.
2. Two connections at **one location**, on two devices: survives a device or port failure, not a site failure.
3. Connections at **two locations**, one device each: survives a site failure.
4. **Two locations, two devices and two connections at each**: the maximum resiliency model AWS, Azure, Google Cloud and Oracle all describe for critical workloads.

Also remove shared dependencies: different carriers, different building entrances, separate power. And make failover fast: use **BFD** (Bidirectional Forwarding Detection) where supported so BGP notices a dead link in about a second instead of 90 seconds.

```text
[ ] At least two physical connections, at two locations
[ ] Separate customer routers for each connection
[ ] BGP on every link; BFD enabled where supported
[ ] Failover tested by shutting each link in a maintenance window
[ ] Monitoring and alerts on BGP session state and link utilisation
```

> **Tip:** Test failover regularly. An untested backup link is often a broken backup link.

**Build the mental model:** One connection, one device, one location: no redundancy. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Bank connecting a data centre to cloud:** Consider how “designing for resilience” affects the situation: A banking service must access on-premises systems from the cloud. The design combines private circuits or VPN, encrypted traffic, BGP routing and failover assumptions. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For designing for resilience, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain designing for resilience to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: Steering traffic with BGP

With two or more links you decide which one carries traffic in each direction.

**Traffic from you to the cloud (outbound)**: set **local preference** on the routes you learn from the cloud. Higher wins. For example, local-pref 200 on the primary link and 100 on the backup.

**Traffic from the cloud to you (inbound)**: influence the cloud's choice with **AS-path prepending** (make the backup path look longer), **MED**, or by advertising **more specific prefixes** on the primary link. Each provider documents its own preference order, so check it:

- AWS prefers the longest prefix, then Direct Connect over VPN, then honours AS-path length and local preference communities on Direct Connect.
- Azure ExpressRoute prefers the longest prefix and then the shortest AS path; connection **weight** can set preference.
- Google Cloud Router uses **advertised route priority (MED)** that you set per BGP session.
- OCI uses the longest prefix match first and lets you influence the choice with AS-path prepending; check OCI's route-preference rules for FastConnect versus VPN.

**Equal-cost multipath (ECMP)** lets you use several links at once for more bandwidth when paths look identical.

```text
! Prefer link A for outbound
route-map FROM-CLOUD-A permit 10
 set local-preference 200
! Make link B less attractive for inbound
route-map TO-CLOUD-B permit 10
 set as-path prepend 65010 65010 65010
```

> **Watch out:** Asymmetric routing (out via link A, back via link B) breaks stateful firewalls in the path. Steer both directions consistently.

**Build the mental model:** AWS prefers the longest prefix, then Direct Connect over VPN, then honours AS-path length and local preference communities on Direct Connect. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Bank connecting a data centre to cloud:** Consider how “steering traffic with bgp” affects the situation: A banking service must access on-premises systems from the cloud. The design combines private circuits or VPN, encrypted traffic, BGP routing and failover assumptions. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For steering traffic with bgp, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain steering traffic with bgp to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: Encryption, MTU and route limits

Three details cause many hybrid problems.

**Encryption.** Private links are private, not encrypted. Options: **MACsec** (Layer 2 encryption on supported dedicated ports: AWS Direct Connect, ExpressRoute Direct, Google Dedicated/Cross-Cloud Interconnect, OCI FastConnect cross-connects), **IPsec over the private link**, or application-level TLS everywhere.

**MTU.** Private links typically support 1,500 bytes and some support jumbo frames (AWS Direct Connect private VIFs up to 9,001; Google Interconnect up to 8,896). VPN tunnels need a smaller MTU, often around 1,400 bytes once IPsec headers are added. Mismatches cause large transfers to hang; use MSS clamping on the tunnel interfaces.

**Route limits.** Every provider limits the number of prefixes you can advertise per session (for example, 100 on an AWS private VIF; 4,000 on ExpressRoute private peering with Standard, 10,000 with Premium). Exceeding the limit drops the BGP session. Advertise **summaries** such as `10.100.0.0/14` rather than every subnet.

> **Tip:** Before go-live, agree in writing on the prefixes each side advertises and the filters each side applies. Most hybrid incidents come from unexpected route advertisements.

**Build the mental model:** Three details cause many hybrid problems. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Bank connecting a data centre to cloud:** Consider how “encryption, mtu and route limits” affects the situation: A banking service must access on-premises systems from the cloud. The design combines private circuits or VPN, encrypted traffic, BGP routing and failover assumptions. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For encryption, mtu and route limits, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain encryption, mtu and route limits to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: A complete hybrid design

Putting the pieces together for an organisation with a Dubai data centre and workloads in two clouds:

1. **Colocation**: rent space in a carrier-neutral facility near the cloud regions. Place two routers there.
2. **Cloud links**: from each router, a private link to AWS (Direct Connect via a Direct Connect gateway to Transit Gateway) and to Azure (ExpressRoute to a hub VNet or Virtual WAN). Use a second colocation site for the second pair of links.
3. **Data centre link**: two diverse circuits from the data centre to the colocation routers.
4. **Backup**: Site-to-Site VPN from the data centre directly to each cloud, with BGP, lower preference.
5. **Routing**: on-premises advertises `10.100.0.0/14`; each cloud advertises its summary (for example AWS `10.64.0.0/12`, Azure `10.80.0.0/12`). No overlaps.
6. **DNS**: conditional forwarding between on-premises DNS and each cloud's resolver endpoints.
7. **Security**: inspection firewalls in the cloud hubs; MACsec on dedicated ports or IPsec where policy requires.
8. **Operations**: monitor BGP sessions, utilisation and latency; test failover every quarter.

> **In the cloud:** The colocation routers can also route between the two clouds, so AWS and Azure traffic stays on private links instead of crossing the Internet.

**Build the mental model:** Colocation: rent space in a carrier-neutral facility near the cloud regions. Place two routers there. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Bank connecting a data centre to cloud:** Consider how “a complete hybrid design” affects the situation: A banking service must access on-premises systems from the cloud. The design combines private circuits or VPN, encrypted traffic, BGP routing and failover assumptions. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For a complete hybrid design, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain a complete hybrid design to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
