import type {
  ConfidenceLevel,
  FeedbackCategory,
  FeedbackClassification,
  FeedbackSample,
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
  likelyOwner: string;
  recommendedRoute: string;
  defaultImpact: string;
  defaultNextAction: string;
  expectedSupportImpact: string;
}[] = [
  {
    category: "Reliability",
    keywords: ["large file", "disconnect", "sync", "upload", "fails", "timeout"],
    likelyOwner: "Connector Engineering",
    recommendedRoute:
      "Route to Connector Engineering with reproduction details, affected setup step, and customer impact.",
    defaultImpact:
      "Customers may be unable to complete setup or maintain a stable connector experience.",
    defaultNextAction:
      "Escalate to engineering triage and add the signal to the launch reliability watchlist.",
    expectedSupportImpact:
      "Likely to increase setup tickets and require same-day triage guidance.",
  },
  {
    category: "Permissions",
    keywords: ["permission", "access", "admin", "workspace", "file access"],
    likelyOwner: "Product Manager",
    recommendedRoute:
      "Route to Product and Documentation for permission-language review.",
    defaultImpact:
      "Admins may delay setup while confirming access rules and workspace scope.",
    defaultNextAction:
      "Clarify permission language in setup docs, support macros, and partner FAQ.",
    expectedSupportImpact:
      "Likely to create clarification tickets and repeat setup questions.",
  },
  {
    category: "Authentication / SSO",
    keywords: ["sso", "login", "authentication", "identity", "tenant"],
    likelyOwner: "Identity Engineering",
    recommendedRoute:
      "Route through the launch blocker path with identity provider and tenant details.",
    defaultImpact:
      "SSO-enabled customers may be blocked from onboarding or completing setup.",
    defaultNextAction:
      "Notify Identity Engineering and confirm whether the issue should be tracked as a launch blocker.",
    expectedSupportImpact:
      "Likely to require direct escalation support for affected enterprise admins.",
  },
  {
    category: "Documentation",
    keywords: ["docs", "documentation", "unclear", "explain", "instructions", "faq"],
    likelyOwner: "Documentation",
    recommendedRoute:
      "Route to Documentation with Product review for customer-facing language.",
    defaultImpact:
      "Customers may need extra clarification before proceeding with setup or approval.",
    defaultNextAction:
      "Update docs, FAQ, or support snippets with the missing explanation.",
    expectedSupportImpact:
      "Likely to create repeat clarification tickets until source material is updated.",
  },
  {
    category: "Partner Operations",
    keywords: ["partner", "escalation", "route", "contact path", "support team"],
    likelyOwner: "Partner Operations",
    recommendedRoute:
      "Route to Partner Operations and confirm the partner-facing escalation path.",
    defaultImpact:
      "Partner teams may delay customer support if routing or ownership is unclear.",
    defaultNextAction:
      "Confirm partner escalation owners and publish the updated contact path.",
    expectedSupportImpact:
      "Likely to create routing delays across partner and internal support teams.",
  },
  {
    category: "General / Needs Review",
    keywords: [],
    likelyOwner: "Product Operations",
    recommendedRoute:
      "Route to Product Operations for manual review and owner assignment.",
    defaultImpact:
      "The customer signal needs review before impact and ownership can be confirmed.",
    defaultNextAction:
      "Add to the feedback review queue and assign a category after triage.",
    expectedSupportImpact:
      "Expected support impact is unclear until the feedback is reviewed.",
  },
];

const severityRules: { severity: RiskSeverity; keywords: string[] }[] = [
  {
    severity: "Critical",
    keywords: ["outage", "security", "enterprise-wide"],
  },
  {
    severity: "High",
    keywords: ["blocked", "cannot", "fails", "disconnect"],
  },
  {
    severity: "Medium",
    keywords: ["confused", "unclear", "missing", "slow", "repeated"],
  },
  {
    severity: "Low",
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
  const sample = samples.find(
    (sample) => sample.text.trim().toLowerCase() === normalizedFeedback,
  );

  if (!sample) {
    return undefined;
  }

  return {
    ...sample,
    classification: enrichClassification(feedbackText, sample.classification),
  };
}

export function classifyCustomFeedback(feedbackText: string): FeedbackSample {
  return {
    id: "custom-feedback",
    text: feedbackText,
    classification: enrichClassification(feedbackText),
  };
}

export function getHighestSeverity(severities: RiskSeverity[]) {
  return severities.reduce<RiskSeverity>(
    (highest, severity) =>
      severityWeights[severity] > severityWeights[highest] ? severity : highest,
    "Low",
  );
}

function enrichClassification(
  feedbackText: string,
  baseClassification?: FeedbackClassification,
): FeedbackClassification {
  const categoryMatch = getCategoryMatch(feedbackText);
  const severityMatch = getSeverityMatch(feedbackText);
  const severity = baseClassification?.severity ?? severityMatch.severity;
  const triggeredTerms = getUniqueTerms([
    ...categoryMatch.triggeredTerms,
    ...severityMatch.triggeredTerms,
  ]);
  const confidenceLevel = getConfidenceLevel(
    categoryMatch.triggeredTerms.length,
    severityMatch.triggeredTerms.length,
    baseClassification,
  );
  const category = baseClassification?.category ?? categoryMatch.rule.category;
  const likelyOwner = baseClassification?.likelyOwner ?? categoryMatch.rule.likelyOwner;
  const userImpact = baseClassification?.userImpact ?? categoryMatch.rule.defaultImpact;
  const recommendedRoute =
    baseClassification?.recommendedRoute ?? categoryMatch.rule.recommendedRoute;
  const recommendedNextAction =
    baseClassification?.recommendedNextAction ?? categoryMatch.rule.defaultNextAction;

  return {
    category,
    severity,
    userImpact,
    likelyOwner,
    recommendedRoute,
    engineeringProblemStatement:
      baseClassification?.engineeringProblemStatement ??
      buildProblemStatement(feedbackText, category, userImpact),
    suggestedSupportResponse:
      baseClassification?.suggestedSupportResponse ??
      buildSupportResponse(category, likelyOwner),
    recommendedNextAction,
    confidenceLevel,
    routeExplanation: buildRouteExplanation(triggeredTerms, category),
    triggeredTerms,
    dashboardImpact: {
      expectedSupportImpact: categoryMatch.rule.expectedSupportImpact,
      shouldUpdateRiskRegister: shouldUpdateRiskRegister(severity),
      shouldIncludeInProductEngineeringInsights:
        shouldIncludeInProductEngineeringInsights(severity, categoryMatch.triggeredTerms),
    },
  };
}

function getCategoryMatch(feedbackText: string) {
  const scoredRules = categoryRules.map((rule, index) => ({
    rule,
    index,
    triggeredTerms: getTriggeredTerms(feedbackText, rule.keywords),
  }));
  const bestMatch = scoredRules.reduce((best, current) => {
    if (current.triggeredTerms.length > best.triggeredTerms.length) {
      return current;
    }

    if (
      current.triggeredTerms.length === best.triggeredTerms.length &&
      current.index < best.index
    ) {
      return current;
    }

    return best;
  }, scoredRules[scoredRules.length - 1]);

  return bestMatch.triggeredTerms.length > 0
    ? bestMatch
    : scoredRules[scoredRules.length - 1];
}

function getSeverityMatch(feedbackText: string) {
  const matchedRule = severityRules.find(
    (rule) => getTriggeredTerms(feedbackText, rule.keywords).length > 0,
  );

  if (!matchedRule) {
    return { severity: "Medium" as RiskSeverity, triggeredTerms: [] };
  }

  return {
    severity: matchedRule.severity,
    triggeredTerms: getTriggeredTerms(feedbackText, matchedRule.keywords),
  };
}

function getTriggeredTerms(feedbackText: string, keywords: string[]) {
  const normalizedFeedback = feedbackText.toLowerCase();

  return keywords.filter((keyword) =>
    normalizedFeedback.includes(keyword.toLowerCase()),
  );
}

function getUniqueTerms(terms: string[]) {
  return Array.from(new Set(terms));
}

function getConfidenceLevel(
  categoryTermCount: number,
  severityTermCount: number,
  baseClassification?: FeedbackClassification,
): ConfidenceLevel {
  if (baseClassification || categoryTermCount >= 2) {
    return "High";
  }

  if (categoryTermCount === 1 || severityTermCount > 0) {
    return "Medium";
  }

  return "Low";
}

function buildRouteExplanation(
  triggeredTerms: string[],
  category: FeedbackCategory,
) {
  if (triggeredTerms.length === 0) {
    return `No configured keywords were triggered, so this feedback is routed to ${category} for manual review.`;
  }

  return `Routed to ${category} because the feedback triggered: ${triggeredTerms.join(", ")}.`;
}

function buildProblemStatement(
  feedbackText: string,
  category: FeedbackCategory,
  userImpact: string,
) {
  return `Customer feedback indicates a ${category.toLowerCase()} issue: "${feedbackText.trim()}". ${userImpact}`;
}

function buildSupportResponse(category: FeedbackCategory, likelyOwner: string) {
  if (category === "General / Needs Review") {
    return "Thanks for sharing this. We are reviewing the details and will route it to the right owner before confirming next steps.";
  }

  return `Thanks for flagging this. We are routing it to ${likelyOwner} and will follow up with the next steps after review.`;
}

function shouldUpdateRiskRegister(severity: RiskSeverity) {
  if (severity === "Critical" || severity === "High") {
    return "Yes, review for a new or updated launch risk.";
  }

  if (severity === "Medium") {
    return "Maybe, if this repeats or affects a priority customer segment.";
  }

  return "No, track as feedback unless the pattern repeats.";
}

function shouldIncludeInProductEngineeringInsights(
  severity: RiskSeverity,
  triggeredTerms: string[],
) {
  if (severity === "Critical" || severity === "High" || triggeredTerms.length >= 2) {
    return "Yes, include in the next product and engineering insight review.";
  }

  return "Maybe, include if the same signal appears again.";
}
