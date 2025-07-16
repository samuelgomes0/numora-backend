interface IAccount {
  id: string;
  name: string;
  balance: number;
}

interface IAccountSummary {
  id: string;
  name: string;
  balance: number;
}

interface IAccountCreatePayload {
  userId: string;
  name: string;
}

interface IAccountUpdatePayload {
  name?: string;
}

interface IAccountRepository {
  findById(id: string): Promise<IAccount | null>;
  findByUser(userId: string): Promise<IAccountSummary[]>;
  getBalance(id: string): Promise<number | null>;
  create(data: IAccountCreatePayload): Promise<IAccount>;
  update(id: string, data: IAccountUpdatePayload): Promise<IAccount>;
  delete(id: string): Promise<IAccount | null>;
}

export {
  IAccount,
  IAccountCreatePayload,
  IAccountRepository,
  IAccountSummary,
  IAccountUpdatePayload,
};
