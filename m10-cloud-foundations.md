# Module 15: Cloud Foundations

**Level:** 3 · **Lessons:** 7 · **Questions:** 6

_Speak the shared language of all four providers._

## Lesson 1: Service models

Cloud services come in three broad models, depending on how much the provider manages for you.

- **IaaS** (Infrastructure as a Service): you rent virtual machines, disks and networks. You manage the operating system, patches, middleware and applications. Examples: Amazon EC2, Azure Virtual Machines, Google Compute Engine, OCI Compute.
- **PaaS** (Platform as a Service): the provider runs the platform; you deploy code or data. Examples: managed databases (Amazon RDS, Azure SQL Database, Cloud SQL, Oracle Autonomous Database), Kubernetes services, serverless functions.
- **SaaS** (Software as a Service): finished applications such as Microsoft 365 or Salesforce.

Networking skills matter most for IaaS and PaaS. Even fully managed PaaS services need networking decisions: should the database have a public endpoint or a private one inside your network? Which subnets can reach it?

> **Tip:** Prefer managed services where you can. Every server you do not run is one you do not have to patch, scale or secure at the OS level.

## Lesson 2: Shared responsibility

Security in the cloud is split between the provider and you.

The **provider** is responsible for security *of* the cloud: physical data centres, hardware, the global network, the hypervisor, and the managed parts of each service.

**You** are responsible for security *in* the cloud: who has access (identity and permissions), network rules (security groups, firewalls, public exposure), operating system patches on VMs, application code, and data protection (encryption, backups, classification).

The line moves with the service model: with IaaS you own the OS; with PaaS the provider patches the platform, but you still own access, network exposure and data. You *never* hand over responsibility for identities and data.

> **Watch out:** Most cloud security incidents are customer misconfigurations: storage buckets left public, databases with public IPs, SSH open to the world, leaked access keys. The provider's infrastructure is rarely the weak point.

## Lesson 3: Regions, zones and domains

A **region** is a geographic area with several data centres, such as AWS me-central-1 (UAE), Azure UAE North (Dubai), Google Cloud me-central1 (Doha) or OCI me-dubai-1. Choose regions for latency to users, data residency rules and service availability; not every service exists in every region.

Inside most regions are isolated failure areas:

- **AWS, Azure and Google Cloud**: **availability zones**, separate data centres with independent power, cooling and networking, connected by fast links (typically under 2 ms apart).
- **OCI**: **availability domains** (some regions have three, many have one) and, inside each, three **fault domains**, groupings of hardware that do not share single points of failure.

To survive a data-centre failure, run at least two copies of each component in different zones (or OCI fault domains / availability domains), behind a load balancer. To survive a regional disaster, replicate to a second region.

- Region = geography; zone/AD = data centre; fault domain = hardware group (OCI)
- Multi-zone for high availability; multi-region for disaster recovery

> **Tip:** Zone names are mapped per account on AWS: your "us-east-1a" may be a different physical zone from someone else's. Use zone IDs (use1-az1) when coordinating across accounts.

## Lesson 4: The four providers at a glance

All four offer the same building blocks, but each has its own philosophy.

- **AWS**: the largest catalogue and longest track record. Networks are built from many small, composable parts: VPC, subnets, route tables, gateways, Transit Gateway. Regional VPCs, subnets per zone.
- **Microsoft Azure**: deep integration with Microsoft Entra ID (identity), Windows and Microsoft 365. Strong hybrid story. Regional VNets with subnets that span zones; many services need their own dedicated subnet.
- **Google Cloud**: built on Google's private global backbone. A single **global VPC** can contain subnets in every region, and global load balancers use one anycast IP worldwide. Strong in data, analytics and Kubernetes (GKE).
- **Oracle Cloud Infrastructure (OCI)**: the natural home for Oracle Database and Exadata, with flat, predictable pricing and generous outbound data allowance. Regional VCNs with the Dynamic Routing Gateway as the hub.

> **In the cloud:** Use the Cloud Rosetta tab to translate service names between the four. The concepts are the same; the names and limits differ.

## Lesson 5: The cost of networking

Networking has its own line on the cloud bill, and it surprises many teams.

- **Ingress** (data coming into the cloud from the Internet) is usually free.
- **Egress** (data going out to the Internet) is charged per GB on AWS, Azure and Google Cloud after a small free allowance. OCI includes 10 TB of outbound data per month free, which is much more generous.
- **Cross-zone** traffic is charged on some providers (for example, AWS charges for data between availability zones).
- **Cross-region** and inter-continental traffic costs more.
- **Managed network services** charge per hour and per GB: NAT gateways, load balancers, VPN gateways, Transit Gateway attachments, private endpoints, firewalls.

Design habits that save money: keep chatty services in the same zone where resilience allows; use private endpoints or gateway endpoints for storage instead of routing through NAT; put a CDN in front of public content; and delete idle NAT gateways and load balancers in test environments.

> **Watch out:** A NAT gateway left running in a lab costs money every hour even with no traffic. Always tear lab resources down.

## Lesson 6: Landing zones and resource organisation

Before building networks, decide how cloud resources are organised. This boundary controls billing, permissions, policy and blast radius.

- **AWS**: **AWS Organizations** with many **accounts** (one per workload and environment), grouped into organizational units. **Service control policies (SCPs)** set guardrails. AWS Control Tower sets up a standard multi-account landing zone.
- **Azure**: **management groups** → **subscriptions** → **resource groups**. **Azure Policy** enforces rules. The Azure landing zone reference architecture is the standard pattern.
- **Google Cloud**: **organization** → **folders** → **projects**. **Organization policies** set constraints.
- **OCI**: a **tenancy** containing nested **compartments**. IAM policies are written against compartments.

A **landing zone** is a pre-built, secure starting environment: account/subscription structure, identity, logging, central networking (hub), and guardrails. Networking teams typically own a shared "network" or "connectivity" account/subscription/project with the hub, VPN and private links.

> **Tip:** Never put production and development in the same account, subscription or project. Separate boundaries make permissions, costs and incidents far easier to manage.

## Lesson 7: Real-world scenario: the surprise network bill

**Situation.** A company's first month on the cloud ends with a network bill three times the estimate. Compute and storage costs were as expected.

**Investigation (using the billing breakdown and flow logs).**

1. **NAT gateway data processing** is the biggest item: application servers in private subnets download container images and read terabytes from object storage *through the NAT gateway*.
2. **Cross-zone data transfer**: the app tier in zone A talks constantly to a cache cluster in zone B.
3. **Internet egress**: users download large reports directly from the servers, with no CDN.
4. Two forgotten test environments, each with its own NAT gateway and load balancer, run 24/7.

**Fix.**

1. Add a storage gateway endpoint (free) and private endpoints for the container registry, removing most NAT traffic.
2. Use zone-aware routing so app servers prefer the cache node in their own zone.
3. Serve reports through a CDN and object storage with signed URLs.
4. Schedule test environments to shut down at night and delete unused NAT gateways and load balancers.

The next month's network bill fell by about 70%.

**Lessons learned.** Network costs follow the path data takes. Draw the data paths, check which ones cross NAT, zones, regions or the Internet, and design to keep heavy flows local and private.

## Key takeaways

- You are always responsible for your network rules, identities and data.
- Spread workloads across zones (or OCI fault domains) for resilience.
- Data leaving the cloud, a zone or a region costs money; design for it.
- Organise accounts, subscriptions, projects or compartments before building networks.

## Checkpoint

**Q1. In the shared responsibility model, who configures security group rules?**

A. The provider
B. The customer  ✓
C. Both equally
D. The ISP

_Everything you configure is your responsibility._

**Q2. Which traffic is usually free?**

A. Internet egress
B. Cross-region
C. Inbound from the Internet  ✓
D. NAT processing

_Ingress is generally free; egress and processing are billed._

**Q3. On OCI, what is the hardware grouping inside an availability domain that you spread instances across?**

A. Zone
B. Rack set
C. Fault domain  ✓
D. Compartment

_Each OCI availability domain has three fault domains._

**Q4. Which provider's VPC can contain subnets in every region by default?**

A. AWS
B. Azure
C. Google Cloud  ✓
D. OCI

_Google Cloud VPCs are global resources with regional subnets._

**Q5. Which is the best way to protect production from mistakes made in development?**

A. Use different subnets in the same account
B. Use naming conventions
C. Use separate accounts, subscriptions or projects  ✓
D. Use different regions

_Separate top-level boundaries isolate permissions, policies, billing and blast radius._

**Q6. Which change usually removes the most NAT gateway cost for workloads reading object storage?**

A. Bigger instances
B. A storage gateway or private endpoint so traffic bypasses NAT  ✓
C. A second NAT gateway
D. A longer DNS TTL

_Endpoints keep storage traffic off the NAT gateway and its per-GB charge._

## Official reading

- [AWS shared responsibility model](https://aws.amazon.com/compliance/shared-responsibility-model/)
- [Azure: shared responsibility in the cloud](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility)
- [Google Cloud: geography and regions](https://cloud.google.com/docs/geography-and-regions)
- [OCI: regions and availability domains](https://docs.oracle.com/en-us/iaas/Content/General/Concepts/regions.htm)
