import { AppDataSource } from './db/data-source';
import { Users, Roles, Rooms } from './db/entity';
import { GeneralError, Unauthorized, Validator } from './errors';
import jwt from 'jsonwebtoken';
const secret_key = process.env.SECRET_KEY;

const usersRepository = AppDataSource.getRepository(Users)
const rolesRepository = AppDataSource.getRepository(Roles)
const roomsRepository = AppDataSource.getRepository(Rooms)

export async function signup(req, res, next) {
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

export async function login(req, res, next) {
    const body = req.body;
    const { username, password } = body;

    const { validate, reportError } = new Validator(body)
    validate('username', 'required')
    validate('password', 'required')
    if (reportError(next)) return

    const user = await usersRepository.findOneBy({
        username,
        password
    })
    if (!user) {
        return next(new Unauthorized({
            login: "invalid credentials"
        }))
    }

    var new_token = jwt.sign({
        user: user.id
    }, secret_key)

    user.token = new_token;
    await usersRepository.save(user)
    
    res.json({
        data: {
            token_user: new_token
        }
    })
}

export async function room(req, res, next) {
    const body = req.body;
    const { name, desc_data } = body;

    const { validate, reportError } = new Validator(body)
    validate('name', 'required')
    validate('desc_data', 'required')
    if (reportError(next)) return

    const room = new Rooms();
    room.name = name;
    room.desc_data = desc_data;
    await roomsRepository.save(room);

    res.json({
        data: {
            message: 'Created'
        }
    })
}