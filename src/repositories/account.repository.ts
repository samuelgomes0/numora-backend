import { prisma } from "@/database/prisma-client";
import {
  IAccount,
  IAccountCreatePayload,
  IAccountRepository,
  IAccountSummary,
  IAccountUpdatePayload,
} from "@/interfaces";

const publicAccountSelect = {
  id: true,
  name: true,
  balance: true,
};

class AccountRepository implements IAccountRepository {
  findAll(): Promise<IAccountSummary[]> {
    return prisma.account.findMany({ select: publicAccountSelect });
  }

  findById(id: string): Promise<IAccount | null> {
    return prisma.account.findUnique({
      where: { id },
      include: {
        transactions: true,
        categories: true,
      },
    });
  }

  findAccountsByUserId(userId: string): Promise<IAccountSummary[]> {
    return prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        balance: true,
      },
    });
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
