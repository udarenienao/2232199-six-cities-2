import {NextFunction, Request, Response} from 'express';
import { HttpMethod } from '../types/http-methods.ts';
import { IMiddleware } from '../middlewares/imiddleware.ts';

export interface IRoute {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: IMiddleware[];
}
