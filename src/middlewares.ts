import jwt from 'jsonwebtoken'
import { Unauthorized } from './errors'

export function auth(roles) {
    return (req, res, next) => {
        const token = req.get('Authorization')?.split(' ')[1]
        if (!token && roles.length !== 0) {
            return next(new Unauthorized())
        }
        console.log(token)
    }
}