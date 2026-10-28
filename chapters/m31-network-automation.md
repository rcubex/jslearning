# Module 31: Network Automation

**Level:** 5 · **Lessons:** 7 · **Questions:** 5

_Automate cloud and network tasks safely with APIs, Python, Ansible and event-driven workflows._

## Lesson 1: Why automate networks

Cloud networks change constantly: new environments, new rules, new peers. Doing this by hand is slow, error-prone and impossible to audit at scale. Automation brings:

- **Consistency**: the same change applied the same way everywhere.
- **Speed**: minutes instead of tickets waiting days.
- **Safety**: changes are reviewed, tested and reversible.
- **Visibility**: scripts can inventory and check thousands of resources in seconds.

Different jobs need different tools:

- **Declarative desired state** (what the network should look like): Terraform, Bicep, CloudFormation (Module 20).
- **Queries, reports and one-off bulk changes**: Python with the cloud SDKs, or the CLIs.
- **Configuring network devices and servers**: Ansible.
- **Reacting to events** (someone opened SSH to the world): event-driven functions.

> **Tip:** Start with read-only automation: inventories and compliance reports. They're useful on day one and carry no risk.

## Lesson 2: APIs and SDKs

Every cloud action, including clicks in the console, is an **API call** over HTTPS, authenticated and logged. **SDKs** wrap these APIs in your programming language: **boto3** (AWS), the **Azure SDK for Python** (`azure-identity`, `azure-mgmt-network`), **Google Cloud client libraries** (`google-cloud-compute`), and the **OCI Python SDK** (`oci`).

Four things every script must handle:

- **Authentication**: use the environment's identity (instance roles, managed identities, workload identity, instance principals), never hard-coded keys.
- **Pagination**: list calls return results in pages; read them all.
- **Rate limits / throttling**: back off and retry on throttling errors (SDKs often retry automatically, but large loops can still be throttled).
- **Regions and scopes**: resources are per region, per subscription, per project or per compartment; loop over all of them.

**Find security groups that allow SSH from anywhere, in every AWS region (boto3)**

```
import boto3
ec2 = boto3.client("ec2", region_name="us-east-1")
regions = [r["RegionName"] for r in ec2.describe_regions()["Regions"]]
for region in regions:
    client = boto3.client("ec2", region_name=region)
    for page in client.get_paginator("describe_security_groups").paginate():
        for sg in page["SecurityGroups"]:
            for rule in sg["IpPermissions"]:
                open_world = any(r.get("CidrIp") == "0.0.0.0/0" for r in rule.get("IpRanges", []))
                port_from, port_to = rule.get("FromPort", 0), rule.get("ToPort", 65535)
                if open_world and port_from <= 22 <= port_to:
                    print(region, sg["GroupId"], sg["GroupName"])
```

> **Watch out:** A rule with protocol "-1" (all traffic) has no FromPort/ToPort but still opens SSH. Good scripts handle these edge cases; that's why the example defaults to 0–65535.

## Lesson 3: The same task in Azure, Google Cloud and OCI

The pattern is identical in each cloud: authenticate, list, filter, report.

**Azure: NSG rules allowing inbound 3389 from Internet**

```
from azure.identity import DefaultAzureCredential
from azure.mgmt.network import NetworkManagementClient
net = NetworkManagementClient(DefaultAzureCredential(), "<subscription-id>")
for nsg in net.network_security_groups.list_all():
    for r in nsg.security_rules or []:
        src = (r.source_address_prefix or "").lower()
        if r.direction == "Inbound" and r.access == "Allow" and src in ("*", "internet", "0.0.0.0/0") \
           and (r.destination_port_range in ("3389", "*")):
            print(nsg.name, r.name, r.priority)
```

**Google Cloud: firewall rules open to 0.0.0.0/0**

```
from google.cloud import compute_v1
for fw in compute_v1.FirewallsClient().list(project="my-project"):
    if fw.direction == "INGRESS" and "0.0.0.0/0" in fw.source_ranges and not fw.disabled:
        print(fw.name, [(a.I_p_protocol, list(a.ports)) for a in fw.allowed])
```

**OCI: security list rules open to 0.0.0.0/0 in a compartment**

```
import oci
cfg = oci.config.from_file()
vcn = oci.core.VirtualNetworkClient(cfg)
lists = oci.pagination.list_call_get_all_results(vcn.list_security_lists, compartment_id="<ocid>").data
for sl in lists:
    for r in sl.ingress_security_rules:
        if r.source == "0.0.0.0/0":
            print(sl.display_name, r.protocol, r.tcp_options)
```

> **Tip:** Run these reports on a schedule and send the output to a channel or ticket queue. Compliance becomes continuous instead of yearly.

## Lesson 4: Ansible for networks and clouds

**Ansible** runs **playbooks** (YAML lists of tasks) against an **inventory** of hosts, over SSH or APIs, with no agent to install. It's popular for configuring routers, switches and firewalls (collections exist for Cisco, Juniper, Arista, Palo Alto, Fortinet and others) and for servers, and it has collections for all four clouds (`amazon.aws`, `azure.azcollection`, `google.cloud`, `oracle.oci`).

Ansible modules are **idempotent**: they describe the desired state, so running a playbook twice makes no extra changes.

**Push a standard NTP and SNMP config to all branch routers**

```
- name: Baseline branch routers
  hosts: branch_routers
  gather_facts: false
  tasks:
    - name: NTP servers
      cisco.ios.ios_ntp_global:
        config:
          servers:
            - server: 10.100.0.10
            - server: 10.100.0.11
        state: merged
    - name: Save configuration if changed
      cisco.ios.ios_config:
        save_when: changed
```

Use `--check --diff` to preview changes, and keep playbooks in Git with the same review process as Terraform.

> **Tip:** A good split: Terraform builds cloud networks; Ansible configures the devices and appliances at the edges (on-premises routers, firewall VMs, SD-WAN boxes).

## Lesson 5: Event-driven remediation

Some problems need fixing in seconds, not at the next scheduled scan. Every cloud can trigger code from change events:

- **AWS**: CloudTrail events → **Amazon EventBridge** rule → **Lambda** (or AWS Config rules with automatic remediation via Systems Manager).
- **Azure**: Activity Log / resource events → **Event Grid** → **Azure Functions** or Logic Apps; **Azure Policy** with deny or modify effects prevents many issues upfront.
- **Google Cloud**: Cloud Audit Logs → **Eventarc** → **Cloud Run** functions; organization policies prevent many issues upfront.
- **OCI**: **Events** service → **Functions** or Notifications; **Cloud Guard** responders can fix problems automatically.

**EventBridge rule pattern: someone added a security group ingress rule**

```
{
  "source": ["aws.ec2"],
  "detail-type": ["AWS API Call via CloudTrail"],
  "detail": { "eventName": ["AuthorizeSecurityGroupIngress"] }
}
→ Lambda checks for 0.0.0.0/0 on 22/3389, revokes it, and notifies the owner
```

> **Watch out:** Auto-remediation that fights your own Terraform creates loops (Terraform re-adds a rule, the function removes it). Prevent with policy where possible, and remediate only what should never exist.

## Lesson 6: Testing network changes

Network changes are risky because a small mistake can cut everyone off. Test before production:

- **Static checks** in CI: formatting, validation, policy as code (Module 20).
- **Plan review**: read the Terraform plan and the cloud's own analysis (for example, Reachability Analyzer or Connectivity Tests run in a pipeline against a staging environment).
- **Configuration analysis**: **Batfish** models router, switch and firewall configurations (and AWS network configuration) and answers questions like "can subnet A reach the database on 5432?" or "did this change break any existing flows?" without touching the network.
- **Staged rollout**: apply to dev, then one region or site, then everywhere.
- **Automatic rollback**: keep the previous version ready; for device changes, use commit-confirmed style features that roll back if you lose access.

> **Tip:** Write "intent tests" that encode what must always be true: "the Internet can never reach the data subnets", "prod can't reach dev". Run them after every change.

## Lesson 7: Real-world scenario: 4,000 firewall rules nobody understood

**Situation.** After years of manual changes, a company has about 4,000 security group and NSG rules across 60 AWS accounts and 25 Azure subscriptions. An audit finds 37 rules allowing SSH or RDP from the Internet, and nobody knows which rules are still used. Every change request takes a week because people are afraid to break something.

**Approach.**

1. **Inventory**: Python scripts using boto3 and the Azure SDK export every rule, its owner tags and attachments to a database, nightly.
2. **Usage data**: VPC Flow Logs and VNet flow logs show which rules actually match traffic over 90 days. About 30% of rules never matched anything.
3. **Fix the urgent risk**: the 37 Internet-facing admin rules are replaced with Session Manager and Azure Bastion within two weeks, and an SCP plus Azure Policy now deny new ones.
4. **Clean up**: unused rules are disabled in batches (with a quick rollback path), then deleted after 30 quiet days.
5. **Move to code**: remaining rules are imported into Terraform; all future changes go through pull requests with Checkov and a custom "no admin ports from the Internet" policy.
6. **Event-driven guard**: EventBridge and Event Grid functions alert on any change made outside the pipeline.

**Result.** Rules dropped from 4,000 to about 1,700. Change requests now take hours, not days, and the next audit found no Internet-exposed admin ports.

**Lessons learned.** You can't improve what you can't see: inventory and usage data come first. Fix the highest risk immediately, then move everything into code with guardrails so the mess can't grow back.

## Key takeaways

- Everything in the cloud is an API call; the console is just one client.
- Good automation is idempotent, handles pagination and rate limits, and logs what it did.
- Use Terraform for desired state, scripts for queries and reports, and events for fast remediation.
- Test network changes before production with analysis tools and reviewed pipelines.

## Checkpoint

**Q1. What makes an automation task idempotent?**

A. It runs very fast
B. Running it repeatedly produces the same end state without extra changes  ✓
C. It uses Python
D. It runs on a schedule

_Idempotent tasks converge on a desired state; reruns change nothing._

**Q2. A script listing security groups only finds the first 1,000. What did it forget?**

A. Authentication
B. Pagination  ✓
C. Retries
D. Logging

_List APIs return pages; you must request every page._

**Q3. Which AWS service routes CloudTrail API events to a Lambda function for remediation?**

A. CloudFront
B. EventBridge  ✓
C. Route 53
D. Direct Connect

_EventBridge rules match events and invoke targets such as Lambda._

**Q4. What does Batfish let you do?**

A. Encrypt configurations
B. Analyse network configurations to answer reachability questions before deploying  ✓
C. Replace BGP
D. Monitor CPU usage

_Batfish models configurations and checks behaviour without touching the live network._

**Q5. How should automation scripts authenticate in the cloud?**

A. Hard-coded access keys in the script
B. The root account
C. The environment's workload identity (roles, managed identities, service accounts, instance principals)  ✓
D. A shared password file

_Workload identities give short-lived credentials without stored secrets._

## Official reading

- [AWS SDK for Python (boto3)](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html)
- [Azure SDK for Python](https://learn.microsoft.com/en-us/azure/developer/python/sdk/azure-sdk-overview)
- [Google Cloud Python client libraries](https://cloud.google.com/python/docs/reference)
- [OCI Python SDK](https://docs.oracle.com/en-us/iaas/tools/python/latest/)
- [Ansible documentation](https://docs.ansible.com/)
- [Batfish](https://batfish.org/)
