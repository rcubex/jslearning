# Module 03: IP Addressing & Subnetting

**Level:** 1 · **Lessons:** 6

## A real-world thread: New office address planning

A company opens offices in two cities and needs distinct ranges for staff, servers, visitors and future cloud connections. Overlapping IP blocks later complicate routing and VPN connectivity.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: IPv4 address structure

An IPv4 address is a 32-bit number, written as four **octets** (8-bit numbers from 0 to 255) separated by dots: `192.168.10.25`. Computers see it in binary:

```text
192      .168      .10       .25
11000000 .10101000 .00001010 .00011001
```

Every address has two parts. The **network part** identifies which network (subnet) the address belongs to; the **host part** identifies one device on that network. Devices with the same network part can talk directly; anything else has to go through a router.

The split between the two parts is set by the **subnet mask** or, more commonly today, the **prefix length**. With a /24 prefix, the first 24 bits (three octets) are the network and the last 8 bits are the host. So `192.168.10.25/24` is host 25 on network `192.168.10.0`.

- 32 bits, four octets, each 0–255
- Network part + host part; the prefix length marks the split
- Same network part → direct delivery; different → via a router

> **Tip:** Learn the powers of two up to 256 by heart: 1, 2, 4, 8, 16, 32, 64, 128, 256. Subnetting is just these numbers.

**Build the mental model:** 32 bits, four octets, each 0–255. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — New office address planning:** Consider how “ipv4 address structure” affects the situation: A company opens offices in two cities and needs distinct ranges for staff, servers, visitors and future cloud connections. Overlapping IP blocks later complicate routing and VPN connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For ipv4 address structure, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain ipv4 address structure to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: CIDR notation and the maths

**CIDR** (Classless Inter-Domain Routing) writes a network as `address/prefix`, such as `10.0.0.0/16`. The number of addresses is 2^(32 − prefix):

```text
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

**Build the mental model:** Size = 2^(32 − prefix). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — New office address planning:** Consider how “cidr notation and the maths” affects the situation: A company opens offices in two cities and needs distinct ranges for staff, servers, visitors and future cloud connections. Overlapping IP blocks later complicate routing and VPN connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For cidr notation and the maths, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain cidr notation and the maths to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Private ranges (RFC 1918)

Three ranges are reserved for private use and are never routed on the public Internet:

- `10.0.0.0/8` (16.7 million addresses)
- `172.16.0.0/12` (172.16.0.0 to 172.31.255.255, about 1 million)
- `192.168.0.0/16` (65,536)

Every virtual network you build in AWS, Azure, Google Cloud or OCI should use one of these. Devices with private addresses reach the Internet through **NAT**, which swaps the private source address for a public one.

Other special ranges you will see: `127.0.0.0/8` is loopback (the machine itself), `169.254.0.0/16` is link-local (a device that failed to get a DHCP address gives itself one of these; clouds also use 169.254.169.254 for the instance metadata service), and `100.64.0.0/10` is shared space used by carriers for large-scale NAT.

> **Watch out:** Many home routers use 192.168.0.0/24 or 192.168.1.0/24, and many companies use 10.0.0.0/16. If your cloud network uses the same range as an office or a VPN user's home, those users cannot reach it. Pick less common blocks such as 10.40.0.0/16.

**Build the mental model:** 10.0.0.0/8 (16.7 million addresses). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — New office address planning:** Consider how “private ranges (rfc 1918)” affects the situation: A company opens offices in two cities and needs distinct ranges for staff, servers, visitors and future cloud connections. Overlapping IP blocks later complicate routing and VPN connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For private ranges (rfc 1918), consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain private ranges (rfc 1918) to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: Cloud address reservations

Clouds keep some addresses in every subnet for their own services (the router, DNS, future use). That means fewer usable addresses than the classic "size minus two".

- **AWS**: 5 per subnet (network address, VPC router, DNS, reserved for future use, last address). A /24 gives 251 usable. Subnets can be /16 to /28.
- **Azure**: 5 per subnet (network address, default gateway, two for Azure DNS, last address). A /24 gives 251. The smallest subnet is /29.
- **Google Cloud**: 4 per subnet (network, gateway, second-to-last and last). A /24 gives 252. The smallest IPv4 subnet is /29.
- **OCI**: 3 per subnet (network address, default gateway, last address). A /24 gives 253.

Some managed services need large dedicated subnets: Kubernetes pods, Azure Firewall (/26), Azure Bastion (/26), gateway subnets and database services. Under-sizing a subnet is a common and painful mistake, because most clouds do not let you resize a subnet that is in use.

> **Tip:** For production, give each subnet at least a /24 unless you have a reason not to, and keep spare space in the VPC/VNet for subnets you will need later.

**Build the mental model:** AWS: 5 per subnet (network address, VPC router, DNS, reserved for future use, last address). A /24 gives 251 usable. Subnets can be /16 to /28. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — New office address planning:** Consider how “cloud address reservations” affects the situation: A company opens offices in two cities and needs distinct ranges for staff, servers, visitors and future cloud connections. Overlapping IP blocks later complicate routing and VPN connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For cloud address reservations, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain cloud address reservations to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: IPv6 essentials

IPv4 has only about 4.3 billion addresses, which ran out years ago. **IPv6** uses 128-bit addresses written as eight groups of four hex digits, for example `2001:0db8:0000:0000:0000:0000:0000:0001`, shortened to `2001:db8::1` by dropping leading zeros and replacing one run of zero groups with `::`.

The standard subnet size in IPv6 is a **/64**, which holds 18 quintillion addresses. Addresses are so plentiful that NAT is not needed: every device can have a globally unique address, and firewalls (not NAT) provide protection.

All four clouds support **dual-stack** networks, where resources have both an IPv4 and an IPv6 address. AWS, for example, assigns a /56 to a VPC and /64s to subnets, and offers an egress-only Internet gateway so IPv6 instances can reach out without being reachable from outside.

- 128 bits, hex, `::` shortens zeros
- /64 per subnet is the norm
- Dual-stack = IPv4 and IPv6 side by side

> **Watch out:** An IPv6 address is often directly reachable from the Internet. Security groups and firewall rules must cover IPv6 (`::/0`) as well as IPv4 (`0.0.0.0/0`).

**Build the mental model:** 128 bits, hex, :: shortens zeros. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — New office address planning:** Consider how “ipv6 essentials” affects the situation: A company opens offices in two cities and needs distinct ranges for staff, servers, visitors and future cloud connections. Overlapping IP blocks later complicate routing and VPN connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For ipv6 essentials, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain ipv6 essentials to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: Planning a cloud address space

Good address planning is one of the most valuable skills in cloud networking, because mistakes are expensive to undo. A simple, scalable approach:

1. Reserve a large block for all cloud use, for example `10.64.0.0/10`, that does not overlap with any office or data-centre range.
2. Give each region or environment its own large block, for example a /16 each for prod, staging and dev.
3. Inside each VPC/VNet, create subnets per tier (public, app, data) and per availability zone.

```text
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

**Build the mental model:** Reserve a large block for all cloud use, for example 10.64.0.0/10, that does not overlap with any office or data-centre range. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — New office address planning:** Consider how “planning a cloud address space” affects the situation: A company opens offices in two cities and needs distinct ranges for staff, servers, visitors and future cloud connections. Overlapping IP blocks later complicate routing and VPN connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For planning a cloud address space, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain planning a cloud address space to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
