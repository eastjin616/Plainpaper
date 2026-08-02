export type BoardItem = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  status: string;
  isImportant: boolean;
  commentCount?: number;
};

export type BoardDetail = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  status: string;
  content: string;
  answer: string | null;
};

export type BoardComment = {
  id: string;
  contents: string | null;
  createdAt: string;
  createdBy: string | null;
};
