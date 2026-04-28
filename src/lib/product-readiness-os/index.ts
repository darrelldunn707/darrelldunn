import type {
  ConfidenceLevel,
  FeedbackCategory,
  FeedbackClassification,
  FeedbackSample,
  FeedbackSeverity,
  ReadinessChecklistGroup,
  ReadinessStatus,
  RiskSeverity,
} from "../../types/product-readiness-os";

const readinessWeights: Record<ReadinessStatus, number> = {
  Complete: 1,
  "At Risk": 0.55,
  Blocked: 0,
  "Not Started": 0,
};

const severityWeights: Record<RiskSeverity, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

const categoryRules: {
  category: FeedbackCategory;
  keywords: string[];
  productArea: string;
  featureWorkflow: string;
  subcategory: string;
  issueType: string;
  likelyOwner: string;
  recommendedRoute: string;
  userImpact: string;
  recommendedNextAction: string;
  prioritySignal: string;
}[] = [
  {
    category: "Reliability",
    keywords: ["large file", "disconnect", "sync", "upload", "fails", "timeout"],
    productArea: "Connector reliability",
    featureWorkflow: "Content sync",
    subcategory: "Sync stability",
    issueType: "Workflow failure",
    likelyOwner: "Connector Engineering",
    recommendedRoute: "Support -> Connector Engineering",
    userImpact:
      "Admins may be unable to complete setup or maintain a stable connector experience.",
    recommendedNextAction:
      "Escalate to engineering triage and add to the launch reliability watchlist.",
    prioritySignal:
      "Recurring Sev 2 reliability issue affecting enterprise users during launch window.",
  },
  {
    category: "Permissions",
    keywords: ["permission", "access", "admin", "workspace", "file access"],
    productArea: "Enterprise administration",
    featureWorkflow: "Connector permissions",
    subcategory: "Access model clarity",
    issueType: "Usability / comprehension issue",
    likelyOwner: "Product Manager",
    recommendedRoute: "Support -> Product Ops -> Product Manager",
    userImpact:
      "Admins may delay setup while confirming access rules and workspace scope.",
    recommendedNextAction:
      "Clarify permission language in setup docs, support macros, and partner FAQ.",
    prioritySignal:
      "Recurring permissions confusion affecting setup confidence for enterprise admins.",
  },
  {
    category: "Authentication / SSO",
    keywords: ["sso", "login", "authentication", "identity", "tenant"],
    productArea: "Identity and access",
    featureWorkflow: "SSO setup",
    subcategory: "Authentication setup",
    issueType: "Launch blocker",
    likelyOwner: "Identity Engineering",
    recommendedRoute: "Support -> Identity Engineering escalation",
    userImpact:
      "SSO-enabled customers may be blocked from onboarding or completing setup.",
    recommendedNextAction:
      "Notify Identity Engineering and confirm launch-blocker status.",
    prioritySignal:
      "Recurring Sev 2 issue affecting enterprise SSO users during launch window.",
  },
  {
    category: "Documentation",
    keywords: ["docs", "documentation", "unclear", "explain", "instructions", "faq"],
    productArea: "Launch enablement",
    featureWorkflow: "Setup documentation",
    subcategory: "Missing or unclear guidance",
    issueType: "Documentation gap",
    likelyOwner: "Documentation",
    recommendedRoute: "Support -> Documentation -> Product review",
    userImpact:
      "Customers may need extra clarification before proceeding with setup or approval.",
    recommendedNextAction:
      "Update docs, FAQ, or support snippets with the missing explanation.",
    prioritySignal:
      "Repeat documentation gap creating avoidable support contact during launch.",
  },
  {
    category: "Partner Operations",
    keywords: ["partner", "escalation", "route", "contact path", "support team"],
    productArea: "Partner operations",
    featureWorkflow: "Partner escalation path",
    subcategory: "Routing clarity",
    issueType: "Operational routing issue",
    likelyOwner: "Partner Operations",
    recommendedRoute: "Support -> Partner Operations",
    userImpact:
      "Partner teams may delay customer support if routing or ownership is unclear.",
    recommendedNextAction:
      "Confirm partner escalation owners and publish the updated contact path.",
    prioritySignal:
      "Recurring partner routing gap affecting launch response time.",
  },
];

const severityRules: {
  severity: FeedbackSeverity;
  keywords: string[];
}[] = [
  {
    severity: "Sev 1",
    keywords: ["outage", "security", "safety", "enterprise-wide"],
  },
  {
    severity: "Sev 2",
    keywords: ["blocked", "cannot", "fails", "disconnect"],
  },
  {
    severity: "Sev 3",
    keywords: ["slow", "repeated", "timeout"],
  },
  {
    severity: "Sev 4",
    keywords: ["confused", "unclear", "missing", "docs", "documentation", "faq"],
  },
  {
    severity: "Sev 5",
    keywords: ["question", "request", "suggestion"],
  },
];

export function calculateReadinessScore(groups: ReadinessChecklistGroup[]) {
  const items = groups.flatMap((group) => group.items);

  if (items.length === 0) {
    return 0;
  }

  const earned = items.reduce(
    (sum, item) => sum + readinessWeights[item.status],
    0,
  );

  return Math.round((earned / items.length) * 100);
}

export function calculateGroupReadinessScore(group: ReadinessChecklistGroup) {
  return calculateReadinessScore([group]);
}

export function countReadinessStatuses(groups: ReadinessChecklistGroup[]) {
  return groups
    .flatMap((group) => group.items)
    .reduce<Record<ReadinessStatus, number>>(
      (counts, item) => {
        counts[item.status] += 1;
        return counts;
      },
      {
        Complete: 0,
        "At Risk": 0,
        Blocked: 0,
        "Not Started": 0,
      },
    );
}

export function classifyFeedback(
  feedbackText: string,
  samples: FeedbackSample[],
) {
  const normalizedFeedback = feedbackText.trim().toLowerCase();

  return samples.find(
    (sample) => sample.text.trim().toLowerCase() === normalizedFeedback,
  );
}

export function classifyCustomFeedback(feedbackText: string): FeedbackSample {
  const trimmedFeedback = feedbackText.trim();
  const categoryMatch = getCategoryMatch(trimmedFeedback);

  if (!categoryMatch) {
    return {
      id: "custom-feedback",
      text: trimmedFeedback,
      classification: buildFallbackClassification(trimmedFeedback),
    };
  }

  return {
    id: "custom-feedback",
    text: trimmedFeedback,
    classification: buildCustomClassification(trimmedFeedback, categoryMatch),
  };
}

export function getHighestSeverity(severities: RiskSeverity[]) {
  return severities.reduce<RiskSeverity>(
    (highest, severity) =>
      severityWeights[severity] > severityWeights[highest] ? severity : highest,
    "Low",
  );
}

function buildCustomClassification(
  feedbackText: string,
  categoryMatch: {
    rule: (typeof categoryRules)[number];
    triggeredTerms: string[];
  },
): FeedbackClassification {
  const severity = getFeedbackSeverity(feedbackText);
  const confidenceLevel = getConfidenceLevel(categoryMatch.triggeredTerms.length);
  const confidenceScore = getConfidenceScore(confidenceLevel);
  const humanReviewNeeded = getHumanReviewNeeded(confidenceLevel);
  const escalationStatus = getEscalationStatus(severity);
  const similarReports = confidenceLevel === "High" ? 6 : 3;
  const uniqueCustomersAffected = confidenceLevel === "High" ? 4 : 2;
  const trend =
    similarReports > 1 ? "Emerging repeated launch signal" : "One-off / unconfirmed";
  const whyThisRoute = `Routed to ${categoryMatch.rule.category} because the feedback triggered: ${categoryMatch.triggeredTerms.join(", ")}.`;

  return {
    productArea: categoryMatch.rule.productArea,
    featureWorkflow: categoryMatch.rule.featureWorkflow,
    category: categoryMatch.rule.category,
    subcategory: categoryMatch.rule.subcategory,
    issueType: categoryMatch.rule.issueType,
    severity,
    confidenceLevel,
    confidenceScore,
    likelyOwner: categoryMatch.rule.likelyOwner,
    recommendedRoute: categoryMatch.rule.recommendedRoute,
    escalationStatus,
    humanReviewNeeded,
    userImpact: categoryMatch.rule.userImpact,
    duplicateCluster: `${categoryMatch.rule.category} launch signal`,
    similarReports,
    uniqueCustomersAffected,
    trend,
    engineeringReadyProblemStatement: `Customer feedback indicates a ${categoryMatch.rule.category.toLowerCase()} issue: "${feedbackText}". ${categoryMatch.rule.userImpact}`,
    suggestedSupportResponse: `Thanks for flagging this. We are routing it to ${categoryMatch.rule.likelyOwner} and will follow up with next steps after review.`,
    recommendedNextAction: categoryMatch.rule.recommendedNextAction,
    whyThisRoute,
    sourceChannel: "Custom feedback input",
    customerSegment: "Unknown / needs triage",
    status: confidenceLevel === "Low" ? "Needs review" : "Routed",
    feedbackId: "FB-CUSTOM",
    createdFrom: "Custom feedback input",
    prioritySignal: categoryMatch.rule.prioritySignal,
    dashboardImpact: buildDashboardImpact(
      categoryMatch.rule.category,
      severity,
      categoryMatch.rule.prioritySignal,
    ),
  };
}

function buildFallbackClassification(feedbackText: string): FeedbackClassification {
  return {
    productArea: "Needs triage",
    featureWorkflow: "Unknown workflow",
    category: "Needs triage",
    subcategory: "Unclear",
    issueType: "Unclear",
    severity: "Sev 4",
    confidenceLevel: "Low",
    confidenceScore: 58,
    likelyOwner: "Human triage queue",
    recommendedRoute: "Support -> Product Ops triage",
    escalationStatus: "Not escalated",
    humanReviewNeeded: "Yes",
    userImpact: "Impact unclear; requires follow-up",
    duplicateCluster: "No cluster assigned",
    similarReports: 1,
    uniqueCustomersAffected: 1,
    trend: "One-off / unconfirmed",
    engineeringReadyProblemStatement: `Custom feedback needs triage before engineering action: "${feedbackText}".`,
    suggestedSupportResponse:
      "Thanks for sharing this. We need a few more details before routing it to the right team.",
    recommendedNextAction: "Review manually and assign an owner.",
    whyThisRoute:
      "No configured keywords were triggered, so this feedback needs human triage.",
    sourceChannel: "Custom feedback input",
    customerSegment: "Unknown",
    status: "Needs review",
    feedbackId: "FB-CUSTOM",
    createdFrom: "Custom feedback input",
    prioritySignal: "Needs human review before prioritization",
    dashboardImpact: {
      launchReadinessImpact:
        "No readiness score change until the signal is reviewed and assigned.",
      riskRegisterUpdate:
        "No risk update yet; review first to determine launch relevance.",
      supportHubUpdate:
        "No macro change yet; support should collect product area, customer segment, and reproduction details.",
      productEngineeringInsight:
        "Not included until the signal is categorized or repeats.",
    },
  };
}

function getCategoryMatch(feedbackText: string) {
  const scoredRules = categoryRules
    .map((rule) => ({
      rule,
      triggeredTerms: getTriggeredTerms(feedbackText, rule.keywords),
    }))
    .filter((match) => match.triggeredTerms.length > 0)
    .sort(
      (firstMatch, secondMatch) =>
        secondMatch.triggeredTerms.length - firstMatch.triggeredTerms.length,
    );

  return scoredRules[0];
}

function getFeedbackSeverity(feedbackText: string): FeedbackSeverity {
  return (
    severityRules.find(
      (rule) => getTriggeredTerms(feedbackText, rule.keywords).length > 0,
    )?.severity ?? "Sev 4"
  );
}

function getTriggeredTerms(feedbackText: string, keywords: string[]) {
  const normalizedFeedback = feedbackText.toLowerCase();

  return keywords.filter((keyword) =>
    normalizedFeedback.includes(keyword.toLowerCase()),
  );
}

function getConfidenceLevel(triggeredTermCount: number): ConfidenceLevel {
  if (triggeredTermCount >= 2) {
    return "High";
  }

  if (triggeredTermCount === 1) {
    return "Medium";
  }

  return "Low";
}

function getConfidenceScore(confidenceLevel: ConfidenceLevel) {
  if (confidenceLevel === "High") {
    return 88;
  }

  if (confidenceLevel === "Medium") {
    return 76;
  }

  return 58;
}

function getHumanReviewNeeded(confidenceLevel: ConfidenceLevel) {
  if (confidenceLevel === "High") {
    return "No";
  }

  if (confidenceLevel === "Medium") {
    return "Review recommended";
  }

  return "Yes";
}

function getEscalationStatus(severity: FeedbackSeverity) {
  if (severity === "Sev 1") {
    return "Escalated - launch incident review";
  }

  if (severity === "Sev 2") {
    return "Escalation recommended - core workflow risk";
  }

  return "Not escalated";
}

function buildDashboardImpact(
  category: FeedbackCategory,
  severity: FeedbackSeverity,
  prioritySignal: string,
) {
  const riskLevel = severity === "Sev 1" || severity === "Sev 2" ? "high" : "moderate";

  return {
    launchReadinessImpact: `${severity} ${category} signal may affect the related launch workstream if it repeats.`,
    riskRegisterUpdate: `Review as a ${riskLevel} launch risk; mitigation should track owner response and customer impact.`,
    supportHubUpdate:
      "Update support macro guidance, known issue language, and follow-up data requirements if the signal repeats.",
    productEngineeringInsight: prioritySignal,
  };
}
