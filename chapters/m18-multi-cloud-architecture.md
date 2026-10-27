# Module 18: Multi-Cloud Architecture

**Level:** 5 · **Lessons:** 6

## A real-world thread: Company operating on two clouds

A business chooses different clouds for applications and analytics. Nonoverlapping addressing, identity boundaries, private connectivity, DNS and operational ownership become important.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: IP address management (IPAM)

In a multi-cloud estate, address overlaps are the most expensive mistake. Two networks with the same range cannot be routed to each other without NAT, which complicates everything that follows.

Build one hierarchical plan and allocate from it:

```text
10.0.0.0/12     on-premises data centres and offices
10.16.0.0/12    reserved for growth
10.32.0.0/12    AWS     (10.32/14 me-central-1, 10.36/14 eu-west-1, ...)
10.48.0.0/12    Azure   (10.48/14 UAE North, 10.52/14 West Europe, ...)
10.64.0.0/12    Google Cloud
10.80.0.0/12    OCI
10.96.0.0/11    Kubernetes pod and service ranges (or use non-routed overlays)
```

Tools help enforce it: **Amazon VPC IPAM** can allocate VPC CIDRs automatically from pools and monitor usage; **Azure Virtual Network Manager IPAM** manages address pools across subscriptions; Google Cloud and OCI rely on careful planning plus third-party IPAM (Infoblox, NetBox).

> **Tip:** Each cloud gets one large, summarisable block per region. Then on-premises routers need only one route per cloud region, and routing stays simple.

**Build the mental model:** In a multi-cloud estate, address overlaps are the most expensive mistake. Two networks with the same range cannot be routed to each other without NAT, which complicates everything that follows. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Company operating on two clouds:** Consider how “ip address management (ipam)” affects the situation: A business chooses different clouds for applications and analytics. Nonoverlapping addressing, identity boundaries, private connectivity, DNS and operational ownership become important. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For ip address management (ipam), consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain ip address management (ipam) to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: Topologies

Choose a topology inside each cloud, then connect the clouds.

Inside a cloud, the standard is **hub-and-spoke**: workload networks (spokes) connect to a hub that holds shared services, firewalls and the hybrid links. Each provider has a native hub: **AWS Transit Gateway / Cloud WAN**, **Azure hub VNet or Virtual WAN**, **Google NCC or Shared VPC**, **OCI DRG**.

Between clouds and on-premises, common shapes are:

- **On-premises as the hub**: every cloud connects back to the data centre. Simple, but cloud-to-cloud traffic hairpins through the data centre.
- **Colocation as the hub**: routers in a colocation facility connect to all clouds and to on-premises. Short paths and one place for policy.
- **Direct cloud-to-cloud**: provider interconnects such as Oracle Interconnect for Azure and for Google Cloud, or Google Cross-Cloud Interconnect. Lowest latency for heavy flows between two clouds.
- **Cloud VPN mesh**: IPsec between cloud VPN gateways. Quick and cheap, limited throughput.

> **Tip:** Segment consistently everywhere. If "prod" and "dev" are separate route domains in AWS Transit Gateway, keep them separate in Azure, Google Cloud and OCI too, and across the interconnects.

**Build the mental model:** On-premises as the hub: every cloud connects back to the data centre. Simple, but cloud-to-cloud traffic hairpins through the data centre. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Company operating on two clouds:** Consider how “topologies” affects the situation: A business chooses different clouds for applications and analytics. Nonoverlapping addressing, identity boundaries, private connectivity, DNS and operational ownership become important. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For topologies, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain topologies to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Connecting the clouds

For each pair of clouds that must talk, weigh bandwidth, latency, cost and effort:

- **VPN between cloud gateways** (for example, AWS Site-to-Site VPN to Azure VPN Gateway, or Google HA VPN to AWS). Set up in an hour, encrypted, but limited per tunnel and crosses the Internet.
- **Private links meeting in colocation**: Direct Connect, ExpressRoute, Interconnect and FastConnect all land on your routers, which route between them. High bandwidth, predictable, but you operate the routers.
- **Provider-to-provider interconnects**: Oracle Interconnect for Microsoft Azure and for Google Cloud link specific region pairs directly with sub-2 ms latency in many locations. Google Cross-Cloud Interconnect provides dedicated physical links from Google to AWS, Azure, OCI and Alibaba Cloud.
- **Partner network-as-a-service**: Equinix Fabric, Megaport and similar let you create virtual circuits between clouds in minutes from a portal.

> **In the cloud:** A typical example is an application on Azure using Oracle Database on OCI over the Oracle–Azure interconnect, or Oracle Database@Azure, which runs Oracle's database service inside Azure data centres.

**Build the mental model:** VPN between cloud gateways (for example, AWS Site-to-Site VPN to Azure VPN Gateway, or Google HA VPN to AWS). Set up in an hour, encrypted, but limited per tunnel and crosses the Internet. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Company operating on two clouds:** Consider how “connecting the clouds” affects the situation: A business chooses different clouds for applications and analytics. Nonoverlapping addressing, identity boundaries, private connectivity, DNS and operational ownership become important. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For connecting the clouds, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain connecting the clouds to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: DNS across clouds

Every cloud has its own private DNS, and each one only answers for its own zones by default. A multi-cloud design must let every environment resolve names in every other.

The building blocks are the same in each cloud: an **inbound** endpoint (others can send queries in) and an **outbound** endpoint with **forwarding rules** (send queries for other zones out):

- **AWS**: Route 53 Resolver inbound and outbound endpoints with forwarding rules
- **Azure**: DNS Private Resolver inbound and outbound endpoints with forwarding rulesets
- **Google Cloud**: Cloud DNS inbound server policies and forwarding zones
- **OCI**: private DNS resolver with listening and forwarding endpoints

A clean design gives each environment its own zone, such as `aws.corp.example`, `azure.corp.example`, `gcp.corp.example`, `oci.corp.example` and `dc.corp.example`, and forwards each zone to the resolver that owns it. Many organisations make on-premises DNS (or a central resolver in the colocation) the hub for forwarding.

> **Watch out:** Private endpoint zones (`privatelink.*` on Azure, PSC and interface endpoint names elsewhere) must also be forwarded, or clients in other environments will resolve the public addresses.

**Build the mental model:** AWS: Route 53 Resolver inbound and outbound endpoints with forwarding rules. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Company operating on two clouds:** Consider how “dns across clouds” affects the situation: A business chooses different clouds for applications and analytics. Nonoverlapping addressing, identity boundaries, private connectivity, DNS and operational ownership become important. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For dns across clouds, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain dns across clouds to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: Choosing where workloads live

Multi-cloud adds complexity: more skills to maintain, more tools, more connections and more places for mistakes. Adopt it for a clear reason:

- **Best-of-breed services**: Oracle Database on OCI, analytics on Google Cloud, Microsoft workloads on Azure.
- **Regulation and sovereignty**: a service must stay in a country where only one provider has a region.
- **Acquisitions**: two companies already use different clouds.
- **Resilience or negotiating leverage** (harder to justify; true active-active across clouds is expensive).

Then place each workload by **data gravity** (keep compute close to its largest data), **latency to users**, **egress cost** (cross-cloud data transfer is billed as egress by the sending cloud), **compliance**, and **team skills**.

> **Tip:** Make chatty systems live in the same cloud and region. Send only summarised, infrequent traffic across clouds.

**Build the mental model:** Best-of-breed services: Oracle Database on OCI, analytics on Google Cloud, Microsoft workloads on Azure. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Company operating on two clouds:** Consider how “choosing where workloads live” affects the situation: A business chooses different clouds for applications and analytics. Nonoverlapping addressing, identity boundaries, private connectivity, DNS and operational ownership become important. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For choosing where workloads live, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain choosing where workloads live to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: Running multi-cloud as code

At this scale, networks must be managed as code and observed in one place.

- **Infrastructure as code**: Terraform with all four providers (covered in Module 20), one repository per layer (foundation, hubs, spokes), reviewed changes, and automated policy checks.
- **Central policy**: guardrails in every cloud (SCPs, Azure Policy, organization policies, OCI security zones) enforcing no public IPs on VMs, mandatory flow logs, approved regions.
- **Unified observability**: send flow logs and firewall logs from every cloud to one SIEM; monitor BGP sessions and interconnects in one dashboard.
- **Documentation as data**: the IP plan, DNS zones and connectivity matrix kept in version control (or in a tool like NetBox), never in someone's head.

> **Tip:** Write an "allowed flows" matrix (which environment may talk to which, on which ports) and implement it identically in each cloud's firewall layer. It becomes the single source of truth for audits.

**Build the mental model:** Infrastructure as code: Terraform with all four providers (covered in Module 20), one repository per layer (foundation, hubs, spokes), reviewed changes, and automated policy checks. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Company operating on two clouds:** Consider how “running multi-cloud as code” affects the situation: A business chooses different clouds for applications and analytics. Nonoverlapping addressing, identity boundaries, private connectivity, DNS and operational ownership become important. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For running multi-cloud as code, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain running multi-cloud as code to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
