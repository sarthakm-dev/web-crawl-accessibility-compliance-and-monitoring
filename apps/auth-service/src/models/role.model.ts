import {
  Model,
  DataTypes,
  BelongsToManySetAssociationsMixin,
} from 'sequelize';
import { sequelize } from "../../../../packages/shared-config/database";
import { Permission } from './permission.model';

export class Role extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  declare Permissions?: Permission[];
  declare setPermissions: BelongsToManySetAssociationsMixin<
    any,
    string
  >;

}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal("uuid_generate_v4()"),
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: false,
  },
);

