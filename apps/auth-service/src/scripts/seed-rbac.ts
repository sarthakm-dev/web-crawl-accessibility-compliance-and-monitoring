import { sequelize } from '@packages/shared-config/database';
import { Permission } from '@packages/shared-models/permission.model';
import { Role } from '@packages/shared-models/role.model';
import { initModels } from '@packages/shared-models/init-models';
import { logger } from '@packages/shared-config/logger';

async function seed() {
  initModels();
  sequelize.authenticate().then(() => {
    logger.info('Seed database connected');
  });

  const allPermissions = [
    'site:create',
    'site:update',
    'site:delete',
    'site:view',
    'crawl:trigger',
    'crawl:view',
    'crawl:delete',
    'issue:create',
    'issue:update',
    'issue:view',
    'issue:resolve',
    'report:view',
  ];

  await Promise.all(
    allPermissions.map(name => Permission.findOrCreate({ where: { name } }))
  );

  const [admin] = await Role.findOrCreate({ where: { name: 'admin' } });
  const [developer] = await Role.findOrCreate({ where: { name: 'developer' } });
  const [viewer] = await Role.findOrCreate({ where: { name: 'viewer' } });

  const permissions = await Permission.findAll();

  const getPerms = async (names: string[]) =>
    Permission.findAll({ where: { name: names } });

  await admin.setPermissions(permissions);

  await developer.setPermissions(
    await getPerms([
      'site:view',
      'crawl:view',
      'crawl:trigger',
      'issue:create',
      'issue:update',
      'issue:resolve',
      'issue:view',
      'report:view',
    ])
  );

  await viewer.setPermissions(
    await getPerms(['site:view', 'issue:view', 'report:view', 'crawl:view'])
  );
}

seed();
