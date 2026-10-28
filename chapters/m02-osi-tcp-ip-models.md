# Module 02: OSI & TCP/IP Models

**Level:** 1 · **Lessons:** 6 · **Questions:** 6

_Use the layer models to describe where any network problem lives._

## Lesson 1: The seven OSI layers

The **OSI model** splits networking into seven layers, each with one job. Engineers use it as a shared vocabulary: "it's a Layer 1 problem" means a cable or radio issue; "it's a Layer 7 problem" means the application itself.

From the bottom up:

- **1 Physical**: bits as electrical signals, light or radio. Cables, fibre, Wi-Fi radio.
- **2 Data Link**: delivery on the local network using **MAC addresses**. Ethernet, Wi-Fi frames, switches, VLANs.
- **3 Network**: delivery between networks using **IP addresses**. Routers, routing tables.
- **4 Transport**: delivery to the right application using **ports**; reliability with TCP or speed with UDP.
- **5 Session**: opening, maintaining and closing conversations.
- **6 Presentation**: data formats, compression and encryption (TLS is often placed here).
- **7 Application**: protocols the user's software speaks: HTTP, DNS, SMTP, SSH.

Layers 5 and 6 are rarely discussed separately in practice; most real problems are found at 1–4 or at 7.

> **Tip:** A classic memory aid, bottom to top: "Please Do Not Throw Sausage Pizza Away".

## Lesson 2: The TCP/IP model

The Internet actually runs on the **TCP/IP model**, which has four layers: **Link** (OSI 1–2), **Internet** (OSI 3, the IP protocol), **Transport** (OSI 4, TCP and UDP) and **Application** (OSI 5–7).

Cloud documentation freely mixes the two vocabularies. You will see "Layer 4 load balancer" (works with IP addresses and ports) and "Layer 7 load balancer" (understands HTTP URLs, headers and cookies) on every provider. Those layer numbers are OSI numbers, so you need to know both models.

- AWS Network Load Balancer, Azure Load Balancer, Google Cloud passthrough Network Load Balancer, OCI Network Load Balancer: Layer 4
- AWS Application Load Balancer, Azure Application Gateway, Google Cloud Application Load Balancer, OCI Load Balancer: Layer 7

> **In the cloud:** Firewall rules in every cloud are written at Layers 3 and 4 (IP address, protocol, port). A web application firewall (WAF) works at Layer 7 and can inspect URLs and request bodies.

## Lesson 3: Encapsulation

As data goes down the stack on the sender, each layer wraps it with its own header, like putting a letter in an envelope, then in a parcel, then in a shipping crate:

1. The application produces data, such as an HTTP request.
2. Transport adds a TCP header with source and destination **ports** → a **segment**.
3. Internet adds an IP header with source and destination **IP addresses** → a **packet**.
4. Link adds an Ethernet header with **MAC addresses** (and a trailer with a checksum) → a **frame**.
5. Physical sends the frame as **bits**.

The receiver unwraps in reverse order. A key detail: as a packet crosses routers, the IP addresses stay the same end to end, but the MAC addresses change at every hop, because each hop is a separate local delivery.

**What one web request looks like, layer by layer**

```
Ethernet: src MAC a4:83:e7:..  dst MAC 00:1a:2b:..   (changes every hop)
IP:       src 192.168.1.20     dst 93.184.215.14    (end to end)
TCP:      src port 53122       dst port 443
TLS/HTTP: GET / HTTP/1.1  Host: example.com
```

> **Watch out:** Each header costs bytes. Tunnels and VPNs add even more headers, which is why they reduce the space left for data (the MTU problem you will meet in Module 08).

## Lesson 4: Devices by layer

Knowing which layer a device works at tells you what information it can use to make decisions.

- **Hub / repeater (L1)**: copies bits to every port. Obsolete.
- **Switch (L2)**: learns which MAC address is on which port and forwards frames only where needed.
- **Router (L3)**: forwards packets between networks based on IP addresses.
- **Layer 4 firewall / load balancer**: decides based on IP addresses, protocol and ports.
- **Layer 7 proxy / WAF / application load balancer**: reads HTTP itself, so can route by URL path, host name or header and block attacks like SQL injection.

The higher the layer, the more a device can understand, and the more processing it costs.

> **Analogy:** An L3 device reads the address on the envelope. An L7 device opens the envelope and reads the letter.

## Lesson 5: Troubleshooting with the layers

The layers give you a method. Start at the bottom and work up, or start at the top and work down, but test one layer at a time.

- **L1**: Is the link up? Is the cable plugged in? Is Wi-Fi connected?
- **L2**: Can you reach devices on the same subnet? Is the VLAN correct?
- **L3**: Do you have an IP address? Can you ping the default gateway? Can you ping a remote IP like 1.1.1.1?
- **L4**: Is the port open? Is a firewall or security group blocking it?
- **L7**: Does DNS resolve? Does the application return an error (HTTP 500, certificate error)?

**A quick bottom-up check**

```
ip addr                  # L3: do I have an address? (Windows: ipconfig)
ping 192.168.1.1         # L3: can I reach my gateway?
ping 1.1.1.1             # L3: can I reach the Internet?
nslookup example.com     # L7: does DNS work?
curl -I https://example.com   # L4/L7: does the service answer?
```

> **Tip:** If `ping 1.1.1.1` works but `ping example.com` fails, the network is fine and DNS is broken. That one test saves a lot of time.

## Lesson 6: Real-world scenario: using the layers to fix a broken branch

**Situation.** A new branch office opens. Staff can print to the local printer but can't open any website or the company's cloud apps. IT support is 800 km away and talks a local employee through troubleshooting by phone.

**Walking up the layers.**

1. **Layer 1**: the laptop's Ethernet light is on and Wi-Fi shows "connected". Physical layer fine.
2. **Layer 2**: printing to the local printer works, so frames are moving on the local network.
3. **Layer 3**: `ipconfig` shows IP 192.168.10.45/24 and a default gateway of 192.168.1.1. That gateway is **not in the laptop's subnet** (192.168.10.0/24), so the laptop can't reach it to send traffic off the local network. `ping 192.168.10.1` (the router's real address) works.
4. Root cause: the DHCP scope on the new router was copied from another branch and hands out the wrong gateway.

**Fix.** Correct the DHCP option for the default gateway to 192.168.10.1, renew leases (`ipconfig /renew`), and test: `ping 1.1.1.1` works, `nslookup` works, websites open.

**Lessons learned.** The layered method avoided guessing. Because Layer 2 worked (printing) and Layer 3 failed beyond the subnet, attention went straight to IP settings. Saying "it's Layer 3, the default gateway" turned a vague complaint into a five-minute fix.

## Key takeaways

- The OSI model has 7 layers; the TCP/IP model has 4 and is what the Internet runs.
- Each layer adds its own header: data → segment → packet → frame → bits.
- "Layer 4" means ports and TCP/UDP; "Layer 7" means the application, such as HTTP.
- Naming the layer of a fault is the fastest way to narrow down its cause.

## Checkpoint

**Q1. A load balancer routes /api and /images to different servers. Which layer is it working at?**

A. Layer 3
B. Layer 4
C. Layer 7  ✓
D. Layer 2

_Reading the URL path requires understanding HTTP, which is Layer 7._

**Q2. Which unit belongs to the transport layer?**

A. Frame
B. Packet
C. Segment  ✓
D. Bit

_TCP data units are segments; IP carries packets; Ethernet carries frames._

**Q3. As a packet crosses three routers, what stays the same from start to finish?**

A. The source and destination MAC addresses
B. The source and destination IP addresses  ✓
C. The Ethernet header
D. Nothing

_IP addresses are end to end; MAC addresses are rewritten at every hop._

**Q4. You can ping 1.1.1.1 but not google.com. Where is the problem most likely?**

A. Physical layer
B. Data link layer
C. DNS at the application layer  ✓
D. The network card

_IP connectivity works, so name resolution (DNS) is failing._

**Q5. Which TCP/IP layer corresponds to OSI Layer 3?**

A. Link
B. Internet  ✓
C. Transport
D. Application

_The TCP/IP Internet layer is where IP lives, matching OSI Layer 3 (Network)._

**Q6. In the branch scenario, local printing worked but websites didn't. What did that prove?**

A. The cable was broken
B. Local Layer 2 delivery worked, so the problem was at Layer 3 or above  ✓
C. DNS was the only problem
D. The printer was misconfigured

_Local communication working narrows the fault to routing or higher layers._

## Official reading

- [Cloudflare Learning: the OSI model](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/)
- [Wireshark documentation](https://www.wireshark.org/docs/)
