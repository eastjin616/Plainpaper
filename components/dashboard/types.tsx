export type ActivityItem = {
  id: string;
  title: string;
  app: string;
  status: string;
  time: string;
  author?: string;
};

export type AppItem = {
  id: string;
  name: string;
  description: string;
  status: "live" | "soon";
  cta: string;
  href?: string;
  iconName:
    | "file-text"
    | "layers"
    | "message-circle-question"
    | "line-chart"
    | "heart-pulse";
  icon?: React.ComponentType<{ className?: string }>;
};

export type DocStats = {
  total: number;
  done: number;
  processing: number;
  error: number;
};
