import 'dotenv/config';
import { AppDataSource } from "./db/data-source";
import express from 'express'
import cors from 'cors'
import { handleErrors } from './utils'
import { getRoles } from './db/init'
import router from "./router";

AppDataSource.initialize()
.then(() => {
    getRoles()
    console.log('AppDataSource.initialize')
})

const app = express();
app.use(express.json())
app.use(cors())
app.use(router)
app.use(handleErrors)
app.listen(process.env.PORT, () => console.log('Server started'))