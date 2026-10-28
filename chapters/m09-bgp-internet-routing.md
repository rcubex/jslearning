# Module 10: BGP & Internet Routing

**Level:** 2 · **Lessons:** 7 · **Questions:** 7

_Read and reason about BGP, the protocol behind every hybrid cloud link._

## Lesson 1: Autonomous systems

An **autonomous system (AS)** is a network, or group of networks, run by one organisation with one routing policy. Each has an **ASN** (autonomous system number). Examples: Amazon is AS16509, Microsoft AS8075, Google AS15169, Oracle AS31898, Cloudflare AS13335.

Public ASNs are assigned by regional registries (RIPE NCC for the Middle East and Europe, ARIN for North America, APNIC for Asia-Pacific). For private use, such as between your data centre and the cloud, you use a **private ASN**: 64512–65534 in the 2-byte range, or 4200000000–4294967294 in the 4-byte range.

BGP is a **path-vector** protocol. Routers announce which IP **prefixes** they can reach, along with the list of ASNs the announcement has passed through (the **AS path**). This lets every network see the path, avoid loops and apply policy.

> **In the cloud:** When you set up a cloud VPN or private link with BGP, you choose an ASN for your side (for example 65010) and the provider uses its own (AWS defaults to 64512 for a virtual private gateway, Azure VPN gateways use 65515, Google Cloud Router lets you pick, OCI uses 31898).

## Lesson 2: eBGP and iBGP

**eBGP** (external BGP) runs between routers in *different* autonomous systems, usually directly connected. **iBGP** (internal BGP) runs between routers in the *same* AS to spread externally learned routes across the organisation.

A BGP session runs over **TCP port 179**. The two routers (**peers** or **neighbours**) exchange their routes, then send updates only when something changes, plus small keepalive messages. If keepalives stop for the **hold time** (often 90 seconds; cloud services commonly use shorter timers or BFD for faster detection), the session drops and its routes are withdrawn.

**Typical BGP neighbour setup on your router (Cisco-style)**

```
router bgp 65010
 neighbor 169.254.10.1 remote-as 64512        ! the cloud side
 neighbor 169.254.10.1 password <md5-key>
 address-family ipv4
  network 10.100.0.0 mask 255.255.0.0          ! advertise on-prem range
  neighbor 169.254.10.1 activate
  neighbor 169.254.10.1 prefix-list TO-CLOUD out
  neighbor 169.254.10.1 prefix-list FROM-CLOUD in
```

> **Tip:** The 169.254.x.x addresses on cloud VPN and private-link interfaces are link-local "inside tunnel" addresses used only for the BGP session.

## Lesson 3: Path selection

When a router learns several paths to the same prefix, BGP picks one using an ordered list of attributes. Simplified, the most important are:

1. **Highest local preference**: set inside your AS to choose the *outbound* exit (prefer link A over link B for traffic you send).
2. **Shortest AS path**: fewer ASNs wins.
3. **Lowest origin type**.
4. **Lowest MED** (multi-exit discriminator): a hint you give a neighbour about which of your links it should use to send traffic *to you*. Only compared between paths from the same neighbouring AS.
5. eBGP over iBGP, then lowest IGP cost, then tie-breakers.

Remember the direction:

- You control **outbound** traffic with **local preference** (and weight on Cisco).
- You influence **inbound** traffic with **AS-path prepending** (repeating your own ASN to make a path look longer) and **MED**.

**Make link B the backup for inbound traffic**

```
route-map PREPEND-BACKUP permit 10
 set as-path prepend 65010 65010 65010
router bgp 65010
 neighbor 169.254.20.1 route-map PREPEND-BACKUP out
```

> **In the cloud:** Providers document how they pick between your links. For example, AWS prefers Direct Connect over VPN for the same prefix and honours prepending and longest prefix; Azure ExpressRoute uses AS path and weight; always read the provider's routing-preference page before designing primary/backup.

## Lesson 4: Peering and transit

Networks connect to each other in two commercial ways.

**Transit**: you pay a provider to carry your traffic to and from the entire Internet. Small networks buy transit from one or more ISPs.

**Peering**: two networks agree to exchange traffic directly between their own customers, usually without payment. It reduces cost and latency. Peering happens over private cables or at **Internet Exchange Points (IXPs)**, such as UAE-IX in Dubai, DE-CIX in Frankfurt or AMS-IX in Amsterdam, where hundreds of networks connect to a shared switch.

Cloud providers peer with thousands of ISPs worldwide, which is why traffic to them often enters their private backbone very close to the user.

> **Tip:** Look up your ISP and the big clouds on bgp.he.net to see their prefixes, peers and the IXPs they connect at.

## Lesson 5: Route security and best practice

BGP was designed on trust, and mistakes spread globally. A **route leak** or **hijack** happens when a network announces prefixes it should not, and traffic is misrouted, sometimes for whole countries or major services.

Defences:

- **Prefix filters**: only advertise your own prefixes, and only accept what you expect from each peer
- **Maximum-prefix limits**: shut the session if a peer suddenly sends far more routes than normal
- **RPKI** (Resource Public Key Infrastructure): cryptographically signed records (ROAs) saying which ASN may originate a prefix; routers drop invalid announcements
- **BGP authentication** (TCP MD5 or TCP-AO) on sessions
- **Summarise** routes: advertise 10.100.0.0/16, not 200 individual /24s

> **In the cloud:** Clouds limit how many routes you can advertise to them (for example, AWS Direct Connect private virtual interfaces accept up to 100 prefixes by default, and Azure ExpressRoute private peering allows up to 4,000 with Standard). Exceed the limit and the session goes down. Summarise.

## Lesson 6: Deep dive: BGP communities and route reflectors

**BGP communities** are tags attached to routes. They let networks signal intentions to each other: "don't advertise this route further", "prefer this path", "this is a customer route". Standard communities look like `ASN:value` (for example `65010:100`); well-known ones include **NO_EXPORT** (don't send outside this AS).

Cloud providers use communities so you can influence routing on private links:

- **AWS Direct Connect**: local preference communities (`7224:7100` low, `7224:7200` medium, `7224:7300` high) that you attach to routes you advertise, to choose which Direct Connect connection AWS uses to send traffic to you; and scope communities on public VIFs that control how far your prefixes propagate.
- **Azure ExpressRoute**: Microsoft tags routes learned over Microsoft peering with regional communities, so you can filter which regions' prefixes you accept.
- Other providers document their own community schemes; check before designing.

**Route reflectors** solve an iBGP scaling problem. iBGP requires every router to peer with every other router (a full mesh). With 50 routers that's 1,225 sessions. A **route reflector** lets routers peer only with one or two reflectors, which reflect routes to everyone. Large enterprises and all service providers use them; cloud hub routers (Transit Gateway, Cloud Router, DRG) act in a similar central role.

**Tag routes to make AWS prefer this Direct Connect for return traffic**

```
ip prefix-list ONPREM seq 10 permit 10.100.0.0/14
route-map TO-AWS-PRIMARY permit 10
 match ip address prefix-list ONPREM
 set community 7224:7300
router bgp 65010
 neighbor 169.254.30.1 send-community
 neighbor 169.254.30.1 route-map TO-AWS-PRIMARY out
```

> **Tip:** Communities only work if you remember `send-community` (or the equivalent) on the BGP session. Without it, tags are stripped silently.

## Lesson 7: Real-world scenario: the route leak that blackholed the cloud

**Situation.** A company connects its data centre to AWS via Direct Connect (primary) and Site-to-Site VPN (backup). One evening, users suddenly can't reach any cloud application, although both connections show "up".

**Investigation.**

1. On the on-premises edge router, `show ip bgp` shows the cloud prefixes still learned over Direct Connect, but a new, more specific route `10.32.0.0/16` points to a lab firewall.
2. A network engineer, testing in the lab, had advertised `10.32.0.0/16` into the company's OSPF from a lab firewall by mistake. It was redistributed into BGP and to the data centre core.
3. Longest-prefix match beat the cloud's `10.32.0.0/14` route, so traffic for the main production VPC went to the lab and died there.

**Fix.** Remove the lab route, then prevent recurrence: prefix lists on OSPF-to-BGP redistribution accepting only approved on-premises ranges, filters on the core refusing cloud ranges from internal sources, and an alert when routes for cloud ranges appear from unexpected neighbours.

**Lessons learned.** A single wrong advertisement can override correct routes because more specific prefixes always win. Filter what you accept and redistribute, not just what you send.

## Key takeaways

- The Internet is ~75,000+ autonomous systems connected by BGP.
- Every cloud private link and dynamic VPN uses eBGP between your router and the provider.
- Steer outbound traffic with local preference; steer inbound traffic with prepending and MED.
- Always filter what you advertise and accept; route leaks cause real outages.

## Checkpoint

**Q1. Which BGP technique makes a path look longer so peers prefer another link?**

A. MED
B. AS-path prepending  ✓
C. Local preference
D. Route reflection

_Prepending repeats your ASN in the path, making it less attractive._

**Q2. Which range is reserved for private 2-byte ASNs?**

A. 1–1023
B. 64512–65534  ✓
C. 65535 only
D. 100–200

_64512–65534 is the private 16-bit ASN range._

**Q3. Which TCP port does a BGP session use?**

A. 22
B. 443
C. 179  ✓
D. 500

_BGP peers connect over TCP 179._

**Q4. You have two links to the cloud and want your outbound traffic to prefer link A. Which attribute do you set?**

A. MED
B. AS-path prepending
C. Local preference  ✓
D. Origin

_Local preference is set inside your AS and controls which exit you use for outbound traffic._

**Q5. What does RPKI help prevent?**

A. Packet loss
B. Unauthorised networks announcing your prefixes  ✓
C. DNS spoofing
D. MTU problems

_RPKI lets routers check that an ASN is authorised to originate a prefix._

**Q6. Which AWS Direct Connect community gives the highest local preference for traffic AWS sends to you?**

A. 7224:7100
B. 7224:7200
C. 7224:7300  ✓
D. 7224:9999

_7224:7300 is high preference; 7100 low, 7200 medium._

**Q7. Why do large networks use BGP route reflectors?**

A. To encrypt BGP
B. To avoid needing a full mesh of iBGP sessions between all routers  ✓
C. To replace OSPF
D. To filter prefixes

_Reflectors relay routes so routers don't all have to peer with each other._

## Official reading

- [Cloudflare Learning: what is BGP](https://www.cloudflare.com/learning/security/glossary/what-is-bgp/)
- [Hurricane Electric BGP Toolkit](https://bgp.he.net/)
- [Cloudflare: is BGP safe yet (RPKI)](https://isbgpsafeyet.com/)
