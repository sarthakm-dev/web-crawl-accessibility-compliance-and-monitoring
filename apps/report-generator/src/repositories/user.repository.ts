import { User } from "@packages/shared-models/user.model";

export const UserRepository = {
  async findById(userId: string) {
    return User.findByPk(userId, {
      attributes: ["id", "email", "name"],
    });
  },
};