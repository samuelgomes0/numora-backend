import { IBudgetRepository } from "@/interfaces";
import { BudgetUseCase } from "@/usecases";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockBudgetRepo = {
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn(),
  findBudgetsByAccountId: vi.fn().mockResolvedValue([]),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
} as unknown as IBudgetRepository;

describe("BudgetUseCase", () => {
  let budgetUseCase: BudgetUseCase;

  beforeEach(() => {
    budgetUseCase = new BudgetUseCase(mockBudgetRepo);
    vi.clearAllMocks();
  });

  it("should return all budgets", async () => {
    const mockBudgets = [
      { id: "1", name: "Groceries", amount: 500, accountId: "a1" },
      { id: "2", name: "Entertainment", amount: 200, accountId: "a1" },
    ];
    mockBudgetRepo.findAll = vi.fn().mockResolvedValue(mockBudgets);

    const budgets = await budgetUseCase.findAll();

    expect(budgets).toEqual(mockBudgets);
    expect(mockBudgetRepo.findAll).toHaveBeenCalledOnce();
  });

  it("should find budget by id", async () => {
    const mockBudget = {
      id: "1",
      name: "Groceries",
      amount: 500,
      accountId: "a1",
    };
    mockBudgetRepo.findById = vi.fn().mockResolvedValue(mockBudget);

    const budget = await budgetUseCase.findById("1");

    expect(budget).toEqual(mockBudget);
    expect(mockBudgetRepo.findById).toHaveBeenCalledWith("1");
  });

  it("should return null when budget not found by id", async () => {
    mockBudgetRepo.findById = vi.fn().mockResolvedValue(null);

    const budget = await budgetUseCase.findById("999");

    expect(budget).toBeNull();
    expect(mockBudgetRepo.findById).toHaveBeenCalledWith("999");
  });

  it("should find budgets by account id", async () => {
    const mockBudgets = [
      { id: "1", name: "Groceries", amount: 500, accountId: "a1" },
      { id: "2", name: "Entertainment", amount: 200, accountId: "a1" },
    ];
    mockBudgetRepo.findBudgetsByAccountId = vi
      .fn()
      .mockResolvedValue(mockBudgets);

    const budgets = await budgetUseCase.findByAccount("a1");

    expect(budgets).toEqual(mockBudgets);
    expect(mockBudgetRepo.findBudgetsByAccountId).toHaveBeenCalledWith("a1");
  });

  it("should create budget successfully", async () => {
    const mockCreatedBudget = {
      id: "1",
      name: "Groceries",
      amount: 500,
      accountId: "a1",
    };
    mockBudgetRepo.findBudgetsByAccountId = vi.fn().mockResolvedValue([]);
    mockBudgetRepo.create = vi.fn().mockResolvedValue(mockCreatedBudget);

    const budget = await budgetUseCase.create({
      accountId: "a1",
      name: "Groceries",
      amount: 500,
    });

    expect(budget).toEqual(mockCreatedBudget);
    expect(mockBudgetRepo.create).toHaveBeenCalledWith({
      accountId: "a1",
      name: "Groceries",
      amount: 500,
    });
  });

  it("should throw error if budget name already exists for account", async () => {
    const existingBudgets = [
      { id: "1", name: "Groceries", amount: 500, accountId: "a1" },
    ];
    mockBudgetRepo.findBudgetsByAccountId = vi
      .fn()
      .mockResolvedValue(existingBudgets);

    await expect(
      budgetUseCase.create({ accountId: "a1", name: "Groceries", amount: 600 })
    ).rejects.toThrow("Budget name already exists for this account.");
  });

  it("should update budget successfully", async () => {
    const mockUpdatedBudget = {
      id: "1",
      name: "Groceries Updated",
      amount: 600,
      accountId: "a1",
    };
    mockBudgetRepo.findById = vi.fn().mockResolvedValue(mockUpdatedBudget);
    mockBudgetRepo.findBudgetsByAccountId = vi.fn().mockResolvedValue([]);
    mockBudgetRepo.update = vi.fn().mockResolvedValue(mockUpdatedBudget);

    const budget = await budgetUseCase.update("1", {
      name: "Groceries Updated",
      amount: 600,
    });

    expect(budget).toEqual(mockUpdatedBudget);
    expect(mockBudgetRepo.update).toHaveBeenCalledWith("1", {
      name: "Groceries Updated",
      amount: 600,
    });
  });

  it("should throw error when updating non-existent budget", async () => {
    mockBudgetRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(
      budgetUseCase.update("999", { name: "Updated" })
    ).rejects.toThrow("Budget not found");
  });

  it("should throw error when updating with existing name for same account", async () => {
    const existingBudget = {
      id: "1",
      name: "Groceries",
      amount: 500,
      accountId: "a1",
    };
    const conflictingBudgets = [
      { id: "2", name: "Groceries Updated", amount: 600, accountId: "a1" },
    ];
    mockBudgetRepo.findById = vi.fn().mockResolvedValue(existingBudget);
    mockBudgetRepo.findBudgetsByAccountId = vi
      .fn()
      .mockResolvedValue(conflictingBudgets);

    await expect(
      budgetUseCase.update("1", { name: "Groceries Updated", amount: 600 })
    ).rejects.toThrow("Budget name already exists for this account.");
  });

  it("should delete budget successfully", async () => {
    const mockBudget = {
      id: "1",
      name: "Groceries",
      amount: 500,
      accountId: "a1",
    };
    mockBudgetRepo.findById = vi.fn().mockResolvedValue(mockBudget);
    mockBudgetRepo.delete = vi.fn().mockResolvedValue(mockBudget);

    const deletedBudget = await budgetUseCase.delete("1");

    expect(deletedBudget).toEqual(mockBudget);
    expect(mockBudgetRepo.delete).toHaveBeenCalledWith("1");
  });

  it("should throw error when deleting non-existent budget", async () => {
    mockBudgetRepo.findById = vi.fn().mockResolvedValue(null);

    await expect(budgetUseCase.delete("999")).rejects.toThrow(
      "Budget not found"
    );
  });
});
