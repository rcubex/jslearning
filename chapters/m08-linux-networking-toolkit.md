# Module 09: Linux Networking Toolkit

**Level:** 2 · **Lessons:** 7 · **Questions:** 6

_Troubleshoot any cloud VM from its own shell._

## Lesson 1: Interfaces and routes

On any Linux VM, start with two commands.

`ip addr` (short: `ip a`) lists network interfaces and their addresses. Check that the interface is `UP`, that it has the IP address you expect, and the prefix length.

`ip route` (short: `ip r`) shows the routing table. Check that there is a `default via ...` line and that it points to the subnet's gateway (in most clouds the first usable address, such as 10.0.1.1).

**First look at a VM**

```
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

## Lesson 2: Sockets and ports

`ss` (socket statistics) shows connections and listening ports. The most useful form is `ss -tulpn`: **t**cp, **u**dp, **l**istening, **p**rocess, **n**umeric.

**Is my service actually listening?**

```
$ sudo ss -tulpn
Netid State  Local Address:Port  Process
tcp   LISTEN 127.0.0.1:5432      users:(("postgres",pid=812))
tcp   LISTEN 0.0.0.0:22          users:(("sshd",pid=640))
tcp   LISTEN *:8080              users:(("java",pid=1931))
```

Pay attention to the local address. `127.0.0.1:5432` means PostgreSQL only accepts connections from the VM itself; no firewall rule will make it reachable from other machines until it listens on `0.0.0.0` or the VM's IP. `0.0.0.0` or `*` means all IPv4 interfaces.

`nc` (netcat) tests whether a remote port is reachable without any application: `nc -vz 10.0.2.30 5432`.

> **Tip:** The order that saves hours: is the process running (`systemctl status`), is it listening on the right address (`ss`), is the host firewall open (`iptables`/`nft`/`ufw`), and only then the cloud security rules.

## Lesson 3: HTTP and DNS testing

`curl` is the Swiss army knife for testing web services.

**Useful curl patterns**

```
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

## Lesson 4: Packet capture

When logs and tests disagree, look at the packets. `tcpdump` captures traffic on an interface.

**tcpdump patterns**

```
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

## Lesson 5: MTU and fragmentation

The **MTU** (maximum transmission unit) is the largest packet a link can carry. Standard Ethernet is 1,500 bytes. Some cloud networks support **jumbo frames**: AWS allows 9,001 bytes inside a VPC, a Google Cloud VPC's MTU can be set up to 8,896, and OCI supports 9,000 within a VCN. Azure VMs default to 1,500; check the current Azure documentation before raising it.

Tunnels add headers: IPsec, GRE, VXLAN and VPN connections all reduce the space left for data, so the effective MTU across a VPN might be around 1,400 bytes or less. If a packet is too big and has the "don't fragment" bit set, the router drops it and should send back an ICMP "fragmentation needed" message. If ICMP is blocked, the sender never learns, and you get a **PMTU black hole**: small requests work, large transfers hang.

**Find the working MTU**

```
ping -M do -s 1472 10.20.0.5    # 1472 + 28 bytes of headers = 1500
ping -M do -s 1372 10.20.0.5    # try smaller until it works
ip link show eth0 | grep mtu
```

The usual fix is **MSS clamping** on the VPN or firewall, which tells TCP to use smaller segments, or lowering the interface MTU.

> **Watch out:** Traffic leaving a VPC through an Internet gateway, VPN or peering connection to another region is usually limited to 1,500 bytes or less, even if instances use jumbo frames internally.

## Lesson 6: Host firewalls

Linux has its own firewall in the kernel, managed with **iptables** or its successor **nftables**, or more simply with **ufw** (Ubuntu) and **firewalld** (RHEL family). A host firewall applies in addition to cloud security groups: traffic must pass both.

**Check and manage host firewall rules**

```
sudo ufw status verbose
sudo ufw allow from 10.0.0.0/16 to any port 5432 proto tcp
sudo firewall-cmd --list-all              # firewalld
sudo nft list ruleset                     # nftables
sudo iptables -L -n -v                    # legacy iptables
```

Linux is also the basis of many network functions you will meet: routing (`sysctl net.ipv4.ip_forward=1`), NAT (`nft ... masquerade`), and Kubernetes networking (kube-proxy programs iptables or IPVS rules).

> **Tip:** When a port is open in the cloud security group but still unreachable, check the host firewall next. Both must allow the traffic.

## Lesson 7: Real-world scenario: works with curl, fails in the app

**Situation.** A Java application on a cloud VM can't connect to a partner's HTTPS API: "connection timed out". The engineer runs `curl https://api.partner.example` from the same VM and it works instantly.

**Investigation.**

1. `dig api.partner.example` returns two addresses: an IPv6 AAAA and an IPv4 A record.
2. `curl -v` shows curl tried IPv6 first, failed quickly, and fell back to IPv4 (the "happy eyeballs" behaviour).
3. The Java runtime was configured to prefer IPv6 and waited the full timeout on the IPv6 address before giving up. The VM had an IPv6 address but the subnet's route table had no IPv6 default route.
4. `tcpdump -i eth0 -nn ip6` confirmed SYN packets to the IPv6 address with no replies.

**Fix.** Either add the IPv6 route (via the Internet gateway or egress-only gateway) and security rules, or remove IPv6 from the VM's interface until IPv6 is properly supported. The team added the egress-only gateway route; both curl and Java worked.

**Lessons learned.** Tools behave differently: curl's fallback hid a broken path. tcpdump shows what really happens on the wire. Half-configured IPv6 is a common cause of mysterious timeouts.

## Key takeaways

- ip addr and ip route are the first two commands on any broken VM.
- ss -tulpn proves a service is listening before you blame the network.
- curl, dig and nc test the application, DNS and raw ports separately.
- tcpdump shows the truth; MTU problems make large transfers hang.

## Checkpoint

**Q1. Which command shows which process listens on a port?**

A. ip route
B. ss -tulpn  ✓
C. dig
D. traceroute

_ss lists sockets; -p shows the owning process._

**Q2. Large transfers hang over a VPN but small requests work. First suspect?**

A. DNS
B. MTU  ✓
C. ARP
D. TTL

_Tunnel overhead shrinks the usable packet size; oversized packets get dropped._

**Q3. ss shows PostgreSQL listening on 127.0.0.1:5432. Other VMs can't connect. Why?**

A. The security group is wrong
B. PostgreSQL only accepts local connections on the loopback address  ✓
C. DNS is broken
D. The VM has no route

_A service bound to 127.0.0.1 can't be reached from outside the VM, whatever the firewall says._

**Q4. tcpdump on the client shows SYN sent and no reply ever arrives. What is most likely?**

A. Nothing is listening on the port
B. The certificate expired
C. A firewall, security rule or route on the path is dropping the traffic  ✓
D. The application crashed after connecting

_No reply at all means the packet is being dropped. "Nothing listening" would produce an RST._

**Q5. Which curl option lets you test a specific server for a host name without changing DNS?**

A. -I
B. -k
C. --resolve  ✓
D. -o

_--resolve host:port:ip forces curl to use that IP for the name._

**Q6. curl works but the application times out to the same host. What does tcpdump reveal in the scenario?**

A. DNS failures
B. SYNs sent over IPv6 with no replies, because IPv6 routing was missing  ✓
C. Certificate errors
D. MTU problems

_The application preferred IPv6, which had no working route._

## Official reading

- [tcpdump manual](https://www.tcpdump.org/manpages/tcpdump.1.html)
- [iproute2 ip(8) manual](https://man7.org/linux/man-pages/man8/ip.8.html)
- [curl documentation](https://curl.se/docs/)
