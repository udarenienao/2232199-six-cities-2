import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import { Controller } from '../../controller/controller.ts';
import { ILog } from '../../logger/ilog.ts';
import { ICommentRepository } from './irepository.ts';
import { IOfferRepository } from '../offer/irepository.ts';
import { Component } from '../../types/component.ts';
import { HttpMethod } from '../../types/http-methods.ts';
import CreateCommentDto from './create-comment.ts';
import { plainToInstance } from 'class-transformer';
import CommentDto from './dto.ts';
import { ValidateDtoMiddleware } from '../../middlewares/validate-dto.ts';
import { DocumentExistsMiddleware } from '../../middlewares/document-exists.ts';
import { PrivateRouteMiddleware } from '../../middlewares/private-route.ts';


@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(Component.ILog) protected readonly logger: ILog,
    @inject(Component.ICommentRepository) private readonly commentService: ICommentRepository,
    @inject(Component.IOfferRepository) private readonly offerService: IOfferRepository,
  ) {
    super(logger);

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
  }

  public async create({body, params, user}: Request<object, object, CreateCommentDto>, res: Response): Promise<void> {
    const comment = await this.commentService.createForOffer({
      ...body,
      offerId: params.offerId,
      userId: user.id
    });
    this.created(res, plainToInstance(CommentDto, comment, { excludeExtraneousValues: true }));
  }
}
