# Module 09: BGP & Internet Routing

**Level:** 2 · **Lessons:** 5

## A real-world thread: Two ISPs for a critical office

An organisation connects to two providers. BGP exchanges reachable prefixes, but route attributes, filtering and asymmetric paths determine whether resilience works as intended.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: Autonomous systems

An **autonomous system (AS)** is a network, or group of networks, run by one organisation with one routing policy. Each has an **ASN** (autonomous system number). Examples: Amazon is AS16509, Microsoft AS8075, Google AS15169, Oracle AS31898, Cloudflare AS13335.

Public ASNs are assigned by regional registries (RIPE NCC for the Middle East and Europe, ARIN for North America, APNIC for Asia-Pacific). For private use, such as between your data centre and the cloud, you use a **private ASN**: 64512–65534 in the 2-byte range, or 4200000000–4294967294 in the 4-byte range.

BGP is a **path-vector** protocol. Routers announce which IP **prefixes** they can reach, along with the list of ASNs the announcement has passed through (the **AS path**). This lets every network see the path, avoid loops and apply policy.

> **In the cloud:** When you set up a cloud VPN or private link with BGP, you choose an ASN for your side (for example 65010) and the provider uses its own (AWS defaults to 64512 for a virtual private gateway, Azure VPN gateways use 65515, Google Cloud Router lets you pick, OCI uses 31898).

**Build the mental model:** An **autonomous system (AS)** is a network, or group of networks, run by one organisation with one routing policy. Each has an **ASN** (autonomous system number). Examples: Amazon is AS16509, Microsoft AS8075, Google AS1. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Two ISPs for a critical office:** Consider how “autonomous systems” affects the situation: An organisation connects to two providers. BGP exchanges reachable prefixes, but route attributes, filtering and asymmetric paths determine whether resilience works as intended. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For autonomous systems, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain autonomous systems to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: eBGP and iBGP

**eBGP** (external BGP) runs between routers in *different* autonomous systems, usually directly connected. **iBGP** (internal BGP) runs between routers in the *same* AS to spread externally learned routes across the organisation.

A BGP session runs over **TCP port 179**. The two routers (**peers** or **neighbours**) exchange their routes, then send updates only when something changes, plus small keepalive messages. If keepalives stop for the **hold time** (often 90 seconds; cloud services commonly use shorter timers or BFD for faster detection), the session drops and its routes are withdrawn.

```text
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

**Build the mental model:** **eBGP** (external BGP) runs between routers in *different* autonomous systems, usually directly connected. **iBGP** (internal BGP) runs between routers in the *same* AS to spread externally learned routes across the org. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Two ISPs for a critical office:** Consider how “ebgp and ibgp” affects the situation: An organisation connects to two providers. BGP exchanges reachable prefixes, but route attributes, filtering and asymmetric paths determine whether resilience works as intended. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For ebgp and ibgp, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain ebgp and ibgp to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

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

```text
route-map PREPEND-BACKUP permit 10
 set as-path prepend 65010 65010 65010
router bgp 65010
 neighbor 169.254.20.1 route-map PREPEND-BACKUP out
```

> **In the cloud:** Providers document how they pick between your links. For example, AWS prefers Direct Connect over VPN for the same prefix and honours prepending and longest prefix; Azure ExpressRoute uses AS path and weight; always read the provider's routing-preference page before designing primary/backup.

**Build the mental model:** Highest local preference: set inside your AS to choose the *outbound* exit (prefer link A over link B for traffic you send). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Two ISPs for a critical office:** Consider how “path selection” affects the situation: An organisation connects to two providers. BGP exchanges reachable prefixes, but route attributes, filtering and asymmetric paths determine whether resilience works as intended. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For path selection, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain path selection to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: Peering and transit

Networks connect to each other in two commercial ways.

**Transit**: you pay a provider to carry your traffic to and from the entire Internet. Small networks buy transit from one or more ISPs.

**Peering**: two networks agree to exchange traffic directly between their own customers, usually without payment. It reduces cost and latency. Peering happens over private cables or at **Internet Exchange Points (IXPs)**, such as UAE-IX in Dubai, DE-CIX in Frankfurt or AMS-IX in Amsterdam, where hundreds of networks connect to a shared switch.

Cloud providers peer with thousands of ISPs worldwide, which is why traffic to them often enters their private backbone very close to the user.

> **Tip:** Look up your ISP and the big clouds on bgp.he.net to see their prefixes, peers and the IXPs they connect at.

**Build the mental model:** Networks connect to each other in two commercial ways. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Two ISPs for a critical office:** Consider how “peering and transit” affects the situation: An organisation connects to two providers. BGP exchanges reachable prefixes, but route attributes, filtering and asymmetric paths determine whether resilience works as intended. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For peering and transit, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain peering and transit to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: Route security and best practice

BGP was designed on trust, and mistakes spread globally. A **route leak** or **hijack** happens when a network announces prefixes it should not, and traffic is misrouted, sometimes for whole countries or major services.

Defences:

- **Prefix filters**: only advertise your own prefixes, and only accept what you expect from each peer
- **Maximum-prefix limits**: shut the session if a peer suddenly sends far more routes than normal
- **RPKI** (Resource Public Key Infrastructure): cryptographically signed records (ROAs) saying which ASN may originate a prefix; routers drop invalid announcements
- **BGP authentication** (TCP MD5 or TCP-AO) on sessions
- **Summarise** routes: advertise 10.100.0.0/16, not 200 individual /24s

> **In the cloud:** Clouds limit how many routes you can advertise to them (for example, AWS Direct Connect private virtual interfaces accept up to 100 prefixes by default, and Azure ExpressRoute private peering allows up to 4,000 with Standard). Exceed the limit and the session goes down. Summarise.

**Build the mental model:** Prefix filters: only advertise your own prefixes, and only accept what you expect from each peer. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Two ISPs for a critical office:** Consider how “route security and best practice” affects the situation: An organisation connects to two providers. BGP exchanges reachable prefixes, but route attributes, filtering and asymmetric paths determine whether resilience works as intended. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For route security and best practice, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain route security and best practice to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
