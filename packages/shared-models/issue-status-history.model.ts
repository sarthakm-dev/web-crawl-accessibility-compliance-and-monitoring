import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export class IssueStatusHistory extends Model {
  public id!: string;
  public issue_instance_id!: string;
  public previous_status!: string;
  public new_status!: string;
  public changed_by!: string;
  public changed_at!: Date;
  public note!: string;
}

IssueStatusHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
      primaryKey: true,
    },
    issue_instance_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    previous_status: DataTypes.STRING,
    new_status: DataTypes.STRING,
    changed_by: DataTypes.UUID,
    changed_at: DataTypes.DATE,
    note: DataTypes.TEXT,
  },
  {
    sequelize,
    tableName: 'issue_status_history',
    timestamps: false,
  }
);
