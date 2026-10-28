# Module 05: Switching, Routing & NAT

**Level:** 1 · **Lessons:** 7 · **Questions:** 6

_Explain how traffic finds its way between subnets and out to the Internet._

## Lesson 1: Switching and MAC tables

A **switch** connects devices inside one local network. Every network card has a 48-bit **MAC address**, such as `a4:83:e7:2b:10:9c`. The switch builds a **MAC address table** by watching the source address of every frame: "a4:83:e7:2b:10:9c is on port 7".

When a frame arrives, the switch looks up the destination MAC. If it knows the port, it sends the frame only there. If it does not, or if the frame is a **broadcast** (destination `ff:ff:ff:ff:ff:ff`, used by ARP and DHCP), it **floods** the frame to every port in that network.

All devices that receive each other's broadcasts form a **broadcast domain**. Large broadcast domains become noisy and insecure, which is why networks are divided into smaller segments.

- Switches learn MAC addresses from incoming frames
- Known destination → one port; unknown or broadcast → flooded
- One subnet usually equals one broadcast domain

> **Watch out:** Loops between switches make broadcasts circle forever and can take down a network in seconds. Spanning Tree Protocol (STP) blocks redundant links to prevent this.

## Lesson 2: VLANs

A **VLAN** (virtual LAN) splits one physical switch into several separate broadcast domains. Ports in VLAN 10 (say, staff) cannot talk directly to ports in VLAN 20 (say, guests) even though they share the same hardware. Each VLAN normally gets its own IP subnet.

To carry several VLANs over one cable between switches, the link is configured as a **trunk** using the **802.1Q** standard, which adds a 4-byte tag with the VLAN number (1–4094) to each frame.

Traffic between VLANs must go through a **router** or a **Layer 3 switch**, which is exactly where you can apply security rules.

**Typical Cisco-style configuration**

```
interface Gi0/5
 switchport mode access
 switchport access vlan 10
interface Gi0/24
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
```

> **In the cloud:** Clouds do not expose VLANs. A cloud **subnet** plays the VLAN's role: a separate segment with its own address range, and traffic between subnets is routed and filtered by the virtual network.

## Lesson 3: Routing tables

A **router** connects different networks and forwards packets between them. For every packet it checks the destination IP against its **routing table**, a list of prefixes and where to send matching traffic (the **next hop** or outgoing interface).

When several routes match, the router uses **longest-prefix match**: the most specific route wins. With routes for 10.0.0.0/8 and 10.1.0.0/16, a packet for 10.1.4.7 follows the /16.

The **default route**, `0.0.0.0/0`, matches everything, so it is used when nothing more specific exists. In a home network it points to the ISP; in a cloud public subnet it points to the Internet gateway; in a private subnet it points to a NAT gateway or a firewall.

**Read a Linux routing table**

```
$ ip route
default via 10.0.1.1 dev eth0              # 0.0.0.0/0 → gateway
10.0.1.0/24 dev eth0 proto kernel scope link   # directly connected
172.16.0.0/16 via 10.0.1.254 dev eth0      # static route to another network
```

> **In the cloud:** Every cloud subnet has a route table that works exactly like this. A missing or wrong route (for example, a private subnet with no route to a NAT gateway) is one of the top causes of "my VM can't reach the Internet".

## Lesson 4: Static vs dynamic routing

**Static routes** are typed in by hand. They are simple and predictable but do not react to failures, and become unmanageable at scale.

**Dynamic routing protocols** let routers learn routes from each other and adapt automatically when links fail:

- **OSPF** (Open Shortest Path First) is an *interior* protocol used inside one organisation. Routers share a map of the network and calculate the shortest path.
- **BGP** (Border Gateway Protocol) is the *exterior* protocol of the Internet. It exchanges routes between organisations (autonomous systems) and lets each one apply policy about which paths to prefer.

BGP matters enormously for cloud engineers: every private connection between your data centre and AWS (Direct Connect), Azure (ExpressRoute), Google Cloud (Interconnect) or OCI (FastConnect), and every dynamic VPN, uses BGP. You will study it properly in Module 09.

> **Tip:** Static routes are fine for small, stable setups (one VPN tunnel to one office). Use BGP as soon as you need automatic failover between two links.

## Lesson 5: NAT and PAT

**NAT** (Network Address Translation) rewrites IP addresses as packets pass through a device.

- **Source NAT (SNAT)**: private source addresses are replaced with a public one on the way out, and translated back on the way in. This lets private networks reach the Internet.
- **PAT** (Port Address Translation, also called NAT overload) is the common form: many hosts share **one** public IP, and the NAT device tells their connections apart by giving each a different source port. Your home router does this.
- **Destination NAT (DNAT)**, or port forwarding, does the reverse: traffic arriving at a public IP and port is sent to a private server.

NAT keeps a **translation table** keyed by the 5-tuple. Because each public IP has about 64,000 ports, one IP can handle tens of thousands of simultaneous connections, but very busy systems can run out of ports (**port exhaustion**).

**A PAT translation, conceptually**

```
Inside:  10.0.2.15:51544  → 93.184.215.14:443
Outside: 203.0.113.9:40012 → 93.184.215.14:443   (NAT's public IP, new port)
```

> **In the cloud:** Cloud **NAT gateways** (AWS NAT Gateway, Azure NAT Gateway, Google Cloud NAT, OCI NAT Gateway) give private subnets outbound Internet access while keeping them unreachable from outside. They are billed per hour and per GB, so they are often a surprise line on the bill.

## Lesson 6: Putting it together: a packet's journey

Follow one packet from a private cloud VM to the Internet and back.

1. The VM (10.0.2.15, in a private subnet) wants to reach 93.184.215.14:443. That address is not in its subnet, so it sends the packet to the subnet's virtual router.
2. The subnet route table's most specific match is `0.0.0.0/0 → NAT gateway`.
3. The NAT gateway, sitting in a public subnet, rewrites the source to its own public IP and a free port, and records the translation.
4. The public subnet's route table sends `0.0.0.0/0` to the Internet gateway, which sends it out to the Internet.
5. The reply arrives at the NAT gateway's public IP. It looks up the translation, rewrites the destination back to 10.0.2.15:51544, and the virtual router delivers it.

Security filtering happens alongside: the VM's security group must allow the outbound connection, and (on AWS) the subnets' network ACLs must allow both directions.

> **Tip:** When an outbound connection fails, check in this order: the VM's own route table and firewall, the subnet route table, the security rules, the NAT gateway, then the public subnet's route to the Internet gateway.

## Lesson 7: Real-world scenario: NAT port exhaustion under load

**Situation.** A service running on 400 containers in private subnets calls a third-party API heavily. During a marketing campaign, about 5% of outbound API calls start failing with connection errors, while the API provider reports no problems.

**Investigation.**

1. All containers reach the Internet through a single NAT gateway with one public IP.
2. NAT gateway metrics show errors allocating ports and a very high number of active connections, all to the **same destination IP and port** (the API).
3. A NAT device can only use about 64,000 source ports per public IP for connections to one destination IP and port. The service opened a new connection for every request and didn't reuse them, so tens of thousands of connections sat in TIME_WAIT or open at once.

**Fix.**

1. Enable HTTP keep-alive and connection pooling in the service, so a few hundred connections carry all requests. This alone cut active connections by over 95%.
2. Add more public IPs to the NAT gateway (each multiplies the available ports for the same destination). Cloud NAT and Azure NAT Gateway also allow multiple IPs and tunable port allocation.
3. Monitor port allocation errors.

**Lessons learned.** NAT shares a limited pool of ports. Applications that open a fresh connection per request can exhaust it at scale. Connection reuse is the best fix; extra public IPs are the safety margin.

## Key takeaways

- Switches forward frames by MAC address inside one broadcast domain.
- Routers forward packets between networks using longest-prefix match.
- The default route 0.0.0.0/0 catches everything without a more specific route.
- NAT/PAT let many private hosts share public addresses; cloud NAT gateways do this for you.

## Checkpoint

**Q1. A route table has 10.0.0.0/8 → A and 10.1.0.0/16 → B. Where does 10.1.4.7 go?**

A. A
B. B  ✓
C. Both
D. Dropped

_Longest-prefix match: /16 is more specific than /8._

**Q2. Which protocol connects on-premises networks to AWS, Azure, Google Cloud and OCI over private links?**

A. OSPF
B. RIP
C. BGP  ✓
D. STP

_All four exchange routes with your routers using eBGP._

**Q3. A switch receives a frame for a MAC address it has never seen. What does it do?**

A. Drops it
B. Sends it back
C. Floods it to all ports in that VLAN  ✓
D. Sends it to the router

_Unknown unicast frames are flooded until the switch learns where the destination is._

**Q4. How does PAT let 200 laptops share one public IP?**

A. It gives each laptop a different public IP in turn
B. It tells their connections apart by translating each to a different source port  ✓
C. It uses VLAN tags
D. It uses MAC addresses

_Each connection gets its own source port on the shared public IP._

**Q5. What is needed for devices in VLAN 10 and VLAN 20 to talk to each other?**

A. A hub
B. A longer cable
C. A router or Layer 3 switch  ✓
D. A second switch

_VLANs are separate broadcast domains; traffic between them must be routed._

**Q6. Many containers behind one NAT IP call the same API and some connections fail under load. What's the most effective first fix?**

A. Bigger containers
B. Reuse connections with keep-alive and pooling  ✓
C. Change DNS servers
D. Disable TLS

_Reusing connections drastically reduces the number of NAT ports needed._

## Official reading

- [Cisco Packet Tracer](https://www.netacad.com/cisco-packet-tracer)
- [Cloudflare Learning: what is routing](https://www.cloudflare.com/learning/network-layer/what-is-routing/)
