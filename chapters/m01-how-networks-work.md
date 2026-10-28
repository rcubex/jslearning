# Module 01: How Networks Work

**Level:** 1 · **Lessons:** 6 · **Questions:** 6

_Understand what happens when data crosses a network, and measure it yourself._

## Lesson 1: What a network is

A network is two or more devices connected so they can exchange data. Every network has three ingredients: **devices** (laptops, phones, servers, printers), **links** (copper cable, fibre, Wi-Fi, mobile radio) and **protocols**, the agreed rules that say how data is formatted, addressed and delivered.

Networks are usually described by size. A **LAN** (local area network) covers one home, office or building and is owned by you. A **WAN** (wide area network) joins sites across cities or countries, usually over links rented from a carrier. The **Internet** is a network of networks: tens of thousands of independently run networks, owned by ISPs, universities, companies and cloud providers, that agree to pass traffic to each other.

A cloud provider is, from a network point of view, a huge private WAN with data centres in many countries. When you build a "virtual network" in AWS, Azure, Google Cloud or OCI, you are carving out your own private LAN inside that provider's network.

- Devices + links + protocols = a network
- LAN = local and yours; WAN = long distance, usually rented
- The Internet has no single owner; it works because networks agree on common protocols

> **Analogy:** Think of the road system. Houses are devices, roads are links, and the highway code is the protocol. Your street is a LAN; motorways between cities are a WAN.

## Lesson 2: Packets and packet switching

Data is not sent as one long stream. It is cut into small pieces called **packets**, typically up to about 1,500 bytes each on Ethernet. A 5 MB photo becomes roughly 3,500 packets. Each packet carries a **header** with the source address, the destination address and other control information, followed by a slice of the actual data, called the **payload**.

Routers forward each packet independently. A router looks at the destination address, consults its routing table and sends the packet one **hop** closer to its destination. Packets from the same file can take different paths and arrive out of order; the receiving computer puts them back together.

This design is called **packet switching**. It lets millions of conversations share the same links efficiently, and if a link fails, routers simply send packets another way. The older alternative, circuit switching (classic telephone calls), reserved a whole path for one conversation even when nobody was speaking.

- Packet = header (addresses and control info) + payload (your data)
- Routers make a fresh forwarding decision for every packet
- Lost packets can be re-sent; the receiver reassembles them in order

**Watch the hops between you and a server**

```
traceroute 8.8.8.8        # macOS / Linux
tracert 8.8.8.8           # Windows
```

> **Tip:** Each line of a traceroute is one router (hop). Asterisks (* * *) usually mean that router chose not to reply to the probe, not that the path is broken.

## Lesson 3: Bandwidth, latency, jitter, loss

Four numbers describe how a network path behaves, and each one affects applications differently.

**Bandwidth** is the maximum capacity of a link, measured in bits per second (Mbps, Gbps). It is the width of the pipe. **Latency** is the time a packet takes to travel, usually measured as round-trip time (RTT) in milliseconds. Light in fibre covers about 200 km per millisecond, so Dubai to London (about 5,500 km) can never be faster than roughly 55 ms round trip, however much bandwidth you buy. **Jitter** is how much latency varies from packet to packet. **Packet loss** is the percentage of packets that never arrive.

**Throughput** is what you actually get. A single TCP download over a long, slightly lossy path may reach only a fraction of the link's bandwidth, because TCP slows down whenever it sees loss.

- Large file transfers care most about bandwidth and loss
- Web pages, APIs and databases care most about latency (many small round trips)
- Voice and video calls care most about jitter and loss
- Cloud region choice is often a latency decision: put servers near users

**Measure latency and loss**

```
ping -c 20 1.1.1.1        # macOS / Linux: 20 probes
ping -n 20 1.1.1.1        # Windows
# Read: min/avg/max RTT and the "% packet loss" line
```

> **Watch out:** "Our Internet is fast" usually refers to bandwidth. A 1 Gbps link with 300 ms latency still makes a chatty application feel slow.

## Lesson 4: Topologies and the edge

**Topology** is the shape of a network. In a **star**, every device connects to a central switch; this is how almost every office LAN is built. In a **full mesh**, every site connects to every other site; it is resilient but the number of links grows quickly (10 sites need 45 links). **Hub-and-spoke** connects many branches to a central hub; it is cheaper and easier to control, but the hub becomes critical.

A home router is several devices in one box: a **switch** for wired ports, a **Wi-Fi access point**, a **router** that sends traffic to your ISP, a **DHCP server** that hands out addresses, a **NAT** device that shares one public IP address, and a basic **firewall**. In an enterprise or in the cloud these roles are separate, so each can be scaled and secured independently.

These shapes come back again and again in the cloud. Hub-and-spoke is the standard design for connecting many virtual networks through a central firewall: AWS Transit Gateway, Azure hub VNets and Virtual WAN, Google Network Connectivity Center and the OCI Dynamic Routing Gateway are all hubs.

- Star: simple, one central point
- Full mesh: n × (n − 1) / 2 links; resilient but costly
- Hub-and-spoke: the most common cloud design

> **In the cloud:** When you hear "transit hub" or "hub VNet", picture the hub-and-spoke diagram. Learn it once and it applies to all four providers.

## Lesson 5: How a web request travels end to end

Here is everything that happens when you type `https://example.com` and press Enter, in order. You will meet every one of these steps in more detail later in the course.

1. Your laptop already has an IP address, subnet mask, default gateway and DNS server, which it got from **DHCP** when it joined the network.
2. The browser asks **DNS** for the IP address of example.com.
3. The laptop sees the destination is not on its local subnet, so it sends the packet to its **default gateway** (your router). It uses **ARP** to find the router's MAC address.
4. Your router applies **NAT**, replacing your private address with its public one, and forwards the packet to the ISP.
5. Routers across several networks forward the packet hop by hop using **BGP**-learned routes.
6. The browser and server set up a **TCP** connection (three-way handshake) on port 443, then a **TLS** session to encrypt traffic.
7. The browser sends an **HTTP** request; the server replies; packets flow back along the same chain in reverse.

This takes roughly 50–300 ms and involves a dozen protocols. Networking skill is mostly the ability to picture this chain and find which link in it is broken.

- DHCP → DNS → ARP → gateway → NAT → routing → TCP → TLS → HTTP
- Troubleshooting means walking this chain step by step

> **Tip:** Keep this list. When something "doesn't connect", ask which step failed: no IP address, no DNS answer, no route, blocked port, or a TLS error. Each has a different fix.

## Lesson 6: Real-world scenario: "The Internet is slow" in the Dubai office

**Situation.** Staff in a 60-person Dubai office complain that "the Internet is slow" every afternoon. The office has a 500 Mbps fibre line. Speed tests in the morning show 480 Mbps; in the afternoon, web pages take seconds to start loading and video calls freeze.

**Investigation.**

1. An afternoon speed test still shows about 300 Mbps, so raw bandwidth isn't the main problem.
2. `ping -c 100 1.1.1.1` shows average latency rising from 4 ms (morning) to 180 ms (afternoon), with jitter of ±90 ms and 1.5% packet loss.
3. The router's interface graph shows upload bandwidth pinned at 100% (the line is 500 Mbps down but only 100 Mbps up).
4. The router's traffic report shows one PC uploading continuously: a design team's cloud folder syncing large video files every afternoon.

**Why it hurts.** When the upload direction is full, packets queue in the router's buffer. Every packet, including the tiny acknowledgements that downloads depend on and the voice packets of calls, waits in that queue. Latency and jitter explode even though download bandwidth is free. This queueing problem is called **bufferbloat**.

**Fix.**

1. Limit the sync client's upload rate to 40 Mbps during working hours.
2. Enable smart queue management (such as fq_codel or CAKE) on the router so small, interactive packets aren't stuck behind bulk uploads.
3. Add QoS that prioritises voice and video traffic.

Afternoon latency stayed under 15 ms.

**Lessons learned.** "Slow" can mean low bandwidth, high latency, jitter or loss, and each has a different cause. Measure all four, in both directions, at the time the problem happens.

## Key takeaways

- A network is devices plus links plus agreed rules (protocols).
- Data travels as small packets that routers forward one hop at a time.
- Bandwidth, latency, jitter and loss together decide how an application feels.
- The Internet is thousands of independent networks that agree to exchange traffic.

## Checkpoint

**Q1. A video call stutters even though a speed test shows 500 Mbps. Which metric is the likely cause?**

A. Bandwidth
B. Jitter  ✓
C. Throughput
D. MTU

_Speed tests measure bandwidth. Real-time audio and video suffer when delay varies, which is jitter._

**Q2. What is the Internet?**

A. One network owned by ISPs
B. A network of independently run networks  ✓
C. A single protocol
D. The global DNS system

_The Internet is thousands of autonomous networks that exchange traffic with each other._

**Q3. Roughly what is the best possible round-trip time between two cities 5,000 km apart over fibre?**

A. 5 ms
B. 25 ms
C. 50 ms  ✓
D. 500 ms

_Light in fibre covers about 200 km per ms: 10,000 km round trip ÷ 200 = 50 ms, before any equipment delay._

**Q4. How many links does a full mesh of 6 sites need?**

A. 6
B. 12
C. 15  ✓
D. 36

_n × (n − 1) / 2 = 6 × 5 / 2 = 15._

**Q5. What does a router use to decide where to send a packet?**

A. The packet's payload
B. The destination address in the header  ✓
C. The size of the packet
D. The source port

_Routers look up the destination address in their routing table and forward one hop closer._

**Q6. In the Dubai office scenario, why did calls freeze when the upload was saturated even though download bandwidth was free?**

A. The ISP blocked video
B. DNS stopped working
C. Packets queued behind bulk uploads, causing high latency and jitter (bufferbloat)  ✓
D. The Wi-Fi channel changed

_A full upload queue delays every packet, including acknowledgements and voice._

## Official reading

- [Cloudflare Learning: what is the network layer](https://www.cloudflare.com/learning/network-layer/what-is-the-network-layer/)
- [Cloudflare Learning: what is latency](https://www.cloudflare.com/learning/performance/glossary/what-is-latency/)
