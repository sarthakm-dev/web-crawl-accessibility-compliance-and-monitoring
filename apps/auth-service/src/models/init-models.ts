import './user.model';
import './role.model';
import './permission.model';
import './user-role.model';
import './role-permission.model';

import { setupAssociations } from './associations';

export function initModels() {
  setupAssociations();
}