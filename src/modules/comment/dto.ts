import { Expose, Type } from 'class-transformer';
import { UserDto } from '../user/dto.js';

export default class CommentDto {
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose({ name: 'createdAt'})
  public postDate!: string;

  @Expose({ name: 'userId'})
  @Type(() => UserDto)
  public user!: UserDto;
}
