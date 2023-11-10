import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {CommentEntity, CommentModel} from './entity.js';
import {ICommentRepository} from './irepository.js';
import CommentRepository from './repository.js';
import {Component} from '../../types/component.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<ICommentRepository>(Component.ICommentRepository).to(CommentRepository).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);

  return commentContainer;
}
