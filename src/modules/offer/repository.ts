import {inject, injectable} from 'inversify';
import CreateOfferDto from './create-offer.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {OfferEntity} from './entity.js';
import {IOfferRepository} from './irepository.js';
import {Component} from '../../types/component.js';
import {ILog} from '../../logger/ilog.js';

@injectable()
export default class OfferService implements IOfferRepository {
  constructor(
    @inject(Component.ILog) private readonly logger: ILog,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`Новое предложение об аренде создано: ${dto.name}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }
}