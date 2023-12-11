import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { ILog } from '../../logger/ilog.ts';
import { Controller } from '../../controller/controller.ts';
import { Component } from '../../types/component.ts';
import { IUserRepository } from './irepository.ts';
import { ISettings } from '../../settings/isettings.ts';
import { SettingsSchema } from '../../settings/schema.ts';
import { HttpMethod } from '../../types/http-methods.ts';
import { HttpError } from '../../exceptions/http-error.ts';
import { StatusCodes } from 'http-status-codes';
import { LoginUserDto, UserDto } from './dto.ts';
import CreateUserDto from './create-user.ts';
import { plainToInstance } from 'class-transformer';
import { ValidateDtoMiddleware } from '../../middlewares/validate-dto.ts';
import { ValidateObjectIdMiddleware } from '../../middlewares/validate-objectid.ts';
import { UploadFileMiddleware } from '../../middlewares/upload-file.ts';


@injectable()
export default class UserController extends Controller {
  constructor(@inject(Component.ILog) logger: ILog,
              @inject(Component.IUserRepository) private readonly userService: IUserRepository,
              @inject(Component.ISettings) private readonly configService: ISettings<SettingsSchema>
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Get,
      handler: this.register,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto)
      ]});
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto)
      ]});
    this.addRoute({path: '/logout', method: HttpMethod.Post, handler: this.logout});
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async register(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} already exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, plainToInstance(UserDto, result, { excludeExtraneousValues: true }));
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    _res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (! existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async logout(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
