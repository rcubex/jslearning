# Module 20: AWS Networking

**Level:** 4 · **Lessons:** 10 · **Questions:** 7

_Design and build production VPC networks on AWS._

## Lesson 1: VPC and subnets

A **VPC** is a regional, isolated network. You give it a primary IPv4 CIDR (between /16 and /28) and optionally secondary CIDRs and an IPv6 /56. Inside it you create **subnets**, each in exactly one **availability zone**.

A standard production layout uses three AZs and three tiers, so nine subnets:

**Production VPC 10.10.0.0/16 across three AZs**

```
public-a   10.10.0.0/24    public-b   10.10.1.0/24    public-c   10.10.2.0/24
app-a      10.10.16.0/20   app-b      10.10.32.0/20   app-c      10.10.48.0/20
data-a     10.10.64.0/24   data-b     10.10.65.0/24   data-c     10.10.66.0/24
```

Gateways and route tables make the tiers behave differently:

- **Internet gateway (IGW)**: one per VPC, horizontally scaled, free. Public subnets route `0.0.0.0/0 → igw-…`.
- **NAT gateway**: lives in a public subnet with an **Elastic IP**, gives private subnets outbound-only Internet access. It is zonal, so create **one per AZ** and point each private subnet's route table at the NAT gateway in its own AZ.
- **Egress-only Internet gateway**: the IPv6 equivalent of NAT (outbound only).

Every VPC also has a built-in DNS resolver at the VPC base address plus two (for 10.10.0.0/16 that is 10.10.0.2), and the instance metadata service at 169.254.169.254.

> **Tip:** Make app subnets large (/20 or bigger). Containers on EKS with the VPC CNI and Lambda functions in a VPC consume IP addresses quickly.

## Lesson 2: Security groups vs network ACLs

**Security groups (SGs)** attach to network interfaces (ENIs). They are **stateful** and contain only **allow** rules; anything not allowed is denied. Their superpower is that a rule's source can be **another security group**: "allow 5432 from sg-app" keeps working however many app instances exist and whatever their IPs.

**Network ACLs (NACLs)** attach to subnets. They are **stateless**, have numbered **allow and deny** rules evaluated lowest number first, and end with an implicit deny. Because they are stateless, you need rules for return traffic on ephemeral ports.

**A three-tier security group design**

```
sg-alb   inbound: TCP 443 from 0.0.0.0/0 (and ::/0)
sg-app   inbound: TCP 8080 from sg-alb
sg-db    inbound: TCP 5432 from sg-app
(no inbound SSH anywhere; use Systems Manager Session Manager)
```

Use security groups as your main control. Use NACLs sparingly, for coarse subnet-wide rules such as blocking a known bad range, or as a guardrail that a database subnet can never accept traffic from public subnets.

> **Watch out:** The default NACL allows everything. A custom NACL starts by denying everything, including return traffic. If you add one, test both directions.

## Lesson 3: Connecting VPCs: peering, Transit Gateway and Cloud WAN

**VPC peering** connects two VPCs (same or different account, same or different region) privately. It is simple and has no hourly charge, but it is **non-transitive**: if A peers with B and B with C, A cannot reach C through B. CIDRs must not overlap. Full mesh peering of 10 VPCs needs 45 connections, each with route table entries.

**AWS Transit Gateway (TGW)** is a regional, managed hub router. You attach VPCs, VPN connections, Direct Connect gateways and peering connections to other TGWs. TGW has its own **route tables**, so you can segment traffic: for example, production and development VPCs both reach shared services but not each other. It is billed per attachment-hour and per GB.

**AWS Cloud WAN** builds a global network from a central **policy**: you define segments (prod, dev, shared) and which attachments join which segment, and AWS builds the TGW-like core across regions for you.

**Transit Gateway segmentation example**

```
TGW route table "prod":    routes to prod VPCs + shared-services + on-prem
TGW route table "dev":     routes to dev VPCs + shared-services
TGW route table "shared":  routes to everything
Attach each VPC to the table matching its environment.
```

> **Tip:** Rough guide: peering for 2–5 VPCs, Transit Gateway for more or for hybrid hubs, Cloud WAN for multi-region networks managed as policy.

## Lesson 4: Private access to services

By default, an instance in a private subnet reaching Amazon S3 or another AWS API goes out through the NAT gateway and over public endpoints. **VPC endpoints** keep that traffic inside AWS, improve security and often save NAT costs.

- **Gateway endpoints** (S3 and DynamoDB only) add a route to the subnet route tables using a managed prefix list. They are **free**.
- **Interface endpoints** (powered by **AWS PrivateLink**) place an ENI with a private IP in your subnets for a specific service (STS, ECR, Secrets Manager, CloudWatch, and hundreds more). Private DNS makes the normal service hostname resolve to that private IP. They are billed per hour per AZ and per GB.

**Endpoint policies** restrict what can be done through the endpoint, for example "only these S3 buckets", which helps prevent data exfiltration.

PrivateLink also lets you publish **your own** service: put it behind an NLB, create an **endpoint service**, and consumers in other VPCs or accounts create interface endpoints to it. Address ranges can overlap, because only the endpoint IP is exposed.

**VPC Lattice** is a newer application-networking service that connects services across VPCs and accounts at the application layer, with built-in auth policies.

> **Tip:** Always add the S3 gateway endpoint to every VPC. It costs nothing and removes S3 traffic from the NAT gateway bill.

## Lesson 5: DNS with Route 53

**Amazon Route 53** provides DNS in several roles:

- **Public hosted zones** for your Internet domains.
- **Private hosted zones** associated with one or more VPCs, for internal names like `db.prod.internal`.
- **Route 53 Resolver**: the VPC's built-in resolver. **Inbound endpoints** let on-premises DNS servers resolve your private zones; **outbound endpoints** with **forwarding rules** let VPCs resolve on-premises zones (such as `corp.example.com`).
- **Resolver DNS Firewall**: block or allow domain lookups from your VPCs.

Routing policies decide which answer each user gets: **simple**, **weighted** (canary releases), **latency-based** (nearest region), **failover** (with health checks), **geolocation**, **geoproximity**, **multivalue** and **IP-based**.

**Alias records** point a name (including the zone apex) at AWS resources such as an ALB, CloudFront distribution or S3 website, with no extra query cost.

> **In the cloud:** Resolver endpoints are the standard way to make DNS work across hybrid and multi-account networks; share forwarding rules to other accounts with AWS RAM.

## Lesson 6: Load balancing and edge services

**Elastic Load Balancing** offers three types:

- **Application Load Balancer (ALB)**: L7 HTTP/HTTPS/gRPC. Host, path, header and query routing; redirects; authentication with OIDC or Amazon Cognito; integrates with **AWS WAF**. Targets can be instances, IPs or Lambda functions.
- **Network Load Balancer (NLB)**: L4 TCP/UDP/TLS. Very high throughput, a static IP per AZ (or your Elastic IPs), preserves client IP, can sit in front of PrivateLink services.
- **Gateway Load Balancer (GWLB)**: inserts third-party virtual appliances (firewalls, IDS) transparently using GENEVE encapsulation, with **GWLB endpoints** as route targets.

At the edge: **Amazon CloudFront** (CDN with edge TLS, caching and WAF), **AWS Global Accelerator** (two static anycast IPs routing users over the AWS backbone to the closest healthy regional endpoint), **AWS Shield** (DDoS protection; Advanced adds response team support and cost protection).

> **Tip:** Put internet-facing ALBs in public subnets and their targets in private subnets. Targets need no public IPs; the ALB reaches them over private addresses.

## Lesson 7: Hybrid connectivity on AWS

**AWS Site-to-Site VPN** creates two IPsec tunnels (in different AZs) from a **virtual private gateway** or **Transit Gateway** to your customer gateway device. Each tunnel supports up to 1.25 Gbps; with Transit Gateway and ECMP you can spread traffic over many tunnels. Use BGP for automatic failover.

**AWS Direct Connect (DX)** gives a private, dedicated connection from your router at a DX location to AWS:

- **Dedicated connections** of 1, 10, 100 or 400 Gbps, or **hosted connections** from a partner (from 50 Mbps upwards).
- **Virtual interfaces (VIFs)**: **private VIF** to a VPC (via virtual private gateway or Direct Connect gateway), **transit VIF** to Transit Gateways via a Direct Connect gateway, **public VIF** to AWS public services.
- A **Direct Connect gateway** is a global object that lets one connection reach VPCs and TGWs in many regions.
- **MACsec** encryption is available on many dedicated connections.

For production, AWS recommends **maximum resiliency**: connections at two DX locations, two devices at each. A common budget design is one DX connection plus Site-to-Site VPN as backup.

> **Watch out:** A private VIF accepts a limited number of prefixes from you (100 by default). Advertising more drops the BGP session; summarise your on-premises routes.

## Lesson 8: Operating and troubleshooting AWS networks

AWS gives you several tools that save hours:

- **VPC Flow Logs**: metadata for every accepted and rejected flow at VPC, subnet or ENI level, sent to CloudWatch Logs, S3 or Firehose. A `REJECT` tells you a security group or NACL dropped the traffic.
- **Reachability Analyzer**: picks a source and destination and analyses route tables, SGs, NACLs and gateways, then tells you exactly which component blocks the path, without sending packets.
- **Network Access Analyzer**: finds unintended access, such as "any path from the Internet to a database subnet".
- **Traffic Mirroring**: copies packets from an ENI to a monitoring appliance for deep inspection.
- **AWS Network Firewall**: managed stateful firewall with Suricata-compatible rules and domain filtering, deployed into dedicated subnets.

**A flow log record, decoded**

```
2 123456789012 eni-0a1b2c 10.10.16.25 10.10.64.10 49152 5432 6 10 840 1700000000 1700000060 REJECT OK
          (version account interface src dst srcport dstport proto packets bytes start end action status)
→ App server 10.10.16.25 tried PostgreSQL on 10.10.64.10 and was REJECTED: check sg-db and the data subnet NACL.
```

> **Tip:** Run Reachability Analyzer before opening a support case. It names the exact security group, NACL or route that blocks traffic.

## Lesson 9: Deep dive: centralised egress and inspection on AWS

As AWS estates grow to dozens of VPCs, giving each VPC its own NAT gateways and firewalls becomes expensive and inconsistent. The standard alternative routes traffic through shared **egress** and **inspection** VPCs attached to **Transit Gateway**.

**Centralised egress.** Spoke VPCs have no Internet gateway or NAT gateway. Their route tables send `0.0.0.0/0` to the Transit Gateway. The TGW sends it to an **egress VPC** with NAT gateways in each AZ, which then route to an Internet gateway. Return traffic follows the same path back. This saves NAT costs, gives one set of egress IPs to allow-list, and one place to filter.

**Centralised inspection.** An **inspection VPC** holds **AWS Network Firewall** endpoints (or third-party appliances behind a **Gateway Load Balancer**). TGW route tables send spoke-to-spoke, spoke-to-on-premises and spoke-to-Internet traffic through it.

**Traffic path: spoke VPC → Internet with inspection**

```
spoke subnet RT:        0.0.0.0/0 → TGW
TGW "spokes" RT:        0.0.0.0/0 → inspection VPC attachment
inspection VPC (TGW subnet RT): 0.0.0.0/0 → Network Firewall endpoint (same AZ)
firewall subnet RT:     0.0.0.0/0 → NAT gateway (or → TGW → egress VPC)
return traffic:         symmetric path back through the same firewall endpoint
```

Two settings make or break this design:

- **Appliance mode** on the inspection VPC's TGW attachment keeps both directions of each flow in the same AZ, so stateful firewalls see the whole connection.
- **Per-AZ routing**: each AZ's subnets route to the firewall endpoint in the same AZ, avoiding cross-AZ charges and AZ-failure coupling.

> **Tip:** AWS also supports a **distributed** model (a firewall endpoint inside each VPC) and a **combined** model. Centralised suits shared policy and many small VPCs; distributed suits very high-throughput VPCs that shouldn't hairpin through a hub.

## Lesson 10: Real-world scenario: the AZ outage that took everything offline

**Situation.** During a partial outage of one availability zone in its primary region, a company's entire application lost Internet access, even though two of three zones were healthy and the load balancer kept serving users.

**Investigation.** The application's private subnets in all three AZs routed `0.0.0.0/0` to a single NAT gateway, created in AZ-a when the VPC was built "temporarily". When AZ-a degraded, every instance lost outbound access: payment calls, package downloads and calls to third-party APIs all failed. The app's inbound path was fine, so the failure looked like an application bug at first.

**Fix.**

1. Create a NAT gateway in each AZ's public subnet.
2. Give each AZ's private subnets their own route table pointing to the NAT gateway **in the same AZ**.
3. Review every other zonal dependency: interface endpoints enabled in all AZs, Network Firewall endpoints per AZ, databases with Multi-AZ, instances spread across AZs.
4. Add a game-day exercise: simulate an AZ failure (for example with AWS Fault Injection Service) twice a year.

**Lessons learned.** Multi-AZ isn't just about where instances run. Every component in the path, including NAT, endpoints and firewalls, must be zonal and independent, or one zone can take down all three.

## Key takeaways

- Build one subnet per tier per AZ; route public subnets to an IGW and private ones to a NAT gateway per AZ.
- Security groups (stateful, reference each other) are the main control; NACLs are a coarse backstop.
- Use Transit Gateway or Cloud WAN once you have more than a handful of VPCs.
- Keep AWS service traffic private with gateway and interface endpoints.

## Checkpoint

**Q1. Which AWS control is stateless?**

A. Security group
B. Network ACL  ✓
C. PrivateLink
D. Route 53 Resolver

_NACLs need explicit rules for return traffic._

**Q2. VPC A peers with B and B peers with C. Can A reach C through B?**

A. Yes
B. No  ✓
C. Only with NAT
D. Only over IPv6

_Peering is non-transitive. Use Transit Gateway or a direct peering._

**Q3. Why should production VPCs have one NAT gateway per availability zone?**

A. NAT gateways are free
B. A NAT gateway is zonal; if its AZ fails, private subnets in other AZs lose Internet access  ✓
C. AWS requires it
D. It doubles bandwidth for each instance

_Keep each AZ's egress independent so one AZ failure doesn't spread._

**Q4. Which endpoint type is free and supports only S3 and DynamoDB?**

A. Interface endpoint
B. Gateway endpoint  ✓
C. Gateway Load Balancer endpoint
D. Resolver endpoint

_Gateway endpoints add routes for S3 and DynamoDB at no charge._

**Q5. Which tool tells you which security group or route blocks traffic between two resources, without sending packets?**

A. VPC Flow Logs
B. Traffic Mirroring
C. Reachability Analyzer  ✓
D. CloudTrail

_Reachability Analyzer analyses configuration and names the blocking component._

**Q6. Why is appliance mode enabled on the inspection VPC's Transit Gateway attachment?**

A. To encrypt traffic
B. To keep both directions of each flow on the same AZ and firewall endpoint  ✓
C. To enable IPv6
D. To reduce costs

_Stateful inspection needs symmetric paths; appliance mode provides them._

**Q7. All private subnets in three AZs used one NAT gateway in AZ-a. What happens if AZ-a fails?**

A. Only AZ-a loses Internet access
B. All three AZs lose outbound Internet access  ✓
C. Traffic automatically fails over to a NAT gateway in AZ-b
D. Nothing; NAT gateways are regional

_The single zonal NAT gateway becomes a shared point of failure._

## Official reading

- [Amazon VPC User Guide](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
- [AWS Transit Gateway](https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html)
- [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html)
- [Elastic Load Balancing](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html)
- [AWS Direct Connect](https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html)
