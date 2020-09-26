import { Request, Response, NextFunction } from "express";
import boom from '@hapi/boom';

const scopesValidationHandler = (allowedScopes: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const tokenData: any = req.user;

        if (!tokenData || (!tokenData.scopes && !tokenData))
            next(boom.unauthorized('Missing scopes'))

        const hasAccess = allowedScopes
            .map(allowedScope => tokenData.scopes.includes(allowedScope))
            .find(allowed => Boolean(allowed));

        if (hasAccess)
            next()
        else
            next(boom.unauthorized('Insuficient scopes'))

    }
} 

export default scopesValidationHandler;