import * as express from 'express'
import * as controllers from './controllers'
import { auth } from './middlewares'
const router = express.Router()

router.post('/signup', auth([]), controllers.signup)

export default router;