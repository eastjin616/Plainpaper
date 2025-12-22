import type { ComponentType } from "react";

export type WorkspaceItem = {
  id: string;
  name: string;
  type: string;
  members: string;
  documents: number;
  summary: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  app: string;
  status: string;
  time: string;
};

export type AppItem = {
  id: string;
  name: string;
  description: string;
  status: "live" | "soon";
  cta: string;
  href?: string;
  iconName: "file-text" | "layers" | "message-circle-question" | "line-chart";
  icon?: ComponentType<{ className?: string }>;
};
