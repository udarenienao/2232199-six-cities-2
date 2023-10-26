import typegoose, {defaultClasses, getModelForClass} from '@typegoose/typegoose';
import {User, UserType} from '../../types/user.js';
import * as crypto from 'node:crypto';
const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({unique: true, required: true, match: [/^.+@.+$/, 'Email is incorrect']})
  public email: string;

  @prop({required: false, default: '', match: [/.*\.(?:jpg|png)/, 'Avatar must be jpg or png']})
  public avatar?: string;

  @prop({
    required: true,
    minlength: [1, 'Min length for username is 1'],
    maxlength: [15, 'Max length for username is 15']
  })
  public name: string;

  @prop({
    required: true,
    type: () => String,
    enum: UserType
  })
  public type: UserType;

  @prop({
    required: true,
    minlength: [6, 'Min length for password is 6'],
    maxlength: [12, 'Max length for password is 12']
  })
  public password!: string;

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatar = userData.avatar;
    this.name = userData.name;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    const hashed = crypto.createHmac('sha256', salt);
    this.password = hashed.update(password).digest('hex');
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
