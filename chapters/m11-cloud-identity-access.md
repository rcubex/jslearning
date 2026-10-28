# Module 11: Cloud Identity & Access

**Level:** 3 · **Lessons:** 6

## A real-world thread: Restricting cloud administration

Developers need to manage application instances, but only platform engineers should alter network boundaries. Separate identities, roles, permissions and audit records reduce accidental exposure.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: IAM principles

Every cloud request answers three questions:

- **Authentication**: who are you? (password plus MFA, a certificate, a federated login, a workload token)
- **Authorization**: what are you allowed to do? (policies and roles)
- **Audit**: what did you do? (AWS CloudTrail, Azure Activity Log, Google Cloud Audit Logs, OCI Audit)

Core practices are the same everywhere:

- **Least privilege**: give only the permissions needed for the task
- **MFA** for every human, especially administrators
- **No long-lived keys**: workloads get temporary credentials from roles or managed identities
- **Federation**: log in with your company identity (Microsoft Entra ID, Okta, Google Workspace) via single sign-on rather than separate cloud users
- **Separation of duties**: network admins, security admins and developers get different roles

> **Watch out:** The root/owner account of a cloud tenancy should have MFA, no access keys, and be used almost never. Lock it away.

**Build the mental model:** Authentication: who are you? (password plus MFA, a certificate, a federated login, a workload token). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Restricting cloud administration:** Consider how “iam principles” affects the situation: Developers need to manage application instances, but only platform engineers should alter network boundaries. Separate identities, roles, permissions and audit records reduce accidental exposure. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For iam principles, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain iam principles to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: AWS IAM

AWS IAM has **users** (people or legacy apps), **groups** of users, and **roles**, identities without permanent credentials that can be *assumed* to get temporary credentials. Permissions are written in **JSON policies** that allow or deny actions on resources.

```text
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["ec2:Describe*"],
    "Resource": "*"
  }]
}
```

EC2 instances, Lambda functions and containers get permissions through an attached role (an **instance profile** for EC2). Humans should sign in through **IAM Identity Center** with single sign-on. Across many accounts, **service control policies (SCPs)** in AWS Organizations set maximum permissions; for example, "nobody may delete VPC flow logs" or "only these regions may be used".

Useful managed policies for networking: **NetworkAdministrator** (job function) and **AmazonVPCReadOnlyAccess**.

> **Tip:** An explicit Deny always wins over any Allow in AWS. Use SCP denies for guardrails that must never be bypassed.

**Build the mental model:** AWS IAM has **users** (people or legacy apps), **groups** of users, and **roles**, identities without permanent credentials that can be *assumed* to get temporary credentials. Permissions are written in **JSON policies**. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Restricting cloud administration:** Consider how “aws iam” affects the situation: Developers need to manage application instances, but only platform engineers should alter network boundaries. Separate identities, roles, permissions and audit records reduce accidental exposure. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For aws iam, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain aws iam to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Microsoft Entra ID and Azure RBAC

Azure identities live in **Microsoft Entra ID** (formerly Azure Active Directory): users, groups, and **service principals** for applications. Access to Azure resources is controlled by **Azure RBAC**: you assign a **role** to a **principal** at a **scope**.

Scopes form a hierarchy, and assignments inherit downwards: **management group → subscription → resource group → resource**. A Network Contributor assignment on a resource group applies to every network resource in it.

Built-in roles you will use: **Owner** (everything, including granting access), **Contributor** (everything except granting access), **Reader**, and **Network Contributor** (manage networks but not VMs or data).

For workloads, use **managed identities**: Azure creates and rotates the credentials automatically. A VM or function with a managed identity can call other Azure services with no secrets in code.

```text
az role assignment create \
  --assignee netops@contoso.com \
  --role "Network Contributor" \
  --scope /subscriptions/<sub-id>/resourceGroups/rg-network-prod
```

> **Tip:** Use **Privileged Identity Management (PIM)** so administrators activate high-privilege roles only when needed, for a limited time, with approval.

**Build the mental model:** Azure identities live in **Microsoft Entra ID** (formerly Azure Active Directory): users, groups, and **service principals** for applications. Access to Azure resources is controlled by **Azure RBAC**: you assign a **rol. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Restricting cloud administration:** Consider how “microsoft entra id and azure rbac” affects the situation: Developers need to manage application instances, but only platform engineers should alter network boundaries. Separate identities, roles, permissions and audit records reduce accidental exposure. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For microsoft entra id and azure rbac, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain microsoft entra id and azure rbac to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: Google Cloud IAM

In Google Cloud, you grant **roles** to **principals** (Google accounts, groups, service accounts, or federated identities) on a **resource**. The resource hierarchy is **organization → folders → projects → resources**, and permissions granted higher up are inherited below.

Roles come in three kinds: **basic** (Owner, Editor, Viewer; too broad for production), **predefined** (such as `roles/compute.networkAdmin`, `roles/compute.securityAdmin`, `roles/compute.networkViewer`) and **custom**.

**Service accounts** represent workloads. Attach one to a VM or GKE workload and the code gets credentials automatically. Avoid downloading service account keys; use **Workload Identity Federation** for workloads outside Google Cloud.

```text
gcloud projects add-iam-policy-binding my-net-project \
  --member="group:netops@example.com" \
  --role="roles/compute.networkAdmin"
```

> **In the cloud:** Google Cloud firewall rules can target VMs by **service account**, which is stronger than network tags, because changing a VM's service account requires IAM permission.

**Build the mental model:** In Google Cloud, you grant **roles** to **principals** (Google accounts, groups, service accounts, or federated identities) on a **resource**. The resource hierarchy is **organization → folders → projects → resources**,. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Restricting cloud administration:** Consider how “google cloud iam” affects the situation: Developers need to manage application instances, but only platform engineers should alter network boundaries. Separate identities, roles, permissions and audit records reduce accidental exposure. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For google cloud iam, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain google cloud iam to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: OCI IAM

OCI organises resources in **compartments** inside a **tenancy**. Compartments can be nested, and policies apply to a compartment and everything below it. Identities live in **identity domains**: users, groups and **dynamic groups** (which match instances or functions by rules, so workloads can call OCI APIs without keys).

OCI policies are written in readable sentences:

```text
Allow group NetAdmins to manage virtual-network-family in compartment Network
Allow group AppTeam to use virtual-network-family in compartment Apps
Allow group AppTeam to manage instance-family in compartment Apps
Allow dynamic-group AppServers to read objects in compartment Data
```

The verbs go from weakest to strongest: **inspect** (list), **read**, **use** (work with existing resources, such as attaching a VNIC to a subnet), **manage** (everything including create and delete). `virtual-network-family` covers VCNs, subnets, gateways, route tables and security lists.

> **Tip:** A common OCI pattern: the network team *manages* the network in a shared compartment, and application teams get *use* permission so they can place instances in subnets without changing the network.

**Build the mental model:** OCI organises resources in **compartments** inside a **tenancy**. Compartments can be nested, and policies apply to a compartment and everything below it. Identities live in **identity domains**: users, groups and **dyna. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Restricting cloud administration:** Consider how “oci iam” affects the situation: Developers need to manage application instances, but only platform engineers should alter network boundaries. Separate identities, roles, permissions and audit records reduce accidental exposure. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For oci iam, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain oci iam to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: Separating network and application duties

In larger organisations, the network is a shared platform and should be protected from accidental changes by application teams. The same pattern exists in every cloud:

- **AWS**: a central network account owns VPCs and shares subnets to application accounts with **AWS Resource Access Manager (RAM)**. App teams launch resources into shared subnets but cannot change route tables or gateways.
- **Azure**: the hub VNet and firewall sit in a connectivity subscription owned by the platform team. App teams own spoke VNets but Azure Policy prevents risky changes (like adding public IPs).
- **Google Cloud**: **Shared VPC**: a host project owns the network; service projects attach to it. Granting `roles/compute.networkUser` on specific subnets lets app teams use them without managing them.
- **OCI**: the network in a dedicated compartment; app teams get `use virtual-network-family`.

> **Tip:** Combine this with guardrail policies (SCPs, Azure Policy, organization policies) such as "no public IPs on VMs" and "flow logs must stay enabled".

**Build the mental model:** AWS: a central network account owns VPCs and shares subnets to application accounts with AWS Resource Access Manager (RAM). App teams launch resources into shared subnets but cannot change route tables or gateways. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Restricting cloud administration:** Consider how “separating network and application duties” affects the situation: Developers need to manage application instances, but only platform engineers should alter network boundaries. Separate identities, roles, permissions and audit records reduce accidental exposure. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For separating network and application duties, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain separating network and application duties to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
