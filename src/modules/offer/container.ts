import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import OfferRepository from './repository.js';
import {OfferEntity, OfferModel} from './entity.js';
import {IOfferRepository} from './irepository.js';
import {Component} from '../../types/component.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<IOfferRepository>(Component.IOfferRepository).to(OfferRepository);
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);

  return offerContainer;
}
