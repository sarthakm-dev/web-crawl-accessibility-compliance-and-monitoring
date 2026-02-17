export interface UserType {
  id: string
  name: string
  email: string
  created_at: string
  is_active: boolean
  Roles?: { name: string }[]
}