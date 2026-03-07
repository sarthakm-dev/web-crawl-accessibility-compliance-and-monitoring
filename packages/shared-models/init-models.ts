import './user.model';
import './role.model';
import './permission.model';
import './user-role.model';
import './role-permission.model';
import './team.model';
import './site.model';
import './crawl-job.model';
import './crawl-queue.model';
import './page.model';
import './page-version.model';
import './issue-definition.model';
import './issue-instance.model';
import './issue-note.model';
import './issue-status-history.model';
import { setupAssociations } from './associations';

export async function initModels() {
  setupAssociations();
}
