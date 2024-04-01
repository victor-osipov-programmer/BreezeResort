import { AppDataSource } from './db/data-source';
import { User, Role, Room } from './db/entity';
import { NotFound, Unauthorized, Validator } from './errors';
import jwt from 'jsonwebtoken';
import { roles } from './db/init'
const secret_key = process.env.SECRET_KEY;

const usersRepository = AppDataSource.getRepository(User);
const roomsRepository = AppDataSource.getRepository(Room);

export async function signup(req, res, next) {
    const body = req.body;
    const { username, password } = body;

    const { validate, reportError } = new Validator(body)
    validate('username', 'required')
    validate('password', 'required')
    if (reportError(next)) return

    const user = new User();
    user.username = username;
    user.password = password;
    user.role = roles.find(role => role.name == 'admin');

    try {
        await usersRepository.save(user);
    } catch (err) {
        return next(err)
    }

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

    let new_token = jwt.sign({
        user: user.id
    }, secret_key)
    user.token = new_token;

    try {
        await usersRepository.save(user);
    } catch (err) {
        return next(err)
    }
    
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

    const room = new Room();
    room.name = name;
    room.desc_data = desc_data;

    try {
        await roomsRepository.save(room);
    } catch (err) {
        return next(err)
    }

    res.json({
        data: {
            message: 'Created'
        }
    })
}

export async function rooms(req, res, next) {
    const rooms = await roomsRepository.find()

    res.json({
        list: rooms
    })
}

export async function deleteRoom(req, res, next) {
    const room = await roomsRepository.findOneBy({
        id: req.params.id
    })
    if (!room) {
        return next(new NotFound())
    }

    await roomsRepository.remove(room)

    res.json({
        data: {
            message: "Deleted"
        }
    })
}

export async function register(req, res, next) {
    const body = req.body;
    const { fio, email, phone, birth_date, id_childdata } = body;

    const { validate, reportError } = new Validator(body)
    validate('fio', 'required')
    validate('email', 'required')
    validate('phone', 'required')
    validate('birth_date', 'required')
    validate('id_childdata', 'required')
    if (reportError(next)) return

    const user = new User()
    user.fio = fio;
    user.email = email;
    user.phone = phone;
    user.birth_date = birth_date;
    user.id_childdata = id_childdata;
    user.role = roles.find(role => role.name == 'client');

    try {
        await usersRepository.save(user)
    } catch (err) {
        return next(err)
    }

    res.json({
        data: {
            message: 'Created'
        }
    })
}