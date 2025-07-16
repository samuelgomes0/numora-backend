import {
  IRecurringTransaction,
  IRecurringTransactionCreatePayload,
  IRecurringTransactionRepository,
  IRecurringTransactionUpdatePayload,
} from "@/interfaces";

class RecurringTransactionUseCase {
  constructor(
    private readonly recurringTransactionRepository: IRecurringTransactionRepository
  ) {
    this.recurringTransactionRepository = recurringTransactionRepository;
  }

  async findByAccount(accountId: string): Promise<IRecurringTransaction[]> {
    return await this.recurringTransactionRepository.findByAccount(accountId);
  }

  async create(
    data: IRecurringTransactionCreatePayload
  ): Promise<IRecurringTransaction> {
    if (data.amount <= 0) {
      throw new Error("O valor da transação deve ser maior que zero.");
    }

    return await this.recurringTransactionRepository.create(data);
  }

  async update(
    id: string,
    data: IRecurringTransactionUpdatePayload
  ): Promise<IRecurringTransaction> {
    const updatedTransaction = await this.recurringTransactionRepository.update(
      id,
      data
    );
    if (!updatedTransaction) {
      throw new Error("Transação recorrente não encontrada.");
    }

    return updatedTransaction;
  }

  async delete(id: string): Promise<IRecurringTransaction> {
    const deletedTransaction = await this.recurringTransactionRepository.delete(
      id
    );
    if (!deletedTransaction) {
      throw new Error("Transação recorrente não encontrada.");
    }

    return deletedTransaction;
  }
}

export default RecurringTransactionUseCase;
