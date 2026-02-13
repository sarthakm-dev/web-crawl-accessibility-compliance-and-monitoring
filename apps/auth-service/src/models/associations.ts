import { User } from './user.model';
import { Role } from './role.model';
import { Permission } from './permission.model';
import { UserRole } from './user-role.model';
import { RolePermission } from './role-permission.model';

export function setupAssociations() {
    console.log("Role",Role);
  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'user_id',
  });
  console.log("User",User);
  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: 'role_id',
  });
  console.log("Permission",Permission);
  Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: 'role_id',
  });
  console.log("Role",Role);
  Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: 'permission_id',
  });
}