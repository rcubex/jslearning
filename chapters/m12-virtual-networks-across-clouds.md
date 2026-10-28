# Module 17: Virtual Networks Across Clouds

**Level:** 3 · **Lessons:** 7 · **Questions:** 6

_Map one network design onto all four providers._

## Lesson 1: The virtual network

In every cloud you start by creating a private, isolated network and giving it one or more address ranges from RFC 1918. Then you divide it into **subnets**, attach **route tables**, add **gateways** for Internet or on-premises access, and apply **security rules**.

- **AWS**: **VPC** (Virtual Private Cloud). Primary CIDR between /16 and /28, plus up to four secondary CIDRs by default.
- **Azure**: **VNet** (Virtual Network). One or more address spaces; you can add more later.
- **Google Cloud**: **VPC network**. The network itself has no CIDR; each subnet has its own primary range, plus optional secondary ranges (used by GKE).
- **OCI**: **VCN** (Virtual Cloud Network). One or more CIDR blocks (/16 to /30 each).

Under the hood these are software-defined networks: there are no real switches or VLANs you can see. The provider's virtual network delivers packets between your VMs, enforces your rules and answers ARP and DHCP on behalf of the network.

> **Tip:** Before creating any network, take its range from your address plan (Module 03). Changing the range of a live network is difficult or impossible.

## Lesson 2: Scope differences

The biggest structural differences between providers are about *where* things live.

- **AWS**: the VPC is regional. Each **subnet lives in exactly one availability zone**. For a three-zone design you create three public and three private subnets.
- **Azure**: the VNet is regional. **Subnets span all zones** in the region; you choose the zone per VM or service, not per subnet.
- **Google Cloud**: the **VPC is global**. **Subnets are regional** and span all zones in that region. VMs in different regions of the same VPC talk over internal IPs with no peering.
- **OCI**: the VCN is regional. **Subnets are regional** (recommended) or tied to a single availability domain.

This changes how you design. On AWS, the number of subnets multiplies by the number of zones. On Azure, Google Cloud and OCI, one subnet per tier is often enough, and resilience comes from placing instances in different zones or fault domains.

> **Watch out:** On AWS, if all your private subnets route to a NAT gateway in one zone and that zone fails, every zone loses Internet access. Use one NAT gateway per zone for production.

## Lesson 3: Routing in the cloud

Every virtual network automatically routes traffic between its own subnets (the **local** route). You add routes for everything else.

- **AWS**: route tables are associated with subnets. A subnet is "public" only because its route table sends `0.0.0.0/0` to an **Internet gateway**; a "private" subnet sends it to a **NAT gateway** (or has no default route).
- **Azure**: **system routes** are created automatically, including a default route to the Internet. You override them with **user-defined routes (UDRs)** in route tables attached to subnets, for example sending `0.0.0.0/0` to Azure Firewall.
- **Google Cloud**: routes belong to the VPC network, not to subnets. There is a default route to the Internet gateway, and custom static routes can apply to all instances or only to instances with a given **network tag**, with priorities.
- **OCI**: **route tables** are attached to subnets, with rules pointing to an Internet gateway, NAT gateway, service gateway, DRG or a private IP (for a firewall appliance).

**The same "private subnet" in each cloud**

```
AWS:   private-rt: 0.0.0.0/0 → nat-gateway (in a public subnet)
Azure: UDR on subnet: 0.0.0.0/0 → Azure Firewall private IP (or attach a NAT Gateway resource to the subnet)
GCP:   VMs without external IPs + Cloud Router + Cloud NAT for the region
OCI:   private subnet route table: 0.0.0.0/0 → NAT gateway; Oracle services → service gateway
```

> **Tip:** When something can't reach a destination, read the effective routes. Azure shows them per network interface ("Effective routes"); AWS Reachability Analyzer, Google Connectivity Tests and OCI Network Path Analyzer evaluate routes for you.

## Lesson 4: Filtering in the cloud

Each cloud filters traffic, but in different places.

- **AWS**: **security groups** on network interfaces (stateful, allow-only, can reference other security groups) and **network ACLs** on subnets (stateless, numbered allow and deny rules).
- **Azure**: **network security groups (NSGs)** with priority-ordered allow and deny rules (stateful), attached to subnets, NICs, or both. **Application security groups** let rules target VMs by role.
- **Google Cloud**: **VPC firewall rules** and **firewall policies** (stateful), applied to the network and targeting instances by tag, service account or all instances. Every VPC has implied rules: allow all egress and deny all ingress.
- **OCI**: **security lists** on subnets and **network security groups** on VNICs. Rules are stateful by default; stateless is optional.

**"Database only reachable from the app tier", four ways**

```
AWS:   sg-db inbound: TCP 5432 from sg-app
Azure: NSG rule: allow TCP 5432 from ASG app-servers to ASG db-servers
GCP:   firewall: allow tcp:5432 from service account app-sa to target service account db-sa
OCI:   nsg-db ingress: TCP 5432 from source NSG nsg-app
```

> **Watch out:** If both a subnet-level and an instance-level filter apply (AWS NACL + security group, Azure subnet NSG + NIC NSG, OCI security list + NSG), traffic must be allowed by **both**.

## Lesson 5: Public IPs and Internet exposure

A resource can only be reached from the Internet if it has a public address (or sits behind something that does, like a load balancer) **and** routing and security rules allow it.

- **AWS**: public IPv4 addresses (auto-assigned or **Elastic IPs**) on instances in subnets with an Internet gateway route. AWS charges for public IPv4 addresses.
- **Azure**: **public IP address** resources attached to NICs, load balancers or gateways. VMs without a public IP can still reach the Internet through a NAT gateway or firewall; Azure is retiring "default outbound access" for new VNets, so plan explicit egress.
- **Google Cloud**: **external IP addresses** (ephemeral or static) on VM interfaces.
- **OCI**: **public IPs** (ephemeral or reserved) on VNICs, only in **public subnets**. A subnet's public/private setting is fixed at creation.

Best practice is the same everywhere: application and database servers have **no public IPs**. Only load balancers, NAT gateways, VPN gateways and (if needed) bastions face the Internet.

> **Tip:** Use guardrail policies to block public IPs on VMs (AWS SCPs, Azure Policy, Google Cloud organization policy `compute.vmExternalIpAccess`, OCI security zones).

## Lesson 6: Reference design: a three-tier network

Here is one design, used for the rest of the course, mapped to each provider.

1. **Public tier**: L7 load balancer with WAF, NAT gateway(s). The only Internet-facing parts.
2. **App tier**: application servers or containers in private subnets, reachable only from the load balancer.
3. **Data tier**: managed database with a private endpoint, reachable only from the app tier.
4. **Admin access**: managed, identity-based access (Session Manager, Azure Bastion, IAP, OCI Bastion), never open SSH/RDP.
5. **Logging**: flow logs enabled on the network.

**Mapping summary**

```
              AWS                      Azure                         Google Cloud                OCI
Network       VPC                      VNet                          VPC (global)                VCN
Public tier   ALB + WAF, NAT GW/AZ     App Gateway + WAF, NAT GW     Global ALB + Cloud Armor    LB + WAF, NAT GW
App tier      private subnet per AZ    snet-app (zone-redundant)     regional subnet             private regional subnet
Data tier     RDS in private subnets   Private Endpoint to Azure SQL Cloud SQL private IP / PSC   Autonomous DB private endpoint
Filtering     SGs (+NACLs)             NSGs + ASGs                   firewall rules/policies     NSGs (+security lists)
```

> **Tip:** Draw this design for your own app before touching a console. Every deep-dive module in Level 4 builds this exact design on one provider.

## Lesson 7: Real-world scenario: one design, four clouds

**Situation.** A software company must deploy the same customer-facing application in AWS, Azure, Google Cloud and OCI, because different enterprise customers require different providers. The team wants one design, translated consistently.

**Approach.**

1. **One logical design**: public tier (L7 load balancer with WAF), app tier (containers), data tier (managed PostgreSQL with private access), admin access without open ports, flow logs on.
2. **One address plan**: each cloud gets its own /16 from the company plan, with the same internal layout (public /24s, app /20s, data /24s).
3. **Translation table** for each building block (the Cloud Rosetta tab is exactly this). Notable differences handled explicitly: - AWS: three app subnets (one per AZ) and three NAT gateways; others: one regional app subnet. - Azure: dedicated subnets for Application Gateway and Private Endpoints; delegated subnet for PostgreSQL Flexible Server. - Google Cloud: firewall rules by service account; Cloud NAT on a Cloud Router; Cloud SQL with Private Service Connect. - OCI: public/private decided at subnet creation; NSGs per tier; service gateway for Oracle services.
4. **Infrastructure as code**: one Terraform module per cloud with identical inputs (name, CIDR, tiers), producing identical outputs.
5. **Same tests**: the same connectivity tests run against each deployment (Internet can reach only the load balancer; app can reach database; nothing else can).

**Lessons learned.** Design once at the logical level, then translate. Writing down the differences between providers up front prevents subtle security gaps (for example, OCI's union of security lists and NSGs, or AWS's per-AZ subnets).

## Key takeaways

- VPC, VNet, VCN and Google VPC are the same idea: your private network in the cloud.
- Scope differs: AWS subnets are per zone; Azure, Google Cloud and OCI subnets are regional.
- Public vs private is decided by routing (and, on OCI, by the subnet setting).
- Every cloud filters at the instance level; AWS and OCI also filter at the subnet level.

## Checkpoint

**Q1. Which provider VPC is global by default?**

A. AWS
B. Azure
C. Google Cloud  ✓
D. OCI

_A Google Cloud VPC spans all regions; its subnets are regional._

**Q2. In AWS, a subnet lives in…**

A. A region
B. An availability zone  ✓
C. A peering connection
D. An edge location

_Each AWS subnet maps to exactly one AZ._

**Q3. What makes an AWS subnet "public"?**

A. A checkbox on the subnet
B. A route table entry sending 0.0.0.0/0 to an Internet gateway  ✓
C. Having a NAT gateway
D. Its CIDR range

_Public is a routing property: a default route to the Internet gateway._

**Q4. An AWS NACL allows traffic but the instance's security group does not. What happens?**

A. Traffic is allowed
B. Traffic is blocked  ✓
C. Only replies are allowed
D. It depends on the port

_Traffic must pass both the subnet filter and the instance filter._

**Q5. On OCI, when is a subnet's public or private setting chosen?**

A. Any time, in the console
B. When the subnet is created; it can't be changed later  ✓
C. When the first instance launches
D. When a route table is attached

_OCI fixes public/private at subnet creation, so plan it up front._

**Q6. What is the most reliable way to deploy one application consistently across four clouds?**

A. Click through each console carefully
B. One logical design and address plan, translated into per-cloud IaC modules with the same tests  ✓
C. Use only the default networks
D. Copy one cloud's templates into the others unchanged

_Logical design plus per-cloud modules and shared tests keeps deployments equivalent._

## Official reading

- [AWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [Azure Virtual Network](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview)
- [Google Cloud VPC](https://cloud.google.com/vpc/docs/overview)
- [OCI Networking](https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/overview.htm)
