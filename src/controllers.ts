import { AppDataSource } from './db/data-source';
import { User, Room, Hotel } from './db/entity';
import { NotFound, Unauthorized, Validator } from './errors';
import jwt from 'jsonwebtoken';
import { roles } from './db/init'
const secret_key = process.env.SECRET_KEY;

const userRepository = AppDataSource.getRepository(User);
const roomRepository = AppDataSource.getRepository(Room);
const hotelRepository = AppDataSource.getRepository(Hotel);

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
        await userRepository.save(user);
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

    const user = await userRepository.findOneBy({
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
        await userRepository.save(user);
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
        await roomRepository.save(room);
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
    const rooms = await roomRepository.find()

    res.json({
        list: rooms
    })
}

export async function deleteRoom(req, res, next) {
    const room = await roomRepository.findOneBy({
        id: req.params.id
    })
    if (!room) {
        return next(new NotFound())
    }

    await roomRepository.remove(room)

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
        await userRepository.save(user)
    } catch (err) {
        return next(err)
    }

    res.status(201).json({
        data: {
            message: 'Created'
        }
    })
}

export async function editUserdata(req, res, next) {
    const body = req.body;

    const user = await userRepository.findOneBy({
        id: req.params.id
    })
    if (!user) {
        return next(new NotFound())
    }

    Object.keys(body).forEach(key => {
        user[key] = body[key];
    })

    try {
        await userRepository.save(user)
    } catch (err) {
        return next(err)
    }

    res.json({
        data: {
            id: user.id,
            message: 'Updated'
        }
    })
}

export async function deleteUserdata(req, res, next) {
    const user = await userRepository.findOneBy({
        id: req.params.id
    })
    if (!user) {
        return next(new NotFound())
    }

    await userRepository.remove(user)

    res.json({
        data: {
            message: 'Deleted'
        }
    })
}

export async function updateNumberRoom(req, res, next) {
    const room_id = req.params.id;
    const user_id = req.params.iduser;

    const user = await userRepository.findOneBy({
        id: user_id
    })
    if (!user) {
        return next(new NotFound())
    }

    const room = await roomRepository.findOneBy({
        id: room_id
    })

    user.id_childdata = room;

    try {
        await userRepository.save(user)
    } catch (err) {
        return next(err)
    }

    res.json({
        data: {
            message: 'Changed'
        }
    })
}

export async function usersinroom(req, res, next) {
    const rooms = await roomRepository.find({
        relations: {
            users: true
        }
    })

    res.json({
        data: rooms.map(room => {
            return {
                name: room.name,
                userdata: room.users.map(user => ({fio: user.fio, phonenumber: user.phone}))
            }
        })
    })
}

export async function hotel(req, res, next) {
    const body = req.body;
    const { name, number } = body;

    const { validate, reportError } = new Validator(body)
    validate('name', 'required')
    validate('number', 'required')
    validate('number', 'number')
    if (reportError(next)) return

    const hotel = new Hotel()
    hotel.name = name;
    hotel.number = number;

    try {
        await hotelRepository.save(hotel)
    } catch (err) {
        return next(err)
    }

    res.status(201).json({
        data: {
            id: hotel.id,
            name: hotel.name,
            number: hotel.number
        }
    })
}

export async function hotels(req, res, next) {
    const hotels = await hotelRepository.find()

    res.json({
        list: hotels.map(hotel => ({name: hotel.name, number: hotel.number}))
    })
}

export async function deleteHotel(req, res, next) {
    const hotel = await hotelRepository.findOneBy({
        id: req.params.id
    })
    if (!hotel) {
        return next(new NotFound())
    }

    await hotelRepository.remove(hotel)

    res.json({
        data: {
            message: 'Deleted'
        }
    })
}

export async function addRoomInHotel(req, res, next) {
    const room = await roomRepository.findOneBy({
        id: req.params.idroom
    })
    const hotel = await hotelRepository.findOneBy({
        id: req.params.id
    })

    if (!room || !hotel) {
        return next(new NotFound())
    }
    room.hotel = hotel;

    try {
        await roomRepository.save(room)
    } catch (err) {
        return next(err)
    }

    res.status(201).json({
        name: room.name,
        title: room.desc_data
    })
}

export async function roomsinhotels(req, res, next) {
    const hotels = await hotelRepository.find({
        relations: {
            rooms: {
                users: true
            }
        }
    })

    res.json({
        data: hotels.map(hotel => ({
            title: hotel.name,
            number: hotel.number,
            data_children: hotel.rooms.map(room => ({
                name: room.name,
                userdata: room.users.map(user => ({fio: user.fio, phonenumber: user.phone}))
            }))
        }))
    })
}