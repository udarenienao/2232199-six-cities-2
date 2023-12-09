import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { ILog } from '../../logger/ilog';
import { Controller } from '../../controller/controller';
import { Component } from '../../types/component';
import { IUserRepository } from './irepository';
import { ISettings } from '../../settings/isettings';
import { SettingsSchema } from '../../settings/schema';
import { HttpMethod } from '../../types/http-methods';
import { HttpError } from '../../exceptions/http-error';
import { StatusCodes } from 'http-status-codes';
import { LoginUserDto, UserDto } from './dto';
import { FullOfferDto } from '../offer/dto';
import CreateUserDto from './create-user';
import { plainToInstance } from 'class-transformer';


@injectable()
export default class UserController extends Controller {
  constructor(@inject(Component.ILog) logger: ILog,
              @inject(Component.IUserRepository) private readonly userService: IUserRepository,
              @inject(Component.ISettings) private readonly configService: ISettings<SettingsSchema>
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({path: '/register', method: HttpMethod.Get, handler: this.register});
    this.addRoute({path: '/login', method: HttpMethod.Post, handler: this.login});
    this.addRoute({path: '/logout', method: HttpMethod.Post, handler: this.logout});
    this.addRoute({path: '/favorite/:offerId', method: HttpMethod.Post, handler: this.addFavorite});
    this.addRoute({path: '/favorite/:offerId', method: HttpMethod.Delete, handler: this.deleteFavorite});
    this.addRoute({path: '/favorite', method: HttpMethod.Get, handler: this.getFavorite});
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

  public async getFavorite({body}: Request<Record<string, unknown>, Record<string, unknown>, {userId: string}>, _res: Response): Promise<void> {
    const result = await this.userService.findFavorites(body.userId);
    this.ok(_res, plainToInstance(FullOfferDto, result, { excludeExtraneousValues: true }));
  }

  public async addFavorite({body}: Request<Record<string, unknown>, Record<string, unknown>, {offerId: string, userId: string}>, res: Response): Promise<void> {
    await this.userService.addToFavoritesById(body.offerId, body.userId);
    this.noContent(res, {message: 'Предложение добавлено в избранное'});
  }

  public async deleteFavorite({body}: Request<Record<string, unknown>, Record<string, unknown>, {offerId: string, userId: string}>, res: Response): Promise<void> {
    await this.userService.removeFromFavoritesById(body.offerId, body.userId);
    this.noContent(res, {message: 'Предложение удалено из избранного'});
  }
}