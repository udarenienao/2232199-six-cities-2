import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {CommentEntity, CommentModel} from './entity.js';
import {ICommentRepository} from './irepository.js';
import CommentRepository from './repository.js';
import {Component} from '../../types/component.js';
import CommentController from './controller.js';
import { IController } from '../../controller/icontroller.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<ICommentRepository>(Component.ICommentRepository).to(CommentRepository).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<IController>(Component.CommentController)
    .to(CommentController).inSingletonScope();

  return commentContainer;
}
