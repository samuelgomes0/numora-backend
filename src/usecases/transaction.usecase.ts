import { ITransaction, ITransactionPayload } from "../interfaces";
import { TransactionRepository } from "../repositories";

class TransactionUseCase implements TransactionRepository {
  private readonly transactionRepository: TransactionRepository;

  constructor(transactionRepository: TransactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async findAll(): Promise<ITransaction[]> {
    const transactions = await this.transactionRepository.findAll();
    return transactions;
  }

  async findById(id: string): Promise<ITransaction | null> {
    const transaction = await this.transactionRepository.findById(id);
    return transaction;
  }

  async create(data: ITransactionPayload): Promise<ITransaction> {
    const { description, amount, date, transactionType, accountId } = data;

    const newTransaction = await this.transactionRepository.create({
      description,
      amount,
      date,
      transactionType,
      accountId,
    });

    return newTransaction;
  }

  async update(
    id: string,
    data: Partial<ITransactionPayload>
  ): Promise<ITransaction> {
    const updatedTransaction = await this.transactionRepository.update(
      id,
      data
    );
    return updatedTransaction;
  }

  async delete(id: string): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}

export default TransactionUseCase;
