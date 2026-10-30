# Module 19: Cloud Network Performance

**Level:** 3 · **Lessons:** 6 · **Questions:** 5

_Measure, explain and improve throughput and latency for cloud workloads._

## Lesson 1: What limits throughput in the cloud

A VM's network performance has several independent ceilings. Whichever is lowest wins.

- **Instance bandwidth**: every provider scales network bandwidth with VM size. Small instances may get "up to" a burst value for short periods, then drop to a baseline.
- **Per-flow limits**: a single TCP connection often can't use all of an instance's bandwidth. For example, AWS documents a 5 Gbps limit per flow between instances outside a cluster placement group (and per flow to the Internet or through a VPN or Direct Connect connection); parallel flows go beyond it.
- **Packets per second (PPS)** and **connection tracking** limits: workloads with many small packets or huge numbers of connections hit these before bandwidth. On AWS, the ENA driver exposes counters such as `bw_in_allowance_exceeded`, `pps_allowance_exceeded` and `conntrack_allowance_exceeded`.
- **Gateways and services**: NAT gateways, VPN tunnels, firewalls and load balancers have their own throughput and connection limits.
- **Latency and TCP behaviour**: on long-distance paths, TCP windows limit how fast one connection can go.

> **Tip:** When someone says "the network is slow", ask: one connection or many? Same zone or far away? Through a gateway or direct? The answer points to the limit.

## Lesson 2: Bandwidth-delay product and TCP tuning

TCP can only have a limited amount of unacknowledged data "in flight". To fill a path, the window must be at least the **bandwidth-delay product (BDP)**:

**BDP = bandwidth × round-trip time**

```
1 Gbps × 100 ms = 1,000,000,000 bits/s × 0.1 s = 100 Mbit ≈ 12.5 MB in flight
With a 64 KB window on that path: 64 KB / 0.1 s ≈ 5 Mbps maximum, however fast the link is
```

Modern operating systems use **TCP window scaling** and auto-tuning, so windows grow large automatically, but limits in the OS, the application or a middlebox can still cap them.

**Congestion control** decides how quickly TCP speeds up and how it reacts to loss. **CUBIC** (the Linux default) treats loss as congestion and backs off. **BBR** models the path's bandwidth and RTT and copes better with long, slightly lossy paths, often giving much higher throughput for cross-region and Internet transfers.

**Inspect and adjust TCP settings on Linux (test before using in production)**

```
sysctl net.ipv4.tcp_congestion_control          # usually cubic
sysctl net.ipv4.tcp_rmem net.ipv4.tcp_wmem      # min / default / max buffer sizes
sudo sysctl -w net.core.default_qdisc=fq
sudo sysctl -w net.ipv4.tcp_congestion_control=bbr
ss -ti dst 10.30.4.5                            # per-connection cwnd, rtt, retransmits
```

> **Tip:** For big transfers between regions, run several parallel streams (many tools support this, such as `aws s3 cp` with multipart uploads, `gsutil -m`, `azcopy`, `rclone --transfers`). Parallelism beats tuning.

## Lesson 3: Enhanced networking and NIC types

Cloud VMs reach high performance with hardware offload that bypasses the hypervisor (SR-IOV and dedicated network cards):

- **AWS**: the **Elastic Network Adapter (ENA)** on Nitro instances; **ENA Express** uses AWS's SRD protocol to raise single-flow bandwidth and reduce tail latency between supported instances in the same AZ; **EFA** (Elastic Fabric Adapter) for HPC and ML clusters.
- **Azure**: **Accelerated Networking** (SR-IOV) cuts latency and CPU use; newer VM families use the **Microsoft Azure Network Adapter (MANA)**. Enable it on supported VM sizes; most production sizes support it.
- **Google Cloud**: **gVNIC** is the recommended virtual NIC (required for higher bandwidth tiers); **Tier_1 networking** raises per-VM egress bandwidth on supported machine types.
- **OCI**: **hardware-assisted (SR-IOV)** or **paravirtualized** VNIC attachment; bandwidth scales with the shape's OCPU count; **cluster networks** with RDMA for HPC.

Make sure the guest OS has the right drivers (current cloud images do) and that the feature is enabled on the instance or NIC.

> **Watch out:** Choosing a tiny VM size for a gateway, proxy or database replica often caps its network bandwidth far below what the workload needs. Check the documented bandwidth for the size, not just CPU and memory.

## Lesson 4: Placement and latency

Physical distance sets the floor for latency, so place components that talk constantly close to each other:

- **Same region** for anything chatty; cross-region calls add tens of milliseconds.
- **Same zone** for the lowest latency, at the cost of resilience; many architectures keep each app tier's traffic within a zone and replicate across zones.
- **Placement groups** for tightly coupled workloads: AWS **cluster placement groups**, Azure **proximity placement groups**, Google Cloud **compact placement policies**, and OCI **cluster networks** or capacity in the same fault domain.

Application design matters as much as the network:

- **Reuse connections** (HTTP keep-alive, connection pools) to avoid repeated TCP and TLS handshakes.
- **Batch** small requests; one call with 100 items beats 100 calls.
- Use **HTTP/2 or gRPC** for many concurrent requests over one connection.
- **Cache** close to the consumer.

**Why chatty designs suffer across distance**

```
Page needs 40 sequential database queries
Same zone (0.3 ms RTT):   40 × 0.3 ms  ≈ 12 ms
Other region (40 ms RTT): 40 × 40 ms   ≈ 1.6 s
```

> **Tip:** Before moving a component to another zone or region, count how many sequential round trips it makes per user request.

## Lesson 5: Measuring performance properly

Measure before and after any change, with the right tools:

- **iperf3** measures raw TCP/UDP throughput between two hosts.
- **ping / mtr** measure latency and loss along a path.
- **Provider metrics**: per-instance network in/out, packets, dropped packets and allowance counters; load balancer and NAT gateway metrics (active connections, port allocation errors).
- **Application metrics**: request latency percentiles (p50, p95, p99) tell you what users feel.

**iperf3 tests**

```
# on the server
iperf3 -s
# on the client: 30 s single stream, then 8 parallel streams, then reverse direction
iperf3 -c 10.30.4.5 -t 30
iperf3 -c 10.30.4.5 -t 30 -P 8
iperf3 -c 10.30.4.5 -t 30 -R
# check the ENA allowance counters on AWS
ethtool -S eth0 | grep allowance
```

If one stream is slow but eight parallel streams reach the instance limit, the bottleneck is per-flow (TCP window, latency or per-flow caps), not the instance.

> **Watch out:** Testing through the public Internet, across regions, or from a laptop on Wi-Fi measures that path, not your cloud network. Test from VMs in the locations that matter.

## Lesson 6: Real-world scenario: the nightly backup that never finished

**Situation.** A company copies a 4 TB database backup every night from its primary region in the Middle East to a disaster-recovery region in Europe, about 4,500 km away. Both VMs are large, with 25 Gbps of documented bandwidth. The copy uses a single `scp` stream and takes more than 14 hours, overlapping with the next business day.

**Investigation.**

1. `ping` shows about 90 ms round-trip time between the regions.
2. `iperf3` with one stream reaches about 650 Mbps; with 16 parallel streams it reaches over 9 Gbps. So the instances and network are fine; the limit is per connection.
3. The BDP at 90 ms and 10 Gbps is about 112 MB, far larger than one scp connection's effective window. scp also encrypts on a single CPU core.
4. Provider metrics show no drops or allowance-exceeded counters.

**Fix.**

1. Switch to a tool with parallel, multipart transfers (the provider's storage CLI to object storage, or rclone) with 16–32 streams.
2. Enable BBR congestion control on both hosts after testing.
3. Write the backup to object storage in the primary region and use the provider's cross-region replication, which runs on the provider's backbone.
4. Compress before transfer to reduce data volume.

The nightly copy dropped to about 75 minutes.

**Lessons learned.** Instance bandwidth means nothing if a single TCP stream across a long path can't fill it. Measure single versus parallel streams to find per-flow limits, and use parallelism and the provider's managed replication for bulk data.

## Key takeaways

- Throughput is limited by instance size, per-flow limits, TCP windows and latency, not just "bandwidth".
- The bandwidth-delay product tells you how much data must be in flight to fill a path.
- Use the provider's enhanced networking and place chatty components close together.
- Measure with iperf3 and the provider's network metrics before tuning anything.

## Checkpoint

**Q1. What is the bandwidth-delay product of a 1 Gbps path with 50 ms RTT?**

A. 50 KB
B. 625 KB
C. About 6.25 MB  ✓
D. 50 MB

_1,000,000,000 × 0.05 = 50 Mbit ≈ 6.25 MB._

**Q2. One iperf3 stream reaches 600 Mbps; eight parallel streams reach 8 Gbps. Where is the bottleneck?**

A. The instance size
B. Per-flow limits such as TCP window, latency or per-flow caps  ✓
C. The physical cable
D. DNS

_The aggregate is fine, so the limit applies to each single flow._

**Q3. Which TCP congestion control algorithm often performs better on long, slightly lossy paths?**

A. Reno
B. CUBIC
C. BBR  ✓
D. Vegas

_BBR models bandwidth and RTT instead of treating every loss as congestion._

**Q4. What is Azure's SR-IOV feature for higher VM network performance called?**

A. Elastic Network Adapter
B. Accelerated Networking  ✓
C. gVNIC
D. Tier_1 networking

_Accelerated Networking bypasses the host's virtual switch for lower latency and CPU use._

**Q5. A page makes 40 sequential database calls. What happens if the database moves to a region 40 ms away?**

A. Nothing noticeable
B. About 40 ms slower
C. About 1.6 seconds slower  ✓
D. It becomes faster

_40 sequential round trips × 40 ms ≈ 1.6 s added latency._

## Official reading

- [AWS: EC2 instance network bandwidth](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-network-bandwidth.html)
- [Azure: accelerated networking](https://learn.microsoft.com/en-us/azure/virtual-network/accelerated-networking-overview)
- [Google Cloud: network bandwidth](https://cloud.google.com/compute/docs/network-bandwidth)
- [iperf3](https://software.es.net/iperf/)
