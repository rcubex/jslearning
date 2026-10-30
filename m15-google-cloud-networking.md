# Module 22: Google Cloud Networking

**Level:** 4 · **Lessons:** 10 · **Questions:** 6

_Use the global VPC, Shared VPC and Google’s load balancers well._

## Lesson 1: The global VPC

A Google Cloud **VPC network** is a **global** resource. **Subnets** are regional, and each has a primary IPv4 range and optional **secondary ranges** (used for GKE Pods and Services). VMs in any region of the same VPC communicate over internal IPs across Google's private backbone, with no peering or VPN.

VPCs come in two modes. **Auto mode** creates a /20 subnet in every region from 10.128.0.0/9; convenient for labs but it will overlap with other auto-mode VPCs and wastes space. **Custom mode** lets you create exactly the subnets you need. Use custom mode for anything real; the `default` network in new projects is auto mode, so delete it.

**Create a custom-mode VPC with two regional subnets (gcloud)**

```
gcloud compute networks create vpc-prod --subnet-mode=custom
gcloud compute networks subnets create snet-me-central1 --network=vpc-prod \
  --region=me-central1 --range=10.30.0.0/20 \
  --secondary-range=pods=10.31.0.0/16,services=10.32.0.0/20 \
  --enable-private-ip-google-access
gcloud compute networks subnets create snet-europe-west1 --network=vpc-prod \
  --region=europe-west1 --range=10.30.16.0/20
```

Google Cloud also offers two **network service tiers**: **Premium** (traffic enters and leaves Google's network close to the user; required for global load balancing) and **Standard** (traffic uses the public Internet more; cheaper, regional only).

> **Tip:** You can expand a subnet's primary range later (for example /20 → /19) without downtime, but you can't shrink it. Start reasonably and grow.

## Lesson 2: Firewall rules and policies

Google Cloud's distributed firewall (**Cloud NGFW**) is stateful and enforced at each VM. Every VPC has two **implied rules**: allow all egress, and deny all ingress (priority 65535).

Rules have a **priority** (0–65535, lower wins; default 1000), a direction, an action, a source or destination, protocols and ports, and a **target**:

- **All instances** in the network
- **Network tags** (free-text labels on VMs; anyone who can edit the VM can change them)
- **Service accounts** (stronger, because changing a VM's service account needs IAM permission)
- **Secure tags** (IAM-governed tags, usable in firewall policies)

There are several layers, evaluated in order: **hierarchical firewall policies** (at organization and folder level, set by the security team), **global and regional network firewall policies** (attached to a VPC), then **VPC firewall rules**. Cloud NGFW **Enterprise** adds intrusion prevention (IPS) and TLS inspection.

**Allow load balancer health checks and HTTPS to web servers**

```
gcloud compute firewall-rules create allow-hc-and-web --network=vpc-prod \
  --direction=INGRESS --action=ALLOW --rules=tcp:443,tcp:8080 \
  --source-ranges=35.191.0.0/16,130.211.0.0/22 \
  --target-service-accounts=web-sa@my-proj.iam.gserviceaccount.com
```

> **Tip:** Use **Firewall Insights** to find shadowed, unused and overly permissive rules, and enable **firewall rules logging** on the rules you need to audit.

## Lesson 3: Shared VPC, peering and Network Connectivity Center

**Shared VPC** lets a **host project** own the VPC while **service projects** deploy VMs, GKE clusters and serverless connectors into its subnets. The network team keeps control of subnets, routes and firewalls; app teams get `roles/compute.networkUser` on chosen subnets. This is Google's recommended pattern for organisations.

**VPC Network Peering** connects two VPCs (in any projects or organisations) with internal IP connectivity. It is **non-transitive** and the ranges must not overlap. Each side controls whether it imports and exports custom routes.

**Network Connectivity Center (NCC)** is a hub-and-spoke service. **VPC spokes** connect many VPCs through a central hub with full mesh or star topologies, and **hybrid spokes** (HA VPN tunnels, Interconnect attachments, router appliances) can use Google's backbone to connect your sites to each other.

> **Tip:** A common enterprise layout: one Shared VPC host project per environment (prod, non-prod), each with regional subnets, connected to on-premises with Interconnect, and NCC when you need many VPCs to talk.

## Lesson 4: Cloud Router and Cloud NAT

**Cloud Router** is a managed BGP speaker. It exchanges routes with your on-premises routers over HA VPN and Interconnect, and advertises your VPC subnets automatically (or custom ranges you choose). The VPC's **dynamic routing mode** decides whether learned routes apply only in the Cloud Router's region (**regional**) or in all regions (**global**).

**Cloud NAT** gives VMs without external IPs outbound Internet access. It is not a VM or appliance: it is software-defined and configured on a Cloud Router, per region. You choose which subnets use it and whether it uses automatically allocated or reserved external IPs. **Dynamic port allocation** helps busy VMs avoid port exhaustion. **Private NAT** translates between overlapping private ranges (for example, between VPCs connected via NCC).

**Cloud NAT for a region**

```
gcloud compute routers create cr-me-central1 --network=vpc-prod --region=me-central1
gcloud compute routers nats create nat-me-central1 --router=cr-me-central1 \
  --region=me-central1 --auto-allocate-nat-external-ips \
  --nat-all-subnet-ip-ranges --enable-dynamic-port-allocation
```

> **Watch out:** Cloud NAT does not handle inbound connections. VMs behind it remain unreachable from the Internet, which is usually what you want.

## Lesson 5: Private Google Access and Private Service Connect

**Private Google Access** (a per-subnet setting) lets VMs without external IPs reach Google APIs such as Cloud Storage and BigQuery. Combine it with the special domains `private.googleapis.com` (199.36.153.8/30) or `restricted.googleapis.com` (199.36.153.4/30, for use with VPC Service Controls), and DNS that points `*.googleapis.com` at them.

**Private Service Connect (PSC)** creates **endpoints** with internal IPs in your VPC:

- PSC endpoints for **Google APIs** (an internal IP for all supported APIs)
- PSC endpoints for **published services**: services from other VPCs, other organisations or Google-managed services (such as Cloud SQL, AlloyDB, Vertex AI). Producers publish a **service attachment**, consumers create an endpoint. Address ranges can overlap.

**VPC Service Controls** adds a security perimeter around Google-managed services to stop data exfiltration, even by someone with valid credentials.

> **Tip:** For Cloud SQL and other managed databases, choose a private IP (via PSC or private services access) and disable the public IP.

## Lesson 6: Load balancing, Cloud CDN and Cloud Armor

Google Cloud load balancers are software-defined and many are **global**:

- **Application Load Balancers** (L7, HTTP/HTTPS): **global external** (one anycast IP worldwide, routing users to the nearest healthy backend in any region), regional external, regional internal and cross-region internal.
- **Proxy Network Load Balancers** (L4 TCP proxy, with optional SSL offload): global or regional.
- **Passthrough Network Load Balancers** (L4, TCP/UDP/ESP/ICMP): regional, preserve client IPs, backends see the original packets.

Backends are **instance groups**, **network endpoint groups (NEGs)** for containers, serverless (Cloud Run) or Internet backends.

**Cloud CDN** caches content at Google's edge for global external Application Load Balancers. **Cloud Armor** adds WAF rules (preconfigured OWASP rules), rate limiting, geo-blocking, bot management and DDoS protection, attached as security policies to backend services.

> **Tip:** A single global external Application Load Balancer with backends in two regions gives you multi-region failover with one IP address and one TLS certificate, without DNS tricks.

## Lesson 7: Hybrid connectivity on Google Cloud

**Cloud VPN** connects through IPsec:

- **HA VPN**: a gateway with two interfaces (two public IPs). With two tunnels to your peer devices and BGP via Cloud Router, it offers a **99.99% SLA**. This is the recommended option.
- **Classic VPN**: a single interface, 99.9% SLA, mostly legacy.

**Cloud Interconnect** provides private connections:

- **Dedicated Interconnect**: your own 10 Gbps or 100 Gbps circuits in a Google colocation facility.
- **Partner Interconnect**: through a service provider, from 50 Mbps to 50 Gbps.
- **Cross-Cloud Interconnect**: dedicated links from Google Cloud to other clouds (AWS, Azure, OCI, Alibaba).

**VLAN attachments** connect an Interconnect to a Cloud Router in a region. For 99.99% availability Google requires connections in two metropolitan areas with four connections in total; 99.9% needs two connections in one metro, in different edge availability domains.

> **Tip:** HA VPN over Interconnect lets you encrypt traffic across a private Interconnect when compliance requires it.

## Lesson 8: Operating and troubleshooting Google Cloud networks

**Network Intelligence Center** groups the analysis tools:

- **Connectivity Tests**: static analysis of a path between two endpoints (VMs, IPs, load balancers, Cloud SQL), showing which route or firewall rule allows or drops it, plus an optional live data-plane check.
- **Network Topology**: a live map of your VPCs, regions and traffic.
- **Performance Dashboard**: packet loss and latency between zones and regions.
- **Firewall Insights**: shadowed, unused and overly broad rules.
- **Network Analyzer**: automatic detection of misconfigurations such as IP exhaustion or invalid routes.

Logging: **VPC Flow Logs** (sampled flow records per subnet), **firewall rules logging**, **Cloud NAT logging**, and **Packet Mirroring** to send copies of traffic to an inspection tool.

**Run a connectivity test**

```
gcloud network-management connectivity-tests create app-to-db \
  --source-instance=projects/p/zones/me-central1-a/instances/app-1 \
  --destination-ip-address=10.30.4.5 --destination-port=5432 --protocol=TCP
gcloud network-management connectivity-tests describe app-to-db
```

> **Tip:** Connectivity Tests understand GKE, Cloud SQL, load balancers and hybrid routes. Run one before guessing.

## Lesson 9: Deep dive: designing Shared VPC at scale

Large Google Cloud organisations usually run a few **Shared VPC host projects** rather than many small VPCs. Design choices that matter:

- **How many host projects**: typically one per environment (prod, non-prod) so environments are isolated at the network level, sometimes split further for regulated workloads.
- **Subnets per region and per team**: give each team (or service project) its own subnet(s) in each region they use, and grant `compute.networkUser` only on those subnets. This keeps teams from deploying into each other's subnets.
- **Secondary ranges for GKE**: plan pod and Service ranges per cluster, sized for growth (Module 21). GKE can also add extra pod ranges later (discontiguous multi-Pod CIDR), but planning avoids pain.
- **Firewalls**: hierarchical firewall policies at organisation and folder level for global rules (allow health checks and IAP, deny known-bad ranges); network firewall policies for environment rules; team-specific rules targeting service accounts or secure tags.
- **Hybrid connectivity** lives in the host project: Cloud Routers, HA VPN or Interconnect VLAN attachments, with **global dynamic routing** if all regions need on-premises routes.
- **Connecting environments**: if prod and non-prod must share services, use **Network Connectivity Center** with VPC spokes and filtering, or Private Service Connect for specific services, rather than peering everything.

**Example layout**

```
Organization
├─ folder: prod     → host project net-prod-host  (vpc-prod: subnets per region per team)
│                      service projects: payments-prod, web-prod, data-prod
├─ folder: nonprod  → host project net-nonprod-host
└─ folder: shared   → project net-hub (Interconnect, Cloud Routers, NCC hub)
```

> **Tip:** Use custom IAM conditions or subnet-level bindings so each team's service account can only use its own subnets. The most common Shared VPC mistake is granting networkUser on the whole host project.

## Lesson 10: Real-world scenario: GKE cluster creation fails with IP errors

**Situation.** A team tries to create a new GKE cluster in a Shared VPC subnet and gets errors about insufficient IP space for Pods. The subnet has plenty of free primary addresses.

**Investigation.**

1. The cluster uses VPC-native networking with a **secondary range** for Pods. The team reused an existing `/20` secondary range (4,096 addresses).
2. With the default of 110 max Pods per node, GKE reserves a **/24 of Pod IPs per node** (256 addresses). A /20 therefore supports only 16 nodes, and other clusters were already using part of that range.
3. The new cluster's requested node count exceeded what was left.

**Fix.**

1. Create a new, dedicated Pod secondary range (a /16) for this cluster in the subnet.
2. Lower **max Pods per node** to 32 for this workload (GKE then reserves a /26 per node), quadrupling how many nodes fit in a given range.
3. Document Pod range sizing in the network design: nodes × per-node reservation, plus room for upgrades (surge nodes).

**Lessons learned.** In GKE, IP planning is per node, not per Pod. The max-Pods-per-node setting decides how much address space every node consumes.

## Key takeaways

- One global VPC with regional subnets; use custom mode and plan secondary ranges for GKE.
- Firewall policies plus service-account or secure-tag targets give scalable, IAM-controlled rules.
- Shared VPC is the standard way to centralise networking across projects.
- Cloud NAT, Private Google Access and Private Service Connect keep VMs private.

## Checkpoint

**Q1. How do two VMs in different regions of the same Google Cloud VPC communicate?**

A. They need VPC peering
B. Directly over internal IPs  ✓
C. Only via Cloud NAT
D. Only via VPN

_The VPC is global, so internal routing works across regions._

**Q2. Which service gives private VMs outbound Internet access without a NAT VM?**

A. Cloud Router
B. Cloud NAT  ✓
C. Private Google Access
D. Cloud Armor

_Cloud NAT is a managed, software-defined NAT._

**Q3. Why is targeting firewall rules by service account stronger than by network tag?**

A. Service accounts are faster
B. Changing a VM's service account requires IAM permission, while tags can be edited by anyone who can edit the VM  ✓
C. Tags don't work with ingress rules
D. Service accounts are free

_Service-account targets tie firewall scope to IAM, preventing users from tagging their way past rules._

**Q4. What does HA VPN need to reach its 99.99% SLA?**

A. One tunnel and static routes
B. Two tunnels using both gateway interfaces, with BGP via Cloud Router  ✓
C. A Classic VPN gateway
D. Dedicated Interconnect

_HA VPN's SLA requires both interfaces in use with dynamic routing._

**Q5. Which feature lets service projects deploy into subnets owned by a central project?**

A. VPC Network Peering
B. Shared VPC  ✓
C. Private Service Connect
D. Cloud Router

_Shared VPC separates network ownership (host project) from workload projects._

**Q6. With the default 110 max Pods per node, how much Pod address space does GKE reserve per node?**

A. A /28
B. A /26
C. A /24  ✓
D. A /20

_GKE reserves twice the max Pods rounded up to a power of two: 256 addresses, a /24._

## Official reading

- [Google Cloud VPC overview](https://cloud.google.com/vpc/docs/overview)
- [Cloud NGFW (firewall) overview](https://cloud.google.com/firewall/docs/about-firewalls)
- [Cloud Load Balancing overview](https://cloud.google.com/load-balancing/docs/load-balancing-overview)
- [Cloud NAT overview](https://cloud.google.com/nat/docs/overview)
- [Network Connectivity Center](https://cloud.google.com/network-connectivity/docs/network-connectivity-center/concepts/overview)
