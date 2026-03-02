import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export class IssueDefinition extends Model {
  public id!: string;
  public rule_code!: string;
  public name!: string;
  public description!: string;
  public severity!: string;
  public wcag_reference!: string;
}

IssueDefinition.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
      primaryKey: true,
    },
    rule_code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    severity: DataTypes.STRING,
    wcag_reference: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: 'issue_definitions',
    timestamps: false,
  }
);
