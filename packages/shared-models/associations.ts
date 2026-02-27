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

  Site.hasMany(Page, { foreignKey: 'site_id' });
  Page.belongsTo(Site, { foreignKey: 'site_id' });
}
