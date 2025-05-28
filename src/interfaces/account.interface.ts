import { ICategorySummary } from "./category.interface";
import { ITransactionSummary } from "./transaction.interface";

interface IAccount {
  id: string;
  userId: string;
  name: string;
  balance: number;
  transactions?: ITransactionSummary[];
  categories?: ICategorySummary[];
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
  findAll(): Promise<IAccountSummary[]>;
  findById(id: string): Promise<IAccount | null>;
  findAccountsByUserId(userId: string): Promise<IAccountSummary[]>;
  create(data: IAccountCreatePayload): Promise<IAccount>;
  update(id: string, data: IAccountUpdatePayload): Promise<IAccount | null>;
  delete(id: string): Promise<IAccount | null>;
}

export {
  IAccount,
  IAccountCreatePayload,
  IAccountRepository,
  IAccountSummary,
  IAccountUpdatePayload,
};
