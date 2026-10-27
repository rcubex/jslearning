# Module 16: Oracle Cloud (OCI) Networking

**Level:** 4 · **Lessons:** 7

## A real-world thread: OCI application in two fault domains

An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: VCNs and subnets

An OCI **Virtual Cloud Network (VCN)** is regional and holds one or more IPv4 CIDR blocks (each /16 to /30) and optional IPv6 prefixes. You create **subnets** inside it.

Two choices are made per subnet **at creation and cannot be changed**:

- **Regional or AD-specific**: regional subnets span all availability domains in the region (recommended); AD-specific subnets exist in one AD.
- **Public or private**: instances in private subnets cannot have public IPs.

OCI reserves 3 addresses per subnet (first two and last). Each VCN and subnet can have a **DNS label**, so instances get hostnames like `app1.snetapp.vcnprod.oraclevcn.com` resolved by the VCN's built-in resolver.

```text
oci network vcn create --compartment-id $C --cidr-blocks '["10.40.0.0/16"]' \
  --display-name vcn-prod --dns-label vcnprod
oci network subnet create --compartment-id $C --vcn-id $VCN \
  --cidr-block 10.40.10.0/24 --display-name snet-app \
  --prohibit-public-ip-on-vnic true --dns-label snetapp
```

> **Tip:** Because public/private can't be changed, decide per tier up front: only load balancers, bastions and NAT-facing resources need public subnets.

**Build the mental model:** Regional or AD-specific: regional subnets span all availability domains in the region (recommended); AD-specific subnets exist in one AD. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — OCI application in two fault domains:** Consider how “vcns and subnets” affects the situation: An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For vcns and subnets, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain vcns and subnets to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: Security lists and NSGs

OCI has two firewall mechanisms, both **stateful by default** (stateless rules are optional):

- **Security lists** apply to **every VNIC in a subnet**. A subnet can have up to five. Good for broad rules that apply to the whole subnet.
- **Network security groups (NSGs)** apply to the **VNICs you choose**, regardless of subnet. Rules can use another NSG as the source or destination, just like AWS security groups. Oracle recommends NSGs for most designs.

If both apply, traffic is allowed if **either** a security list or an NSG allows it (the union of rules). This differs from AWS and Azure, where both layers must allow traffic.

Every new VCN gets a **default security list** that allows SSH from anywhere and some ICMP. Tighten or replace it before production.

```text
nsg-lb   ingress: TCP 443 from 0.0.0.0/0
nsg-app  ingress: TCP 8080 from NSG nsg-lb
nsg-db   ingress: TCP 1521 from NSG nsg-app
default security list: remove "SSH from 0.0.0.0/0"
```

> **Watch out:** Because security lists and NSGs combine as a union, a permissive default security list can open access your NSGs were meant to block.

**Build the mental model:** Security lists apply to every VNIC in a subnet. A subnet can have up to five. Good for broad rules that apply to the whole subnet. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — OCI application in two fault domains:** Consider how “security lists and nsgs” affects the situation: An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For security lists and nsgs, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain security lists and nsgs to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Gateways

OCI gives each kind of traffic its own gateway, used as a route target:

- **Internet gateway**: two-way Internet access for resources with public IPs in public subnets.
- **NAT gateway**: outbound-only Internet access for private subnets, with a public IP Oracle provides (or one you reserve).
- **Service gateway**: private access to Oracle services (such as Object Storage, Autonomous Database public endpoints, OS update mirrors) without the Internet. Route rules target the service CIDR label **All <region> Services in Oracle Services Network** or **OCI <region> Object Storage**.
- **Dynamic Routing Gateway (DRG)**: connects the VCN to other VCNs, on-premises networks and other regions.
- **Local peering gateway (LPG)**: the older way to peer two VCNs in the same region; DRG attachments are now preferred.

```text
rt-public:   0.0.0.0/0 → Internet gateway
rt-private:  0.0.0.0/0 → NAT gateway
             All <region> Services in Oracle Services Network → Service gateway
             10.0.0.0/8 (on-prem and other VCNs) → DRG
```

> **Tip:** A private subnet can have both a NAT gateway route (0.0.0.0/0) and a service gateway route. The service gateway route is more specific, so traffic to Oracle services stays private and only other Internet traffic uses NAT.

**Build the mental model:** Internet gateway: two-way Internet access for resources with public IPs in public subnets. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — OCI application in two fault domains:** Consider how “gateways” affects the situation: An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For gateways, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain gateways to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: The DRG as a hub

The **Dynamic Routing Gateway (DRG)** is OCI's virtual router and its central hub. A single DRG can have many **attachments**:

- **VCN attachments** (many VCNs in the same region, for hub-and-spoke)
- **IPSec tunnel attachments** (Site-to-Site VPN)
- **Virtual circuit attachments** (FastConnect)
- **Remote peering connection (RPC) attachments** (to DRGs in other regions or tenancies)

Each attachment uses a **DRG route table**, and **import route distributions** decide which routes each table learns. This lets you build segmentation and **transit routing**, such as sending all spoke-to-spoke and on-premises traffic through a firewall in a hub VCN.

```text
DRG route table for spoke VCN attachments:  0.0.0.0/0 → hub VCN attachment
DRG route table for the hub attachment:     imports routes from all spokes and on-prem
Hub VCN ingress route table (on the DRG attachment): 0.0.0.0/0 → firewall private IP
```

> **Tip:** Use one DRG per region as the hub, and remote peering connections between regional DRGs for a global network.

**Build the mental model:** VCN attachments (many VCNs in the same region, for hub-and-spoke). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — OCI application in two fault domains:** Consider how “the drg as a hub” affects the situation: An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For the drg as a hub, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain the drg as a hub to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: Load balancing, DNS and edge security

**OCI Load Balancer** (flexible shape) is an L7 HTTP/HTTPS proxy that can also balance TCP. It supports path and host routing, TLS termination, session persistence and integration with **OCI WAF**. Bandwidth is set as a flexible range (minimum and maximum Mbps).

**OCI Network Load Balancer** is an L3/L4 pass-through load balancer for TCP, UDP and ICMP, preserving source and destination IPs, with very low latency. It is free of charge, which makes it popular for internal services and appliance clusters.

**OCI DNS** hosts public zones and, inside VCNs, **private DNS** with **private views** and a **resolver** per VCN. **Listening endpoints** answer queries from on-premises; **forwarding endpoints** with rules send queries for on-premises zones to your DNS servers.

Edge protection: **OCI WAF** (attached to load balancers or as an edge policy), DDoS protection included at the edge, and **OCI Network Firewall** (a managed next-generation firewall built with Palo Alto Networks technology) for inspection inside VCNs.

> **Tip:** Public load balancers need a public subnet; their backends should sit in private subnets reachable only from the load balancer's NSG.

**Build the mental model:** **OCI Load Balancer** (flexible shape) is an L7 HTTP/HTTPS proxy that can also balance TCP. It supports path and host routing, TLS termination, session persistence and integration with **OCI WAF**. Bandwidth is set as a. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — OCI application in two fault domains:** Consider how “load balancing, dns and edge security” affects the situation: An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For load balancing, dns and edge security, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain load balancing, dns and edge security to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: Hybrid and multi-cloud connectivity on OCI

**Site-to-Site VPN** connects your network to a DRG with **two redundant IPsec tunnels** per connection. Routing can be **BGP** (recommended), static, or policy-based. Use IKEv2 and configure both tunnels.

**FastConnect** provides private connectivity:

- **Oracle partner**: through a service provider, in bandwidths from 1 Gbps
- **Colocation with Oracle**: your own cross-connects of 1, 10, 100 or 400 Gbps at an Oracle FastConnect location
- **Third-party provider**: through a provider not in the partner list
- **Private peering** reaches your VCNs via the DRG; **public peering** reaches OCI public services.
- **MACsec** encryption is supported on cross-connects.

For multi-cloud, **Oracle Interconnect for Microsoft Azure** and **Oracle Interconnect for Google Cloud** provide direct, low-latency private links between OCI and those clouds in paired regions, and **Oracle Database@Azure / @Google Cloud / @AWS** run Oracle Database services inside those clouds' data centres.

> **Tip:** Two FastConnect virtual circuits at different locations (or one FastConnect plus Site-to-Site VPN as backup) with BGP is the standard resilient design.

**Build the mental model:** Oracle partner: through a service provider, in bandwidths from 1 Gbps. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — OCI application in two fault domains:** Consider how “hybrid and multi-cloud connectivity on oci” affects the situation: An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For hybrid and multi-cloud connectivity on oci, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain hybrid and multi-cloud connectivity on oci to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 7: Operating and troubleshooting OCI networks

Key tools in OCI's **Network Command Center**:

- **Network Path Analyzer**: analyses route tables, security lists, NSGs and gateways between a source and destination and shows where traffic is allowed or blocked.
- **VCN flow logs**: records of accepted and rejected traffic, configured per subnet, VNIC or VCN through capture filters, delivered to OCI Logging.
- **Capture filters and VTAP**: virtual test access points mirror traffic from a source (VNIC, load balancer, database) to a target for deep analysis.
- **Inter-region latency** dashboards.

**OCI Bastion** provides time-limited, audited SSH sessions to private instances without public IPs or open SSH from the Internet.

```text
1. Subnet route table: is there a rule to the right gateway (NAT, service, DRG)?
2. Security lists + NSGs: does any rule allow it? (union of both)
3. Instance OS firewall: Oracle Linux images ship with firewalld enabled
4. DRG route tables and import distributions (for cross-VCN/on-prem)
5. Run Network Path Analyzer to confirm
```

> **Watch out:** Oracle-provided Linux images have firewalld (and on some images iptables rules) enabled by default. Opening an NSG is not enough; open the port in the OS too.

**Build the mental model:** Network Path Analyzer: analyses route tables, security lists, NSGs and gateways between a source and destination and shows where traffic is allowed or blocked. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — OCI application in two fault domains:** Consider how “operating and troubleshooting oci networks” affects the situation: An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For operating and troubleshooting oci networks, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain operating and troubleshooting oci networks to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
