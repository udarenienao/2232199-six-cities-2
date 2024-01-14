import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { ILog } from '../../logger/ilog.js';
import { Controller } from '../../controller/controller.js';
import { Component } from '../../types/component.js';
import { IUserRepository } from './irepository.js';
import { ISettings } from '../../settings/isettings.js';
import { SettingsSchema } from '../../settings/schema.js';
import { HttpMethod } from '../../types/http-methods.js';
import { HttpError } from '../../exceptions/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { LoggedUserDto, LoginUserDto, UploadUserAvatarResponse, UserDto } from './dto.js';
import CreateUserDto from './create-user.js';
import { plainToInstance } from 'class-transformer';
import { ValidateDtoMiddleware } from '../../middlewares/validate-dto.js';
import { ValidateObjectIdMiddleware } from '../../middlewares/validate-objectid.js';
import { UploadFileMiddleware } from '../../middlewares/upload-file.js';
import { PrivateRouteMiddleware } from '../../middlewares/private-route.js';
import { createJWT } from '../../helpers/auth.js';
import { JWT_ALGORITHM } from '../../types/consts.js';
import { BLACK_LIST_TOKENS } from '../../middlewares/auth.js';


@injectable()
export default class UserController extends Controller {
  constructor(@inject(Component.ILog) logger: ILog,
              @inject(Component.IUserRepository) private readonly userService: IUserRepository,
              @inject(Component.ISettings) protected readonly settings: ISettings<SettingsSchema>
  ) {
    super(logger, settings);

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

    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });

    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [
        new PrivateRouteMiddleware()
      ]});

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.settings.get('UPLOAD_DIRECTORY'), 'avatar'),
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

    const result = await this.userService.create(body, this.settings.get('SALT'));
    this.created(res, plainToInstance(UserDto, result, { excludeExtraneousValues: true }));
  }

  public async login(
    {body, user}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
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

    const accessToken = await createJWT(
      JWT_ALGORITHM,
      this.settings.get('JWT_SECRET'),
      {
        email: user.email,
        id: user.id
      },
      300
    );

    const refreshToken = await createJWT(
      JWT_ALGORITHM,
      this.settings.get('JWT_SECRET'),
      {
        email: user.email,
        id: user.id
      },
      7200
    );

    this.ok(_res, plainToInstance(LoggedUserDto, {
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken
    }, { excludeExtraneousValues: true }));
  }

  public async logout(_req: Request, _res: Response): Promise<void> {
    const [, token] = String(_req.headers.authorization?.split(' '));

    if (!_req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    BLACK_LIST_TOKENS.add(token);

    this.noContent(_res, {token});
  }

  public async checkAuthenticate({user: {email}}: Request, res: Response) {
    const foundedUser = await this.userService.findByEmail(email);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, plainToInstance(LoggedUserDto, foundedUser, { excludeExtraneousValues: true }));
  }

  public async uploadAvatar(req: Request, res: Response) {
    const {userId} = req.params;
    const uploadFile = {avatar: req.file?.filename};
    await this.userService.updateById(userId, uploadFile);

    this.created(res, plainToInstance(UploadUserAvatarResponse, uploadFile, { excludeExtraneousValues: true }));
  }
}
