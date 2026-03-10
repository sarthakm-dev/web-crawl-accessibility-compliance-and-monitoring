import { DataTypes } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export const PageIssueSummary = sequelize.define(
  'PageIssueSummary',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },

    site_id: DataTypes.UUID,

    page_id: DataTypes.UUID,

    page_url: DataTypes.TEXT,

    crawl_job_id: DataTypes.UUID,

    total_issues: DataTypes.INTEGER,

    critical_count: DataTypes.INTEGER,

    serious_count: DataTypes.INTEGER,

    moderate_count: DataTypes.INTEGER,

    minor_count: DataTypes.INTEGER,
  },
  {
    tableName: 'page_issue_summary',
    timestamps: false,
  }
);
