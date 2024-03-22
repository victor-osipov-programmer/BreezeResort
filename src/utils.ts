import { GeneralError, Unauthorized, ValidationError } from "./errors"

export function handleErrors(err, req, res, next) {
    if (err instanceof Unauthorized && err.errors) {
        return res.status(err.code).json({
            error: {
                message: err.message,
                errors: err.errors
            }
        })
    }
    if (err instanceof ValidationError) {
        return res.status(err.code).json({
            message: err.message,
            errors: err.errors
        })
    }
    if (err instanceof GeneralError) {
        return res.status(err.code).json({
            error: {
                message: err.message
            }
        })
    }

    return res.status(500).json({
        error: {
            message: err.message
        }
    })
}