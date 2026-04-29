import type {
  FeedbackSample,
  OpenLoopSeedClusterProfile,
  OpenLoopSessionRecord,
} from "../../types/product-readiness-os";
import { getNextFeedbackId } from "./openloop-session";

const SEED_POOL_RECORD_COUNT = 70;
const SEED_RECORD_COUNT = 40;

const seedClusterWeights: Record<string, number> = {
  "SSO setup failures": 14,
  "Connector permissions confusion": 12,
  "Partner training gaps": 11,
  "Documentation mismatch": 10,
  "Voice audio cutoff": 8,
  "Admin onboarding confusion": 7,
  "Billing plan mismatch": 5,
  "Policy / Safety review confusion": 3,
};

const seedClusterProfiles: OpenLoopSeedClusterProfile[] = [
  {
    duplicateCluster: "Partner training gaps",
    category: "Partner Enablement",
    subcategory: "Training readiness",
    issueType: "Launch readiness gap",
    likelyOwner: "Partner Success",
    recommendedRoute: "Partner Success -> Product Ops",
    customerSegment: "External partners",
    featureWorkflow: "Partner launch training",
    defaultSeverities: ["Sev 3", "Sev 4", "Sev 4"],
    prioritySignal:
      "Recurring partner enablement gap affecting external support teams during the launch window.",
    sampleFeedback:
      "Partner support teams need clearer launch training before answering customer setup questions.",
    sourceChannel: "Partner escalation",
  },
  {
    duplicateCluster: "SSO setup failures",
    category: "Authentication / SSO",
    subcategory: "Authentication setup",
    issueType: "Launch blocker",
    likelyOwner: "Identity Engineering",
    recommendedRoute: "Support -> Identity Engineering escalation",
    customerSegment: "Enterprise admins using SSO",
    featureWorkflow: "SSO setup",
    defaultSeverities: ["Sev 2", "Sev 2", "Sev 3"],
    prioritySignal:
      "Recurring SSO setup failure affecting enterprise admins during the launch window.",
    sampleFeedback:
      "Enterprise admins report SSO setup failures when connecting the launch workspace.",
    sourceChannel: "Support ticket",
  },
  {
    duplicateCluster: "Connector permissions confusion",
    category: "Permissions",
    subcategory: "Access model clarity",
    issueType: "Usability / comprehension issue",
    likelyOwner: "Product Manager",
    recommendedRoute: "Support -> Product Ops -> Product Manager",
    customerSegment: "Enterprise admins",
    featureWorkflow: "Connector permissions",
    defaultSeverities: ["Sev 3", "Sev 4", "Sev 4"],
    prioritySignal:
      "Rising permissions confusion creating setup friction for enterprise admins.",
    sampleFeedback:
      "Admins are unsure which workspace permissions are required before connector setup.",
    sourceChannel: "Launch office hours",
  },
  {
    duplicateCluster: "Billing plan mismatch",
    category: "Billing",
    subcategory: "Plan eligibility",
    issueType: "Operational billing mismatch",
    likelyOwner: "Billing Ops",
    recommendedRoute: "Support -> Billing Ops -> Product Ops",
    customerSegment: "Billing administrators",
    featureWorkflow: "Plan validation",
    defaultSeverities: ["Sev 3", "Sev 4", "Sev 4"],
    prioritySignal: "Billing plan mismatch needs review before broader rollout.",
    sampleFeedback:
      "Billing admins see plan eligibility language that does not match launch access.",
    sourceChannel: "Sales handoff",
  },
  {
    duplicateCluster: "Documentation mismatch",
    category: "Documentation",
    subcategory: "Launch documentation accuracy",
    issueType: "Documentation gap",
    likelyOwner: "Documentation",
    recommendedRoute: "Support -> Documentation -> Product review",
    customerSegment: "Security reviewers and enterprise admins",
    featureWorkflow: "Setup documentation",
    defaultSeverities: ["Sev 4", "Sev 4", "Sev 5"],
    prioritySignal:
      "Rising documentation mismatch creating avoidable support volume.",
    sampleFeedback:
      "Customers report that setup docs and launch FAQs describe different approval steps.",
    sourceChannel: "Documentation review",
  },
  {
    duplicateCluster: "Policy / Safety review confusion",
    category: "Policy / Safety",
    subcategory: "Review path clarity",
    issueType: "Policy review routing issue",
    likelyOwner: "Policy / Safety",
    recommendedRoute: "Support -> Policy / Safety -> Product Ops",
    customerSegment: "Policy reviewers",
    featureWorkflow: "Safety review handoff",
    defaultSeverities: ["Sev 3", "Sev 4", "Sev 4"],
    prioritySignal:
      "Policy review routing confusion needs owner clarity before launch expansion.",
    sampleFeedback:
      "Policy reviewers need a clearer route for launch safety review questions.",
    sourceChannel: "Internal QA",
  },
  {
    duplicateCluster: "Voice audio cutoff",
    category: "Voice",
    subcategory: "Audio reliability",
    issueType: "Workflow failure",
    likelyOwner: "Voice Engineering",
    recommendedRoute: "Support -> Voice Engineering",
    customerSegment: "Enterprise pilot users",
    featureWorkflow: "Voice session playback",
    defaultSeverities: ["Sev 2", "Sev 3", "Sev 3"],
    prioritySignal:
      "Recurring voice audio cutoff affecting enterprise pilot users during launch validation.",
    sampleFeedback:
      "Enterprise pilot users report voice audio cutting off during launch validation sessions.",
    sourceChannel: "Customer success note",
  },
  {
    duplicateCluster: "Admin onboarding confusion",
    category: "Permissions",
    subcategory: "Admin setup guidance",
    issueType: "Onboarding comprehension issue",
    likelyOwner: "Product Ops",
    recommendedRoute: "Support -> Product Ops",
    customerSegment: "Workspace administrators",
    featureWorkflow: "Admin onboarding",
    defaultSeverities: ["Sev 4", "Sev 4", "Sev 5"],
    prioritySignal:
      "Admin onboarding confusion is creating repeated setup friction across launch accounts.",
    sampleFeedback:
      "Workspace administrators are unsure which onboarding step to complete after invite acceptance.",
    sourceChannel: "Support ticket",
  },
];

export function buildSeedSessionRecords(
  samples: FeedbackSample[],
  existingRecords: OpenLoopSessionRecord[],
) {
  if (samples.length === 0) {
    return [];
  }

  const humanReviewStatuses = ["No", "No", "Review recommended", "Yes"];
  const now = Date.now();
  const firstSeedIdNumber =
    Number(getNextFeedbackId(existingRecords).replace("FB-", "")) || 1028;
  const weightedProfiles = getWeightedSeedProfiles(now).slice(
    0,
    SEED_RECORD_COUNT,
  );

  return Array.from({ length: SEED_RECORD_COUNT }, (_, index) => {
    const profile = weightedProfiles[index % weightedProfiles.length];
    const baseSample =
      samples.find((sample) => sample.classification.category === profile.category) ??
      samples[index % samples.length];
    const department = profile.likelyOwner;
    const feedbackId = `FB-${firstSeedIdNumber + index}`;
    const severity =
      profile.defaultSeverities[index % profile.defaultSeverities.length];
    const humanReviewNeeded =
      humanReviewStatuses[index % humanReviewStatuses.length];
    const createdAt = getSeedCreatedAt(now, index);
    const confidenceScore =
      humanReviewNeeded === "Yes"
        ? 58
        : humanReviewNeeded === "Review recommended"
          ? 76
          : Math.max(baseSample.classification.confidenceScore, 85);
    const confidenceLevel =
      confidenceScore >= 85 ? "High" : confidenceScore >= 65 ? "Medium" : "Low";
    const sessionSample: FeedbackSample = {
      ...baseSample,
      id: `${baseSample.id}-seed-${index}`,
      text: `${profile.sourceChannel}: ${profile.sampleFeedback}`,
      classification: {
        ...baseSample.classification,
        category: profile.category,
        confidenceLevel,
        confidenceScore,
        createdFrom: "Seed sample launch feedback",
        customerSegment: profile.customerSegment,
        duplicateCluster: profile.duplicateCluster,
        featureWorkflow: profile.featureWorkflow,
        feedbackId,
        humanReviewNeeded,
        issueType: profile.issueType,
        likelyOwner: profile.likelyOwner,
        prioritySignal: profile.prioritySignal,
        recommendedRoute: profile.recommendedRoute,
        severity,
        sourceChannel: profile.sourceChannel,
        status: humanReviewNeeded === "Yes" ? "Needs review" : "Routed",
        subcategory: profile.subcategory,
      },
    };

    return {
      sessionId: `${feedbackId}-seed-${now + index}`,
      text: sessionSample.text,
      source: "Seed sample launch feedback" as const,
      department,
      createdAt,
      ingestedAt: createdAt,
      classification: sessionSample.classification,
    };
  });
}

export function getSeedClusterProfile(clusterName: string) {
  return seedClusterProfiles.find(
    (profile) =>
      profile.duplicateCluster.toLowerCase() === clusterName.toLowerCase(),
  );
}

function getWeightedSeedProfiles(seed: number) {
  const weightedProfiles = Array.from(
    { length: SEED_POOL_RECORD_COUNT },
    (_, index) => getWeightedSeedProfile(index),
  );

  return shuffleSeedProfiles(weightedProfiles, seed);
}

function getWeightedSeedProfile(index: number) {
  let remainingIndex = index % getSeedPoolWeight();

  for (const profile of seedClusterProfiles) {
    const weight = seedClusterWeights[profile.duplicateCluster] ?? 1;

    if (remainingIndex < weight) {
      return profile;
    }

    remainingIndex -= weight;
  }

  return seedClusterProfiles[0];
}

function getSeedPoolWeight() {
  return seedClusterProfiles.reduce(
    (totalWeight, profile) =>
      totalWeight + (seedClusterWeights[profile.duplicateCluster] ?? 1),
    0,
  );
}

function shuffleSeedProfiles(
  profiles: OpenLoopSeedClusterProfile[],
  seed: number,
) {
  const shuffledProfiles = [...profiles];
  let randomSeed = seed % 2147483647;

  for (let index = shuffledProfiles.length - 1; index > 0; index -= 1) {
    randomSeed = (randomSeed * 16807) % 2147483647;
    const swapIndex = randomSeed % (index + 1);
    const currentProfile = shuffledProfiles[index];

    shuffledProfiles[index] = shuffledProfiles[swapIndex];
    shuffledProfiles[swapIndex] = currentProfile;
  }

  return shuffledProfiles;
}

function getSeedCreatedAt(now: number, index: number) {
  const hour = 60 * 60 * 1000;
  const offsetHours =
    index % 5 === 0
      ? 2 + (index % 4)
      : index % 3 === 0
        ? 12 + (index % 8)
        : 26 + (index % 46);

  return new Date(now - offsetHours * hour).toISOString();
}
