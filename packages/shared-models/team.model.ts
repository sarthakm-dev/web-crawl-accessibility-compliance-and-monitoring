import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export class Team extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare created_at: Date;
}

Team.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'teams',
    timestamps: true,
    underscored: true,
  }
);
