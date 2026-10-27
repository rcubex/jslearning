# Module 06: Network Security Fundamentals

**Level:** 2 · **Lessons:** 6

## A real-world thread: Partner network integration

A company integrates an external payment partner. Separate network zones, least-privilege access, encryption and controlled egress prevent one compromised system from reaching everything.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: Stateful vs stateless filtering

A packet filter decides whether to allow or drop traffic based on the 5-tuple (protocol, source and destination IP, source and destination port). There are two kinds.

A **stateful** filter keeps a table of active connections. When it allows an outbound request, it automatically allows the matching reply, because it recognises it as part of the same connection. You only write rules for who may *start* a connection.

A **stateless** filter judges every packet on its own, with no memory. If you allow inbound TCP 443 to a web server, you must also allow the outbound replies, which go to the client's random **ephemeral port** (1024–65535).

- AWS security groups, Azure NSGs, Google Cloud firewall rules and OCI NSGs are **stateful**
- AWS network ACLs are **stateless**; OCI security list rules are stateful by default but can be made stateless
- Stateless filters are simpler and faster but easier to get wrong

> **Watch out:** The most common NACL mistake on AWS: allowing inbound 443 but forgetting outbound 1024–65535, so requests arrive and the replies are silently dropped.

**Build the mental model:** AWS security groups, Azure NSGs, Google Cloud firewall rules and OCI NSGs are stateful. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Partner network integration:** Consider how “stateful vs stateless filtering” affects the situation: A company integrates an external payment partner. Separate network zones, least-privilege access, encryption and controlled egress prevent one compromised system from reaching everything. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For stateful vs stateless filtering, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain stateful vs stateless filtering to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: Rule order and default deny

Firewall rules are evaluated in order. In most systems (AWS NACLs, Azure NSGs, OCI, Google Cloud firewall priorities) the rules are checked by number or priority and the **first match wins**. AWS security groups are different: they only contain allow rules, and if any rule matches, traffic is allowed.

The golden rule is **default deny**: block everything, then add narrow allow rules for what is needed. Each allow rule should be as specific as possible:

- **Source**: a specific subnet or security group, not 0.0.0.0/0
- **Port**: 443, not "all"
- **Protocol**: TCP, not "any"

```text
web tier:  allow TCP 443 from 0.0.0.0/0
app tier:  allow TCP 8080 from web-tier security group only
db tier:   allow TCP 5432 from app-tier security group only
admin:     no SSH/RDP from the Internet; use a managed bastion or session service
everything else: denied
```

> **Tip:** Reference security groups (AWS), application security groups (Azure), service accounts or tags (Google Cloud) or NSGs (OCI) as rule sources instead of IP addresses. Rules then keep working as servers scale up and down.

**Build the mental model:** Source: a specific subnet or security group, not 0.0.0.0/0. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Partner network integration:** Consider how “rule order and default deny” affects the situation: A company integrates an external payment partner. Separate network zones, least-privilege access, encryption and controlled egress prevent one compromised system from reaching everything. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For rule order and default deny, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain rule order and default deny to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Segmentation and the DMZ

**Segmentation** divides a network into zones so that a breach in one zone does not give access to all the others. The classic design has three tiers:

1. A **DMZ** or public zone for things the Internet must reach: load balancers, reverse proxies, VPN endpoints.
2. An **application zone** reachable only from the DMZ.
3. A **data zone** (databases, file stores) reachable only from the application zone.

Further segmentation separates environments (production must not talk to development), business units and sensitivity levels (payment systems in their own segment for PCI DSS). **Micro-segmentation** goes further, with rules per workload rather than per subnet.

In the cloud you segment with separate subnets, separate VPCs/VNets, and per-workload security groups. Many organisations also use separate cloud accounts, subscriptions or projects per environment, which is the strongest boundary of all.

> **In the cloud:** A database should never have a public IP address. Put it in a private subnet with a rule that only the application tier can reach its port.

**Build the mental model:** A DMZ or public zone for things the Internet must reach: load balancers, reverse proxies, VPN endpoints. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Partner network integration:** Consider how “segmentation and the dmz” affects the situation: A company integrates an external payment partner. Separate network zones, least-privilege access, encryption and controlled egress prevent one compromised system from reaching everything. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For segmentation and the dmz, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain segmentation and the dmz to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: VPNs, IPsec and IKE

A **VPN** (virtual private network) builds an encrypted tunnel across an untrusted network such as the Internet.

**Site-to-site VPNs** join two networks, for example an office and a cloud VPC. They almost always use **IPsec**: **IKE** (Internet Key Exchange, UDP 500, and UDP 4500 when NAT is involved) authenticates both ends and negotiates keys, then **ESP** encrypts the traffic. Both sides must agree on parameters such as encryption algorithm (AES-256), integrity (SHA-256), Diffie-Hellman group and lifetimes. Mismatched parameters are the most common reason a tunnel will not come up.

**Remote access VPNs** connect individual users' devices. They use IPsec, SSL/TLS-based clients or WireGuard.

Every cloud offers a managed VPN gateway (AWS Site-to-Site VPN, Azure VPN Gateway, Google Cloud HA VPN, OCI Site-to-Site VPN), each providing two tunnels for redundancy. Use both.

```text
IKE version:      IKEv2
Encryption:       AES-256-GCM
Integrity / PRF:  SHA-256
DH group:         14 or higher (2048-bit MODP) or 19/20 (ECP)
Pre-shared key:   long random string
Routing:          BGP (preferred) or static
```

> **Tip:** If a tunnel shows "IKE up, IPsec down" or no traffic flows, compare phase 2 (IPsec) parameters and the traffic selectors / routes on both ends first.

**Build the mental model:** A **VPN** (virtual private network) builds an encrypted tunnel across an untrusted network such as the Internet. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Partner network integration:** Consider how “vpns, ipsec and ike” affects the situation: A company integrates an external payment partner. Separate network zones, least-privilege access, encryption and controlled egress prevent one compromised system from reaching everything. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For vpns, ipsec and ike, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain vpns, ipsec and ike to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: Zero trust

Traditional security assumed that anything inside the network perimeter could be trusted. That fails as soon as one laptop or server is compromised, and it does not fit cloud services and remote work.

**Zero trust** (NIST SP 800-207) removes trust based on network location. Every request is evaluated on:

- **Identity**: who is the user or workload, proven with strong authentication (MFA, certificates, workload identity)
- **Device**: is the device managed, patched and healthy
- **Context**: what resource, from where, at what time, with what risk
- **Least privilege**: grant only the access needed, for only as long as needed

Practical zero-trust building blocks in the cloud: identity-aware proxies (Google IAP, Microsoft Entra application proxy), managed admin access without open ports (AWS Systems Manager Session Manager, Azure Bastion, OCI Bastion), service-to-service mTLS in a service mesh, and private endpoints for managed services.

> **Analogy:** The old model is a castle with a moat: once inside, you can go anywhere. Zero trust is a modern office where your badge is checked at every door.

**Build the mental model:** Identity: who is the user or workload, proven with strong authentication (MFA, certificates, workload identity). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Partner network integration:** Consider how “zero trust” affects the situation: A company integrates an external payment partner. Separate network zones, least-privilege access, encryption and controlled egress prevent one compromised system from reaching everything. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For zero trust, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain zero trust to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: Encryption in transit and defense in depth

Encrypt data in transit everywhere, including inside your own network. Use TLS 1.2 or 1.3 for applications, IPsec for site-to-site links, and SSH (not Telnet) for administration. Cloud providers encrypt some traffic between their data centres automatically, but you are responsible for application-level encryption.

**Defense in depth** means stacking independent controls so that one failure is not fatal:

1. Edge: DDoS protection and a web application firewall
2. Network: segmentation, security groups, firewalls
3. Identity: MFA, least privilege, no shared accounts
4. Host: patching, hardening, endpoint protection
5. Application: secure coding, input validation (see the OWASP Top 10)
6. Data: encryption at rest and in transit, backups
7. Monitoring: flow logs, audit logs, alerts

> **Watch out:** A firewall rule is not a substitute for patching. Assume any single control can fail, and ask what stops an attacker at the next layer.

**Build the mental model:** Edge: DDoS protection and a web application firewall. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Partner network integration:** Consider how “encryption in transit and defense in depth” affects the situation: A company integrates an external payment partner. Separate network zones, least-privilege access, encryption and controlled egress prevent one compromised system from reaching everything. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For encryption in transit and defense in depth, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain encryption in transit and defense in depth to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
