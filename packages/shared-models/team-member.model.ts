import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export class TeamMember extends Model {}

TeamMember.init(
  {
    team_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: 'team_members',
    timestamps: true,
    underscored: true,
  }
);
