import {
  IBudget,
  IBudgetCreatePayload,
  IBudgetRepository,
  IBudgetUpdatePayload,
} from "@/interfaces";

class BudgetUseCase {
  constructor(private readonly budgetRepository: IBudgetRepository) {
    this.budgetRepository = budgetRepository;
  }

  async findByUser(userId: string): Promise<IBudget[]> {
    return await this.budgetRepository.findByUser(userId);
  }

  async create(data: IBudgetCreatePayload): Promise<IBudget> {
    if (data.limit <= 0) {
      throw new Error("O limite do orçamento deve ser maior que zero.");
    }

    return await this.budgetRepository.create(data);
  }

  async update(id: string, data: IBudgetUpdatePayload): Promise<IBudget> {
    if (data.limit !== undefined && data.limit <= 0) {
      throw new Error("O limite do orçamento deve ser maior que zero.");
    }

    const updatedBudget = await this.budgetRepository.update(id, data);
    if (!updatedBudget) {
      throw new Error("Orçamento não encontrado.");
    }

    return updatedBudget;
  }

  async delete(id: string): Promise<IBudget> {
    const deletedBudget = await this.budgetRepository.delete(id);
    if (!deletedBudget) {
      throw new Error("Orçamento não encontrado.");
    }

    return deletedBudget;
  }
}

export default BudgetUseCase;
