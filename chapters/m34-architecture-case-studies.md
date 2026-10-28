# Module 34: Architecture Case Studies

**Level:** 5 · **Lessons:** 7 · **Questions:** 5

_Apply everything in the course to complete, realistic designs and justify each decision._

## Lesson 1: How to approach a design

Every case study in this module follows the same method. Use it for real projects and interviews.

1. **Requirements**: what must the system do? Users, locations, traffic volumes, protocols.
2. **Non-functional requirements**: availability (for example 99.95%), **RTO** (how fast to recover) and **RPO** (how much data loss is acceptable), latency, security and compliance, budget.
3. **Constraints**: existing data centres, contracts, skills, regulations, mandated providers.
4. **High-level design**: topology, regions, entry points, connectivity, segmentation, DNS.
5. **Decisions and trade-offs**: for each major choice, what alternatives you rejected and why.
6. **Operations**: monitoring, logging, change process, failure scenarios and how recovery works.

**A one-line decision record**

```
Decision: Use Transit Gateway instead of VPC peering.
Because: 35 VPCs today, 80 planned; peering mesh would need thousands of routes.
Trade-off: per-attachment and per-GB cost; acceptable for central inspection and simpler operations.
```

> **Tip:** In interviews, talk through the method out loud. Interviewers care more about how you reason through trade-offs than about naming every service.

## Lesson 2: Case 1: Global e-commerce on AWS

**Requirements.** An online retailer serves customers in the Gulf, Europe and India. Target: 99.95% availability, p95 page load under 1.5 s worldwide, PCI DSS for card payments, flash sales with 30× traffic spikes.

**Design.**

- **Regions**: primary in me-central-1 (UAE), secondary in eu-central-1, active-active for the stateless web and API tiers; the order database uses Aurora Global Database with the writer in the UAE and a promotable replica in Europe (RPO about 1 second, RTO a few minutes).
- **Edge**: CloudFront with AWS WAF (managed rules, rate limits, bot control), Shield Advanced, static assets from S3 with Origin Access Control, dynamic requests to regional ALBs. Route 53 latency routing with health checks for regional failover.
- **Network per region**: VPC across three AZs: public subnets (ALB, NAT gateways), app subnets (ECS on Fargate), data subnets (Aurora, ElastiCache). Gateway endpoint for S3; interface endpoints for ECR, Secrets Manager and CloudWatch.
- **PCI segmentation**: the payment service runs in a separate account and VPC; the only path in is through a PrivateLink endpoint service from the checkout service. Network Firewall filters its egress to the payment processor's domains only.
- **Connectivity**: Transit Gateway per region for shared services and future VPCs; inter-region TGW peering.
- **Operations**: VPC Flow Logs and WAF logs to a central log account; CloudWatch alarms on ALB 5xx, target latency and NAT errors; load tests before every sale.

**Trade-offs.** Active-active for stateless tiers doubles compute cost but gives fast failover; keeping a single database writer avoids complex conflict resolution at the price of a few minutes of RTO for writes.

> **Tip:** PCI scope shrinks dramatically when card data flows only through an isolated, PrivateLink-reached service. Segmentation is a compliance tool as much as a security one.

## Lesson 3: Case 2: Regulated bank, hybrid on Azure

**Requirements.** A bank moves customer-facing digital banking to Azure while core banking stays on-premises in two data centres. Regulators require data to stay in-country, no customer data over the public Internet, full traffic inspection, and an RTO of 2 hours for a region failure.

**Design.**

- **Landing zone**: Azure landing zone with management groups; separate connectivity, identity, management and workload subscriptions. Azure Policy denies public IPs on VMs, enforces Private Endpoints and in-country regions only.
- **Hub-and-spoke**: hub VNet in UAE North with Azure Firewall Premium (TLS inspection, IDPS), ExpressRoute gateway (zone-redundant), DNS Private Resolver and Bastion. Spokes for each application, peered to the hub, with UDRs sending all traffic, including spoke-to-spoke, through the firewall.
- **Hybrid**: two ExpressRoute circuits from two peering locations to both data centres, with MACsec on ExpressRoute Direct ports; BGP weights favour the primary data centre. Site-to-Site VPN as a final backup.
- **Applications**: Front Door Premium with WAF and Private Link origins to App Services; Azure SQL with Private Endpoints only; Key Vault with Private Endpoint and HSM-backed keys.
- **DR**: a secondary hub and spokes in UAE Central deployed from the same Bicep templates, with database geo-replication; failover runbooks tested twice a year.
- **Operations**: VNet flow logs and firewall logs to Microsoft Sentinel; Connection Monitor between data centres and Azure.

**Trade-offs.** Forcing all traffic through Azure Firewall adds cost and a little latency but satisfies inspection requirements and gives one policy point. A pilot-light DR region keeps cost down while meeting the 2-hour RTO.

> **Watch out:** When every spoke routes through a central firewall, size and scale the firewall for peak east-west traffic, not only Internet traffic.

## Lesson 4: Case 3: SaaS provider offering private connectivity

**Requirements.** A SaaS company runs an analytics API on Google Cloud. Large enterprise customers on AWS, Azure, Google Cloud and OCI want to reach the API **privately**, without the Internet, and many of them use the same private IP ranges (10.0.0.0/16 is everywhere).

**Design.**

- Because customer ranges overlap with each other and with the provider, **routing-based connectivity (peering, VPN) is ruled out**. Instead, expose the service through **endpoint-based private connectivity**, which only exposes a single IP in the consumer's network:
- **Google Cloud customers**: **Private Service Connect** service attachment; customers create PSC endpoints in their VPCs.
- **AWS customers**: run a deployment of the API in AWS behind an NLB and publish a **PrivateLink endpoint service**; customers create interface endpoints.
- **Azure customers**: an **Azure Private Link service** behind a Standard Load Balancer; customers create Private Endpoints.
- **OCI customers**: no direct equivalent is used here; instead, customers connect over the Oracle Interconnect for Google Cloud (in paired regions) to a dedicated, NAT-translated address per customer, or use the public endpoint with IP allow-listing.
- Each customer is allow-listed by account/project/subscription on the endpoint service, and every request is authenticated with mTLS or API keys.
- Public endpoint remains for smaller customers, behind the global load balancer with Cloud Armor.

**Trade-offs.** Running regional deployments in several clouds adds operational load, but endpoint services avoid any IP coordination with customers and scale to thousands of tenants.

> **Tip:** PrivateLink, Private Service Connect and Azure Private Link all solve the "overlapping customer ranges" problem by publishing a service, not a network.

## Lesson 5: Case 4: Merger with overlapping address space

**Requirements.** Company A (AWS and an on-premises data centre using 10.0.0.0/12) acquires Company B (Azure, also using 10.0.0.0/12 heavily). Within three months, finance and HR systems in each company must reach a handful of systems in the other. Renumbering B's network will take at least a year.

**Design options considered.**

1. **Renumber first**: cleanest long-term, too slow for the deadline.
2. **NAT at the boundary** (chosen for phase 1): connect A's Transit Gateway and B's Virtual WAN through a pair of firewall appliances in a shared "interconnect" network. Each side sees the other's needed systems through a **translated, non-overlapping range** (for example, B's systems appear to A as 100.70.0.0/16, A's systems appear to B as 100.71.0.0/16). DNS views return the translated addresses.
3. **Endpoint services**: for the few web APIs involved, publish them through PrivateLink / Private Link services so no routing is needed at all (used for two APIs).

**Phase 2.** Build a new address plan for the combined company, allocate B a fresh range, and migrate B's workloads progressively; remove NAT when the last overlapping system moves.

**Trade-offs.** NAT breaks protocols that embed IP addresses and complicates troubleshooting and logging, so it's limited to the specific systems required and documented as temporary.

> **Watch out:** When translating addresses, logs on each side show translated IPs. Keep the NAT mapping table in your SIEM so investigators can trace real sources.

## Lesson 6: Case 5: Oracle database on OCI, applications on Azure

**Requirements.** A manufacturer runs its ERP application tier on Azure (where its other Microsoft workloads live) but wants Oracle Exadata performance and licensing benefits for the ERP database. Round-trip latency between app and database must stay under 2 ms. Disaster recovery to a second region pair is required.

**Design.**

- **Region pairing**: choose an Azure region and OCI region pair supported by **Oracle Interconnect for Microsoft Azure** with low latency (or use **Oracle Database@Azure**, which places Exadata inside Azure data centres and avoids the cross-cloud link entirely).
- **Interconnect path**: ExpressRoute circuit on the Azure side and FastConnect virtual circuit on the OCI side, joined by the interconnect; Azure VNet ↔ ExpressRoute gateway; OCI VCN ↔ DRG.
- **Address plan**: non-overlapping ranges for the Azure spoke (10.48.10.0/24) and the OCI database VCN (10.80.10.0/24); each side's routing advertises only those ranges.
- **Security**: NSGs on OCI allow only the Azure app subnet on the database listener ports; Azure NSGs allow only the app tier outbound to the OCI range; TLS on database connections; Data Guard traffic between OCI regions stays on Oracle's backbone.
- **DR**: Data Guard to a standby Exadata in a second OCI region paired with a second Azure region; application tier redeployed there with infrastructure as code.
- **DNS**: Azure DNS Private Resolver forwards the OCI private zone to OCI's resolver listening endpoint, and vice versa.

**Trade-offs.** Cross-cloud adds two providers' operations and support processes; Oracle Database@Azure simplifies networking and latency but changes the commercial model. Both satisfy the latency requirement; the choice is commercial and organisational.

> **Tip:** Measure the real app-to-database round trip before migrating. Chatty ERP workloads are extremely sensitive to latency, as Module 29 showed.

## Lesson 7: Case 6: Data platform on Google Cloud with exfiltration controls

**Requirements.** A healthcare analytics company processes patient data in BigQuery and Cloud Storage. Data must never leave approved projects, even if credentials are stolen. Analysts work remotely. On-premises hospitals upload data nightly.

**Design.**

- **Resource hierarchy**: a folder for the data platform with organization policies (no external IPs, restrict resource locations to approved regions, uniform bucket access).
- **VPC Service Controls**: a **service perimeter** around the data projects, protecting BigQuery, Cloud Storage and related APIs. Requests from outside the perimeter are denied even with valid credentials; ingress and egress rules allow only specific, approved flows.
- **Private access**: Shared VPC with Private Google Access using `restricted.googleapis.com`, which only serves APIs supported by VPC Service Controls; DNS maps `*.googleapis.com` to the restricted VIP.
- **Hybrid**: HA VPN with Cloud Router (later Partner Interconnect) from hospitals; uploads land in a quarantine bucket inside the perimeter.
- **Users**: analysts reach notebooks and dashboards through **IAP** and context-aware access (managed devices only); no VPN.
- **Operations**: VPC Service Controls dry-run mode used first to discover legitimate flows; audit logs and violation logs exported to the SIEM.

**Trade-offs.** VPC Service Controls adds friction (some tools and integrations need explicit rules), but it is one of the few controls that stops data exfiltration by insiders or stolen credentials.

> **Tip:** Always start VPC Service Controls in dry-run mode for a few weeks and review violations before enforcing; otherwise you'll break legitimate pipelines.

## Key takeaways

- Start every design from requirements and constraints, not from services.
- State the trade-offs you accept: cost, complexity, resilience, latency.
- Reuse the patterns from this course: hub-and-spoke, private endpoints, edge security, BGP-steered hybrid links.
- A design is finished only when it covers operations: monitoring, change, failure and recovery.

## Checkpoint

**Q1. What should a design start from?**

A. The list of services you like
B. Requirements, non-functional requirements and constraints  ✓
C. The cheapest region
D. The diagram template

_Services are chosen to meet requirements, not the other way around._

**Q2. Customers with overlapping IP ranges need private access to your SaaS API. Which approach fits?**

A. VPC peering with each customer
B. Site-to-site VPN with each customer
C. Endpoint services such as PrivateLink, Private Service Connect or Azure Private Link  ✓
D. Asking customers to renumber

_Endpoint services expose a single IP in the consumer network, so overlaps don't matter._

**Q3. In the merger case, why was NAT chosen only as a temporary phase?**

A. NAT is expensive to license
B. NAT complicates troubleshooting and breaks some protocols; renumbering is the clean long-term fix  ✓
C. NAT doesn't work in the cloud
D. NAT is slower than VPN

_NAT solves overlaps quickly but adds lasting complexity._

**Q4. What does RPO describe?**

A. How fast the system recovers
B. How much data loss (in time) is acceptable  ✓
C. The number of regions
D. Peak requests per second

_Recovery point objective: the maximum acceptable data loss window._

**Q5. Which Google Cloud control blocks data access from outside approved projects even with stolen credentials?**

A. Cloud Armor
B. Cloud NAT
C. VPC Service Controls  ✓
D. Shared VPC

_Service perimeters deny API access from outside the perimeter regardless of credentials._

## Official reading

- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
- [Azure Well-Architected Framework](https://learn.microsoft.com/en-us/azure/well-architected/)
- [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework)
- [OCI best practices framework](https://docs.oracle.com/en/solutions/oci-best-practices/)
