# Module 12: Virtual Networks Across Clouds

**Level:** 3 · **Lessons:** 6

## A real-world thread: Private three-tier application

A retail company hosts a public storefront, private APIs and a private database. Subnet design, routes, gateways and firewall rules must permit exact flows without exposing the database.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: The virtual network

In every cloud you start by creating a private, isolated network and giving it one or more address ranges from RFC 1918. Then you divide it into **subnets**, attach **route tables**, add **gateways** for Internet or on-premises access, and apply **security rules**.

- **AWS**: **VPC** (Virtual Private Cloud). Primary CIDR between /16 and /28, plus up to four secondary CIDRs by default.
- **Azure**: **VNet** (Virtual Network). One or more address spaces; you can add more later.
- **Google Cloud**: **VPC network**. The network itself has no CIDR; each subnet has its own primary range, plus optional secondary ranges (used by GKE).
- **OCI**: **VCN** (Virtual Cloud Network). One or more CIDR blocks (/16 to /30 each).

Under the hood these are software-defined networks: there are no real switches or VLANs you can see. The provider's virtual network delivers packets between your VMs, enforces your rules and answers ARP and DHCP on behalf of the network.

> **Tip:** Before creating any network, take its range from your address plan (Module 03). Changing the range of a live network is difficult or impossible.

**Build the mental model:** AWS: VPC (Virtual Private Cloud). Primary CIDR between /16 and /28, plus up to four secondary CIDRs by default. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Private three-tier application:** Consider how “the virtual network” affects the situation: A retail company hosts a public storefront, private APIs and a private database. Subnet design, routes, gateways and firewall rules must permit exact flows without exposing the database. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For the virtual network, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain the virtual network to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: Scope differences

The biggest structural differences between providers are about *where* things live.

- **AWS**: the VPC is regional. Each **subnet lives in exactly one availability zone**. For a three-zone design you create three public and three private subnets.
- **Azure**: the VNet is regional. **Subnets span all zones** in the region; you choose the zone per VM or service, not per subnet.
- **Google Cloud**: the **VPC is global**. **Subnets are regional** and span all zones in that region. VMs in different regions of the same VPC talk over internal IPs with no peering.
- **OCI**: the VCN is regional. **Subnets are regional** (recommended) or tied to a single availability domain.

This changes how you design. On AWS, the number of subnets multiplies by the number of zones. On Azure, Google Cloud and OCI, one subnet per tier is often enough, and resilience comes from placing instances in different zones or fault domains.

> **Watch out:** On AWS, if all your private subnets route to a NAT gateway in one zone and that zone fails, every zone loses Internet access. Use one NAT gateway per zone for production.

**Build the mental model:** AWS: the VPC is regional. Each subnet lives in exactly one availability zone. For a three-zone design you create three public and three private subnets. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Private three-tier application:** Consider how “scope differences” affects the situation: A retail company hosts a public storefront, private APIs and a private database. Subnet design, routes, gateways and firewall rules must permit exact flows without exposing the database. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For scope differences, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain scope differences to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Routing in the cloud

Every virtual network automatically routes traffic between its own subnets (the **local** route). You add routes for everything else.

- **AWS**: route tables are associated with subnets. A subnet is "public" only because its route table sends `0.0.0.0/0` to an **Internet gateway**; a "private" subnet sends it to a **NAT gateway** (or has no default route).
- **Azure**: **system routes** are created automatically, including a default route to the Internet. You override them with **user-defined routes (UDRs)** in route tables attached to subnets, for example sending `0.0.0.0/0` to Azure Firewall.
- **Google Cloud**: routes belong to the VPC network, not to subnets. There is a default route to the Internet gateway, and custom static routes can apply to all instances or only to instances with a given **network tag**, with priorities.
- **OCI**: **route tables** are attached to subnets, with rules pointing to an Internet gateway, NAT gateway, service gateway, DRG or a private IP (for a firewall appliance).

```text
AWS:   private-rt: 0.0.0.0/0 → nat-gateway (in a public subnet)
Azure: UDR on subnet: 0.0.0.0/0 → Azure Firewall private IP (or attach a NAT Gateway resource to the subnet)
GCP:   VMs without external IPs + Cloud Router + Cloud NAT for the region
OCI:   private subnet route table: 0.0.0.0/0 → NAT gateway; Oracle services → service gateway
```

> **Tip:** When something can't reach a destination, read the effective routes. Azure shows them per network interface ("Effective routes"); AWS Reachability Analyzer, Google Connectivity Tests and OCI Network Path Analyzer evaluate routes for you.

**Build the mental model:** AWS: route tables are associated with subnets. A subnet is "public" only because its route table sends 0.0.0.0/0 to an Internet gateway; a "private" subnet sends it to a NAT gateway (or has no default route). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Private three-tier application:** Consider how “routing in the cloud” affects the situation: A retail company hosts a public storefront, private APIs and a private database. Subnet design, routes, gateways and firewall rules must permit exact flows without exposing the database. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For routing in the cloud, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain routing in the cloud to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: Filtering in the cloud

Each cloud filters traffic, but in different places.

- **AWS**: **security groups** on network interfaces (stateful, allow-only, can reference other security groups) and **network ACLs** on subnets (stateless, numbered allow and deny rules).
- **Azure**: **network security groups (NSGs)** with priority-ordered allow and deny rules (stateful), attached to subnets, NICs, or both. **Application security groups** let rules target VMs by role.
- **Google Cloud**: **VPC firewall rules** and **firewall policies** (stateful), applied to the network and targeting instances by tag, service account or all instances. Every VPC has implied rules: allow all egress and deny all ingress.
- **OCI**: **security lists** on subnets and **network security groups** on VNICs. Rules are stateful by default; stateless is optional.

```text
AWS:   sg-db inbound: TCP 5432 from sg-app
Azure: NSG rule: allow TCP 5432 from ASG app-servers to ASG db-servers
GCP:   firewall: allow tcp:5432 from service account app-sa to target service account db-sa
OCI:   nsg-db ingress: TCP 5432 from source NSG nsg-app
```

> **Watch out:** If both a subnet-level and an instance-level filter apply (AWS NACL + security group, Azure subnet NSG + NIC NSG, OCI security list + NSG), traffic must be allowed by **both**.

**Build the mental model:** AWS: security groups on network interfaces (stateful, allow-only, can reference other security groups) and network ACLs on subnets (stateless, numbered allow and deny rules). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Private three-tier application:** Consider how “filtering in the cloud” affects the situation: A retail company hosts a public storefront, private APIs and a private database. Subnet design, routes, gateways and firewall rules must permit exact flows without exposing the database. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For filtering in the cloud, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain filtering in the cloud to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: Public IPs and Internet exposure

A resource can only be reached from the Internet if it has a public address (or sits behind something that does, like a load balancer) **and** routing and security rules allow it.

- **AWS**: public IPv4 addresses (auto-assigned or **Elastic IPs**) on instances in subnets with an Internet gateway route. AWS charges for public IPv4 addresses.
- **Azure**: **public IP address** resources attached to NICs, load balancers or gateways. VMs without a public IP can still reach the Internet through a NAT gateway or firewall; Azure is retiring "default outbound access" for new VNets, so plan explicit egress.
- **Google Cloud**: **external IP addresses** (ephemeral or static) on VM interfaces.
- **OCI**: **public IPs** (ephemeral or reserved) on VNICs, only in **public subnets**. A subnet's public/private setting is fixed at creation.

Best practice is the same everywhere: application and database servers have **no public IPs**. Only load balancers, NAT gateways, VPN gateways and (if needed) bastions face the Internet.

> **Tip:** Use guardrail policies to block public IPs on VMs (AWS SCPs, Azure Policy, Google Cloud organization policy `compute.vmExternalIpAccess`, OCI security zones).

**Build the mental model:** AWS: public IPv4 addresses (auto-assigned or Elastic IPs) on instances in subnets with an Internet gateway route. AWS charges for public IPv4 addresses. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Private three-tier application:** Consider how “public ips and internet exposure” affects the situation: A retail company hosts a public storefront, private APIs and a private database. Subnet design, routes, gateways and firewall rules must permit exact flows without exposing the database. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For public ips and internet exposure, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain public ips and internet exposure to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: Reference design: a three-tier network

Here is one design, used for the rest of the course, mapped to each provider.

1. **Public tier**: L7 load balancer with WAF, NAT gateway(s). The only Internet-facing parts.
2. **App tier**: application servers or containers in private subnets, reachable only from the load balancer.
3. **Data tier**: managed database with a private endpoint, reachable only from the app tier.
4. **Admin access**: managed, identity-based access (Session Manager, Azure Bastion, IAP, OCI Bastion), never open SSH/RDP.
5. **Logging**: flow logs enabled on the network.

```text
              AWS                      Azure                         Google Cloud                OCI
Network       VPC                      VNet                          VPC (global)                VCN
Public tier   ALB + WAF, NAT GW/AZ     App Gateway + WAF, NAT GW     Global ALB + Cloud Armor    LB + WAF, NAT GW
App tier      private subnet per AZ    snet-app (zone-redundant)     regional subnet             private regional subnet
Data tier     RDS in private subnets   Private Endpoint to Azure SQL Cloud SQL private IP / PSC   Autonomous DB private endpoint
Filtering     SGs (+NACLs)             NSGs + ASGs                   firewall rules/policies     NSGs (+security lists)
```

> **Tip:** Draw this design for your own app before touching a console. Every deep-dive module in Level 4 builds this exact design on one provider.

**Build the mental model:** Public tier: L7 load balancer with WAF, NAT gateway(s). The only Internet-facing parts. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Private three-tier application:** Consider how “reference design: a three-tier network” affects the situation: A retail company hosts a public storefront, private APIs and a private database. Subnet design, routes, gateways and firewall rules must permit exact flows without exposing the database. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For reference design: a three-tier network, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain reference design: a three-tier network to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
