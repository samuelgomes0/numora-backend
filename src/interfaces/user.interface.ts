interface IUser {
  id: string;
  name: string;
  email: string;
  accounts?: IAccountSummary[];
  createdAt: Date;
}

interface IAccountSummary {
  id: string;
  name: string;
  balance: number;
}

interface IUserCreatePayload {
  name: string;
  email: string;
  password: string;
}

interface IUserUpdatePayload {
  name?: string;
  email?: string;
  password?: string;
}

interface IUserRepository {
  findAll(): Promise<IUserSummary[]>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(user: IUserCreatePayload): Promise<IUser>;
  update(id: string, user: IUserUpdatePayload): Promise<IUser>;
  delete(id: string): Promise<IUser | null>;
}

interface IUserSummary {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export {
  IAccountSummary,
  IUser,
  IUserCreatePayload,
  IUserRepository,
  IUserSummary,
  IUserUpdatePayload,
};
