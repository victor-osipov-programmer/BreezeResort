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
    errors;
    constructor(errors?) {
        super(401, 'Unauthorized')
        if (errors)
            this.errors = errors;
    }
}
export class NotFound extends GeneralError {
    constructor() {
        super(403, 'Not found');
    }
}


export function Validator(body, errors = {}) {
    Object.setPrototypeOf(body, Object.prototype)

    this.validate = (key, type) => {
        const messages = {
            'required': `${key} is required`,
            'number': `${key} must be a number`
        }

        if (errors[key]?.some(el => el == messages['required'])) return;
        if (
            type == 'required' && !body.hasOwnProperty(key) ||
            type == 'number' && isNaN(body[key])
        ) {
            if (!errors.hasOwnProperty(key)) errors[key] = [];
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