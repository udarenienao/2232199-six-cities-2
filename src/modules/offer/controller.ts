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
import { FavouriteShortOfferDto, OfferDto, ShortOfferDto, UploadImageResponse } from './dto.js';
import { plainToInstance } from 'class-transformer';
import { IUserRepository } from '../user/irepository.js';
import { ICommentRepository } from '../comment/irepository.js';
import { ValidateDtoMiddleware } from '../../middlewares/validate-dto.js';
import { ValidateObjectIdMiddleware } from '../../middlewares/validate-objectid.js';
import { DocumentExistsMiddleware } from '../../middlewares/document-exists.js';
import { PrivateRouteMiddleware } from '../../middlewares/private-route.js';
import {ParamsDictionary} from 'express-serve-static-core';
import { ISettings } from '../../settings/isettings.js';
import { SettingsSchema } from '../../settings/schema.js';
import { UploadFileMiddleware } from '../../middlewares/upload-file.js';

type ParamsOffer = {
  offerId: string;
} | ParamsDictionary

@injectable()
export default class OfferController extends Controller {
  constructor(@inject(Component.ILog) logger: ILog,
              @inject(Component.IOfferRepository) private readonly offerService: IOfferRepository,
              @inject(Component.IUserRepository) private readonly userService: IUserRepository,
              @inject(Component.ICommentRepository) private readonly commentService: ICommentRepository,
              @inject(Component.ISettings) settings: ISettings<SettingsSchema>

  ) {
    super(logger, settings);

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
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
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
      path: '/users/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares:[
        new PrivateRouteMiddleware()
      ]
    });

    this.addRoute({
      path: '/:offerId/preview-image',
      method: HttpMethod.Post,
      handler: this.uploadPreviewImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.settings.get('UPLOAD_DIRECTORY'), 'previewImage'),
      ]
    });

    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.settings.get('UPLOAD_DIRECTORY'), 'image'),
      ]
    });

    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Delete,
      handler: this.removeImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.settings.get('UPLOAD_DIRECTORY'), 'image'),
      ]
    });
  }

  public async index({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const limit = params.limit ? parseInt(`${params.limit}`, 10) : undefined;
    const offers = await this.offerService.find(limit);
    this.ok(res, plainToInstance(ShortOfferDto, offers, { excludeExtraneousValues: true }));
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);
    const offer = await this.offerService.findById(result.id);
    this.created(res, plainToInstance(OfferDto, offer, { excludeExtraneousValues: true }));
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

  public async update({params, body, user}: Request<ParamsOffer, Record<string, unknown>, UpdateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    if (offer?.userId.id !== user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Offer was created other user',
        'UpdateOffer');
    }
    const updatedOffer = await this.offerService.updateById(`${params.offerId}`, body);
    this.ok(res, plainToInstance(OfferDto, updatedOffer, { excludeExtraneousValues: true }));
  }

  public async delete({params, user}: Request<ParamsOffer>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    if (offer?.userId.id !== user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Offer was created other user',
        'DeleteOffer');
    }
    await this.offerService.deleteById(`${params.offerId}`);
    await this.commentService.deleteByOfferId(`${params.offerId}`);
    this.noContent(res, `Offer ${params.offerId} was deleted.`);
  }

  public async getPremium({params}: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(`${params.city}`);
    this.ok(res, plainToInstance(ShortOfferDto, offers, { excludeExtraneousValues: true }));
  }

  public async getFavorites({user}: Request, _res: Response): Promise<void> {
    const offers = await this.userService.findFavorites(user.id);
    this.ok(_res, plainToInstance(FavouriteShortOfferDto, offers, { excludeExtraneousValues: true }));
  }

  public async addFavorite({ params, user }: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.userService.addToFavoritesById(user.id, params.offerId);
    this.noContent(res, {message: 'Offer was added to favorite'});
  }

  public async deleteFavorite({ params, user }: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.userService.removeFromFavoritesById(user.id, params.offerId);
    this.noContent(res, {message: 'Offer was removed from favorite'});
  }

  public async uploadPreviewImage(req: Request<ParamsOffer>, res: Response) {
    const offer = await this.offerService.findById(req.params.offerId);
    if (offer?.userId.id !== req.user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Offer was created other user',
        'uploadPreviewImage');
    }
    const {offerId} = req.params;
    const updateDto = { previewImage: req.file?.filename };
    await this.offerService.updateById(offerId, updateDto);

    this.created(res, plainToInstance(UploadImageResponse, {updateDto}, { excludeExtraneousValues: true }));
  }

  public async uploadImage(req: Request<ParamsOffer>, res: Response) {
    const offer = await this.offerService.findById(req.params.offerId);
    if (offer?.userId.id !== req.user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Offer was created other user',
        'uploadImage');
    }
    const {offerId} = req.params;
    await this.offerService.addImage(offerId, req.file?.filename);
    this.noContent(res, 'Image was added');
  }

  public async removeImage(req: Request<ParamsOffer>, res: Response) {
    const offer = await this.offerService.findById(req.params.offerId);
    if (offer?.userId.id !== req.user.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST,
        'Offer was created other user',
        'removeImage');
    }
    const {offerId} = req.params;
    await this.offerService.removeImage(offerId, req.file?.filename);
    this.noContent(res, 'Image was removed');
  }
}
