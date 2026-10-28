# Module 18: Serverless & PaaS Networking

**Level:** 3 · **Lessons:** 7 · **Questions:** 5

_Connect functions, containers, app platforms and managed databases privately and securely._

## Lesson 1: How managed services meet your network

With virtual machines, the network is obvious: the VM has a NIC in your subnet. With serverless and PaaS (functions, container platforms, app services, managed databases), the compute runs in the **provider's** network, and you choose how it connects to yours.

Always answer two separate questions:

1. **Inbound**: how do clients reach the service? Over a public endpoint on the Internet, a public endpoint restricted by IP rules, or a **private endpoint** with an IP inside your network?
2. **Outbound**: when the service calls something (a database, an internal API, the Internet), which network does that traffic use? The provider's default Internet path, or **your network** through VPC/VNet integration, with your routes, firewalls and NAT?

Two more terms help: the **control plane** is the provider's management API (deploying, configuring), which stays on the provider's public endpoints; the **data plane** is your application traffic, which is what you're securing.

**The four combinations for a web app calling a private database**

```
Inbound public  + outbound default   → app can't reach the private DB at all
Inbound public  + outbound integrated → typical: public site, private DB access
Inbound private + outbound integrated → fully private internal app
Inbound private + outbound default   → internal app that can't reach private resources (rarely useful)
```

> **Tip:** Draw these two arrows (in and out) for every managed service in your design. Most "it can't connect" problems are about the outbound arrow.

## Lesson 2: AWS: Lambda, Fargate and API Gateway

**AWS Lambda** runs, by default, in an AWS-managed network with Internet access but no access to your private resources. When you **attach a function to your VPC** (choosing subnets and security groups), Lambda creates shared **Hyperplane ENIs** in those subnets, and the function's outbound traffic now flows through your VPC.

Consequences:

- The function can reach RDS, ElastiCache and internal services privately.
- It **loses default Internet access**. To call the Internet or public AWS APIs it needs a **NAT gateway** route, or **VPC endpoints** for AWS services (S3 gateway endpoint, interface endpoints for STS, Secrets Manager, SQS, and so on).
- Security groups on the function control what it can reach, and database security groups should allow the function's security group.

**Amazon ECS on Fargate** uses **awsvpc** networking: every task gets its own ENI and private IP in your subnet, with its own security group. Tasks pulling images from ECR in private subnets need NAT or the ECR, S3 and CloudWatch Logs endpoints.

**API Gateway** can be public (regional or edge-optimised) or **private**, reachable only through an `execute-api` interface endpoint in your VPC. It reaches private backends through **VPC links** to NLBs or ALBs.

> **Watch out:** A Lambda function in a private subnet that "times out" calling an external API almost always has no NAT route. It's networking, not code.

## Lesson 3: Azure: App Service, Functions, Container Apps and API Management

Azure separates inbound and outbound clearly for its app platforms.

**App Service and Azure Functions**:

- **Inbound**: public by default; add **access restrictions** (IP or service-tag rules) or a **private endpoint** to make the app reachable only from your network, then disable public access.
- **Outbound**: **regional VNet integration** connects the app to a **delegated subnet** in your VNet. Its traffic to private IPs (and, with "route all", all traffic) follows your VNet's routes, NSGs and NAT gateway or firewall. Size the integration subnet for scaling (a /26 or larger is a safe start).

**Azure Container Apps** runs inside a **Container Apps environment** that you can deploy into your own VNet (internal or external ingress). **Azure Kubernetes Service** follows the networking options covered in Module 21.

**API Management** can be deployed into a VNet in **external** mode (public gateway, private backends) or **internal** mode (gateway only on a private IP), often behind Application Gateway with WAF.

**App with private inbound and private outbound (summary)**

```
Private endpoint: app-orders → 10.20.5.10 in snet-pe
VNet integration: delegated subnet snet-appint 10.20.6.0/26, route all = on
UDR on snet-appint: 0.0.0.0/0 → Azure Firewall
Azure SQL: private endpoint 10.20.5.20, public network access disabled
Private DNS zones: privatelink.azurewebsites.net, privatelink.database.windows.net
```

> **Tip:** For App Service, inbound and outbound are independent. A private endpoint alone does not let the app reach private resources, and VNet integration alone does not make the app private.

## Lesson 4: Google Cloud: Cloud Run and serverless

**Cloud Run** (which also runs **Cloud Run functions**) runs containers on Google-managed infrastructure.

**Inbound** is controlled by the **ingress setting**: `all` (Internet), `internal` (only from your VPC networks, Shared VPC and some Google services), or `internal-and-cloud-load-balancing` (also through your external Application Load Balancer, so you can add Cloud Armor and custom domains). Combine with IAM authentication (`--no-allow-unauthenticated`) for private services.

**Outbound** to your VPC uses either:

- **Direct VPC egress** (recommended): instances get IPs directly from a subnet you choose, with no connector to manage, lower latency and firewall rules that can target them by network tag.
- **Serverless VPC Access connector**: an older approach using connector VMs in a small /28 subnet.

You choose whether **all traffic** or only **private ranges** go through the VPC. Sending all traffic lets you use Cloud NAT with a static IP, which matters when a partner allow-lists your address.

**Deploy Cloud Run with Direct VPC egress**

```
gcloud run deploy orders --image=me-central1-docker.pkg.dev/p/repo/orders:1.4 \
  --region=me-central1 --network=vpc-prod --subnet=snet-run \
  --vpc-egress=all-traffic --ingress=internal-and-cloud-load-balancing \
  --no-allow-unauthenticated
```

> **Tip:** Size the Direct VPC egress subnet for scale: each running instance uses IP addresses, so give it room (a /24 or larger for busy services).

## Lesson 5: OCI: Functions, API Gateway and Container Instances

On OCI, serverless resources are placed directly into **your subnets**:

- **OCI Functions**: each application is associated with one or more subnets. Functions in a **private subnet** need a **service gateway** (to reach Oracle services such as Object Storage, Vault and the container registry) and a **NAT gateway** for Internet calls. NSGs can be attached to function applications.
- **OCI API Gateway**: deployed into a public or private subnet, routing to backends (functions, HTTP services, private IPs). A private gateway is reachable only from the VCN and connected networks.
- **OCI Container Instances**: serverless containers that get VNICs in your subnet, with NSGs, like a small VM.
- **OKE virtual nodes** run Kubernetes pods without managing worker nodes, using VCN-native pod networking.

**Typical private functions setup**

```
Subnet snet-fn (private, regional)
  route 0.0.0.0/0 → NAT gateway
  route All <region> Services in Oracle Services Network → service gateway
NSG nsg-fn: egress to nsg-db on TCP 1521; egress 443 to 0.0.0.0/0
Autonomous Database: private endpoint in snet-db, NSG allows TCP 1521-1522 from nsg-fn
```

> **Watch out:** If a function in a private subnet fails to start and can't pull its image, check the service gateway route: the image registry is an Oracle service.

## Lesson 6: Managed databases on private networks

Managed databases should be reachable only on private addresses, only from the app tier. The provider-specific patterns:

- **AWS RDS / Aurora**: launched into a **DB subnet group** (private subnets in two or more AZs); "publicly accessible" set to No; a security group allowing only the app's security group. The DNS endpoint follows failovers between AZs.
- **Azure SQL Database, PostgreSQL, MySQL**: **private endpoints** with public network access disabled, or (for Flexible Server) **VNet injection** into a delegated subnet. Private DNS zones must resolve the server name to the private IP.
- **Google Cloud SQL / AlloyDB**: **private IP** through private services access (a peered, Google-managed VPC using a reserved range you allocate) or **Private Service Connect**; disable public IP. The Cloud SQL Auth Proxy adds IAM-based authentication and TLS.
- **OCI Autonomous Database / Base Database / Exadata**: **private endpoints** or deployment into your subnets, with NSGs controlling access; access to Oracle services via the service gateway.

Connection behaviour matters too: database failover changes the IP behind the DNS name, so applications must reconnect and not cache IPs. Connection pools (RDS Proxy, PgBouncer) protect databases from connection storms when serverless functions scale out.

> **Tip:** For Google Cloud SQL with private services access, reserve a generous range (a /20 or larger) up front; every managed service using that peering shares it.

## Lesson 7: Real-world scenario: the function that couldn't call the payment API

**Situation.** A retail company moves its checkout logic from VMs to serverless functions. In testing, the function reaches the orders database perfectly, but every call to the external payment provider times out after 30 seconds. The payment provider also requires calls to come from a fixed, allow-listed IP address.

**Investigation.** The team first suspects the payment provider. Then they draw the outbound arrow: the function was attached to the private subnets so it could reach the database. That attachment means all outbound traffic now uses the VPC's routes, and the private subnets have no default route to a NAT gateway. Database traffic works (local route); Internet traffic has nowhere to go and times out.

**Fix.**

1. Add a NAT gateway in each zone's public subnet (on Azure: a NAT gateway on the integration subnet; on Google Cloud: Cloud NAT with reserved static IPs and all-traffic egress; on OCI: a NAT gateway with a reserved public IP).
2. Route `0.0.0.0/0` from the function subnets to the NAT gateway in the same zone.
3. Give the NAT gateway(s) reserved public IPs and send those to the payment provider for allow-listing.
4. Add private endpoints for the cloud services the function uses (secrets store, queues, logging), so that traffic doesn't pass through NAT at all.

**Lessons learned.** Attaching serverless compute to a private network changes its outbound path completely. Always design inbound and outbound separately, and remember that fixed egress IPs come from NAT, not from the function itself.

> **Tip:** Write "egress IP requirements" into every integration checklist. Partners frequently require allow-listing, and it shapes the network design.

## Key takeaways

- Every managed service has two network questions: how do requests come in, and how does it reach out?
- Attaching a function or app to your network gives private reach-out, but also takes away default Internet access.
- Private endpoints control inbound access; VNet/VPC integration controls outbound access.
- Managed databases should live on private addresses only, reachable from the app tier.

## Checkpoint

**Q1. What happens to an AWS Lambda function's Internet access when you attach it to private VPC subnets?**

A. Nothing changes
B. It loses default Internet access unless the subnets route through a NAT gateway  ✓
C. It gets a public IP automatically
D. It can only call S3

_VPC-attached functions use your VPC's routing, so they need NAT or endpoints._

**Q2. An Azure App Service has a private endpoint but still can't reach a database on a private IP. What is missing?**

A. Access restrictions
B. Regional VNet integration for outbound traffic  ✓
C. A public IP
D. A service tag

_Private endpoints handle inbound only; outbound needs VNet integration._

**Q3. Which Cloud Run option gives instances IPs directly in your subnet without connector VMs?**

A. Serverless VPC Access
B. Direct VPC egress  ✓
C. Private Google Access
D. Cloud Interconnect

_Direct VPC egress places Cloud Run traffic directly on a subnet._

**Q4. An OCI function in a private subnet can't pull its container image. What should you check first?**

A. The Internet gateway
B. The service gateway route to Oracle services  ✓
C. The DNS label
D. The load balancer

_The container registry is an Oracle service reached through the service gateway._

**Q5. A partner requires calls from one fixed IP. Where does that IP come from for private serverless workloads?**

A. The function's own address
B. A NAT gateway with a reserved public IP  ✓
C. The load balancer
D. The DNS server

_Outbound traffic is translated to the NAT gateway's public IP._

## Official reading

- [AWS Lambda: connecting to a VPC](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html)
- [Azure App Service networking features](https://learn.microsoft.com/en-us/azure/app-service/networking-features)
- [Cloud Run: Direct VPC egress](https://cloud.google.com/run/docs/configuring/vpc-direct-vpc)
- [OCI Functions networking](https://docs.oracle.com/en-us/iaas/Content/Functions/Tasks/functionsconfiguringnetwork.htm)
