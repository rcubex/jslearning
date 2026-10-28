# Module 22: Troubleshooting & Capstone

**Level:** 5 · **Lessons:** 6

## A real-world thread: Intermittent failure during a migration

A service fails only for some clients following a network change. Comparing source, destination, routes, filters, DNS, logs and captured packets can distinguish symptoms from the actual cause.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: A method for every outage

Good troubleshooting is a method, not luck. Use the same steps every time:

1. **Define the problem precisely**: what source, what destination, what port, since when, for whom? "The app is down" is not a problem statement; "VMs in app-subnet can't reach the database on 5432 since 14:10" is.
2. **Check what changed**: deployments, rule changes, route changes, certificate expiry. Audit logs (CloudTrail, Activity Log, Cloud Audit Logs, OCI Audit) answer this quickly.
3. **Walk the path layer by layer**: is the target running and listening? Does DNS resolve correctly? Is there a route each way? Do all filters (OS firewall, security group/NSG, subnet ACL, cloud firewall) allow it in both directions? Is NAT or a load balancer in the path healthy?
4. **Form one hypothesis, test it, change one thing.**
5. **Fix, verify, and write down what happened.**

```text
Is the destination up and listening?        ss -tulpn / service status
Does the name resolve to the right IP?       dig / nslookup
Is there a route there AND back?             cloud route tables, effective routes
Do all filters allow it, both ways?          SG/NSG/NACL/firewall + host firewall
Is anything in between unhealthy?            NAT, LB health checks, VPN/BGP state
```

> **Tip:** Most outages are caused by recent changes. Always ask "what changed?" before diving deep.

**Build the mental model:** Define the problem precisely: what source, what destination, what port, since when, for whom? "The app is down" is not a problem statement; "VMs in app-subnet can't reach the database on 5432 since 14:10" is. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Intermittent failure during a migration:** Consider how “a method for every outage” affects the situation: A service fails only for some clients following a network change. Comparing source, destination, routes, filters, DNS, logs and captured packets can distinguish symptoms from the actual cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For a method for every outage, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain a method for every outage to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: Built-in path analyzers

All four clouds offer tools that analyse configuration and tell you where a path is blocked, without needing access to the VMs:

- **AWS Reachability Analyzer**: source and destination (instances, ENIs, gateways, endpoints); checks routes, SGs, NACLs, gateways and peering, and names the blocking component.
- **Azure Network Watcher**: IP flow verify (which NSG rule matches), next hop, effective routes and security rules, and connection troubleshoot.
- **Google Cloud Connectivity Tests**: analyses routes, firewall policies and rules, load balancers, Cloud NAT and hybrid paths; optionally checks the live data plane.
- **OCI Network Path Analyzer**: analyses route tables, security lists, NSGs, gateways and DRG routing between endpoints.

These tools are the fastest way to rule configuration in or out. If the analyzer says the path is open, look at the guest OS, the application, DNS or something outside the cloud.

> **Tip:** Run the analyzer in both directions. Many problems are on the return path.

**Build the mental model:** AWS Reachability Analyzer: source and destination (instances, ENIs, gateways, endpoints); checks routes, SGs, NACLs, gateways and peering, and names the blocking component. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Intermittent failure during a migration:** Consider how “built-in path analyzers” affects the situation: A service fails only for some clients following a network change. Comparing source, destination, routes, filters, DNS, logs and captured packets can distinguish symptoms from the actual cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For built-in path analyzers, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain built-in path analyzers to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Packet-level visibility

When configuration looks right but traffic still fails, capture the packets:

- **AWS Traffic Mirroring**: copies traffic from an ENI to a monitoring target.
- **Azure Network Watcher packet capture**: captures on a VM (or scale set) to storage, readable in Wireshark.
- **Google Cloud Packet Mirroring**: clones traffic from instances to a collector behind an internal load balancer.
- **OCI VTAP** with capture filters: mirrors traffic from VNICs and other sources.

Or simply run `tcpdump` on both ends (Module 08). Combine with **flow logs**, which show accepted and rejected flows at scale, to find which direction and which hop is failing.

> **Tip:** Capture on the sender and the receiver at the same time. If packets leave A but never reach B, the problem is in the network between; if they reach B and B replies, but A never gets the reply, look at the return path.

**Build the mental model:** AWS Traffic Mirroring: copies traffic from an ENI to a monitoring target. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Intermittent failure during a migration:** Consider how “packet-level visibility” affects the situation: A service fails only for some clients following a network change. Comparing source, destination, routes, filters, DNS, logs and captured packets can distinguish symptoms from the actual cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For packet-level visibility, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain packet-level visibility to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: Common failure patterns

Most cloud network problems fall into a handful of patterns. Learn to recognise them:

- **Connection timeout** to a new VM: security group/NSG/firewall rule missing, or wrong route. Check the analyzer.
- **Works from one subnet, not another**: subnet-level filter (NACL, subnet NSG, security list) or route table differs.
- **Private VM can't reach the Internet**: no NAT route, NAT gateway in the wrong place, or (AWS) NACL blocking return ports.
- **Load balancer returns 502/503**: health checks failing; backend security rule doesn't allow the LB's ranges, or the app isn't listening.
- **Works by IP but not by name**: DNS; especially private zones not linked to the network, or hybrid forwarding missing.
- **Small requests work, large ones hang**: MTU across VPN or tunnels.
- **Intermittent failures under load**: NAT port exhaustion, connection limits, or one unhealthy backend.
- **Hybrid traffic one-way**: asymmetric routing through stateful firewalls, or a missing route on one side.
- **Everything broke at once at a specific time**: a change, or an expired certificate.

> **Tip:** Keep a personal runbook. Each time you solve a problem, add the symptom, the cause and the fix.

**Build the mental model:** Connection timeout to a new VM: security group/NSG/firewall rule missing, or wrong route. Check the analyzer. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Intermittent failure during a migration:** Consider how “common failure patterns” affects the situation: A service fails only for some clients following a network change. Comparing source, destination, routes, filters, DNS, logs and captured packets can distinguish symptoms from the actual cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For common failure patterns, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain common failure patterns to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: Cost and performance review

A network can work and still be expensive or slow. Review it regularly:

- **Egress**: which flows leave the cloud, cross regions or cross zones? Can a CDN, caching or co-locating services reduce them?
- **NAT gateways**: high NAT data processing often means traffic to cloud services that should use endpoints instead (S3 gateway endpoint, Private Google Access, OCI service gateway, Azure Private Endpoints or service endpoints).
- **Idle resources**: unused load balancers, NAT gateways, VPN gateways, public IPs and endpoints left from tests.
- **Latency**: place services that talk a lot in the same zone or region; use the providers' latency dashboards.
- **Right-sizing**: VPN/ExpressRoute gateway SKUs, interconnect bandwidth and firewall capacity sized for real usage.

> **Tip:** Tag every network resource with an owner and environment. Unowned resources are usually the ones nobody remembered to delete.

**Build the mental model:** Egress: which flows leave the cloud, cross regions or cross zones? Can a CDN, caching or co-locating services reduce them?. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Intermittent failure during a migration:** Consider how “cost and performance review” affects the situation: A service fails only for some clients following a network change. Comparing source, destination, routes, filters, DNS, logs and captured packets can distinguish symptoms from the actual cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For cost and performance review, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain cost and performance review to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: Capstone brief

Prove your skills end to end. Build a small but real system across two clouds of your choice.

**Requirements**

1. An address plan for both clouds and an imaginary data centre, with no overlaps.
2. In cloud A: a hub-and-spoke network; a public L7 load balancer with WAF; app servers or containers in private subnets; a managed database with a private endpoint and no public access; NAT for outbound traffic; managed admin access with no open SSH/RDP.
3. In cloud B: a private network with one service that the app in cloud A must call privately.
4. A cloud-to-cloud HA VPN with BGP between the two clouds.
5. Private DNS working in both directions.
6. Flow logs and firewall logs enabled.
7. Everything built with Terraform, with a policy check that blocks SSH from the Internet.

**Then break it on purpose** and fix it using only the tools from this course: remove a route, delete a firewall rule, break a DNS forwarding rule, and shut one VPN tunnel. Note how you found each fault.

**Deliverables**: an architecture diagram, the IP plan, the Terraform code, and a one-page runbook. Then tear everything down.

> **Tip:** Keep costs low by using the smallest sizes, running the lab for a few hours at a time, and destroying it with `terraform destroy` when you stop. Set a budget alert before you start.

**Build the mental model:** An address plan for both clouds and an imaginary data centre, with no overlaps. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Intermittent failure during a migration:** Consider how “capstone brief” affects the situation: A service fails only for some clients following a network change. Comparing source, destination, routes, filters, DNS, logs and captured packets can distinguish symptoms from the actual cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For capstone brief, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain capstone brief to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
