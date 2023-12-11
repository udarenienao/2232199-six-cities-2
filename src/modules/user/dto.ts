import {Expose} from 'class-transformer';
import { UserType } from '../../types/user.ts';
import {IsEmail, IsString} from 'class-validator';

export class UserDto {
  @Expose()
  public id!: string;

  @Expose()
  public username!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatar!: string;

  @Expose()
  public type!: UserType;
}

export class LoginUserDto {
    @IsEmail({}, {message: 'Email must be valid.'})
  public email!: string;

    @IsString({message: 'Password is required.'})
    public password!: string;
}

export default class LoggedUserDto {
  @Expose()
  public token!: string;

  @Expose()
  public refreshToken!: string;

  @Expose()
  public email!: string;
}

