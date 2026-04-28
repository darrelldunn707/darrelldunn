export type ViewId =
  | "partner"
  | "support"
  | "command-center"
  | "product-engineering";

export type ReadinessStatus =
  | "Complete"
  | "At Risk"
  | "Blocked"
  | "Not Started";

export type RiskSeverity = "Critical" | "High" | "Medium" | "Low";

export type RiskStatus = "Monitoring" | "Mitigating" | "Escalated" | "Closed";

export type FeedbackCategory =
  | "Reliability"
  | "Permissions"
  | "Authentication / SSO"
  | "Documentation"
  | "Partner Operations"
  | "Needs triage"
  | "General / Needs Review";

export type ConfidenceLevel = "High" | "Medium" | "Low";

export type FeedbackSeverity = "Sev 1" | "Sev 2" | "Sev 3" | "Sev 4" | "Sev 5";

export type LaunchScenario = {
  name: string;
  launchDate: string;
  targetAudience: string;
  launchPhase: string;
  mainGoal: string;
  supportRiskLevel: RiskSeverity;
};

export type ReadinessChecklistItem = {
  id: string;
  label: string;
  status: ReadinessStatus;
  owner: string;
  dueDate: string;
  notes: string;
};

export type ReadinessChecklistGroup = {
  id: string;
  title: string;
  items: ReadinessChecklistItem[];
};

export type RiskRegisterItem = {
  id: string;
  title: string;
  severity: RiskSeverity;
  affectedAudience: string;
  owner: string;
  mitigationPlan: string;
  status: RiskStatus;
  escalationPath: string;
};

export type SupportFaq = {
  question: string;
  answer: string;
};

export type SupportMacro = {
  title: string;
  trigger: string;
  response: string;
};

export type EscalationMatrixItem = {
  signal: string;
  routeTo: string;
  responseTime: string;
};

export type SupportPlaybook = {
  summary: string;
  faqs: SupportFaq[];
  macros: SupportMacro[];
  escalationMatrix: EscalationMatrixItem[];
  knownLimitations: string[];
  launchDayChecklist: string[];
};

export type FeedbackClassification = {
  productArea: string;
  featureWorkflow: string;
  category: FeedbackCategory;
  subcategory: string;
  issueType: string;
  severity: FeedbackSeverity;
  confidenceLevel: ConfidenceLevel;
  confidenceScore: number;
  likelyOwner: string;
  recommendedRoute: string;
  escalationStatus: string;
  humanReviewNeeded: string;
  userImpact: string;
  duplicateCluster: string;
  similarReports: number;
  uniqueCustomersAffected: number;
  trend: string;
  engineeringReadyProblemStatement: string;
  suggestedSupportResponse: string;
  recommendedNextAction: string;
  whyThisRoute: string;
  sourceChannel: string;
  customerSegment: string;
  status: string;
  feedbackId: string;
  createdFrom: string;
  prioritySignal: string;
  dashboardImpact: FeedbackDashboardImpact;
};

export type FeedbackDashboardImpact = {
  launchReadinessImpact: string;
  riskRegisterUpdate: string;
  supportHubUpdate: string;
  productEngineeringInsight: string;
};

export type FeedbackSample = {
  id: string;
  text: string;
  classification: FeedbackClassification;
};

export type ProductInsights = {
  feedbackVolumeByCategory: Partial<Record<FeedbackCategory, number>>;
  openHighSeverityIssues: string[];
  topCustomerPainPoints: string[];
  recommendedProductActions: string[];
  recommendedSupportActions: string[];
  launchReadinessConcerns: string[];
};

export type PartnerTimelineItem = {
  date: string;
  milestone: string;
  status: ReadinessStatus;
};

export type PartnerReadiness = {
  timeline: PartnerTimelineItem[];
  trainingStatus: string;
  supportContactPath: string[];
  knownLimitations: string[];
  readinessRequirements: string[];
  faqs: SupportFaq[];
};
