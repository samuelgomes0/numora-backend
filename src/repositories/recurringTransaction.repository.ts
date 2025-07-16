import { prisma } from "@/database/prisma-client";
import {
  IRecurringTransaction,
  IRecurringTransactionCreatePayload,
  IRecurringTransactionRepository,
  IRecurringTransactionUpdatePayload,
} from "@/interfaces";

// Para listagens - apenas dados essenciais
const recurringTransactionSummarySelect = {
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

// Para detalhes da transação recorrente - dados essenciais
const recurringTransactionDetailSelect = {
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

class RecurringTransactionRepository
  implements IRecurringTransactionRepository
{
  async findById(id: string): Promise<IRecurringTransaction | null> {
    return await prisma.recurringTransaction.findUnique({
      where: { id },
      select: recurringTransactionDetailSelect,
    });
  }

  async findByAccount(accountId: string): Promise<IRecurringTransaction[]> {
    return await prisma.recurringTransaction.findMany({
      where: { accountId },
      select: recurringTransactionSummarySelect,
      orderBy: { startDate: "desc" },
    });
  }

  async create(
    data: IRecurringTransactionCreatePayload
  ): Promise<IRecurringTransaction> {
    return await prisma.recurringTransaction.create({
      data,
      select: recurringTransactionDetailSelect,
    });
  }

  async update(
    id: string,
    data: IRecurringTransactionUpdatePayload
  ): Promise<IRecurringTransaction> {
    return await prisma.recurringTransaction.update({
      where: { id },
      data,
      select: recurringTransactionDetailSelect,
    });
  }

  async delete(id: string): Promise<IRecurringTransaction | null> {
    try {
      return await prisma.recurringTransaction.delete({
        where: { id },
        select: recurringTransactionDetailSelect,
      });
    } catch (error) {
      return null;
    }
  }
}

export default RecurringTransactionRepository;
