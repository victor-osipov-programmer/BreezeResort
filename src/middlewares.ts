import jwt from 'jsonwebtoken'
import { Unauthorized } from './errors'
import { AppDataSource } from './db/data-source'
import { User } from './db/entity'
const secret_key = process.env.SECRET_KEY;

export function auth(roles) {
    return async (req, res, next) => {
        try {
            if (roles.length !== 0) {
                const token = req.get('Authorization')?.split(' ')[1]
                if (!token) {
                    return next(new Unauthorized())
                }

                let payload = jwt.verify(token, secret_key)

                const usersRepository = AppDataSource.getRepository(User)
                const user = await usersRepository.findOne({
                    where: {
                        id: payload.user_id,
                        token
                    },
                    relations: {
                        role: true
                    }
                })

                if (!user || user.token != token || !roles.includes(user.role.name)) {
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