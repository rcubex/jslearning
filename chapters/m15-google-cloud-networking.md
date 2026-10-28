# Module 15: Google Cloud Networking

**Level:** 4 · **Lessons:** 8

## A real-world thread: Global Google Cloud deployment

An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: The global VPC

A Google Cloud **VPC network** is a **global** resource. **Subnets** are regional, and each has a primary IPv4 range and optional **secondary ranges** (used for GKE Pods and Services). VMs in any region of the same VPC communicate over internal IPs across Google's private backbone, with no peering or VPN.

VPCs come in two modes. **Auto mode** creates a /20 subnet in every region from 10.128.0.0/9; convenient for labs but it will overlap with other auto-mode VPCs and wastes space. **Custom mode** lets you create exactly the subnets you need. Use custom mode for anything real; the `default` network in new projects is auto mode, so delete it.

```text
gcloud compute networks create vpc-prod --subnet-mode=custom
gcloud compute networks subnets create snet-me-central1 --network=vpc-prod \
  --region=me-central1 --range=10.30.0.0/20 \
  --secondary-range=pods=10.31.0.0/16,services=10.32.0.0/20 \
  --enable-private-ip-google-access
gcloud compute networks subnets create snet-europe-west1 --network=vpc-prod \
  --region=europe-west1 --range=10.30.16.0/20
```

Google Cloud also offers two **network service tiers**: **Premium** (traffic enters and leaves Google's network close to the user; required for global load balancing) and **Standard** (traffic uses the public Internet more; cheaper, regional only).

> **Tip:** You can expand a subnet's primary range later (for example /20 → /19) without downtime, but you can't shrink it. Start reasonably and grow.

**Build the mental model:** A Google Cloud **VPC network** is a **global** resource. **Subnets** are regional, and each has a primary IPv4 range and optional **secondary ranges** (used for GKE Pods and Services). VMs in any region of the same VPC c. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Global Google Cloud deployment:** Consider how “the global vpc” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For the global vpc, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain the global vpc to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: Firewall rules and policies

Google Cloud's distributed firewall (**Cloud NGFW**) is stateful and enforced at each VM. Every VPC has two **implied rules**: allow all egress, and deny all ingress (priority 65535).

Rules have a **priority** (0–65535, lower wins; default 1000), a direction, an action, a source or destination, protocols and ports, and a **target**:

- **All instances** in the network
- **Network tags** (free-text labels on VMs; anyone who can edit the VM can change them)
- **Service accounts** (stronger, because changing a VM's service account needs IAM permission)
- **Secure tags** (IAM-governed tags, usable in firewall policies)

There are several layers, evaluated in order: **hierarchical firewall policies** (at organization and folder level, set by the security team), **global and regional network firewall policies** (attached to a VPC), then **VPC firewall rules**. Cloud NGFW **Enterprise** adds intrusion prevention (IPS) and TLS inspection.

```text
gcloud compute firewall-rules create allow-hc-and-web --network=vpc-prod \
  --direction=INGRESS --action=ALLOW --rules=tcp:443,tcp:8080 \
  --source-ranges=35.191.0.0/16,130.211.0.0/22 \
  --target-service-accounts=web-sa@my-proj.iam.gserviceaccount.com
```

> **Tip:** Use **Firewall Insights** to find shadowed, unused and overly permissive rules, and enable **firewall rules logging** on the rules you need to audit.

**Build the mental model:** All instances in the network. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Global Google Cloud deployment:** Consider how “firewall rules and policies” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For firewall rules and policies, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain firewall rules and policies to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Shared VPC, peering and Network Connectivity Center

**Shared VPC** lets a **host project** own the VPC while **service projects** deploy VMs, GKE clusters and serverless connectors into its subnets. The network team keeps control of subnets, routes and firewalls; app teams get `roles/compute.networkUser` on chosen subnets. This is Google's recommended pattern for organisations.

**VPC Network Peering** connects two VPCs (in any projects or organisations) with internal IP connectivity. It is **non-transitive** and the ranges must not overlap. Each side controls whether it imports and exports custom routes.

**Network Connectivity Center (NCC)** is a hub-and-spoke service. **VPC spokes** connect many VPCs through a central hub with full mesh or star topologies, and **hybrid spokes** (HA VPN tunnels, Interconnect attachments, router appliances) can use Google's backbone to connect your sites to each other.

> **Tip:** A common enterprise layout: one Shared VPC host project per environment (prod, non-prod), each with regional subnets, connected to on-premises with Interconnect, and NCC when you need many VPCs to talk.

**Build the mental model:** **Shared VPC** lets a **host project** own the VPC while **service projects** deploy VMs, GKE clusters and serverless connectors into its subnets. The network team keeps control of subnets, routes and firewalls; app team. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Global Google Cloud deployment:** Consider how “shared vpc, peering and network connectivity center” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For shared vpc, peering and network connectivity center, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain shared vpc, peering and network connectivity center to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: Cloud Router and Cloud NAT

**Cloud Router** is a managed BGP speaker. It exchanges routes with your on-premises routers over HA VPN and Interconnect, and advertises your VPC subnets automatically (or custom ranges you choose). The VPC's **dynamic routing mode** decides whether learned routes apply only in the Cloud Router's region (**regional**) or in all regions (**global**).

**Cloud NAT** gives VMs without external IPs outbound Internet access. It is not a VM or appliance: it is software-defined and configured on a Cloud Router, per region. You choose which subnets use it and whether it uses automatically allocated or reserved external IPs. **Dynamic port allocation** helps busy VMs avoid port exhaustion. **Private NAT** translates between overlapping private ranges (for example, between VPCs connected via NCC).

```text
gcloud compute routers create cr-me-central1 --network=vpc-prod --region=me-central1
gcloud compute routers nats create nat-me-central1 --router=cr-me-central1 \
  --region=me-central1 --auto-allocate-nat-external-ips \
  --nat-all-subnet-ip-ranges --enable-dynamic-port-allocation
```

> **Watch out:** Cloud NAT does not handle inbound connections. VMs behind it remain unreachable from the Internet, which is usually what you want.

**Build the mental model:** **Cloud Router** is a managed BGP speaker. It exchanges routes with your on-premises routers over HA VPN and Interconnect, and advertises your VPC subnets automatically (or custom ranges you choose). The VPC's **dynamic. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Global Google Cloud deployment:** Consider how “cloud router and cloud nat” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For cloud router and cloud nat, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain cloud router and cloud nat to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: Private Google Access and Private Service Connect

**Private Google Access** (a per-subnet setting) lets VMs without external IPs reach Google APIs such as Cloud Storage and BigQuery. Combine it with the special domains `private.googleapis.com` (199.36.153.8/30) or `restricted.googleapis.com` (199.36.153.4/30, for use with VPC Service Controls), and DNS that points `*.googleapis.com` at them.

**Private Service Connect (PSC)** creates **endpoints** with internal IPs in your VPC:

- PSC endpoints for **Google APIs** (an internal IP for all supported APIs)
- PSC endpoints for **published services**: services from other VPCs, other organisations or Google-managed services (such as Cloud SQL, AlloyDB, Vertex AI). Producers publish a **service attachment**, consumers create an endpoint. Address ranges can overlap.

**VPC Service Controls** adds a security perimeter around Google-managed services to stop data exfiltration, even by someone with valid credentials.

> **Tip:** For Cloud SQL and other managed databases, choose a private IP (via PSC or private services access) and disable the public IP.

**Build the mental model:** PSC endpoints for Google APIs (an internal IP for all supported APIs). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Global Google Cloud deployment:** Consider how “private google access and private service connect” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For private google access and private service connect, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain private google access and private service connect to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: Load balancing, Cloud CDN and Cloud Armor

Google Cloud load balancers are software-defined and many are **global**:

- **Application Load Balancers** (L7, HTTP/HTTPS): **global external** (one anycast IP worldwide, routing users to the nearest healthy backend in any region), regional external, regional internal and cross-region internal.
- **Proxy Network Load Balancers** (L4 TCP proxy, with optional SSL offload): global or regional.
- **Passthrough Network Load Balancers** (L4, TCP/UDP/ESP/ICMP): regional, preserve client IPs, backends see the original packets.

Backends are **instance groups**, **network endpoint groups (NEGs)** for containers, serverless (Cloud Run) or Internet backends.

**Cloud CDN** caches content at Google's edge for global external Application Load Balancers. **Cloud Armor** adds WAF rules (preconfigured OWASP rules), rate limiting, geo-blocking, bot management and DDoS protection, attached as security policies to backend services.

> **Tip:** A single global external Application Load Balancer with backends in two regions gives you multi-region failover with one IP address and one TLS certificate, without DNS tricks.

**Build the mental model:** Application Load Balancers (L7, HTTP/HTTPS): global external (one anycast IP worldwide, routing users to the nearest healthy backend in any region), regional external, regional internal and cross-region internal. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Global Google Cloud deployment:** Consider how “load balancing, cloud cdn and cloud armor” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For load balancing, cloud cdn and cloud armor, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain load balancing, cloud cdn and cloud armor to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 7: Hybrid connectivity on Google Cloud

**Cloud VPN** connects through IPsec:

- **HA VPN**: a gateway with two interfaces (two public IPs). With two tunnels to your peer devices and BGP via Cloud Router, it offers a **99.99% SLA**. This is the recommended option.
- **Classic VPN**: a single interface, 99.9% SLA, mostly legacy.

**Cloud Interconnect** provides private connections:

- **Dedicated Interconnect**: your own 10 Gbps or 100 Gbps circuits in a Google colocation facility.
- **Partner Interconnect**: through a service provider, from 50 Mbps to 50 Gbps.
- **Cross-Cloud Interconnect**: dedicated links from Google Cloud to other clouds (AWS, Azure, OCI, Alibaba).

**VLAN attachments** connect an Interconnect to a Cloud Router in a region. For 99.99% availability Google requires connections in two metropolitan areas with four connections in total; 99.9% needs two connections in one metro, in different edge availability domains.

> **Tip:** HA VPN over Interconnect lets you encrypt traffic across a private Interconnect when compliance requires it.

**Build the mental model:** HA VPN: a gateway with two interfaces (two public IPs). With two tunnels to your peer devices and BGP via Cloud Router, it offers a 99.99% SLA. This is the recommended option. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Global Google Cloud deployment:** Consider how “hybrid connectivity on google cloud” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For hybrid connectivity on google cloud, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain hybrid connectivity on google cloud to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 8: Operating and troubleshooting Google Cloud networks

**Network Intelligence Center** groups the analysis tools:

- **Connectivity Tests**: static analysis of a path between two endpoints (VMs, IPs, load balancers, Cloud SQL), showing which route or firewall rule allows or drops it, plus an optional live data-plane check.
- **Network Topology**: a live map of your VPCs, regions and traffic.
- **Performance Dashboard**: packet loss and latency between zones and regions.
- **Firewall Insights**: shadowed, unused and overly broad rules.
- **Network Analyzer**: automatic detection of misconfigurations such as IP exhaustion or invalid routes.

Logging: **VPC Flow Logs** (sampled flow records per subnet), **firewall rules logging**, **Cloud NAT logging**, and **Packet Mirroring** to send copies of traffic to an inspection tool.

```text
gcloud network-management connectivity-tests create app-to-db \
  --source-instance=projects/p/zones/me-central1-a/instances/app-1 \
  --destination-ip-address=10.30.4.5 --destination-port=5432 --protocol=TCP
gcloud network-management connectivity-tests describe app-to-db
```

> **Tip:** Connectivity Tests understand GKE, Cloud SQL, load balancers and hybrid routes. Run one before guessing.

**Build the mental model:** Connectivity Tests: static analysis of a path between two endpoints (VMs, IPs, load balancers, Cloud SQL), showing which route or firewall rule allows or drops it, plus an optional live data-plane check. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Global Google Cloud deployment:** Consider how “operating and troubleshooting google cloud networks” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For operating and troubleshooting google cloud networks, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain operating and troubleshooting google cloud networks to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
