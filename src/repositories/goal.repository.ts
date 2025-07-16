import { prisma } from "@/database/prisma-client";
import {
  IGoal,
  IGoalCreatePayload,
  IGoalRepository,
  IGoalUpdatePayload,
} from "@/interfaces";

// Para listagens - apenas dados essenciais
const goalSummarySelect = {
  id: true,
  name: true,
  targetAmount: true,
  savedAmount: true,
  deadline: true,
  userId: true,
};

// Para detalhes da meta - dados essenciais
const goalDetailSelect = {
  id: true,
  name: true,
  targetAmount: true,
  savedAmount: true,
  deadline: true,
  userId: true,
};

class GoalRepository implements IGoalRepository {
  async findById(id: string): Promise<IGoal | null> {
    return await prisma.goal.findUnique({
      where: { id },
      select: goalDetailSelect,
    });
  }

  async findByUser(userId: string): Promise<IGoal[]> {
    return await prisma.goal.findMany({
      where: { userId },
      select: goalSummarySelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: IGoalCreatePayload): Promise<IGoal> {
    return await prisma.goal.create({
      data,
      select: goalDetailSelect,
    });
  }

  async update(id: string, data: IGoalUpdatePayload): Promise<IGoal> {
    return await prisma.goal.update({
      where: { id },
      data,
      select: goalDetailSelect,
    });
  }

  async delete(id: string): Promise<IGoal | null> {
    try {
      return await prisma.goal.delete({
        where: { id },
        select: goalDetailSelect,
      });
    } catch (error) {
      return null;
    }
  }
}

export default GoalRepository;
