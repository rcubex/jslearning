# Module 29: Kubernetes & Container Networking

**Level:** 5 · **Lessons:** 7 · **Questions:** 6

_Plan and secure pod networking on EKS, AKS, GKE and OKE._

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

## Lesson 2: Services, Ingress and Gateway API

Pods come and go, so their IPs change. A **Service** gives a set of pods a stable name and virtual IP:

- **ClusterIP** (default): reachable only inside the cluster, for example `orders.prod.svc.cluster.local`.
- **NodePort**: opens a port (30000–32767) on every node.
- **LoadBalancer**: asks the cloud to create a load balancer (an L4 load balancer by default on all four clouds) that forwards to the pods.
- **Headless** (`clusterIP: None`): DNS returns the pod IPs directly, used by databases and stateful sets.

**kube-proxy** (or the CNI's eBPF replacement) programs each node so traffic to a Service IP reaches a healthy pod. **CoreDNS** answers DNS for Services and pods.

For HTTP, an **Ingress** or the newer **Gateway API** describes host and path routing, TLS and more, implemented by a controller: AWS Load Balancer Controller (creates ALBs), Application Gateway for Containers on Azure, GKE Gateway controller (Google Cloud load balancers), OCI native ingress controller, or in-cluster controllers like NGINX and Envoy-based gateways.

**A Gateway API route**

```
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

## Lesson 3: Managed clusters in each cloud

Each managed Kubernetes service has its own networking defaults:

- **Amazon EKS**: the **Amazon VPC CNI** gives each pod a real VPC IP from the node's subnet (secondary IPs or prefix delegation). Options: custom networking to place pods in separate subnets, and **security groups for pods**. Cluster endpoints can be public, private or both.
- **Azure AKS**: **Azure CNI Overlay** (pods in a private overlay range; recommended default for most clusters), **Azure CNI** with pod subnets (pods get VNet IPs), or kubenet (legacy). **Azure CNI Powered by Cilium** adds eBPF dataplane and policy. Private clusters keep the API server off the Internet.
- **Google GKE**: **VPC-native** clusters use alias IPs from subnet **secondary ranges** for pods and Services. **GKE Dataplane V2** (based on Cilium/eBPF) provides network policy and logging. Private clusters, Autopilot mode, and multi-cluster Gateways.
- **Oracle OKE**: **VCN-native pod networking** (pods get VCN IPs, with NSGs applied to pods) or the **flannel overlay**. Virtual nodes offer a serverless option.

> **In the cloud:** Private clusters (API server reachable only from your network) are the secure default in all four. Reach them via a bastion, VPN or a CI runner inside the network.

## Lesson 4: IP planning for pods

VPC-native pod networking is powerful but hungry for addresses. A rough sizing formula:

**Estimate addresses for VPC-native pods**

```
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

## Lesson 5: Network policies

By default, every pod can talk to every other pod in the cluster, across namespaces. A **NetworkPolicy** restricts that, selecting pods by label and allowing specific ingress and egress.

Start with **default deny** in each namespace, then allow only the required flows:

**Default deny, then allow frontend → backend on 8080**

```
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

## Lesson 6: Service mesh

A **service mesh** adds a layer for service-to-service traffic without changing application code:

- **mTLS**: every connection between services is encrypted and both sides authenticated with certificates issued by the mesh.
- **Traffic management**: retries, timeouts, circuit breaking, canary releases (send 5% of traffic to a new version).
- **Observability**: request-level metrics and traces for every service call.
- **Authorization policies**: "only the orders service may call payments, and only POST /charge".

Popular meshes are **Istio** (including its sidecar-less **ambient mode**), **Linkerd** and **Cilium Service Mesh**. Managed options include **Istio-based service mesh add-on for AKS** and **Cloud Service Mesh** on Google Cloud.

> **Tip:** A mesh adds real operational complexity. Adopt one when you need mTLS everywhere or advanced traffic control across many services, not by default.

## Lesson 7: Real-world scenario: a NetworkPolicy that broke everything

**Situation.** To improve security, a platform team applies a default-deny NetworkPolicy to the `prod` namespace, followed by allow rules for frontend → backend and backend → database. Within minutes, every service in `prod` fails health checks and stops resolving names.

**Investigation.**

1. Pods can't resolve any names: the default-deny **egress** policy blocked DNS traffic to CoreDNS in `kube-system`.
2. Readiness probes are failing on some nodes: the CNI in use evaluates probe traffic from the node against policies, and no rule allowed it.
3. The ingress controller in another namespace can't reach frontend pods: no rule allowed traffic from the `ingress` namespace.

**Fix.**

1. Add an egress rule allowing UDP and TCP 53 to CoreDNS pods (selected by namespace and label).
2. Allow ingress from the ingress controller's namespace to the frontend pods.
3. Allow health-check traffic where the CNI requires it (check your CNI's documentation).
4. Next time: apply policies first in a staging cluster, use the CNI's policy audit or visibility tools (Cilium Hubble, Calico flow logs) to see what would be blocked, then roll out.

**Lessons learned.** Default-deny is right, but it denies *everything*, including DNS, probes and ingress controllers. Map real flows before enforcing.

## Key takeaways

- Every pod gets an IP and can reach every other pod; a CNI plugin makes it happen.
- Services give pods stable addresses; Ingress or Gateway API handles HTTP routing.
- VPC-native pod networking consumes many cloud IPs; plan ranges early.
- Default-deny NetworkPolicies are essential, and only work with a policy-capable CNI.

## Checkpoint

**Q1. What enforces Kubernetes NetworkPolicy?**

A. kube-proxy
B. The CNI plugin  ✓
C. CoreDNS
D. etcd

_Without a policy-capable CNI, NetworkPolicies have no effect._

**Q2. Which GKE feature gives pods IPs from VPC secondary ranges?**

A. VPC-native (alias IPs)  ✓
B. Cloud NAT
C. Shared VPC
D. Autopilot

_VPC-native clusters allocate pod IPs from alias ranges._

**Q3. Which Service type is reachable only from inside the cluster?**

A. ClusterIP  ✓
B. NodePort
C. LoadBalancer
D. ExternalName

_ClusterIP is the default internal virtual IP._

**Q4. After applying a default-deny egress policy, pods can't resolve any names. Why?**

A. CoreDNS crashed
B. The policy also blocks DNS traffic to CoreDNS on port 53  ✓
C. The CNI doesn't support DNS
D. Services were deleted

_Default-deny egress blocks everything, including DNS; add an allow rule for port 53._

**Q5. Which AKS networking option avoids consuming VNet addresses for every pod?**

A. Azure CNI with pod subnets
B. Azure CNI Overlay  ✓
C. Host networking
D. Service endpoints

_In overlay mode, pods use a private range separate from the VNet._

**Q6. After a default-deny egress policy, pods can't resolve names. What must you allow?**

A. TCP 443 to the Internet
B. UDP and TCP 53 to the cluster DNS (CoreDNS)  ✓
C. ICMP
D. All traffic in kube-system

_Default-deny egress blocks DNS unless explicitly allowed._

## Official reading

- [Kubernetes: services and networking](https://kubernetes.io/docs/concepts/services-networking/)
- [Amazon EKS networking](https://docs.aws.amazon.com/eks/latest/best-practices/networking.html)
- [AKS networking concepts](https://learn.microsoft.com/en-us/azure/aks/concepts-network)
- [GKE networking overview](https://cloud.google.com/kubernetes-engine/docs/concepts/network-overview)
- [OKE pod networking](https://docs.oracle.com/en-us/iaas/Content/ContEng/Concepts/contengpodnetworking.htm)
