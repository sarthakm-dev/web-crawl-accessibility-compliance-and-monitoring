import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export class Reports extends Model {
  declare id: string;

  declare site_id: string;
  declare crawl_job_id: string | null;

  declare requested_by: string | null;

  declare report_type: string;
  declare status: string;

  declare filters: object | null;

  declare bucket: string | null;
  declare object_key: string | null;

  declare file_size: number | null;

  declare generated_at: Date | null;
}

Reports.init(
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

    crawl_job_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    requested_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    report_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    filters: {
      type: DataTypes.JSONB,
      allowNull: true,
    },

    bucket: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    object_key: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    file_size: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    generated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'reports',
    timestamps: false,
  }
);
