import "reflect-metadata"
import { DataSource } from "typeorm"
import { User, Role, Room, Hotel } from "./entity"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "typeorm",
    synchronize: true,
    logging: false,
    entities: [ User, Role, Room, Hotel ],
    subscribers: [],
    migrations: [],
})