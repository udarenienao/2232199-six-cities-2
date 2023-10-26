import {Container} from 'inversify';
import {IUserRepository} from './irepository.js';
import UserRepository from './repository.js';
import {Component} from '../../types/component.js';
import {UserEntity, UserModel} from './entity.js';
import {types} from '@typegoose/typegoose';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<IUserRepository>(Component.IUserRepository).to(UserRepository).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);

  return userContainer;
}
