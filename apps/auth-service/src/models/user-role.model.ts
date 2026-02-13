import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../../packages/shared-config/database";

export class UserRole extends Model {}

UserRole.init(
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: "user_roles",
    timestamps: false,
  }
);