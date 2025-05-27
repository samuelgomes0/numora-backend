interface ICategory {
  id: string;
  name: string;
}

interface ICategoryRepository {
  findAll(): Promise<ICategory[]>;
  create(category: ICategory): Promise<ICategory>;
  update(id: string, category: ICategory): Promise<ICategory | null>;
  delete(id: string): Promise<void>;
}

export { ICategory, ICategoryRepository };
