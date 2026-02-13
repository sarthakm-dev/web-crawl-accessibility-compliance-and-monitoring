import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../../packages/shared-config/database";

export class Permission extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
}

Permission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal("uuid_generate_v4()"),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "permissions",
    timestamps: false,
  }
);
