import { DataSource } from "typeorm";
import { User } from "./models/user.model";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root", // ✅ your MySQL username
  password: "test@1234", // ✅ your MySQL password (or leave empty)
  database: "my_app_db", // ✅ the DB you just created
  synchronize: true, // ✅ auto create tables based on entities
  logging: true,
  entities: [User], // ✅ all your entity classes
});
