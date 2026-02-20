export interface UserType {
  id: string;
  name: string;
  email: string;
  created_at: string;
  isActive: boolean;
  Roles?: { name: string }[];
}
