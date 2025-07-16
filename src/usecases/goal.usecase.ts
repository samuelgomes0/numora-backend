import {
  IGoal,
  IGoalCreatePayload,
  IGoalRepository,
  IGoalUpdatePayload,
} from "@/interfaces";

class GoalUseCase {
  constructor(private readonly goalRepository: IGoalRepository) {
    this.goalRepository = goalRepository;
  }

  async findById(id: string): Promise<IGoal | null> {
    return await this.goalRepository.findById(id);
  }

  async findByUser(userId: string): Promise<IGoal[]> {
    return await this.goalRepository.findByUser(userId);
  }

  async create(data: IGoalCreatePayload): Promise<IGoal> {
    if (data.targetAmount <= 0) {
      throw new Error("O valor alvo deve ser maior que zero.");
    }

    return await this.goalRepository.create(data);
  }

  async update(id: string, data: IGoalUpdatePayload): Promise<IGoal> {
    const goal = await this.goalRepository.findById(id);
    if (!goal) {
      throw new Error("Meta não encontrada.");
    }

    if (data.targetAmount !== undefined && data.targetAmount <= 0) {
      throw new Error("O valor alvo deve ser maior que zero.");
    }

    const updatedGoal = await this.goalRepository.update(id, data);
    if (!updatedGoal) {
      throw new Error("Meta não encontrada.");
    }

    return updatedGoal;
  }

  async delete(id: string): Promise<IGoal> {
    const goal = await this.goalRepository.findById(id);
    if (!goal) {
      throw new Error("Meta não encontrada.");
    }

    const deletedGoal = await this.goalRepository.delete(id);
    if (!deletedGoal) {
      throw new Error("Meta não encontrada.");
    }

    return deletedGoal;
  }
}

export default GoalUseCase;
