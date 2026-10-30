# Module 30: Troubleshooting & Capstone

**Level:** 5 · **Lessons:** 7 · **Questions:** 6

_Diagnose any cloud network fault and prove your skills end to end._

## Lesson 1: A method for every outage

Good troubleshooting is a method, not luck. Use the same steps every time:

1. **Define the problem precisely**: what source, what destination, what port, since when, for whom? "The app is down" is not a problem statement; "VMs in app-subnet can't reach the database on 5432 since 14:10" is.
2. **Check what changed**: deployments, rule changes, route changes, certificate expiry. Audit logs (CloudTrail, Activity Log, Cloud Audit Logs, OCI Audit) answer this quickly.
3. **Walk the path layer by layer**: is the target running and listening? Does DNS resolve correctly? Is there a route each way? Do all filters (OS firewall, security group/NSG, subnet ACL, cloud firewall) allow it in both directions? Is NAT or a load balancer in the path healthy?
4. **Form one hypothesis, test it, change one thing.**
5. **Fix, verify, and write down what happened.**

**The questions, in order**

```
Is the destination up and listening?        ss -tulpn / service status
Does the name resolve to the right IP?       dig / nslookup
Is there a route there AND back?             cloud route tables, effective routes
Do all filters allow it, both ways?          SG/NSG/NACL/firewall + host firewall
Is anything in between unhealthy?            NAT, LB health checks, VPN/BGP state
```

> **Tip:** Most outages are caused by recent changes. Always ask "what changed?" before diving deep.

## Lesson 2: Built-in path analyzers

All four clouds offer tools that analyse configuration and tell you where a path is blocked, without needing access to the VMs:

- **AWS Reachability Analyzer**: source and destination (instances, ENIs, gateways, endpoints); checks routes, SGs, NACLs, gateways and peering, and names the blocking component.
- **Azure Network Watcher**: IP flow verify (which NSG rule matches), next hop, effective routes and security rules, and connection troubleshoot.
- **Google Cloud Connectivity Tests**: analyses routes, firewall policies and rules, load balancers, Cloud NAT and hybrid paths; optionally checks the live data plane.
- **OCI Network Path Analyzer**: analyses route tables, security lists, NSGs, gateways and DRG routing between endpoints.

These tools are the fastest way to rule configuration in or out. If the analyzer says the path is open, look at the guest OS, the application, DNS or something outside the cloud.

> **Tip:** Run the analyzer in both directions. Many problems are on the return path.

## Lesson 3: Packet-level visibility

When configuration looks right but traffic still fails, capture the packets:

- **AWS Traffic Mirroring**: copies traffic from an ENI to a monitoring target.
- **Azure Network Watcher packet capture**: captures on a VM (or scale set) to storage, readable in Wireshark.
- **Google Cloud Packet Mirroring**: clones traffic from instances to a collector behind an internal load balancer.
- **OCI VTAP** with capture filters: mirrors traffic from VNICs and other sources.

Or simply run `tcpdump` on both ends (Module 08). Combine with **flow logs**, which show accepted and rejected flows at scale, to find which direction and which hop is failing.

> **Tip:** Capture on the sender and the receiver at the same time. If packets leave A but never reach B, the problem is in the network between; if they reach B and B replies, but A never gets the reply, look at the return path.

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

## Lesson 5: Cost and performance review

A network can work and still be expensive or slow. Review it regularly:

- **Egress**: which flows leave the cloud, cross regions or cross zones? Can a CDN, caching or co-locating services reduce them?
- **NAT gateways**: high NAT data processing often means traffic to cloud services that should use endpoints instead (S3 gateway endpoint, Private Google Access, OCI service gateway, Azure Private Endpoints or service endpoints).
- **Idle resources**: unused load balancers, NAT gateways, VPN gateways, public IPs and endpoints left from tests.
- **Latency**: place services that talk a lot in the same zone or region; use the providers' latency dashboards.
- **Right-sizing**: VPN/ExpressRoute gateway SKUs, interconnect bandwidth and firewall capacity sized for real usage.

> **Tip:** Tag every network resource with an owner and environment. Unowned resources are usually the ones nobody remembered to delete.

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

## Lesson 7: Real-world scenario: an end-to-end investigation

**Situation.** Users report that an internal reporting web app on Google Cloud, accessed from offices over HA VPN, shows "502 Bad Gateway" since this morning. Nothing in the app changed.

**Walking the method.**

1. **Define**: users in all offices get 502 from the internal Application Load Balancer for `reports.corp.example`, since 07:30.
2. **What changed?** Cloud Audit Logs show a firewall policy update at 07:25 by the security team: a new rule "deny all ingress from 35.191.0.0/16 and 130.211.0.0/22" was added at high priority, intended to block a scan from an external range they thought these were.
3. **Confirm**: the load balancer shows all backends **unhealthy**. Those two ranges are Google's **health-check source ranges**; and for internal Application Load Balancers, traffic also comes from the **proxy-only subnet**, which the same change had been grouped with.
4. **Connectivity Tests** from the proxy-only subnet to a backend on port 8080 report "dropped by firewall policy rule 'deny-scan'".

**Fix.** Roll back the rule (service restored in 3 minutes after health checks pass), then re-implement the security team's intent correctly: block the actual scanning range, and add a hierarchical policy rule explicitly allowing health-check ranges and proxy-only subnets, with a comment explaining why.

**Postmortem actions.**

- Firewall policy changes go through the same IaC pipeline with Connectivity Tests as a pre-merge check.
- Add a "load balancer healthy backends = 0" alert that pages.
- Document Google's health-check ranges in the firewall policy itself.

**Lessons learned.** Ask "what changed?" first, confirm with the path analyzer, mitigate quickly, then fix the process so the same mistake can't recur.

## Key takeaways

- Work methodically up the layers and change one thing at a time.
- Use each cloud's path analyzer before guessing.
- Flow logs and packet captures show what really happened.
- Design, build, break and fix a real two-cloud system to prove your skills.

## Checkpoint

**Q1. A private AWS instance cannot reach the Internet. A route to the NAT exists and the security group allows egress. What next?**

A. The CPU
B. The subnet NACL, including the return path  ✓
C. The DNS TTL
D. The instance size

_Stateless NACLs often block the return traffic on ephemeral ports._

**Q2. Which path-analysis tool belongs to OCI?**

A. Reachability Analyzer
B. Connectivity Tests
C. Network Path Analyzer  ✓
D. Network Watcher

_AWS, Google Cloud and Azure use the other three names._

**Q3. Everything worked yesterday and fails today for all users. What should you check first?**

A. Replace the load balancer
B. What changed: recent deployments, rule changes and certificate expiry  ✓
C. Reboot every server
D. Increase the instance sizes

_Most outages follow a change; audit logs show what changed and when._

**Q4. Requests work by IP address but fail by host name. Where is the fault?**

A. Routing
B. MTU
C. DNS  ✓
D. Security groups

_If the IP works, the network path is fine; name resolution is the problem._

**Q5. NAT gateway data-processing charges are very high. What is a likely improvement?**

A. Add a second NAT gateway
B. Route traffic to cloud services through private or gateway endpoints instead of NAT  ✓
C. Use bigger instances
D. Disable flow logs

_Traffic to storage and other cloud APIs often goes through NAT unnecessarily; endpoints avoid it._

**Q6. In the scenario, why did all backends become unhealthy?**

A. The app crashed
B. DNS failed
C. A new firewall rule blocked Google's health-check and proxy source ranges  ✓
D. The VPN went down

_Health checks and proxy traffic must be allowed, or load balancers mark every backend unhealthy._

## Official reading

- [AWS Reachability Analyzer](https://docs.aws.amazon.com/vpc/latest/reachability/what-is-reachability-analyzer.html)
- [Azure Network Watcher](https://learn.microsoft.com/en-us/azure/network-watcher/network-watcher-overview)
- [Google Cloud Connectivity Tests](https://cloud.google.com/network-intelligence-center/docs/connectivity-tests/concepts/overview)
- [OCI Network Path Analyzer](https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/path_analyzer.htm)
