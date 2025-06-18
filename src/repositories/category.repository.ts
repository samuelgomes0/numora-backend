import { prisma } from "@/database/prisma-client";
import {
  ICategory,
  ICategoryCreatePayload,
  ICategoryRepository,
  ICategorySummary,
  ICategoryUpdatePayload,
} from "@/interfaces";

const categorySelect = {
  id: true,
  name: true,
  accountId: true,
};

const categorySummarySelect = {
  id: true,
  name: true,
};

class CategoryRepository implements ICategoryRepository {
  async findAll(): Promise<ICategorySummary[]> {
    return await prisma.category.findMany({
      select: categorySummarySelect,
    });
  }

  async findById(id: string): Promise<ICategory | null> {
    return await prisma.category.findUnique({
      where: { id },
      select: categorySelect,
    });
  }

  async create(data: ICategoryCreatePayload): Promise<ICategory> {
    return await prisma.category.create({
      data,
      select: categorySelect,
    });
  }

  async update(
    id: string,
    data: ICategoryUpdatePayload
  ): Promise<ICategory | null> {
    return await prisma.category.update({
      where: { id },
      data,
      select: categorySelect,
    });
  }

  async delete(id: string): Promise<ICategory | null> {
    return await prisma.category.delete({
      where: { id },
      select: categorySelect,
    });
  }
}

export default CategoryRepository;
