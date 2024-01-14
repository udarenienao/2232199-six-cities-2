import {NextFunction, Request, Response} from 'express';
import { HttpMethod } from '../types/http-methods.js';
import { IMiddleware } from '../middlewares/imiddleware.js';

export interface IRoute {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: IMiddleware[];
}
