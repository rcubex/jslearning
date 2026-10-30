# Module 21: Azure Networking

**Level:** 4 · **Lessons:** 10 · **Questions:** 6

_Design hub-and-spoke and private networks on Azure._

## Lesson 1: VNets and subnets

An Azure **virtual network (VNet)** is regional and has one or more address spaces. **Subnets** span every availability zone in the region; you pick the zone per VM or per zone-redundant service.

Several Azure services require a **dedicated subnet with a fixed name** and minimum size:

- **GatewaySubnet** for VPN and ExpressRoute gateways (/27 or larger recommended)
- **AzureFirewallSubnet** for Azure Firewall (/26)
- **AzureBastionSubnet** for Azure Bastion (/26 or larger)
- **RouteServerSubnet** for Azure Route Server (/26 or larger)

Other services use **subnet delegation**, which hands a subnet to a PaaS service (such as Azure SQL Managed Instance, App Service VNet integration or Azure Container Instances) so it can create its own resources there.

**Create a VNet with app and data subnets (Azure CLI)**

```
az network vnet create -g rg-net-prod -n vnet-prod-uaen \
  --address-prefixes 10.20.0.0/16 \
  --subnet-name snet-app --subnet-prefixes 10.20.1.0/24
az network vnet subnet create -g rg-net-prod --vnet-name vnet-prod-uaen \
  -n snet-data --address-prefixes 10.20.2.0/24
```

> **Watch out:** Azure reserves 5 addresses per subnet, and you cannot resize a subnet that has resources in it. Size dedicated subnets generously from the start.

## Lesson 2: NSGs, ASGs and service tags

A **network security group (NSG)** is a stateful list of allow and deny rules, evaluated by **priority** (100–4096, lowest number first, first match wins). Attach NSGs to subnets, NICs or both; traffic must pass both if both are present.

Every NSG has **default rules** at priorities 65000+: allow traffic within the VNet (`VirtualNetwork` tag), allow Azure Load Balancer probes, allow all outbound to the Internet, and deny everything else inbound.

Two features make NSG rules much cleaner:

- **Service tags** are Microsoft-maintained groups of IP ranges, such as `Internet`, `VirtualNetwork`, `AzureLoadBalancer`, `Storage`, `Sql.UAENorth` or `AzureCloud`. They update automatically.
- **Application security groups (ASGs)** group NICs by role. A rule like "allow 1433 from asg-app to asg-db" follows VMs regardless of their IPs.

**NSG rules for a data subnet**

```
Priority 100  Allow  TCP 1433  from ASG asg-app   to ASG asg-db
Priority 4000 Deny   Any       from VirtualNetwork to Any
(defaults below: AllowVnetInBound would otherwise allow all VNet traffic)
```

> **Tip:** The default "AllowVnetInBound" rule allows all traffic inside the VNet, including from peered VNets. Add an explicit deny above it on sensitive subnets.

## Lesson 3: Routing, UDRs and Route Server

Azure creates **system routes** automatically: local VNet traffic, peered VNets, gateway-learned routes and a default route to the Internet.

**User-defined routes (UDRs)** in **route tables** attached to subnets override them. Each route has a next hop type: **Virtual appliance** (a firewall's private IP), **Virtual network gateway**, **Internet**, **Virtual network** or **None** (drop).

The most common UDR sends everything leaving a spoke subnet through the hub firewall:

**Force tunnelling a spoke through Azure Firewall**

```
Route table rt-spoke-app (attached to snet-app)
  0.0.0.0/0     → Virtual appliance 10.0.1.4   (Azure Firewall private IP)
  10.0.0.0/8    → Virtual appliance 10.0.1.4   (east-west inspection)
Option on the route table: disable BGP route propagation if on-prem routes should also go via the firewall
```

**Azure Route Server** lets network virtual appliances (third-party firewalls, SD-WAN routers) exchange routes with the VNet using **BGP**, so you don't have to maintain UDRs by hand.

> **Tip:** In the portal, a VM's NIC shows **Effective routes** and **Effective security rules**. These are the first things to check when traffic goes the wrong way.

## Lesson 4: Hub-and-spoke, Virtual WAN and Virtual Network Manager

**VNet peering** connects VNets in the same region or across regions (global peering) over Microsoft's backbone with low latency. It is **non-transitive**: two spokes peered to the same hub cannot talk to each other unless traffic is routed through something in the hub (a firewall or NVA) with UDRs.

The **hub-and-spoke** pattern puts shared services in a **hub VNet**: Azure Firewall, VPN/ExpressRoute gateways, Bastion and DNS resolvers. Each workload gets a **spoke VNet** peered to the hub. Peering options **Allow gateway transit** (on the hub) and **Use remote gateways** (on the spoke) let spokes use the hub's VPN/ExpressRoute gateway.

**Azure Virtual WAN** is a Microsoft-managed hub: you deploy **virtual hubs** per region, connect VNets, VPN sites, ExpressRoute and remote users, and the hubs route between all of them automatically. A **secured virtual hub** includes Azure Firewall and routing intent to inspect traffic.

**Azure Virtual Network Manager (AVNM)** manages connectivity and security at scale: create hub-and-spoke or mesh topologies across many VNets and subscriptions, and apply **security admin rules** that override NSGs (for example, "always deny RDP from the Internet").

> **Tip:** Choose self-managed hub-and-spoke when you need full control or third-party appliances; choose Virtual WAN when you have many branches and regions and want Microsoft to manage the routing.

## Lesson 5: Private Endpoints and Private DNS

Azure PaaS services (Storage, SQL Database, Key Vault, Cosmos DB and many more) have public endpoints by default. Two ways keep traffic private:

- **Service endpoints**: extend your VNet identity to the service over the Azure backbone; the service's firewall can then allow only your subnet. The service still uses its public IP.
- **Private Endpoints** (Azure Private Link): a NIC with a **private IP in your subnet** that maps to one specific resource (one storage account, one SQL server). You can then disable public access entirely. This is the recommended approach.

Private Endpoints need DNS to work: the public name `mystorage.blob.core.windows.net` must resolve to the private IP. Azure does this with a CNAME to `mystorage.privatelink.blob.core.windows.net` and a **Private DNS zone** `privatelink.blob.core.windows.net` linked to your VNets.

For hybrid DNS, **Azure DNS Private Resolver** provides an **inbound endpoint** (on-premises DNS forwards Azure zones to it) and an **outbound endpoint** with forwarding rulesets (Azure resolves on-premises zones).

> **Watch out:** The most common Private Endpoint problem is DNS: on-premises clients still resolve the public IP. Forward `privatelink.*` zones (or the service zones) to the Private Resolver inbound endpoint.

## Lesson 6: Load balancing and edge services

Azure has four main traffic services:

- **Azure Load Balancer** (Standard SKU): regional L4, TCP/UDP, zone-redundant, internal or public. Also used for outbound rules.
- **Application Gateway v2**: regional L7 reverse proxy with path and host routing, TLS termination, autoscaling and **Web Application Firewall** (OWASP rule sets, bot protection).
- **Azure Front Door** (Standard/Premium): global L7 entry point on Microsoft's edge, with CDN caching, WAF, and Private Link to origins (Premium).
- **Traffic Manager**: DNS-based global routing (priority, weighted, performance, geographic).

Protection: **Azure DDoS Protection** (network-level, per VNet) and **Azure Firewall** in three SKUs: Basic, Standard (FQDN filtering, threat intelligence) and Premium (TLS inspection, IDPS, URL filtering).

> **Tip:** A typical global web app: Front Door (WAF) → Application Gateway or AKS ingress in two regions → private backends. For a single region: Application Gateway with WAF in front of private backends.

## Lesson 7: Hybrid connectivity on Azure

**VPN Gateway** provides site-to-site IPsec (IKEv1/IKEv2), point-to-site for users, and VNet-to-VNet tunnels. SKUs (VpnGw1–5 and their zone-redundant **AZ** variants) set throughput and tunnel counts. Deploy **active-active** with BGP for resilience.

**ExpressRoute** provides private connectivity through a connectivity provider or directly (**ExpressRoute Direct**, 10 or 100 Gbps ports):

- An **ExpressRoute circuit** has two connections for redundancy.
- **Private peering** reaches your VNets; **Microsoft peering** reaches Microsoft 365 and Azure public services.
- **ExpressRoute Global Reach** links your on-premises sites to each other through Microsoft's backbone.
- **FastPath** sends traffic directly to VMs, bypassing the gateway, for higher performance.
- Premium add-on extends reach across geopolitical regions and raises route limits.

**Typical resilient hybrid design**

```
Two ExpressRoute circuits in different peering locations
  → zone-redundant ExpressRoute gateway (ErGw*AZ) in the hub
Site-to-Site VPN (active-active, BGP) as backup over the Internet
BGP: on-prem advertises summaries; prefer ExpressRoute by default
```

> **Watch out:** ExpressRoute is not encrypted by default. Use MACsec on ExpressRoute Direct, or run IPsec over private peering when encryption is required.

## Lesson 8: Operating and troubleshooting Azure networks

**Azure Network Watcher** is the toolbox:

- **IP flow verify**: is a specific packet to or from a VM allowed, and by which NSG rule?
- **Next hop**: where would traffic to a given IP go, and which route table decides it?
- **Connection troubleshoot**: test reachability from a VM to an endpoint, with hop-by-hop details.
- **Packet capture**: capture traffic on a VM to a storage account.
- **VNet flow logs**: record flows across a VNet (they replace the older NSG flow logs), viewable with **Traffic Analytics**.
- **Connection monitor**: continuous reachability and latency tests.

**Quick checks from the CLI**

```
az network watcher test-ip-flow -g rg-app --vm vm-app1 \
  --direction Inbound --protocol TCP --local 10.20.1.4:443 --remote 10.0.1.10:50000
az network watcher show-next-hop -g rg-app --vm vm-app1 \
  --source-ip 10.20.1.4 --dest-ip 10.30.2.5
az network nic show-effective-route-table -g rg-app -n nic-app1 -o table
```

> **Tip:** If IP flow verify says "Allowed" and traffic still fails, the problem is not the NSG: check routes (next hop), the guest OS firewall, and whether the application is listening.

## Lesson 9: Deep dive: Azure landing zone networking

Microsoft's **Azure landing zone** reference architecture gives enterprises a standard starting point. Its networking part follows these principles:

- **Platform vs application landing zones**: a **connectivity subscription** (owned by the platform team) holds hubs, firewalls, gateways and DNS; **application landing zones** (one subscription per workload and environment) hold spokes.
- **Topology choice**: traditional **hub-and-spoke** (customer-managed hub VNet) or **Virtual WAN** (Microsoft-managed hubs). Both are supported; Virtual WAN suits many regions and branches.
- **Policy-driven guardrails**: Azure Policy assignments at management-group level deny public IPs on NICs, require NSGs on subnets, enforce Private Endpoints and DNS zone integration, and deploy diagnostics automatically.
- **Centralised Private DNS**: all `privatelink.*` zones live in the connectivity subscription and are linked to the hub; a policy automatically registers new Private Endpoints in the right zone.
- **Subscription vending**: new workload subscriptions are created by automation, with a spoke VNet peered to the hub and an address range allocated from IPAM.

**Management group layout (simplified)**

```
Tenant root
└─ Contoso
   ├─ Platform
   │  ├─ Connectivity  (hub VNets / Virtual WAN, Azure Firewall, ExpressRoute, DNS)
   │  ├─ Identity
   │  └─ Management    (Log Analytics, Sentinel)
   ├─ Landing zones
   │  ├─ Corp    (internal apps, connected to hub, no public endpoints)
   │  └─ Online  (Internet-facing apps)
   └─ Sandbox
```

> **Tip:** The **Corp** vs **Online** split is useful: Corp landing zones get strict "no public anything" policies; Online landing zones allow public entry only through approved services like Front Door or Application Gateway with WAF.

## Lesson 10: Real-world scenario: peered spokes that couldn't talk

**Situation.** An Azure hub-and-spoke has a hub VNet with Azure Firewall and two spokes (app and data), each peered to the hub. The app servers can reach the Internet through the firewall, but cannot connect to the database in the data spoke. Both teams say "the peering is connected".

**Investigation.**

1. **Effective routes** on the app VM's NIC show `0.0.0.0/0 → 10.0.1.4` (the firewall), from the UDR, but **no route for the data spoke's range**. VNet peering is non-transitive, so the app spoke learns nothing about the data spoke.
2. Traffic to the data spoke's IP therefore matches `0.0.0.0/0` and goes to the firewall, which is the intended design.
3. **Azure Firewall logs** show the traffic arriving and being denied: there's no network rule allowing app subnet → data subnet on 1433.
4. Once a firewall rule is added, the database still doesn't answer: the **data spoke** has no UDR, so return traffic goes directly back to the app spoke via peering... except there's no peering between spokes, so the return goes nowhere and asymmetric routing breaks the firewall's state.

**Fix.**

1. Add a firewall network rule: app subnet → data subnet, TCP 1433.
2. Attach a route table to the data spoke subnets with routes to other spokes (or `0.0.0.0/0`) via the firewall, so return traffic is symmetric.
3. Document the pattern: every spoke subnet gets the same UDR template.

**Lessons learned.** In hub-and-spoke, spoke-to-spoke traffic needs three things: routes in both spokes pointing to the hub firewall, firewall rules allowing the flow, and symmetry on the return path.

## Key takeaways

- VNets are regional, subnets are zone-spanning; several services need their own named subnet.
- NSGs with service tags and ASGs are the core filter; UDRs force traffic through a firewall.
- Hub-and-spoke (or Virtual WAN) is the standard enterprise topology.
- Private Endpoints plus Private DNS zones keep PaaS traffic off the Internet.

## Checkpoint

**Q1. Two spoke VNets are both peered to a hub. By default, can they reach each other?**

A. Yes
B. No  ✓
C. Only through Bastion
D. Only over IPv6

_Peering is non-transitive; route through a hub firewall or use Virtual WAN._

**Q2. Which Azure service is a global L7 entry point with CDN features?**

A. Application Gateway
B. Load Balancer
C. Front Door  ✓
D. VPN Gateway

_Front Door is global; Application Gateway is regional._

**Q3. What must the subnet for an Azure VPN or ExpressRoute gateway be named?**

A. VpnSubnet
B. HubSubnet
C. GatewaySubnet  ✓
D. AzureGatewaySubnet

_Gateways deploy only into a subnet named exactly GatewaySubnet._

**Q4. A Private Endpoint for a storage account is created, but on-premises clients still reach the public IP. What is the likely cause?**

A. The NSG blocks traffic
B. The Private Endpoint is in the wrong region
C. On-premises DNS is not forwarding the privatelink zone to Azure  ✓
D. ExpressRoute is down

_Private Endpoints depend on DNS resolving the name to the private IP._

**Q5. Which NSG feature lets rules target VMs by role instead of IP address?**

A. Service tags
B. Application security groups  ✓
C. Route tables
D. Subnet delegation

_ASGs group NICs so rules follow workloads, not addresses._

**Q6. In Azure hub-and-spoke, what is needed for spoke-to-spoke traffic through the hub firewall?**

A. Only VNet peering between each spoke and the hub
B. UDRs in both spokes pointing at the firewall, plus firewall rules allowing the flow  ✓
C. A VPN gateway in each spoke
D. Service endpoints

_Peering is non-transitive; routing via the firewall must be explicit and symmetric._

## Official reading

- [Azure Virtual Network documentation](https://learn.microsoft.com/en-us/azure/virtual-network/)
- [Azure hub-spoke topology](https://learn.microsoft.com/en-us/azure/architecture/networking/architecture/hub-spoke)
- [Azure Private Link and Private Endpoint](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview)
- [Azure ExpressRoute](https://learn.microsoft.com/en-us/azure/expressroute/expressroute-introduction)
- [Azure Network Watcher](https://learn.microsoft.com/en-us/azure/network-watcher/network-watcher-overview)
