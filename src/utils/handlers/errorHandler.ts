import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'
import boom from '@hapi/boom';
import config from '../../config';

function withErrorStack(error: ErrorRequestHandler, stack: any) {
    if (config.dev)
        return { ...error, stack }

    return error
}

export function logErrors(err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {
    console.log(err)

    return next(err)
}

export function wrapErrors(err: ErrorRequestHandler | any, req: Request, res: Response, next: NextFunction) {
    if (err.hasOwnProperty('_message') || err.hasOwnProperty('path') || err.hasOwnProperty('kind'))
        return next(boom.badRequest(err))

    if (!err.isBoom) {
        return next(boom.badImplementation(err));

    }
    return next(err);
}

export function errorHandler(err: ErrorRequestHandler | any, req: Request, res: Response, next: NextFunction) {
    const {
        output: { statusCode, payload }
    } = err

    return res.status(statusCode).json(withErrorStack(payload, err.stack));
}