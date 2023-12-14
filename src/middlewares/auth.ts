import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { StatusCodes } from 'http-status-codes';
import { createSecretKey } from 'node:crypto';
import { IMiddleware } from './imiddleware.js';
import { HttpError } from '../exceptions/http-error.js';

export const BLACK_LIST_TOKENS: Set<string> = new Set();
export class AuthenticateMiddleware implements IMiddleware {
  constructor(private readonly jwtSecret: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(
        token,
        createSecretKey(this.jwtSecret, 'utf-8'),
        {
          algorithms: ['HS256']
        }
      );

      if (BLACK_LIST_TOKENS.has(token)) {
        return next(new HttpError(
          StatusCodes.UNAUTHORIZED,
          'Token in black list',
          'AuthenticateMiddleware'
        ));
      }
      req.user = { email: payload.email as string, id: payload.id as string };
      return next();
    } catch {

      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'AuthenticateMiddleware')
      );
    }
  }
}
