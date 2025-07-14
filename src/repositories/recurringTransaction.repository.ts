import { prisma } from "@/database/prisma-client";
import {
  IRecurringTransaction,
  IRecurringTransactionCreatePayload,
  IRecurringTransactionRepository,
  IRecurringTransactionUpdatePayload,
} from "@/interfaces";

const recurringTransactionSelect = {
  id: true,
  accountId: true,
  categoryId: true,
  amount: true,
  transactionType: true,
  description: true,
  startDate: true,
  frequency: true,
  endDate: true,
  lastRun: true,
};

class RecurringTransactionRepository implements IRecurringTransactionRepository {
  async findByAccount(accountId: string): Promise<IRecurringTransaction[]> {
    return await prisma.recurringTransaction.findMany({
      where: { accountId },
      select: recurringTransactionSelect,
    });
  }

  async create(data: IRecurringTransactionCreatePayload): Promise<IRecurringTransaction> {
    return await prisma.recurringTransaction.create({
      data,
      select: recurringTransactionSelect,
    });
  }

  async update(
    id: string,
    data: IRecurringTransactionUpdatePayload,
  ): Promise<IRecurringTransaction> {
    return await prisma.recurringTransaction.update({
      where: { id },
      data,
      select: recurringTransactionSelect,
    });
  }

  async delete(id: string): Promise<IRecurringTransaction | null> {
    return await prisma.recurringTransaction.delete({
      where: { id },
      select: recurringTransactionSelect,
    });
  }
}

export default RecurringTransactionRepository;
