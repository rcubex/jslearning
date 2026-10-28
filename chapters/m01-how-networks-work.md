# Module 01: How Networks Work

**Level:** 1 · **Lessons:** 5

## A real-world thread: Video call across countries

An employee in Dubai joins a video call hosted in Europe. Voice packets cross home Wi-Fi, ISP networks, international transit and a cloud region. Different paths and temporary congestion may introduce jitter despite high advertised bandwidth.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: What a network is

A network is two or more devices connected so they can exchange data. Every network has three ingredients: **devices** (laptops, phones, servers, printers), **links** (copper cable, fibre, Wi-Fi, mobile radio) and **protocols**, the agreed rules that say how data is formatted, addressed and delivered.

Networks are usually described by size. A **LAN** (local area network) covers one home, office or building and is owned by you. A **WAN** (wide area network) joins sites across cities or countries, usually over links rented from a carrier. The **Internet** is a network of networks: tens of thousands of independently run networks, owned by ISPs, universities, companies and cloud providers, that agree to pass traffic to each other.

A cloud provider is, from a network point of view, a huge private WAN with data centres in many countries. When you build a "virtual network" in AWS, Azure, Google Cloud or OCI, you are carving out your own private LAN inside that provider's network.

- Devices + links + protocols = a network
- LAN = local and yours; WAN = long distance, usually rented
- The Internet has no single owner; it works because networks agree on common protocols

> **Analogy:** Think of the road system. Houses are devices, roads are links, and the highway code is the protocol. Your street is a LAN; motorways between cities are a WAN.

**Build the mental model:** Devices + links + protocols = a network. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Video call across countries:** Consider how “what a network is” affects the situation: An employee in Dubai joins a video call hosted in Europe. Voice packets cross home Wi-Fi, ISP networks, international transit and a cloud region. Different paths and temporary congestion may introduce jitter despite high advertised bandwidth. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For what a network is, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain what a network is to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: Packets and packet switching

Data is not sent as one long stream. It is cut into small pieces called **packets**, typically up to about 1,500 bytes each on Ethernet. A 5 MB photo becomes roughly 3,500 packets. Each packet carries a **header** with the source address, the destination address and other control information, followed by a slice of the actual data, called the **payload**.

Routers forward each packet independently. A router looks at the destination address, consults its routing table and sends the packet one **hop** closer to its destination. Packets from the same file can take different paths and arrive out of order; the receiving computer puts them back together.

This design is called **packet switching**. It lets millions of conversations share the same links efficiently, and if a link fails, routers simply send packets another way. The older alternative, circuit switching (classic telephone calls), reserved a whole path for one conversation even when nobody was speaking.

- Packet = header (addresses and control info) + payload (your data)
- Routers make a fresh forwarding decision for every packet
- Lost packets can be re-sent; the receiver reassembles them in order

```text
traceroute 8.8.8.8        # macOS / Linux
tracert 8.8.8.8           # Windows
```

> **Tip:** Each line of a traceroute is one router (hop). Asterisks (* * *) usually mean that router chose not to reply to the probe, not that the path is broken.

**Build the mental model:** Packet = header (addresses and control info) + payload (your data). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Video call across countries:** Consider how “packets and packet switching” affects the situation: An employee in Dubai joins a video call hosted in Europe. Voice packets cross home Wi-Fi, ISP networks, international transit and a cloud region. Different paths and temporary congestion may introduce jitter despite high advertised bandwidth. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For packets and packet switching, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain packets and packet switching to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Bandwidth, latency, jitter, loss

Four numbers describe how a network path behaves, and each one affects applications differently.

**Bandwidth** is the maximum capacity of a link, measured in bits per second (Mbps, Gbps). It is the width of the pipe. **Latency** is the time a packet takes to travel, usually measured as round-trip time (RTT) in milliseconds. Light in fibre covers about 200 km per millisecond, so Dubai to London (about 5,500 km) can never be faster than roughly 55 ms round trip, however much bandwidth you buy. **Jitter** is how much latency varies from packet to packet. **Packet loss** is the percentage of packets that never arrive.

**Throughput** is what you actually get. A single TCP download over a long, slightly lossy path may reach only a fraction of the link's bandwidth, because TCP slows down whenever it sees loss.

- Large file transfers care most about bandwidth and loss
- Web pages, APIs and databases care most about latency (many small round trips)
- Voice and video calls care most about jitter and loss
- Cloud region choice is often a latency decision: put servers near users

```text
ping -c 20 1.1.1.1        # macOS / Linux: 20 probes
ping -n 20 1.1.1.1        # Windows
# Read: min/avg/max RTT and the "% packet loss" line
```

> **Watch out:** "Our Internet is fast" usually refers to bandwidth. A 1 Gbps link with 300 ms latency still makes a chatty application feel slow.

**Build the mental model:** Large file transfers care most about bandwidth and loss. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Video call across countries:** Consider how “bandwidth, latency, jitter, loss” affects the situation: An employee in Dubai joins a video call hosted in Europe. Voice packets cross home Wi-Fi, ISP networks, international transit and a cloud region. Different paths and temporary congestion may introduce jitter despite high advertised bandwidth. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For bandwidth, latency, jitter, loss, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain bandwidth, latency, jitter, loss to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: Topologies and the edge

**Topology** is the shape of a network. In a **star**, every device connects to a central switch; this is how almost every office LAN is built. In a **full mesh**, every site connects to every other site; it is resilient but the number of links grows quickly (10 sites need 45 links). **Hub-and-spoke** connects many branches to a central hub; it is cheaper and easier to control, but the hub becomes critical.

A home router is several devices in one box: a **switch** for wired ports, a **Wi-Fi access point**, a **router** that sends traffic to your ISP, a **DHCP server** that hands out addresses, a **NAT** device that shares one public IP address, and a basic **firewall**. In an enterprise or in the cloud these roles are separate, so each can be scaled and secured independently.

These shapes come back again and again in the cloud. Hub-and-spoke is the standard design for connecting many virtual networks through a central firewall: AWS Transit Gateway, Azure hub VNets and Virtual WAN, Google Network Connectivity Center and the OCI Dynamic Routing Gateway are all hubs.

- Star: simple, one central point
- Full mesh: n × (n − 1) / 2 links; resilient but costly
- Hub-and-spoke: the most common cloud design

> **In the cloud:** When you hear "transit hub" or "hub VNet", picture the hub-and-spoke diagram. Learn it once and it applies to all four providers.

**Build the mental model:** Star: simple, one central point. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Video call across countries:** Consider how “topologies and the edge” affects the situation: An employee in Dubai joins a video call hosted in Europe. Voice packets cross home Wi-Fi, ISP networks, international transit and a cloud region. Different paths and temporary congestion may introduce jitter despite high advertised bandwidth. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For topologies and the edge, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain topologies and the edge to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

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

**Build the mental model:** Your laptop already has an IP address, subnet mask, default gateway and DNS server, which it got from DHCP when it joined the network. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Video call across countries:** Consider how “how a web request travels end to end” affects the situation: An employee in Dubai joins a video call hosted in Europe. Voice packets cross home Wi-Fi, ISP networks, international transit and a cloud region. Different paths and temporary congestion may introduce jitter despite high advertised bandwidth. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For how a web request travels end to end, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain how a web request travels end to end to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
