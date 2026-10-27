# Module 19: Cloud Network Security

**Level:** 5 · **Lessons:** 6

## A real-world thread: Public API with private data

A public API requires exposure at its front door but should not expose internal databases or administrative ports. WAF, layered firewall policies, segmentation, logging and private endpoints control risk.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

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

**Build the mental model:** Edge: DDoS protection, CDN and WAF in front of public endpoints. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Public API with private data:** Consider how “defense in depth” affects the situation: A public API requires exposure at its front door but should not expose internal databases or administrative ports. WAF, layered firewall policies, segmentation, logging and private endpoints control risk. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For defense in depth, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain defense in depth to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: Edge protection

Every public endpoint should sit behind DDoS protection and a web application firewall.

- **AWS**: **AWS Shield** Standard (automatic, free) and Advanced (paid, with the Shield Response Team and cost protection); **AWS WAF** on CloudFront, ALB, API Gateway and others.
- **Azure**: **Azure DDoS Protection** (network or IP protection plans); **Azure WAF** on Application Gateway and Front Door.
- **Google Cloud**: **Cloud Armor** security policies on external load balancers: WAF rules, rate limiting, geo and IP rules, Adaptive Protection that learns normal traffic, and bot management.
- **OCI**: built-in DDoS protection at the edge; **OCI WAF** on load balancers or as an edge policy.

A good WAF policy starts with the provider's managed rule sets (OWASP Top 10 protections such as SQL injection and cross-site scripting), adds rate limits per client IP, and blocks countries or IP lists you never expect traffic from. Run new rules in **count / detection mode** first to avoid blocking real users.

> **Watch out:** A WAF in front of a load balancer does nothing if the backend also has a public IP that attackers can hit directly. Lock backends so they only accept traffic from the load balancer.

**Build the mental model:** AWS: AWS Shield Standard (automatic, free) and Advanced (paid, with the Shield Response Team and cost protection); AWS WAF on CloudFront, ALB, API Gateway and others. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Public API with private data:** Consider how “edge protection” affects the situation: A public API requires exposure at its front door but should not expose internal databases or administrative ports. WAF, layered firewall policies, segmentation, logging and private endpoints control risk. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For edge protection, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain edge protection to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

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

**Build the mental model:** AWS Network Firewall: stateful rules, Suricata-compatible IPS signatures, domain allow and deny lists, TLS inspection. Deployed in dedicated subnets, often in an inspection VPC behind Transit Gateway. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Public API with private data:** Consider how “central inspection with managed firewalls” affects the situation: A public API requires exposure at its front door but should not expose internal databases or administrative ports. WAF, layered firewall policies, segmentation, logging and private endpoints control risk. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For central inspection with managed firewalls, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain central inspection with managed firewalls to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: Private by default

Reduce what is reachable at all.

- **No public IPs** on VMs, databases or containers. Enforce it with policy (AWS SCPs, Azure Policy, Google organization policy, OCI security zones).
- **Private endpoints** for managed services: AWS interface and gateway endpoints, Azure Private Endpoints, Google Private Service Connect and Private Google Access, OCI service gateway and private endpoints. Disable public network access on the services themselves.
- **Managed administrative access** instead of open SSH/RDP:
- AWS **Systems Manager Session Manager** (no inbound ports at all) or EC2 Instance Connect Endpoint
- **Azure Bastion** (browser or native client, through the portal)
- Google Cloud **IAP TCP forwarding** (`gcloud compute ssh --tunnel-through-iap`)
- **OCI Bastion** (time-limited sessions)

```text
# Firewall: allow tcp:22 only from IAP's range 35.235.240.0/20
gcloud compute ssh app-1 --zone=me-central1-a --tunnel-through-iap
```

> **Tip:** Every one of these logs who connected and when, which an open SSH port never does well.

**Build the mental model:** No public IPs on VMs, databases or containers. Enforce it with policy (AWS SCPs, Azure Policy, Google organization policy, OCI security zones). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Public API with private data:** Consider how “private by default” affects the situation: A public API requires exposure at its front door but should not expose internal databases or administrative ports. WAF, layered firewall policies, segmentation, logging and private endpoints control risk. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For private by default, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain private by default to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: Flow logs and detection

You cannot defend what you cannot see. Turn on logging everywhere and send it to one place.

- **Flow logs**: AWS VPC Flow Logs, Azure VNet flow logs, Google Cloud VPC Flow Logs, OCI VCN flow logs.
- **Firewall and WAF logs**: every allow and deny with the rule that matched.
- **DNS query logs**: Route 53 Resolver query logs, Azure DNS (via Private Resolver and Azure Firewall DNS proxy logs), Cloud DNS logging, OCI DNS logs. DNS logs often reveal malware first.
- **Threat detection**: Amazon GuardDuty, Microsoft Defender for Cloud, Google Security Command Center, OCI Cloud Guard. These analyse logs for suspicious behaviour such as crypto-mining, port scans or calls to known malicious IPs.
- **Posture management (CSPM)**: continuously checks for misconfigurations such as open security groups or public buckets.

Send everything to a **SIEM** (Microsoft Sentinel, Google Security Operations, Splunk and others) and write alerts for what matters: rejected traffic to databases, outbound traffic to new countries, changes to security groups or route tables.

> **Watch out:** Logs cost money to store. Keep high-volume flow logs for a shorter period or sample them, and keep security-relevant logs longer.

**Build the mental model:** Flow logs: AWS VPC Flow Logs, Azure VNet flow logs, Google Cloud VPC Flow Logs, OCI VCN flow logs. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Public API with private data:** Consider how “flow logs and detection” affects the situation: A public API requires exposure at its front door but should not expose internal databases or administrative ports. WAF, layered firewall policies, segmentation, logging and private endpoints control risk. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For flow logs and detection, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain flow logs and detection to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

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

**Build the mental model:** No resource except load balancers, NAT and VPN gateways has a public IP. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Public API with private data:** Consider how “security checklist for a cloud network” affects the situation: A public API requires exposure at its front door but should not expose internal databases or administrative ports. WAF, layered firewall policies, segmentation, logging and private endpoints control risk. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For security checklist for a cloud network, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain security checklist for a cloud network to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
