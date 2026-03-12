import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export class PageIssueSummary extends Model {
  declare id: string;
  declare site_id: string;
  declare page_id: string;
  declare page_url: string;
  declare crawl_job_id: string;

  declare total_issues: number;
  declare critical_count: number;
  declare serious_count: number;
  declare moderate_count: number;
  declare minor_count: number;
}

PageIssueSummary.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },

    site_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    page_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    page_url: {
      type: DataTypes.TEXT,
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
  },
  {
    sequelize,
    tableName: 'page_issue_summary',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['site_id', 'page_id', 'crawl_job_id'],
      },
    ],
  }
);
