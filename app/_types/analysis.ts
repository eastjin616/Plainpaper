export type AnalysisMetrics = {
  readability: number;
  reliability: number;
  risk: number;
};

export type AnalysisResult = {
  status: "done" | "pending" | "not_found";
  summary: string;
  description: string[];
  highlights: string[];
  metrics: AnalysisMetrics;
};
