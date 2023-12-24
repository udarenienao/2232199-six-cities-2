import {DocumentType} from '@typegoose/typegoose';
import CreateUserDto from './create-user.js';
import {UserEntity} from './entity.js';
import { OfferEntity } from '../offer/entity.js';
import { LoginUserDto, UpdateUserDto } from './dto.js';

export interface IUserRepository {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;

  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;

  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  addToFavoritesById(userId: string, offerId: string): Promise<void>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>
  removeFromFavoritesById(userId: string, offerId: string): Promise<void>;
  verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null>;
}
