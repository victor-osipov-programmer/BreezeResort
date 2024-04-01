import * as express from 'express'
import * as controllers from './controllers'
import { auth } from './middlewares'
const router = express.Router()

router.post('/signup', auth([]), controllers.signup)
router.post('/login', auth([]), controllers.login)
router.post('/room', auth(['admin']), controllers.room)
router.get('/rooms', auth(['admin']), controllers.rooms)
router.delete('/room/:id', auth(['admin']), controllers.deleteRoom)
router.post('/register', auth(['admin']), controllers.register)

export default router;