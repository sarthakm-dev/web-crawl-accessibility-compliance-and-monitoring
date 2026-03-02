import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export class IssueInstance extends Model {
  public id!: string;
  public page_version_id!: string;
  public issue_definition_id!: string;
  public element_selector!: string;
  public message!: string;
  public impact!: string;
  public first_detected_at!: Date;
  public current_status!: string;
}

IssueInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
      primaryKey: true,
    },
    page_version_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    issue_definition_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    element_selector: DataTypes.TEXT,
    message: DataTypes.TEXT,
    impact: DataTypes.STRING,
    first_detected_at: DataTypes.DATE,
    current_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'issue_instances',
    timestamps: false,
  }
);
