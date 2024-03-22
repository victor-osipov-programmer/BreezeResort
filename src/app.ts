import { AppDataSource } from "./db/data-source";
import { Users } from "./db/entity";
import express from 'express'
import router from "./router";
import cors from 'cors'
import { handleErrors } from './utils'
import 'dotenv/config';

AppDataSource.initialize()
.then(() => console.log('AppDataSource.initialize'))

const app = express();
app.use(express.json())
app.use(cors())
app.use(router)
app.use(handleErrors)
console.log(process.env.PORT, process.env.SECRET_KEY)
app.listen(process.env.PORT, () => console.log('Server started'))
