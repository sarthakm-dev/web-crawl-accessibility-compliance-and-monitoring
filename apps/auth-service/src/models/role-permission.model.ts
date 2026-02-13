import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../../packages/shared-config/database";
export class RolePermission extends Model {}

RolePermission.init(
  {
    role_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    permission_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: "role_permissions",
    timestamps: false,
  }
);