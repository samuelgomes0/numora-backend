import { prisma } from "@/database/prisma-client";
import {
  ITransaction,
  ITransactionCreatePayload,
  ITransactionRepository,
  ITransactionSummary,
  ITransactionUpdatePayload,
} from "@/interfaces";

// Para listagens - apenas dados essenciais
const transactionSummarySelect = {
  id: true,
  amount: true,
  transactionType: true,
  description: true,
  date: true,
};

// Para detalhes da transação - dados essenciais
const transactionDetailSelect = {
  id: true,
  amount: true,
  transactionType: true,
  description: true,
  date: true,
  accountId: true,
  categoryId: true,
};

class TransactionRepository implements ITransactionRepository {
  async findById(id: string): Promise<ITransaction | null> {
    return await prisma.transaction.findUnique({
      where: { id },
      select: transactionDetailSelect,
    });
  }

  async findByAccount(accountId: string): Promise<ITransactionSummary[]> {
    return await prisma.transaction.findMany({
      where: { accountId },
      select: transactionSummarySelect,
      orderBy: { date: "desc" },
    });
  }

  async create(data: ITransactionCreatePayload): Promise<ITransaction> {
    const increment =
      data.transactionType === "INCOME" ? data.amount : -data.amount;

    await prisma.account.update({
      where: { id: data.accountId },
      data: {
        balance: {
          increment,
        },
      },
    });

    return await prisma.transaction.create({
      data,
      select: transactionDetailSelect,
    });
  }

  async update(
    id: string,
    data: ITransactionUpdatePayload
  ): Promise<ITransaction> {
    return await prisma.transaction.update({
      where: { id },
      data,
      select: transactionDetailSelect,
    });
  }

  async delete(id: string): Promise<ITransaction | null> {
    try {
      return await prisma.transaction.delete({
        where: { id },
        select: transactionDetailSelect,
      });
    } catch (error) {
      return null;
    }
  }
}

export default TransactionRepository;
