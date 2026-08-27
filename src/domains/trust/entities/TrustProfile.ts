export type TrustBadgeType = "verified" | "active" | "trusted" | "professional";

export interface TrustBadge {
  type: TrustBadgeType;
  label: string;
}

export interface TrustVerification {
  label: string;
  verified: boolean;
}

export interface TrustScoreBreakdown {
  label: string;
  value: number;
}

export interface TrustIndicator {
  label: string;
  value: string;
  pct: number;
}

export interface TrustProof {
  label: string;
  verified: boolean;
}

export interface TrustTimelineEntry {
  text: string;
  when: string;
}

export interface TrustTransparencyEntry {
  label: string;
  value: string;
}

export interface TrustFeedback {
  id: string;
  authorName: string;
  authorVerified: boolean;
  text: string;
  tags: string[];
  createdAt: string;
}

export interface TrustProfile {
  id: string;
  name: string;
  handle: string;
  role: string;
  status: string;
  verified: boolean;
  score: number;
  breakdown: TrustScoreBreakdown[];
  verifications: TrustVerification[];
  badges: TrustBadge[];
  indicators: TrustIndicator[];
  proofs: TrustProof[];
  timeline: TrustTimelineEntry[];
  transparency: TrustTransparencyEntry[];
  feedbacks: TrustFeedback[];
}
