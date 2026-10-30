# Module 06: Physical Layer, Ethernet & Wi-Fi

**Level:** 1 · **Lessons:** 6 · **Questions:** 6

_Understand the cables, frames, radios and data-centre designs everything else runs on._

## Lesson 1: Copper and fibre cabling

Most networks still start with a cable. Two families matter.

**Twisted-pair copper** (the familiar Ethernet cable with an RJ45 plug) is cheap and easy to install. Categories set the speed it can carry: **Cat5e** handles 1 Gbps, **Cat6** handles 1 Gbps (and 10 Gbps over short runs), and **Cat6A** handles 10 Gbps up to the standard **100 m** limit. Copper can also deliver power to devices such as Wi-Fi access points and cameras (**PoE**, Power over Ethernet).

**Fibre** sends light through glass. It is immune to electrical interference and reaches much further:

- **Multimode fibre** (OM3, OM4, OM5): cheaper optics, used inside buildings and data centres for runs of a few hundred metres.
- **Single-mode fibre** (OS2): a very thin core that carries light tens of kilometres; used between buildings, by carriers and for cloud private links.

Switches and routers accept pluggable **transceivers** that convert electrical signals to light: **SFP** (1 Gbps), **SFP+** (10 Gbps), **SFP28** (25 Gbps), **QSFP28** (100 Gbps) and **QSFP-DD / OSFP** (400 Gbps and beyond). The transceiver type must match the fibre type and the device at the other end.

- Copper: up to 100 m, easy, carries power (PoE)
- Multimode fibre: short distances inside buildings
- Single-mode fibre: long distances; what cloud cross-connects use

> **In the cloud:** When you order AWS Direct Connect, Azure ExpressRoute Direct, Google Dedicated Interconnect or OCI FastConnect colocation, you are asked for single-mode fibre with a specific optic, such as 10GBASE-LR or 100GBASE-LR4. Getting the optic wrong is a common reason a new link won't come up.

## Lesson 2: Ethernet standards and frames

**Ethernet** (IEEE 802.3) is the Layer 2 technology of almost every wired network, and the cloud's virtual networks still carry Ethernet frames between VMs.

Standard names describe speed and medium: **1000BASE-T** is 1 Gbps over copper, **10GBASE-SR** is 10 Gbps over multimode fibre ("short reach"), **10GBASE-LR** is 10 Gbps over single-mode fibre ("long reach", 10 km), and **100GBASE-LR4** is 100 Gbps over single-mode fibre.

Every Ethernet frame has the same structure:

**Ethernet II frame**

```
| Destination MAC (6) | Source MAC (6) | EtherType (2) | Payload (46–1500) | FCS (4) |
EtherType: 0x0800 = IPv4, 0x86DD = IPv6, 0x0806 = ARP, 0x8100 = 802.1Q VLAN tag follows
FCS (frame check sequence): a CRC checksum; frames that fail it are dropped
```

The payload limit of 1,500 bytes is the **MTU** you met earlier. **Jumbo frames** raise it (often to 9,000) inside data centres for efficiency.

Links negotiate speed and **duplex** automatically. **Full duplex** sends and receives at the same time; a **duplex mismatch** (one side full, the other half) causes slow, error-ridden links that still look "up".

**Check a Linux interface's link details**

```
ethtool eth0          # speed, duplex, link detected
ip -s link show eth0  # packet, error and drop counters
```

> **Tip:** Rising error counters (CRC errors, drops) on an interface usually mean a bad cable, a dirty fibre connector or a failing transceiver: a Layer 1 problem.

## Lesson 3: Wi-Fi fundamentals

**Wi-Fi** (IEEE 802.11) sends Ethernet-style frames over radio. Generations you will meet:

- **Wi-Fi 4** (802.11n): 2.4 and 5 GHz
- **Wi-Fi 5** (802.11ac): 5 GHz, much faster
- **Wi-Fi 6 / 6E** (802.11ax): better performance in crowded places; 6E adds the 6 GHz band
- **Wi-Fi 7** (802.11be): wider 320 MHz channels in 6 GHz and **multi-link operation** (using several bands at once)

**Bands** trade range for speed: 2.4 GHz travels further through walls but is crowded and slow, with only three non-overlapping channels (1, 6 and 11); 5 GHz and 6 GHz are faster with many more channels but shorter range.

Wi-Fi is a **shared medium**: devices on the same channel take turns. That is why one slow, distant device can slow everyone down, and why channel planning matters in offices.

An **SSID** is the network name; each access point radio has a **BSSID** (its MAC address). Security should be **WPA3** (or at least WPA2-AES); in companies, **WPA2/WPA3-Enterprise** uses 802.1X with individual logins or certificates instead of a shared password.

> **Watch out:** Open or WEP Wi-Fi offers no real protection. On untrusted Wi-Fi, rely on TLS and a VPN for anything sensitive.

## Lesson 4: Data-centre network design

Traditional networks used a three-tier tree: access, aggregation and core switches, with Spanning Tree blocking redundant links. It handled north-south traffic (users to servers) but struggled with modern east-west traffic (server to server).

Modern data centres, including every major cloud, use a **spine-leaf** (Clos) fabric:

- **Leaf** switches sit at the top of each rack (top-of-rack) and connect servers.
- **Spine** switches connect every leaf to every other leaf.
- Every leaf connects to every spine, so any server reaches any other in the same number of hops, over many equal paths.
- Routing (often BGP) runs between switches, with **ECMP** spreading traffic across all paths. No links are blocked.

**Oversubscription** compares the bandwidth servers can send into a leaf with the leaf's uplink bandwidth to the spines. A ratio of 3:1 means uplinks could be saturated if every server sends at full speed at once.

The cloud's virtual networks run as an **overlay** on top of these physical fabrics: your VPC traffic is encapsulated and carried across the provider's spine-leaf network, which is why you never see VLANs or switches.

> **Analogy:** Spine-leaf is like a city grid with many parallel roads; a three-tier tree is like a single road into each neighbourhood.

## Lesson 5: Link aggregation and redundancy

Single links and single devices fail, so networks add redundancy at Layer 2 and Layer 3.

**Link aggregation** (**LACP**, IEEE 802.3ad/802.1AX) bundles several physical links into one logical link for more bandwidth and resilience. Traffic is spread per flow using a hash, so a single flow still uses one link. **MLAG** (multi-chassis link aggregation) lets a server or switch connect to two different switches as if they were one.

**Spanning Tree Protocol** (STP, and the faster RSTP) prevents Layer 2 loops by blocking redundant paths. In modern designs, routed links and MLAG reduce reliance on STP.

**First-hop redundancy** keeps the default gateway available if a router fails. **VRRP** (open standard) and Cisco's **HSRP** share a virtual IP and MAC between two routers; hosts point at the virtual IP, and the standby router takes over within seconds.

**LACP bond on Linux (netplan example)**

```
bonds:
  bond0:
    interfaces: [enp1s0, enp2s0]
    parameters: { mode: 802.3ad, lacp-rate: fast, transmit-hash-policy: layer3+4 }
```

> **In the cloud:** You don't configure VRRP, STP or LACP inside a VPC; the provider's network handles redundancy. Classic Layer 2 failover tricks (floating IPs via gratuitous ARP) don't work there; use load balancers, cloud APIs to move secondary IPs, or BGP with Route Server-style services instead.

## Lesson 6: Real-world scenario: the fibre link that wouldn't come up

**Situation.** A company's new 10 Gbps private cloud connection is delivered to its cage in a colocation facility. The provider says the circuit is ready, but the router port stays down. A week of the project's schedule is at stake.

**Investigation.**

1. The router shows the transceiver as present but "no light received".
2. The engineer checks the order: the cloud side uses **10GBASE-LR** (single-mode, 1310 nm). The router has a **10GBASE-SR** optic (multimode, 850 nm), left over from an internal project. They can't talk to each other.
3. After swapping in an LR optic, light is received but the link still flaps. A fibre inspection scope shows a dirty connector on the cross-connect patch cable.
4. The facility cleans and re-terminates the connector. The link comes up cleanly; then BGP establishes as planned.

**Lessons learned.** Physical-layer details (optic type, fibre type, connector type, cleanliness, transmit/receive polarity) cause many delays on new circuits. Check the provider's Letter of Authorization (LOA-CFA) and port specification against your equipment before the circuit arrives, and keep spare optics and cleaning kits.

## Key takeaways

- Copper reaches about 100 m; fibre goes further and faster.
- An Ethernet frame carries MAC addresses, a type field, up to 1,500 bytes of payload and a checksum.
- Wi-Fi shares the air; band, channel and security settings decide speed and safety.
- Cloud data centres are built as spine-leaf fabrics with many equal paths.

## Checkpoint

**Q1. What is the standard maximum length of a twisted-pair Ethernet run?**

A. 10 m
B. 100 m  ✓
C. 500 m
D. 10 km

_Copper Ethernet standards are specified to 100 metres._

**Q2. Which fibre type would a 10 km cloud cross-connect use?**

A. Multimode OM3
B. Single-mode  ✓
C. Cat6A
D. Coaxial

_Single-mode fibre carries light over long distances; LR optics reach 10 km._

**Q3. What does an EtherType of 0x86DD indicate?**

A. ARP
B. IPv4
C. IPv6  ✓
D. A VLAN tag

_0x86DD marks an IPv6 payload; 0x0800 is IPv4._

**Q4. In a spine-leaf fabric, how is traffic spread across links?**

A. Spanning Tree blocks all but one path
B. ECMP spreads flows across many equal-cost paths  ✓
C. Each server picks a random spine manually
D. Traffic is broadcast to every switch

_Routed spine-leaf fabrics use equal-cost multipath, so no links are idle._

**Q5. Which protocol shares a virtual default-gateway IP between two routers?**

A. LACP
B. STP
C. VRRP  ✓
D. ARP

_VRRP (and Cisco HSRP) provide first-hop redundancy with a shared virtual IP._

**Q6. A 10GBASE-SR optic is connected to a 10GBASE-LR port over single-mode fibre. What happens?**

A. It works at reduced speed
B. The link stays down; the optics and fibre types don't match  ✓
C. It works only for IPv6
D. It auto-negotiates to 1 Gbps

_SR (multimode, 850 nm) and LR (single-mode, 1310 nm) optics are incompatible._

## Official reading

- [IEEE 802.3 Ethernet working group](https://www.ieee802.org/3/)
- [Wi-Fi Alliance: Wi-Fi 7](https://www.wi-fi.org/discover-wi-fi/wi-fi-certified-7)
- [Cisco: spine-leaf architecture](https://www.cisco.com/c/en/us/products/collateral/switches/nexus-9000-series-switches/white-paper-c11-737022.html)
