import {
  ITransaction,
  ITransactionCreatePayload,
  ITransactionRepository,
  ITransactionSummary,
  ITransactionUpdatePayload,
} from "@/interfaces";

class TransactionUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async findById(id: string): Promise<ITransaction | null> {
    return await this.transactionRepository.findById(id);
  }

  async findByAccount(accountId: string): Promise<ITransactionSummary[]> {
    return await this.transactionRepository.findByAccount(accountId);
  }

  async create(data: ITransactionCreatePayload): Promise<ITransaction> {
    if (data.amount <= 0) {
      throw new Error("O valor da transação deve ser maior que zero.");
    }

    return await this.transactionRepository.create(data);
  }

  async update(id: string, data: ITransactionUpdatePayload): Promise<ITransaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error("Transação não encontrada.");
    }

    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error("O valor da transação deve ser maior que zero.");
    }

    return await this.transactionRepository.update(id, data);
  }

  async delete(id: string): Promise<ITransaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new Error("Transação não encontrada.");
    }

    return (await this.transactionRepository.delete(id)) as ITransaction;
  }
}

export default TransactionUseCase;
