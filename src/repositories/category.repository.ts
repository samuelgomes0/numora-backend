import { prisma } from "@/database/prisma-client";
import {
  ICategory,
  ICategoryCreatePayload,
  ICategoryRepository,
  ICategorySummary,
  ICategoryUpdatePayload,
} from "@/interfaces";

const publicCategorySelect = {
  id: true,
  name: true,
};

class CategoryRepository implements ICategoryRepository {
  findAll(): Promise<ICategorySummary[]> {
    return prisma.category.findMany({ select: publicCategorySelect });
  }

  findById(id: string): Promise<ICategory | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  create(category: ICategoryCreatePayload): Promise<ICategory> {
    return prisma.category.create({ data: category });
  }

  update(
    id: string,
    category: ICategoryUpdatePayload
  ): Promise<ICategory | null> {
    return prisma.category.update({
      where: { id },
      data: category,
    });
  }

  delete(id: string): Promise<ICategory | null> {
    return prisma.category.delete({
      where: { id },
    });
  }
}

export default CategoryRepository;
