import { Validator } from './errors';

export async function signup(req, res, next) {
    const body = req.body;
    const { username, password } = body;

    const { validate, reportError } = new Validator(body)
    validate('username', 'required')
    validate('password', 'required')
    if (reportError()) return

    
}