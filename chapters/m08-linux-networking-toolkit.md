# Module 08: Linux Networking Toolkit

**Level:** 2 · **Lessons:** 6

## A real-world thread: API is intermittently unreachable

An internal API sometimes times out. Name resolution, socket state, routes, MTU, host firewall and packet timing provide different clues; no single command proves the root cause.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: Interfaces and routes

On any Linux VM, start with two commands.

`ip addr` (short: `ip a`) lists network interfaces and their addresses. Check that the interface is `UP`, that it has the IP address you expect, and the prefix length.

`ip route` (short: `ip r`) shows the routing table. Check that there is a `default via ...` line and that it points to the subnet's gateway (in most clouds the first usable address, such as 10.0.1.1).

```text
$ ip -br a
lo      UNKNOWN 127.0.0.1/8
eth0    UP      10.0.1.25/24
$ ip r
default via 10.0.1.1 dev eth0
10.0.1.0/24 dev eth0 proto kernel scope link src 10.0.1.25
$ ip route get 8.8.8.8      # which route would be used for this destination?
8.8.8.8 via 10.0.1.1 dev eth0 src 10.0.1.25
$ cat /etc/resolv.conf      # which DNS server is configured?
```

> **In the cloud:** Don't change IP settings by hand on cloud VMs. Addresses come from the provider's DHCP; a manually set wrong address can cut you off completely. Change them in the console or with IaC instead.

**Build the mental model:** On any Linux VM, start with two commands. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — API is intermittently unreachable:** Consider how “interfaces and routes” affects the situation: An internal API sometimes times out. Name resolution, socket state, routes, MTU, host firewall and packet timing provide different clues; no single command proves the root cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For interfaces and routes, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain interfaces and routes to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: Sockets and ports

`ss` (socket statistics) shows connections and listening ports. The most useful form is `ss -tulpn`: **t**cp, **u**dp, **l**istening, **p**rocess, **n**umeric.

```text
$ sudo ss -tulpn
Netid State  Local Address:Port  Process
tcp   LISTEN 127.0.0.1:5432      users:(("postgres",pid=812))
tcp   LISTEN 0.0.0.0:22          users:(("sshd",pid=640))
tcp   LISTEN *:8080              users:(("java",pid=1931))
```

Pay attention to the local address. `127.0.0.1:5432` means PostgreSQL only accepts connections from the VM itself; no firewall rule will make it reachable from other machines until it listens on `0.0.0.0` or the VM's IP. `0.0.0.0` or `*` means all IPv4 interfaces.

`nc` (netcat) tests whether a remote port is reachable without any application: `nc -vz 10.0.2.30 5432`.

> **Tip:** The order that saves hours: is the process running (`systemctl status`), is it listening on the right address (`ss`), is the host firewall open (`iptables`/`nft`/`ufw`), and only then the cloud security rules.

**Build the mental model:** `ss` (socket statistics) shows connections and listening ports. The most useful form is `ss -tulpn`: **t**cp, **u**dp, **l**istening, **p**rocess, **n**umeric. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — API is intermittently unreachable:** Consider how “sockets and ports” affects the situation: An internal API sometimes times out. Name resolution, socket state, routes, MTU, host firewall and packet timing provide different clues; no single command proves the root cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For sockets and ports, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain sockets and ports to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: HTTP and DNS testing

`curl` is the Swiss army knife for testing web services.

```text
curl -I https://app.example.com                 # headers only
curl -v https://app.example.com                 # full detail: DNS, TLS, headers
curl -s -o /dev/null -w '%{http_code} %{time_total}s\n' https://app.example.com
curl --resolve app.example.com:443:10.0.1.50 https://app.example.com
     # test a specific server without changing DNS
curl -k https://10.0.1.50                       # ignore certificate errors (testing only)
```

`dig` tests DNS: `dig app.example.com +short`, `dig @10.0.0.2 app.internal` (ask a specific resolver), `dig -x 10.0.1.25` (reverse lookup).

`traceroute` and `mtr` show the path. `mtr` combines ping and traceroute, and runs continuously to reveal which hop introduces loss or delay: `mtr -rwc 50 example.com`.

> **Watch out:** Many clouds and firewalls block or deprioritise ICMP and traceroute probes. Missing hops are normal; consistent loss that continues all the way to the destination is what matters.

**Build the mental model:** `curl` is the Swiss army knife for testing web services. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — API is intermittently unreachable:** Consider how “http and dns testing” affects the situation: An internal API sometimes times out. Name resolution, socket state, routes, MTU, host firewall and packet timing provide different clues; no single command proves the root cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For http and dns testing, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain http and dns testing to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: Packet capture

When logs and tests disagree, look at the packets. `tcpdump` captures traffic on an interface.

```text
sudo tcpdump -i eth0 -nn port 443                 # all HTTPS traffic
sudo tcpdump -i eth0 -nn host 10.0.2.30           # traffic to/from one host
sudo tcpdump -i eth0 -nn 'tcp[tcpflags] & tcp-syn != 0'   # only SYNs
sudo tcpdump -i eth0 -nn -w /tmp/cap.pcap port 5432       # save for Wireshark
```

How to read the result:

- You see SYN going out and nothing coming back → something on the path is dropping it (security rule, NACL, route, or the far host is down)
- You see SYN and an immediate RST back → the host is reachable but nothing listens on that port
- You see the handshake complete, then a stall on large packets → suspect MTU

> **Tip:** Capture on both ends at the same time. If the packet leaves A but never reaches B, the problem is in between, which narrows it down to routes and cloud firewalls.

**Build the mental model:** You see SYN going out and nothing coming back → something on the path is dropping it (security rule, NACL, route, or the far host is down). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — API is intermittently unreachable:** Consider how “packet capture” affects the situation: An internal API sometimes times out. Name resolution, socket state, routes, MTU, host firewall and packet timing provide different clues; no single command proves the root cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For packet capture, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain packet capture to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: MTU and fragmentation

The **MTU** (maximum transmission unit) is the largest packet a link can carry. Standard Ethernet is 1,500 bytes. Some cloud networks support **jumbo frames**: AWS allows 9,001 bytes inside a VPC, a Google Cloud VPC's MTU can be set up to 8,896, and OCI supports 9,000 within a VCN. Azure VMs default to 1,500; check the current Azure documentation before raising it.

Tunnels add headers: IPsec, GRE, VXLAN and VPN connections all reduce the space left for data, so the effective MTU across a VPN might be around 1,400 bytes or less. If a packet is too big and has the "don't fragment" bit set, the router drops it and should send back an ICMP "fragmentation needed" message. If ICMP is blocked, the sender never learns, and you get a **PMTU black hole**: small requests work, large transfers hang.

```text
ping -M do -s 1472 10.20.0.5    # 1472 + 28 bytes of headers = 1500
ping -M do -s 1372 10.20.0.5    # try smaller until it works
ip link show eth0 | grep mtu
```

The usual fix is **MSS clamping** on the VPN or firewall, which tells TCP to use smaller segments, or lowering the interface MTU.

> **Watch out:** Traffic leaving a VPC through an Internet gateway, VPN or peering connection to another region is usually limited to 1,500 bytes or less, even if instances use jumbo frames internally.

**Build the mental model:** The **MTU** (maximum transmission unit) is the largest packet a link can carry. Standard Ethernet is 1,500 bytes. Some cloud networks support **jumbo frames**: AWS allows 9,001 bytes inside a VPC, a Google Cloud VPC's MT. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — API is intermittently unreachable:** Consider how “mtu and fragmentation” affects the situation: An internal API sometimes times out. Name resolution, socket state, routes, MTU, host firewall and packet timing provide different clues; no single command proves the root cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For mtu and fragmentation, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain mtu and fragmentation to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: Host firewalls

Linux has its own firewall in the kernel, managed with **iptables** or its successor **nftables**, or more simply with **ufw** (Ubuntu) and **firewalld** (RHEL family). A host firewall applies in addition to cloud security groups: traffic must pass both.

```text
sudo ufw status verbose
sudo ufw allow from 10.0.0.0/16 to any port 5432 proto tcp
sudo firewall-cmd --list-all              # firewalld
sudo nft list ruleset                     # nftables
sudo iptables -L -n -v                    # legacy iptables
```

Linux is also the basis of many network functions you will meet: routing (`sysctl net.ipv4.ip_forward=1`), NAT (`nft ... masquerade`), and Kubernetes networking (kube-proxy programs iptables or IPVS rules).

> **Tip:** When a port is open in the cloud security group but still unreachable, check the host firewall next. Both must allow the traffic.

**Build the mental model:** Linux has its own firewall in the kernel, managed with **iptables** or its successor **nftables**, or more simply with **ufw** (Ubuntu) and **firewalld** (RHEL family). A host firewall applies in addition to cloud securi. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — API is intermittently unreachable:** Consider how “host firewalls” affects the situation: An internal API sometimes times out. Name resolution, socket state, routes, MTU, host firewall and packet timing provide different clues; no single command proves the root cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For host firewalls, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain host firewalls to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
