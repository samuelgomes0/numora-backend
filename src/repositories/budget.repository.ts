import { prisma } from "@/database/prisma-client";
import {
  IBudget,
  IBudgetCreatePayload,
  IBudgetRepository,
  IBudgetUpdatePayload,
} from "@/interfaces";

const budgetSelect = {
  id: true,
  categoryId: true,
  month: true,
  year: true,
  limit: true,
};

class BudgetRepository implements IBudgetRepository {
  async findByUser(userId: string): Promise<IBudget[]> {
    return await prisma.budget.findMany({
      where: { userId },
      select: budgetSelect,
    });
  }

  async create(data: IBudgetCreatePayload): Promise<IBudget> {
    return await prisma.budget.create({
      data,
      select: budgetSelect,
    });
  }

  async update(id: string, data: IBudgetUpdatePayload): Promise<IBudget> {
    return await prisma.budget.update({
      where: { id },
      data,
      select: budgetSelect,
    });
  }

  async delete(id: string): Promise<IBudget | null> {
    return await prisma.budget.delete({
      where: { id },
      select: budgetSelect,
    });
  }
}

export default BudgetRepository;
