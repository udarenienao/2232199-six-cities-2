import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import CreateCommentDto from './create-comment.js';
import {CommentEntity} from './entity.js';

export interface ICommentRepository {
  createForOffer(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
