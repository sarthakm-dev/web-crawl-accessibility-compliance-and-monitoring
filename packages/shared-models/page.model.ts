import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export class Page extends Model {
  declare id: string;
  declare site_id: string;
  declare url: string;
  declare first_discovered_at: Date;
  declare last_seen_at: Date;
  declare status: string;
}

Page.init(
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
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    first_discovered_at: {
      type: DataTypes.DATE,
    },
    last_seen_at: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'pages',
    underscored: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['site_id', 'url'],
      },
    ],
  }
);
