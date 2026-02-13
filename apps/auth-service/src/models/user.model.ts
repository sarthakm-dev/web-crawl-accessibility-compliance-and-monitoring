import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../../packages/shared-config/database";
import { Role } from "./role.model";
import { BelongsToManyAddAssociationMixin } from "sequelize";

export class User extends Model {
  declare id: string;
  declare email: string;
  declare passwordHash: string;
  declare isActive: boolean;

  declare Roles?: Role[];
  declare addRole: BelongsToManyAddAssociationMixin<Role,string>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal("uuid_generate_v4()"),
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password_hash"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active"
    }
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    underscored: true
  }
);
