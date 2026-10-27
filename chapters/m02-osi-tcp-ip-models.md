# Module 02: OSI & TCP/IP Models

**Level:** 1 · **Lessons:** 5

## A real-world thread: Website appears down

A user can reach an IP address but cannot open its domain name. DNS, transport, TLS and application layers should be distinguished before anyone blames the web server.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

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

**Build the mental model:** 1 Physical: bits as electrical signals, light or radio. Cables, fibre, Wi-Fi radio. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Website appears down:** Consider how “the seven osi layers” affects the situation: A user can reach an IP address but cannot open its domain name. DNS, transport, TLS and application layers should be distinguished before anyone blames the web server. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For the seven osi layers, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain the seven osi layers to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: The TCP/IP model

The Internet actually runs on the **TCP/IP model**, which has four layers: **Link** (OSI 1–2), **Internet** (OSI 3, the IP protocol), **Transport** (OSI 4, TCP and UDP) and **Application** (OSI 5–7).

Cloud documentation freely mixes the two vocabularies. You will see "Layer 4 load balancer" (works with IP addresses and ports) and "Layer 7 load balancer" (understands HTTP URLs, headers and cookies) on every provider. Those layer numbers are OSI numbers, so you need to know both models.

- AWS Network Load Balancer, Azure Load Balancer, Google Cloud passthrough Network Load Balancer, OCI Network Load Balancer: Layer 4
- AWS Application Load Balancer, Azure Application Gateway, Google Cloud Application Load Balancer, OCI Load Balancer: Layer 7

> **In the cloud:** Firewall rules in every cloud are written at Layers 3 and 4 (IP address, protocol, port). A web application firewall (WAF) works at Layer 7 and can inspect URLs and request bodies.

**Build the mental model:** AWS Network Load Balancer, Azure Load Balancer, Google Cloud passthrough Network Load Balancer, OCI Network Load Balancer: Layer 4. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Website appears down:** Consider how “the tcp/ip model” affects the situation: A user can reach an IP address but cannot open its domain name. DNS, transport, TLS and application layers should be distinguished before anyone blames the web server. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For the tcp/ip model, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain the tcp/ip model to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Encapsulation

As data goes down the stack on the sender, each layer wraps it with its own header, like putting a letter in an envelope, then in a parcel, then in a shipping crate:

1. The application produces data, such as an HTTP request.
2. Transport adds a TCP header with source and destination **ports** → a **segment**.
3. Internet adds an IP header with source and destination **IP addresses** → a **packet**.
4. Link adds an Ethernet header with **MAC addresses** (and a trailer with a checksum) → a **frame**.
5. Physical sends the frame as **bits**.

The receiver unwraps in reverse order. A key detail: as a packet crosses routers, the IP addresses stay the same end to end, but the MAC addresses change at every hop, because each hop is a separate local delivery.

```text
Ethernet: src MAC a4:83:e7:..  dst MAC 00:1a:2b:..   (changes every hop)
IP:       src 192.168.1.20     dst 93.184.215.14    (end to end)
TCP:      src port 53122       dst port 443
TLS/HTTP: GET / HTTP/1.1  Host: example.com
```

> **Watch out:** Each header costs bytes. Tunnels and VPNs add even more headers, which is why they reduce the space left for data (the MTU problem you will meet in Module 08).

**Build the mental model:** The application produces data, such as an HTTP request. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Website appears down:** Consider how “encapsulation” affects the situation: A user can reach an IP address but cannot open its domain name. DNS, transport, TLS and application layers should be distinguished before anyone blames the web server. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For encapsulation, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain encapsulation to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: Devices by layer

Knowing which layer a device works at tells you what information it can use to make decisions.

- **Hub / repeater (L1)**: copies bits to every port. Obsolete.
- **Switch (L2)**: learns which MAC address is on which port and forwards frames only where needed.
- **Router (L3)**: forwards packets between networks based on IP addresses.
- **Layer 4 firewall / load balancer**: decides based on IP addresses, protocol and ports.
- **Layer 7 proxy / WAF / application load balancer**: reads HTTP itself, so can route by URL path, host name or header and block attacks like SQL injection.

The higher the layer, the more a device can understand, and the more processing it costs.

> **Analogy:** An L3 device reads the address on the envelope. An L7 device opens the envelope and reads the letter.

**Build the mental model:** Hub / repeater (L1): copies bits to every port. Obsolete. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Website appears down:** Consider how “devices by layer” affects the situation: A user can reach an IP address but cannot open its domain name. DNS, transport, TLS and application layers should be distinguished before anyone blames the web server. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For devices by layer, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain devices by layer to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: Troubleshooting with the layers

The layers give you a method. Start at the bottom and work up, or start at the top and work down, but test one layer at a time.

- **L1**: Is the link up? Is the cable plugged in? Is Wi-Fi connected?
- **L2**: Can you reach devices on the same subnet? Is the VLAN correct?
- **L3**: Do you have an IP address? Can you ping the default gateway? Can you ping a remote IP like 1.1.1.1?
- **L4**: Is the port open? Is a firewall or security group blocking it?
- **L7**: Does DNS resolve? Does the application return an error (HTTP 500, certificate error)?

```text
ip addr                  # L3: do I have an address? (Windows: ipconfig)
ping 192.168.1.1         # L3: can I reach my gateway?
ping 1.1.1.1             # L3: can I reach the Internet?
nslookup example.com     # L7: does DNS work?
curl -I https://example.com   # L4/L7: does the service answer?
```

> **Tip:** If `ping 1.1.1.1` works but `ping example.com` fails, the network is fine and DNS is broken. That one test saves a lot of time.

**Build the mental model:** L1: Is the link up? Is the cable plugged in? Is Wi-Fi connected?. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Website appears down:** Consider how “troubleshooting with the layers” affects the situation: A user can reach an IP address but cannot open its domain name. DNS, transport, TLS and application layers should be distinguished before anyone blames the web server. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For troubleshooting with the layers, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain troubleshooting with the layers to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
