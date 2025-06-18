import { IGoal, IGoalCreatePayload, IGoalRepository, IGoalUpdatePayload } from "@/interfaces";

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
    return await this.goalRepository.create(data);
  }

  async update(id: string, data: IGoalUpdatePayload): Promise<IGoal> {
    const goal = await this.goalRepository.findById(id);
    if (!goal) {
      throw new Error("Meta não encontrada.");
    }

    return await this.goalRepository.update(id, data);
  }

  async delete(id: string): Promise<IGoal> {
    const goal = await this.goalRepository.findById(id);
    if (!goal) {
      throw new Error("Meta não encontrada.");
    }

    return (await this.goalRepository.delete(id)) as IGoal;
  }
}

export default GoalUseCase;
