import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

export class IssueAnalytics extends Model {
  public id!: string;
  public site_id!: string;
  public page_id!: string;
  public page_url!: string;
  public crawl_job_id!: string;
  public page_version_id!: string;
  public issue_instance_id!: string;
  public issue_definition_id!: string;

  public rule_id!: string;
  public rule_description!: string;
  public wcag_rule!: string;

  public severity!: string;

  public selector!: string;
  public message!: string;
  public status!: string;

  public detected_at!: Date;
}

IssueAnalytics.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    site_id: DataTypes.UUID,

    page_id: DataTypes.UUID,

    page_url: DataTypes.TEXT,

    crawl_job_id: DataTypes.UUID,

    page_version_id: DataTypes.UUID,

    issue_instance_id: DataTypes.UUID,

    issue_definition_id: DataTypes.UUID,

    rule_id: DataTypes.TEXT,

    rule_description: DataTypes.TEXT,

    wcag_rule: DataTypes.TEXT,

    severity: DataTypes.TEXT,

    selector: DataTypes.TEXT,

    message: DataTypes.TEXT,

    status: DataTypes.TEXT,

    detected_at: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'issue_analytics',
    timestamps: false,
  }
);
