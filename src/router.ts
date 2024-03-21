import * as express from 'express'
import * as controllers from './controllers'
const router = express.Router()

router.post('/signup', controllers.signup)

export default router;