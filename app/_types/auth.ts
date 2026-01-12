export interface UserType {
  member_id: string;
  name: string;
  email: string;
  role?: "admin" | "user";
}
