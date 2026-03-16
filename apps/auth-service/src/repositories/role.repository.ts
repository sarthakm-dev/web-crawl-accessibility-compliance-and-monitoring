import { Role } from '@packages/shared-models/role.model';

export const RoleRepository = {
  async findByName(name: string) {
    // return row with matching name
    return Role.findOne({ where: { name } });
  },
};
