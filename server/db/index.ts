import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(`${process.env.POSTGRES_CREDS}`);

try {
  sequelize.authenticate().then(() => {
    console.log("Connection has been established successfully.");
  });
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
