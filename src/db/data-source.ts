import "reflect-metadata"
import { DataSource } from "typeorm"
import { Users, Roles, Rooms } from "./entity"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "typeorm",
    synchronize: true,
    logging: false,
    entities: [ Users, Roles, Rooms ],
    subscribers: [],
    migrations: [],
})