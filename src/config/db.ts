import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(process.env.DATABASE_URL as string,
    {
        models: [__dirname + '/../models/**/*.model.ts'],
        dialectOptions: {
            ssl: {
                require: true,
            }
        },
        logging: false
    }
);

export default db;