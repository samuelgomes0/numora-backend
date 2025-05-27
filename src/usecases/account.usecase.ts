import { IAccount, IAccountCreate } from "../interfaces";
import { AccountRepository } from "../repositories";

class AccountUseCase implements AccountRepository {
  private readonly accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }

  findAll(): Promise<IAccount[]> {
    const accounts = this.accountRepository.findAll();
    return accounts;
  }

  create(data: IAccountCreate): Promise<IAccount> {
    const account = this.accountRepository.create(data);
    return account;
  }

  delete(id: string): Promise<void> {
    return this.accountRepository.delete(id);
  }
}

export default AccountUseCase;
