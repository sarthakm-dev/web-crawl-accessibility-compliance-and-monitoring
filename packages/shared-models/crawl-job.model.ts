import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';
import { Site } from './site.model';
import { User } from './user.model';

export class CrawlJob extends Model {
  declare id: string;
  declare site_id: string;
  declare status: string;
  declare trigger_type: string;
  declare requested_by: string;
  declare started_at: Date | null;
  declare completed_at: Date | null;
  declare created_at: Date;
  declare Site?: Site;
  declare User?: User;
}

CrawlJob.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    site_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    trigger_type: {
      type: DataTypes.STRING,
    },
    requested_by: {
      type: DataTypes.UUID,
    },
    started_at: {
      type: DataTypes.DATE,
    },
    completed_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'crawl_jobs',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);
