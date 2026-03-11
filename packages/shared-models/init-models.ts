import './user.model';
import './role.model';
import './permission.model';
import './user-role.model';
import './role-permission.model';
import './issue-analytics.model';
import './page-issue-summary.model';
import './reports.model';
import './site-issue-summary.model';

import { setupAssociations } from './associations';

export async function initModels() {
  setupAssociations();
}
