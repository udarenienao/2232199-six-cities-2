
export enum UserType {
    simple = 'simple',
    pro = 'pro'
  }

export type User = {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  type : UserType;
}

