import {UserEntity} from './entity.js';
import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import CreateUserDto from './create-user.js';
import {IUserRepository} from './irepository.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.js';
import {ILog} from '../../logger/ilog.js';
import {types} from '@typegoose/typegoose';
import { OfferEntity } from '../offer/entity.js';
import { LoginUserDto, UpdateUserDto } from './dto.js';
import { DEFAULT_AVATAR_FILE_NAME } from '../../types/consts.js';

@injectable()
export default class UserService implements IUserRepository {

  constructor(
    @inject(Component.ILog) private readonly logger: ILog,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {
  }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatar: DEFAULT_AVATAR_FILE_NAME});
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(dto);
    this.logger.info(`Новый пользователь создан: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({'_id': userId});
  }

  public async addToFavoritesById(userId: string, offerId: string): Promise<void> {
    await this.userModel.updateOne(
      {_id: userId},
      { $addToSet: { favorite: offerId } }
    );
  }

  public async removeFromFavoritesById(userId: string, offerId: string): Promise<void> {
    await this.userModel.updateOne(
      {_id: userId},
      { $pull: { favorite: offerId } }
    );
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.userModel.findById(userId).select('favorite');
    if (!offers) {
      return [];
    }

    return this.offerModel
      .find({_id: { $in: offers }}).populate('offerId');
  }

  public async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (! user) {
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, {new: true})
      .exec();
  }
}
