import { ILog } from './ilog.js';
import { Logger, pino } from 'pino';
import {injectable} from 'inversify';

@injectable()
export default class Log implements ILog {
  private readonly logger: Logger;

  constructor() {
    this.logger = pino();
    this.logger.info('pino logger is initialized');

  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}
