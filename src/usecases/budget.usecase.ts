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
    return await this.budgetRepository.create(data);
  }

  async update(id: string, data: IBudgetUpdatePayload): Promise<IBudget> {
    // Como não há `findById`, pode-se presumir existência ou adaptar
    return await this.budgetRepository.update(id, data);
  }

  async delete(id: string): Promise<IBudget> {
    return (await this.budgetRepository.delete(id)) as IBudget;
  }
}

export default BudgetUseCase;
