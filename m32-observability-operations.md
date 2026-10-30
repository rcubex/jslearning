# Module 32: Observability & Operations

**Level:** 5 · **Lessons:** 7 · **Questions:** 5

_Monitor, alert on and operate cloud networks like a production service._

## Lesson 1: What to monitor

A useful starting point is the **four golden signals**, applied to network services as well as applications:

- **Latency**: how long requests and round trips take (watch p95 and p99, not just averages).
- **Traffic**: requests per second, bandwidth, connections.
- **Errors**: HTTP 5xx from load balancers, TCP resets, dropped packets, rejected flows, failed DNS queries.
- **Saturation**: how full things are: NAT gateway port usage, VPN tunnel bandwidth, firewall throughput, subnet IP utilisation, instance network allowances.

Network-specific items to always watch:

- **BGP session state** and number of received prefixes on every VPN and private link
- **Tunnel state** (both tunnels of every VPN)
- **Load balancer** healthy host counts and target response time
- **NAT gateway** connection errors and port allocation failures
- **Certificate expiry** dates
- **IP address utilisation** per subnet

> **Tip:** An SLI (service level indicator) is a measurement, such as "the share of checkout requests served under 300 ms". An SLO (objective) is the target: "99.5% over 30 days". Build alerts around SLOs.

## Lesson 2: Metrics, logs and traces in each cloud

Each provider has a native observability stack:

- **AWS**: **CloudWatch** metrics, logs and alarms; VPC Flow Logs; **CloudWatch Network Monitoring** (Network Synthetic Monitor for hybrid paths, Internet Monitor for user-facing Internet performance); **X-Ray** / OpenTelemetry for traces.
- **Azure**: **Azure Monitor** metrics and Log Analytics (KQL); Network Watcher **Connection Monitor**; **Traffic Analytics** on VNet flow logs; Application Insights for traces.
- **Google Cloud**: **Cloud Monitoring** and **Cloud Logging**; Network Intelligence Center (**Performance Dashboard**, Network Topology, Flow Analyzer); **Cloud Trace**.
- **OCI**: **Monitoring** and **Logging**; **Logging Analytics**; **Health Checks** for endpoints; **APM** for traces.

Many teams also export everything to one tool (Grafana, Datadog, Splunk, Elastic, a SIEM) using **OpenTelemetry**, so hybrid and multi-cloud environments look the same.

> **Tip:** Correlate layers. A spike in load-balancer 5xx errors means much more next to backend CPU, NAT errors and flow-log rejects on the same timeline.

## Lesson 3: Querying flow logs

Raw flow logs are huge; querying them quickly is what makes them useful. Store them where you can run SQL or KQL:

**AWS: top rejected flows in the last hour (Amazon Athena over VPC Flow Logs)**

```
SELECT srcaddr, dstaddr, dstport, protocol, COUNT(*) AS hits
FROM vpc_flow_logs
WHERE action = 'REJECT' AND start > to_unixtime(now() - interval '1' hour)
GROUP BY srcaddr, dstaddr, dstport, protocol
ORDER BY hits DESC LIMIT 20;
```

**Azure: denied flows by destination port (KQL, Traffic Analytics table)**

```
NTANetAnalytics
| where TimeGenerated > ago(1h) and FlowStatus == "Denied"
| summarize Flows = count() by DestPort, SrcIp, DestIp
| top 20 by Flows
```

**Google Cloud: biggest talkers (BigQuery over exported VPC Flow Logs, schema simplified)**

```
SELECT jsonPayload.connection.src_ip, jsonPayload.connection.dest_ip,
       SUM(CAST(jsonPayload.bytes_sent AS INT64)) AS bytes
FROM `proj.netlogs.compute_googleapis_com_vpc_flows_*`
GROUP BY 1, 2 ORDER BY bytes DESC LIMIT 20;
```

Typical questions flow logs answer: who is talking to the database? Which flows are being rejected right after a change? Which servers send the most data to the Internet (egress cost)? Is anything talking to an unexpected country?

> **Tip:** Flow logs record metadata (who, where, how much), not packet contents. For contents, use packet capture or mirroring.

## Lesson 4: Synthetic and Internet monitoring

Real-user metrics tell you something is wrong after users feel it. **Synthetic monitoring** tests continuously from known locations, so you find problems first and can tell whether the issue is your network or the Internet:

- **Uptime / health checks** from many regions against public endpoints (all four clouds offer them).
- **Path monitoring** between on-premises and cloud: AWS **Network Synthetic Monitor**, Azure **Connection Monitor**, Google Cloud **Performance Dashboard** for Google's own network, and agent-based tools.
- **Internet monitoring**: AWS **Internet Monitor** shows how Internet issues (an ISP outage in a city) affect your users; third-party platforms provide similar views across providers.
- **Transaction tests**: scripted logins or checkouts that exercise the whole stack, including DNS, TLS and the application.

> **Tip:** Always have at least one synthetic check from outside your own cloud provider. If your provider has a regional problem, its own monitoring might be affected too.

## Lesson 5: Alerting without fatigue

Too many alerts are as bad as too few: people start ignoring them. Good alerting rules:

- **Page a human only for symptoms that hurt users** or will soon (SLO burn rate, both VPN tunnels down, BGP session down, certificate expiring in under 7 days).
- **Send everything else to a ticket or dashboard** (one tunnel of two down, rising NAT usage).
- **Every alert has a runbook link**: what it means, how to check, how to fix, who to escalate to.
- **Tune or delete** alerts that fire without action. Review them monthly.
- **Use multi-window burn-rate alerts** for SLOs: a fast burn (lots of errors in 5 minutes) pages; a slow burn (errors over hours) opens a ticket.

> **Watch out:** Alerting on a single failed health check or a single dropped packet guarantees noise. Require a condition to persist or to cross a meaningful threshold.

## Lesson 6: Incident response and postmortems

When something breaks, a clear process limits the damage:

1. **Detect and declare**: someone declares an incident and its severity.
2. **Roles**: an **incident commander** coordinates; others investigate; one person handles communication.
3. **Mitigate first**: restore service (roll back the change, fail over, disable the feature) before finding the root cause.
4. **Communicate**: regular updates to stakeholders and a status page for customers.
5. **Resolve and verify**: confirm with metrics that users are fine.
6. **Postmortem**: a **blameless** write-up: timeline, impact, root cause, what went well, what went badly, and **action items with owners and dates**.

> **Tip:** Most network incidents start with a change. "What changed in the last few hours?" is the first question in every incident.

## Lesson 7: Real-world scenario: the slow Tuesdays

**Situation.** Every Tuesday around 10:00, users of an internal ERP system on OCI, accessed from three offices over FastConnect, complain that it is very slow for about 40 minutes. By the time anyone looks, it's fine. This has gone on for two months.

**Investigation.**

1. The team adds **synthetic tests** from each office to the ERP every minute, recording latency and packet loss, plus monitoring on FastConnect virtual circuit utilisation and BGP state.
2. The next Tuesday, the dashboards show the FastConnect circuit at 98% utilisation from 09:55 to 10:40, with latency rising from 4 ms to 180 ms and 2% packet loss. BGP stays up.
3. **VCN flow logs** for that window show one source dominating: a backup server in the data centre copying VM images to Object Storage in OCI, scheduled weekly at 09:55 by a team that had recently moved its backups to the cloud.

**Fix.**

1. Immediate: move the backup job to 01:00.
2. Longer term: send bulk transfers over a separate FastConnect virtual circuit (or the Site-to-Site VPN), and apply QoS on the on-premises routers to protect interactive traffic.
3. Add alerts at 80% circuit utilisation for more than 10 minutes, and include large scheduled transfers in the change process.

**Lessons learned.** Intermittent problems need continuous measurement; you can't troubleshoot from memories. Utilisation, latency and flow data on one timeline found in one week what complaints couldn't find in two months.

## Key takeaways

- Monitor what users experience first, then the components that cause it.
- Flow logs become powerful when you can query them quickly.
- Alert on symptoms tied to SLOs, not on every metric that moves.
- Incidents end with a blameless postmortem and real follow-up actions.

## Checkpoint

**Q1. Which set are the four golden signals?**

A. CPU, memory, disk, network
B. Latency, traffic, errors, saturation  ✓
C. Uptime, cost, users, regions
D. Bandwidth, jitter, loss, MTU

_The four golden signals from Google's SRE practice._

**Q2. What is the difference between an SLI and an SLO?**

A. They are the same
B. An SLI is a measurement; an SLO is the target for that measurement  ✓
C. An SLO is a log; an SLI is a metric
D. SLIs are only for networks

_For example, SLI = share of fast requests; SLO = 99.5% over 30 days._

**Q3. Which alert should page an on-call engineer at night?**

A. One of two VPN tunnels is down
B. Both VPN tunnels to a site are down and users can't reach the application  ✓
C. NAT usage is at 40%
D. A single health check failed once

_Page for user-impacting symptoms; route redundancy warnings to tickets._

**Q4. What do flow logs NOT contain?**

A. Source and destination IPs
B. Ports and protocol
C. Bytes and packets
D. Packet payload contents  ✓

_Flow logs capture metadata only; use packet capture to see contents._

**Q5. What is the first priority during an incident?**

A. Finding the root cause
B. Writing the postmortem
C. Mitigating impact and restoring service  ✓
D. Assigning blame

_Restore service first; root cause analysis comes after._

## Official reading

- [Google SRE book: monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Amazon CloudWatch Internet Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-InternetMonitor.html)
- [Azure Connection Monitor](https://learn.microsoft.com/en-us/azure/network-watcher/connection-monitor-overview)
- [Google Cloud Performance Dashboard](https://cloud.google.com/network-intelligence-center/docs/performance-dashboard/concepts/overview)
