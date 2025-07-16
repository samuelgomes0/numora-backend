import { prisma } from "@/database/prisma-client";
import {
  IBudget,
  IBudgetCreatePayload,
  IBudgetRepository,
  IBudgetUpdatePayload,
} from "@/interfaces";

// Para listagens - apenas dados essenciais
const budgetSummarySelect = {
  id: true,
  categoryId: true,
  month: true,
  year: true,
  limit: true,
  userId: true,
};

// Para detalhes do orçamento - dados essenciais
const budgetDetailSelect = {
  id: true,
  categoryId: true,
  month: true,
  year: true,
  limit: true,
  userId: true,
};

class BudgetRepository implements IBudgetRepository {
  async findById(id: string): Promise<IBudget | null> {
    return await prisma.budget.findUnique({
      where: { id },
      select: budgetDetailSelect,
    });
  }

  async findByUser(userId: string): Promise<IBudget[]> {
    return await prisma.budget.findMany({
      where: { userId },
      select: budgetSummarySelect,
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
  }

  async create(data: IBudgetCreatePayload): Promise<IBudget> {
    return await prisma.budget.create({
      data,
      select: budgetDetailSelect,
    });
  }

  async update(id: string, data: IBudgetUpdatePayload): Promise<IBudget> {
    return await prisma.budget.update({
      where: { id },
      data,
      select: budgetDetailSelect,
    });
  }

  async delete(id: string): Promise<IBudget | null> {
    try {
      return await prisma.budget.delete({
        where: { id },
        select: budgetDetailSelect,
      });
    } catch (error) {
      return null;
    }
  }
}

export default BudgetRepository;
