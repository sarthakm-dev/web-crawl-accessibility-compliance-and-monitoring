import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export class SiteIssueSummary extends Model {
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

SiteIssueSummary.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },

    site_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    crawl_job_id: {
      type: DataTypes.UUID,
    },

    total_issues: DataTypes.INTEGER,

    critical_count: DataTypes.INTEGER,

    serious_count: DataTypes.INTEGER,

    moderate_count: DataTypes.INTEGER,

    minor_count: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: 'site_issue_summary',
    timestamps: true,
    underscored: true,
  }
);
