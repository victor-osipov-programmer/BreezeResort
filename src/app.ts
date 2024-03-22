import 'dotenv/config';
import { AppDataSource } from "./db/data-source";
import { Users } from "./db/entity";
import express from 'express'
import router from "./router";
import cors from 'cors'
import { handleErrors } from './utils'

AppDataSource.initialize()
.then(() => console.log('AppDataSource.initialize'))

const app = express();
app.use(express.json())
app.use(cors())
app.use(router)
app.use(handleErrors)
app.listen(process.env.PORT, () => console.log('Server started'))
