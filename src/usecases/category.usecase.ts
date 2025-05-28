import {
  ICategory,
  ICategoryCreatePayload,
  ICategoryRepository,
  ICategorySummary,
  ICategoryUpdatePayload,
} from "@/interfaces";

class CategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  findAll(): Promise<ICategorySummary[]> {
    return this.categoryRepository.findAll();
  }

  findById(id: string): Promise<ICategory | null> {
    return this.categoryRepository.findById(id);
  }

  create(data: ICategoryCreatePayload): Promise<ICategory> {
    return this.categoryRepository.create(data);
  }

  async update(
    id: string,
    data: ICategoryUpdatePayload
  ): Promise<ICategory | null> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Category not found.");
    }
    return this.categoryRepository.update(id, data);
  }

  async delete(id: string): Promise<ICategory | null> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Category not found.");
    }
    // Opcional: validar se a categoria tem transações associadas
    return this.categoryRepository.delete(id);
  }
}

export default CategoryUseCase;
