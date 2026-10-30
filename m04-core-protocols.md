# Module 04: Core Protocols

**Level:** 1 · **Lessons:** 7 · **Questions:** 7

_Know the protocols every cloud firewall rule and DNS record depends on._

## Lesson 1: TCP vs UDP

Both TCP and UDP deliver data to the right application on a host, identified by a **port** number. They make opposite trade-offs.

**TCP** (Transmission Control Protocol) is connection-oriented and reliable. Before sending data, the two sides perform the **three-way handshake**: the client sends SYN, the server answers SYN-ACK, the client replies ACK. TCP then numbers every byte, acknowledges what arrives, re-sends what is lost, delivers data in order and slows down when the network is congested. Web traffic, SSH, databases and file transfers use TCP. A connection ends with FIN packets, or abruptly with RST.

**UDP** (User Datagram Protocol) just sends datagrams with no setup, no acknowledgements and no ordering. It is lighter and faster, and suits traffic where a late packet is useless anyway: DNS lookups, voice and video, online games, and **QUIC**, the transport under HTTP/3, which builds its own reliability on top of UDP.

**See the handshake**

```
sudo tcpdump -i any -nn 'tcp port 443 and tcp[tcpflags] & (tcp-syn) != 0'
# then open any https site; you'll see [S] and [S.] (SYN, SYN-ACK)
```

- TCP: handshake, reliable, ordered, congestion control
- UDP: no handshake, best effort, low overhead
- A connection timeout usually means the SYN got no answer (blocked or nothing listening)

> **Tip:** "Connection refused" means the host answered with RST, so the network path is fine but nothing listens on that port. "Connection timed out" means no answer at all, which usually points to a firewall or routing problem.

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

## Lesson 3: DNS

The **Domain Name System** turns names like `www.example.com` into IP addresses. It is a distributed, hierarchical database.

When your laptop asks for a name, it queries a **recursive resolver** (from your ISP, company, or a public one like 1.1.1.1). If the answer is not cached, the resolver asks a **root server**, which points to the **.com TLD servers**, which point to the domain's **authoritative servers**, which return the answer. The resolver caches it for the record's **TTL** (time to live, in seconds).

Record types you will use constantly:

- **A**: name → IPv4 address. **AAAA**: name → IPv6 address
- **CNAME**: name → another name (an alias). Cannot be used at the zone apex (example.com itself)
- **MX**: mail servers. **TXT**: free text, used for domain verification and email security (SPF, DKIM)
- **NS**: which servers are authoritative for a zone. **SOA**: zone administration data
- **Alias records** (AWS Route 53 alias, Azure alias records): cloud-specific records that point the apex to a load balancer or CDN

**Explore DNS**

```
dig example.com A +short
dig example.com MX
dig +trace example.com        # follow root → TLD → authoritative
nslookup example.com 1.1.1.1  # Windows-friendly
```

> **Tip:** Before changing a DNS record (for a migration, for example), lower its TTL to 60–300 seconds a day in advance. Then the change takes effect quickly and can be rolled back quickly.

## Lesson 4: DHCP and ARP

**DHCP** (Dynamic Host Configuration Protocol) gives a device its network settings automatically: IP address, subnet mask, default gateway, DNS servers and lease time. It works in four steps, remembered as **DORA**: the client broadcasts **Discover**, servers reply with an **Offer**, the client sends a **Request** for one offer, and the server confirms with an **Acknowledge**. DHCP uses UDP ports 67 (server) and 68 (client).

**ARP** (Address Resolution Protocol) answers the question "which MAC address has this IP address?" on the local network. To send to its default gateway at 192.168.1.1, a laptop broadcasts "who has 192.168.1.1?" and the router replies with its MAC address. The answer is cached in the ARP table.

In the cloud, both are handled for you. Every VM gets its address from the provider's DHCP service, and the virtual network answers ARP requests itself. That is why many classic Layer 2 tricks (such as gratuitous ARP for failover, or broadcast and multicast) do not work in the cloud.

**Look at your own settings**

```
ip addr && ip route        # Linux
ip neigh                   # Linux ARP table
ipconfig /all              # Windows
arp -a                     # Windows / macOS
```

> **Watch out:** A device showing a 169.254.x.x address failed to get a DHCP lease. Check the DHCP server, the cable or Wi-Fi, and the VLAN.

## Lesson 5: ICMP, HTTP and TLS

**ICMP** (Internet Control Message Protocol) carries network control messages. `ping` uses ICMP Echo Request and Echo Reply. `traceroute` relies on ICMP "Time Exceeded" messages. ICMP also carries "Destination Unreachable" and "Fragmentation Needed" messages; blocking all ICMP can break path MTU discovery.

**HTTP** is the language of the web and of almost every API. A request has a method (GET, POST, PUT, DELETE), a path, headers and an optional body. The response has a **status code**: 2xx success (200 OK), 3xx redirect (301, 302), 4xx client error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found), 5xx server error (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout).

**TLS** (Transport Layer Security) encrypts traffic and proves the server's identity using a **certificate** signed by a trusted certificate authority. HTTPS is HTTP inside TLS, on port 443. TLS 1.2 and 1.3 are current; older versions should be disabled.

**Inspect a real HTTPS conversation**

```
curl -v https://example.com 2>&1 | head -40
# Look for: TLS version, certificate subject and issuer, "HTTP/2 200"
openssl s_client -connect example.com:443 -servername example.com </dev/null | head -20
```

> **In the cloud:** A 502 or 504 from a cloud load balancer almost always means the load balancer could not reach a healthy backend: check the health check, the backend's security group and whether the app is listening.

## Lesson 6: Deep dive: HTTP/2, HTTP/3 and QUIC

HTTP has evolved to cut latency, and cloud load balancers and CDNs support all current versions.

**HTTP/1.1** sends one request at a time per connection. Browsers open about six connections per site to work around this, and a slow response blocks those behind it (**head-of-line blocking**).

**HTTP/2** (over TLS, negotiated via ALPN `h2`) **multiplexes** many requests as independent streams over one TCP connection, with header compression (HPACK). Far fewer connections and handshakes. But it still runs over TCP: one lost packet stalls *all* streams until it's retransmitted, which hurts on lossy mobile networks.

**HTTP/3** runs over **QUIC**, a transport built on UDP (port 443):

- Streams are independent at the transport level, so a lost packet only stalls its own stream.
- The transport and TLS 1.3 handshakes are combined: a new connection takes 1 RTT, and resumed connections can send data immediately (0-RTT).
- **Connection migration**: a phone moving from Wi-Fi to mobile data keeps its connection, because QUIC identifies connections by ID, not by IP and port.

**gRPC** uses HTTP/2 for fast service-to-service APIs with streaming; L7 load balancers that understand HTTP/2 can balance individual gRPC calls rather than whole connections.

**See which protocol a site uses**

```
curl -sI --http2 https://example.com | head -1
curl -sI --http3 https://example.com | head -1    # needs a curl build with HTTP/3 support
```

> **In the cloud:** CloudFront, Azure Front Door, Google Cloud's external Application Load Balancer and others can serve HTTP/3 to clients while talking HTTP/1.1 or HTTP/2 to your backends. Make sure firewalls allow UDP 443 outbound from clients, or browsers silently fall back to HTTP/2.

## Lesson 7: Real-world scenario: the DNS change that took a day

**Situation.** A company moves its website to a new load balancer. At 09:00 they update the A record for `www.example.com`. By 17:00, about a third of customers still reach the old server, which is now switched off.

**Investigation.** `dig www.example.com` against the authoritative servers shows the new address. Asking several public resolvers shows some still return the old one. The old record had a **TTL of 86,400 seconds (24 hours)**, so resolvers that cached it just before the change keep serving the old address until the next morning. Some corporate networks and devices also cache longer.

**Fix.** They turn the old server back on, behind the new load balancer's target group, until the TTL fully expires. For the next migration they follow a runbook:

1. Two days before: lower the TTL to 300 seconds.
2. Wait at least the old TTL (24 hours) so all caches pick up the short TTL.
3. Change the record; traffic moves within minutes.
4. Keep the old endpoint running for a while anyway.
5. Raise the TTL again after the migration is stable.

**Lessons learned.** DNS changes are only as fast as the TTL that was cached *before* the change. Plan TTLs ahead of migrations.

## Key takeaways

- TCP is reliable and ordered; UDP is fast and connectionless.
- Firewall rules are written as protocol + port + source; know the common ports.
- DNS turns names into addresses; TTL decides how long answers are cached.
- HTTPS = HTTP over TLS; certificates prove the server's identity.

## Checkpoint

**Q1. Which protocol and port does DNS mainly use?**

A. TCP 80
B. UDP 53  ✓
C. UDP 123
D. TCP 22

_DNS queries use UDP 53, falling back to TCP 53 for large responses._

**Q2. A laptop joins Wi-Fi and needs an IP address. Which protocol provides it?**

A. ARP
B. DNS
C. DHCP  ✓
D. ICMP

_DHCP assigns the address, mask, gateway and DNS servers._

**Q3. You get "connection refused" when connecting to a server on port 8080. What does that tell you?**

A. A firewall silently dropped the packet
B. The host is reachable but nothing is listening on 8080  ✓
C. DNS failed
D. The route is missing

_A refusal is an active RST from the host. A silent drop would show as a timeout._

**Q4. Which DNS record type cannot be used at the zone apex (example.com itself)?**

A. A
B. MX
C. CNAME  ✓
D. TXT

_CNAMEs cannot coexist with the SOA and NS records at the apex; use A/AAAA or a cloud alias record._

**Q5. A cloud load balancer returns HTTP 502. What is the most likely cause?**

A. The user's browser is out of date
B. DNS points to the wrong IP
C. The load balancer could not get a valid response from a backend  ✓
D. The TLS certificate expired

_502 Bad Gateway means the proxy reached out to a backend and failed: check health checks, ports and security rules._

**Q6. Why can HTTP/3 perform better than HTTP/2 on a lossy mobile network?**

A. It uses bigger packets
B. QUIC streams are independent, so one lost packet doesn't stall all requests  ✓
C. It disables encryption
D. It uses TCP port 80

_HTTP/2 over TCP suffers head-of-line blocking; QUIC avoids it per stream._

**Q7. You must move a website whose DNS record has a 24-hour TTL. What should you do first?**

A. Change the record immediately
B. Lower the TTL and wait at least 24 hours before changing the record  ✓
C. Delete the record, then recreate it
D. Switch DNS providers

_Caches hold the old TTL; lowering it in advance makes the cut-over fast._

## Official reading

- [Cloudflare Learning: what is DNS](https://www.cloudflare.com/learning/dns/what-is-dns/)
- [Cloudflare Learning: what is TLS](https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/)
- [MDN: an overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
