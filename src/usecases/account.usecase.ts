import {
  IAccount,
  IAccountCreatePayload,
  IAccountRepository,
  IAccountSummary,
  IAccountUpdatePayload,
} from "@/interfaces";

class AccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {
    this.accountRepository = accountRepository;
  }

  async findById(id: string): Promise<IAccount | null> {
    return await this.accountRepository.findById(id);
  }

  async findByUser(userId: string): Promise<IAccountSummary[]> {
    return await this.accountRepository.findByUser(userId);
  }

  async getBalance(id: string): Promise<number> {
    const balance = await this.accountRepository.getBalance(id);
    if (balance === null) {
      throw new Error("Conta não encontrada.");
    }
    return balance;
  }

  async create(data: IAccountCreatePayload): Promise<IAccount> {
    const existing = await this.accountRepository.findByUser(data.userId);
    const duplicate = existing.some((acc) => acc.name === data.name);

    if (duplicate) {
      throw new Error("Já existe uma conta com esse nome para este usuário.");
    }

    return await this.accountRepository.create(data);
  }

  async update(id: string, data: IAccountUpdatePayload): Promise<IAccount> {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new Error("Conta não encontrada.");
    }

    return (await this.accountRepository.update(id, data)) as IAccount;
  }

  async delete(id: string): Promise<IAccount> {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new Error("Conta não encontrada.");
    }

    return (await this.accountRepository.delete(id)) as IAccount;
  }
}

export default AccountUseCase;
