import { TransactionType } from "@prisma/client";

interface ITransaction {
  id: string;
  description: string | null;
  amount: number;
  date: Date | string;
  transactionType: TransactionType;
}

interface ITransactionPayload {
  description: string;
  amount: number;
  date: Date | string;
  transactionType: TransactionType;
  accountId: string;
}

interface ITransactionRepository {
  findAll(): Promise<ITransaction[]>;
  findById(id: string): Promise<ITransaction | null>;
  create(data: ITransactionPayload): Promise<ITransaction>;
  update(id: string, data: Partial<ITransactionPayload>): Promise<ITransaction>;
  delete(id: string): Promise<void>;
}

export { ITransaction, ITransactionPayload, ITransactionRepository };
