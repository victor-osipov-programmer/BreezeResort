import jwt from 'jsonwebtoken'
import { Unauthorized } from './errors'
import { AppDataSource } from './db/data-source'
import { Users } from './db/entity'
import 'dotenv/config';
const secret_key = process.env.SECRET_KEY;

export function auth(roles) {
    return async (req, res, next) => {
        try {
            if (roles.length !== 0) {
                const token = req.get('Authorization')?.split(' ')[1]
                console.log('token', token)

                if (token) {
                    var payload = jwt.verify(token, secret_key)
                }

                const usersRepository = AppDataSource.getRepository(Users)
                const user = await usersRepository.findOneBy({
                    id: payload.user_id,
                    token
                })

                if (!token || !user) {
                    return next(new Unauthorized())
                }

                req.user = user;
                req.roles = roles;
            }

            next()
        } catch (err) {
            console.log('auth middleware error', err);
            return next(new Unauthorized())
        }
    }
}