import { TransactionType } from "@prisma/client";

interface ITransaction {
  id: string;
  amount: number;
  transactionType: TransactionType;
  description: string | null;
  date: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  accountId: string;
  categoryId?: string | null;
}

interface ITransactionSummary {
  id: string;
  amount: number;
  transactionType: TransactionType;
  date: Date | string;
}

interface ITransactionCreatePayload {
  amount: number;
  transactionType: TransactionType;
  description?: string | null;
  date: Date | string;
  accountId: string;
  categoryId?: string | null;
}

interface ITransactionUpdatePayload {
  amount?: number;
  transactionType?: TransactionType;
  description?: string | null;
  date?: Date | string;
  accountId?: string;
  categoryId?: string | null;
}

interface ITransactionRepository {
  findAll(): Promise<ITransactionSummary[]>;
  findById(id: string): Promise<ITransaction | null>;
  create(data: ITransactionCreatePayload): Promise<ITransaction>;
  update(id: string, data: ITransactionUpdatePayload): Promise<ITransaction>;
  delete(id: string): Promise<ITransaction | null>;
}

export {
  ITransaction,
  ITransactionCreatePayload,
  ITransactionRepository,
  ITransactionSummary,
  ITransactionUpdatePayload,
};
