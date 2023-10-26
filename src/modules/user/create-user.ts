import {UserType} from '../../types/user.js';

export default class CreateUserDto {
  public email!: string;
  public avatar?: string;
  public name!: string;
  public type!: UserType;
  public password!: string;
}