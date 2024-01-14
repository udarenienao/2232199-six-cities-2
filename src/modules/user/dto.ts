import {Expose} from 'class-transformer';
import { UserType } from '../../types/user.js';
import {IsEmail, IsString, IsOptional} from 'class-validator';

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

export class LoggedUserDto {
  @Expose()
  public token!: string;

  @Expose()
  public refreshToken!: string;

  @Expose()
  public email!: string;
}

export class UpdateUserDto {
  @IsOptional()
  public email?: string;

  @IsOptional()
  public username?: string;

  @IsOptional()
  public avatar?: string;
}

export class UploadUserAvatarResponse {
  @Expose()
  public filepath!: string;
}

