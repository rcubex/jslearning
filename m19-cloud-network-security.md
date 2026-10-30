# Module 27: Cloud Network Security

**Level:** 5 · **Lessons:** 7 · **Questions:** 6

_Build defense in depth with each provider’s native controls._

## Lesson 1: Defense in depth

No single control stops every attack. Cloud network security layers independent controls so that an attacker who gets past one is stopped by the next:

1. **Edge**: DDoS protection, CDN and WAF in front of public endpoints.
2. **Perimeter**: only load balancers and gateways face the Internet.
3. **Segmentation**: separate accounts/subscriptions/projects, separate networks per environment, separate subnets per tier, security groups per workload.
4. **Inspection**: managed firewalls for egress and east-west traffic.
5. **Identity**: MFA, least privilege, no long-lived keys, identity-aware admin access.
6. **Data**: private endpoints for managed services, encryption in transit and at rest.
7. **Detection**: flow logs, firewall logs, DNS logs, threat detection services, SIEM.

> **Tip:** For each layer, write down which service you use in each cloud. Gaps in the table are your next priorities.

## Lesson 2: Edge protection

Every public endpoint should sit behind DDoS protection and a web application firewall.

- **AWS**: **AWS Shield** Standard (automatic, free) and Advanced (paid, with the Shield Response Team and cost protection); **AWS WAF** on CloudFront, ALB, API Gateway and others.
- **Azure**: **Azure DDoS Protection** (network or IP protection plans); **Azure WAF** on Application Gateway and Front Door.
- **Google Cloud**: **Cloud Armor** security policies on external load balancers: WAF rules, rate limiting, geo and IP rules, Adaptive Protection that learns normal traffic, and bot management.
- **OCI**: built-in DDoS protection at the edge; **OCI WAF** on load balancers or as an edge policy.

A good WAF policy starts with the provider's managed rule sets (OWASP Top 10 protections such as SQL injection and cross-site scripting), adds rate limits per client IP, and blocks countries or IP lists you never expect traffic from. Run new rules in **count / detection mode** first to avoid blocking real users.

> **Watch out:** A WAF in front of a load balancer does nothing if the backend also has a public IP that attackers can hit directly. Lock backends so they only accept traffic from the load balancer.

## Lesson 3: Central inspection with managed firewalls

Security groups decide *who* may connect; a firewall can also inspect *what* is being sent. Each cloud has a managed next-generation firewall:

- **AWS Network Firewall**: stateful rules, Suricata-compatible IPS signatures, domain allow and deny lists, TLS inspection. Deployed in dedicated subnets, often in an inspection VPC behind Transit Gateway.
- **Azure Firewall**: Standard (FQDN filtering, threat intelligence) and Premium (TLS inspection, IDPS, URL filtering, web categories). Usually in the hub VNet with UDRs from spokes.
- **Google Cloud NGFW**: distributed firewall policies; the Enterprise tier adds IPS and TLS inspection through firewall endpoints.
- **OCI Network Firewall**: managed NGFW based on Palo Alto Networks technology with URL filtering, IPS and TLS inspection.

Inspect three directions:

- **North-south inbound**: Internet → app (usually WAF plus load balancer is enough for HTTP)
- **North-south outbound (egress)**: app → Internet. Allow only required domains; this blocks malware call-backs and data exfiltration
- **East-west**: between VPCs/VNets, environments and tiers

> **Tip:** Egress filtering is one of the highest-value controls. Most servers only need to reach a handful of domains (OS updates, a payment API). Allow those, deny the rest, and log the denials.

## Lesson 4: Private by default

Reduce what is reachable at all.

- **No public IPs** on VMs, databases or containers. Enforce it with policy (AWS SCPs, Azure Policy, Google organization policy, OCI security zones).
- **Private endpoints** for managed services: AWS interface and gateway endpoints, Azure Private Endpoints, Google Private Service Connect and Private Google Access, OCI service gateway and private endpoints. Disable public network access on the services themselves.
- **Managed administrative access** instead of open SSH/RDP:
- AWS **Systems Manager Session Manager** (no inbound ports at all) or EC2 Instance Connect Endpoint
- **Azure Bastion** (browser or native client, through the portal)
- Google Cloud **IAP TCP forwarding** (`gcloud compute ssh --tunnel-through-iap`)
- **OCI Bastion** (time-limited sessions)

**SSH to a private Google Cloud VM through IAP**

```
# Firewall: allow tcp:22 only from IAP's range 35.235.240.0/20
gcloud compute ssh app-1 --zone=me-central1-a --tunnel-through-iap
```

> **Tip:** Every one of these logs who connected and when, which an open SSH port never does well.

## Lesson 5: Flow logs and detection

You cannot defend what you cannot see. Turn on logging everywhere and send it to one place.

- **Flow logs**: AWS VPC Flow Logs, Azure VNet flow logs, Google Cloud VPC Flow Logs, OCI VCN flow logs.
- **Firewall and WAF logs**: every allow and deny with the rule that matched.
- **DNS query logs**: Route 53 Resolver query logs, Azure DNS (via Private Resolver and Azure Firewall DNS proxy logs), Cloud DNS logging, OCI DNS logs. DNS logs often reveal malware first.
- **Threat detection**: Amazon GuardDuty, Microsoft Defender for Cloud, Google Security Command Center, OCI Cloud Guard. These analyse logs for suspicious behaviour such as crypto-mining, port scans or calls to known malicious IPs.
- **Posture management (CSPM)**: continuously checks for misconfigurations such as open security groups or public buckets.

Send everything to a **SIEM** (Microsoft Sentinel, Google Security Operations, Splunk and others) and write alerts for what matters: rejected traffic to databases, outbound traffic to new countries, changes to security groups or route tables.

> **Watch out:** Logs cost money to store. Keep high-volume flow logs for a shorter period or sample them, and keep security-relevant logs longer.

## Lesson 6: Security checklist for a cloud network

Use this checklist for any new environment, in any cloud:

1. No resource except load balancers, NAT and VPN gateways has a public IP.
2. No security rule allows SSH (22) or RDP (3389) from 0.0.0.0/0 or ::/0.
3. Databases accept connections only from the application tier.
4. Managed services use private endpoints with public access disabled.
5. Public endpoints sit behind WAF and DDoS protection.
6. Egress is filtered through a firewall with a domain allow list.
7. Production and non-production are separated at the account/subscription/project level.
8. Flow logs, firewall logs and DNS logs are enabled and centralised.
9. Network changes are made through reviewed infrastructure as code.
10. Guardrail policies prevent the above from being undone.

> **Tip:** Benchmarks such as the CIS Foundations Benchmarks for AWS, Azure, Google Cloud and OCI turn these principles into hundreds of checkable rules; posture management tools can scan for them automatically.

## Lesson 7: Real-world scenario: data exfiltration through DNS

**Situation.** A threat detection service raises an alert: a server in a private subnet is making thousands of DNS queries per hour for random-looking subdomains of an unknown domain, like `a9f3k2.d8x.exfil-example.net`. The server has no Internet access except DNS.

**Analysis.** This is **DNS tunnelling**: malware encodes stolen data in DNS query names, which travel through the cloud's resolver to the attacker's authoritative server. Because "DNS is always allowed", it bypassed egress firewall rules.

**Response.**

1. Isolate the server (move it to a quarantine security group with no outbound access) and capture its disk for forensics.
2. Block the domain with **DNS firewall** rules (Route 53 Resolver DNS Firewall, Azure Firewall DNS proxy with FQDN filtering or DNS security policies, Cloud DNS response policies, OCI DNS policies or a security appliance).
3. Hunt for the same pattern on other hosts using **DNS query logs**.

**Prevention.**

- Allow-list domains that servers may resolve where practical; block newly registered and known-malicious domains.
- Alert on high query volumes, long random subdomains and unusual TXT queries.
- Treat DNS as an egress channel in your security design.

**Lessons learned.** Egress filtering must include DNS. Query logs are one of the best early warning signals in the cloud.

## Key takeaways

- Stack controls: edge (DDoS, WAF), network (segmentation, firewalls), identity, host, data, monitoring.
- Inspect egress and east-west traffic, not only inbound.
- Nothing internal should have a public IP; admin access goes through identity-aware services.
- Log every flow and decision, and alert on what matters.

## Checkpoint

**Q1. What is the managed way to SSH into a private Google Cloud VM with no public IP?**

A. Cloud NAT
B. IAP TCP forwarding  ✓
C. Cloud Armor
D. Private Service Connect

_Identity-Aware Proxy tunnels SSH after checking identity._

**Q2. Where should a WAF sit?**

A. Behind the database
B. In front of public web endpoints  ✓
C. Inside each VM
D. On the DNS server

_A WAF inspects HTTP requests before they reach your app._

**Q3. Why is egress filtering valuable?**

A. It speeds up downloads
B. It blocks malware call-backs and data exfiltration to unapproved destinations  ✓
C. It removes the need for a WAF
D. It is required for NAT to work

_Most servers need only a few destinations; denying the rest limits damage after a compromise._

**Q4. Which AWS service lets you reach an instance's shell with no inbound ports open?**

A. Elastic IP
B. Systems Manager Session Manager  ✓
C. Network ACL
D. Route 53

_Session Manager connects through the SSM agent's outbound connection, with IAM authentication and logging._

**Q5. New WAF rules should first be deployed in which mode?**

A. Block mode
B. Count or detection mode  ✓
C. Disabled
D. Bypass mode

_Observe what the rule would block before enforcing, to avoid blocking real users._

**Q6. Why did DNS tunnelling bypass the egress firewall in the scenario?**

A. The firewall was off
B. DNS was allowed for all servers and passed through the cloud resolver to the attacker's server  ✓
C. The server had a public IP
D. TLS hid the traffic

_Data hidden in DNS queries reaches the attacker's authoritative server via normal resolution._

## Official reading

- [AWS Network Firewall](https://docs.aws.amazon.com/network-firewall/latest/developerguide/what-is-aws-network-firewall.html)
- [Azure Firewall features](https://learn.microsoft.com/en-us/azure/firewall/features-by-sku)
- [Google Cloud Armor](https://cloud.google.com/armor/docs/cloud-armor-overview)
- [OCI Network Firewall](https://docs.oracle.com/en-us/iaas/Content/network-firewall/overview.htm)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)
