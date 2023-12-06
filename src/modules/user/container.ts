import {Container} from 'inversify';
import {IUserRepository} from './irepository.js';
import UserRepository from './repository.js';
import {Component} from '../../types/component.js';
import {UserEntity, UserModel} from './entity.js';
import {types} from '@typegoose/typegoose';
import UserController from './controller.js';
import { Controller } from '../../controller/controller.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<IUserRepository>(Component.IUserRepository).to(UserRepository).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();

  return userContainer;
}
