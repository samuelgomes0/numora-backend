import { prisma } from "@/database/prisma-client";
import {
  ITransaction,
  ITransactionCreatePayload,
  ITransactionRepository,
  ITransactionSummary,
  ITransactionUpdatePayload,
} from "@/interfaces";

const transactionSelect = {
  id: true,
  amount: true,
  transactionType: true,
  description: true,
  date: true,
  createdAt: true,
  updatedAt: true,
  accountId: true,
  categoryId: true,
};

const transactionSummarySelect = {
  id: true,
  amount: true,
  transactionType: true,
  date: true,
};

class TransactionRepository implements ITransactionRepository {
  async findById(id: string): Promise<ITransaction | null> {
    return await prisma.transaction.findUnique({
      where: { id },
      select: transactionSelect,
    });
  }

  async findByAccount(accountId: string): Promise<ITransactionSummary[]> {
    return await prisma.transaction.findMany({
      where: { accountId },
      select: transactionSummarySelect,
    });
  }

  async create(data: ITransactionCreatePayload): Promise<ITransaction> {
    return await prisma.transaction.create({
      data,
      select: transactionSelect,
    });
  }

  async update(id: string, data: ITransactionUpdatePayload): Promise<ITransaction> {
    return await prisma.transaction.update({
      where: { id },
      data,
      select: transactionSelect,
    });
  }

  async delete(id: string): Promise<ITransaction | null> {
    return await prisma.transaction.delete({
      where: { id },
      select: transactionSelect,
    });
  }
}

export default TransactionRepository;
