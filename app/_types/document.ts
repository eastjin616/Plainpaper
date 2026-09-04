export type DocumentItem = {
  document_id: string;
  file_name: string;
  created_at: string;
  status: string;
  summary: string;
  member_name?: string | null;
};
