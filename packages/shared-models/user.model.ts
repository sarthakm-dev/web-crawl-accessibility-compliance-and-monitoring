import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@packages/shared-config/database';
import { Role } from './role.model';
import { BelongsToManyAddAssociationMixin } from 'sequelize';
import { Team } from './team.model';

export class User extends Model {
  declare id: string;
  declare email: string;
  declare passwordHash: string;
  declare isActive: boolean;
  declare name: string;
  declare Roles?: Role[];
  declare Teams?: Team[];
  declare addRole: BelongsToManyAddAssociationMixin<Role, string>;
  declare public addTeam: BelongsToManyAddAssociationMixin<Team, string>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
    },
    name: {
      type: DataTypes.STRING,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);
