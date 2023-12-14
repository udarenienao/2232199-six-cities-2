import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {Component} from '../../types/component.js';
import { Controller } from '../../controller/controller.js';
import { ILog } from '../../logger/ilog.js';
import { IOfferRepository } from './irepository.js';
import { HttpMethod } from '../../types/http-methods.js';
import CreateOfferDto from './create-offer.js';
import { HttpError } from '../../exceptions/http-error.js';
import { StatusCodes } from 'http-status-codes';
import UpdateOfferDto from './update-offer.js';
import { FavouriteShortOfferDto, OfferDto } from './dto.js';
import { plainToInstance } from 'class-transformer';
import { IUserRepository } from '../user/irepository.js';
import { ICommentRepository } from '../comment/irepository.js';
import { ValidateDtoMiddleware } from '../../middlewares/validate-dto.js';
import { ValidateObjectIdMiddleware } from '../../middlewares/validate-objectid.js';
import { DocumentExistsMiddleware } from '../../middlewares/document-exists.js';
import { PrivateRouteMiddleware } from '../../middlewares/private-route.js';
import {ParamsDictionary} from 'express-serve-static-core';

type ParamsOffer = {
  offerId: string;
} | ParamsDictionary

@injectable()
export default class OfferController extends Controller {
  constructor(@inject(Component.ILog) logger: ILog,
              @inject(Component.IOfferRepository) private readonly offerService: IOfferRepository,
              @inject(Component.IUserRepository) private readonly userService: IUserRepository,
              @inject(Component.ICommentRepository) private readonly commentService: ICommentRepository
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.get,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId')
      ]
    });

    this.addRoute({path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium});

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares:[
        new PrivateRouteMiddleware()
      ]
    });
  }

  public async index({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const limit = params.limit ? parseInt(`${params.limit}`, 10) : undefined;
    const offers = await this.offerService.find(limit);
    this.ok(res, plainToInstance(OfferDto, offers, { excludeExtraneousValues: true }));
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {

    const result = await this.offerService.create(body);
    this.created(res, result);
  }

  public async get({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(`${params.offerId}`);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController',
      );
    }

    this.ok(res, offer);
  }

  public async update({params, body}: Request<Record<string, unknown>, Record<string, unknown>, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(`${params.offerId}`, body);
    this.ok(res, updatedOffer);
  }

  public async delete({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {

    await this.offerService.deleteById(`${params.offerId}`);
    await this.commentService.deleteByOfferId(`${params.offerId}`);
    this.noContent(res, `Offer ${params.offerId} was deleted.`);
  }

  public async getPremium({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(`${params.city}`);
    this.ok(res, plainToInstance(OfferDto, offers, { excludeExtraneousValues: true }));
  }

  public async getFavorites({user}: Request, _res: Response): Promise<void> {
    const offers = await this.userService.findFavorites(user.id);
    this.ok(_res, plainToInstance(FavouriteShortOfferDto, offers, { excludeExtraneousValues: true }));
  }

  public async addFavorite({ params, user }: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.userService.addToFavoritesById(params.offerId, user.id);
    this.noContent(res, {message: 'Offer was added to favorite'});
  }

  public async deleteFavorite({ params, user }: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.userService.removeFromFavoritesById(params.offerId, user.id);
    this.noContent(res, {message: 'Offer was removed from favorite'});
  }
}
