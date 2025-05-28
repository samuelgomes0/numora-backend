interface ICategory {
  id: string;
  name: string;
  accountId: string;
}

interface ICategorySummary {
  id: string;
  name: string;
}

interface ICategoryCreatePayload {
  name: string;
  accountId: string;
}

interface ICategoryUpdatePayload {
  name?: string;
}

interface ICategoryRepository {
  findAll(): Promise<ICategorySummary[]>;
  findById(id: string): Promise<ICategory | null>;
  create(category: ICategoryCreatePayload): Promise<ICategory>;
  update(
    id: string,
    category: ICategoryUpdatePayload
  ): Promise<ICategory | null>;
  delete(id: string): Promise<ICategory | null>;
}

export {
  ICategory,
  ICategoryCreatePayload,
  ICategoryRepository,
  ICategorySummary,
  ICategoryUpdatePayload,
};
