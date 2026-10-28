# Module 25: Hybrid Connectivity

**Level:** 5 · **Lessons:** 7 · **Questions:** 6

_Connect data centres to cloud with resilient, BGP-steered links._

## Lesson 1: Private links in all four clouds

Each provider sells a dedicated private connection from your network to theirs:

- **AWS Direct Connect**: dedicated 1/10/100/400 Gbps ports or hosted connections via partners; virtual interfaces (private, transit, public); Direct Connect gateway for multi-region reach.
- **Azure ExpressRoute**: circuits through a connectivity provider or ExpressRoute Direct (10/100 Gbps); private peering and Microsoft peering; Global Reach between your sites.
- **Google Cloud Interconnect**: Dedicated (10/100 Gbps), Partner (50 Mbps–50 Gbps) and Cross-Cloud Interconnect; VLAN attachments to Cloud Router.
- **OCI FastConnect**: partner, colocation (1/10/100/400 Gbps cross-connects) or third-party; private and public peering via the DRG.

They all follow the same pattern: a **physical connection** at a colocation facility or through a carrier, a **logical circuit** (VLAN, virtual interface, VLAN attachment, virtual circuit) on top, and an **eBGP session** over that circuit to exchange routes.

Why use them instead of VPN over the Internet? Predictable latency and throughput, higher bandwidth, lower data-transfer prices on some providers, and traffic that never touches the public Internet.

> **Tip:** Many enterprises meet all their clouds in one or two carrier-neutral colocation facilities (Equinix, Digital Realty and similar), with short cross-connects to each provider. That colocation becomes the network's centre.

## Lesson 2: VPN as primary or backup

**Site-to-site IPsec VPN** over the Internet is quick to set up (minutes, not weeks), cheap, and available everywhere. Its limits are variable latency, lower throughput per tunnel (for example, about 1.25 Gbps per AWS tunnel), and dependence on Internet quality.

Common patterns:

- **VPN only**: small sites, labs, or while waiting for a private link.
- **Private link primary, VPN backup**: the most common enterprise design. BGP prefers the private link; if it fails, routes fail over to the VPN automatically.
- **VPN over the private link**: encrypts traffic across Direct Connect, ExpressRoute, Interconnect or FastConnect when compliance requires encryption.
- **SD-WAN**: branch routers build overlay tunnels to cloud hubs (AWS Cloud WAN, Azure Virtual WAN, Google NCC router appliances and OCI all integrate with SD-WAN vendors).

> **Watch out:** When VPN backs up a private link, make sure the VPN can actually carry the load. A 10 Gbps link failing over to a 1 Gbps VPN still causes an outage for heavy workloads.

## Lesson 3: Designing for resilience

A single connection will fail eventually: fibre cuts, device failures, provider maintenance. Design so that any one component can fail without an outage.

The resilience ladder, from weakest to strongest:

1. One connection, one device, one location: **no redundancy**.
2. Two connections at **one location**, on two devices: survives a device or port failure, not a site failure.
3. Connections at **two locations**, one device each: survives a site failure.
4. **Two locations, two devices and two connections at each**: the maximum resiliency model AWS, Azure, Google Cloud and Oracle all describe for critical workloads.

Also remove shared dependencies: different carriers, different building entrances, separate power. And make failover fast: use **BFD** (Bidirectional Forwarding Detection) where supported so BGP notices a dead link in about a second instead of 90 seconds.

**Checklist for a production hybrid design**

```
[ ] At least two physical connections, at two locations
[ ] Separate customer routers for each connection
[ ] BGP on every link; BFD enabled where supported
[ ] Failover tested by shutting each link in a maintenance window
[ ] Monitoring and alerts on BGP session state and link utilisation
```

> **Tip:** Test failover regularly. An untested backup link is often a broken backup link.

## Lesson 4: Steering traffic with BGP

With two or more links you decide which one carries traffic in each direction.

**Traffic from you to the cloud (outbound)**: set **local preference** on the routes you learn from the cloud. Higher wins. For example, local-pref 200 on the primary link and 100 on the backup.

**Traffic from the cloud to you (inbound)**: influence the cloud's choice with **AS-path prepending** (make the backup path look longer), **MED**, or by advertising **more specific prefixes** on the primary link. Each provider documents its own preference order, so check it:

- AWS prefers the longest prefix, then Direct Connect over VPN, then honours AS-path length and local preference communities on Direct Connect.
- Azure ExpressRoute prefers the longest prefix and then the shortest AS path; connection **weight** can set preference.
- Google Cloud Router uses **advertised route priority (MED)** that you set per BGP session.
- OCI uses the longest prefix match first and lets you influence the choice with AS-path prepending; check OCI's route-preference rules for FastConnect versus VPN.

**Equal-cost multipath (ECMP)** lets you use several links at once for more bandwidth when paths look identical.

**Primary/backup with prepending and local preference (Cisco-style)**

```
! Prefer link A for outbound
route-map FROM-CLOUD-A permit 10
 set local-preference 200
! Make link B less attractive for inbound
route-map TO-CLOUD-B permit 10
 set as-path prepend 65010 65010 65010
```

> **Watch out:** Asymmetric routing (out via link A, back via link B) breaks stateful firewalls in the path. Steer both directions consistently.

## Lesson 5: Encryption, MTU and route limits

Three details cause many hybrid problems.

**Encryption.** Private links are private, not encrypted. Options: **MACsec** (Layer 2 encryption on supported dedicated ports: AWS Direct Connect, ExpressRoute Direct, Google Dedicated/Cross-Cloud Interconnect, OCI FastConnect cross-connects), **IPsec over the private link**, or application-level TLS everywhere.

**MTU.** Private links typically support 1,500 bytes and some support jumbo frames (AWS Direct Connect private VIFs up to 9,001; Google Interconnect up to 8,896). VPN tunnels need a smaller MTU, often around 1,400 bytes once IPsec headers are added. Mismatches cause large transfers to hang; use MSS clamping on the tunnel interfaces.

**Route limits.** Every provider limits the number of prefixes you can advertise per session (for example, 100 on an AWS private VIF; 4,000 on ExpressRoute private peering with Standard, 10,000 with Premium). Exceeding the limit drops the BGP session. Advertise **summaries** such as `10.100.0.0/14` rather than every subnet.

> **Tip:** Before go-live, agree in writing on the prefixes each side advertises and the filters each side applies. Most hybrid incidents come from unexpected route advertisements.

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

## Lesson 7: Real-world scenario: failover that didn't fail over

**Situation.** A company has ExpressRoute as its primary connection to Azure and a Site-to-Site VPN as backup, both with BGP. During a carrier outage, ExpressRoute goes down. Users lose access to Azure for 45 minutes, although the VPN tunnels are up.

**Investigation.**

1. The VPN gateway's BGP status shows routes learned from on-premises, but the on-premises routers show **no Azure routes** learned over the VPN.
2. The on-premises VPN firewall had an outbound route filter, configured during setup, that only accepted Azure routes when "a test tag" was present. The test had ended, but the filter remained.
3. The backup path had never been tested end to end since installation.

**Fix.**

1. Correct the route filters so Azure prefixes are accepted over the VPN with a lower local preference than ExpressRoute.
2. Verify that ExpressRoute stays preferred when both are up, and VPN takes over when ExpressRoute withdraws.
3. Schedule quarterly failover tests: shut the ExpressRoute BGP sessions in a maintenance window and confirm traffic moves, then restore.
4. Alert when the backup path's learned-route count drops to zero.

**Lessons learned.** A backup path that hasn't been tested is an assumption, not a backup. Monitor the backup's routes continuously and test failover on a schedule.

## Key takeaways

- Every cloud's private link uses eBGP; your router design is the same everywhere.
- Resilience needs two links, two locations, two devices and tested failover.
- Steer primary and backup paths deliberately with BGP attributes, and summarise routes.
- Private links are not encrypted by default; add MACsec or IPsec when required.

## Checkpoint

**Q1. Which protocol do all four providers use to exchange routes over private links?**

A. OSPF
B. BGP  ✓
C. RIP
D. EIGRP

_eBGP is universal for cloud hybrid connectivity._

**Q2. Is traffic on a dedicated private link encrypted by default?**

A. Yes, always
B. No  ✓
C. Only for IPv6
D. Only on Azure

_Private does not mean encrypted; add MACsec or IPsec._

**Q3. Which design survives the loss of an entire colocation facility?**

A. Two connections at one location on one device
B. Two connections at one location on two devices
C. Connections at two different locations  ✓
D. One connection with a bigger port

_Only diversity across locations protects against a site-level failure._

**Q4. Which feature helps BGP detect a failed link in about a second?**

A. Prepending
B. MED
C. BFD  ✓
D. Route summarisation

_Bidirectional Forwarding Detection detects path failure much faster than BGP hold timers._

**Q5. You advertise 300 individual /24 routes over an AWS private VIF and the session keeps dropping. Best fix?**

A. Use a bigger port
B. Add a VPN
C. Advertise summary routes to stay under the prefix limit  ✓
D. Change the ASN

_Private VIFs accept a limited number of prefixes; summarise._

**Q6. How do you know a backup hybrid path will work when the primary fails?**

A. Its tunnels show "up"
B. Test failover regularly and monitor the routes learned over the backup path  ✓
C. Buy a bigger primary link
D. Use static routes

_Tunnels can be up while routing is broken; only testing and route monitoring prove it._

## Official reading

- [AWS Direct Connect resiliency recommendations](https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency_toolkit.html)
- [Azure ExpressRoute high availability](https://learn.microsoft.com/en-us/azure/expressroute/designing-for-high-availability-with-expressroute)
- [Google Cloud Interconnect topologies](https://cloud.google.com/network-connectivity/docs/interconnect/concepts/overview)
- [OCI FastConnect redundancy best practices](https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/fastconnectresiliency.htm)
