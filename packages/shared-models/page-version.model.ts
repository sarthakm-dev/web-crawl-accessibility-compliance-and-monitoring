import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export class PageVersion extends Model {
  public id!: string;
  public page_id!: string;
  public crawl_job_id!: string;
  public http_status!: number;
  public content_hash!: string;
  public title!: string;
  public content_size!: number;
  public html_path!: string;
  public crawled_at!: Date;
  public analysis_status!: 'pending' | 'completed' | 'failed';
}

PageVersion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    page_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    crawl_job_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    http_status: DataTypes.INTEGER,
    content_hash: DataTypes.TEXT,
    title: DataTypes.TEXT,
    content_size: DataTypes.INTEGER,
    html_path: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    crawled_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    analysis_status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'page_versions',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['page_id', 'content_hash', 'crawl_job_id'],
      },
    ],
  }
);
