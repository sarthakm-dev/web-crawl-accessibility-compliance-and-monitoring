import { User } from './user.model';
import { Role } from './role.model';
import { Permission } from './permission.model';
import { UserRole } from './user-role.model';
import { RolePermission } from './role-permission.model';

export function setupAssociations() {
  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'user_id',
  });
  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: 'role_id',
  });
  Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: 'role_id',
  });
  Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: 'permission_id',
  });
}
