import { AppDataSource } from "./db/data-source";
import { Users } from "./db/entity";
import express from 'express'
import router from "./router";
import 'dotenv/config'

AppDataSource.initialize()
.then(() => console.log('AppDataSource.initialize'))

const app = express();
app.use(router)
app.listen(process.env.PORT, () => console.log('Server started'))
