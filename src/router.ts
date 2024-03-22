import * as express from 'express'
import * as controllers from './controllers'
import { auth } from './middlewares'
const router = express.Router()

router.post('/signup', auth([]), controllers.signup)
router.post('/login', auth([]), controllers.login)
router.post('/room', auth(['admin']), controllers.room)

export default router;