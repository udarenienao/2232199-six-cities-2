import {injectable} from 'inversify';
import {Response, Router} from 'express';
import {StatusCodes} from 'http-status-codes';
import {ILog} from '../logger/ilog.js';
import {IController} from './icontroller.js';
import asyncHandler from 'express-async-handler';
import { IRoute } from './iroute.js';
import { ISettings } from '../settings/isettings.js';
import { SettingsSchema } from '../settings/schema.js';
import { DEFAULT_STATIC_IMAGES, STATIC_RESOURCE_FIELDS } from '../types/consts.js';

@injectable()
export abstract class Controller implements IController {
  private readonly _router: Router;

  constructor(protected readonly logger: ILog,
    protected readonly settings: ISettings<SettingsSchema>) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: IRoute) {
    const wrapperAsyncHandler = asyncHandler(route.handler.bind(this));
    const middlewareHandlers = route.middlewares?.map(
      (item) => asyncHandler(item.execute.bind(item))
    );
    const allHandlers = middlewareHandlers ? [...middlewareHandlers, wrapperAsyncHandler] : wrapperAsyncHandler;

    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    this.addStaticPath(data as Record<string, unknown>);
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  protected addStaticPath(data: Record<string, unknown>): void {
    const fullServerPath = this.getFullServerPath(this.settings.get('HOST'), this.settings.get('PORT'));
    this.transformObject(
      STATIC_RESOURCE_FIELDS,
      `${fullServerPath}/${this.settings.get('STATIC_DIRECTORY_PATH')}`,
      `${fullServerPath}/${this.settings.get('UPLOAD_DIRECTORY')}`,
      data
    );
  }

  private getFullServerPath(host: string, port: number) {
    return `http://${host}:${port}`;
  }

  private transformObject(properties: string[], staticPath: string, uploadPath: string, data:Record<string, unknown>) {
    return properties
      .forEach((property) => {
        this.transformProperty(property, data, (target: Record<string, unknown>) => {
          const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
          target[property] = `${rootPath}/${target[property]}`;
        });
      });
  }

  private transformProperty(
    property: string,
    someObject: Record<string, unknown>,
    transformFn: (object: Record<string, unknown>) => void
  ) {
    return Object.keys(someObject)
      .forEach((key) => {
        if (key === property) {
          transformFn(someObject);
        } else if (this.isObject(someObject[key])) {
          this.transformProperty(property, someObject[key] as Record<string, unknown>, transformFn);
        }
      });
  }

  private isObject(value: unknown) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
