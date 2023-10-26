import {DocumentType} from '@typegoose/typegoose';
import CreateUserDto from './create-user.js';
import {UserEntity} from './entity.js';

export interface IUserRepository {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;

  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;

  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
}