import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {ICommentRepository} from './irepository.js';
import {Component} from '../../types/component.js';
import {CommentEntity} from './entity.js';
import CreateCommentDto from './create-comment.js';
import {IOfferRepository} from '../offer/irepository.js';
import { COMMENTS_COUNT, SORT_DESC } from '../../types/consts.js';

@injectable()
export default class CommentService implements ICommentRepository {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.IOfferRepository) private readonly offerService: IOfferRepository
  ) {
  }

  public async createForOffer(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    const offerId = dto.offerId;
    await this.offerService.incComment(offerId);

    const offer = await this.offerService.findById(offerId);

    const count = offer?.numberOfComments ?? 1;
    const newRating = (offer?.rating ?? 0 + dto.rating) / count;
    await this.offerService.updateRating(offerId, newRating);
    return comment;
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .sort({createdAt: SORT_DESC})
      .populate('authorId')
      .limit(COMMENTS_COUNT)
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }

  public findById(commentId: string): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel
      .findById(commentId)
      .populate('userId')
      .exec();
  }
}
