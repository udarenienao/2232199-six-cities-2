import {inject, injectable} from 'inversify';
import CreateOfferDto from './create-offer.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {OfferEntity} from './entity.js';
import {IOfferRepository} from './irepository.js';
import {Component} from '../../types/component.js';
import {ILog} from '../../logger/ilog.js';
import { ICommentRepository } from '../comment/irepository.js';
import { MAX_OFFERS_COUNT, MAX_PREMIUM_OFFERS_COUNT, SORT_DESC } from '../../types/consts.js';
import UpdateOfferDto from './update-offer.js';

@injectable()
export default class OfferService implements IOfferRepository {
  constructor(
    @inject(Component.ILog) private readonly logger: ILog,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.ICommentRepository) private readonly commentService: ICommentRepository
  ) {
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`Новое предложение об аренде создано: ${dto.name}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate('userId').exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    await this.commentService.deleteByOfferId(offerId);
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async find(count: number | undefined): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? MAX_OFFERS_COUNT;
    return this.offerModel
      .find()
      .sort({createdAt: SORT_DESC})
      .populate('userId')
      .limit(limit)
      .exec();
  }

  public async findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({city: city, premium: true})
      .sort({createdAt: SORT_DESC})
      .limit(MAX_PREMIUM_OFFERS_COUNT)
      .populate('userId')
      .exec();
  }

  incComment(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentsCount: 1,
      }}).exec();

  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate('userId')
      .exec();
  }

  public async updateRating(offerId: string, rating: number): Promise<void> {
    await this.offerModel
      .findByIdAndUpdate(offerId, {rating: rating}, {new: true})
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  public async addImage(offerId: string, image: string): Promise<void> {
    await this.offerModel
      .updateOne({_id: offerId}, {$addToSet: {images: image}});
  }

  public async removeImage(offerId: string, image: string): Promise<void> {
    await this.offerModel
      .updateOne({_id: offerId}, {$pull: {images: image}});
  }
}
