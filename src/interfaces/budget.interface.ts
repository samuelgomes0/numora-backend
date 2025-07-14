interface IBudget {
  id: string;
  categoryId: string;
  month: number;
  year: number;
  limit: number;
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
