import { prisma } from "@/database/prisma-client";
import {
  ITransaction,
  ITransactionCreatePayload,
  ITransactionRepository,
  ITransactionUpdatePayload,
} from "@/interfaces";

const publicTransactionSelect = {
  id: true,
  amount: true,
  transactionType: true,
  date: true,
};

const privateTransactionSelect = {
  id: true,
  amount: true,
  transactionType: true,
  date: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  accountId: true,
  categoryId: true,
};

class TransactionRepository implements ITransactionRepository {
  findById(id: string): Promise<ITransaction | null> {
    return prisma.transaction.findUnique({
      where: { id },
      select: privateTransactionSelect,
    });
  }

  findByAccount(accountId: string): Promise<ITransaction[]> {
    return prisma.transaction.findMany({
      where: { accountId },
    });
  }

  create(data: ITransactionCreatePayload): Promise<ITransaction> {
    return prisma.transaction.create({
      data,
      select: privateTransactionSelect,
    });
  }

  update(id: string, data: ITransactionUpdatePayload): Promise<ITransaction> {
    return prisma.transaction.update({
      where: { id },
      data,
      select: privateTransactionSelect,
    });
  }

  delete(id: string): Promise<ITransaction | null> {
    return prisma.transaction.delete({
      where: { id },
      select: privateTransactionSelect,
    });
  }
}

export default TransactionRepository;
