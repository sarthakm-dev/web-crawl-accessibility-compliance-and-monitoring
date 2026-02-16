import { sequelize } from "../../../../packages/shared-config/database";
import { setupAssociations } from "./associations";

export async function initModels() {
  setupAssociations();
  await sequelize.sync({alter:true});
}