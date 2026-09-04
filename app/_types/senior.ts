export type SeniorQuestionOption = {
  label: string;
  value: string;
};

export type SeniorQuestion = {
  id: string;
  domain: "financial" | "health" | "leisure" | "relationship";
  title: string;
  type: "select" | "amount" | "multi-select" | "number" | "boolean";
  options?: SeniorQuestionOption[];
  placeholder?: string;
  unit?: string;
  step?: number;
  followUp?: {
    condition: string;
    question: SeniorQuestion;
  };
};

export type SeniorResult = {
  result_id: string;
  score: number;
  grade: string;
  domains: {
    financial: number;
    health: number;
    leisure: number;
    relationship: number;
  };
  assetMix: {
    realEstate: number;
    financial: number;
    pension: number;
  };
  advice: string;
  created_at: string;
};
