interface IRecurringTransaction {
  id: string;
  accountId: string;
  categoryId?: string | null;
  amount: number;
  transactionType: "EXPENSE" | "INCOME";
  description: string | null;
  startDate: Date;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "ANNUALLY";
  endDate?: Date | null;
  lastRun?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface IRecurringTransactionCreatePayload {
  accountId: string;
  categoryId?: string | null;
  amount: number;
  transactionType: "EXPENSE" | "INCOME";
  description?: string | null;
  startDate: Date;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "ANNUALLY";
  endDate?: Date | null;
}

interface IRecurringTransactionUpdatePayload {
  amount?: number;
  description?: string | null;
  endDate?: Date | null;
  lastRun?: Date | null;
}

interface IRecurringTransactionRepository {
  findByAccount(accountId: string): Promise<IRecurringTransaction[]>;
  create(data: IRecurringTransactionCreatePayload): Promise<IRecurringTransaction>;
  update(id: string, data: IRecurringTransactionUpdatePayload): Promise<IRecurringTransaction>;
  delete(id: string): Promise<IRecurringTransaction | null>;
}

export {
  IRecurringTransaction,
  IRecurringTransactionCreatePayload,
  IRecurringTransactionRepository,
  IRecurringTransactionUpdatePayload,
};
