export interface UserType {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isActive: boolean;
  roles?: string[];
}
