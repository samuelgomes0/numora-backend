import {
  ICategory,
  ICategoryCreatePayload,
  ICategoryRepository,
  ICategorySummary,
  ICategoryUpdatePayload,
} from "@/interfaces";

class CategoryUseCase {
  constructor(private readonly categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async findById(id: string): Promise<ICategory | null> {
    return await this.categoryRepository.findById(id);
  }

  async findByAccount(accountId: string): Promise<ICategorySummary[]> {
    return await this.categoryRepository.findByAccount(accountId);
  }

  async create(data: ICategoryCreatePayload): Promise<ICategory> {
    return await this.categoryRepository.create(data);
  }

  async update(id: string, data: ICategoryUpdatePayload): Promise<ICategory> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    return (await this.categoryRepository.update(id, data)) as ICategory;
  }

  async delete(id: string): Promise<ICategory> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    // Se desejar verificar se existem transações atreladas à categoria:
    // Ex: if (await this.categoryRepository.hasTransactions(id)) { ... }

    return (await this.categoryRepository.delete(id)) as ICategory;
  }
}

export default CategoryUseCase;
