import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';

interface IssueNoteAttributes {
  id: string;
  issue_instance_id: string;
  user_id: string;
  note: string;
  created_at: Date;
}

type IssueNoteCreationAttributes = Optional<
  IssueNoteAttributes,
  'id' | 'created_at'
>;

export class IssueNote
  extends Model<IssueNoteAttributes, IssueNoteCreationAttributes>
  implements IssueNoteAttributes
{
  public id!: string;
  public issue_instance_id!: string;
  public user_id!: string;
  public note!: string;
  public created_at!: Date;
}

IssueNote.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    issue_instance_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'issue_notes',
    timestamps: false,
  }
);
