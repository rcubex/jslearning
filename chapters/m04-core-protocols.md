# Module 04: Core Protocols

**Level:** 1 · **Lessons:** 5

## A real-world thread: Banking app connection

A customer opens a banking application. DNS locates the endpoint, TLS protects the session, TCP or QUIC transports messages and application requests access account information.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: TCP vs UDP

Both TCP and UDP deliver data to the right application on a host, identified by a **port** number. They make opposite trade-offs.

**TCP** (Transmission Control Protocol) is connection-oriented and reliable. Before sending data, the two sides perform the **three-way handshake**: the client sends SYN, the server answers SYN-ACK, the client replies ACK. TCP then numbers every byte, acknowledges what arrives, re-sends what is lost, delivers data in order and slows down when the network is congested. Web traffic, SSH, databases and file transfers use TCP. A connection ends with FIN packets, or abruptly with RST.

**UDP** (User Datagram Protocol) just sends datagrams with no setup, no acknowledgements and no ordering. It is lighter and faster, and suits traffic where a late packet is useless anyway: DNS lookups, voice and video, online games, and **QUIC**, the transport under HTTP/3, which builds its own reliability on top of UDP.

```text
sudo tcpdump -i any -nn 'tcp port 443 and tcp[tcpflags] & (tcp-syn) != 0'
# then open any https site; you'll see [S] and [S.] (SYN, SYN-ACK)
```

- TCP: handshake, reliable, ordered, congestion control
- UDP: no handshake, best effort, low overhead
- A connection timeout usually means the SYN got no answer (blocked or nothing listening)

> **Tip:** "Connection refused" means the host answered with RST, so the network path is fine but nothing listens on that port. "Connection timed out" means no answer at all, which usually points to a firewall or routing problem.

**Build the mental model:** TCP: handshake, reliable, ordered, congestion control. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Banking app connection:** Consider how “tcp vs udp” affects the situation: A customer opens a banking application. DNS locates the endpoint, TLS protects the session, TCP or QUIC transports messages and application requests access account information. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For tcp vs udp, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain tcp vs udp to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: Ports

A **port** is a 16-bit number (0–65535) that identifies a service on a host. Servers listen on well-known ports; clients use a random high **ephemeral port** (typically 32768–60999 on Linux, 49152–65535 on Windows) for each connection.

Ports you must know:

- 20/21 FTP, **22 SSH**, 23 Telnet, 25 SMTP, **53 DNS**, 67/68 DHCP
- **80 HTTP**, 123 NTP, 143 IMAP, 161 SNMP, 179 BGP
- **443 HTTPS**, 500/4500 IPsec VPN (IKE, NAT traversal)
- 1433 SQL Server, 1521 Oracle Database, 3306 MySQL, 5432 PostgreSQL, 6379 Redis
- **3389 RDP**, 6443 Kubernetes API

A connection is identified by its **5-tuple**: protocol, source IP, source port, destination IP, destination port. Firewalls and NAT devices track connections by this 5-tuple.

> **In the cloud:** Every security group, NSG and firewall rule is a 5-tuple filter: "allow TCP 443 from 0.0.0.0/0" or "allow TCP 5432 from the app subnet". Opening 22 or 3389 to 0.0.0.0/0 is one of the most common causes of cloud breaches.

**Build the mental model:** 20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 67/68 DHCP. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Banking app connection:** Consider how “ports” affects the situation: A customer opens a banking application. DNS locates the endpoint, TLS protects the session, TCP or QUIC transports messages and application requests access account information. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For ports, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain ports to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: DNS

The **Domain Name System** turns names like `www.example.com` into IP addresses. It is a distributed, hierarchical database.

When your laptop asks for a name, it queries a **recursive resolver** (from your ISP, company, or a public one like 1.1.1.1). If the answer is not cached, the resolver asks a **root server**, which points to the **.com TLD servers**, which point to the domain's **authoritative servers**, which return the answer. The resolver caches it for the record's **TTL** (time to live, in seconds).

Record types you will use constantly:

- **A**: name → IPv4 address. **AAAA**: name → IPv6 address
- **CNAME**: name → another name (an alias). Cannot be used at the zone apex (example.com itself)
- **MX**: mail servers. **TXT**: free text, used for domain verification and email security (SPF, DKIM)
- **NS**: which servers are authoritative for a zone. **SOA**: zone administration data
- **Alias records** (AWS Route 53 alias, Azure alias records): cloud-specific records that point the apex to a load balancer or CDN

```text
dig example.com A +short
dig example.com MX
dig +trace example.com        # follow root → TLD → authoritative
nslookup example.com 1.1.1.1  # Windows-friendly
```

> **Tip:** Before changing a DNS record (for a migration, for example), lower its TTL to 60–300 seconds a day in advance. Then the change takes effect quickly and can be rolled back quickly.

**Build the mental model:** A: name → IPv4 address. AAAA: name → IPv6 address. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Banking app connection:** Consider how “dns” affects the situation: A customer opens a banking application. DNS locates the endpoint, TLS protects the session, TCP or QUIC transports messages and application requests access account information. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For dns, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain dns to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: DHCP and ARP

**DHCP** (Dynamic Host Configuration Protocol) gives a device its network settings automatically: IP address, subnet mask, default gateway, DNS servers and lease time. It works in four steps, remembered as **DORA**: the client broadcasts **Discover**, servers reply with an **Offer**, the client sends a **Request** for one offer, and the server confirms with an **Acknowledge**. DHCP uses UDP ports 67 (server) and 68 (client).

**ARP** (Address Resolution Protocol) answers the question "which MAC address has this IP address?" on the local network. To send to its default gateway at 192.168.1.1, a laptop broadcasts "who has 192.168.1.1?" and the router replies with its MAC address. The answer is cached in the ARP table.

In the cloud, both are handled for you. Every VM gets its address from the provider's DHCP service, and the virtual network answers ARP requests itself. That is why many classic Layer 2 tricks (such as gratuitous ARP for failover, or broadcast and multicast) do not work in the cloud.

```text
ip addr && ip route        # Linux
ip neigh                   # Linux ARP table
ipconfig /all              # Windows
arp -a                     # Windows / macOS
```

> **Watch out:** A device showing a 169.254.x.x address failed to get a DHCP lease. Check the DHCP server, the cable or Wi-Fi, and the VLAN.

**Build the mental model:** **DHCP** (Dynamic Host Configuration Protocol) gives a device its network settings automatically: IP address, subnet mask, default gateway, DNS servers and lease time. It works in four steps, remembered as **DORA**: the. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Banking app connection:** Consider how “dhcp and arp” affects the situation: A customer opens a banking application. DNS locates the endpoint, TLS protects the session, TCP or QUIC transports messages and application requests access account information. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For dhcp and arp, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain dhcp and arp to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: ICMP, HTTP and TLS

**ICMP** (Internet Control Message Protocol) carries network control messages. `ping` uses ICMP Echo Request and Echo Reply. `traceroute` relies on ICMP "Time Exceeded" messages. ICMP also carries "Destination Unreachable" and "Fragmentation Needed" messages; blocking all ICMP can break path MTU discovery.

**HTTP** is the language of the web and of almost every API. A request has a method (GET, POST, PUT, DELETE), a path, headers and an optional body. The response has a **status code**: 2xx success (200 OK), 3xx redirect (301, 302), 4xx client error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found), 5xx server error (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout).

**TLS** (Transport Layer Security) encrypts traffic and proves the server's identity using a **certificate** signed by a trusted certificate authority. HTTPS is HTTP inside TLS, on port 443. TLS 1.2 and 1.3 are current; older versions should be disabled.

```text
curl -v https://example.com 2>&1 | head -40
# Look for: TLS version, certificate subject and issuer, "HTTP/2 200"
openssl s_client -connect example.com:443 -servername example.com </dev/null | head -20
```

> **In the cloud:** A 502 or 504 from a cloud load balancer almost always means the load balancer could not reach a healthy backend: check the health check, the backend's security group and whether the app is listening.

**Build the mental model:** **ICMP** (Internet Control Message Protocol) carries network control messages. `ping` uses ICMP Echo Request and Echo Reply. `traceroute` relies on ICMP "Time Exceeded" messages. ICMP also carries "Destination Unreachabl. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Banking app connection:** Consider how “icmp, http and tls” affects the situation: A customer opens a banking application. DNS locates the endpoint, TLS protects the session, TCP or QUIC transports messages and application requests access account information. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For icmp, http and tls, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain icmp, http and tls to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
