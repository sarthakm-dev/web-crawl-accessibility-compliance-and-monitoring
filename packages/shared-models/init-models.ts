import './user.model';
import './role.model';
import './permission.model';
import './user-role.model';
import './role-permission.model';
import { sequelize } from '@packages/shared-config/database';
import { setupAssociations } from './associations';

export async function initModels() {
  setupAssociations();
  await sequelize.sync({ alter: true });
}
