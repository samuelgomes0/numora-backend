interface IBudget {
  id: string;
  categoryId: string;
  month: number;
  year: number;
  limit: number;
  userId: string;
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
  findById(id: string): Promise<IBudget | null>;
  findByUser(userId: string): Promise<IBudget[]>;
  create(data: IBudgetCreatePayload): Promise<IBudget>;
  update(id: string, data: IBudgetUpdatePayload): Promise<IBudget>;
  delete(id: string): Promise<IBudget | null>;
}

export {
  IBudget,
  IBudgetCreatePayload,
  IBudgetRepository,
  IBudgetUpdatePayload,
};
