interface IBudget {
  id: string;
  userId: string;
  categoryId: string;
  month: number;
  year: number;
  limit: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IBudgetCreatePayload {
  userId: string;
  categoryId: string;
  month: number;
  year: number;
  limit: number;
}

interface IBudgetUpdatePayload {
  limit?: number;
}

interface IBudgetRepository {
  findByUser(userId: string): Promise<IBudget[]>;
  create(data: IBudgetCreatePayload): Promise<IBudget>;
  update(id: string, data: IBudgetUpdatePayload): Promise<IBudget>;
  delete(id: string): Promise<IBudget | null>;
}

export { IBudget, IBudgetCreatePayload, IBudgetRepository, IBudgetUpdatePayload };
