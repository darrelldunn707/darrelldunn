import type {
  FeedbackSample,
  LaunchScenario,
  PartnerReadiness,
  ProductInsights,
  ReadinessChecklistGroup,
  RiskRegisterItem,
  SupportPlaybook,
} from "../../types/product-readiness-os";

export const launchScenario: LaunchScenario = {
  name: "Enterprise Knowledge Connector Beta",
  launchDate: "May 21, 2026",
  targetAudience: "Enterprise admins, partner success teams, and pilot support teams",
  launchPhase: "Beta readiness review",
  mainGoal:
    "Validate that enterprise admins can connect approved knowledge sources with clear permission controls and a prepared support path.",
  supportRiskLevel: "High",
};

export const readinessChecklist: ReadinessChecklistGroup[] = [
  {
    id: "product",
    title: "Product readiness",
    items: [
      {
        id: "product-admin-flow",
        label: "Admin setup flow validated with pilot accounts",
        status: "Complete",
        owner: "Product Ops",
        dueDate: "May 6",
        notes: "Pilot walkthroughs completed with two admin personas.",
      },
      {
        id: "product-permissions",
        label: "Permission model explanation reviewed",
        status: "At Risk",
        owner: "Product Manager",
        dueDate: "May 10",
        notes: "Needs one more pass for workspace-level access examples.",
      },
      {
        id: "product-success-metrics",
        label: "Launch success metrics defined",
        status: "Complete",
        owner: "Product Analytics",
        dueDate: "May 8",
        notes: "Activation, setup completion, and support deflection metrics are ready.",
      },
    ],
  },
  {
    id: "support",
    title: "Support readiness",
    items: [
      {
        id: "support-playbook",
        label: "Support playbook published",
        status: "Complete",
        owner: "Support Enablement",
        dueDate: "May 9",
        notes: "Includes triage steps, customer language, and owner routing.",
      },
      {
        id: "support-macros",
        label: "Launch macros reviewed",
        status: "At Risk",
        owner: "Support Lead",
        dueDate: "May 14",
        notes: "SSO setup response still needs final product review.",
      },
      {
        id: "support-staffing",
        label: "Launch-day support coverage confirmed",
        status: "Complete",
        owner: "Support Operations",
        dueDate: "May 13",
        notes: "Coverage calendar and escalation bridge are drafted.",
      },
    ],
  },
  {
    id: "legal-policy",
    title: "Legal / policy readiness",
    items: [
      {
        id: "legal-data-handling",
        label: "Data handling notes approved",
        status: "Complete",
        owner: "Policy",
        dueDate: "May 7",
        notes: "Partner-facing limitations align with beta scope.",
      },
      {
        id: "legal-terms",
        label: "Beta participation terms confirmed",
        status: "Complete",
        owner: "Legal",
        dueDate: "May 11",
        notes: "Terms are ready for partner enablement packets.",
      },
    ],
  },
  {
    id: "partner",
    title: "Partner readiness",
    items: [
      {
        id: "partner-training",
        label: "Partner support training delivered",
        status: "At Risk",
        owner: "Partner Success",
        dueDate: "May 15",
        notes: "Two regional teams still need the recorded walkthrough.",
      },
      {
        id: "partner-contact-path",
        label: "Partner issue routing path confirmed",
        status: "Blocked",
        owner: "Partner Operations",
        dueDate: "May 12",
        notes: "Waiting on named regional escalation owners.",
      },
      {
        id: "partner-faq",
        label: "Partner FAQ approved",
        status: "Complete",
        owner: "Partner Enablement",
        dueDate: "May 16",
        notes: "External FAQ is scoped to beta setup, permissions, and limits.",
      },
    ],
  },
  {
    id: "engineering",
    title: "Engineering readiness",
    items: [
      {
        id: "engineering-large-file",
        label: "Large-file upload monitoring in place",
        status: "At Risk",
        owner: "Engineering",
        dueDate: "May 17",
        notes: "Telemetry exists, but alert thresholds need launch review.",
      },
      {
        id: "engineering-sso",
        label: "SSO setup failure path tested",
        status: "Blocked",
        owner: "Identity Engineering",
        dueDate: "May 14",
        notes: "Test tenant configuration is not yet stable.",
      },
      {
        id: "engineering-rollback",
        label: "Feature flag rollback plan documented",
        status: "Complete",
        owner: "Release Engineering",
        dueDate: "May 10",
        notes: "Rollback owner and decision criteria are documented.",
      },
    ],
  },
  {
    id: "marketing-comms",
    title: "Marketing / communications readiness",
    items: [
      {
        id: "comms-beta-email",
        label: "Beta announcement copy approved",
        status: "Complete",
        owner: "Lifecycle Marketing",
        dueDate: "May 13",
        notes: "Copy clearly labels the launch as a limited beta.",
      },
      {
        id: "comms-release-notes",
        label: "Release notes drafted",
        status: "Not Started",
        owner: "Product Marketing",
        dueDate: "May 18",
        notes: "Draft is planned after the final permission-language review.",
      },
    ],
  },
];

export const riskRegister: RiskRegisterItem[] = [
  {
    id: "permissions-confusion",
    title: "Enterprise admins may not understand connector permissions",
    severity: "High",
    affectedAudience: "Enterprise admins and security reviewers",
    owner: "Product Manager",
    mitigationPlan:
      "Add permission examples to setup docs, support macros, and partner training.",
    status: "Mitigating",
    escalationPath: "Product Manager -> Policy -> Launch Lead",
  },
  {
    id: "support-volume",
    title: "Support volume may spike after launch",
    severity: "Medium",
    affectedAudience: "Support agents and pilot customers",
    owner: "Support Operations",
    mitigationPlan:
      "Staff launch-day coverage, publish macros, and route repeat issues through the triage queue.",
    status: "Monitoring",
    escalationPath: "Support Lead -> Product Ops -> Launch Lead",
  },
  {
    id: "sso-blocker",
    title: "SSO setup issues may block onboarding",
    severity: "Critical",
    affectedAudience: "Enterprise admins using SSO",
    owner: "Identity Engineering",
    mitigationPlan:
      "Validate setup path with pilot tenants and prepare a direct engineering escalation lane.",
    status: "Escalated",
    escalationPath: "Support Lead -> Identity Engineering -> Release Lead",
  },
  {
    id: "documentation-edge-cases",
    title: "Documentation may not cover edge cases",
    severity: "Medium",
    affectedAudience: "Admins with mixed workspace permissions",
    owner: "Documentation",
    mitigationPlan:
      "Add a beta limitations section and collect unresolved examples during the first week.",
    status: "Mitigating",
    escalationPath: "Documentation -> Product Manager -> Policy",
  },
  {
    id: "partner-training",
    title: "Partner teams may not be trained before rollout",
    severity: "High",
    affectedAudience: "External partner support teams",
    owner: "Partner Success",
    mitigationPlan:
      "Publish recorded training, confirm attendance, and provide a partner-only support path.",
    status: "Mitigating",
    escalationPath: "Partner Success -> Partner Operations -> Launch Lead",
  },
];

export const supportPlaybook: SupportPlaybook = {
  summary:
    "The support playbook gives agents a clear triage path for setup, permissions, reliability, and partner-routing questions during the beta launch.",
  faqs: [
    {
      question: "Who can connect an enterprise knowledge source?",
      answer:
        "Only approved enterprise admins in the beta program should configure connectors during this launch phase.",
    },
    {
      question: "What should support do when setup fails with SSO enabled?",
      answer:
        "Confirm tenant settings, collect the setup step and error state, then route to Identity Engineering if the customer is blocked.",
    },
    {
      question: "How should permission concerns be handled?",
      answer:
        "Use the approved permission explanation, confirm the customer's access model, and escalate unclear cases to Product and Policy.",
    },
  ],
  macros: [
    {
      title: "Connector permission explanation",
      trigger: "Customer asks who can access synced files",
      response:
        "The connector follows the access rules configured by the enterprise admin. We can help confirm which users and workspaces are included before sync is enabled.",
    },
    {
      title: "SSO setup blocked",
      trigger: "Admin cannot complete setup with SSO",
      response:
        "Thanks for the details. We are going to review your SSO setup path with the specialist team and will follow up with next steps after they confirm the configuration.",
    },
    {
      title: "Partner routing request",
      trigger: "Partner team asks where to send launch issues",
      response:
        "Please send enterprise beta issues through the partner support path with customer impact, setup step, and urgency so the launch team can route them correctly.",
    },
  ],
  escalationMatrix: [
    {
      signal: "Customer cannot complete setup",
      routeTo: "Identity Engineering",
      responseTime: "Same business day during beta launch week",
    },
    {
      signal: "Permissions or access concern",
      routeTo: "Product Manager and Policy",
      responseTime: "Within 1 business day",
    },
    {
      signal: "Repeated partner routing confusion",
      routeTo: "Partner Operations",
      responseTime: "Within 4 business hours",
    },
    {
      signal: "Connector disconnects or sync fails",
      routeTo: "Connector Engineering",
      responseTime: "Same business day for high-impact reports",
    },
  ],
  knownLimitations: [
    "Large files may take longer to sync during beta monitoring.",
    "SSO setup requires a supported enterprise identity configuration.",
    "Partner teams should route beta issues through the dedicated launch contact path.",
    "The beta does not include every connector source type planned for general availability.",
  ],
  launchDayChecklist: [
    "Confirm support coverage and escalation owners.",
    "Review open critical and high-severity risks.",
    "Check setup-completion and disconnect-rate dashboards.",
    "Post the daily launch digest to internal stakeholders.",
    "Update partner-facing known limitations if the beta scope changes.",
  ],
};

export const feedbackSamples: FeedbackSample[] = [
  {
    id: "large-files",
    text: "The connector disconnects when uploading large files.",
    classification: {
      category: "Reliability",
      severity: "High",
      userImpact: "Admins may be unable to complete initial content sync.",
      likelyOwner: "Connector Engineering",
      recommendedRoute: "Create engineering triage issue and attach upload size, source, and disconnect timing.",
      engineeringProblemStatement:
        "During beta setup, the connector disconnects when admins upload large files, preventing successful initial sync for affected enterprise accounts.",
      suggestedSupportResponse:
        "We are reviewing a reliability issue related to large-file sync. Please share the file size range and the step where the disconnect occurred so we can route it accurately.",
      recommendedNextAction:
        "Escalate to Connector Engineering and add to launch-day reliability watchlist.",
    },
  },
  {
    id: "permissions",
    text: "Admins are confused about permission settings.",
    classification: {
      category: "Permissions",
      severity: "Medium",
      userImpact: "Admins may delay setup while confirming access rules.",
      likelyOwner: "Product Manager",
      recommendedRoute: "Route to Product and Documentation for permission-language review.",
      engineeringProblemStatement:
        "Enterprise admins are not consistently understanding how connector permission settings map to user access during setup.",
      suggestedSupportResponse:
        "The connector follows the access settings configured by the admin. We can help review the intended workspace and user scope before you enable sync.",
      recommendedNextAction:
        "Update setup docs and support macro examples with clearer permission scenarios.",
    },
  },
  {
    id: "sso",
    text: "Customers cannot complete setup when SSO is enabled.",
    classification: {
      category: "Authentication",
      severity: "Critical",
      userImpact: "SSO-enabled customers may be blocked from onboarding.",
      likelyOwner: "Identity Engineering",
      recommendedRoute: "Escalate through the launch blocker path with tenant configuration details.",
      engineeringProblemStatement:
        "Enterprise customers with SSO enabled cannot complete connector setup, blocking beta onboarding for affected tenants.",
      suggestedSupportResponse:
        "We are going to review this with the identity team. Please send the setup step, SSO provider, and any visible error state so they can investigate quickly.",
      recommendedNextAction:
        "Mark as launch blocker, notify Identity Engineering, and update the risk register.",
    },
  },
  {
    id: "docs-access",
    text: "The setup docs do not explain who can access synced files.",
    classification: {
      category: "Documentation",
      severity: "Medium",
      userImpact: "Security reviewers may need extra clarification before approving setup.",
      likelyOwner: "Documentation",
      recommendedRoute: "Route to Documentation with Product and Policy review.",
      engineeringProblemStatement:
        "Setup documentation does not clearly explain file-access visibility after sync, creating avoidable review cycles for enterprise admins.",
      suggestedSupportResponse:
        "Thanks for flagging this. We are clarifying the access explanation in the beta docs and can help confirm the intended access model for your workspace.",
      recommendedNextAction:
        "Add a permission visibility section to beta docs and partner FAQ.",
    },
  },
  {
    id: "partner-routing",
    text: "Partner support teams are asking where to send enterprise issues.",
    classification: {
      category: "Partner Operations",
      severity: "High",
      userImpact: "Partner teams may delay customer support if routing is unclear.",
      likelyOwner: "Partner Operations",
      recommendedRoute: "Route to Partner Operations and publish the partner support contact path.",
      engineeringProblemStatement:
        "Partner support teams do not have a clear routing path for enterprise beta issues, increasing time to triage customer-impacting reports.",
      suggestedSupportResponse:
        "Please send beta launch issues through the partner support path with customer impact, setup step, and urgency so the launch team can triage them.",
      recommendedNextAction:
        "Confirm regional escalation owners and send partner routing update.",
    },
  },
];

export const productInsights: ProductInsights = {
  feedbackVolumeByCategory: {
    Reliability: 18,
    Permissions: 14,
    Authentication: 9,
    Documentation: 12,
    "Partner Operations": 7,
  },
  openHighSeverityIssues: [
    "SSO-enabled setup failures blocking pilot onboarding",
    "Large-file sync disconnects during initial connector setup",
    "Partner routing path not confirmed for two regional teams",
  ],
  topCustomerPainPoints: [
    "Admins need clearer permission examples before enabling sync.",
    "SSO setup failures create onboarding delays for security-conscious customers.",
    "Support needs a faster way to distinguish product gaps from configuration questions.",
  ],
  recommendedProductActions: [
    "Add setup-screen helper text for permission scope before beta expansion.",
    "Prioritize SSO failure-path validation before launch approval.",
    "Review beta telemetry thresholds for connector disconnects.",
  ],
  recommendedSupportActions: [
    "Publish the final SSO blocked macro after product review.",
    "Run a 20-minute refresher for partner support leads.",
    "Send a daily launch digest with top issue categories and owner routes.",
  ],
  launchReadinessConcerns: [
    "Partner issue routing must be unblocked before broad rollout.",
    "Permission language should be aligned across product UI, docs, and support macros.",
    "Release notes are still pending final beta scope confirmation.",
  ],
};

export const partnerReadiness: PartnerReadiness = {
  timeline: [
    {
      date: "May 6",
      milestone: "Pilot admin walkthrough complete",
      status: "Complete",
    },
    {
      date: "May 13",
      milestone: "Partner enablement packet shared",
      status: "Complete",
    },
    {
      date: "May 15",
      milestone: "Regional partner training",
      status: "At Risk",
    },
    {
      date: "May 21",
      milestone: "Enterprise beta launch",
      status: "Not Started",
    },
  ],
  trainingStatus:
    "Core training is ready. Two regional partner groups still need recorded walkthrough confirmation.",
  supportContactPath: [
    "Partner support lead collects customer impact and setup step.",
    "Partner support lead sends the issue to the beta launch contact path.",
    "Launch triage routes the issue to Support, Product, or Engineering.",
    "Partner team receives the customer-facing response or next-step request.",
  ],
  knownLimitations: [
    "Beta access is limited to approved enterprise pilot accounts.",
    "Some connector source types are not included in this launch phase.",
    "Large-file sync behavior is being monitored during beta.",
    "SSO setup may require additional validation for unsupported configurations.",
  ],
  readinessRequirements: [
    "Complete partner training before supporting beta customers.",
    "Use the beta FAQ when answering setup and permission questions.",
    "Route enterprise-impacting issues through the launch contact path.",
    "Include urgency, affected customer segment, and setup step in every escalation.",
  ],
  faqs: [
    {
      question: "Can partners approve customers for beta access?",
      answer:
        "No. Beta participation is limited to approved enterprise pilot customers.",
    },
    {
      question: "Where should partner teams send launch issues?",
      answer:
        "Use the beta launch contact path so the internal triage team can assign the right owner.",
    },
    {
      question: "What should partners say about unsupported connector sources?",
      answer:
        "Position the current beta as a limited launch and capture the requested source type for product review.",
    },
  ],
};
