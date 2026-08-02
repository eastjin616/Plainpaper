export type AnalyticsKpi = {
  label: string;
  key: string;
  value: number;
  delta: number;
};

export type AnalyticsSegment = {
  label: string;
  value: number;
  color: string;
};

export type AnalyticsType = {
  label: string;
  value: number;
  color: string;
};

export type AnalyticsTrend = {
  labels: string[];
  documents: number[];
  ai: number[];
  questions: number[];
};

export type AnalyticsOverview = {
  kpis: AnalyticsKpi[];
  trend: {
    "7d": AnalyticsTrend;
    "30d": AnalyticsTrend;
  };
  risk: AnalyticsSegment[];
  types: AnalyticsType[];
};

export type RiskyDocument = {
  name: string;
  type: string;
  score: number;
};

export type RecentDocument = {
  name: string;
  type: string;
  status: string;
  uploadedAt: string | null;
};

export type AnalyticsDocuments = {
  risk: AnalyticsSegment[];
  types: AnalyticsType[];
  risky: RiskyDocument[];
  recent: RecentDocument[];
};

export type AgentSummary = {
  label: string;
  value: number;
  color: string;
};

export type UsageTrendPoint = {
  label: string;
  usage: number;
};

export type UserUsage = {
  name: string;
  role: string;
  uploads: number;
  calls: number;
};

export type AiModelInfo = {
  name: string;
  provider: string;
  version: string;
  description: string;
};

export type AnalyticsAiUsage = {
  agentSummary: AgentSummary[];
  trend: {
    "7d": UsageTrendPoint[];
    "30d": UsageTrendPoint[];
  };
  users: UserUsage[];
  models: AiModelInfo[];
};
