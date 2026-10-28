# Module 05: Switching, Routing & NAT

**Level:** 1 · **Lessons:** 6

## A real-world thread: Branch reaching a database

A branch workstation sends data to a database in another subnet. A switch forwards frames locally; the router selects the remote path; translation may occur at the Internet boundary.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: Switching and MAC tables

A **switch** connects devices inside one local network. Every network card has a 48-bit **MAC address**, such as `a4:83:e7:2b:10:9c`. The switch builds a **MAC address table** by watching the source address of every frame: "a4:83:e7:2b:10:9c is on port 7".

When a frame arrives, the switch looks up the destination MAC. If it knows the port, it sends the frame only there. If it does not, or if the frame is a **broadcast** (destination `ff:ff:ff:ff:ff:ff`, used by ARP and DHCP), it **floods** the frame to every port in that network.

All devices that receive each other's broadcasts form a **broadcast domain**. Large broadcast domains become noisy and insecure, which is why networks are divided into smaller segments.

- Switches learn MAC addresses from incoming frames
- Known destination → one port; unknown or broadcast → flooded
- One subnet usually equals one broadcast domain

> **Watch out:** Loops between switches make broadcasts circle forever and can take down a network in seconds. Spanning Tree Protocol (STP) blocks redundant links to prevent this.

**Build the mental model:** Switches learn MAC addresses from incoming frames. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Branch reaching a database:** Consider how “switching and mac tables” affects the situation: A branch workstation sends data to a database in another subnet. A switch forwards frames locally; the router selects the remote path; translation may occur at the Internet boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For switching and mac tables, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain switching and mac tables to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: VLANs

A **VLAN** (virtual LAN) splits one physical switch into several separate broadcast domains. Ports in VLAN 10 (say, staff) cannot talk directly to ports in VLAN 20 (say, guests) even though they share the same hardware. Each VLAN normally gets its own IP subnet.

To carry several VLANs over one cable between switches, the link is configured as a **trunk** using the **802.1Q** standard, which adds a 4-byte tag with the VLAN number (1–4094) to each frame.

Traffic between VLANs must go through a **router** or a **Layer 3 switch**, which is exactly where you can apply security rules.

```text
interface Gi0/5
 switchport mode access
 switchport access vlan 10
interface Gi0/24
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
```

> **In the cloud:** Clouds do not expose VLANs. A cloud **subnet** plays the VLAN's role: a separate segment with its own address range, and traffic between subnets is routed and filtered by the virtual network.

**Build the mental model:** A **VLAN** (virtual LAN) splits one physical switch into several separate broadcast domains. Ports in VLAN 10 (say, staff) cannot talk directly to ports in VLAN 20 (say, guests) even though they share the same hardware. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Branch reaching a database:** Consider how “vlans” affects the situation: A branch workstation sends data to a database in another subnet. A switch forwards frames locally; the router selects the remote path; translation may occur at the Internet boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For vlans, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain vlans to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Routing tables

A **router** connects different networks and forwards packets between them. For every packet it checks the destination IP against its **routing table**, a list of prefixes and where to send matching traffic (the **next hop** or outgoing interface).

When several routes match, the router uses **longest-prefix match**: the most specific route wins. With routes for 10.0.0.0/8 and 10.1.0.0/16, a packet for 10.1.4.7 follows the /16.

The **default route**, `0.0.0.0/0`, matches everything, so it is used when nothing more specific exists. In a home network it points to the ISP; in a cloud public subnet it points to the Internet gateway; in a private subnet it points to a NAT gateway or a firewall.

```text
$ ip route
default via 10.0.1.1 dev eth0              # 0.0.0.0/0 → gateway
10.0.1.0/24 dev eth0 proto kernel scope link   # directly connected
172.16.0.0/16 via 10.0.1.254 dev eth0      # static route to another network
```

> **In the cloud:** Every cloud subnet has a route table that works exactly like this. A missing or wrong route (for example, a private subnet with no route to a NAT gateway) is one of the top causes of "my VM can't reach the Internet".

**Build the mental model:** A **router** connects different networks and forwards packets between them. For every packet it checks the destination IP against its **routing table**, a list of prefixes and where to send matching traffic (the **next h. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Branch reaching a database:** Consider how “routing tables” affects the situation: A branch workstation sends data to a database in another subnet. A switch forwards frames locally; the router selects the remote path; translation may occur at the Internet boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For routing tables, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain routing tables to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: Static vs dynamic routing

**Static routes** are typed in by hand. They are simple and predictable but do not react to failures, and become unmanageable at scale.

**Dynamic routing protocols** let routers learn routes from each other and adapt automatically when links fail:

- **OSPF** (Open Shortest Path First) is an *interior* protocol used inside one organisation. Routers share a map of the network and calculate the shortest path.
- **BGP** (Border Gateway Protocol) is the *exterior* protocol of the Internet. It exchanges routes between organisations (autonomous systems) and lets each one apply policy about which paths to prefer.

BGP matters enormously for cloud engineers: every private connection between your data centre and AWS (Direct Connect), Azure (ExpressRoute), Google Cloud (Interconnect) or OCI (FastConnect), and every dynamic VPN, uses BGP. You will study it properly in Module 09.

> **Tip:** Static routes are fine for small, stable setups (one VPN tunnel to one office). Use BGP as soon as you need automatic failover between two links.

**Build the mental model:** OSPF (Open Shortest Path First) is an *interior* protocol used inside one organisation. Routers share a map of the network and calculate the shortest path. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Branch reaching a database:** Consider how “static vs dynamic routing” affects the situation: A branch workstation sends data to a database in another subnet. A switch forwards frames locally; the router selects the remote path; translation may occur at the Internet boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For static vs dynamic routing, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain static vs dynamic routing to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: NAT and PAT

**NAT** (Network Address Translation) rewrites IP addresses as packets pass through a device.

- **Source NAT (SNAT)**: private source addresses are replaced with a public one on the way out, and translated back on the way in. This lets private networks reach the Internet.
- **PAT** (Port Address Translation, also called NAT overload) is the common form: many hosts share **one** public IP, and the NAT device tells their connections apart by giving each a different source port. Your home router does this.
- **Destination NAT (DNAT)**, or port forwarding, does the reverse: traffic arriving at a public IP and port is sent to a private server.

NAT keeps a **translation table** keyed by the 5-tuple. Because each public IP has about 64,000 ports, one IP can handle tens of thousands of simultaneous connections, but very busy systems can run out of ports (**port exhaustion**).

```text
Inside:  10.0.2.15:51544  → 93.184.215.14:443
Outside: 203.0.113.9:40012 → 93.184.215.14:443   (NAT's public IP, new port)
```

> **In the cloud:** Cloud **NAT gateways** (AWS NAT Gateway, Azure NAT Gateway, Google Cloud NAT, OCI NAT Gateway) give private subnets outbound Internet access while keeping them unreachable from outside. They are billed per hour and per GB, so they are often a surprise line on the bill.

**Build the mental model:** Source NAT (SNAT): private source addresses are replaced with a public one on the way out, and translated back on the way in. This lets private networks reach the Internet. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Branch reaching a database:** Consider how “nat and pat” affects the situation: A branch workstation sends data to a database in another subnet. A switch forwards frames locally; the router selects the remote path; translation may occur at the Internet boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For nat and pat, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain nat and pat to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: Putting it together: a packet's journey

Follow one packet from a private cloud VM to the Internet and back.

1. The VM (10.0.2.15, in a private subnet) wants to reach 93.184.215.14:443. That address is not in its subnet, so it sends the packet to the subnet's virtual router.
2. The subnet route table's most specific match is `0.0.0.0/0 → NAT gateway`.
3. The NAT gateway, sitting in a public subnet, rewrites the source to its own public IP and a free port, and records the translation.
4. The public subnet's route table sends `0.0.0.0/0` to the Internet gateway, which sends it out to the Internet.
5. The reply arrives at the NAT gateway's public IP. It looks up the translation, rewrites the destination back to 10.0.2.15:51544, and the virtual router delivers it.

Security filtering happens alongside: the VM's security group must allow the outbound connection, and (on AWS) the subnets' network ACLs must allow both directions.

> **Tip:** When an outbound connection fails, check in this order: the VM's own route table and firewall, the subnet route table, the security rules, the NAT gateway, then the public subnet's route to the Internet gateway.

**Build the mental model:** The VM (10.0.2.15, in a private subnet) wants to reach 93.184.215.14:443. That address is not in its subnet, so it sends the packet to the subnet's virtual router. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Branch reaching a database:** Consider how “putting it together: a packet's journey” affects the situation: A branch workstation sends data to a database in another subnet. A switch forwards frames locally; the router selects the remote path; translation may occur at the Internet boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For putting it together: a packet's journey, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain putting it together: a packet's journey to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
