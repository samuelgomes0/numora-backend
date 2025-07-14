import { prisma } from "@/database/prisma-client";
import {
  IAccount,
  IAccountCreatePayload,
  IAccountRepository,
  IAccountSummary,
  IAccountUpdatePayload,
} from "@/interfaces";

const accountSelect = {
  id: true,
  name: true,
  balance: true,
};

const accountSummarySelect = {
  id: true,
  name: true,
  balance: true,
};

class AccountRepository implements IAccountRepository {
  async findById(id: string): Promise<IAccount | null> {
    return await prisma.account.findUnique({
      where: { id },
      select: accountSelect,
    });
  }

  async findByUser(userId: string): Promise<IAccountSummary[]> {
    return await prisma.account.findMany({
      where: { userId },
      select: accountSummarySelect,
    });
  }

  async getBalance(id: string): Promise<number | null> {
    const account = await prisma.account.findUnique({
      where: { id },
      select: { balance: true },
    });

    return account?.balance ?? null;
  }

  async create(data: IAccountCreatePayload): Promise<IAccount> {
    return await prisma.account.create({
      data,
      select: accountSelect,
    });
  }

  async update(
    id: string,
    data: IAccountUpdatePayload
  ): Promise<IAccount | null> {
    return await prisma.account.update({
      where: { id },
      data,
      select: accountSelect,
    });
  }

  async delete(id: string): Promise<IAccount | null> {
    return await prisma.account.delete({
      where: { id },
      select: accountSelect,
    });
  }
}

export default AccountRepository;
