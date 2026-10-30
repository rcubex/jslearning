# Module 23: Oracle Cloud (OCI) Networking

**Level:** 4 · **Lessons:** 9 · **Questions:** 6

_Build VCNs and use the DRG as a routing hub._

## Lesson 1: VCNs and subnets

An OCI **Virtual Cloud Network (VCN)** is regional and holds one or more IPv4 CIDR blocks (each /16 to /30) and optional IPv6 prefixes. You create **subnets** inside it.

Two choices are made per subnet **at creation and cannot be changed**:

- **Regional or AD-specific**: regional subnets span all availability domains in the region (recommended); AD-specific subnets exist in one AD.
- **Public or private**: instances in private subnets cannot have public IPs.

OCI reserves 3 addresses per subnet (first two and last). Each VCN and subnet can have a **DNS label**, so instances get hostnames like `app1.snetapp.vcnprod.oraclevcn.com` resolved by the VCN's built-in resolver.

**Create a VCN and a private regional subnet (OCI CLI)**

```
oci network vcn create --compartment-id $C --cidr-blocks '["10.40.0.0/16"]' \
  --display-name vcn-prod --dns-label vcnprod
oci network subnet create --compartment-id $C --vcn-id $VCN \
  --cidr-block 10.40.10.0/24 --display-name snet-app \
  --prohibit-public-ip-on-vnic true --dns-label snetapp
```

> **Tip:** Because public/private can't be changed, decide per tier up front: only load balancers, bastions and NAT-facing resources need public subnets.

## Lesson 2: Security lists and NSGs

OCI has two firewall mechanisms, both **stateful by default** (stateless rules are optional):

- **Security lists** apply to **every VNIC in a subnet**. A subnet can have up to five. Good for broad rules that apply to the whole subnet.
- **Network security groups (NSGs)** apply to the **VNICs you choose**, regardless of subnet. Rules can use another NSG as the source or destination, just like AWS security groups. Oracle recommends NSGs for most designs.

If both apply, traffic is allowed if **either** a security list or an NSG allows it (the union of rules). This differs from AWS and Azure, where both layers must allow traffic.

Every new VCN gets a **default security list** that allows SSH from anywhere and some ICMP. Tighten or replace it before production.

**NSG rules for a three-tier app**

```
nsg-lb   ingress: TCP 443 from 0.0.0.0/0
nsg-app  ingress: TCP 8080 from NSG nsg-lb
nsg-db   ingress: TCP 1521 from NSG nsg-app
default security list: remove "SSH from 0.0.0.0/0"
```

> **Watch out:** Because security lists and NSGs combine as a union, a permissive default security list can open access your NSGs were meant to block.

## Lesson 3: Gateways

OCI gives each kind of traffic its own gateway, used as a route target:

- **Internet gateway**: two-way Internet access for resources with public IPs in public subnets.
- **NAT gateway**: outbound-only Internet access for private subnets, with a public IP Oracle provides (or one you reserve).
- **Service gateway**: private access to Oracle services (such as Object Storage, Autonomous Database public endpoints, OS update mirrors) without the Internet. Route rules target the service CIDR label **All <region> Services in Oracle Services Network** or **OCI <region> Object Storage**.
- **Dynamic Routing Gateway (DRG)**: connects the VCN to other VCNs, on-premises networks and other regions.
- **Local peering gateway (LPG)**: the older way to peer two VCNs in the same region; DRG attachments are now preferred.

**Route tables for public and private subnets**

```
rt-public:   0.0.0.0/0 → Internet gateway
rt-private:  0.0.0.0/0 → NAT gateway
             All <region> Services in Oracle Services Network → Service gateway
             10.0.0.0/8 (on-prem and other VCNs) → DRG
```

> **Tip:** A private subnet can have both a NAT gateway route (0.0.0.0/0) and a service gateway route. The service gateway route is more specific, so traffic to Oracle services stays private and only other Internet traffic uses NAT.

## Lesson 4: The DRG as a hub

The **Dynamic Routing Gateway (DRG)** is OCI's virtual router and its central hub. A single DRG can have many **attachments**:

- **VCN attachments** (many VCNs in the same region, for hub-and-spoke)
- **IPSec tunnel attachments** (Site-to-Site VPN)
- **Virtual circuit attachments** (FastConnect)
- **Remote peering connection (RPC) attachments** (to DRGs in other regions or tenancies)

Each attachment uses a **DRG route table**, and **import route distributions** decide which routes each table learns. This lets you build segmentation and **transit routing**, such as sending all spoke-to-spoke and on-premises traffic through a firewall in a hub VCN.

**Hub-and-spoke with a firewall in the hub VCN**

```
DRG route table for spoke VCN attachments:  0.0.0.0/0 → hub VCN attachment
DRG route table for the hub attachment:     imports routes from all spokes and on-prem
Hub VCN ingress route table (on the DRG attachment): 0.0.0.0/0 → firewall private IP
```

> **Tip:** Use one DRG per region as the hub, and remote peering connections between regional DRGs for a global network.

## Lesson 5: Load balancing, DNS and edge security

**OCI Load Balancer** (flexible shape) is an L7 HTTP/HTTPS proxy that can also balance TCP. It supports path and host routing, TLS termination, session persistence and integration with **OCI WAF**. Bandwidth is set as a flexible range (minimum and maximum Mbps).

**OCI Network Load Balancer** is an L3/L4 pass-through load balancer for TCP, UDP and ICMP, preserving source and destination IPs, with very low latency. It is free of charge, which makes it popular for internal services and appliance clusters.

**OCI DNS** hosts public zones and, inside VCNs, **private DNS** with **private views** and a **resolver** per VCN. **Listening endpoints** answer queries from on-premises; **forwarding endpoints** with rules send queries for on-premises zones to your DNS servers.

Edge protection: **OCI WAF** (attached to load balancers or as an edge policy), DDoS protection included at the edge, and **OCI Network Firewall** (a managed next-generation firewall built with Palo Alto Networks technology) for inspection inside VCNs.

> **Tip:** Public load balancers need a public subnet; their backends should sit in private subnets reachable only from the load balancer's NSG.

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

## Lesson 7: Operating and troubleshooting OCI networks

Key tools in OCI's **Network Command Center**:

- **Network Path Analyzer**: analyses route tables, security lists, NSGs and gateways between a source and destination and shows where traffic is allowed or blocked.
- **VCN flow logs**: records of accepted and rejected traffic, configured per subnet, VNIC or VCN through capture filters, delivered to OCI Logging.
- **Capture filters and VTAP**: virtual test access points mirror traffic from a source (VNIC, load balancer, database) to a target for deep analysis.
- **Inter-region latency** dashboards.

**OCI Bastion** provides time-limited, audited SSH sessions to private instances without public IPs or open SSH from the Internet.

**Typical checklist when an OCI instance can't reach something**

```
1. Subnet route table: is there a rule to the right gateway (NAT, service, DRG)?
2. Security lists + NSGs: does any rule allow it? (union of both)
3. Instance OS firewall: Oracle Linux images ship with firewalld enabled
4. DRG route tables and import distributions (for cross-VCN/on-prem)
5. Run Network Path Analyzer to confirm
```

> **Watch out:** Oracle-provided Linux images have firewalld (and on some images iptables rules) enabled by default. Opening an NSG is not enough; open the port in the OS too.

## Lesson 8: Deep dive: networking for Oracle databases on OCI

Many organisations choose OCI for Oracle Database workloads, which have specific networking patterns:

- **Exadata Database Service** and **Base Database Service** deploy into **your VCN**: a **client subnet** (application connections, SCAN listeners) and, for Exadata, a **backup subnet**. Both should be private. Size them per the service documentation; Exadata needs several IPs per VM cluster node plus SCAN and VIP addresses.
- **Autonomous Database** can use a **private endpoint** in your subnet, with NSGs controlling which clients connect, instead of a public endpoint with access control lists.
- **Ports**: SQL*Net listener on TCP 1521 (or 1522 for Autonomous with TLS/mTLS); allow them only from the application NSG.
- **Backups** to Object Storage go through the **service gateway**, keeping them off the Internet.
- **Data Guard** between regions travels over **remote peering** between DRGs on Oracle's backbone; between availability domains in one region it stays in the VCN.
- **Multicloud**: Oracle Database@Azure, @Google Cloud and @AWS place Oracle-managed Exadata infrastructure inside those clouds' data centres, with the database networked into the other cloud's virtual network.

**Typical private Exadata layout**

```
VCN 10.80.0.0/16
  snet-db-client  10.80.10.0/24  (private)  NSG: 1521 from nsg-app; SSH from bastion only
  snet-db-backup  10.80.11.0/24  (private)  route: Oracle Services → service gateway
  snet-app        10.80.20.0/24  (private)  NSG nsg-app
DRG: VCN attachment + FastConnect + RPC to the DR region
```

> **Tip:** Use NSGs (not security lists) for database access, so rules follow the database VMs and application instances regardless of subnet changes.

## Lesson 9: Real-world scenario: Data Guard lag across regions

**Situation.** A bank runs its core Oracle database on OCI with Data Guard to a standby in a second region. During month-end batch processing, the standby falls hours behind, putting the recovery point objective at risk.

**Investigation.**

1. Data Guard metrics show redo transport lag growing during batch windows.
2. The network between regions is the DRG remote peering connection over Oracle's backbone, with ample bandwidth. Network metrics show no saturation or loss.
3. Database-side analysis shows redo was being sent over a single transport process, with compression off, from a primary generating very high redo volumes. Per-connection throughput over the ~40 ms inter-region path was the limit (the bandwidth-delay product problem from Module 29).

**Fix.**

1. Enable redo transport compression and tune the database's network buffer sizes (the Oracle Net SDU and send/receive buffers sized to the bandwidth-delay product).
2. Review OS-level TCP buffer limits on database hosts.
3. Add monitoring and alerts on apply and transport lag.

Lag stayed under one minute through the next month-end.

**Lessons learned.** "The network is fine" and "the transfer is slow" can both be true. Long-distance replication needs settings sized for the path's latency, not just bandwidth.

## Key takeaways

- VCNs are regional; prefer regional subnets, chosen as public or private at creation.
- Prefer NSGs for per-workload rules; use security lists for broad subnet rules.
- Internet, NAT and Service gateways cover public, outbound and Oracle-service traffic.
- The DRG is OCI's hub for VCNs, VPNs, FastConnect and other regions.

## Checkpoint

**Q1. Which OCI gateway gives private subnets access to Object Storage without the Internet?**

A. Internet Gateway
B. NAT Gateway
C. Service Gateway  ✓
D. DRG

_The Service Gateway reaches Oracle Services Network privately._

**Q2. How many IP addresses does OCI reserve in each subnet?**

A. 3  ✓
B. 4
C. 5
D. 0

_The first two and the last address._

**Q3. A VNIC is covered by both a security list and an NSG. When is traffic allowed?**

A. Only if both allow it
B. If either the security list or the NSG allows it  ✓
C. Only if the NSG allows it
D. Never

_OCI evaluates the union of security list and NSG rules._

**Q4. Which OCI component connects VCNs, VPN tunnels, FastConnect and other regions as a hub?**

A. Local peering gateway
B. NAT gateway
C. Dynamic Routing Gateway  ✓
D. Service gateway

_The DRG is OCI's virtual router with attachments for all of these._

**Q5. You open port 8080 in an NSG, but an Oracle Linux instance still refuses connections from other hosts. What should you check next?**

A. The Internet gateway
B. The instance's firewalld rules  ✓
C. The DNS label
D. The compartment policy

_Oracle Linux images enable the host firewall by default, so the port must be opened there too._

**Q6. Which OCI gateway should Exadata backups to Object Storage use?**

A. Internet gateway
B. NAT gateway
C. Service gateway  ✓
D. Local peering gateway

_The service gateway reaches Oracle services privately._

## Official reading

- [OCI Networking overview](https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/overview.htm)
- [OCI Dynamic Routing Gateways](https://docs.oracle.com/en-us/iaas/Content/Network/Tasks/managingDRGs.htm)
- [OCI FastConnect](https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/fastconnect.htm)
- [OCI Network Load Balancer](https://docs.oracle.com/en-us/iaas/Content/NetworkLoadBalancer/overview.htm)
