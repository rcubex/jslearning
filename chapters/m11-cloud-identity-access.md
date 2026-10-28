# Module 16: Cloud Identity & Access

**Level:** 3 · **Lessons:** 7 · **Questions:** 6

_Control who can change your networks in every cloud._

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

## Lesson 2: AWS IAM

AWS IAM has **users** (people or legacy apps), **groups** of users, and **roles**, identities without permanent credentials that can be *assumed* to get temporary credentials. Permissions are written in **JSON policies** that allow or deny actions on resources.

**An AWS policy allowing read-only access to VPC configuration**

```
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

## Lesson 3: Microsoft Entra ID and Azure RBAC

Azure identities live in **Microsoft Entra ID** (formerly Azure Active Directory): users, groups, and **service principals** for applications. Access to Azure resources is controlled by **Azure RBAC**: you assign a **role** to a **principal** at a **scope**.

Scopes form a hierarchy, and assignments inherit downwards: **management group → subscription → resource group → resource**. A Network Contributor assignment on a resource group applies to every network resource in it.

Built-in roles you will use: **Owner** (everything, including granting access), **Contributor** (everything except granting access), **Reader**, and **Network Contributor** (manage networks but not VMs or data).

For workloads, use **managed identities**: Azure creates and rotates the credentials automatically. A VM or function with a managed identity can call other Azure services with no secrets in code.

**Grant Network Contributor on one resource group (Azure CLI)**

```
az role assignment create \
  --assignee netops@contoso.com \
  --role "Network Contributor" \
  --scope /subscriptions/<sub-id>/resourceGroups/rg-network-prod
```

> **Tip:** Use **Privileged Identity Management (PIM)** so administrators activate high-privilege roles only when needed, for a limited time, with approval.

## Lesson 4: Google Cloud IAM

In Google Cloud, you grant **roles** to **principals** (Google accounts, groups, service accounts, or federated identities) on a **resource**. The resource hierarchy is **organization → folders → projects → resources**, and permissions granted higher up are inherited below.

Roles come in three kinds: **basic** (Owner, Editor, Viewer; too broad for production), **predefined** (such as `roles/compute.networkAdmin`, `roles/compute.securityAdmin`, `roles/compute.networkViewer`) and **custom**.

**Service accounts** represent workloads. Attach one to a VM or GKE workload and the code gets credentials automatically. Avoid downloading service account keys; use **Workload Identity Federation** for workloads outside Google Cloud.

**Grant network admin on a project (gcloud)**

```
gcloud projects add-iam-policy-binding my-net-project \
  --member="group:netops@example.com" \
  --role="roles/compute.networkAdmin"
```

> **In the cloud:** Google Cloud firewall rules can target VMs by **service account**, which is stronger than network tags, because changing a VM's service account requires IAM permission.

## Lesson 5: OCI IAM

OCI organises resources in **compartments** inside a **tenancy**. Compartments can be nested, and policies apply to a compartment and everything below it. Identities live in **identity domains**: users, groups and **dynamic groups** (which match instances or functions by rules, so workloads can call OCI APIs without keys).

OCI policies are written in readable sentences:

**Example OCI policies**

```
Allow group NetAdmins to manage virtual-network-family in compartment Network
Allow group AppTeam to use virtual-network-family in compartment Apps
Allow group AppTeam to manage instance-family in compartment Apps
Allow dynamic-group AppServers to read objects in compartment Data
```

The verbs go from weakest to strongest: **inspect** (list), **read**, **use** (work with existing resources, such as attaching a VNIC to a subnet), **manage** (everything including create and delete). `virtual-network-family` covers VCNs, subnets, gateways, route tables and security lists.

> **Tip:** A common OCI pattern: the network team *manages* the network in a shared compartment, and application teams get *use* permission so they can place instances in subnets without changing the network.

## Lesson 6: Separating network and application duties

In larger organisations, the network is a shared platform and should be protected from accidental changes by application teams. The same pattern exists in every cloud:

- **AWS**: a central network account owns VPCs and shares subnets to application accounts with **AWS Resource Access Manager (RAM)**. App teams launch resources into shared subnets but cannot change route tables or gateways.
- **Azure**: the hub VNet and firewall sit in a connectivity subscription owned by the platform team. App teams own spoke VNets but Azure Policy prevents risky changes (like adding public IPs).
- **Google Cloud**: **Shared VPC**: a host project owns the network; service projects attach to it. Granting `roles/compute.networkUser` on specific subnets lets app teams use them without managing them.
- **OCI**: the network in a dedicated compartment; app teams get `use virtual-network-family`.

> **Tip:** Combine this with guardrail policies (SCPs, Azure Policy, organization policies) such as "no public IPs on VMs" and "flow logs must stay enabled".

## Lesson 7: Real-world scenario: the leaked access key

**Situation.** A developer pushes code to a public GitHub repository with an AWS access key in a config file. Within 20 minutes, automated scanners find it and someone starts launching large GPU instances in several regions for crypto-mining. The key belonged to a user with broad permissions, including networking changes.

**Response.**

1. **Contain**: deactivate the access key immediately; AWS often detects public key leaks and applies a quarantine policy, but don't wait for that.
2. **Assess**: CloudTrail shows what the key did: instances launched, a security group opened to the world, a new IAM user created as a backdoor.
3. **Clean up**: terminate the instances, delete the backdoor user, revert the security group change, check every region.
4. **Prevent**: - Remove long-lived access keys: developers use single sign-on (IAM Identity Center) and short-lived credentials; CI pipelines use OIDC federation to assume roles. - SCPs deny launching instances in regions the company doesn't use and deny GPU instance types outside approved accounts. - Secret scanning on all repositories (pre-commit hooks and the Git platform's scanning). - Budget and anomaly alerts.

**Lessons learned.** Identity is the cloud's real perimeter. Long-lived keys with broad permissions are a liability; temporary credentials, least privilege and guardrails limit the damage of a single mistake.

## Key takeaways

- Identity is the real perimeter in the cloud; protect it with MFA and least privilege.
- Workloads should use roles, managed identities or service accounts, never stored keys.
- Permissions are inherited down the hierarchy; grant at the lowest level that works.
- Separate network administration from application administration.

## Checkpoint

**Q1. Which OCI construct groups resources for policy and isolation?**

A. Resource group
B. Compartment  ✓
C. Project
D. Account

_OCI policies are written against compartments._

**Q2. Which Azure built-in role manages networks but not VMs?**

A. Owner
B. Contributor
C. Network Contributor  ✓
D. Reader

_Network Contributor is scoped to networking resources._

**Q3. What is the recommended way for an AWS EC2 instance to get permissions to call AWS APIs?**

A. Store an access key in a config file
B. Use the root user's keys
C. Attach an IAM role through an instance profile  ✓
D. Use a shared IAM user

_Roles give temporary, automatically rotated credentials with no secrets on disk._

**Q4. In Google Cloud, how can application teams deploy into a centrally managed network?**

A. VPC peering
B. Shared VPC with the network user role on chosen subnets  ✓
C. Giving them Owner on the host project
D. Copying the network into each project

_Shared VPC lets service projects use subnets of a host project without managing it._

**Q5. In AWS, if one policy allows an action and another explicitly denies it, what happens?**

A. The allow wins
B. The explicit deny wins  ✓
C. The most recent policy wins
D. It depends on the region

_An explicit Deny always overrides any Allow._

**Q6. What is the best long-term fix for leaked long-lived access keys?**

A. Rotate keys monthly
B. Remove long-lived keys in favour of SSO and short-lived role credentials, plus guardrails  ✓
C. Use longer passwords
D. Store keys in a private repository

_Short-lived credentials and least privilege remove the leaked-key risk at its source._

## Official reading

- [AWS IAM best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [Azure RBAC overview](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview)
- [Google Cloud IAM overview](https://cloud.google.com/iam/docs/overview)
- [OCI IAM policies](https://docs.oracle.com/en-us/iaas/Content/Identity/Concepts/policygetstarted.htm)
