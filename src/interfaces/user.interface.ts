import { IAccount } from "./account.interface";

interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  accounts?: IAccount[];
}

interface IUserPayload {
  name: string;
  email: string;
  password: string;
}

interface IUserRepository {
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(user: IUserPayload): Promise<IUser>;
  update(id: string, user: IUserPayload): Promise<IUser>;
  delete(id: string): boolean;
}

export { IUser, IUserPayload, IUserRepository };
