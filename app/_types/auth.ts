export interface UserType {
  member_id: string;
  name: string;
  username: string;
  email?: string | null;
  role?: "admin" | "user";
}
