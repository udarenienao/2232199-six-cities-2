import {Expose} from 'class-transformer';

export class UserDto {
  @Expose()
  public username!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatar!: string;
}

export class LoginUserDto {
    public email!: string;
    public password!: string;
  }