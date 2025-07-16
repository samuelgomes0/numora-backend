import { prisma } from "@/database/prisma-client";
import {
  ICategory,
  ICategoryCreatePayload,
  ICategoryRepository,
  ICategorySummary,
  ICategoryUpdatePayload,
} from "@/interfaces";

// Para listagens - apenas dados essenciais
const categorySummarySelect = {
  id: true,
  name: true,
};

// Para detalhes da categoria - dados essenciais
const categoryDetailSelect = {
  id: true,
  name: true,
  accountId: true,
};

class CategoryRepository implements ICategoryRepository {
  async findById(id: string): Promise<ICategory | null> {
    return await prisma.category.findUnique({
      where: { id },
      select: categoryDetailSelect,
    });
  }

  async findByAccount(accountId: string): Promise<ICategorySummary[]> {
    return await prisma.category.findMany({
      where: { accountId },
      select: categorySummarySelect,
      orderBy: { name: "asc" },
    });
  }

  async create(data: ICategoryCreatePayload): Promise<ICategory> {
    return await prisma.category.create({
      data,
      select: categoryDetailSelect,
    });
  }

  async update(id: string, data: ICategoryUpdatePayload): Promise<ICategory> {
    return await prisma.category.update({
      where: { id },
      data,
      select: categoryDetailSelect,
    });
  }

  async delete(id: string): Promise<ICategory | null> {
    try {
      return await prisma.category.delete({
        where: { id },
        select: categoryDetailSelect,
      });
    } catch (error) {
      return null;
    }
  }
}

export default CategoryRepository;
