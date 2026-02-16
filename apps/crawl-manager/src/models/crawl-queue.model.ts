import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../../packages/shared-config/database";

export class CrawlQueue extends Model {
  declare id: string;
  declare crawl_job_id: string;
  declare url: string;
  declare status: string;
  declare discovered_from: string | null;
  declare retry_count: number;
  declare created_at: Date;
}

CrawlQueue.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal("uuid_generate_v4()"),
      primaryKey: true,
    },
    crawl_job_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    discovered_from: {
      type: DataTypes.TEXT,
    },
    retry_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "crawl_queue",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);