import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export class SiteIssueSummary extends Model {
  declare id: string;
  declare site_id: string;
  declare crawl_job_id: string;

  declare total_issues: number;

  declare critical_count: number;
  declare serious_count: number;
  declare moderate_count: number;
  declare minor_count: number;

  declare created_at: Date;
  declare updated_at: Date;
}

SiteIssueSummary.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    site_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    crawl_job_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    total_issues: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    pages_crawled: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    critical_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    serious_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    moderate_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    minor_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    accessibility_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'site_issue_summary',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['site_id,crawl_job_id'],
      },
    ],
    underscored: true,
  }
);
