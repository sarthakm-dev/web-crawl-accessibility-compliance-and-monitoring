import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../../packages/shared-config/database";

export class Site extends Model {
  declare id: string;
  declare team_id: string;
  declare name: string;
  declare base_url: string;
  declare is_active: boolean;
  declare created_at: Date;
}

Site.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal("uuid_generate_v4()"),
      primaryKey: true,
    },
    team_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    base_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "sites",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);