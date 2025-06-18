import { prisma } from "@/database/prisma-client";
import { IGoalRepository, IGoal, IGoalCreatePayload, IGoalUpdatePayload } from "@/interfaces";

const goalSelect = {
  id: true,
  name: true,
  targetAmount: true,
  savedAmount: true,
  deadline: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
};

class GoalRepository implements IGoalRepository {
  async findById(id: string): Promise<IGoal | null> {
    return await prisma.goal.findUnique({
      where: { id },
      select: goalSelect,
    });
  }

  async findByUser(userId: string): Promise<IGoal[]> {
    return await prisma.goal.findMany({
      where: { userId },
      select: goalSelect,
    });
  }

  async create(data: IGoalCreatePayload): Promise<IGoal> {
    return await prisma.goal.create({
      data,
      select: goalSelect,
    });
  }

  async update(id: string, data: IGoalUpdatePayload): Promise<IGoal> {
    return await prisma.goal.update({
      where: { id },
      data,
      select: goalSelect,
    });
  }

  async delete(id: string): Promise<IGoal | null> {
    return await prisma.goal.delete({
      where: { id },
      select: goalSelect,
    });
  }
}

export default GoalRepository;
