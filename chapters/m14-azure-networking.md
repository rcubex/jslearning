# Module 14: Azure Networking

**Level:** 4 · **Lessons:** 8

## A real-world thread: Azure hub-and-spoke organisation

Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: VNets and subnets

An Azure **virtual network (VNet)** is regional and has one or more address spaces. **Subnets** span every availability zone in the region; you pick the zone per VM or per zone-redundant service.

Several Azure services require a **dedicated subnet with a fixed name** and minimum size:

- **GatewaySubnet** for VPN and ExpressRoute gateways (/27 or larger recommended)
- **AzureFirewallSubnet** for Azure Firewall (/26)
- **AzureBastionSubnet** for Azure Bastion (/26 or larger)
- **RouteServerSubnet** for Azure Route Server (/26 or larger)

Other services use **subnet delegation**, which hands a subnet to a PaaS service (such as Azure SQL Managed Instance, App Service VNet integration or Azure Container Instances) so it can create its own resources there.

```text
az network vnet create -g rg-net-prod -n vnet-prod-uaen \
  --address-prefixes 10.20.0.0/16 \
  --subnet-name snet-app --subnet-prefixes 10.20.1.0/24
az network vnet subnet create -g rg-net-prod --vnet-name vnet-prod-uaen \
  -n snet-data --address-prefixes 10.20.2.0/24
```

> **Watch out:** Azure reserves 5 addresses per subnet, and you cannot resize a subnet that has resources in it. Size dedicated subnets generously from the start.

**Build the mental model:** GatewaySubnet for VPN and ExpressRoute gateways (/27 or larger recommended). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Azure hub-and-spoke organisation:** Consider how “vnets and subnets” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For vnets and subnets, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain vnets and subnets to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: NSGs, ASGs and service tags

A **network security group (NSG)** is a stateful list of allow and deny rules, evaluated by **priority** (100–4096, lowest number first, first match wins). Attach NSGs to subnets, NICs or both; traffic must pass both if both are present.

Every NSG has **default rules** at priorities 65000+: allow traffic within the VNet (`VirtualNetwork` tag), allow Azure Load Balancer probes, allow all outbound to the Internet, and deny everything else inbound.

Two features make NSG rules much cleaner:

- **Service tags** are Microsoft-maintained groups of IP ranges, such as `Internet`, `VirtualNetwork`, `AzureLoadBalancer`, `Storage`, `Sql.UAENorth` or `AzureCloud`. They update automatically.
- **Application security groups (ASGs)** group NICs by role. A rule like "allow 1433 from asg-app to asg-db" follows VMs regardless of their IPs.

```text
Priority 100  Allow  TCP 1433  from ASG asg-app   to ASG asg-db
Priority 4000 Deny   Any       from VirtualNetwork to Any
(defaults below: AllowVnetInBound would otherwise allow all VNet traffic)
```

> **Tip:** The default "AllowVnetInBound" rule allows all traffic inside the VNet, including from peered VNets. Add an explicit deny above it on sensitive subnets.

**Build the mental model:** Service tags are Microsoft-maintained groups of IP ranges, such as Internet, VirtualNetwork, AzureLoadBalancer, Storage, Sql.UAENorth or AzureCloud. They update automatically. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Azure hub-and-spoke organisation:** Consider how “nsgs, asgs and service tags” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For nsgs, asgs and service tags, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain nsgs, asgs and service tags to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Routing, UDRs and Route Server

Azure creates **system routes** automatically: local VNet traffic, peered VNets, gateway-learned routes and a default route to the Internet.

**User-defined routes (UDRs)** in **route tables** attached to subnets override them. Each route has a next hop type: **Virtual appliance** (a firewall's private IP), **Virtual network gateway**, **Internet**, **Virtual network** or **None** (drop).

The most common UDR sends everything leaving a spoke subnet through the hub firewall:

```text
Route table rt-spoke-app (attached to snet-app)
  0.0.0.0/0     → Virtual appliance 10.0.1.4   (Azure Firewall private IP)
  10.0.0.0/8    → Virtual appliance 10.0.1.4   (east-west inspection)
Option on the route table: disable BGP route propagation if on-prem routes should also go via the firewall
```

**Azure Route Server** lets network virtual appliances (third-party firewalls, SD-WAN routers) exchange routes with the VNet using **BGP**, so you don't have to maintain UDRs by hand.

> **Tip:** In the portal, a VM's NIC shows **Effective routes** and **Effective security rules**. These are the first things to check when traffic goes the wrong way.

**Build the mental model:** Azure creates **system routes** automatically: local VNet traffic, peered VNets, gateway-learned routes and a default route to the Internet. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Azure hub-and-spoke organisation:** Consider how “routing, udrs and route server” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For routing, udrs and route server, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain routing, udrs and route server to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: Hub-and-spoke, Virtual WAN and Virtual Network Manager

**VNet peering** connects VNets in the same region or across regions (global peering) over Microsoft's backbone with low latency. It is **non-transitive**: two spokes peered to the same hub cannot talk to each other unless traffic is routed through something in the hub (a firewall or NVA) with UDRs.

The **hub-and-spoke** pattern puts shared services in a **hub VNet**: Azure Firewall, VPN/ExpressRoute gateways, Bastion and DNS resolvers. Each workload gets a **spoke VNet** peered to the hub. Peering options **Allow gateway transit** (on the hub) and **Use remote gateways** (on the spoke) let spokes use the hub's VPN/ExpressRoute gateway.

**Azure Virtual WAN** is a Microsoft-managed hub: you deploy **virtual hubs** per region, connect VNets, VPN sites, ExpressRoute and remote users, and the hubs route between all of them automatically. A **secured virtual hub** includes Azure Firewall and routing intent to inspect traffic.

**Azure Virtual Network Manager (AVNM)** manages connectivity and security at scale: create hub-and-spoke or mesh topologies across many VNets and subscriptions, and apply **security admin rules** that override NSGs (for example, "always deny RDP from the Internet").

> **Tip:** Choose self-managed hub-and-spoke when you need full control or third-party appliances; choose Virtual WAN when you have many branches and regions and want Microsoft to manage the routing.

**Build the mental model:** **VNet peering** connects VNets in the same region or across regions (global peering) over Microsoft's backbone with low latency. It is **non-transitive**: two spokes peered to the same hub cannot talk to each other unle. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Azure hub-and-spoke organisation:** Consider how “hub-and-spoke, virtual wan and virtual network manager” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For hub-and-spoke, virtual wan and virtual network manager, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain hub-and-spoke, virtual wan and virtual network manager to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: Private Endpoints and Private DNS

Azure PaaS services (Storage, SQL Database, Key Vault, Cosmos DB and many more) have public endpoints by default. Two ways keep traffic private:

- **Service endpoints**: extend your VNet identity to the service over the Azure backbone; the service's firewall can then allow only your subnet. The service still uses its public IP.
- **Private Endpoints** (Azure Private Link): a NIC with a **private IP in your subnet** that maps to one specific resource (one storage account, one SQL server). You can then disable public access entirely. This is the recommended approach.

Private Endpoints need DNS to work: the public name `mystorage.blob.core.windows.net` must resolve to the private IP. Azure does this with a CNAME to `mystorage.privatelink.blob.core.windows.net` and a **Private DNS zone** `privatelink.blob.core.windows.net` linked to your VNets.

For hybrid DNS, **Azure DNS Private Resolver** provides an **inbound endpoint** (on-premises DNS forwards Azure zones to it) and an **outbound endpoint** with forwarding rulesets (Azure resolves on-premises zones).

> **Watch out:** The most common Private Endpoint problem is DNS: on-premises clients still resolve the public IP. Forward `privatelink.*` zones (or the service zones) to the Private Resolver inbound endpoint.

**Build the mental model:** Service endpoints: extend your VNet identity to the service over the Azure backbone; the service's firewall can then allow only your subnet. The service still uses its public IP. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Azure hub-and-spoke organisation:** Consider how “private endpoints and private dns” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For private endpoints and private dns, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain private endpoints and private dns to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: Load balancing and edge services

Azure has four main traffic services:

- **Azure Load Balancer** (Standard SKU): regional L4, TCP/UDP, zone-redundant, internal or public. Also used for outbound rules.
- **Application Gateway v2**: regional L7 reverse proxy with path and host routing, TLS termination, autoscaling and **Web Application Firewall** (OWASP rule sets, bot protection).
- **Azure Front Door** (Standard/Premium): global L7 entry point on Microsoft's edge, with CDN caching, WAF, and Private Link to origins (Premium).
- **Traffic Manager**: DNS-based global routing (priority, weighted, performance, geographic).

Protection: **Azure DDoS Protection** (network-level, per VNet) and **Azure Firewall** in three SKUs: Basic, Standard (FQDN filtering, threat intelligence) and Premium (TLS inspection, IDPS, URL filtering).

> **Tip:** A typical global web app: Front Door (WAF) → Application Gateway or AKS ingress in two regions → private backends. For a single region: Application Gateway with WAF in front of private backends.

**Build the mental model:** Azure Load Balancer (Standard SKU): regional L4, TCP/UDP, zone-redundant, internal or public. Also used for outbound rules. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Azure hub-and-spoke organisation:** Consider how “load balancing and edge services” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For load balancing and edge services, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain load balancing and edge services to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 7: Hybrid connectivity on Azure

**VPN Gateway** provides site-to-site IPsec (IKEv1/IKEv2), point-to-site for users, and VNet-to-VNet tunnels. SKUs (VpnGw1–5 and their zone-redundant **AZ** variants) set throughput and tunnel counts. Deploy **active-active** with BGP for resilience.

**ExpressRoute** provides private connectivity through a connectivity provider or directly (**ExpressRoute Direct**, 10 or 100 Gbps ports):

- An **ExpressRoute circuit** has two connections for redundancy.
- **Private peering** reaches your VNets; **Microsoft peering** reaches Microsoft 365 and Azure public services.
- **ExpressRoute Global Reach** links your on-premises sites to each other through Microsoft's backbone.
- **FastPath** sends traffic directly to VMs, bypassing the gateway, for higher performance.
- Premium add-on extends reach across geopolitical regions and raises route limits.

```text
Two ExpressRoute circuits in different peering locations
  → zone-redundant ExpressRoute gateway (ErGw*AZ) in the hub
Site-to-Site VPN (active-active, BGP) as backup over the Internet
BGP: on-prem advertises summaries; prefer ExpressRoute by default
```

> **Watch out:** ExpressRoute is not encrypted by default. Use MACsec on ExpressRoute Direct, or run IPsec over private peering when encryption is required.

**Build the mental model:** An ExpressRoute circuit has two connections for redundancy. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Azure hub-and-spoke organisation:** Consider how “hybrid connectivity on azure” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For hybrid connectivity on azure, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain hybrid connectivity on azure to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 8: Operating and troubleshooting Azure networks

**Azure Network Watcher** is the toolbox:

- **IP flow verify**: is a specific packet to or from a VM allowed, and by which NSG rule?
- **Next hop**: where would traffic to a given IP go, and which route table decides it?
- **Connection troubleshoot**: test reachability from a VM to an endpoint, with hop-by-hop details.
- **Packet capture**: capture traffic on a VM to a storage account.
- **VNet flow logs**: record flows across a VNet (they replace the older NSG flow logs), viewable with **Traffic Analytics**.
- **Connection monitor**: continuous reachability and latency tests.

```text
az network watcher test-ip-flow -g rg-app --vm vm-app1 \
  --direction Inbound --protocol TCP --local 10.20.1.4:443 --remote 10.0.1.10:50000
az network watcher show-next-hop -g rg-app --vm vm-app1 \
  --source-ip 10.20.1.4 --dest-ip 10.30.2.5
az network nic show-effective-route-table -g rg-app -n nic-app1 -o table
```

> **Tip:** If IP flow verify says "Allowed" and traffic still fails, the problem is not the NSG: check routes (next hop), the guest OS firewall, and whether the application is listening.

**Build the mental model:** IP flow verify: is a specific packet to or from a VM allowed, and by which NSG rule?. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Azure hub-and-spoke organisation:** Consider how “operating and troubleshooting azure networks” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For operating and troubleshooting azure networks, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain operating and troubleshooting azure networks to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
