export class GeneralError extends Error {
    code;
    constructor(code, message) {
        super(message)
        this.code = code
    }
}
export class ValidationError extends GeneralError {
    errors;
    constructor(errors) {
        super(422, 'Validation error')
        this.errors = errors
    }
}
export class Unauthorized extends GeneralError {
    constructor() {
        super(401, 'Unauthorized')
    }
}

export function Validator(body) {
    Object.setPrototypeOf(body, Object.prototype)
    const errors = {}

    this.validate = (key, type) => {
        const messages = {
            'required': `${key} is required`,
            'number': `${key} must be a number`
        }

        if (!errors.hasOwnProperty(key)) errors[key] = [];

        if (type == 'required' && !body.hasOwnProperty(key)) {
            errors[key].push(messages[type]);
        }
        if (errors[key].some(el => el == messages['required'])) return;
        
        if (type == 'number' && isNaN(parseFloat(body[key]))) {
            errors[key].push(messages[type]);
        }
        if (type == 'string' && isNaN(parseFloat(body[key]))) {
            errors[key].push(messages[type]);
        }
    }

    this.reportError = (next) => {
        if (Object.keys(errors).length !== 0) {
            next(new ValidationError(errors))
            return true;
        }
        return false;
    }
}