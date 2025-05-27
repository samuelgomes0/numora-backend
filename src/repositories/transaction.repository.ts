import { prisma } from "../database/prisma-client";
import {
  ITransaction,
  ITransactionPayload,
  ITransactionRepository,
} from "../interfaces";

class TransactionRepository implements ITransactionRepository {
  findAll(): Promise<ITransaction[]> {
    return prisma.transaction.findMany();
  }

  findById(id: string): Promise<ITransaction | null> {
    return prisma.transaction.findUnique({ where: { id } });
  }

  create(data: ITransactionPayload): Promise<ITransaction> {
    return prisma.transaction.create({ data: data });
  }

  update(id: string, data: Partial<ITransaction>): Promise<ITransaction> {
    return prisma.transaction.update({
      where: { id },
      data: data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.transaction.delete({ where: { id } });
  }
}

export default TransactionRepository;
