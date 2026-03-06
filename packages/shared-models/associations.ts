import { User } from './user.model';
import { Role } from './role.model';
import { Permission } from './permission.model';
import { UserRole } from './user-role.model';
import { RolePermission } from './role-permission.model';
import { Team } from './team.model';
import { Site } from './site.model';
import { CrawlJob } from './crawl-job.model';
import { CrawlQueue } from './crawl-queue.model';
import { Page } from './page.model';
import { IssueInstance } from './issue-instance.model';
import { IssueNote } from './issue-note.model';
import { IssueDefinition } from './issue-definition.model';
import { PageVersion } from './page-version.model';
import { IssueStatusHistory } from './issue-status-history.model';

export function setupAssociations() {
  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'user_id',
  });
  User.belongsToMany(Team, {
    through: 'team_members',
    foreignKey: 'user_id',
  });

  Team.belongsToMany(User, {
    through: 'team_members',
    foreignKey: 'team_id',
  });
  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: 'role_id',
  });
  Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: 'role_id',
  });
  Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: 'permission_id',
  });
  Site.hasMany(CrawlJob, { foreignKey: 'site_id' });
  CrawlJob.belongsTo(Site, { foreignKey: 'site_id' });
  CrawlJob.belongsTo(User, { foreignKey: 'requested_by' });
  CrawlJob.hasMany(CrawlQueue, { foreignKey: 'crawl_job_id' });
  CrawlQueue.belongsTo(CrawlJob, { foreignKey: 'crawl_job_id' });
  PageVersion.hasMany(IssueInstance, {
    foreignKey: 'page_version_id',
  });
  Page.hasMany(PageVersion, {
    foreignKey: 'page_id',
  });
  PageVersion.belongsTo(Page, {
    foreignKey: 'page_id',
  });
  IssueInstance.belongsTo(PageVersion, {
    foreignKey: 'page_version_id',
  });
  Site.hasMany(Page, { foreignKey: 'site_id' });
  Page.belongsTo(Site, { foreignKey: 'site_id' });
  IssueInstance.hasMany(IssueNote, {
    foreignKey: 'issue_instance_id',
  });
  IssueInstance.belongsTo(IssueDefinition, {
    foreignKey: 'issue_definition_id',
  });
  IssueDefinition.hasMany(IssueInstance, {
    foreignKey: 'issue_definition_id',
  });
  IssueNote.belongsTo(IssueInstance, {
    foreignKey: 'issue_instance_id',
  });
  IssueInstance.hasMany(IssueStatusHistory, {
    foreignKey: 'issue_instance_id',
  });
  IssueStatusHistory.belongsTo(IssueInstance, {
    foreignKey: 'issue_instance_id',
  });
  IssueStatusHistory.belongsTo(User, {
    foreignKey: 'changed_by',
  });
  User.hasMany(IssueStatusHistory, {
    foreignKey: 'changed_by',
  });
  IssueNote.belongsTo(User, {
    foreignKey: 'user_id',
  });
}
