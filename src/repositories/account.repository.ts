import { prisma } from "@/database/prisma-client";
import {
  IAccount,
  IAccountCreatePayload,
  IAccountRepository,
  IAccountSummary,
  IAccountUpdatePayload,
} from "@/interfaces";

// Para listagens - apenas dados essenciais
const accountSummarySelect = {
  id: true,
  name: true,
  balance: true,
};

// Para detalhes da conta - dados essenciais sem informações internas
const accountDetailSelect = {
  id: true,
  name: true,
  balance: true,
};

class AccountRepository implements IAccountRepository {
  async findById(id: string): Promise<IAccount | null> {
    return await prisma.account.findUnique({
      where: { id },
      select: accountDetailSelect,
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
      select: accountDetailSelect,
    });
  }

  async update(id: string, data: IAccountUpdatePayload): Promise<IAccount> {
    return await prisma.account.update({
      where: { id },
      data,
      select: accountDetailSelect,
    });
  }

  async delete(id: string): Promise<IAccount | null> {
    try {
      return await prisma.account.delete({
        where: { id },
        select: accountDetailSelect,
      });
    } catch (error) {
      return null;
    }
  }
}

export default AccountRepository;
