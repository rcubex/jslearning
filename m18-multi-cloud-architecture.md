# Module 26: Multi-Cloud Architecture

**Level:** 5 · **Lessons:** 7 · **Questions:** 6

_Plan addresses, topology and DNS across four clouds and on-premises._

## Lesson 1: IP address management (IPAM)

In a multi-cloud estate, address overlaps are the most expensive mistake. Two networks with the same range cannot be routed to each other without NAT, which complicates everything that follows.

Build one hierarchical plan and allocate from it:

**A multi-cloud address plan inside 10.0.0.0/8**

```
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

## Lesson 2: Topologies

Choose a topology inside each cloud, then connect the clouds.

Inside a cloud, the standard is **hub-and-spoke**: workload networks (spokes) connect to a hub that holds shared services, firewalls and the hybrid links. Each provider has a native hub: **AWS Transit Gateway / Cloud WAN**, **Azure hub VNet or Virtual WAN**, **Google NCC or Shared VPC**, **OCI DRG**.

Between clouds and on-premises, common shapes are:

- **On-premises as the hub**: every cloud connects back to the data centre. Simple, but cloud-to-cloud traffic hairpins through the data centre.
- **Colocation as the hub**: routers in a colocation facility connect to all clouds and to on-premises. Short paths and one place for policy.
- **Direct cloud-to-cloud**: provider interconnects such as Oracle Interconnect for Azure and for Google Cloud, or Google Cross-Cloud Interconnect. Lowest latency for heavy flows between two clouds.
- **Cloud VPN mesh**: IPsec between cloud VPN gateways. Quick and cheap, limited throughput.

> **Tip:** Segment consistently everywhere. If "prod" and "dev" are separate route domains in AWS Transit Gateway, keep them separate in Azure, Google Cloud and OCI too, and across the interconnects.

## Lesson 3: Connecting the clouds

For each pair of clouds that must talk, weigh bandwidth, latency, cost and effort:

- **VPN between cloud gateways** (for example, AWS Site-to-Site VPN to Azure VPN Gateway, or Google HA VPN to AWS). Set up in an hour, encrypted, but limited per tunnel and crosses the Internet.
- **Private links meeting in colocation**: Direct Connect, ExpressRoute, Interconnect and FastConnect all land on your routers, which route between them. High bandwidth, predictable, but you operate the routers.
- **Provider-to-provider interconnects**: Oracle Interconnect for Microsoft Azure and for Google Cloud link specific region pairs directly with sub-2 ms latency in many locations. Google Cross-Cloud Interconnect provides dedicated physical links from Google to AWS, Azure, OCI and Alibaba Cloud.
- **Partner network-as-a-service**: Equinix Fabric, Megaport and similar let you create virtual circuits between clouds in minutes from a portal.

> **In the cloud:** A typical example is an application on Azure using Oracle Database on OCI over the Oracle–Azure interconnect, or Oracle Database@Azure, which runs Oracle's database service inside Azure data centres.

## Lesson 4: DNS across clouds

Every cloud has its own private DNS, and each one only answers for its own zones by default. A multi-cloud design must let every environment resolve names in every other.

The building blocks are the same in each cloud: an **inbound** endpoint (others can send queries in) and an **outbound** endpoint with **forwarding rules** (send queries for other zones out):

- **AWS**: Route 53 Resolver inbound and outbound endpoints with forwarding rules
- **Azure**: DNS Private Resolver inbound and outbound endpoints with forwarding rulesets
- **Google Cloud**: Cloud DNS inbound server policies and forwarding zones
- **OCI**: private DNS resolver with listening and forwarding endpoints

A clean design gives each environment its own zone, such as `aws.corp.example`, `azure.corp.example`, `gcp.corp.example`, `oci.corp.example` and `dc.corp.example`, and forwards each zone to the resolver that owns it. Many organisations make on-premises DNS (or a central resolver in the colocation) the hub for forwarding.

> **Watch out:** Private endpoint zones (`privatelink.*` on Azure, PSC and interface endpoint names elsewhere) must also be forwarded, or clients in other environments will resolve the public addresses.

## Lesson 5: Choosing where workloads live

Multi-cloud adds complexity: more skills to maintain, more tools, more connections and more places for mistakes. Adopt it for a clear reason:

- **Best-of-breed services**: Oracle Database on OCI, analytics on Google Cloud, Microsoft workloads on Azure.
- **Regulation and sovereignty**: a service must stay in a country where only one provider has a region.
- **Acquisitions**: two companies already use different clouds.
- **Resilience or negotiating leverage** (harder to justify; true active-active across clouds is expensive).

Then place each workload by **data gravity** (keep compute close to its largest data), **latency to users**, **egress cost** (cross-cloud data transfer is billed as egress by the sending cloud), **compliance**, and **team skills**.

> **Tip:** Make chatty systems live in the same cloud and region. Send only summarised, infrequent traffic across clouds.

## Lesson 6: Running multi-cloud as code

At this scale, networks must be managed as code and observed in one place.

- **Infrastructure as code**: Terraform with all four providers (covered in Module 20), one repository per layer (foundation, hubs, spokes), reviewed changes, and automated policy checks.
- **Central policy**: guardrails in every cloud (SCPs, Azure Policy, organization policies, OCI security zones) enforcing no public IPs on VMs, mandatory flow logs, approved regions.
- **Unified observability**: send flow logs and firewall logs from every cloud to one SIEM; monitor BGP sessions and interconnects in one dashboard.
- **Documentation as data**: the IP plan, DNS zones and connectivity matrix kept in version control (or in a tool like NetBox), never in someone's head.

> **Tip:** Write an "allowed flows" matrix (which environment may talk to which, on which ports) and implement it identically in each cloud's firewall layer. It becomes the single source of truth for audits.

## Lesson 7: Real-world scenario: "Let's be multi-cloud for resilience"

**Situation.** After a widely reported cloud outage, a company's board asks the IT team to make the main customer application "multi-cloud active-active" across two providers within six months.

**Analysis the network architect presents.**

1. **Data**: the application uses a relational database with strong consistency. Active-active writes across two clouds would need either a distributed database that supports both clouds, or a single writer with cross-cloud replication (which is active-passive for writes).
2. **Network**: cross-cloud links (interconnects or VPN) add latency (5–30 ms or more) and cost per GB; every cross-cloud call slows user requests.
3. **Operations**: two sets of IAM, networking, security tooling and on-call skills.
4. **Actual risk**: most outages the company experienced were caused by its own deployments and configuration, not provider outages. Multi-region within one provider already covers regional failures.

**Recommendation adopted.**

1. Phase 1: **multi-region active-passive** on the current provider (secondary region, data replication, tested failover); fix deployment practices (progressive rollouts, automated rollback).
2. Phase 2: **multi-cloud for specific risks**: DNS hosted on two providers, backups replicated to a second cloud, and a documented "cold" recovery plan in the second cloud.
3. Revisit full multi-cloud active-active only if regulation or customer contracts require it.

**Lessons learned.** Multi-cloud is a means, not a goal. Match the architecture to the real risks, and remember that data and operations, not networking alone, decide what's feasible.

## Key takeaways

- One address plan for everything; no overlaps, room to grow.
- Use each cloud's native transit hub, then connect hubs to each other and to on-premises.
- DNS must be designed across clouds as carefully as routing.
- Only go multi-cloud for a clear reason, and design for egress costs.

## Checkpoint

**Q1. What breaks peering and hybrid routing most often in multi-cloud?**

A. Too many subnets
B. Overlapping CIDR ranges  ✓
C. Using IPv6
D. Using BGP

_Overlapping ranges cannot be routed between._

**Q2. What lets each cloud resolve private names hosted in another cloud?**

A. A NAT gateway
B. Conditional DNS forwarding  ✓
C. VPC peering
D. A CDN

_Resolver endpoints forward specific zones to the cloud that hosts them._

**Q3. Which is a direct private interconnect between two different cloud providers?**

A. AWS Transit Gateway
B. Oracle Interconnect for Microsoft Azure  ✓
C. Azure Virtual WAN
D. Google Shared VPC

_Oracle and Microsoft link paired OCI and Azure regions directly._

**Q4. Why give each cloud region one large, summarisable address block?**

A. It is required by all providers
B. Other networks then need only one route per region, keeping routing simple  ✓
C. It makes IPv6 unnecessary
D. It reduces egress cost

_Summarisable blocks keep route tables small and stay under BGP prefix limits._

**Q5. Which factor is "data gravity" about?**

A. The weight of servers
B. Keeping compute close to where its largest datasets live  ✓
C. The number of regions
D. DNS TTLs

_Moving large data is slow and costly, so applications are best placed next to it._

**Q6. What usually makes cross-cloud active-active hardest?**

A. Lack of BGP support
B. Keeping strongly consistent data writable in both clouds  ✓
C. DNS limits
D. IPv6 support

_Networking can be solved; consistent multi-writer data across clouds is the hard part._

## Official reading

- [Google Cloud: hybrid and multi-cloud patterns](https://cloud.google.com/architecture/hybrid-multicloud-patterns-and-practices)
- [AWS: building a scalable multi-VPC network](https://docs.aws.amazon.com/whitepapers/latest/building-scalable-secure-multi-vpc-network-infrastructure/welcome.html)
- [Azure landing zone network topology](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/define-an-azure-network-topology)
- [OCI and Azure interconnect](https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/azure.htm)
