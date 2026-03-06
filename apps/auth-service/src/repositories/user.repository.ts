import { User } from '@packages/shared-models/user.model';
import { Role } from '@packages/shared-models/role.model';
import { Permission } from '@packages/shared-models/permission.model';
import { Team } from '@packages/shared-models/team.model';

export const UserRepository = {
  async findByEmail(email: string) {
    return User.findOne({ where: { email } });
  },

  async findByEmailWithRelations(email: string) {
    return User.findOne({
      where: { email },
      include: [
        { model: Role, include: [{ model: Permission }] },
        { model: Team, through: { attributes: [] } },
      ],
    });
  },

  async findByIdWithRelations(userId: string) {
    return User.findByPk(userId, {
      include: [
        { model: Role, include: [{ model: Permission }] },
        { model: Team, through: { attributes: [] } },
      ],
    });
  },

  async findBasicById(userId: string) {
    return User.findByPk(userId, {
      attributes: ['id', 'email', 'name', 'isActive', 'created_at'],
      include: [
        {
          model: Team,
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });
  },

  async create(data: { name: string; email: string; passwordHash: string }) {
    return User.create(data);
  },

  async addTeam(user: User, team: Team) {
    return user.addTeam(team);
  },

  async addRole(user: User, role: Role) {
    return user.addRole(role);
  },

  async updatePassword(user: User, passwordHash: string) {
    user.passwordHash = passwordHash;
    return user.save();
  },
};
