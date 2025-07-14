interface IUser {
  id: string;
  name: string;
  email: string;
  accounts?: IAccountSummary[];
}

interface IUserSummary {
  id: string;
  name: string;
  email: string;
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
  create(data: IUserCreatePayload): Promise<IUser>;
  update(id: string, data: IUserUpdatePayload): Promise<IUser>;
  delete(id: string): Promise<IUser | null>;
}

interface IAccountSummary {
  id: string;
  name: string;
  balance: number;
}

export {
  IAccountSummary,
  IUser,
  IUserCreatePayload,
  IUserRepository,
  IUserSummary,
  IUserUpdatePayload,
};
