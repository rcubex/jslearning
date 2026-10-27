# Module 20: Infrastructure as Code

**Level:** 5 · **Lessons:** 6

## A real-world thread: Production changes across regions

A network team must reproduce secure configurations consistently. Versioned infrastructure definitions, code reviews, state management, drift detection and policy checks affect reliability.

This scenario is a running conceptual example. The lessons below explain the relevant technology and how to reason about its behavior; no practical labs are required.

## Lesson 1: Why infrastructure as code

Clicking through a console is fine for learning, but it fails for real networks: nobody can review the change, it cannot be repeated exactly in another region, and after a few months nobody knows why a rule exists.

**Infrastructure as code (IaC)** describes the desired network in text files kept in Git. Benefits:

- **Review**: every change is a pull request someone checks before it is applied
- **Repeatability**: the same code builds identical dev, test and prod networks, or a new region
- **History**: Git shows who changed which rule, when and why
- **Recovery**: if something is deleted, the code rebuilds it
- **Drift detection**: the tool reports when someone changed things by hand

> **Tip:** Treat the console as read-only for production networks. If a change isn't in code, it shouldn't exist.

**Build the mental model:** Review: every change is a pull request someone checks before it is applied. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Production changes across regions:** Consider how “why infrastructure as code” affects the situation: A network team must reproduce secure configurations consistently. Versioned infrastructure definitions, code reviews, state management, drift detection and policy checks affect reliability. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For why infrastructure as code, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain why infrastructure as code to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 2: Terraform across clouds

**Terraform** (and its open-source fork **OpenTofu**) uses one language, **HCL**, for all four clouds through **providers**: `hashicorp/aws`, `hashicorp/azurerm`, `hashicorp/google` and `oracle/oci`.

The workflow is always the same: `terraform init` (download providers), `terraform plan` (show the changes), `terraform apply` (make them), and `terraform destroy` (remove everything).

```text
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

**Build the mental model:** **Terraform** (and its open-source fork **OpenTofu**) uses one language, **HCL**, for all four clouds through **providers**: `hashicorp/aws`, `hashicorp/azurerm`, `hashicorp/google` and `oracle/oci`. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Production changes across regions:** Consider how “terraform across clouds” affects the situation: A network team must reproduce secure configurations consistently. Versioned infrastructure definitions, code reviews, state management, drift detection and policy checks affect reliability. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For terraform across clouds, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain terraform across clouds to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 3: Native tools

Each provider also has its own IaC option:

- **AWS CloudFormation** (YAML/JSON templates) and the **AWS CDK** (write infrastructure in TypeScript, Python, Java and others, compiled to CloudFormation).
- **Azure Bicep**: a concise language compiled to ARM templates, with excellent support for new Azure features on day one. **Azure Verified Modules** provide tested building blocks.
- **Google Cloud Infrastructure Manager**: runs Terraform as a managed service; Google also publishes Terraform blueprints (Cloud Foundation Fabric).
- **OCI Resource Manager**: runs Terraform as a managed service with stored state, drift detection and ready-made stacks.

```text
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

**Build the mental model:** AWS CloudFormation (YAML/JSON templates) and the AWS CDK (write infrastructure in TypeScript, Python, Java and others, compiled to CloudFormation). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Production changes across regions:** Consider how “native tools” affects the situation: A network team must reproduce secure configurations consistently. Versioned infrastructure definitions, code reviews, state management, drift detection and policy checks affect reliability. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For native tools, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain native tools to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 4: State and safety

Terraform records what it created in a **state file**. State is critical: lose it and Terraform no longer knows what it manages; corrupt it with two simultaneous runs and you get broken infrastructure.

Rules:

- Store state **remotely** with **locking**: an S3 bucket (with native S3 locking or DynamoDB), Azure Storage with blob leases, a Google Cloud Storage bucket, OCI Object Storage, HCP Terraform, or OCI Resource Manager.
- **Separate state per environment and layer** (prod-network, prod-apps, dev-network) so a mistake has a small blast radius.
- **Never commit secrets** or state files to Git; state can contain sensitive values.
- **Read every plan**. Watch especially for `destroy` and `forces replacement` on networks, gateways and subnets.
- Protect critical resources with `lifecycle { prevent_destroy = true }`.

```text
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

**Build the mental model:** Store state remotely with locking: an S3 bucket (with native S3 locking or DynamoDB), Azure Storage with blob leases, a Google Cloud Storage bucket, OCI Object Storage, HCP Terraform, or OCI Resource Manager. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Production changes across regions:** Consider how “state and safety” affects the situation: A network team must reproduce secure configurations consistently. Versioned infrastructure definitions, code reviews, state management, drift detection and policy checks affect reliability. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For state and safety, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain state and safety to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 5: Policy as code and CI/CD

Automate checks so that mistakes are caught before they reach the cloud.

- **Static analysis**: **Checkov**, **tfsec/Trivy** or **KICS** scan Terraform for risky patterns (security group open to the world, missing flow logs, public storage).
- **Custom policies**: **Open Policy Agent** with **Conftest**, or HashiCorp **Sentinel**, enforce your own rules on the plan output, such as "only approved CIDRs" or "no public IPs".
- **Pipeline**: on every pull request, run `terraform fmt -check`, `terraform validate`, `terraform plan` and the policy checks, and post the plan to the pull request. After approval, apply from the pipeline, never from a laptop.

```text
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

**Build the mental model:** Static analysis: Checkov, tfsec/Trivy or KICS scan Terraform for risky patterns (security group open to the world, missing flow logs, public storage). This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Production changes across regions:** Consider how “policy as code and ci/cd” affects the situation: A network team must reproduce secure configurations consistently. Versioned infrastructure definitions, code reviews, state management, drift detection and policy checks affect reliability. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For policy as code and ci/cd, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain policy as code and ci/cd to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.

## Lesson 6: Drift, imports and day-two operations

Real environments change. Handle it deliberately:

- **Drift**: someone changes a rule by hand. `terraform plan` shows the difference; either revert it by applying, or update the code to match. Scheduled plans can alert on drift.
- **Importing existing resources**: `import` blocks (Terraform 1.5+) bring resources created by hand under management without recreating them.
- **Refactoring**: `moved` blocks rename resources or move them into modules without destroying them.
- **Upgrades**: pin provider versions, upgrade them deliberately, and read the changelogs.

```text
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

**Build the mental model:** Drift: someone changes a rule by hand. terraform plan shows the difference; either revert it by applying, or update the code to match. Scheduled plans can alert on drift. This is one part of a larger system, not a standalone feature. Separate the observable outcome (what a user or service sees) from the mechanism that produces it (rules, messages, state, routes or decisions). Ask where this function operates, which input it receives, and how its output influences the next component. This helps distinguish two technologies that sound similar but solve different problems.

**Scenario connection — Production changes across regions:** Consider how “drift, imports and day-two operations” affects the situation: A network team must reproduce secure configurations consistently. Versioned infrastructure definitions, code reviews, state management, drift detection and policy checks affect reliability. The key is to identify what this concept controls, what it depends on, and which other component would need to cooperate for the whole request to succeed.

**Reasoning in a real design:** For drift, imports and day-two operations, consider a normal case, an incorrect configuration and a component failure. In the normal case, the relevant components agree about addressing, trust and expected traffic. With an incorrect configuration, one component can reject or misdirect a request even when all others work. During a failure, observability and redundant paths matter, but redundancy does not automatically correct a bad policy or a missing return route. The exact behavior depends on the platform and architecture.

> **Tip:** **Check your understanding:** Explain drift, imports and day-two operations to a colleague without using vendor product names. Identify one benefit, one limitation, one common misunderstanding and how this topic connects to the preceding lesson. If you can explain those relationships, you understand more than a definition.
