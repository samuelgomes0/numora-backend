import { prisma } from "@/database/prisma-client";
import {
  IAccount,
  IAccountCreatePayload,
  IAccountRepository,
  IAccountSummary,
  IAccountUpdatePayload,
} from "@/interfaces";

class AccountRepository implements IAccountRepository {
  findById(id: string): Promise<IAccount | null> {
    return prisma.account.findUnique({
      where: { id },
      include: {
        transactions: true,
        categories: true,
      },
    });
  }

  findByUser(userId: string): Promise<IAccountSummary[]> {
    return prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        balance: true,
      },
    });
  }

  async getBalance(id: string): Promise<number | null> {
    const account = await prisma.account.findUnique({
      where: { id },
      select: { balance: true },
    });

    return account ? account.balance : null;
  }

  create(data: IAccountCreatePayload): Promise<IAccount> {
    return prisma.account.create({ data });
  }

  update(id: string, data: IAccountUpdatePayload): Promise<IAccount | null> {
    return prisma.account.update({
      where: { id },
      data,
      include: {
        transactions: true,
        categories: true,
      },
    });
  }

  delete(id: string): Promise<IAccount | null> {
    return prisma.account.delete({
      where: { id },
    });
  }
}

export default AccountRepository;
