# Module 10: Cloud Foundations

**Level:** 3 · **Lessons:** 6

## A real-world thread: Migrating an on-premise application

A firm wants to move a three-tier application to cloud infrastructure. Responsibility, region selection, data residency, service models and recurring network charges change the design.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: Service models

Cloud services come in three broad models, depending on how much the provider manages for you.

- **IaaS** (Infrastructure as a Service): you rent virtual machines, disks and networks. You manage the operating system, patches, middleware and applications. Examples: Amazon EC2, Azure Virtual Machines, Google Compute Engine, OCI Compute.
- **PaaS** (Platform as a Service): the provider runs the platform; you deploy code or data. Examples: managed databases (Amazon RDS, Azure SQL Database, Cloud SQL, Oracle Autonomous Database), Kubernetes services, serverless functions.
- **SaaS** (Software as a Service): finished applications such as Microsoft 365 or Salesforce.

Networking skills matter most for IaaS and PaaS. Even fully managed PaaS services need networking decisions: should the database have a public endpoint or a private one inside your network? Which subnets can reach it?

> **Tip:** Prefer managed services where you can. Every server you do not run is one you do not have to patch, scale or secure at the OS level.

**Build the mental model:** IaaS (Infrastructure as a Service): you rent virtual machines, disks and networks. You manage the operating system, patches, middleware and applications. Examples: Amazon EC2, Azure Virtual Machines, Google Compute Engin. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Migrating an on-premise application:** Consider how “service models” affects the situation: A firm wants to move a three-tier application to cloud infrastructure. Responsibility, region selection, data residency, service models and recurring network charges change the design. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For service models, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain service models to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: Shared responsibility

Security in the cloud is split between the provider and you.

The **provider** is responsible for security *of* the cloud: physical data centres, hardware, the global network, the hypervisor, and the managed parts of each service.

**You** are responsible for security *in* the cloud: who has access (identity and permissions), network rules (security groups, firewalls, public exposure), operating system patches on VMs, application code, and data protection (encryption, backups, classification).

The line moves with the service model: with IaaS you own the OS; with PaaS the provider patches the platform, but you still own access, network exposure and data. You *never* hand over responsibility for identities and data.

> **Watch out:** Most cloud security incidents are customer misconfigurations: storage buckets left public, databases with public IPs, SSH open to the world, leaked access keys. The provider's infrastructure is rarely the weak point.

**Build the mental model:** Security in the cloud is split between the provider and you. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Migrating an on-premise application:** Consider how “shared responsibility” affects the situation: A firm wants to move a three-tier application to cloud infrastructure. Responsibility, region selection, data residency, service models and recurring network charges change the design. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For shared responsibility, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain shared responsibility to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Regions, zones and domains

A **region** is a geographic area with several data centres, such as AWS me-central-1 (UAE), Azure UAE North (Dubai), Google Cloud me-central1 (Doha) or OCI me-dubai-1. Choose regions for latency to users, data residency rules and service availability; not every service exists in every region.

Inside most regions are isolated failure areas:

- **AWS, Azure and Google Cloud**: **availability zones**, separate data centres with independent power, cooling and networking, connected by fast links (typically under 2 ms apart).
- **OCI**: **availability domains** (some regions have three, many have one) and, inside each, three **fault domains**, groupings of hardware that do not share single points of failure.

To survive a data-centre failure, run at least two copies of each component in different zones (or OCI fault domains / availability domains), behind a load balancer. To survive a regional disaster, replicate to a second region.

- Region = geography; zone/AD = data centre; fault domain = hardware group (OCI)
- Multi-zone for high availability; multi-region for disaster recovery

> **Tip:** Zone names are mapped per account on AWS: your "us-east-1a" may be a different physical zone from someone else's. Use zone IDs (use1-az1) when coordinating across accounts.

**Build the mental model:** AWS, Azure and Google Cloud: availability zones, separate data centres with independent power, cooling and networking, connected by fast links (typically under 2 ms apart). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Migrating an on-premise application:** Consider how “regions, zones and domains” affects the situation: A firm wants to move a three-tier application to cloud infrastructure. Responsibility, region selection, data residency, service models and recurring network charges change the design. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For regions, zones and domains, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain regions, zones and domains to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: The four providers at a glance

All four offer the same building blocks, but each has its own philosophy.

- **AWS**: the largest catalogue and longest track record. Networks are built from many small, composable parts: VPC, subnets, route tables, gateways, Transit Gateway. Regional VPCs, subnets per zone.
- **Microsoft Azure**: deep integration with Microsoft Entra ID (identity), Windows and Microsoft 365. Strong hybrid story. Regional VNets with subnets that span zones; many services need their own dedicated subnet.
- **Google Cloud**: built on Google's private global backbone. A single **global VPC** can contain subnets in every region, and global load balancers use one anycast IP worldwide. Strong in data, analytics and Kubernetes (GKE).
- **Oracle Cloud Infrastructure (OCI)**: the natural home for Oracle Database and Exadata, with flat, predictable pricing and generous outbound data allowance. Regional VCNs with the Dynamic Routing Gateway as the hub.

> **In the cloud:** Use the Cloud Rosetta tab to translate service names between the four. The concepts are the same; the names and limits differ.

**Build the mental model:** AWS: the largest catalogue and longest track record. Networks are built from many small, composable parts: VPC, subnets, route tables, gateways, Transit Gateway. Regional VPCs, subnets per zone. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Migrating an on-premise application:** Consider how “the four providers at a glance” affects the situation: A firm wants to move a three-tier application to cloud infrastructure. Responsibility, region selection, data residency, service models and recurring network charges change the design. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For the four providers at a glance, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain the four providers at a glance to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: The cost of networking

Networking has its own line on the cloud bill, and it surprises many teams.

- **Ingress** (data coming into the cloud from the Internet) is usually free.
- **Egress** (data going out to the Internet) is charged per GB on AWS, Azure and Google Cloud after a small free allowance. OCI includes 10 TB of outbound data per month free, which is much more generous.
- **Cross-zone** traffic is charged on some providers (for example, AWS charges for data between availability zones).
- **Cross-region** and inter-continental traffic costs more.
- **Managed network services** charge per hour and per GB: NAT gateways, load balancers, VPN gateways, Transit Gateway attachments, private endpoints, firewalls.

Design habits that save money: keep chatty services in the same zone where resilience allows; use private endpoints or gateway endpoints for storage instead of routing through NAT; put a CDN in front of public content; and delete idle NAT gateways and load balancers in test environments.

> **Watch out:** A NAT gateway left running in a lab costs money every hour even with no traffic. Always tear lab resources down.

**Build the mental model:** Ingress (data coming into the cloud from the Internet) is usually free. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Migrating an on-premise application:** Consider how “the cost of networking” affects the situation: A firm wants to move a three-tier application to cloud infrastructure. Responsibility, region selection, data residency, service models and recurring network charges change the design. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For the cost of networking, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain the cost of networking to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: Landing zones and resource organisation

Before building networks, decide how cloud resources are organised. This boundary controls billing, permissions, policy and blast radius.

- **AWS**: **AWS Organizations** with many **accounts** (one per workload and environment), grouped into organizational units. **Service control policies (SCPs)** set guardrails. AWS Control Tower sets up a standard multi-account landing zone.
- **Azure**: **management groups** → **subscriptions** → **resource groups**. **Azure Policy** enforces rules. The Azure landing zone reference architecture is the standard pattern.
- **Google Cloud**: **organization** → **folders** → **projects**. **Organization policies** set constraints.
- **OCI**: a **tenancy** containing nested **compartments**. IAM policies are written against compartments.

A **landing zone** is a pre-built, secure starting environment: account/subscription structure, identity, logging, central networking (hub), and guardrails. Networking teams typically own a shared "network" or "connectivity" account/subscription/project with the hub, VPN and private links.

> **Tip:** Never put production and development in the same account, subscription or project. Separate boundaries make permissions, costs and incidents far easier to manage.

**Build the mental model:** AWS: AWS Organizations with many accounts (one per workload and environment), grouped into organizational units. Service control policies (SCPs) set guardrails. AWS Control Tower sets up a standard multi-account landing. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Migrating an on-premise application:** Consider how “landing zones and resource organisation” affects the situation: A firm wants to move a three-tier application to cloud infrastructure. Responsibility, region selection, data residency, service models and recurring network charges change the design. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For landing zones and resource organisation, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain landing zones and resource organisation to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
