import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export class SiteDailyMetrics extends Model {
  declare id: string;
  declare site_id: string;
  declare date: Date;

  declare pages_crawled: number;
  declare total_issues: number;

  declare critical_issues: number;
  declare serious_issues: number;
  declare moderate_issues: number;
  declare minor_issues: number;

  declare accessibility_score: number;
}

SiteDailyMetrics.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    site_id: DataTypes.UUID,

    date: DataTypes.DATEONLY,

    pages_crawled: DataTypes.INTEGER,
    total_issues: DataTypes.INTEGER,

    critical_issues: DataTypes.INTEGER,
    serious_issues: DataTypes.INTEGER,
    moderate_issues: DataTypes.INTEGER,
    minor_issues: DataTypes.INTEGER,

    accessibility_score: DataTypes.FLOAT,
  },
  {
    sequelize,
    tableName: 'site_daily_metrics',
    timestamps: true,
    underscored: true,
  }
);
