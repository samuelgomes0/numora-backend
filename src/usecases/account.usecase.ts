import {
  IAccount,
  IAccountCreatePayload,
  IAccountRepository,
  IAccountSummary,
  IAccountUpdatePayload,
} from "@/interfaces";

class AccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  findById(id: string): Promise<IAccount | null> {
    return this.accountRepository.findById(id);
  }

  findByUser(userId: string): Promise<IAccountSummary[]> {
    return this.accountRepository.findByUser(userId);
  }

  async getBalance(id: string): Promise<number | null> {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new Error("Account not found.");
    }
    return this.accountRepository.getBalance(id);
  }

  async create(data: IAccountCreatePayload): Promise<IAccount> {
    const existingAccounts = await this.accountRepository.findByUser(
      data.userId
    );
    const nameExists = existingAccounts.some((acc) => acc.name === data.name);
    if (nameExists) {
      throw new Error("Account name already exists for this user.");
    }
    return this.accountRepository.create(data);
  }

  async update(
    id: string,
    data: IAccountUpdatePayload
  ): Promise<IAccount | null> {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new Error("Account not found.");
    }
    return this.accountRepository.update(id, data);
  }

  async delete(id: string): Promise<IAccount | null> {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new Error("Account not found.");
    }
    if (account.transactions && account.transactions.length > 0) {
      throw new Error("Cannot delete account with existing transactions.");
    }
    return this.accountRepository.delete(id);
  }
}

export default AccountUseCase;
