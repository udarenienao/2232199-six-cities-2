import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import { Controller } from '../../controller/controller.js';
import { ILog } from '../../logger/ilog.js';
import { ICommentRepository } from './irepository.js';
import { IOfferRepository } from '../offer/irepository.js';
import { Component } from '../../types/component.js';
import { HttpMethod } from '../../types/http-methods.js';
import CreateCommentDto from './create-comment.js';
import { plainToInstance } from 'class-transformer';
import CommentDto from './dto.js';
import { ValidateDtoMiddleware } from '../../middlewares/validate-dto.js';
import { DocumentExistsMiddleware } from '../../middlewares/document-exists.js';
import { PrivateRouteMiddleware } from '../../middlewares/private-route.js';
import { ISettings } from '../../settings/isettings.js';
import { SettingsSchema } from '../../settings/schema.js';
import {ParamsDictionary} from 'express-serve-static-core';

type ParamsOffer = {
  offerId: string;
} | ParamsDictionary

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.ILog) protected readonly logger: ILog,
    @inject(Component.ICommentRepository) private readonly commentService: ICommentRepository,
    @inject(Component.IOfferRepository) private readonly offerService: IOfferRepository,
    @inject(Component.ISettings) settings: ISettings<SettingsSchema>
  ) {
    super(logger, settings);

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async index({params}: Request<ParamsOffer, object, CreateCommentDto>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, plainToInstance(CommentDto, comments, { excludeExtraneousValues: true }));
  }

  public async create({body, params, user}: Request<ParamsOffer, object, CreateCommentDto>, res: Response): Promise<void> {
    const comment = await this.commentService.createForOffer({
      ...body,
      offerId: params.offerId,
      userId: user.id
    });
    const result = await this.commentService.findById(comment.id);
    this.created(res, plainToInstance(CommentDto, result, { excludeExtraneousValues: true }));
  }
}
