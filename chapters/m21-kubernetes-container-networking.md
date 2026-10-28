# Module 21: Kubernetes & Container Networking

**Level:** 5 · **Lessons:** 6

## A real-world thread: Containers talking to databases

An application runs in pods across nodes and calls a private database. Pod networking, Services, ingress, DNS and network policy each solve a different part of reachability and access.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: The Kubernetes network model

Kubernetes defines simple rules for networking:

- Every **pod** gets its own IP address.
- Every pod can reach every other pod on any node **without NAT**.
- Agents on a node (such as the kubelet) can reach all pods on that node.

Kubernetes itself does not implement this. A **CNI plugin** (Container Network Interface) does. There are two broad approaches:

- **Overlay** (such as Flannel VXLAN, Calico in overlay mode, Azure CNI Overlay): pods get addresses from a private range that the cloud network doesn't know about; traffic between nodes is encapsulated or routed by the plugin. Saves cloud IP addresses.
- **VPC-native / routed** (AWS VPC CNI, Azure CNI with pod subnets, GKE VPC-native, OKE VCN-native pod networking): pods get real addresses from the cloud network. Pods are directly reachable and visible in flow logs, but they consume many IPs.

Modern CNIs such as **Cilium** use **eBPF** in the Linux kernel for fast routing, load balancing, network policy and visibility.

> **Tip:** The CNI choice is hard to change after the cluster is built. Decide it together with your IP plan.

**Build the mental model:** Every pod gets its own IP address. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Containers talking to databases:** Consider how “the kubernetes network model” affects the situation: An application runs in pods across nodes and calls a private database. Pod networking, Services, ingress, DNS and network policy each solve a different part of reachability and access. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For the kubernetes network model, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain the kubernetes network model to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: Services, Ingress and Gateway API

Pods come and go, so their IPs change. A **Service** gives a set of pods a stable name and virtual IP:

- **ClusterIP** (default): reachable only inside the cluster, for example `orders.prod.svc.cluster.local`.
- **NodePort**: opens a port (30000–32767) on every node.
- **LoadBalancer**: asks the cloud to create a load balancer (an L4 load balancer by default on all four clouds) that forwards to the pods.
- **Headless** (`clusterIP: None`): DNS returns the pod IPs directly, used by databases and stateful sets.

**kube-proxy** (or the CNI's eBPF replacement) programs each node so traffic to a Service IP reaches a healthy pod. **CoreDNS** answers DNS for Services and pods.

For HTTP, an **Ingress** or the newer **Gateway API** describes host and path routing, TLS and more, implemented by a controller: AWS Load Balancer Controller (creates ALBs), Application Gateway for Containers on Azure, GKE Gateway controller (Google Cloud load balancers), OCI native ingress controller, or in-cluster controllers like NGINX and Envoy-based gateways.

```text
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata: { name: shop, namespace: prod }
spec:
  parentRefs: [ { name: public-gw } ]
  hostnames: [ "shop.example.com" ]
  rules:
  - matches: [ { path: { type: PathPrefix, value: /api } } ]
    backendRefs: [ { name: orders, port: 8080 } ]
  - backendRefs: [ { name: web, port: 80 } ]
```

> **Tip:** Gateway API is the successor to Ingress, with clearer roles (platform team owns the Gateway, app teams own their routes). Prefer it for new clusters.

**Build the mental model:** ClusterIP (default): reachable only inside the cluster, for example orders.prod.svc.cluster.local. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Containers talking to databases:** Consider how “services, ingress and gateway api” affects the situation: An application runs in pods across nodes and calls a private database. Pod networking, Services, ingress, DNS and network policy each solve a different part of reachability and access. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For services, ingress and gateway api, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain services, ingress and gateway api to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Managed clusters in each cloud

Each managed Kubernetes service has its own networking defaults:

- **Amazon EKS**: the **Amazon VPC CNI** gives each pod a real VPC IP from the node's subnet (secondary IPs or prefix delegation). Options: custom networking to place pods in separate subnets, and **security groups for pods**. Cluster endpoints can be public, private or both.
- **Azure AKS**: **Azure CNI Overlay** (pods in a private overlay range; recommended default for most clusters), **Azure CNI** with pod subnets (pods get VNet IPs), or kubenet (legacy). **Azure CNI Powered by Cilium** adds eBPF dataplane and policy. Private clusters keep the API server off the Internet.
- **Google GKE**: **VPC-native** clusters use alias IPs from subnet **secondary ranges** for pods and Services. **GKE Dataplane V2** (based on Cilium/eBPF) provides network policy and logging. Private clusters, Autopilot mode, and multi-cluster Gateways.
- **Oracle OKE**: **VCN-native pod networking** (pods get VCN IPs, with NSGs applied to pods) or the **flannel overlay**. Virtual nodes offer a serverless option.

> **In the cloud:** Private clusters (API server reachable only from your network) are the secure default in all four. Reach them via a bastion, VPN or a CI runner inside the network.

**Build the mental model:** Amazon EKS: the Amazon VPC CNI gives each pod a real VPC IP from the node's subnet (secondary IPs or prefix delegation). Options: custom networking to place pods in separate subnets, and security groups for pods. Cluster. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Containers talking to databases:** Consider how “managed clusters in each cloud” affects the situation: An application runs in pods across nodes and calls a private database. Pod networking, Services, ingress, DNS and network policy each solve a different part of reachability and access. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For managed clusters in each cloud, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain managed clusters in each cloud to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: IP planning for pods

VPC-native pod networking is powerful but hungry for addresses. A rough sizing formula:

```text
nodes × max pods per node = pod IPs needed
50 nodes × 30 pods = 1,500 pod IPs  → at least a /21 (2,048), more for upgrades and scaling
Add surge capacity: rolling node upgrades temporarily add extra nodes.
```

Guidelines per provider:

- **EKS**: use prefix delegation to fit more pods per node; give pods their own large subnets (custom networking) or a secondary CIDR such as 100.64.0.0/16 if the primary range is short.
- **AKS**: Azure CNI Overlay avoids the problem entirely for most clusters; with pod subnets, size them for the maximum pod count.
- **GKE**: plan secondary ranges for pods (often a /14 to /16) and Services (often a /20); the max-pods-per-node setting decides how much range each node reserves.
- **OKE**: with VCN-native pods, size pod subnets for nodes × pods per node.

> **Watch out:** Running out of pod IPs makes new pods stay "Pending" with network errors and blocks node scaling and upgrades. Monitor subnet utilisation.

**Build the mental model:** EKS: use prefix delegation to fit more pods per node; give pods their own large subnets (custom networking) or a secondary CIDR such as 100.64.0.0/16 if the primary range is short. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Containers talking to databases:** Consider how “ip planning for pods” affects the situation: An application runs in pods across nodes and calls a private database. Pod networking, Services, ingress, DNS and network policy each solve a different part of reachability and access. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For ip planning for pods, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain ip planning for pods to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: Network policies

By default, every pod can talk to every other pod in the cluster, across namespaces. A **NetworkPolicy** restricts that, selecting pods by label and allowing specific ingress and egress.

Start with **default deny** in each namespace, then allow only the required flows:

```text
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: default-deny, namespace: prod }
spec:
  podSelector: {}
  policyTypes: [ Ingress, Egress ]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: backend-from-frontend, namespace: prod }
spec:
  podSelector: { matchLabels: { app: backend } }
  ingress:
  - from: [ { podSelector: { matchLabels: { app: frontend } } } ]
    ports: [ { protocol: TCP, port: 8080 } ]
```

Remember that a default-deny egress policy also blocks DNS, so add a rule allowing UDP/TCP 53 to CoreDNS.

NetworkPolicies only work if the CNI enforces them: Calico, Cilium, GKE Dataplane V2, Azure Network Policy Manager or Cilium on AKS, the VPC CNI's network policy feature on EKS, and Calico on OKE.

> **Tip:** Cilium and Calico also offer richer policies (DNS/FQDN-based egress rules, cluster-wide policies, L7 rules) beyond the standard NetworkPolicy API.

**Build the mental model:** By default, every pod can talk to every other pod in the cluster, across namespaces. A **NetworkPolicy** restricts that, selecting pods by label and allowing specific ingress and egress. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Containers talking to databases:** Consider how “network policies” affects the situation: An application runs in pods across nodes and calls a private database. Pod networking, Services, ingress, DNS and network policy each solve a different part of reachability and access. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For network policies, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain network policies to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: Service mesh

A **service mesh** adds a layer for service-to-service traffic without changing application code:

- **mTLS**: every connection between services is encrypted and both sides authenticated with certificates issued by the mesh.
- **Traffic management**: retries, timeouts, circuit breaking, canary releases (send 5% of traffic to a new version).
- **Observability**: request-level metrics and traces for every service call.
- **Authorization policies**: "only the orders service may call payments, and only POST /charge".

Popular meshes are **Istio** (including its sidecar-less **ambient mode**), **Linkerd** and **Cilium Service Mesh**. Managed options include **Istio-based service mesh add-on for AKS** and **Cloud Service Mesh** on Google Cloud.

> **Tip:** A mesh adds real operational complexity. Adopt one when you need mTLS everywhere or advanced traffic control across many services, not by default.

**Build the mental model:** mTLS: every connection between services is encrypted and both sides authenticated with certificates issued by the mesh. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Containers talking to databases:** Consider how “service mesh” affects the situation: An application runs in pods across nodes and calls a private database. Pod networking, Services, ingress, DNS and network policy each solve a different part of reachability and access. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For service mesh, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain service mesh to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
