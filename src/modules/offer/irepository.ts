import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from './entity.js';
import CreateOfferDto from './create-offer.js';

export interface IOfferRepository {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;

  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
