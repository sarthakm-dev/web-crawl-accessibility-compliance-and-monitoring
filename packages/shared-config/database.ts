import { Sequelize } from "sequelize";

declare global {
  var _sequelize_: Sequelize | undefined;
}

export const sequelize =
  global._sequelize_ ??
  new Sequelize(
    process.env.DB_NAME || "webcrawl",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "postgres",
    {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5433,
      dialect: "postgres",
      logging: false,
    }
  );

if (!global._sequelize_) {
  global._sequelize_ = sequelize;
}