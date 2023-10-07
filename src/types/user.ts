export type User = {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  type : UserType;
}

export enum UserType {
    simple,
    pro
  }