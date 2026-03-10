import { DataTypes } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export const Reports = sequelize.define(
  'Reports',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },

    site_id: DataTypes.UUID,

    crawl_job_id: DataTypes.UUID,

    requested_by: DataTypes.UUID,

    report_type: DataTypes.STRING,

    status: DataTypes.STRING,

    filters: DataTypes.JSONB,

    bucket: DataTypes.STRING,

    object_key: DataTypes.TEXT,

    file_size: DataTypes.BIGINT,

    generated_at: DataTypes.DATE,
  },
  {
    tableName: 'reports',
    timestamps: false,
  }
);
