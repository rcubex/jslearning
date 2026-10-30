# Module 28: Infrastructure as Code

**Level:** 5 · **Lessons:** 7 · **Questions:** 6

_Define every network in reviewable, repeatable code._

## Lesson 1: Why infrastructure as code

Clicking through a console is fine for learning, but it fails for real networks: nobody can review the change, it cannot be repeated exactly in another region, and after a few months nobody knows why a rule exists.

**Infrastructure as code (IaC)** describes the desired network in text files kept in Git. Benefits:

- **Review**: every change is a pull request someone checks before it is applied
- **Repeatability**: the same code builds identical dev, test and prod networks, or a new region
- **History**: Git shows who changed which rule, when and why
- **Recovery**: if something is deleted, the code rebuilds it
- **Drift detection**: the tool reports when someone changed things by hand

> **Tip:** Treat the console as read-only for production networks. If a change isn't in code, it shouldn't exist.

## Lesson 2: Terraform across clouds

**Terraform** (and its open-source fork **OpenTofu**) uses one language, **HCL**, for all four clouds through **providers**: `hashicorp/aws`, `hashicorp/azurerm`, `hashicorp/google` and `oracle/oci`.

The workflow is always the same: `terraform init` (download providers), `terraform plan` (show the changes), `terraform apply` (make them), and `terraform destroy` (remove everything).

**A minimal AWS VPC with Terraform**

```
terraform {
  required_providers { aws = { source = "hashicorp/aws", version = "~> 5.0" } }
}
provider "aws" { region = "me-central-1" }

resource "aws_vpc" "main" {
  cidr_block           = "10.32.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "vpc-prod" }
}

resource "aws_subnet" "app_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.32.16.0/20"
  availability_zone = "me-central-1a"
  tags = { Name = "app-a" }
}
```

Key concepts: **resources** (things to create), **data sources** (read existing things), **variables** and **outputs**, and **modules** (reusable packages, such as "a standard three-tier network"). Use well-maintained community modules (for example `terraform-aws-modules/vpc/aws`) or write your own organisation-standard modules.

> **Tip:** Build one module per cloud with the same inputs (name, CIDR, zones, tiers). Teams then request a network the same way regardless of provider.

## Lesson 3: Native tools

Each provider also has its own IaC option:

- **AWS CloudFormation** (YAML/JSON templates) and the **AWS CDK** (write infrastructure in TypeScript, Python, Java and others, compiled to CloudFormation).
- **Azure Bicep**: a concise language compiled to ARM templates, with excellent support for new Azure features on day one. **Azure Verified Modules** provide tested building blocks.
- **Google Cloud Infrastructure Manager**: runs Terraform as a managed service; Google also publishes Terraform blueprints (Cloud Foundation Fabric).
- **OCI Resource Manager**: runs Terraform as a managed service with stored state, drift detection and ready-made stacks.

**The same VNet in Bicep**

```
resource vnet 'Microsoft.Network/virtualNetworks@2023-09-01' = {
  name: 'vnet-prod-uaen'
  location: 'uaenorth'
  properties: {
    addressSpace: { addressPrefixes: [ '10.48.0.0/16' ] }
    subnets: [ { name: 'snet-app', properties: { addressPrefix: '10.48.1.0/24' } } ]
  }
}
```

> **Tip:** Use Terraform when you span several clouds; native tools are a good choice if you are committed to one provider and want the newest features immediately.

## Lesson 4: State and safety

Terraform records what it created in a **state file**. State is critical: lose it and Terraform no longer knows what it manages; corrupt it with two simultaneous runs and you get broken infrastructure.

Rules:

- Store state **remotely** with **locking**: an S3 bucket (with native S3 locking or DynamoDB), Azure Storage with blob leases, a Google Cloud Storage bucket, OCI Object Storage, HCP Terraform, or OCI Resource Manager.
- **Separate state per environment and layer** (prod-network, prod-apps, dev-network) so a mistake has a small blast radius.
- **Never commit secrets** or state files to Git; state can contain sensitive values.
- **Read every plan**. Watch especially for `destroy` and `forces replacement` on networks, gateways and subnets.
- Protect critical resources with `lifecycle { prevent_destroy = true }`.

**Remote state in Azure Storage**

```
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-tfstate"
    storage_account_name = "sttfstateprod01"
    container_name       = "tfstate"
    key                  = "prod/network.tfstate"
  }
}
```

> **Watch out:** Changing a subnet's CIDR or an immutable property usually *replaces* the subnet, deleting everything in it. The plan says "must be replaced"; stop and rethink when you see it on a network.

## Lesson 5: Policy as code and CI/CD

Automate checks so that mistakes are caught before they reach the cloud.

- **Static analysis**: **Checkov**, **tfsec/Trivy** or **KICS** scan Terraform for risky patterns (security group open to the world, missing flow logs, public storage).
- **Custom policies**: **Open Policy Agent** with **Conftest**, or HashiCorp **Sentinel**, enforce your own rules on the plan output, such as "only approved CIDRs" or "no public IPs".
- **Pipeline**: on every pull request, run `terraform fmt -check`, `terraform validate`, `terraform plan` and the policy checks, and post the plan to the pull request. After approval, apply from the pipeline, never from a laptop.

**A small Conftest (Rego) policy: no SSH from the Internet**

```
package main
deny[msg] {
  r := input.resource_changes[_]
  r.type == "aws_security_group_rule"
  r.change.after.from_port <= 22
  r.change.after.to_port >= 22
  r.change.after.cidr_blocks[_] == "0.0.0.0/0"
  msg := sprintf("%s opens SSH to the Internet", [r.address])
}
```

> **Tip:** Use the cloud's workload identity (OIDC federation from GitHub Actions or GitLab to AWS roles, Azure managed identities, Google Workload Identity Federation, OCI) so pipelines need no stored keys.

## Lesson 6: Drift, imports and day-two operations

Real environments change. Handle it deliberately:

- **Drift**: someone changes a rule by hand. `terraform plan` shows the difference; either revert it by applying, or update the code to match. Scheduled plans can alert on drift.
- **Importing existing resources**: `import` blocks (Terraform 1.5+) bring resources created by hand under management without recreating them.
- **Refactoring**: `moved` blocks rename resources or move them into modules without destroying them.
- **Upgrades**: pin provider versions, upgrade them deliberately, and read the changelogs.

**Bring an existing VPC under Terraform**

```
import {
  to = aws_vpc.legacy
  id = "vpc-0abc123def4567890"
}
resource "aws_vpc" "legacy" {
  cidr_block = "10.9.0.0/16"
}
# terraform plan -generate-config-out=generated.tf can draft the resource block for you
```

> **Tip:** Start small: put one non-critical network under Terraform, practise plan/apply/import, then expand.

## Lesson 7: Real-world scenario: the plan nobody read

**Situation.** An engineer changes a variable in a Terraform module to add a new subnet. The pipeline shows the plan, a reviewer approves after glancing at "Plan: 2 to add, 1 to change, 3 to destroy", and it's applied. Production loses its NAT gateway and route tables; outbound traffic fails for 25 minutes.

**Investigation.** The variable change altered the **index** of subnets in a `count`-based list. Terraform therefore planned to destroy and recreate the subnets after the new one in the list, together with their route table associations and the NAT gateway inside one of them. The plan said so, but nobody read the destroy lines.

**Fix and prevention.**

1. Restore from the previous state by reverting the change and applying (resources recreated with new IDs).
2. Refactor the module to use `for_each` with stable keys (subnet names) instead of `count` indexes, using `moved` blocks to migrate state without recreation.
3. Add `prevent_destroy` to critical network resources.
4. Add a policy check that **fails the pipeline** if a plan destroys or replaces network resources in production without an explicit override label.
5. Post a summary of destroyed resources prominently in the pull request.

**Lessons learned.** Terraform tells you exactly what it will do; the risk is people not reading it. Use stable keys, protect critical resources, and let automation block destructive changes.

## Key takeaways

- Networks built in code are reviewable, repeatable and recoverable.
- Terraform's plan shows exactly what will change; always read it.
- Keep state remote, locked and separated per environment.
- Check every change automatically with policy as code before it reaches production.

## Checkpoint

**Q1. Which command shows changes without applying them?**

A. terraform init
B. terraform plan  ✓
C. terraform apply
D. terraform fmt

_plan previews; apply executes._

**Q2. Which OCI service runs Terraform for you?**

A. Resource Manager  ✓
B. Cloud Shell
C. DevOps
D. Bastion

_OCI Resource Manager is managed Terraform._

**Q3. Why must Terraform state be stored remotely with locking?**

A. To make plans faster
B. So team members share one source of truth and two runs can't corrupt it at once  ✓
C. Because providers require it
D. To encrypt the code

_Locking prevents concurrent applies; remote storage gives everyone the same state._

**Q4. A plan shows a production subnet "must be replaced". What should you do?**

A. Apply quickly before anyone notices
B. Stop and review: replacement deletes the subnet and everything in it  ✓
C. Ignore it; subnets are recreated without impact
D. Run terraform fmt

_Replacing network resources is destructive; change the approach or plan a migration._

**Q5. Which Terraform feature brings an existing, hand-made resource under management?**

A. moved block
B. import block  ✓
C. output block
D. backend block

_import blocks attach existing resources to Terraform state without recreating them._

**Q6. Why did adding a subnet to a count-based list destroy existing subnets?**

A. Terraform has a bug
B. Resources are identified by list index, so inserting an item shifts indexes and forces replacement  ✓
C. The provider version changed
D. State was stored locally

_for_each with stable keys avoids index-based replacement._

## Official reading

- [Terraform documentation](https://developer.hashicorp.com/terraform/docs)
- [Terraform AWS provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Azure Bicep documentation](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview)
- [OCI Resource Manager](https://docs.oracle.com/en-us/iaas/Content/ResourceManager/Concepts/resourcemanager.htm)
- [Checkov](https://www.checkov.io/)
