import {
  ITransaction,
  ITransactionCreatePayload,
  ITransactionRepository,
  ITransactionSummary,
  ITransactionUpdatePayload,
} from "@/interfaces";

class TransactionUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  findAll(): Promise<ITransactionSummary[]> {
    return this.transactionRepository.findAll();
  }

  findById(id: string): Promise<ITransaction | null> {
    return this.transactionRepository.findById(id);
  }

  async create(data: ITransactionCreatePayload): Promise<ITransaction> {
    if (data.amount <= 0) {
      throw new Error("Amount must be greater than zero.");
    }
    // Opcional: validar se account existe
    // const account = await this.transactionRepository.findAccountById(data.accountId);
    // if (!account) throw new Error("Account does not exist.");

    return this.transactionRepository.create(data);
  }

  async update(
    id: string,
    data: ITransactionUpdatePayload
  ): Promise<ITransaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error("Transaction not found.");
    }
    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error("Amount must be greater than zero.");
    }
    return this.transactionRepository.update(id, data);
  }

  async delete(id: string): Promise<ITransaction | null> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error("Transaction not found.");
    }
    return this.transactionRepository.delete(id);
  }
}

export default TransactionUseCase;
