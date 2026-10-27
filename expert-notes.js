export const EXPERT_NOTES = {
 "m01": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Devices + links + protocols = a network. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Video call across countries: Consider how “what a network is” affects the situation: An employee in Dubai joins a video call hosted in Europe. Voice packets cross home Wi-Fi, ISP networks, international transit and a cloud region. Different paths and temporary congestion may introduce jitter despite high advertised bandwidth. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For what a network is, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For what a network is, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Packet = header (addresses and control info) + payload (your data). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Video call across countries: Consider how “packets and packet switching” affects the situation: An employee in Dubai joins a video call hosted in Europe. Voice packets cross home Wi-Fi, ISP networks, international transit and a cloud region. Different paths and temporary congestion may introduce jitter despite high advertised bandwidth. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For packets and packet switching, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For packets and packet switching, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Large file transfers care most about bandwidth and loss. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Video call across countries: Consider how “bandwidth, latency, jitter, loss” affects the situation: An employee in Dubai joins a video call hosted in Europe. Voice packets cross home Wi-Fi, ISP networks, international transit and a cloud region. Different paths and temporary congestion may introduce jitter despite high advertised bandwidth. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For bandwidth, latency, jitter, loss, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For bandwidth, latency, jitter, loss, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Star: simple, one central point. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Video call across countries: Consider how “topologies and the edge” affects the situation: An employee in Dubai joins a video call hosted in Europe. Voice packets cross home Wi-Fi, ISP networks, international transit and a cloud region. Different paths and temporary congestion may introduce jitter despite high advertised bandwidth. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For topologies and the edge, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For topologies and the edge, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Your laptop already has an IP address, subnet mask, default gateway and DNS server, which it got from DHCP when it joined the network. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Video call across countries: Consider how “how a web request travels end to end” affects the situation: An employee in Dubai joins a video call hosted in Europe. Voice packets cross home Wi-Fi, ISP networks, international transit and a cloud region. Different paths and temporary congestion may introduce jitter despite high advertised bandwidth. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For how a web request travels end to end, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For how a web request travels end to end, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m02": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: 1 Physical: bits as electrical signals, light or radio. Cables, fibre, Wi-Fi radio. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Website appears down: Consider how “the seven osi layers” affects the situation: A user can reach an IP address but cannot open its domain name. DNS, transport, TLS and application layers should be distinguished before anyone blames the web server. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For the seven osi layers, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For the seven osi layers, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS Network Load Balancer, Azure Load Balancer, Google Cloud passthrough Network Load Balancer, OCI Network Load Balancer: Layer 4. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Website appears down: Consider how “the tcp/ip model” affects the situation: A user can reach an IP address but cannot open its domain name. DNS, transport, TLS and application layers should be distinguished before anyone blames the web server. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For the tcp/ip model, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For the tcp/ip model, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: The application produces data, such as an HTTP request. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Website appears down: Consider how “encapsulation” affects the situation: A user can reach an IP address but cannot open its domain name. DNS, transport, TLS and application layers should be distinguished before anyone blames the web server. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For encapsulation, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For encapsulation, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Hub / repeater (L1): copies bits to every port. Obsolete. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Website appears down: Consider how “devices by layer” affects the situation: A user can reach an IP address but cannot open its domain name. DNS, transport, TLS and application layers should be distinguished before anyone blames the web server. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For devices by layer, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For devices by layer, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: L1: Is the link up? Is the cable plugged in? Is Wi-Fi connected?. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Website appears down: Consider how “troubleshooting with the layers” affects the situation: A user can reach an IP address but cannot open its domain name. DNS, transport, TLS and application layers should be distinguished before anyone blames the web server. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For troubleshooting with the layers, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For troubleshooting with the layers, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m03": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: 32 bits, four octets, each 0–255. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — New office address planning: Consider how “ipv4 address structure” affects the situation: A company opens offices in two cities and needs distinct ranges for staff, servers, visitors and future cloud connections. Overlapping IP blocks later complicate routing and VPN connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For ipv4 address structure, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For ipv4 address structure, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Size = 2^(32 − prefix). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — New office address planning: Consider how “cidr notation and the maths” affects the situation: A company opens offices in two cities and needs distinct ranges for staff, servers, visitors and future cloud connections. Overlapping IP blocks later complicate routing and VPN connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For cidr notation and the maths, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For cidr notation and the maths, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: 10.0.0.0/8 (16.7 million addresses). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — New office address planning: Consider how “private ranges (rfc 1918)” affects the situation: A company opens offices in two cities and needs distinct ranges for staff, servers, visitors and future cloud connections. Overlapping IP blocks later complicate routing and VPN connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For private ranges (rfc 1918), consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For private ranges (rfc 1918), consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS: 5 per subnet (network address, VPC router, DNS, reserved for future use, last address). A /24 gives 251 usable. Subnets can be /16 to /28. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — New office address planning: Consider how “cloud address reservations” affects the situation: A company opens offices in two cities and needs distinct ranges for staff, servers, visitors and future cloud connections. Overlapping IP blocks later complicate routing and VPN connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For cloud address reservations, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For cloud address reservations, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: 128 bits, hex, :: shortens zeros. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — New office address planning: Consider how “ipv6 essentials” affects the situation: A company opens offices in two cities and needs distinct ranges for staff, servers, visitors and future cloud connections. Overlapping IP blocks later complicate routing and VPN connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For ipv6 essentials, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For ipv6 essentials, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Reserve a large block for all cloud use, for example 10.64.0.0/10, that does not overlap with any office or data-centre range. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — New office address planning: Consider how “planning a cloud address space” affects the situation: A company opens offices in two cities and needs distinct ranges for staff, servers, visitors and future cloud connections. Overlapping IP blocks later complicate routing and VPN connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For planning a cloud address space, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For planning a cloud address space, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m04": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: TCP: handshake, reliable, ordered, congestion control. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Banking app connection: Consider how “tcp vs udp” affects the situation: A customer opens a banking application. DNS locates the endpoint, TLS protects the session, TCP or QUIC transports messages and application requests access account information. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For tcp vs udp, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For tcp vs udp, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: 20/21 FTP, 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 67/68 DHCP. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Banking app connection: Consider how “ports” affects the situation: A customer opens a banking application. DNS locates the endpoint, TLS protects the session, TCP or QUIC transports messages and application requests access account information. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For ports, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For ports, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: A: name → IPv4 address. AAAA: name → IPv6 address. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Banking app connection: Consider how “dns” affects the situation: A customer opens a banking application. DNS locates the endpoint, TLS protects the session, TCP or QUIC transports messages and application requests access account information. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For dns, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For dns, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: DHCP (Dynamic Host Configuration Protocol) gives a device its network settings automatically: IP address, subnet mask, default gateway, DNS servers and lease time. It works in four steps, remembered as DORA: the. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Banking app connection: Consider how “dhcp and arp” affects the situation: A customer opens a banking application. DNS locates the endpoint, TLS protects the session, TCP or QUIC transports messages and application requests access account information. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For dhcp and arp, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For dhcp and arp, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: ICMP (Internet Control Message Protocol) carries network control messages. ping uses ICMP Echo Request and Echo Reply. traceroute relies on ICMP \"Time Exceeded\" messages. ICMP also carries \"Destination Unreachabl. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Banking app connection: Consider how “icmp, http and tls” affects the situation: A customer opens a banking application. DNS locates the endpoint, TLS protects the session, TCP or QUIC transports messages and application requests access account information. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For icmp, http and tls, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For icmp, http and tls, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m05": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Switches learn MAC addresses from incoming frames. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Branch reaching a database: Consider how “switching and mac tables” affects the situation: A branch workstation sends data to a database in another subnet. A switch forwards frames locally; the router selects the remote path; translation may occur at the Internet boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For switching and mac tables, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For switching and mac tables, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: A VLAN (virtual LAN) splits one physical switch into several separate broadcast domains. Ports in VLAN 10 (say, staff) cannot talk directly to ports in VLAN 20 (say, guests) even though they share the same hardware. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Branch reaching a database: Consider how “vlans” affects the situation: A branch workstation sends data to a database in another subnet. A switch forwards frames locally; the router selects the remote path; translation may occur at the Internet boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For vlans, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For vlans, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: A router connects different networks and forwards packets between them. For every packet it checks the destination IP against its routing table, a list of prefixes and where to send matching traffic (the next h. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Branch reaching a database: Consider how “routing tables” affects the situation: A branch workstation sends data to a database in another subnet. A switch forwards frames locally; the router selects the remote path; translation may occur at the Internet boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For routing tables, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For routing tables, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: OSPF (Open Shortest Path First) is an *interior* protocol used inside one organisation. Routers share a map of the network and calculate the shortest path. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Branch reaching a database: Consider how “static vs dynamic routing” affects the situation: A branch workstation sends data to a database in another subnet. A switch forwards frames locally; the router selects the remote path; translation may occur at the Internet boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For static vs dynamic routing, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For static vs dynamic routing, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Source NAT (SNAT): private source addresses are replaced with a public one on the way out, and translated back on the way in. This lets private networks reach the Internet. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Branch reaching a database: Consider how “nat and pat” affects the situation: A branch workstation sends data to a database in another subnet. A switch forwards frames locally; the router selects the remote path; translation may occur at the Internet boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For nat and pat, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For nat and pat, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: The VM (10.0.2.15, in a private subnet) wants to reach 93.184.215.14:443. That address is not in its subnet, so it sends the packet to the subnet's virtual router. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Branch reaching a database: Consider how “putting it together: a packet's journey” affects the situation: A branch workstation sends data to a database in another subnet. A switch forwards frames locally; the router selects the remote path; translation may occur at the Internet boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For putting it together: a packet's journey, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For putting it together: a packet's journey, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m06": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS security groups, Azure NSGs, Google Cloud firewall rules and OCI NSGs are stateful. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Partner network integration: Consider how “stateful vs stateless filtering” affects the situation: A company integrates an external payment partner. Separate network zones, least-privilege access, encryption and controlled egress prevent one compromised system from reaching everything. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For stateful vs stateless filtering, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For stateful vs stateless filtering, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Source: a specific subnet or security group, not 0.0.0.0/0. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Partner network integration: Consider how “rule order and default deny” affects the situation: A company integrates an external payment partner. Separate network zones, least-privilege access, encryption and controlled egress prevent one compromised system from reaching everything. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For rule order and default deny, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For rule order and default deny, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: A DMZ or public zone for things the Internet must reach: load balancers, reverse proxies, VPN endpoints. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Partner network integration: Consider how “segmentation and the dmz” affects the situation: A company integrates an external payment partner. Separate network zones, least-privilege access, encryption and controlled egress prevent one compromised system from reaching everything. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For segmentation and the dmz, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For segmentation and the dmz, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: A VPN (virtual private network) builds an encrypted tunnel across an untrusted network such as the Internet. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Partner network integration: Consider how “vpns, ipsec and ike” affects the situation: A company integrates an external payment partner. Separate network zones, least-privilege access, encryption and controlled egress prevent one compromised system from reaching everything. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For vpns, ipsec and ike, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For vpns, ipsec and ike, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Identity: who is the user or workload, proven with strong authentication (MFA, certificates, workload identity). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Partner network integration: Consider how “zero trust” affects the situation: A company integrates an external payment partner. Separate network zones, least-privilege access, encryption and controlled egress prevent one compromised system from reaching everything. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For zero trust, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For zero trust, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Edge: DDoS protection and a web application firewall. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Partner network integration: Consider how “encryption in transit and defense in depth” affects the situation: A company integrates an external payment partner. Separate network zones, least-privilege access, encryption and controlled egress prevent one compromised system from reaching everything. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For encryption in transit and defense in depth, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For encryption in transit and defense in depth, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m07": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Choose L4 for non-HTTP protocols, extreme performance or static IPs. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Traffic spike after product launch: Consider how “l4 vs l7 load balancing” affects the situation: A product announcement causes a sudden increase in visits. Health-aware load balancing distributes requests, a CDN serves cacheable objects and reverse proxies enforce application-facing controls. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For l4 vs l7 load balancing, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For l4 vs l7 load balancing, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: A check that is too shallow (just \"is the port open\") keeps sending traffic to an app that is running but broken. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Traffic spike after product launch: Consider how “health checks” affects the situation: A product announcement causes a sudden increase in visits. Health-aware load balancing distributes requests, a CDN serves cacheable objects and reverse proxies enforce application-facing controls. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For health checks, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For health checks, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Some applications store user state on one server. Sticky sessions (session affinity) send a user's requests to the same backend, usually with a cookie. They help legacy apps but spread load unevenly; storing sessions. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Traffic spike after product launch: Consider how “sessions, tls termination and reverse proxies” affects the situation: A product announcement causes a sudden increase in visits. Health-aware load balancing distributes requests, a CDN serves cacheable objects and reverse proxies enforce application-facing controls. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For sessions, tls termination and reverse proxies, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For sessions, tls termination and reverse proxies, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: A CDN (content delivery network) caches content in hundreds of edge locations close to users. A user in Dubai downloading an image from a server in Ireland gets it from a nearby edge instead, cutting latency and. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Traffic spike after product launch: Consider how “cdns and anycast” affects the situation: A product announcement causes a sudden increase in visits. Health-aware load balancing distributes requests, a CDN serves cacheable objects and reverse proxies enforce application-facing controls. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For cdns and anycast, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For cdns and anycast, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Static website or global audience → CDN in front, origin in object storage or behind a load balancer. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Traffic spike after product launch: Consider how “choosing the right front door” affects the situation: A product announcement causes a sudden increase in visits. Health-aware load balancing distributes requests, a CDN serves cacheable objects and reverse proxies enforce application-facing controls. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For choosing the right front door, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For choosing the right front door, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m08": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: On any Linux VM, start with two commands. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — API is intermittently unreachable: Consider how “interfaces and routes” affects the situation: An internal API sometimes times out. Name resolution, socket state, routes, MTU, host firewall and packet timing provide different clues; no single command proves the root cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For interfaces and routes, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For interfaces and routes, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: ss (socket statistics) shows connections and listening ports. The most useful form is ss -tulpn: tcp, udp, listening, process, numeric. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — API is intermittently unreachable: Consider how “sockets and ports” affects the situation: An internal API sometimes times out. Name resolution, socket state, routes, MTU, host firewall and packet timing provide different clues; no single command proves the root cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For sockets and ports, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For sockets and ports, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: curl is the Swiss army knife for testing web services. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — API is intermittently unreachable: Consider how “http and dns testing” affects the situation: An internal API sometimes times out. Name resolution, socket state, routes, MTU, host firewall and packet timing provide different clues; no single command proves the root cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For http and dns testing, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For http and dns testing, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: You see SYN going out and nothing coming back → something on the path is dropping it (security rule, NACL, route, or the far host is down). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — API is intermittently unreachable: Consider how “packet capture” affects the situation: An internal API sometimes times out. Name resolution, socket state, routes, MTU, host firewall and packet timing provide different clues; no single command proves the root cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For packet capture, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For packet capture, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: The MTU (maximum transmission unit) is the largest packet a link can carry. Standard Ethernet is 1,500 bytes. Some cloud networks support jumbo frames: AWS allows 9,001 bytes inside a VPC, a Google Cloud VPC's MT. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — API is intermittently unreachable: Consider how “mtu and fragmentation” affects the situation: An internal API sometimes times out. Name resolution, socket state, routes, MTU, host firewall and packet timing provide different clues; no single command proves the root cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For mtu and fragmentation, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For mtu and fragmentation, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Linux has its own firewall in the kernel, managed with iptables or its successor nftables, or more simply with ufw (Ubuntu) and firewalld (RHEL family). A host firewall applies in addition to cloud securi. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — API is intermittently unreachable: Consider how “host firewalls” affects the situation: An internal API sometimes times out. Name resolution, socket state, routes, MTU, host firewall and packet timing provide different clues; no single command proves the root cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For host firewalls, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For host firewalls, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m09": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: An autonomous system (AS) is a network, or group of networks, run by one organisation with one routing policy. Each has an ASN (autonomous system number). Examples: Amazon is AS16509, Microsoft AS8075, Google AS1. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Two ISPs for a critical office: Consider how “autonomous systems” affects the situation: An organisation connects to two providers. BGP exchanges reachable prefixes, but route attributes, filtering and asymmetric paths determine whether resilience works as intended. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For autonomous systems, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For autonomous systems, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: eBGP (external BGP) runs between routers in *different* autonomous systems, usually directly connected. iBGP (internal BGP) runs between routers in the *same* AS to spread externally learned routes across the org. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Two ISPs for a critical office: Consider how “ebgp and ibgp” affects the situation: An organisation connects to two providers. BGP exchanges reachable prefixes, but route attributes, filtering and asymmetric paths determine whether resilience works as intended. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For ebgp and ibgp, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For ebgp and ibgp, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Highest local preference: set inside your AS to choose the *outbound* exit (prefer link A over link B for traffic you send). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Two ISPs for a critical office: Consider how “path selection” affects the situation: An organisation connects to two providers. BGP exchanges reachable prefixes, but route attributes, filtering and asymmetric paths determine whether resilience works as intended. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For path selection, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For path selection, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Networks connect to each other in two commercial ways. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Two ISPs for a critical office: Consider how “peering and transit” affects the situation: An organisation connects to two providers. BGP exchanges reachable prefixes, but route attributes, filtering and asymmetric paths determine whether resilience works as intended. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For peering and transit, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For peering and transit, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Prefix filters: only advertise your own prefixes, and only accept what you expect from each peer. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Two ISPs for a critical office: Consider how “route security and best practice” affects the situation: An organisation connects to two providers. BGP exchanges reachable prefixes, but route attributes, filtering and asymmetric paths determine whether resilience works as intended. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For route security and best practice, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For route security and best practice, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m10": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: IaaS (Infrastructure as a Service): you rent virtual machines, disks and networks. You manage the operating system, patches, middleware and applications. Examples: Amazon EC2, Azure Virtual Machines, Google Compute Engin. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Migrating an on-premise application: Consider how “service models” affects the situation: A firm wants to move a three-tier application to cloud infrastructure. Responsibility, region selection, data residency, service models and recurring network charges change the design. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For service models, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For service models, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Security in the cloud is split between the provider and you. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Migrating an on-premise application: Consider how “shared responsibility” affects the situation: A firm wants to move a three-tier application to cloud infrastructure. Responsibility, region selection, data residency, service models and recurring network charges change the design. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For shared responsibility, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For shared responsibility, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS, Azure and Google Cloud: availability zones, separate data centres with independent power, cooling and networking, connected by fast links (typically under 2 ms apart). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Migrating an on-premise application: Consider how “regions, zones and domains” affects the situation: A firm wants to move a three-tier application to cloud infrastructure. Responsibility, region selection, data residency, service models and recurring network charges change the design. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For regions, zones and domains, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For regions, zones and domains, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS: the largest catalogue and longest track record. Networks are built from many small, composable parts: VPC, subnets, route tables, gateways, Transit Gateway. Regional VPCs, subnets per zone. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Migrating an on-premise application: Consider how “the four providers at a glance” affects the situation: A firm wants to move a three-tier application to cloud infrastructure. Responsibility, region selection, data residency, service models and recurring network charges change the design. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For the four providers at a glance, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For the four providers at a glance, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Ingress (data coming into the cloud from the Internet) is usually free. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Migrating an on-premise application: Consider how “the cost of networking” affects the situation: A firm wants to move a three-tier application to cloud infrastructure. Responsibility, region selection, data residency, service models and recurring network charges change the design. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For the cost of networking, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For the cost of networking, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS: AWS Organizations with many accounts (one per workload and environment), grouped into organizational units. Service control policies (SCPs) set guardrails. AWS Control Tower sets up a standard multi-account landing. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Migrating an on-premise application: Consider how “landing zones and resource organisation” affects the situation: A firm wants to move a three-tier application to cloud infrastructure. Responsibility, region selection, data residency, service models and recurring network charges change the design. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For landing zones and resource organisation, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For landing zones and resource organisation, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m11": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Authentication: who are you? (password plus MFA, a certificate, a federated login, a workload token). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Restricting cloud administration: Consider how “iam principles” affects the situation: Developers need to manage application instances, but only platform engineers should alter network boundaries. Separate identities, roles, permissions and audit records reduce accidental exposure. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For iam principles, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For iam principles, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS IAM has users (people or legacy apps), groups of users, and roles, identities without permanent credentials that can be *assumed* to get temporary credentials. Permissions are written in JSON policies. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Restricting cloud administration: Consider how “aws iam” affects the situation: Developers need to manage application instances, but only platform engineers should alter network boundaries. Separate identities, roles, permissions and audit records reduce accidental exposure. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For aws iam, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For aws iam, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Azure identities live in Microsoft Entra ID (formerly Azure Active Directory): users, groups, and service principals for applications. Access to Azure resources is controlled by Azure RBAC: you assign a rol. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Restricting cloud administration: Consider how “microsoft entra id and azure rbac” affects the situation: Developers need to manage application instances, but only platform engineers should alter network boundaries. Separate identities, roles, permissions and audit records reduce accidental exposure. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For microsoft entra id and azure rbac, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For microsoft entra id and azure rbac, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: In Google Cloud, you grant roles to principals (Google accounts, groups, service accounts, or federated identities) on a resource. The resource hierarchy is organization → folders → projects → resources,. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Restricting cloud administration: Consider how “google cloud iam” affects the situation: Developers need to manage application instances, but only platform engineers should alter network boundaries. Separate identities, roles, permissions and audit records reduce accidental exposure. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For google cloud iam, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For google cloud iam, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: OCI organises resources in compartments inside a tenancy. Compartments can be nested, and policies apply to a compartment and everything below it. Identities live in identity domains: users, groups and dyna. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Restricting cloud administration: Consider how “oci iam” affects the situation: Developers need to manage application instances, but only platform engineers should alter network boundaries. Separate identities, roles, permissions and audit records reduce accidental exposure. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For oci iam, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For oci iam, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS: a central network account owns VPCs and shares subnets to application accounts with AWS Resource Access Manager (RAM). App teams launch resources into shared subnets but cannot change route tables or gateways. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Restricting cloud administration: Consider how “separating network and application duties” affects the situation: Developers need to manage application instances, but only platform engineers should alter network boundaries. Separate identities, roles, permissions and audit records reduce accidental exposure. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For separating network and application duties, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For separating network and application duties, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m12": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS: VPC (Virtual Private Cloud). Primary CIDR between /16 and /28, plus up to four secondary CIDRs by default. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Private three-tier application: Consider how “the virtual network” affects the situation: A retail company hosts a public storefront, private APIs and a private database. Subnet design, routes, gateways and firewall rules must permit exact flows without exposing the database. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For the virtual network, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For the virtual network, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS: the VPC is regional. Each subnet lives in exactly one availability zone. For a three-zone design you create three public and three private subnets. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Private three-tier application: Consider how “scope differences” affects the situation: A retail company hosts a public storefront, private APIs and a private database. Subnet design, routes, gateways and firewall rules must permit exact flows without exposing the database. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For scope differences, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For scope differences, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS: route tables are associated with subnets. A subnet is \"public\" only because its route table sends 0.0.0.0/0 to an Internet gateway; a \"private\" subnet sends it to a NAT gateway (or has no default route). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Private three-tier application: Consider how “routing in the cloud” affects the situation: A retail company hosts a public storefront, private APIs and a private database. Subnet design, routes, gateways and firewall rules must permit exact flows without exposing the database. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For routing in the cloud, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For routing in the cloud, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS: security groups on network interfaces (stateful, allow-only, can reference other security groups) and network ACLs on subnets (stateless, numbered allow and deny rules). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Private three-tier application: Consider how “filtering in the cloud” affects the situation: A retail company hosts a public storefront, private APIs and a private database. Subnet design, routes, gateways and firewall rules must permit exact flows without exposing the database. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For filtering in the cloud, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For filtering in the cloud, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS: public IPv4 addresses (auto-assigned or Elastic IPs) on instances in subnets with an Internet gateway route. AWS charges for public IPv4 addresses. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Private three-tier application: Consider how “public ips and internet exposure” affects the situation: A retail company hosts a public storefront, private APIs and a private database. Subnet design, routes, gateways and firewall rules must permit exact flows without exposing the database. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For public ips and internet exposure, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For public ips and internet exposure, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Public tier: L7 load balancer with WAF, NAT gateway(s). The only Internet-facing parts. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Private three-tier application: Consider how “reference design: a three-tier network” affects the situation: A retail company hosts a public storefront, private APIs and a private database. Subnet design, routes, gateways and firewall rules must permit exact flows without exposing the database. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For reference design: a three-tier network, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For reference design: a three-tier network, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m13": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Internet gateway (IGW): one per VPC, horizontally scaled, free. Public subnets route 0.0.0.0/0 → igw-…. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — AWS private application: Consider how “vpc and subnets” affects the situation: A workload has an internet-facing load balancer but private compute instances. Security groups, subnet routes, NAT, endpoints, DNS and VPC connectivity work together to implement this boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For vpc and subnets, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For vpc and subnets, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Security groups (SGs) attach to network interfaces (ENIs). They are stateful and contain only allow rules; anything not allowed is denied. Their superpower is that a rule's source can be another security gr. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — AWS private application: Consider how “security groups vs network acls” affects the situation: A workload has an internet-facing load balancer but private compute instances. Security groups, subnet routes, NAT, endpoints, DNS and VPC connectivity work together to implement this boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For security groups vs network acls, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For security groups vs network acls, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: VPC peering connects two VPCs (same or different account, same or different region) privately. It is simple and has no hourly charge, but it is non-transitive: if A peers with B and B with C, A cannot reach C thr. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — AWS private application: Consider how “connecting vpcs: peering, transit gateway and cloud wan” affects the situation: A workload has an internet-facing load balancer but private compute instances. Security groups, subnet routes, NAT, endpoints, DNS and VPC connectivity work together to implement this boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For connecting vpcs: peering, transit gateway and cloud wan, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For connecting vpcs: peering, transit gateway and cloud wan, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Gateway endpoints (S3 and DynamoDB only) add a route to the subnet route tables using a managed prefix list. They are free. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — AWS private application: Consider how “private access to services” affects the situation: A workload has an internet-facing load balancer but private compute instances. Security groups, subnet routes, NAT, endpoints, DNS and VPC connectivity work together to implement this boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For private access to services, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For private access to services, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Public hosted zones for your Internet domains. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — AWS private application: Consider how “dns with route 53” affects the situation: A workload has an internet-facing load balancer but private compute instances. Security groups, subnet routes, NAT, endpoints, DNS and VPC connectivity work together to implement this boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For dns with route 53, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For dns with route 53, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Application Load Balancer (ALB): L7 HTTP/HTTPS/gRPC. Host, path, header and query routing; redirects; authentication with OIDC or Amazon Cognito; integrates with AWS WAF. Targets can be instances, IPs or Lambda functions. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — AWS private application: Consider how “load balancing and edge services” affects the situation: A workload has an internet-facing load balancer but private compute instances. Security groups, subnet routes, NAT, endpoints, DNS and VPC connectivity work together to implement this boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For load balancing and edge services, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For load balancing and edge services, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Dedicated connections of 1, 10, 100 or 400 Gbps, or hosted connections from a partner (from 50 Mbps upwards). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — AWS private application: Consider how “hybrid connectivity on aws” affects the situation: A workload has an internet-facing load balancer but private compute instances. Security groups, subnet routes, NAT, endpoints, DNS and VPC connectivity work together to implement this boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For hybrid connectivity on aws, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For hybrid connectivity on aws, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: VPC Flow Logs: metadata for every accepted and rejected flow at VPC, subnet or ENI level, sent to CloudWatch Logs, S3 or Firehose. A REJECT tells you a security group or NACL dropped the traffic. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — AWS private application: Consider how “operating and troubleshooting aws networks” affects the situation: A workload has an internet-facing load balancer but private compute instances. Security groups, subnet routes, NAT, endpoints, DNS and VPC connectivity work together to implement this boundary. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For operating and troubleshooting aws networks, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For operating and troubleshooting aws networks, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m14": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: GatewaySubnet for VPN and ExpressRoute gateways (/27 or larger recommended). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Azure hub-and-spoke organisation: Consider how “vnets and subnets” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For vnets and subnets, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For vnets and subnets, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Service tags are Microsoft-maintained groups of IP ranges, such as Internet, VirtualNetwork, AzureLoadBalancer, Storage, Sql.UAENorth or AzureCloud. They update automatically. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Azure hub-and-spoke organisation: Consider how “nsgs, asgs and service tags” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For nsgs, asgs and service tags, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For nsgs, asgs and service tags, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Azure creates system routes automatically: local VNet traffic, peered VNets, gateway-learned routes and a default route to the Internet. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Azure hub-and-spoke organisation: Consider how “routing, udrs and route server” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For routing, udrs and route server, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For routing, udrs and route server, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: VNet peering connects VNets in the same region or across regions (global peering) over Microsoft's backbone with low latency. It is non-transitive: two spokes peered to the same hub cannot talk to each other unle. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Azure hub-and-spoke organisation: Consider how “hub-and-spoke, virtual wan and virtual network manager” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For hub-and-spoke, virtual wan and virtual network manager, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For hub-and-spoke, virtual wan and virtual network manager, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Service endpoints: extend your VNet identity to the service over the Azure backbone; the service's firewall can then allow only your subnet. The service still uses its public IP. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Azure hub-and-spoke organisation: Consider how “private endpoints and private dns” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For private endpoints and private dns, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For private endpoints and private dns, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Azure Load Balancer (Standard SKU): regional L4, TCP/UDP, zone-redundant, internal or public. Also used for outbound rules. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Azure hub-and-spoke organisation: Consider how “load balancing and edge services” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For load balancing and edge services, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For load balancing and edge services, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: An ExpressRoute circuit has two connections for redundancy. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Azure hub-and-spoke organisation: Consider how “hybrid connectivity on azure” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For hybrid connectivity on azure, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For hybrid connectivity on azure, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: IP flow verify: is a specific packet to or from a VM allowed, and by which NSG rule?. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Azure hub-and-spoke organisation: Consider how “operating and troubleshooting azure networks” affects the situation: Several business units use separate spoke VNets connected to a central hub for inspection and shared DNS. NSGs, UDRs, Private Link and gateways influence every permitted flow. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For operating and troubleshooting azure networks, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For operating and troubleshooting azure networks, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m15": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: A Google Cloud VPC network is a global resource. Subnets are regional, and each has a primary IPv4 range and optional secondary ranges (used for GKE Pods and Services). VMs in any region of the same VPC c. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Global Google Cloud deployment: Consider how “the global vpc” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For the global vpc, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For the global vpc, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: All instances in the network. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Global Google Cloud deployment: Consider how “firewall rules and policies” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For firewall rules and policies, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For firewall rules and policies, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Shared VPC lets a host project own the VPC while service projects deploy VMs, GKE clusters and serverless connectors into its subnets. The network team keeps control of subnets, routes and firewalls; app team. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Global Google Cloud deployment: Consider how “shared vpc, peering and network connectivity center” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For shared vpc, peering and network connectivity center, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For shared vpc, peering and network connectivity center, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Cloud Router is a managed BGP speaker. It exchanges routes with your on-premises routers over HA VPN and Interconnect, and advertises your VPC subnets automatically (or custom ranges you choose). The VPC's dynamic. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Global Google Cloud deployment: Consider how “cloud router and cloud nat” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For cloud router and cloud nat, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For cloud router and cloud nat, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: PSC endpoints for Google APIs (an internal IP for all supported APIs). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Global Google Cloud deployment: Consider how “private google access and private service connect” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For private google access and private service connect, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For private google access and private service connect, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Application Load Balancers (L7, HTTP/HTTPS): global external (one anycast IP worldwide, routing users to the nearest healthy backend in any region), regional external, regional internal and cross-region internal. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Global Google Cloud deployment: Consider how “load balancing, cloud cdn and cloud armor” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For load balancing, cloud cdn and cloud armor, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For load balancing, cloud cdn and cloud armor, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: HA VPN: a gateway with two interfaces (two public IPs). With two tunnels to your peer devices and BGP via Cloud Router, it offers a 99.99% SLA. This is the recommended option. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Global Google Cloud deployment: Consider how “hybrid connectivity on google cloud” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For hybrid connectivity on google cloud, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For hybrid connectivity on google cloud, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Connectivity Tests: static analysis of a path between two endpoints (VMs, IPs, load balancers, Cloud SQL), showing which route or firewall rule allows or drops it, plus an optional live data-plane check. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Global Google Cloud deployment: Consider how “operating and troubleshooting google cloud networks” affects the situation: An organisation has users worldwide and regional workloads. A global VPC, regional subnets, firewall policy, load balancing and private service access support controlled connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For operating and troubleshooting google cloud networks, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For operating and troubleshooting google cloud networks, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m16": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Regional or AD-specific: regional subnets span all availability domains in the region (recommended); AD-specific subnets exist in one AD. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — OCI application in two fault domains: Consider how “vcns and subnets” affects the situation: An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For vcns and subnets, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For vcns and subnets, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Security lists apply to every VNIC in a subnet. A subnet can have up to five. Good for broad rules that apply to the whole subnet. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — OCI application in two fault domains: Consider how “security lists and nsgs” affects the situation: An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For security lists and nsgs, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For security lists and nsgs, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Internet gateway: two-way Internet access for resources with public IPs in public subnets. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — OCI application in two fault domains: Consider how “gateways” affects the situation: An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For gateways, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For gateways, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: VCN attachments (many VCNs in the same region, for hub-and-spoke). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — OCI application in two fault domains: Consider how “the drg as a hub” affects the situation: An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For the drg as a hub, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For the drg as a hub, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: OCI Load Balancer (flexible shape) is an L7 HTTP/HTTPS proxy that can also balance TCP. It supports path and host routing, TLS termination, session persistence and integration with OCI WAF. Bandwidth is set as a. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — OCI application in two fault domains: Consider how “load balancing, dns and edge security” affects the situation: An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For load balancing, dns and edge security, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For load balancing, dns and edge security, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Oracle partner: through a service provider, in bandwidths from 1 Gbps. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — OCI application in two fault domains: Consider how “hybrid and multi-cloud connectivity on oci” affects the situation: An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For hybrid and multi-cloud connectivity on oci, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For hybrid and multi-cloud connectivity on oci, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Network Path Analyzer: analyses route tables, security lists, NSGs and gateways between a source and destination and shows where traffic is allowed or blocked. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — OCI application in two fault domains: Consider how “operating and troubleshooting oci networks” affects the situation: An enterprise places workloads in an OCI VCN and connects it to a corporate data centre. Security rules, gateway routes and the DRG determine service exposure and return connectivity. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For operating and troubleshooting oci networks, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For operating and troubleshooting oci networks, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m17": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS Direct Connect: dedicated 1/10/100/400 Gbps ports or hosted connections via partners; virtual interfaces (private, transit, public); Direct Connect gateway for multi-region reach. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Bank connecting a data centre to cloud: Consider how “private links in all four clouds” affects the situation: A banking service must access on-premises systems from the cloud. The design combines private circuits or VPN, encrypted traffic, BGP routing and failover assumptions. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For private links in all four clouds, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For private links in all four clouds, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: VPN only: small sites, labs, or while waiting for a private link. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Bank connecting a data centre to cloud: Consider how “vpn as primary or backup” affects the situation: A banking service must access on-premises systems from the cloud. The design combines private circuits or VPN, encrypted traffic, BGP routing and failover assumptions. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For vpn as primary or backup, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For vpn as primary or backup, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: One connection, one device, one location: no redundancy. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Bank connecting a data centre to cloud: Consider how “designing for resilience” affects the situation: A banking service must access on-premises systems from the cloud. The design combines private circuits or VPN, encrypted traffic, BGP routing and failover assumptions. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For designing for resilience, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For designing for resilience, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS prefers the longest prefix, then Direct Connect over VPN, then honours AS-path length and local preference communities on Direct Connect. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Bank connecting a data centre to cloud: Consider how “steering traffic with bgp” affects the situation: A banking service must access on-premises systems from the cloud. The design combines private circuits or VPN, encrypted traffic, BGP routing and failover assumptions. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For steering traffic with bgp, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For steering traffic with bgp, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Three details cause many hybrid problems. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Bank connecting a data centre to cloud: Consider how “encryption, mtu and route limits” affects the situation: A banking service must access on-premises systems from the cloud. The design combines private circuits or VPN, encrypted traffic, BGP routing and failover assumptions. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For encryption, mtu and route limits, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For encryption, mtu and route limits, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Colocation: rent space in a carrier-neutral facility near the cloud regions. Place two routers there. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Bank connecting a data centre to cloud: Consider how “a complete hybrid design” affects the situation: A banking service must access on-premises systems from the cloud. The design combines private circuits or VPN, encrypted traffic, BGP routing and failover assumptions. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For a complete hybrid design, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For a complete hybrid design, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m18": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: In a multi-cloud estate, address overlaps are the most expensive mistake. Two networks with the same range cannot be routed to each other without NAT, which complicates everything that follows. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Company operating on two clouds: Consider how “ip address management (ipam)” affects the situation: A business chooses different clouds for applications and analytics. Nonoverlapping addressing, identity boundaries, private connectivity, DNS and operational ownership become important. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For ip address management (ipam), consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For ip address management (ipam), consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: On-premises as the hub: every cloud connects back to the data centre. Simple, but cloud-to-cloud traffic hairpins through the data centre. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Company operating on two clouds: Consider how “topologies” affects the situation: A business chooses different clouds for applications and analytics. Nonoverlapping addressing, identity boundaries, private connectivity, DNS and operational ownership become important. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For topologies, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For topologies, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: VPN between cloud gateways (for example, AWS Site-to-Site VPN to Azure VPN Gateway, or Google HA VPN to AWS). Set up in an hour, encrypted, but limited per tunnel and crosses the Internet. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Company operating on two clouds: Consider how “connecting the clouds” affects the situation: A business chooses different clouds for applications and analytics. Nonoverlapping addressing, identity boundaries, private connectivity, DNS and operational ownership become important. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For connecting the clouds, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For connecting the clouds, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS: Route 53 Resolver inbound and outbound endpoints with forwarding rules. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Company operating on two clouds: Consider how “dns across clouds” affects the situation: A business chooses different clouds for applications and analytics. Nonoverlapping addressing, identity boundaries, private connectivity, DNS and operational ownership become important. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For dns across clouds, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For dns across clouds, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Best-of-breed services: Oracle Database on OCI, analytics on Google Cloud, Microsoft workloads on Azure. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Company operating on two clouds: Consider how “choosing where workloads live” affects the situation: A business chooses different clouds for applications and analytics. Nonoverlapping addressing, identity boundaries, private connectivity, DNS and operational ownership become important. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For choosing where workloads live, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For choosing where workloads live, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Infrastructure as code: Terraform with all four providers (covered in Module 20), one repository per layer (foundation, hubs, spokes), reviewed changes, and automated policy checks. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Company operating on two clouds: Consider how “running multi-cloud as code” affects the situation: A business chooses different clouds for applications and analytics. Nonoverlapping addressing, identity boundaries, private connectivity, DNS and operational ownership become important. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For running multi-cloud as code, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For running multi-cloud as code, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m19": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Edge: DDoS protection, CDN and WAF in front of public endpoints. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Public API with private data: Consider how “defense in depth” affects the situation: A public API requires exposure at its front door but should not expose internal databases or administrative ports. WAF, layered firewall policies, segmentation, logging and private endpoints control risk. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For defense in depth, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For defense in depth, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS: AWS Shield Standard (automatic, free) and Advanced (paid, with the Shield Response Team and cost protection); AWS WAF on CloudFront, ALB, API Gateway and others. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Public API with private data: Consider how “edge protection” affects the situation: A public API requires exposure at its front door but should not expose internal databases or administrative ports. WAF, layered firewall policies, segmentation, logging and private endpoints control risk. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For edge protection, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For edge protection, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS Network Firewall: stateful rules, Suricata-compatible IPS signatures, domain allow and deny lists, TLS inspection. Deployed in dedicated subnets, often in an inspection VPC behind Transit Gateway. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Public API with private data: Consider how “central inspection with managed firewalls” affects the situation: A public API requires exposure at its front door but should not expose internal databases or administrative ports. WAF, layered firewall policies, segmentation, logging and private endpoints control risk. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For central inspection with managed firewalls, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For central inspection with managed firewalls, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: No public IPs on VMs, databases or containers. Enforce it with policy (AWS SCPs, Azure Policy, Google organization policy, OCI security zones). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Public API with private data: Consider how “private by default” affects the situation: A public API requires exposure at its front door but should not expose internal databases or administrative ports. WAF, layered firewall policies, segmentation, logging and private endpoints control risk. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For private by default, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For private by default, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Flow logs: AWS VPC Flow Logs, Azure VNet flow logs, Google Cloud VPC Flow Logs, OCI VCN flow logs. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Public API with private data: Consider how “flow logs and detection” affects the situation: A public API requires exposure at its front door but should not expose internal databases or administrative ports. WAF, layered firewall policies, segmentation, logging and private endpoints control risk. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For flow logs and detection, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For flow logs and detection, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: No resource except load balancers, NAT and VPN gateways has a public IP. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Public API with private data: Consider how “security checklist for a cloud network” affects the situation: A public API requires exposure at its front door but should not expose internal databases or administrative ports. WAF, layered firewall policies, segmentation, logging and private endpoints control risk. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For security checklist for a cloud network, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For security checklist for a cloud network, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m20": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Review: every change is a pull request someone checks before it is applied. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Production changes across regions: Consider how “why infrastructure as code” affects the situation: A network team must reproduce secure configurations consistently. Versioned infrastructure definitions, code reviews, state management, drift detection and policy checks affect reliability. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For why infrastructure as code, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For why infrastructure as code, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Terraform (and its open-source fork OpenTofu) uses one language, HCL, for all four clouds through providers: hashicorp/aws, hashicorp/azurerm, hashicorp/google and oracle/oci. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Production changes across regions: Consider how “terraform across clouds” affects the situation: A network team must reproduce secure configurations consistently. Versioned infrastructure definitions, code reviews, state management, drift detection and policy checks affect reliability. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For terraform across clouds, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For terraform across clouds, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS CloudFormation (YAML/JSON templates) and the AWS CDK (write infrastructure in TypeScript, Python, Java and others, compiled to CloudFormation). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Production changes across regions: Consider how “native tools” affects the situation: A network team must reproduce secure configurations consistently. Versioned infrastructure definitions, code reviews, state management, drift detection and policy checks affect reliability. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For native tools, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For native tools, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Store state remotely with locking: an S3 bucket (with native S3 locking or DynamoDB), Azure Storage with blob leases, a Google Cloud Storage bucket, OCI Object Storage, HCP Terraform, or OCI Resource Manager. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Production changes across regions: Consider how “state and safety” affects the situation: A network team must reproduce secure configurations consistently. Versioned infrastructure definitions, code reviews, state management, drift detection and policy checks affect reliability. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For state and safety, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For state and safety, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Static analysis: Checkov, tfsec/Trivy or KICS scan Terraform for risky patterns (security group open to the world, missing flow logs, public storage). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Production changes across regions: Consider how “policy as code and ci/cd” affects the situation: A network team must reproduce secure configurations consistently. Versioned infrastructure definitions, code reviews, state management, drift detection and policy checks affect reliability. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For policy as code and ci/cd, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For policy as code and ci/cd, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Drift: someone changes a rule by hand. terraform plan shows the difference; either revert it by applying, or update the code to match. Scheduled plans can alert on drift. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Production changes across regions: Consider how “drift, imports and day-two operations” affects the situation: A network team must reproduce secure configurations consistently. Versioned infrastructure definitions, code reviews, state management, drift detection and policy checks affect reliability. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For drift, imports and day-two operations, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For drift, imports and day-two operations, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m21": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Every pod gets its own IP address. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Containers talking to databases: Consider how “the kubernetes network model” affects the situation: An application runs in pods across nodes and calls a private database. Pod networking, Services, ingress, DNS and network policy each solve a different part of reachability and access. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For the kubernetes network model, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For the kubernetes network model, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: ClusterIP (default): reachable only inside the cluster, for example orders.prod.svc.cluster.local. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Containers talking to databases: Consider how “services, ingress and gateway api” affects the situation: An application runs in pods across nodes and calls a private database. Pod networking, Services, ingress, DNS and network policy each solve a different part of reachability and access. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For services, ingress and gateway api, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For services, ingress and gateway api, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Amazon EKS: the Amazon VPC CNI gives each pod a real VPC IP from the node's subnet (secondary IPs or prefix delegation). Options: custom networking to place pods in separate subnets, and security groups for pods. Cluster. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Containers talking to databases: Consider how “managed clusters in each cloud” affects the situation: An application runs in pods across nodes and calls a private database. Pod networking, Services, ingress, DNS and network policy each solve a different part of reachability and access. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For managed clusters in each cloud, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For managed clusters in each cloud, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: EKS: use prefix delegation to fit more pods per node; give pods their own large subnets (custom networking) or a secondary CIDR such as 100.64.0.0/16 if the primary range is short. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Containers talking to databases: Consider how “ip planning for pods” affects the situation: An application runs in pods across nodes and calls a private database. Pod networking, Services, ingress, DNS and network policy each solve a different part of reachability and access. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For ip planning for pods, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For ip planning for pods, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: By default, every pod can talk to every other pod in the cluster, across namespaces. A NetworkPolicy restricts that, selecting pods by label and allowing specific ingress and egress. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Containers talking to databases: Consider how “network policies” affects the situation: An application runs in pods across nodes and calls a private database. Pod networking, Services, ingress, DNS and network policy each solve a different part of reachability and access. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For network policies, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For network policies, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: mTLS: every connection between services is encrypted and both sides authenticated with certificates issued by the mesh. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Containers talking to databases: Consider how “service mesh” affects the situation: An application runs in pods across nodes and calls a private database. Pod networking, Services, ingress, DNS and network policy each solve a different part of reachability and access. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For service mesh, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For service mesh, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ],
 "m22": [
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Define the problem precisely: what source, what destination, what port, since when, for whom? \"The app is down\" is not a problem statement; \"VMs in app-subnet can't reach the database on 5432 since 14:10\" is. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Intermittent failure during a migration: Consider how “a method for every outage” affects the situation: A service fails only for some clients following a network change. Comparing source, destination, routes, filters, DNS, logs and captured packets can distinguish symptoms from the actual cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For a method for every outage, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For a method for every outage, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS Reachability Analyzer: source and destination (instances, ENIs, gateways, endpoints); checks routes, SGs, NACLs, gateways and peering, and names the blocking component. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Intermittent failure during a migration: Consider how “built-in path analyzers” affects the situation: A service fails only for some clients following a network change. Comparing source, destination, routes, filters, DNS, logs and captured packets can distinguish symptoms from the actual cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For built-in path analyzers, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For built-in path analyzers, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: AWS Traffic Mirroring: copies traffic from an ENI to a monitoring target. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Intermittent failure during a migration: Consider how “packet-level visibility” affects the situation: A service fails only for some clients following a network change. Comparing source, destination, routes, filters, DNS, logs and captured packets can distinguish symptoms from the actual cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For packet-level visibility, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For packet-level visibility, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Connection timeout to a new VM: security group/NSG/firewall rule missing, or wrong route. Check the analyzer. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Intermittent failure during a migration: Consider how “common failure patterns” affects the situation: A service fails only for some clients following a network change. Comparing source, destination, routes, filters, DNS, logs and captured packets can distinguish symptoms from the actual cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For common failure patterns, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For common failure patterns, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: Egress: which flows leave the cloud, cross regions or cross zones? Can a CDN, caching or co-locating services reduce them?. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Intermittent failure during a migration: Consider how “cost and performance review” affects the situation: A service fails only for some clients following a network change. Comparing source, destination, routes, filters, DNS, logs and captured packets can distinguish symptoms from the actual cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For cost and performance review, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For cost and performance review, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  },
  {
   "sections": [
    [
     "Concept and context",
     "Build the mental model: An address plan for both clouds and an imaginary data centre, with no overlaps. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems."
    ],
    [
     "Enterprise scenario",
     "Scenario connection — Intermittent failure during a migration: Consider how “capstone brief” affects the situation: A service fails only for some clients following a network change. Comparing source, destination, routes, filters, DNS, logs and captured packets can distinguish symptoms from the actual cause. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed."
    ],
    [
     "Design reasoning",
     "Reasoning in a real design: For capstone brief, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture."
    ]
   ],
   "question": "Why does this concept matter in an end-to-end network or cloud design?",
   "answer": "Reasoning in a real design: For capstone brief, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.",
   "flow": [
    [
     "Input",
     "Identify the traffic, identity, packet or configuration entering this step."
    ],
    [
     "Decision",
     "The component applies protocol rules, policy or routing logic."
    ],
    [
     "Outcome",
     "Observe the result, including errors or impacts on downstream systems."
    ]
   ]
  }
 ]
};
