// Additive V3.1 GRC curriculum. IDs g07-g10 are permanent and do not replace g01-g06.
export const GRC_V31 = [
  {
    "id": "g07",
    "name": "Information Security Risk Assessment",
    "lessons": [
      [
        "Building a reliable risk statement",
        "A useful information security risk statement identifies the asset or business process, the plausible threat event, the underlying vulnerability or control deficiency, and the potential business consequence. Separate the observed fact from the hypothetical consequence. For example, an old privileged account is an observed control deficiency; unauthorized changes to financial records are one potential consequence. Explain the difference between probability and impact, and use the organization’s approved scoring criteria rather than assigning arbitrary severity. Discuss uncertainty explicitly: if asset criticality or exposure is unknown, record assumptions and obtain information before finalizing the rating.",
        "A bank finds that former contractors retain access to an internal reporting system. The GRC analyst confirms account activity, report sensitivity, access scope and current mitigating controls, then documents a scenario-based risk for the responsible owner."
      ],
      [
        "Control design versus operating effectiveness",
        "A control can exist on paper without operating reliably. Design effectiveness examines whether the control, if carried out as described, could address the risk at the required frequency and precision. Operating effectiveness asks whether it actually operated during the relevant period, by the appropriate person, on the correct population and with issues resolved. Control testing should clarify the period, population, sample method, expected evidence, exceptions and decision criteria. A screenshot of a security setting may support configuration at a point in time but cannot alone prove that a quarterly review occurred throughout the year.",
        "An organization has a documented quarterly user-access-review procedure. Evidence shows only one review was performed during the past year. Design might be adequate, but the analyst cannot conclude consistent operating effectiveness."
      ],
      [
        "From inherent risk to residual risk",
        "Inherent risk considers the exposure before specific mitigating controls. Residual risk considers the effectiveness of controls in the actual environment. A numerical residual rating should not be obtained by mechanically subtracting a control score unless the approved risk methodology explicitly defines that calculation. Consider whether the control addresses likelihood, impact, or both, and account for dependencies, uncertainty, residual exposure and risk acceptance authority. Track action owners and due dates and distinguish accepted risks from risks that still require treatment.",
        "A vendor stores business-critical reports. Encryption reduces data disclosure consequences but does not eliminate the availability risk of an outage; separate risks need separate treatment decisions."
      ]
    ]
  },
  {
    "id": "g08",
    "name": "IT Audit and Evidence Fundamentals",
    "lessons": [
      [
        "Understanding audit scope and objectives",
        "An audit objective is the conclusion the engagement seeks to support; scope defines systems, entities, periods, and control processes covered. Criteria are the policies, contractual obligations, or framework requirements against which evidence is evaluated. Audit work begins with understanding the process through walkthroughs and documented narratives before selecting tests. Distinguish inquiry, observation, inspection and reperformance: asking a control owner to describe a review is not the same as inspecting completed review evidence. Document exclusions, reliance on other assurance work and known limitations.",
        "For an identity governance audit, the team scopes privileged accounts in the production domain during a defined six-month period, confirms the authoritative account list and tests approval, review and removal evidence."
      ],
      [
        "Evaluating evidence quality",
        "Reliable evidence has provenance, completeness, relevance, sufficient detail, integrity and a clear time period. When reviewing an export, identify its source system, extraction time, filters and whether the report captures the entire required population. Evidence collected directly by an independent reviewer may provide stronger assurance than unverified screenshots. A control owner attestation may be valuable but should not replace system records where those records are reasonably available. Preserve sensitive records using approved handling and retention rules.",
        "A reviewer receives a spreadsheet labeled “all admins,” but it excludes a secondary directory. The population is incomplete, so sampling conclusions are not yet supportable."
      ],
      [
        "Writing findings and remediation plans",
        "Strong findings distinguish criteria, observed condition, cause, risk or consequence, and recommendation. Avoid presenting an assumed consequence as an incident that actually happened. Remediation plans should name an accountable owner, a realistic completion date, measurable corrective actions, validation evidence and intermediate milestones where needed. Retesting evaluates implemented changes and their operation, not simply whether a ticket has been marked closed.",
        "An access review found several terminated users. The action plan addresses HR-to-IT event synchronization, revocation timing, exception monitoring, ownership, and validation after deployment."
      ]
    ]
  },
  {
    "id": "g09",
    "name": "Cloud Governance and Compliance",
    "lessons": [
      [
        "Shared responsibility across service models",
        "Cloud services divide operational responsibilities between provider and customer, but the boundaries vary by service, contract and implementation. Infrastructure as a Service commonly gives the customer responsibility for guest operating systems, application configuration, identities, and customer data, while the provider operates physical infrastructure. Managed services shift some patching and operational tasks to the provider without removing the customer’s responsibilities for appropriate access, classification and oversight. A provider’s compliance report covers its defined services and assessment scope, not every customer workload built upon them.",
        "A company deploys a managed database with public network exposure. The provider may manage underlying infrastructure, but the customer still owns the application access decision and security configuration."
      ],
      [
        "Landing zones and cloud governance",
        "A landing zone is an organized starting architecture for accounts or subscriptions, identity, network connectivity, guardrails, logging and cost management. Governance requires ownership of privileged roles, separation of production from development, baseline policy enforcement, and controlled exceptions. Compare desired configuration with actual state and determine whether monitoring can identify drift. A baseline is not inherently a regulatory requirement; map it to actual organizational and legal obligations.",
        "A business creates new cloud accounts without central logging. A cloud governance review checks account inventory, mandatory logs, retention decisions, owners and documented exceptions."
      ],
      [
        "Cloud audit evidence and risk decisions",
        "Evidence for cloud controls may include identity role assignments, policy assignments, configuration histories, logs, change approvals and security-monitoring outputs. Each item must be interpreted in light of the cloud platform’s shared responsibility and service-specific behavior. Governance reviews should distinguish preventive policy enforcement from detective monitoring and confirm that alerts have an owner and response process. Avoid equating a dashboard marked green with proof that all scoped requirements are satisfied.",
        "A dashboard reports encryption enabled across storage. The analyst also examines classification, key ownership, access control, exceptions and evidence that the expected storage population was evaluated."
      ]
    ]
  },
  {
    "id": "g10",
    "name": "Third-Party and Business Continuity Assurance",
    "lessons": [
      [
        "Risk-based vendor onboarding",
        "Vendor assessments should be proportionate to service criticality, data access, regulatory relevance and substitution difficulty. Due diligence can include security assurance, privacy terms, location and subcontractor dependencies, service resilience, incident notification, contractual controls and exit capability. Certifications and assurance reports are useful only when their scope, dates, exceptions and complementary customer controls match the intended service. Vendor risk acceptance needs a defined decision-maker and periodic reassessment.",
        "An outsourced payment service provides a security certification. The GRC analyst checks whether the certified scope includes the actual service, region and subcontractors the business will use."
      ],
      [
        "Business impact analysis and recovery priorities",
        "A business impact analysis identifies critical activities, required resources and the consequences of disruption over time. Recovery Time Objective expresses a target time to restore a service; Recovery Point Objective describes the maximum targeted data-loss interval. Neither is evidence that recovery is achievable. Trace dependencies on identity, DNS, networks, staff, third parties, backups and downstream services. Critical processes may require recovery sequencing rather than simultaneous restoration.",
        "An online service has a one-hour RTO but depends on an identity provider restored within eight hours. The mismatch requires a redesign, revised objectives or documented risk decision."
      ],
      [
        "Testing continuity arrangements",
        "Continuity validation can take the form of tabletop discussion, technical restoration, partial failover or end-to-end recovery exercises. Select exercise depth according to business criticality and risk, and document limitations. Results should include actual restoration times, data recovery points, missing dependencies, communications and corrective actions. An exercise record without failures or follow-up evidence may be insufficient to demonstrate an effective improvement cycle.",
        "A backup restoration succeeds but application authentication fails because an external directory dependency was omitted from the plan; the issue becomes a tracked corrective action."
      ]
    ]
  }
];