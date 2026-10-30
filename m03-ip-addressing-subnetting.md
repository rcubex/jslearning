# Module 03: IP Addressing & Subnetting

**Level:** 1 · **Lessons:** 8 · **Questions:** 7

_Read, size and split any IPv4 block, and plan addresses for cloud networks._

## Lesson 1: IPv4 address structure

An IPv4 address is a 32-bit number, written as four **octets** (8-bit numbers from 0 to 255) separated by dots: `192.168.10.25`. Computers see it in binary:

**192.168.10.25 in binary**

```
192      .168      .10       .25
11000000 .10101000 .00001010 .00011001
```

Every address has two parts. The **network part** identifies which network (subnet) the address belongs to; the **host part** identifies one device on that network. Devices with the same network part can talk directly; anything else has to go through a router.

The split between the two parts is set by the **subnet mask** or, more commonly today, the **prefix length**. With a /24 prefix, the first 24 bits (three octets) are the network and the last 8 bits are the host. So `192.168.10.25/24` is host 25 on network `192.168.10.0`.

- 32 bits, four octets, each 0–255
- Network part + host part; the prefix length marks the split
- Same network part → direct delivery; different → via a router

> **Tip:** Learn the powers of two up to 256 by heart: 1, 2, 4, 8, 16, 32, 64, 128, 256. Subnetting is just these numbers.

## Lesson 2: CIDR notation and the maths

**CIDR** (Classless Inter-Domain Routing) writes a network as `address/prefix`, such as `10.0.0.0/16`. The number of addresses is 2^(32 − prefix):

**Common prefix sizes**

```
/16 = 65,536 addresses    mask 255.255.0.0
/20 =  4,096              mask 255.255.240.0
/22 =  1,024              mask 255.255.252.0
/24 =    256              mask 255.255.255.0
/26 =     64              mask 255.255.255.192
/27 =     32              mask 255.255.255.224
/28 =     16              mask 255.255.255.240
/32 =      1 (a single host)
```

In a traditional network, the first address is the **network address** and the last is the **broadcast address**, so a /24 has 254 usable hosts. Blocks always start on a multiple of their size: a /26 can start at .0, .64, .128 or .192, never at .50.

**Worked example.** Which network does `10.1.37.200/20` belong to? A /20 is 4,096 addresses, which is 16 values in the third octet (4,096 ÷ 256). Multiples of 16 in the third octet: 0, 16, 32, 48. 37 falls in the block starting at 32. So the network is `10.1.32.0/20`, running to `10.1.47.255`.

- Size = 2^(32 − prefix)
- A smaller prefix number means a bigger network
- Blocks are aligned to their own size

> **Tip:** Use the Subnet Calculator tab to check your answers. Do a few by hand first; interviews and exams expect you to.

## Lesson 3: Private ranges (RFC 1918)

Three ranges are reserved for private use and are never routed on the public Internet:

- `10.0.0.0/8` (16.7 million addresses)
- `172.16.0.0/12` (172.16.0.0 to 172.31.255.255, about 1 million)
- `192.168.0.0/16` (65,536)

Every virtual network you build in AWS, Azure, Google Cloud or OCI should use one of these. Devices with private addresses reach the Internet through **NAT**, which swaps the private source address for a public one.

Other special ranges you will see: `127.0.0.0/8` is loopback (the machine itself), `169.254.0.0/16` is link-local (a device that failed to get a DHCP address gives itself one of these; clouds also use 169.254.169.254 for the instance metadata service), and `100.64.0.0/10` is shared space used by carriers for large-scale NAT.

> **Watch out:** Many home routers use 192.168.0.0/24 or 192.168.1.0/24, and many companies use 10.0.0.0/16. If your cloud network uses the same range as an office or a VPN user's home, those users cannot reach it. Pick less common blocks such as 10.40.0.0/16.

## Lesson 4: Cloud address reservations

Clouds keep some addresses in every subnet for their own services (the router, DNS, future use). That means fewer usable addresses than the classic "size minus two".

- **AWS**: 5 per subnet (network address, VPC router, DNS, reserved for future use, last address). A /24 gives 251 usable. Subnets can be /16 to /28.
- **Azure**: 5 per subnet (network address, default gateway, two for Azure DNS, last address). A /24 gives 251. The smallest subnet is /29.
- **Google Cloud**: 4 per subnet (network, gateway, second-to-last and last). A /24 gives 252. The smallest IPv4 subnet is /29.
- **OCI**: 3 per subnet (network address, default gateway, last address). A /24 gives 253.

Some managed services need large dedicated subnets: Kubernetes pods, Azure Firewall (/26), Azure Bastion (/26), gateway subnets and database services. Under-sizing a subnet is a common and painful mistake, because most clouds do not let you resize a subnet that is in use.

> **Tip:** For production, give each subnet at least a /24 unless you have a reason not to, and keep spare space in the VPC/VNet for subnets you will need later.

## Lesson 5: IPv6 essentials

IPv4 has only about 4.3 billion addresses, which ran out years ago. **IPv6** uses 128-bit addresses written as eight groups of four hex digits, for example `2001:0db8:0000:0000:0000:0000:0000:0001`, shortened to `2001:db8::1` by dropping leading zeros and replacing one run of zero groups with `::`.

The standard subnet size in IPv6 is a **/64**, which holds 18 quintillion addresses. Addresses are so plentiful that NAT is not needed: every device can have a globally unique address, and firewalls (not NAT) provide protection.

All four clouds support **dual-stack** networks, where resources have both an IPv4 and an IPv6 address. AWS, for example, assigns a /56 to a VPC and /64s to subnets, and offers an egress-only Internet gateway so IPv6 instances can reach out without being reachable from outside.

- 128 bits, hex, `::` shortens zeros
- /64 per subnet is the norm
- Dual-stack = IPv4 and IPv6 side by side

> **Watch out:** An IPv6 address is often directly reachable from the Internet. Security groups and firewall rules must cover IPv6 (`::/0`) as well as IPv4 (`0.0.0.0/0`).

## Lesson 6: Planning a cloud address space

Good address planning is one of the most valuable skills in cloud networking, because mistakes are expensive to undo. A simple, scalable approach:

1. Reserve a large block for all cloud use, for example `10.64.0.0/10`, that does not overlap with any office or data-centre range.
2. Give each region or environment its own large block, for example a /16 each for prod, staging and dev.
3. Inside each VPC/VNet, create subnets per tier (public, app, data) and per availability zone.

**Example plan for one production VPC: 10.64.0.0/16**

```
10.64.0.0/24    public-a      (load balancers, NAT)
10.64.1.0/24    public-b
10.64.2.0/24    public-c
10.64.10.0/23   app-a         (application servers)
10.64.12.0/23   app-b
10.64.14.0/23   app-c
10.64.20.0/24   data-a        (databases)
10.64.21.0/24   data-b
10.64.22.0/24   data-c
10.64.128.0/17  reserved for future use and Kubernetes pods
```

Write the plan down and keep it in version control. Every new network should get its range from this plan, never by guessing.

> **Tip:** Leave gaps. If you use 10.64.0.0/16 for prod, skip ahead to 10.66.0.0/16 for the next one, so each can grow into a /15 later if needed.

## Lesson 7: Deep dive: VLSM and route summarisation

**VLSM** (variable-length subnet masking) means using different subnet sizes within one block, matched to actual needs, instead of carving everything into identical subnets.

**Worked example.** You have `10.50.0.0/22` (1,024 addresses) and need: an app subnet for 300 hosts, a database subnet for 100, a management subnet for 50, and four point-to-point links. Always allocate the **largest first**, aligned to its size:

**VLSM allocation from 10.50.0.0/22**

```
App (300 hosts)  → /23 (512)   10.50.0.0/23     10.50.0.0  – 10.50.1.255
DB  (100 hosts)  → /25 (128)   10.50.2.0/25     10.50.2.0  – 10.50.2.127
Mgmt (50 hosts)  → /26 (64)    10.50.2.128/26   10.50.2.128 – 10.50.2.191
Links (2 each)   → /30 (4)     10.50.2.192/30, .196/30, .200/30, .204/30
Free for growth:               10.50.2.208 – 10.50.3.255
```

**Route summarisation** (supernetting) does the reverse: it advertises several contiguous networks as one larger prefix. Four subnets `10.60.0.0/24`, `10.60.1.0/24`, `10.60.2.0/24` and `10.60.3.0/24` share their first 22 bits, so they summarise to `10.60.0.0/22`.

How to find a summary: write the networks in binary, find the longest run of identical leading bits, and that's the prefix length. Networks only summarise cleanly if they're contiguous and aligned to the summary's boundary.

Why it matters in the cloud:

- On-premises routers need one route per cloud region instead of hundreds.
- You stay under BGP prefix limits on Direct Connect, ExpressRoute, Interconnect and FastConnect.
- Route tables and firewall rules become shorter and easier to read.

> **Tip:** Design address plans so that everything in one region, environment or cloud summarises into a single prefix. Summarisation is only possible if you planned for it.

## Lesson 8: Real-world scenario: the subnet that ran out of addresses

**Situation.** A team on AWS created its EKS cluster in two /24 subnets (251 usable IPs each). Six months later, during a traffic peak, the cluster autoscaler adds nodes but new pods stay in "Pending" with errors about failing to assign IP addresses. The site slows down during its busiest hour.

**Investigation.** The AWS VPC CNI gives every pod a real VPC IP, and each node also pre-allocates a pool of spare IPs. With 30 nodes, each holding pods plus warm IPs, the two /24s are exhausted.

**Fix.**

1. Short term: reduce the warm IP pool settings so nodes don't hoard addresses.
2. Add a **secondary CIDR** to the VPC (for example `100.64.0.0/16`) and use **custom networking** so pods get IPs from new, large subnets while nodes stay in the original ones.
3. Enable **prefix delegation** to fit more pods per node.
4. Add monitoring and alerts on available IPs per subnet.

**Lessons learned.** Subnets for containers and serverless must be sized for peak scale, not for today. Subnets are hard or impossible to resize, so leave room in every VPC/VNet plan.

## Key takeaways

- Addresses in a block = 2^(32 − prefix). Each extra prefix bit halves the block.
- Use RFC 1918 ranges (10/8, 172.16/12, 192.168/16) for every private cloud network.
- Clouds reserve addresses per subnet: AWS 5, Azure 5, Google Cloud 4, OCI 3.
- Plan non-overlapping ranges up front; overlaps are very hard to fix later.

## Checkpoint

**Q1. How many addresses are in a /22?**

A. 256
B. 512
C. 1024  ✓
D. 2048

_2^(32 − 22) = 2^10 = 1024._

**Q2. Which range is NOT an RFC 1918 private range?**

A. 10.0.0.0/8
B. 172.16.0.0/12
C. 192.168.0.0/16
D. 100.64.0.0/10  ✓

_100.64.0.0/10 is shared address space for carrier-grade NAT (RFC 6598)._

**Q3. Which network does 10.1.37.200/20 belong to?**

A. 10.1.37.0/20
B. 10.1.0.0/20
C. 10.1.32.0/20  ✓
D. 10.1.36.0/20

_A /20 spans 16 values in the third octet. 37 falls in the block 32–47._

**Q4. How many usable addresses does a /27 subnet give you in AWS?**

A. 32
B. 30
C. 27  ✓
D. 29

_32 addresses minus the 5 AWS reserves = 27._

**Q5. What is the standard size for an IPv6 subnet?**

A. /24
B. /48
C. /64  ✓
D. /128

_IPv6 subnets are /64 by convention; many features depend on it._

**Q6. Which prefix summarises 10.60.0.0/24 through 10.60.3.0/24?**

A. 10.60.0.0/23
B. 10.60.0.0/22  ✓
C. 10.60.0.0/21
D. 10.60.0.0/16

_Four contiguous /24s aligned on a 1,024-address boundary form a /22._

**Q7. When allocating VLSM subnets, which should you allocate first?**

A. The smallest
B. The largest  ✓
C. Point-to-point links
D. Any order

_Allocating largest first keeps every block aligned and avoids wasted gaps._

## Official reading

- [RFC 1918: private address space](https://www.rfc-editor.org/rfc/rfc1918)
- [AWS: subnet sizing](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html)
- [Azure: virtual network IP addressing FAQ](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq)
