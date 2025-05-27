import { prisma } from "../database/prisma-client";
import { IAccount, IAccountCreate, IAccountRepository } from "../interfaces";

class AccountRepository implements IAccountRepository {
  findAll(): Promise<IAccount[]> {
    return prisma.account.findMany();
  }

  create(data: IAccountCreate): Promise<IAccount> {
    return prisma.account.create({ data });
  }

  async delete(id: string): Promise<void> {
    await prisma.account.delete({
      where: { id },
    });
  }
}

export default AccountRepository;
