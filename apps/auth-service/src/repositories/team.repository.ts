import { Team } from '@packages/shared-models/team.model';

export const TeamRepository = {
  async findOrCreateDefault() {
    // return row if found else create new team
    return Team.findOrCreate({
      where: { name: 'Default' },
      defaults: { description: 'Default team' },
    });
  },
};
