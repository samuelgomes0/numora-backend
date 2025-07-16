interface IGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: Date | null;
  userId: string;
}

interface IGoalCreatePayload {
  name: string;
  targetAmount: number;
  deadline?: Date | null;
  userId: string;
}

interface IGoalUpdatePayload {
  name?: string;
  targetAmount?: number;
  savedAmount?: number;
  deadline?: Date | null;
}

interface IGoalRepository {
  findById(id: string): Promise<IGoal | null>;
  findByUser(userId: string): Promise<IGoal[]>;
  create(data: IGoalCreatePayload): Promise<IGoal>;
  update(id: string, data: IGoalUpdatePayload): Promise<IGoal>;
  delete(id: string): Promise<IGoal | null>;
}

export { IGoal, IGoalCreatePayload, IGoalRepository, IGoalUpdatePayload };
