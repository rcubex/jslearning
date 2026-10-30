# Module 33: SASE, SD-WAN & Zero Trust Access

**Level:** 5 · **Lessons:** 6 · **Questions:** 5

_Understand how users and branches connect securely to cloud applications today._

## Lesson 1: Why the perimeter moved

Ten years ago, most applications lived in the company data centre and most users sat in offices. Branch traffic was backhauled over MPLS to headquarters, through one big firewall stack, and out to the Internet.

Today applications are SaaS (Microsoft 365, Salesforce) and cloud-hosted, and users work from anywhere. Backhauling everything to headquarters adds latency, overloads the central firewall and the MPLS links, and gives remote users a poor experience. A traditional VPN also gives users broad network access: once connected, a compromised laptop can scan and reach far more than it needs.

Two shifts address this:

- **Networking**: branches connect directly to the Internet and clouds using **SD-WAN** instead of only expensive MPLS.
- **Security**: inspection and access control move into **cloud-delivered services** close to users, and access decisions are based on **identity and device**, not network location.

> **Analogy:** Instead of every employee driving to headquarters to be searched before going anywhere, security checkpoints are placed in every neighbourhood, and each door checks your badge.

## Lesson 2: SD-WAN

**SD-WAN** (software-defined WAN) puts an intelligent edge device or virtual appliance at each branch, connected over several **underlay** links (broadband, 5G, MPLS, fibre). It builds encrypted **overlay** tunnels between sites and to cloud hubs, managed from a central controller.

Key capabilities:

- **Application-aware path selection**: send Microsoft Teams over the link with the lowest jitter, backups over the cheapest link, and move traffic instantly when a link degrades.
- **Central policy**: one place to define routing, QoS and security for hundreds of sites.
- **Zero-touch provisioning**: a new branch device downloads its config when plugged in.
- **Local Internet breakout**: SaaS traffic goes straight to the Internet (through cloud security) instead of backhauling.

**Cloud on-ramps** connect SD-WAN to cloud networks: SD-WAN virtual appliances in an AWS Transit Gateway Connect attachment (GRE plus BGP) or Cloud WAN, in an **Azure Virtual WAN** hub (with integrated partner appliances), via **Google Network Connectivity Center** router appliance spokes, or as appliances in an OCI hub VCN attached to the DRG.

> **Tip:** When evaluating SD-WAN, test failover under real conditions: unplug a link during a video call and see whether the call survives.

## Lesson 3: SSE and SASE

**SASE** (secure access service edge, pronounced "sassy") combines **SD-WAN** networking with **SSE** (security service edge), a set of cloud-delivered security services, consumed from the provider's points of presence close to users:

- **Secure web gateway (SWG)**: inspects and filters web traffic (malware, URL categories, TLS inspection).
- **Cloud access security broker (CASB)**: visibility and control over SaaS usage (which apps, what data, sharing policies).
- **Zero trust network access (ZTNA)**: per-application private access (next lesson).
- **Firewall as a service (FWaaS)**: network firewall policies applied in the cloud.
- **Data loss prevention (DLP)**: detects and blocks sensitive data leaving the organisation.

All traffic, from branches (via SD-WAN) and remote users (via an agent), goes to the nearest SSE PoP, gets the same policy, and continues to the Internet, SaaS or private apps.

Vendors include Zscaler, Netskope, Palo Alto Networks Prisma Access, Cloudflare One, Cisco and Fortinet, and Microsoft's **Global Secure Access** (Entra Internet Access and Entra Private Access).

> **Watch out:** TLS inspection in an SWG requires deploying a trusted root certificate to devices and excluding sensitive categories (banking, health) and apps with certificate pinning.

## Lesson 4: ZTNA versus VPN

A traditional **remote-access VPN** puts the user's device *on the network*. Access is broad, often whole subnets, and the network trusts the device once connected.

**ZTNA** connects users to **specific applications**, never to the network:

1. The user authenticates with the identity provider (with MFA).
2. The policy engine checks **identity, group, device posture** (managed, encrypted, patched, EDR running) and context (location, risk).
3. If allowed, a broker connects the user to that one application, often through a **connector** that makes an outbound connection from the app's network, so no inbound ports are open.
4. The decision is re-evaluated continuously; access ends when conditions change.

Cloud-native options:

- **Google Cloud Identity-Aware Proxy (IAP)** for web apps and TCP forwarding; **Chrome Enterprise Premium** (formerly BeyondCorp Enterprise) for broader zero-trust access.
- **AWS Verified Access**: access to corporate applications without a VPN, with policies on identity and device trust.
- **Microsoft Entra Private Access**: ZTNA for private apps, with Conditional Access policies.
- **OCI Zero Trust Packet Routing (ZPR)**: security attributes on resources and intent-based policies that control which resources can talk, independent of network topology.

> **Tip:** Migrate in waves: publish web apps through ZTNA first (easiest), then SSH/RDP, then the remaining client-server apps, and shrink the VPN as you go.

## Lesson 5: Designing a SASE migration

A realistic plan for an organisation with offices, remote staff and multiple clouds:

1. **Inventory** applications and who uses them: SaaS, public web, private web, legacy client-server.
2. **Identity first**: one identity provider with MFA and device management everywhere; it is the foundation of every policy.
3. **Internet and SaaS traffic** for remote users through the SSE (SWG, CASB), then for branches via SD-WAN local breakout.
4. **Private apps** through ZTNA connectors placed in each cloud network and data centre.
5. **Branches**: replace or augment MPLS with SD-WAN, connected to SSE PoPs and to cloud hubs.
6. **Decommission**: retire the central web proxies and most VPN access.

> **Tip:** Measure user experience before and after (page load times, call quality). SASE should make things faster for remote users, and showing that wins support for the programme.

## Lesson 6: Real-world scenario: the VPN that let ransomware in

**Situation.** A logistics company with 40 branches and 2,000 remote workers used a traditional VPN. A contractor's unmanaged laptop, infected with malware, connected with valid credentials. Because the VPN gave access to the whole 10.0.0.0/8 network, the malware scanned and reached file servers and a backup server, encrypting data across several sites.

**Analysis.**

- The credentials were valid, so perimeter security did its job, but the **trust model** failed: being connected meant being trusted.
- The contractor needed only two web applications, yet had network-wide access.
- No device posture check existed; the laptop had no endpoint protection.
- Flat routing allowed movement from VPN users straight into the server networks.

**Redesign.**

1. **ZTNA** for all private applications: contractors get access to exactly two apps, only from devices that pass posture checks, or through a managed browser session.
2. **MFA and Conditional Access** on every login; access re-evaluated continuously.
3. **Segmentation**: server and backup networks accept connections only from the application tiers that need them; backups moved to immutable storage in the cloud.
4. **SD-WAN with SSE** for branches, inspecting Internet and inter-site traffic.
5. **Flow-log and EDR alerts** for scanning behaviour.

**Lessons learned.** Network access is not application access. Giving each user only the applications they need, from healthy devices, turns a full-company incident into a contained one.

## Key takeaways

- Users and apps left the data centre, so security moved to the cloud edge and to identity.
- SD-WAN builds smart overlays across many links and connects branches to cloud hubs.
- SASE combines SD-WAN with cloud-delivered security (SWG, CASB, ZTNA, FWaaS).
- ZTNA grants access per application based on identity and device, replacing broad VPN access.

## Checkpoint

**Q1. What does SASE combine?**

A. MPLS and Ethernet
B. SD-WAN networking with cloud-delivered security services  ✓
C. VLANs and VRFs
D. DNS and DHCP

_SASE = SD-WAN + SSE (SWG, CASB, ZTNA, FWaaS and more)._

**Q2. What is the key difference between ZTNA and a traditional VPN?**

A. ZTNA is faster
B. ZTNA grants access to specific applications based on identity and device, not to the whole network  ✓
C. ZTNA uses IPv6
D. VPNs don't encrypt traffic

_ZTNA connects users to apps, never to network ranges._

**Q3. Which SD-WAN capability moves a video call to a better link when one degrades?**

A. Zero-touch provisioning
B. Application-aware path selection  ✓
C. Local breakout
D. Route summarisation

_SD-WAN measures link quality and steers applications accordingly._

**Q4. Which SSE component gives visibility and control over SaaS application usage?**

A. SWG
B. CASB  ✓
C. FWaaS
D. SD-WAN

_A cloud access security broker focuses on SaaS usage and data._

**Q5. Which OCI capability controls communication between resources using security attributes rather than network topology?**

A. Security lists
B. DRG route tables
C. Zero Trust Packet Routing  ✓
D. Service gateway

_ZPR policies use attributes on resources to decide what may communicate._

## Official reading

- [Cloudflare Learning: what is SASE](https://www.cloudflare.com/learning/access-management/what-is-sase/)
- [Microsoft Entra Private Access](https://learn.microsoft.com/en-us/entra/global-secure-access/concept-private-access)
- [AWS Verified Access](https://docs.aws.amazon.com/verified-access/latest/ug/what-is-verified-access.html)
- [Google Cloud: Identity-Aware Proxy](https://cloud.google.com/iap/docs/concepts-overview)
- [OCI Zero Trust Packet Routing](https://docs.oracle.com/en-us/iaas/Content/zero-trust-packet-routing/overview.htm)
