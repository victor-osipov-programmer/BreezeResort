import { AppDataSource } from './db/data-source';
import { Users, Roles } from './db/entity';
import { Validator } from './errors';

export async function signup(req, res, next) {
    const usersRepository = AppDataSource.getRepository(Users)
    const rolesRepository = AppDataSource.getRepository(Roles)
    const body = req.body;
    const { username, password } = body;

    const { validate, reportError } = new Validator(body)
    validate('username', 'required')
    validate('password', 'required')
    if (reportError(next)) return

    const role = await rolesRepository.findOneBy({name: 'admin'})

    const user = new Users();
    user.username = username;
    user.password = password;
    user.role = role;

    await usersRepository.save(user);

    res.json({
        data: {
            message: 'Administrator created'
        }
    })
}