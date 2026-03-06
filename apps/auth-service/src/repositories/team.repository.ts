import { Team } from '@packages/shared-models/team.model';

export const TeamRepository = {
  async findOrCreateDefault() {
    return Team.findOrCreate({
      where: { name: 'Default' },
      defaults: { description: 'Default team' },
    });
  },
};
