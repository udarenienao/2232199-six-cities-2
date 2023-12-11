import {NextFunction, Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {StatusCodes} from 'http-status-codes';
import {Component} from '../types/component.js';
import {ILog} from '../logger/ilog.js';
import {HttpError} from './http-error.js';
import {IExceptionFilter} from './iexception-filter.js';


@injectable()
export default class ExceptionFilter implements IExceptionFilter {
  constructor(
    @inject(Component.ILog) private logger: ILog
  ) {
    this.logger.info('Register ExceptionFilter');
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[${error.detail}]: ${error.httpStatusCode} — ${error.message}`);
    res
      .status(error.httpStatusCode)
      .json({error: error.message});
  }

  private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({error: error.message});
  }

  public catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    }

    this.handleOtherError(error, req, res, next);
  }
}
